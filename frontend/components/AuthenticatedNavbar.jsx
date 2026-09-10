"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";

export default function AuthenticatedNavbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(event) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/dashboard/blogs?title=${encodeURIComponent(query)}` : "/dashboard/blogs");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-18 max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 md:flex-nowrap md:py-0 lg:px-8" aria-label="Authenticated navigation">
        <Link className="flex shrink-0 items-center gap-3" href="/dashboard">
          <Image className="size-10 rounded-full border border-violet-100 object-cover shadow-sm" src="/logo.jpg" alt="Blog Application logo" width={40} height={40} priority />
          <span className="hidden font-black tracking-tight text-slate-950 sm:block">Blog Application</span>
        </Link>

        <form className="order-3 flex w-full md:order-none md:mx-auto md:max-w-xl" onSubmit={handleSearch} role="search">
          <label className="sr-only" htmlFor="dashboard-search">Search blogs</label>
          <input className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" id="dashboard-search" onChange={(event) => setSearch(event.target.value)} placeholder="Search by blog title..." type="search" value={search} />
          <button className="rounded-r-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-violet-700" type="submit">Search</button>
        </form>

        <div className="ml-auto"><ProfileMenu /></div>
      </nav>
    </header>
  );
}
