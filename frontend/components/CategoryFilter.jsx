"use client";

export default function CategoryFilter({ categories = [], defaultValue = "" }) {
  return (
    <select aria-label="Filter blogs by category" className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:w-auto" defaultValue={defaultValue} key={defaultValue || "all"} name="category" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
      <option value="">All</option>
      {categories.map((category) => <option key={category} value={category}>{category}</option>)}
    </select>
  );
}
