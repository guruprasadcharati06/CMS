import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.routes.js";
import eventRouter from "./routes/event.routes.js";
import registrationRouter from "./routes/registration.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import intelligenceRouter from "./routes/intelligence.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/registrations", registrationRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/intelligence", intelligenceRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

export default app;