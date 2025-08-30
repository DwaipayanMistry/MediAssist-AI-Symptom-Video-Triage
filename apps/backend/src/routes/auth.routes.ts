import { Router, Request, Response } from "express";
import {
  hashedPassword,
  isAuthenticated,
  hasRole,
  signJwt,
  verifyPassword,
} from "@mediassist/auth-service";
import { RegistrationSchema, LoginSchema } from "@mediassist/auth-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// ---------------- Register ----------------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const parse = RegistrationSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { email, firstName, lastName, password, role } = parse.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email address already exists." });
    const passwordHashed = await hashedPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: passwordHashed,
        role,
      },
    });
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = signJwt(payload);
    return res.status(201).json({
      token,
      user: payload,
    });
  } catch (error) {
    console.error(`Registration error ${error}`);
    return res.status(500).json({ message: "Internal service error", error });
  }
});

// ---------------- Login ----------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }
    const { email, password } = parse.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid user or password" });
    }
    const checkPassword = verifyPassword(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = signJwt(payload);
    return res.status(200).json({ token, user: payload });
  } catch (error) {
    console.error(`Login error ${error}`);
    return res.status(500).json({ message: "Internal service error" });
  }
});

// ---------------- Me ----------------
router.post("/me",isAuthenticated, async (req: Request, res: Response) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    return res.status(200).json({ user: me });
  } catch (error) {
    console.error(`Failure at Me endpoint ${error}`);
    return res.status(500).json({ error: "Internal service error"+error });
  }
});

// ---------------- Example admin-only route ----------------
router.get("/admin/ping", isAuthenticated, hasRole("admin"), (req:Request, res:Response) => {
  return res.json({ ok: true });
});

router.get("/health", (req:Request, res:Response) => {
  res.status(200).send("OK");
});

export default router;
