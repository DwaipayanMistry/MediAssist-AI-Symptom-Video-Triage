import React, { useState } from "react";
import z from "zod";
import { useLogin } from "../api/auth";
export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
type formDataInfer = z.infer<typeof LoginSchema>;

function LoginForm() {
  const [form, setForm] = useState<formDataInfer>({ email: "", password: "" });
  const [formError, setFormError] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { error, handelLogin, loading } = useLogin();

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse(form);

    // validate with zod
    const fieldErrors: { email?: string; password?: string } = {};
    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = String(err.path[0]);
        if (field === "email") fieldErrors.email = err.message;
        if (field === "password") fieldErrors.password = err.message;
      });
      setFormError(fieldErrors);
      return;
    }
    setFormError({});
    await handelLogin(form);
  };

  return (
    <>
      <form onSubmit={handelSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="johndoe@doedoe.com"
          value={form.email}
          onChange={handelChange}
        ></input>

        {formError.password && (
          <p className="text-red-700 text-2xl">{formError.email}</p>
        )}
        <input
          name="password"
          placeholder="John Doe"
          value={form.password}
          onChange={handelChange}
        ></input>
        {formError.password && (
          <p className="text-red-700 text-2xl">{formError.password}</p>
        )}

        <button type="submit" disabled={loading}>
          {" "}
          {loading ? "Loading in" : "Login"}
        </button>
        {error && <p className="text-red-700 text-2xl">{error}</p>}
      </form>
    </>
  );
}

export default LoginForm;
