export default function SearchBar() {
  return (
    <form className="flex gap-2" role="search">
      <input className="w-full rounded-lg border border-slate-300 px-3 py-2" name="search" placeholder="Search blogs" type="search" />
      <button className="rounded-lg bg-slate-900 px-4 py-2 text-white" type="submit">Search</button>
    </form>
  );
}
