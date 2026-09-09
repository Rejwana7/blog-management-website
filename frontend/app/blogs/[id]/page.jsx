import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { blogService } from "@/services/blog.service";

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
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-violet-600">Article unavailable</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">We could not load this blog.</h1>
          <p className="mt-4 text-slate-600">It may have been removed, or the backend server may be offline.</p>
          <Link className="mt-8 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white" href="/#latest-blogs">Back to blogs</Link>
        </section>
      </PublicLayout>
    );
  }

  const authorName = [blog.author?.firstname, blog.author?.lastname].filter(Boolean).join(" ") || "Community writer";

  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <Link className="text-sm font-semibold text-violet-600 hover:text-violet-800" href="/#latest-blogs">← Back to blogs</Link>
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-violet-600">{blog.category}</p>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">{blog.blogTitle}</h1>
        <p className="mt-5 border-b border-slate-200 pb-8 text-sm text-slate-500">Written by <span className="font-semibold text-slate-700">{authorName}</span></p>
        <div className="whitespace-pre-wrap py-10 text-lg leading-8 text-slate-700">{blog.blog}</div>
      </article>
    </PublicLayout>
  );
}
