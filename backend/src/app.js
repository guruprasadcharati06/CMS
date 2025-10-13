import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRouter from "./routes/health.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/health", healthRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

export default app;