export default function BlogForm() {
  return (
    <form className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Title</span>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" name="title" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Category</span>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" name="category" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Content</span>
        <textarea className="min-h-48 w-full rounded-lg border border-slate-300 px-3 py-2" name="content" />
      </label>
      <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white" type="submit">
        Save blog
      </button>
    </form>
  );
}
