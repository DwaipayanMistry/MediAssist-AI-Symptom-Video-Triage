import dotenv from "dotenv";
dotenv.config();
export const env = {
  JWT_SECRET: process.env.JWT_SECRET || "",
};
if (!env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is required for @mediassist/auth-service to function prooperly"
  );
}
