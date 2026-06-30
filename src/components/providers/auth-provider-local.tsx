"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { fullName: string; phone: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: User = {
  id: "user-1",
  fullName: "Pasteur Emmanuel Mukendi",
  email: "emmanuel.mukendi@laredemption.cd",
  phone: "+243 81 111 0001",
  role: "super_admin",
  avatar: "https://ui-avatars.com/api/?name=Emmanuel+Mukendi&background=2563EB&color=fff&size=128",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    if (email && password.length >= 4) {
      const loggedUser = { ...DEMO_USER, email };
      setUser(loggedUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (data: { fullName: string; phone: string; email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: "admin",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=2563EB&color=fff&size=128`,
    };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}