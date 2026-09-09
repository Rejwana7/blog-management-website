import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute -left-24 top-12 -z-10 size-72 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="absolute -right-24 bottom-0 -z-10 size-80 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-32">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            Stories, ideas, and practical knowledge
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Read ideas that <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">move you forward.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Explore blogs from registered writers, learn something useful, and join the community when you are ready to share your own story.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="rounded-xl bg-slate-950 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-violet-700" href="#latest-blogs">Explore blogs</a>
            <Link className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700" href="/register">Start writing</Link>
          </div>
        </div>
        <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
          <div className="rotate-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-violet-900/10">
            <div className="mb-6 flex items-center gap-2"><span className="size-3 rounded-full bg-rose-400" /><span className="size-3 rounded-full bg-amber-400" /><span className="size-3 rounded-full bg-emerald-400" /></div>
            <div className="h-3 w-24 rounded-full bg-violet-200" />
            <div className="mt-5 h-7 w-4/5 rounded-lg bg-slate-800" />
            <div className="mt-3 h-7 w-3/5 rounded-lg bg-slate-800" />
            <div className="mt-7 space-y-3"><div className="h-2.5 rounded-full bg-slate-200" /><div className="h-2.5 rounded-full bg-slate-200" /><div className="h-2.5 w-4/5 rounded-full bg-slate-200" /></div>
            <div className="mt-8 flex items-center gap-3"><div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-sky-400" /><div className="space-y-2"><div className="h-2.5 w-24 rounded-full bg-slate-300" /><div className="h-2 w-16 rounded-full bg-slate-200" /></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
