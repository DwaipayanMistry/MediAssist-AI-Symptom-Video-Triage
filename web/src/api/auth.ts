import { useCallback, useState } from "react";

import { useAuth } from "../lib/useAuth";
import api from "./axios";

import type {
  LoginSchemaType,
  RegistrationSchemaType,
} from "@mediassist/auth-service";
import type { AxiosError } from "axios";

export function useLogin() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handelLogin = useCallback(
    async (data: LoginSchemaType) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.post("auth/login", data);
        login(res.data.token);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || "Login Failed");
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return { handelLogin, loading, error };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handelRegistration = useCallback(
    async (data: RegistrationSchemaType) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.post("auth/register", data);
        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || "Registrations Failed");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { handelRegistration, loading, error };
}

// TODO:check if register is persisted(i.e auto login after register)
