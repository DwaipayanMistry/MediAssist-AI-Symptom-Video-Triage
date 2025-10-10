import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "./env";

export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_VAL));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  storedPassword: string
): Promise<boolean> => {
  const checkPassword = await bcrypt.compare(password, storedPassword);
  return checkPassword;
};

export const signJwt = (payload: object): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as T;
  } catch (error) {
    console.error(error);
    return null;
  }
};
