import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { connectDB } from "./db";
import { seedWordPairsIfEmpty } from "./game/words";
import authRoutes from "./auth";
import apiRoutes from "./routes";
import adminRoutes from "./admin";
import { setupSocketServer } from "./socket";
import { securityHeaders, sanitizeMongoInputs, verifyOrigin, isAllowedOrigin } from "./security";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// 0. Enable Trust Proxy for Cloudflare & Reverse Proxies (Accurate Real IPs & HTTPS detection)
app.set("trust proxy", true);

// 1. Disable server fingerprinting
app.disable("x-powered-by");

// 2. HTTP Security Headers (Helmet style: CSP, nosniff, SAMEORIGIN, XSS protection)
app.use(securityHeaders);

// 3. Dynamic & Flexible CORS Whitelisting
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Unauthorized origin"));
      }
    },
    credentials: true,
  })
);

// 4. Origin & Referer Verification for CSRF Defense
app.use(verifyOrigin);

// 5. Payload size limiting to prevent buffer/memory exhaustion attacks
app.use(express.json({ limit: "250kb" }));
app.use(express.urlencoded({ extended: true, limit: "250kb" }));

// 6. NoSQL Injection & Query Pollution Sanitizer
app.use(sanitizeMongoInputs);

app.use(cookieParser());

// 7. API Routes & Auth Aliases (Both /api/auth and /auth supported)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", apiRoutes);

// Production-Ready Health Check Endpoint for Render & UptimeRobot Monitoring
// Responds instantly with HTTP 200 and fresh ISO timestamp to keep instance warm
app.get(["/health", "/api/health"], (_req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Dynamic Sitemap Generator (Always matches current requested host to eliminate Google Search Console errors)
app.get("/sitemap.xml", (req: Request, res: Response) => {
  const publicSitemap = path.resolve(publicDir, "sitemap.xml");
  const fallbackSitemap = path.resolve(projectRoot, "public/sitemap.xml");
  const sitemapPath = fs.existsSync(publicSitemap) ? publicSitemap : fallbackSitemap;

  if (!fs.existsSync(sitemapPath)) {
    return res.status(404).send("Sitemap not found");
  }

  const host = req.get("host") || "imposter-world.onrender.com";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = isLocal ? "http" : (req.get("x-forwarded-proto") === "http" ? "http" : "https");
  const baseUrl = isLocal ? `${protocol}://${host}` : `https://${host}`;

  let xml = fs.readFileSync(sitemapPath, "utf-8");
  xml = xml.replace(/https?:\/\/(imposterworld\.xyz|imposter-world\.onrender\.com)/g, baseUrl);

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

// 8. Serve Client Static Assets (from .output/public)
const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.resolve(projectRoot, ".output/public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir, { maxAge: "1d", index: false }));
}

// 9. TanStack Start SSR Handler (Nitro Middleware)
const ssrIndexPath = path.resolve(projectRoot, ".output/server/index.mjs");
if (fs.existsSync(ssrIndexPath)) {
  try {
    const { middleware } = await import(ssrIndexPath);
    if (middleware) {
      app.use(async (req, res, next) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/health") || req.path === "/sitemap.xml" || req.path.startsWith("/socket.io")) {
          return next();
        }
        try {
          await middleware(req, res);
        } catch (err) {
          next(err);
        }
      });
    }
  } catch (err) {
    console.error("[SSR Setup Error] Failed to load Nitro middleware:", err);
  }
}

// 10. Global Safe Error Handler (Never leak stack traces or system internals)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Server Error]", err.message || err);
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: "Access Denied: Untrusted Origin" });
  }
  res.status(500).json({ error: "An unexpected error occurred. Please try again." });
});

const httpServer = http.createServer(app);

// Prevent slowloris attacks: 30s request timeout
httpServer.setTimeout(30000);

// Setup WebSockets with rate-limiting and validation
setupSocketServer(httpServer);

async function startServer() {
  try {
    try {
      await connectDB();
      await seedWordPairsIfEmpty();
    } catch (dbErr: any) {
      console.warn("[Database] MongoDB connection deferred (running with in-memory fallback):", dbErr.message);
    }

    httpServer.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`[Imposter World] Shielded Server running on port ${PORT}`);
      console.log(`[Security] 10000% Hardened: NoSQL Sanitizer, XSS Defense,`);
      console.log(`           Stealth Admin, Rate Limiting & Origin Guard`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error("[Imposter World] Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
