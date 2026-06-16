import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) =>
    req.user?._id?.toString() || ipKeyGenerator(req),
  message: {
    error: {
      message: "Too many analyses - please wait a minute and retry.",
    },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  message: {
    error: {
      message: "Too many auth attempts - please wait and retry.",
    },
  },
});