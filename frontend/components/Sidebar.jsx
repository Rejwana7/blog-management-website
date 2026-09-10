"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const userLinks = [
  ["Dashboard", "/dashboard"],
  ["My Blogs", "/dashboard/blogs"],
  ["Create Blog", "/dashboard/blogs/create"],
  ["Profile", "/dashboard/profile"],
  ["Change Password", "/dashboard/change-password"],
];

const adminLinks = [
  ["Dashboard", "/dashboard"],
  ["All Blogs", "/dashboard/blogs"],
  ["Create Blog", "/dashboard/blogs/create"],
  ["Users", "/admin/users"],
  ["Profile", "/dashboard/profile"],
  ["Change Password", "/dashboard/change-password"],
];

function SidebarLinks({ links, pathname, onLogout }) {
  const activeHref = links
    .map(([, href]) => href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((first, second) => second.length - first.length)[0];

  return (
    <nav aria-label="Dashboard navigation">
      <ul className="space-y-1.5">
        {links.map(([label, href]) => {
          const isActive = href === activeHref;
          return (
            <li key={href}>
              <Link className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-violet-600 text-white shadow-md shadow-violet-600/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`} href={href}>{label}</Link>
            </li>
          );
        })}
        <li className="pt-2">
          <button className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50" onClick={onLogout} type="button">Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const links = user?.role === "admin" ? adminLinks : userLinks;

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return (
    <>
      <div className="border-b border-slate-200 bg-white p-3 md:hidden">
        <details>
          <summary className="cursor-pointer list-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 [&::-webkit-details-marker]:hidden">Dashboard menu</summary>
          <div className="pt-3"><SidebarLinks links={links} pathname={pathname} onLogout={handleLogout} /></div>
        </details>
      </div>
      <aside className="fixed bottom-0 left-0 top-18 hidden w-64 overflow-y-auto border-r border-slate-200 bg-white p-5 md:block">
        <p className="mb-4 px-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        <SidebarLinks links={links} pathname={pathname} onLogout={handleLogout} />
      </aside>
    </>
  );
}
