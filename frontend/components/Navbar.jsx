import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 md:flex-nowrap md:py-0 lg:px-8" aria-label="Main navigation">
        <Link className="flex items-center gap-3" href="/" aria-label="Blog Application home">
          <span className="grid size-11 place-items-center overflow-hidden rounded-full border border-violet-100 bg-white shadow-sm">
            <Image className="size-full object-cover" src="/logo.jpg" alt="Blog Application logo" width={44} height={44} priority />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-950 sm:text-lg">Blog Application</span>
        </Link>

        <form action="/#latest-blogs" className="order-3 flex w-full md:order-none md:mx-auto md:max-w-xl" method="get" role="search">
          <label className="sr-only" htmlFor="public-navbar-search">Search blogs by title</label>
          <input className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" id="public-navbar-search" name="title" placeholder="Search by blog title..." type="search" />
          <button className="rounded-r-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-violet-700" type="submit">Search</button>
        </form>

        <details className="group relative ml-auto">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 [&::-webkit-details-marker]:hidden" aria-label="Open account menu">
            <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.12a7.5 7.5 0 0 1 15 0A17.9 17.9 0 0 1 12 21.75a17.9 17.9 0 0 1-7.5-1.63Z" />
            </svg>
          </summary>

          <div className="invisible absolute right-0 top-full w-48 pt-3 opacity-0 transition group-open:visible group-open:opacity-100 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
              <Link className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700" href="/login">Login</Link>
              <Link className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700" href="/register">Sign up</Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
