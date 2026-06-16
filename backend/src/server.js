import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import config from "./config/env.js";
import { connectDB } from "./config/db.js";
import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.js";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js"
import resumeRouter from "./routes/resumes.js"
import dashboardRouter from "./routes/dashboard.js"
import insightsRouter from "./routes/insights.js"
import versionsRouter from "./routes/versions.js"
import historyRouter from "./routes/history.js"
const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

if (!config.isProd) {
  app.use(morgan("dev"));
}

app.use("/api/health", healthRouter);
app.use("/api/auth",authRouter);
app.use("/api/resumes",resumeRouter);
app.use("/api/dashboard",dashboardRouter);
app.use("/api/insights",insightsRouter);
app.use("/api/history",historyRouter);
app.use("/api/versions",versionsRouter);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(
        `🚀 Server listening on http://localhost:${config.port} (${config.nodeEnv})`
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

start();

export default app;