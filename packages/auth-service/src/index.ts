import { Router, Request, Response } from "express";
import { LoginSchema, RegistrationSchema } from "./schemas";
import { error } from "console";
import { prisma } from "@mediassist/backend/src/prisma";
import bcrypt from "bcrypt";
import { env } from "./env";
import jwt from "jsonwebtoken";
import { hasRole, isAuthenticated } from "./auth.middleware";
import { tr } from "zod/locales";

type Options = {
  jwtExpiresIn?: string;
};

export const createAuthRouterService = (opts: Options = {}): Router => {
  const { jwtExpiresIn = "7d" } = opts;
  const router = Router();

  router.post("/register", async (req: Request, res: Response) => {
    try {
      const salt = await bcrypt.genSalt(Number(process.env.SALT_VAL));

      const parse = RegistrationSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: parse.error });
      }
      const { email, password, firstName, lastName, role } = parse.data;
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists..." });
      }
      const hasedPassword = await bcrypt.hash(password, salt);
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hasedPassword,
          role,
        },
      });
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.password,
        },
      });
    } catch (error) {
      console.error(`Registration Error ${error}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const parse = LoginSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: parse.error });
      }
      const { email, password } = parse.data;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401);

      const checkPassword = bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({ error: "Invalid Password" });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    } catch (error) {
      console.error(`Login faled ${error}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const me = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: { id: true, email: true, role: true, createdAt: true },
      });
      return res.status(200).json({ user: me });
    } catch (error) {
      return res.status;
    }
  });

  // Example role-protected route     //TODO: Note needed delete this if not needed
  router.get("/admin/ping", isAuthenticated, hasRole("admin"), (_req, res) => {
    res.json({ ok: true });
  });

  router.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  return router;
};

export * from "./schemas";
export * from "./schemas";
