import CategoryFilter from "@/components/CategoryFilter";

export default function SearchBar({ categories = [], defaultValue = "", defaultCategory = "", placeholder = "Search blogs...", action }) {
  return (
    <form action={action} className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]" method="get" role="search">
      <div className="min-w-0">
        <label className="sr-only" htmlFor="blog-search">Search blogs by title</label>
        <input className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100" defaultValue={defaultValue} id="blog-search" key={defaultValue || "empty"} name="title" placeholder={placeholder} type="search" />
      </div>
      <CategoryFilter categories={categories} defaultValue={defaultCategory} />
      <button className="min-h-12 w-full rounded-xl bg-slate-900 px-6 text-sm font-bold text-white transition hover:bg-violet-700 sm:w-auto" type="submit">Search</button>
    </form>
  );
}
