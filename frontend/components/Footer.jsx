import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-12 lg:px-8">
        <div className="min-w-0">
          <Link className="inline-flex items-center gap-3" href="/">
            <Image className="size-10 rounded-full bg-white object-cover" src="/logo.jpg" alt="" width={40} height={40} />
            <span className="font-bold text-white">Blog Application</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            A place to discover useful ideas and stories written by our community.
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-semibold text-white">Get started</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm sm:justify-end">
            <Link className="hover:text-white" href="/login">Log in</Link>
            <Link className="hover:text-white" href="/register">Create account</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-6 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Blog Application. All rights reserved.
      </div>
    </footer>
  );
}
