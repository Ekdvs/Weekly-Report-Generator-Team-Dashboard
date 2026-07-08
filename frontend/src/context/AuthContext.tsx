
/* eslint-disable react-refresh/only-export-components */
import { loginRequest, logoutRequest, meRequest, registerRequest } from "../api/auth.api";
import type { AuthUser, Role } from "../types";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const cachedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!cachedUser || !token) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate the cached session against the server rather than trusting localStorage blindly
        const { data } = await meRequest();
        setUser(data.data);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistSession = (authUser: AuthUser, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authUser));
    setUser(authUser);
  };

  const login = async (email: string, password: string) => {
    const { data } = await loginRequest({ email, password });
    persistSession(data.data.user, data.data.token);
    return data.data.user;
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => {
    const { data } = await registerRequest(payload);
    persistSession(data.data.user, data.data.token);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
