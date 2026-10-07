import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import httpStatus from "http-status";
import mongoose from "mongoose";
import routes from "./app/routes";
import config from "./app/config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

// Trust first proxy (Render / Railway / Fly / Vercel) for correct IPs behind LB
app.set("trust proxy", 1);

// Hide framework fingerprint
app.disable("x-powered-by");

// Security headers (incl. cross-origin resource policy for API consumers)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);

// Strict CORS: comma-separated CLIENT_URL allow-list, explicit methods/headers,
// credentials on. Supports one or many web origins (preview + prod).
const allowedOrigins = String(config.client_url || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  }),
);
app.use(cookieParser());

// Body parsers with sane limits to blunt payload abuse
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Global rate limit: 300 req / 15 min per IP (tunable via env)
const globalLimiter = rateLimit({
  windowMs: Number(config.rate_limit_window_ms) || 15 * 60 * 1000,
  max: Number(config.rate_limit_max) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/", globalLimiter);

// Stricter limit for auth endpoints (brute-force mitigation)
const authLimiter = rateLimit({
  windowMs: Number(config.rate_limit_window_ms) || 15 * 60 * 1000,
  max: Number(config.auth_rate_limit_max) || 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});
app.use("/api/v1/auth", authLimiter);

app.use("/api/v1", routes);

// Health check (no-store so LB / uptime monitors never cache it)
app.get("/", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to the Tech Tips And Tricks API",
  });
});

// Dedicated readiness probe for load balancers / Docker HEALTHCHECK.
// Reports MongoDB connectivity without exposing internals.
app.get("/api/health", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  const dbState = mongoose.connection?.readyState; // 1 = connected
  if (dbState === 1) {
    res.status(httpStatus.OK).json({ success: true, message: "OK" });
  } else {
    res.status(httpStatus.SERVICE_UNAVAILABLE).json({ success: false, message: "DB not ready" });
  }
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use(notFound);

export default app;
