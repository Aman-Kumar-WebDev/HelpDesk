import express from "express";
import { prisma } from "./db.ts";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
