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
  if (!auth?.startsWith("Barer "))
    return res.status(401).json({ error: "Unaurthorized access" });
  try {
    const token = auth.split(" ")[1];
    const paylod = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = paylod;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
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
