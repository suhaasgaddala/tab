import express from "express";
import type { AppConfig } from "./config.js";
import { HttpError } from "./errors/httpError.js";
import { errorHandler } from "./errors/errorHandler.js";
import { createDemoRouter } from "./routes/demo.js";
import { createHealthRouter } from "./routes/health.js";
import { createRootRouter } from "./routes/root.js";
import { createVoyaRouter } from "./routes/voya.js";
import { requestIdMiddleware } from "./telemetry/requestId.js";

export function createApp(config: AppConfig) {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestIdMiddleware);
  app.use(createRootRouter(config));
  app.use(createHealthRouter());
  app.use(createVoyaRouter(config));
  app.use(createDemoRouter());
  app.use((req, _res, next) => {
    next(
      new HttpError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: `Route ${req.method} ${req.path} not found.`
      })
    );
  });
  app.use(errorHandler);

  return app;
}
