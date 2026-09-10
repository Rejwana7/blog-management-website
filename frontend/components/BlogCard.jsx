import Link from "next/link";
import { formatCategoryLabel } from "@/utils/blogs";
import { getAssetUrl } from "@/utils/api";

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export default function BlogCard({ blog }) {
  const authorName = [blog?.author?.firstname, blog?.author?.lastname]
    .filter(Boolean)
    .join(" ") || "Community writer";
  const authorInitials = `${blog?.author?.firstname?.trim()?.[0] ?? ""}${blog?.author?.lastname?.trim()?.[0] ?? ""}`.toUpperCase() || "A";
  const authorImageUrl = getAssetUrl(blog?.author?.profilePicture);
  const excerpt = blog?.blog?.length > 150
    ? `${blog.blog.slice(0, 150)}…`
    : blog?.blog;

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/5 sm:p-6">
      <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
        {formatCategoryLabel(blog?.category) || "Uncategorized"}
      </p>
      <h2 className="mt-3 break-words text-xl font-bold leading-7 text-slate-900 transition group-hover:text-violet-700">
        {blog?.blogTitle ?? "Untitled blog"}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {excerpt ?? "No preview is available for this blog."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          {authorImageUrl ? (
            <span aria-label={`${authorName}'s profile picture`} className="size-9 shrink-0 rounded-full bg-slate-200 bg-cover bg-center ring-2 ring-violet-100" role="img" style={{ backgroundImage: `url(${authorImageUrl})` }} />
          ) : (
            <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-600 to-sky-500 text-xs font-black text-white">{authorInitials}</span>
          )}
          <span className="min-w-0 text-xs text-slate-500">
            <span className="block break-words font-semibold text-slate-700">{authorName}</span>
            <time dateTime={blog?.createAt}>{formatDate(blog?.createAt)}</time>
          </span>
        </div>
        <Link className="shrink-0 text-sm font-bold text-violet-600 hover:text-violet-800" href={`/blogs/${blog?.id}`}>
          Read article <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
