"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getAssetUrl } from "@/utils/api";

function initials(user) {
  return `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() || "U";
}

function ProfileField({ label, value }) {
  return <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold text-slate-900">{value || "—"}</dd></div>;
}

export default function UserProfile() {
  const { user } = useAuth();
  const imageUrl = getAssetUrl(user.profilePicture);
  const fullName = [user.firstname, user.lastname].filter(Boolean).join(" ");

  return (
    <div className="max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-28 bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500" />
      <div className="px-5 pb-7 sm:px-8">
        <div aria-label={fullName || "User avatar"} className="-mt-12 grid size-24 place-items-center rounded-full border-4 border-white bg-slate-900 bg-cover bg-center text-2xl font-bold text-white shadow-md" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>{imageUrl ? <span className="sr-only">Profile image</span> : initials(user)}</div>
        <div className="mt-4"><h2 className="text-2xl font-bold text-slate-900">{fullName || "User"}</h2><p className="mt-1 text-sm text-slate-500">Your account information</p></div>
        <dl className="mt-7 grid gap-4 sm:grid-cols-2">
          <ProfileField label="First Name" value={user.firstname} />
          <ProfileField label="Last Name" value={user.lastname} />
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Role" value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""} />
        </dl>
        <p className="mt-5 text-xs leading-5 text-slate-500">Email is read-only because the current backend profile update endpoint does not support changing it.</p>
      </div>
    </div>
  );
}
