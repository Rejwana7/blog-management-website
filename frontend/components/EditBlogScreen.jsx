"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogForm from "@/components/BlogForm";
import { useAuth } from "@/contexts/AuthContext";
import { blogService } from "@/services/blog.service";

export default function EditBlogScreen({ blogId }) {
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    async function loadBlog() {
      try {
        const response = await blogService.getById(blogId);
        if (isActive) setBlog(response?.data ?? null);
      } catch (requestError) {
        if (isActive) setError(requestError.message || "Unable to load this blog.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    loadBlog();
    return () => { isActive = false; };
  }, [blogId]);

  if (isLoading) return <div className="max-w-3xl animate-pulse space-y-5 rounded-2xl border border-slate-200 bg-white p-8"><div className="h-12 rounded-xl bg-slate-200" /><div className="h-12 rounded-xl bg-slate-200" /><div className="h-64 rounded-xl bg-slate-200" /><span className="sr-only">Loading blog...</span></div>;
  if (error || !blog) return <div className="max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700" role="alert">{error || "Blog not found."}</div>;

  const ownsBlog = Number(blog.userId) === Number(user.id);
  if (user.role !== "admin" && !ownsBlog) {
    return <div className="max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6"><h2 className="font-bold text-amber-900">Access denied</h2><p className="mt-2 text-sm text-amber-800">You can edit only blogs that you created.</p><Link className="mt-4 inline-block text-sm font-bold text-violet-700" href="/dashboard/blogs">Back to My Blogs</Link></div>;
  }

  return <div className="max-w-3xl"><BlogForm blogId={blogId} initialValues={blog} mode="edit" /></div>;
}
