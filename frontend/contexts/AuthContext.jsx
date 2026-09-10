"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { userService } from "@/services/user.service";
import { getToken, removeToken } from "@/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      if (!getToken()) {
        if (isActive) setIsLoading(false);
        return;
      }

      try {
        const response = await userService.getProfile();
        if (isActive) setUser(response?.data ?? null);
      } catch {
        removeToken();
        if (isActive) setUser(null);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      isActive = false;
    };
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    isLoading,
    isAuthenticated: Boolean(user),
    logout,
  }), [isLoading, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
