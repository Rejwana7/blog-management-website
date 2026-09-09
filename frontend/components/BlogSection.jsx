import BlogCard from "./BlogCard";

export default function BlogSection({ blogs, loadFailed = false }) {
  return (
    <section className="bg-slate-50 py-18 sm:py-24" id="latest-blogs">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">From the community</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Latest blogs</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Anyone can browse and read these posts—no account required.</p>
          </div>
          {!loadFailed && blogs.length > 0 ? (
            <p className="text-sm text-slate-500">Showing {blogs.length} {blogs.length === 1 ? "article" : "articles"}</p>
          ) : null}
        </div>

        {loadFailed ? (
          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <p className="font-semibold">Blogs are temporarily unavailable.</p>
            <p className="mt-1 text-sm">Start the backend server on port 5000, then refresh this page.</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-slate-800">No blogs have been published yet.</p>
            <p className="mt-2 text-sm text-slate-500">The first published blog will appear here automatically.</p>
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
