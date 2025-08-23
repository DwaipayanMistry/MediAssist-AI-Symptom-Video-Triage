import { email, z } from "zod";

const role = z.enum(["patient", "doctor", "admin"]).default("patient");

export const RegistrationSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be atleast 8 characters long"),
  role: role,
  name: z.string().min(3),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
