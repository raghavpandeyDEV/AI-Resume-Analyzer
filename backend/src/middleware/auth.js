import env from "../config/env.js";
import { verifyToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];

    if (!token) {
      throw ApiError.unauthorized();
    }

    const payload = verifyToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      throw ApiError.unauthorized("Session no longer valid");
    }

    req.user = user;

    next();
  } catch (err) {
    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      return next(
        ApiError.unauthorized("Invalid or expired session")
      );
    }

    next(err);
  }
}

export { requireAuth };