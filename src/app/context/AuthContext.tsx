"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  name: string;
  username: string;
  avatar: string;
}

export type UserRole = 'admin' | 'buyer' | 'vendor';
export type UserRoles = UserRole[]; // New type for multiple roles

interface AuthContextType {
  token: string | null;
  roles: UserRoles;
  user: UserInfo | null;
  setAuth: (token: string, roles: UserRoles, user: UserInfo) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<UserRoles>([]);
  const [user, setUser] = useState<UserInfo | null>(null);

  const setAuth = (token: string, roles: UserRoles, user: UserInfo) => {
    setToken(token);
    setRoles(roles);
    setUser(user);
    localStorage.setItem("authToken", token);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const clearAuth = () => {
    setToken(null);
    setRoles([]);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("roles");
    localStorage.removeItem("authUser");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    const storedRoles = localStorage.getItem("roles");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedRoles) {
        try {
          const parsedRoles = JSON.parse(storedRoles);
          if (Array.isArray(parsedRoles)) {
            setRoles(parsedRoles);
          } else {
            setRoles([]);
          }
        } catch {
          setRoles([]);
        }
      } else {
        setRoles([]);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      roles,
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
