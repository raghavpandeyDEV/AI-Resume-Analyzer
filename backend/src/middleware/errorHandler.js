import config from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(
    ApiError.notFound(
      `Route ${req.method} ${req.originalUrl} not found`
    )
  );
}

export function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  if (err.name === "ValidationError" && err.errors) {
    status = 400;

    details = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [
        k,
        v.message,
      ])
    );

    message = "Validation failed";
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409;
    message = "Duplicate key";
    details = err.keyValue;
  } else if (err.name === "ZodError") {
    status = 400;
    message = "Validation failed";
    details = err.issues;
  }

  if (status >= 500) {
    console.error(
      `[${req.method}] ${req.originalUrl}`,
      err
    );
  }

  res.status(status).json({
    error: {
      message,
      ...(details ? { details } : {}),
      ...(config.isProd ? {} : { stack: err.stack }),
    },
  });
}