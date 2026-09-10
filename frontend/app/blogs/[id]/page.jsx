import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import BlogBackButton from "@/components/BlogBackButton";
import { blogService } from "@/services/blog.service";
import { getAssetUrl } from "@/utils/api";

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date);
}

export default async function BlogDetailsPage({ params }) {
  const { id } = await params;
  let blog = null;

  try {
    const response = await blogService.getById(id);
    blog = response?.data ?? null;
  } catch {
    // A friendly state keeps the public page usable if the API is unavailable.
  }

  if (!blog) {
    return (
      <PublicLayout>
        <section className="mx-auto min-w-0 max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-bold uppercase tracking-wider text-violet-600">Article unavailable</p>
          <h1 className="mt-3 wrap-break-word text-3xl font-black text-slate-950">We could not load this blog.</h1>
          <p className="mt-4 text-slate-600">It may have been removed, or the backend server may be offline.</p>
          <Link className="mt-8 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white" href="/#latest-blogs">Back to blogs</Link>
        </section>
      </PublicLayout>
    );
  }

  const authorName = [blog.author?.firstname, blog.author?.lastname].filter(Boolean).join(" ") || "Community writer";
  const authorInitials = `${blog.author?.firstname?.trim()?.[0] ?? ""}${blog.author?.lastname?.trim()?.[0] ?? ""}`.toUpperCase() || "A";
  const authorImageUrl = getAssetUrl(blog.author?.profilePicture);

  return (
    <PublicLayout>
      <article className="mx-auto min-w-0 max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <BlogBackButton />
        <p className="mt-10 break-words text-sm font-bold uppercase tracking-[0.16em] text-violet-600">{blog.category}</p>
        <h1 className="mt-4 break-words text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">{blog.blogTitle}</h1>
        <div className="mt-6 flex min-w-0 items-center gap-4 border-b border-slate-200 pb-8">
          {authorImageUrl ? (
            <span aria-label={`${authorName}'s profile picture`} className="size-12 shrink-0 rounded-full bg-slate-200 bg-cover bg-center ring-4 ring-violet-100" role="img" style={{ backgroundImage: `url(${authorImageUrl})` }} />
          ) : (
            <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-600 to-sky-500 text-sm font-black text-white ring-4 ring-violet-100">{authorInitials}</span>
          )}
          <p className="min-w-0 break-words text-sm text-slate-500">
            Written by <span className="font-semibold text-slate-700">{authorName}</span>
            <time className="mt-1 block" dateTime={blog.createAt}>Published {formatDate(blog.createAt)}</time>
          </p>
        </div>
        <div className="break-words whitespace-pre-wrap py-8 text-base leading-8 text-slate-700 sm:py-10 sm:text-lg">{blog.blog}</div>
      </article>
    </PublicLayout>
  );
}
