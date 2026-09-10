"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { blogService } from "@/services/blog.service";
import { formatCategoryLabel, getBlogCategories } from "@/utils/blogs";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function getAuthor(blog) {
  const name = [blog.author?.firstname, blog.author?.lastname].filter(Boolean).join(" ");
  return name || "Unknown";
}

function normalizeFilter(value) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").toLocaleLowerCase()
    : "";
}

export default function UserBlogList({ title = "", category = "", notice = "" }) {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(notice);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!notice) return;

    const url = new URL(window.location.href);
    url.searchParams.delete("created");
    url.searchParams.delete("updated");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [notice]);

  useEffect(() => {
    let isActive = true;

    async function loadBlogs() {
      setIsLoading(true);
      setError("");
      setBlogs([]);
      try {
        const response = await blogService.getAll();
        const allBlogs = Array.isArray(response?.data) ? response.data : [];
        const scopedBlogs = user.role === "admin"
          ? allBlogs
          : allBlogs.filter((blog) => Number(blog.userId) === Number(user.id));
        if (isActive) setBlogs(scopedBlogs);
      } catch (requestError) {
        if (isActive) setError(requestError.message || "Unable to load your blogs.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadBlogs();
    return () => {
      isActive = false;
    };
  }, [user.id, user.role]);

  async function deleteBlog() {
    if (!selectedBlog || isDeleting) return;
    setIsDeleting(true);
    setError("");
    try {
      const response = await blogService.remove(selectedBlog.id);
      setBlogs((current) => current.filter((blog) => blog.id !== selectedBlog.id));
      setSuccess(response?.message || "Blog deleted successfully.");
      setSelectedBlog(null);
    } catch (requestError) {
      setError(requestError.message || "Unable to delete this blog.");
      setSelectedBlog(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const categories = getBlogCategories(blogs);
  const normalizedTitle = normalizeFilter(title);
  const normalizedCategory = normalizeFilter(category);
  const activeCategory = categories.find((item) => normalizeFilter(item) === normalizedCategory) ?? "";
  const normalizedActiveCategory = normalizeFilter(activeCategory);
  const hasActiveFilters = Boolean(normalizedTitle || normalizedActiveCategory);
  const filteredBlogs = blogs.filter((blog) => {
    const blogTitle = normalizeFilter(blog.blogTitle);
    const blogCategory = normalizeFilter(blog.category);
    return (!normalizedTitle || blogTitle.includes(normalizedTitle))
      && (!normalizedActiveCategory || blogCategory === normalizedActiveCategory);
  });

  if (isLoading) {
    return (
      <div className="min-w-0">
        <SearchBar defaultCategory={category} defaultValue={title} placeholder="Search by blog title..." />
        <div className="mt-8 grid animate-pulse gap-4 sm:grid-cols-2"><div className="h-40 rounded-2xl bg-slate-200" /><div className="h-40 rounded-2xl bg-slate-200" /><span className="sr-only">Loading blogs...</span></div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <SearchBar categories={categories} defaultCategory={activeCategory} defaultValue={title} placeholder="Search by blog title..." />
      <div className="mt-8 min-w-0">
      {success ? <div className="mb-5 flex min-w-0 items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status"><span className="min-w-0 break-words">{success}</span><button aria-label="Dismiss message" className="shrink-0 font-bold" onClick={() => setSuccess("")} type="button">×</button></div> : null}
      {error ? <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700" role="alert">{error}</div> : null}

      {error && blogs.length === 0 ? null : filteredBlogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
        <p className="font-bold text-slate-800">{hasActiveFilters ? "No blogs found." : user.role === "admin" ? "No blogs found." : "You have not created any blogs yet."}</p>
        <p className="mt-2 text-sm text-slate-500">{hasActiveFilters ? "Try another title or category." : user.role === "admin" ? "No blog has been published yet." : "Create your first blog to get started."}</p>
        {!hasActiveFilters ? <Link className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white" href="/dashboard/blogs/create">Create Blog</Link> : null}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {filteredBlogs.map((blog) => (
              <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" key={blog.id}>
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-3"><span className="max-w-full break-words rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{formatCategoryLabel(blog.category)}</span><span className="shrink-0 text-xs text-slate-500">{formatDate(blog.createAt)}</span></div>
                <h2 className="mt-3 break-words text-lg font-bold text-slate-900">{blog.blogTitle}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{blog.blog}</p>
                <p className="mt-3 text-xs text-slate-500">By {getAuthor(blog)}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold"><Link className="text-violet-600" href={`/blogs/${blog.id}`}>Read</Link><Link className="text-blue-600" href={`/dashboard/blogs/${blog.id}/edit`}>Edit</Link><button className="text-red-600" onClick={() => setSelectedBlog(blog)} type="button">Delete</button></div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-2xl text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Title</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Author</th><th className="px-5 py-4">Created</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBlogs.map((blog) => (
                    <tr className="text-sm text-slate-700" key={blog.id}><td className="max-w-xs px-5 py-4 font-bold text-slate-900"><span className="line-clamp-1">{blog.blogTitle}</span></td><td className="px-5 py-4"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{formatCategoryLabel(blog.category)}</span></td><td className="whitespace-nowrap px-5 py-4">{getAuthor(blog)}</td><td className="whitespace-nowrap px-5 py-4">{formatDate(blog.createAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-4 font-bold"><Link className="text-violet-600" href={`/blogs/${blog.id}`}>Read</Link><Link className="text-blue-600" href={`/dashboard/blogs/${blog.id}/edit`}>Edit</Link><button className="text-red-600" onClick={() => setSelectedBlog(blog)} type="button">Delete</button></div></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog confirmLabel="Delete Blog" isPending={isDeleting} message={selectedBlog ? `“${selectedBlog.blogTitle}” will be permanently removed.` : ""} onCancel={() => setSelectedBlog(null)} onConfirm={deleteBlog} open={Boolean(selectedBlog)} title="Are you sure you want to delete this blog?" />
      </div>
    </div>
  );
}
