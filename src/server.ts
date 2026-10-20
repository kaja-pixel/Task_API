import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./config/prisma";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Attempt database connection check
    await prisma.$connect();
    console.log("✅ Successfully connected to PostgreSQL Database via Prisma");
  } catch (error) {
    console.warn("⚠️ Warning: Could not connect to PostgreSQL immediately. Ensure PostgreSQL is running and DATABASE_URL is configured in .env");
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Task Management Server is running at http://localhost:${PORT}`);
    console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📝 Task API: http://localhost:${PORT}/api/tasks`);
  });

  // Graceful shutdown handling
  const handleShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("👋 Prisma client disconnected. Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => handleShutdown("SIGINT"));
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
}

bootstrap();
