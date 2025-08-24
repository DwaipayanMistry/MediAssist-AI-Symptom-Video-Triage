import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";
import { env } from "./env";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized access - No token" });
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized access - Invalid token" });
  }
};
// Middleware to check if the user has the required roles
export const hasRole =
  (...roles:  JwtPayload["role"][]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
