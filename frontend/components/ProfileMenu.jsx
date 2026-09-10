"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getAssetUrl } from "@/utils/api";

function getInitials(user) {
  const first = user?.firstname?.trim()?.[0] ?? "";
  const last = user?.lastname?.trim()?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "U";
}

export default function ProfileMenu({ showRole = false }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "User";
  const imageUrl = getAssetUrl(user?.profilePicture);
  const role = user?.role ?? "user";
  const isAdmin = role.toLowerCase() === "admin";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <details className="group relative min-w-0">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl p-1.5 pr-2 text-left transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 [&::-webkit-details-marker]:hidden">
        {imageUrl ? (
          <span aria-label={`${fullName}'s profile picture`} className="size-9 rounded-full bg-cover bg-center ring-2 ring-white shadow" role="img" style={{ backgroundImage: `url(${imageUrl})` }} />
        ) : (
          <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-violet-600 to-sky-500 text-xs font-black text-white shadow" aria-hidden="true">{getInitials(user)}</span>
        )}
        <span className="hidden max-w-36 truncate text-sm font-bold text-slate-800 sm:block">{fullName}</span>
        {showRole && (
          <span className={`hidden rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:block ${isAdmin ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>
            {isAdmin ? "Admin" : "User"}
          </span>
        )}
        <svg aria-hidden="true" className="hidden size-4 text-slate-400 transition group-open:rotate-180 sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
      </summary>

      <div className="absolute right-0 top-full w-[min(14rem,calc(100vw-2rem))] pt-3">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
          <div className="border-b border-slate-100 px-3 pb-3 pt-1 sm:hidden">
            <p className="truncate text-sm font-bold text-slate-900">{fullName}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <Link className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700" href="/dashboard/profile">Profile</Link>
          <Link className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700" href="/dashboard/change-password">Change Password</Link>
          <button className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50" onClick={handleLogout} type="button">Logout</button>
        </div>
      </div>
    </details>
  );
}
