import Link from "next/link";
import { formatCategoryLabel } from "@/utils/blogs";

export default function BlogCard({ blog }) {
  const authorName = [blog?.author?.firstname, blog?.author?.lastname]
    .filter(Boolean)
    .join(" ") || "Community writer";
  const excerpt = blog?.blog?.length > 150
    ? `${blog.blog.slice(0, 150)}…`
    : blog?.blog;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
        {formatCategoryLabel(blog?.category) || "Uncategorized"}
      </p>
      <h2 className="mt-3 text-xl font-bold leading-7 text-slate-900 transition group-hover:text-violet-700">
        {blog?.blogTitle ?? "Untitled blog"}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {excerpt ?? "No preview is available for this blog."}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-500">By {authorName}</span>
        <Link className="text-sm font-bold text-violet-600 hover:text-violet-800" href={`/blogs/${blog?.id}`}>
          Read article <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
