import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";

export default function BlogSection({ blogs, categories = [], loadFailed = false, title = "", category = "" }) {
  return (
    <section className="bg-slate-50 py-18 sm:py-24" id="latest-blogs">
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">From the community</p>
            <h2 className="mt-3 wrap-break-word text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Latest blogs</h2>
            
          </div>
          {!loadFailed && blogs.length > 0 ? (
            <p className="text-sm text-slate-500">Showing {blogs.length} {blogs.length === 1 ? "article" : "articles"}</p>
          ) : null}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <SearchBar action="/#latest-blogs" categories={categories} defaultCategory={category} defaultValue={title} placeholder="Search blogs..." />
          <p className="mt-3 text-xs text-slate-500">Search by blog title, filter by category, or use both together.</p>
        </div>

        {loadFailed ? (
          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <p className="font-semibold">Blogs are temporarily unavailable.</p>
            <p className="mt-1 text-sm">Start the backend server on port 5000, then refresh this page.</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
            <p className="font-semibold text-slate-800">{title || category ? "No blogs found." : "No blogs have been published yet."}</p>
            <p className="mt-2 text-sm text-slate-500">{title || category ? "Try another title or category." : "The first published blog will appear here automatically."}</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => <BlogCard blog={blog} key={blog.id} />)}
          </div>
        )}
      </div>
    </section>
  );
}
