"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { blogService } from "@/services/blog.service";

function validate(values) {
  const errors = {};
  if (!values.blogTitle.trim()) errors.blogTitle = "Blog title is required.";
  if (!values.category.trim()) errors.category = "Category is required.";
  if (!values.blog.trim()) errors.blog = "Blog content is required.";
  return errors;
}

export default function BlogForm({ mode = "create", blogId, initialValues = {} }) {
  const router = useRouter();
  const [values, setValues] = useState({
    blogTitle: initialValues.blogTitle ?? "",
    category: initialValues.category ?? "",
    blog: initialValues.blog ?? "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = mode === "edit";

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSubmitting(true);
    setServerError("");
    const payload = {
      blogTitle: values.blogTitle.trim(),
      category: values.category.trim(),
      blog: values.blog.trim(),
    };

    try {
      if (isEditing) {
        await blogService.update(blogId, payload);
        router.push("/dashboard/blogs?updated=true");
      } else {
        await blogService.create(payload);
        router.push("/dashboard/blogs?created=true");
      }
      router.refresh();
    } catch (error) {
      setServerError(error.message || `Unable to ${isEditing ? "update" : "publish"} the blog.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (hasError) => `w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${hasError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-violet-500 focus:ring-violet-100"}`;

  return (
    <form className="min-w-0 space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8" noValidate onSubmit={handleSubmit}>
      {serverError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{serverError}</div> : null}

      <label className="block" htmlFor="blogTitle">
        <span className="mb-2 block text-sm font-bold text-slate-800">Blog Title <span className="text-red-500" aria-hidden="true">*</span></span>
        <input aria-describedby="blogTitle-help blogTitle-error" aria-invalid={Boolean(errors.blogTitle)} className={inputClass(errors.blogTitle)} id="blogTitle" name="blogTitle" onChange={updateField} placeholder="e.g. Introduction to Playwright" value={values.blogTitle} />
        {errors.blogTitle ? <p className="mt-2 text-sm text-red-600" id="blogTitle-error">{errors.blogTitle}</p> : <p className="mt-2 text-xs text-slate-500" id="blogTitle-help">Use a clear title that tells readers exactly what they will learn.</p>}
      </label>

      <div>
        <label className="block" htmlFor="category">
          <span className="mb-2 block text-sm font-bold text-slate-800">Category <span className="text-red-500" aria-hidden="true">*</span></span>
          <input aria-describedby="category-help category-error" aria-invalid={Boolean(errors.category)} className={inputClass(errors.category)} id="category" name="category" onChange={updateField} placeholder="Enter a category" value={values.category} />
        </label>
        {errors.category ? <p className="mt-2 text-sm text-red-600" id="category-error">{errors.category}</p> : <p className="mt-2 text-xs text-slate-500" id="category-help">Enter any category that best describes your blog.</p>}
      </div>

      <label className="block" htmlFor="blog">
        <span className="mb-2 block text-sm font-bold text-slate-800">Blog Content <span className="text-red-500" aria-hidden="true">*</span></span>
        <textarea aria-describedby={errors.blog ? "blog-error" : undefined} aria-invalid={Boolean(errors.blog)} className={`${inputClass(errors.blog)} min-h-64 resize-y leading-7`} id="blog" name="blog" onChange={updateField} placeholder="Share what you learned, explain the key ideas, and include a practical example..." value={values.blog} />
        {errors.blog ? <p className="mt-2 text-sm text-red-600" id="blog-error">{errors.blog}</p> : null}
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <button className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" disabled={isSubmitting} onClick={() => router.back()} type="button">Cancel</button>
        <button className="w-full rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" disabled={isSubmitting} type="submit">{isSubmitting ? (isEditing ? "Saving..." : "Publishing...") : (isEditing ? "Save Changes" : "Publish Blog")}</button>
      </div>
    </form>
  );
}
