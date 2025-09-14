import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          localStorage.setItem("token", token);
          const res = await api.post<{ user: User }>("/auth/me");
          setUser(res.data.user);
        } catch (error) {
          // logout();
          console.error(`Error fetching user data:${error}`);
        }
      }
    };
    fetchMe();
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext value={{ user, token, login, logout }}>{children}</AuthContext>
  );
};
