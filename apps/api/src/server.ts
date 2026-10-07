import { Server, createServer } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { seed } from "./app/utils/seeding";
import { checkUserSubscriptions } from "./app/utils/checkUserSubscriptions";
import { initializeSocket } from "./app/socket/socket";

let server: Server;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let io: any;

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  if (server) {
    server.close(() => {
      console.error("Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

async function bootstrap() {
  try {
    // Fail fast instead of hanging forever on an unreachable DB (important for
    // Docker HEALTHCHECK / orchestrator readiness probes).
    await mongoose.connect(config.db_url as string, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    console.log("🛢 Database connected successfully");
    await seed();
    await checkUserSubscriptions();

    // Create HTTP server
    server = createServer(app);

    // Initialize Socket.io
    io = initializeSocket(server);
    console.log("🔌 Socket.io initialized");

    server.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

bootstrap();

async function shutdown(signal: string) {
  console.log(`${signal} received`);
  try {
    if (io?.close) {
      await new Promise<void>((resolve) => io.close(() => resolve()));
      console.log("Socket.io closed");
    }
    if (server) {
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      );
      console.log("HTTP server closed");
    }
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (shutdownError) {
    console.error("Error during shutdown:", shutdownError);
    process.exit(1);
  }
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));

process.on("SIGINT", () => void shutdown("SIGINT"));
