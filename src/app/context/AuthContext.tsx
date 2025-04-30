"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  name: string;
  username: string;
  avatar: string;
}

export type UserRole = 'admin' | 'buyer' | 'vendor';

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  user: UserInfo | null;
  setAuth: (token: string, role: UserRole, user: UserInfo) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  const setAuth = (token: string, role: UserRole, user: UserInfo) => {
    setToken(token);
    setRole(role);
    setUser(user);
    localStorage.setItem("jwt", token);
    localStorage.setItem("role", role);
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const clearAuth = () => {
    setToken(null);
    setRole('buyer');
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("authUser");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    const storedRole = localStorage.getItem("role");
    const validRoles = ['admin', 'buyer', 'vendor'];
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedRole && validRoles.includes(storedRole)) {
        setRole(storedRole as UserRole);
      } else {
        setRole('buyer');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      role: (role === 'admin' || role === 'buyer' || role === 'vendor') ? role : 'buyer',
      user,
      setAuth,
      clearAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
