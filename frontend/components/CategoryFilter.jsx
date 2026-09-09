export default function CategoryFilter({ categories = [] }) {
  return (
    <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" defaultValue="">
      <option value="">All categories</option>
      {categories.map((category) => <option key={category} value={category}>{category}</option>)}
    </select>
  );
}
