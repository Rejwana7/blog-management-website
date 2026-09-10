"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedNavbar from "./AuthenticatedNavbar";
import Loader from "./Loader";
import Sidebar from "./Sidebar";

export default function AuthenticatedShell({ children }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-sm font-medium text-slate-500"><Loader /> Loading your account...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[8.25rem] md:pt-18">
      <AuthenticatedNavbar />
      <Sidebar />
      <main className="min-h-[calc(100vh-4.5rem)] md:ml-64">{children}</main>
    </div>
  );
}
