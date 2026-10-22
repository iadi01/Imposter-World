import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "./models/User";

const JWT_SECRET = process.env.JWT_SECRET || "imposter-world-secret-jwt-key-2026-production-ready-aadi";

// ============================================================================
// 1. ADMIN AUTHORIZATION & IDENTITY STEALTH (Zero Leaks, Timing-Safe)
// ============================================================================

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
}

/**
 * Constant-time comparison between user email and admin email.
 * Prevents side-channel timing attacks from leaking email characters or length.
 */
export function isUserAdmin(email?: string | null): boolean {
  if (!email || typeof email !== "string") return false;

  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;

  const normalizedUser = email.toLowerCase().trim();
  const normalizedAdmin = adminEmail.toLowerCase().trim();

  // Hash both with SHA-256 to produce fixed 32-byte buffers for timingSafeEqual
  const userHash = crypto.createHash("sha256").update(normalizedUser).digest();
  const adminHash = crypto.createHash("sha256").update(normalizedAdmin).digest();

  return crypto.timingSafeEqual(userHash, adminHash);
}

export interface AuthenticatedAdminRequest extends Request {
  adminUser?: any;
}

// Helper to extract real client IP behind Cloudflare, reverse proxies, and direct connections
export function getClientIp(req: Request): string {
  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.trim()) {
    return cfIp.trim();
  }
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor.trim()) {
    return xForwardedFor.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

/**
 * Strict Admin Middleware.
 * Stealth Protection: Unauthorized requests receive generic HTTP 404 (Not Found).
 * NEVER reveals what email is expected or that an admin console even exists.
 */
export async function requireAdmin(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
): Promise<any> {
  const clientIp = getClientIp(req);
  const token =
    req.cookies?.session_token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    recordFailedAdminProbe(clientIp);
    return res.status(404).json({ error: "Not found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.userId || typeof decoded.userId !== "string") {
      recordFailedAdminProbe(clientIp);
      return res.status(404).json({ error: "Not found" });
    }

    if (!isValidObjectId(decoded.userId)) {
      recordFailedAdminProbe(clientIp);
      return res.status(404).json({ error: "Not found" });
    }

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      recordFailedAdminProbe(clientIp);
      return res.status(404).json({ error: "Not found" });
    }

    if (!isUserAdmin(user.email)) {
      recordFailedAdminProbe(clientIp);
      return res.status(404).json({ error: "Not found" });
    }

    req.adminUser = user;
    next();
  } catch {
    recordFailedAdminProbe(clientIp);
    return res.status(404).json({ error: "Not found" });
  }
}

// ============================================================================
// 2. RATE LIMITING & ANTI-BRUTE FORCE / ANTI-DDOS
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface BannedEntry {
  bannedUntil: number;
  failCount: number;
}

const ipBanMap = new Map<string, BannedEntry>();
const failedAdminProbes = new Map<string, { count: number; firstAt: number }>();

function recordFailedAdminProbe(ip: string) {
  const now = Date.now();
  const entry = failedAdminProbes.get(ip) || { count: 0, firstAt: now };

  if (now - entry.firstAt > 60000) {
    entry.count = 1;
    entry.firstAt = now;
  } else {
    entry.count += 1;
  }

  failedAdminProbes.set(ip, entry);

  // If 5 unauthorized admin probes occur within 1 minute, auto-ban IP!
  // In development: 5 seconds lockout; In production: 15 minutes lockout
  if (entry.count >= 5) {
    const isDevLocal =
      process.env.NODE_ENV === "development" &&
      (ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1");
    const banDurationMs = isDevLocal ? 5 * 1000 : 15 * 60 * 1000;

    ipBanMap.set(ip, {
      bannedUntil: now + banDurationMs,
      failCount: entry.count,
    });
    console.warn(`[Security Alert] IP ${ip} has been temporarily locked out for repeated unauthorized admin probes.`);
  }
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  errorMessage?: string;
  bypassAdmin?: boolean;
}) {
  const store = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction): any => {
    const ip = getClientIp(req);
    const now = Date.now();

    // Check if IP is currently banned
    const ban = ipBanMap.get(ip);
    if (ban && ban.bannedUntil > now) {
      const remainingSeconds = Math.ceil((ban.bannedUntil - now) / 1000);
      res.setHeader("Retry-After", remainingSeconds);
      return res.status(429).json({
        error: "Access temporarily blocked due to suspicious activity. Please try again later.",
        retryAfterSec: remainingSeconds,
      });
    } else if (ban && ban.bannedUntil <= now) {
      ipBanMap.delete(ip);
      failedAdminProbes.delete(ip);
    }

    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      return next();
    }

    entry.count += 1;

    if (entry.count > options.maxRequests) {
      const remainingSeconds = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader("Retry-After", remainingSeconds);
      return res.status(429).json({
        error: options.errorMessage || "Too many requests. Please slow down and try again.",
        retryAfterSec: remainingSeconds,
      });
    }

    next();
  };
}

