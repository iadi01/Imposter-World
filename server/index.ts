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

// 7. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", apiRoutes);

// Health probe (minimal output)
app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

// 8. Serve Client Static Assets (from .output/public)
const publicDir = path.resolve(process.cwd(), ".output/public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir, { maxAge: "1d", index: false }));
}

// 9. TanStack Start SSR Handler (Nitro Middleware)
const ssrIndexPath = path.resolve(process.cwd(), ".output/server/index.mjs");
if (fs.existsSync(ssrIndexPath)) {
  try {
    const { middleware } = await import(ssrIndexPath);
    if (middleware) {
      app.use(middleware);
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
    await connectDB();
    await seedWordPairsIfEmpty();

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
