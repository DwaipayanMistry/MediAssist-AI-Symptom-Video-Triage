import { timeStamp } from "console";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

dotenv.config();

app.get("/", (req: Request, res: Response) => {
  res.json("Hello, TypeScript + Express!");
});
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Server is running smoothly",
    timeStamp: new Date().toDateString(),
    uptime: process.uptime(),
  });
});

app.get("/db-test", async (req, res) => {
  try {
    // Run a simple query: count users (empty table initially)
    const count = await prisma.user.count();
    res.json({ userCount: count });
  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    await prisma.$disconnect();
  }
});

// Auth
app.use("/auth", authRoutes);

try {
  console.log("Starting backend server...");
  app.listen(3000, () =>
    console.log("Server running at http://localhost:3000")
  );
} catch (err) {
  console.error("Error starting server:", err);
}

export default app;