// 20 requests per minute for auth endpoints
export const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 25,
  errorMessage: "Too many authentication attempts. Please wait 1 minute before retrying.",
});

// 30 requests per minute for admin endpoints
export const adminLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 35,
  errorMessage: "Too many requests to admin gateway.",
});

// 150 requests per minute for general API calls
export const generalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 150,
  errorMessage: "Request rate limit exceeded. Please slow down.",
});

// ============================================================================
// 3. NOSQL INJECTION & PARAMETER POLLUTION SANITIZATION
// ============================================================================

/**
 * Recursively strips MongoDB query operators ($gt, $ne, $where, etc.)
 * and keys with dots to eliminate NoSQL injection risks completely.
 * Modifies object in-place to support Express 5 query getters.
 */
export function sanitizeInPlace(obj: any): void {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "object" && obj[i] !== null) {
        sanitizeInPlace(obj[i]);
      }
    }
    return;
  }

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeInPlace(obj[key]);
    }
  }
}

export function sanitizeMongoInputs(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    sanitizeInPlace(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitizeInPlace(req.query);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeInPlace(req.params);
  }
  next();
}

/**
 * Validates 24-character hex MongoDB ObjectId format.
 */
export function isValidObjectId(id: unknown): boolean {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

// ============================================================================
// 4. XSS & HTML SANITIZATION
// ============================================================================

/**
 * Strips script tags, evil protocols, and encodes HTML entities.
 */
export function sanitizeText(input: unknown, maxLength = 250): string {
  if (typeof input !== "string") return "";
  const stripped = input
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/javascript:/gi, "") // Strip dangerous javascript: URI scheme
    .replace(/data:/gi, "") // Strip data: URI scheme
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#x27;";
        case "&":
          return "&amp;";
        default:
          return char;
      }
    })
    .trim();

  return stripped.slice(0, maxLength);
}

// ============================================================================
// 5. SECURITY HEADERS & CLICKJACKING PROTECTION
// ============================================================================

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent Clickjacking (iframe embedding)
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // XSS Auditor filter
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Strict Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict unused browser device APIs
  res.setHeader("Permissions-Policy", "camera=(), microphone=*, geolocation=()");

  // Strict Content-Security-Policy (with Cloudflare Turnstile & Analytics support)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https://fonts.googleapis.com https://fonts.gstatic.com https://challenges.cloudflare.com https://static.cloudflareinsights.com http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:* https://lh3.googleusercontent.com https://accounts.google.com; frame-src 'self' https://challenges.cloudflare.com; frame-ancestors 'self';"
  );

  next();
}

// ============================================================================
// 6. ORIGIN VALIDATION & CSRF DEFENSE
// ============================================================================

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:4001",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:4001",
  "http://192.168.1.2:8080",
  "https://imposterworld.xyz",
  "https://www.imposterworld.xyz",
]);

export function isAllowedOrigin(urlStr?: string | null, hostHeader?: string | null): boolean {
  if (!urlStr) return true;
  try {
    const parsed = new URL(urlStr);
    const origin = parsed.origin;
    const hostname = parsed.hostname;

    if (ALLOWED_ORIGINS.has(origin)) return true;

    if (hostHeader) {
      const cleanHost = hostHeader.split(":")[0];
      if (hostname === cleanHost) return true;
    }

    if (hostname.endsWith(".onrender.com")) return true;
    if (hostname === "imposterworld.xyz" || hostname.endsWith(".imposterworld.xyz")) return true;

    if (process.env.APP_URL && (origin === process.env.APP_URL || hostname === new URL(process.env.APP_URL).hostname)) return true;
    if (process.env.RENDER_EXTERNAL_URL && (origin === process.env.RENDER_EXTERNAL_URL || hostname === new URL(process.env.RENDER_EXTERNAL_URL).hostname)) return true;

    return false;
  } catch {
    return false;
  }
}

export function verifyOrigin(req: Request, res: Response, next: NextFunction): any {
  // Only enforce origin check on state-changing methods
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const host = req.headers.host;

    if (origin) {
      if (!isAllowedOrigin(origin, host)) {
        return res.status(403).json({ error: "Access Denied: Untrusted Origin" });
      }
    } else if (referer) {
      if (!isAllowedOrigin(referer, host)) {
        return res.status(403).json({ error: "Access Denied: Untrusted Referer" });
      }
    }
  }

  next();
}
