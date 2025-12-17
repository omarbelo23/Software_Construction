import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

function extractToken(req) {
  // 1) Authorization: Bearer <token>
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && typeof authHeader === "string") {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1];
    }
    // some projects send token directly in Authorization without Bearer
    return authHeader;
  }

  // 2) Common alternatives
  const xAuth = req.headers["x-auth-token"];
  if (xAuth) return xAuth;

  const xAccess = req.headers["x-access-token"];
  if (xAccess) return xAccess;

  return null;
}

export default function auth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
