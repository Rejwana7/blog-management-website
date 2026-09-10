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
      <nav className="mx-auto grid min-h-18 max-w-screen-2xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 md:flex md:flex-nowrap md:py-0 lg:px-8" aria-label="Authenticated navigation">
        <Link className="col-start-1 row-start-1 flex min-w-0 shrink-0 items-center gap-3" href="/dashboard">
          <Image className="size-10 rounded-full border border-violet-100 object-cover shadow-sm" src="/logo.jpg" alt="Blog Application logo" width={40} height={40} priority />
          <span className="hidden font-black tracking-tight text-slate-950 sm:block">Blog Application</span>
        </Link>

        <form className="relative col-span-full col-start-1 row-start-2 w-full min-w-0 md:order-0 md:mx-auto md:max-w-md" onSubmit={handleSearch} role="search">
          <label className="sr-only" htmlFor="dashboard-search">Search blogs</label>
          <button aria-label="Search blogs" className="absolute inset-y-0 left-0 z-10 grid w-11 place-items-center text-slate-500 transition hover:text-violet-700" type="submit">
            <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <input className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" id="dashboard-search" onChange={(event) => setSearch(event.target.value)} placeholder="Search by blog title..." type="search" value={search} />
        </form>

        <div className="col-start-3 row-start-1 justify-self-end md:ml-auto"><ProfileMenu /></div>
      </nav>
    </header>
  );
}
