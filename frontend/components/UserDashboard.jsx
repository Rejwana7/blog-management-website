"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { blogService } from "@/services/blog.service";
import { userService } from "@/services/user.service";
import { formatCategoryLabel, getBlogCategories } from "@/utils/blogs";

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Loading dashboard" role="status">
      <div className="space-y-3">
        <div className="h-8 w-56 rounded bg-slate-200" />
        <div className="h-4 w-72 max-w-full rounded bg-slate-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="h-36 rounded-2xl bg-slate-200" />
        <div className="h-36 rounded-2xl bg-slate-200" />
        <div className="h-36 rounded-2xl bg-slate-200" />
        <div className="h-36 rounded-2xl bg-slate-200" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-40 rounded-2xl bg-slate-200" />
        <div className="h-40 rounded-2xl bg-slate-200" />
        <div className="h-40 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, href, linkLabel }) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
      {href ? (
        <Link className="mt-4 inline-block text-sm font-bold text-violet-600 hover:text-violet-800" href={href}>
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </article>
  );
}

function ProfileCard({ user }) {
  return (
    <article className="min-w-0 rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 p-5 text-white shadow-sm sm:p-6">
      <p className="text-sm font-semibold text-violet-100">Profile information</p>
      <p className="mt-3 break-all text-base font-black sm:text-lg">{user.email}</p>
      <p className="mt-1 text-sm capitalize text-violet-100">Role: {user.role}</p>
      <Link className="mt-4 inline-block text-sm font-bold text-white hover:text-violet-100" href="/dashboard/profile">
        Edit profile <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const [blogs, setBlogs] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);
  const [blogLoadFailed, setBlogLoadFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const blogRequest = blogService.getAll();
        const usersRequest = isAdmin
          ? userService.getAll({ page: 1, limit: 1 })
          : Promise.resolve(null);
        const [blogResult, usersResult] = await Promise.allSettled([blogRequest, usersRequest]);

        if (!isActive) return;
        const errors = [];

        if (blogResult.status === "fulfilled") {
          const allBlogs = Array.isArray(blogResult.value?.data) ? blogResult.value.data : [];
          const visibleBlogs = isAdmin
            ? allBlogs
            : allBlogs.filter((blog) => Number(blog.userId) === Number(user.id));
          setBlogs(visibleBlogs);
          setBlogLoadFailed(false);
        } else {
          setBlogs([]);
          setBlogLoadFailed(true);
          errors.push(blogResult.reason?.message || "Unable to load blogs.");
        }

        if (isAdmin) {
          if (usersResult.status === "fulfilled") {
            setTotalUsers(Number(usersResult.value?.data?.pagination?.totalUsers) || 0);
          } else {
            setTotalUsers(null);
            errors.push(usersResult.reason?.message || "Unable to load the user total.");
          }
        } else {
          setTotalUsers(null);
        }

        setError(errors.join(" "));
      } catch (requestError) {
        if (isActive) {
          setBlogs([]);
          setBlogLoadFailed(true);
          setTotalUsers(null);
          setError(requestError.message || "Unable to load dashboard information.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isActive = false;
    };
  }, [isAdmin, user.id]);

  const recentBlogs = blogs.slice(0, 3);
  const totalCategories = getBlogCategories(blogs).length;

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="flex min-w-0 flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">
                {isAdmin ? "Admin dashboard" : "User dashboard"}
              </p>
              <h1 className="mt-2 break-words text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Welcome, {user.firstname}
              </h1>
            </div>
            <Link className="rounded-xl bg-violet-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700" href="/dashboard/blogs/create">
              Create a blog
            </Link>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700" role="alert">
              {error}
            </div>
          ) : null}

          {isAdmin ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard href="/dashboard/blogs" label="Total blogs" linkLabel="View all blogs" value={blogLoadFailed ? "—" : blogs.length} />
              <MetricCard href="/admin/users" label="Total users" linkLabel="Manage users" value={totalUsers ?? "—"} />
              <MetricCard href="/dashboard/blogs" label="Total categories" linkLabel="View categories" value={blogLoadFailed ? "—" : totalCategories} />
              <ProfileCard user={user} />
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MetricCard href="/dashboard/blogs" label="Your blogs" linkLabel="View all blogs" value={blogLoadFailed ? "—" : blogs.length} />
              <ProfileCard user={user} />
            </div>
          )}

          <div className="mt-10">
            <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">
                  {isAdmin ? "Latest activity" : "Your writing"}
                </p>
                <h2 className="mt-2 break-words text-2xl font-black text-slate-950">Recent blogs</h2>
              </div>
              {blogs.length > 3 ? (
                <Link className="text-sm font-bold text-violet-600 hover:text-violet-800" href="/dashboard/blogs">
                  See all
                </Link>
              ) : null}
            </div>

            {blogLoadFailed ? null : recentBlogs.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
                <p className="font-bold text-slate-800">
                  {isAdmin ? "No blogs have been published yet." : "You have not created any blogs yet."}
                </p>
                <p className="mt-2 text-sm text-slate-500">Create the first blog and it will appear here.</p>
                <Link className="mt-5 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white" href="/dashboard/blogs/create">
                  Create first blog
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {recentBlogs.map((blog) => (
                  <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={blog.id}>
                    <p className="break-words text-xs font-bold uppercase tracking-wider text-violet-600">
                      {formatCategoryLabel(blog.category)}
                    </p>
                    <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">{blog.blogTitle}</h3>
                    <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
                      <Link className="text-violet-600" href={`/blogs/${blog.id}`}>Read</Link>
                      <Link className="text-slate-600" href={`/dashboard/blogs/${blog.id}/edit`}>Edit</Link>
                    </div>
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
