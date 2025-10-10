import { z } from "zod";

const role = z.enum(["PATIENT", "DOCTOR", "ADMIN"]).default("PATIENT");

export const RegistrationSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be least 8 characters long"),
  role: role,
  firstName: z.string().min(3),
  lastName: z.string().min(3),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
