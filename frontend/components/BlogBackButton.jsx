"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function BlogBackButton() {
  const { user } = useAuth();

  return (
    <Link
      className="text-sm font-semibold text-violet-600 hover:text-violet-800"
      href={user ? "/dashboard" : "/#latest-blogs"}
    >
      ← Back {user ? "to Dashboard" : "to blogs"}
    </Link>
  );
}

