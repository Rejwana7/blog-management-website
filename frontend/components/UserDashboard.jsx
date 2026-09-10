"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { blogService } from "@/services/blog.service";

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Loading dashboard" role="status">
      <div className="space-y-3"><div className="h-8 w-56 rounded bg-slate-200" /><div className="h-4 w-72 max-w-full rounded bg-slate-200" /></div>
      <div className="grid gap-4 sm:grid-cols-2"><div className="h-32 rounded-2xl bg-slate-200" /><div className="h-32 rounded-2xl bg-slate-200" /></div>
      <div className="grid gap-4 lg:grid-cols-3"><div className="h-40 rounded-2xl bg-slate-200" /><div className="h-40 rounded-2xl bg-slate-200" /><div className="h-40 rounded-2xl bg-slate-200" /></div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadBlogs() {
      try {
        const response = await blogService.getAll();
        const allBlogs = Array.isArray(response?.data) ? response.data : [];
        const ownBlogs = allBlogs.filter((blog) => Number(blog.userId) === Number(user.id));
        if (isActive) setBlogs(ownBlogs);
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
  }, [user.id]);

  const recentBlogs = blogs.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
      {isLoading ? <DashboardSkeleton /> : (
        <>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">User dashboard</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome, {user.firstname}</h1>
              <p className="mt-2 text-slate-600">Manage your profile and everything you publish.</p>
            </div>
            <Link className="rounded-xl bg-violet-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700" href="/dashboard/blogs/create">Create a blog</Link>
          </div>

          {error ? <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700" role="alert">{error}</div> : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Your blogs</p>
              <p className="mt-3 text-4xl font-black text-slate-950">{blogs.length}</p>
              <Link className="mt-4 inline-block text-sm font-bold text-violet-600" href="/dashboard/blogs">View all blogs →</Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-600 to-sky-500 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-violet-100">Profile information</p>
              <p className="mt-3 truncate text-lg font-black">{user.email}</p>
              <p className="mt-1 text-sm capitalize text-violet-100">Role: {user.role}</p>
              <Link className="mt-4 inline-block text-sm font-bold text-white" href="/dashboard/profile">Manage profile →</Link>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">Your writing</p><h2 className="mt-2 text-2xl font-black text-slate-950">Recent blogs</h2></div>
              {blogs.length > 3 ? <Link className="text-sm font-bold text-violet-600" href="/dashboard/blogs">See all</Link> : null}
            </div>

            {!error && recentBlogs.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-bold text-slate-800">You have not created any blogs yet.</p>
                <p className="mt-2 text-sm text-slate-500">Create your first blog and it will appear here.</p>
                <Link className="mt-5 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white" href="/dashboard/blogs/create">Create first blog</Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {recentBlogs.map((blog) => (
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={blog.id}>
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-600">{blog.category}</p>
                    <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">{blog.blogTitle}</h3>
                    <div className="mt-5 flex gap-4 text-sm font-bold"><Link className="text-violet-600" href={`/blogs/${blog.id}`}>Read</Link><Link className="text-slate-600" href={`/dashboard/blogs/${blog.id}/edit`}>Edit</Link></div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
