import jwt from "jsonwebtoken";
import config from "../config/env.js";

export function signToken(payload) {
  return jwt.sign(
    payload,
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(
    token,
    config.jwtSecret
  );
}

export const cookieOptions = {
  httpOnly: true,
  secure: config.isProd,
  sameSite: config.isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};