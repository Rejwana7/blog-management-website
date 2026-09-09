"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { setPendingLoginEmail } from "@/utils/auth";
import { isRequired, isValidEmail } from "@/utils/validation";

const inputClassName = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

function FieldError({ id, message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm font-medium text-red-600" id={id}>{message}</p>;
}

export default function LoginForm({ registrationSuccessful = false }) {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!isRequired(values.email)) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!isRequired(values.password)) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await authService.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      const email = response?.data?.email;

      if (!response?.data?.requiresOtp || !email) {
        throw new Error("The server did not start OTP verification.");
      }

      setPendingLoginEmail(email);
      router.push("/verify-otp");
    } catch (error) {
      setServerError(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" noValidate onSubmit={handleSubmit}>
      {registrationSuccessful ? (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status">
          Registration successful. You can now log in.
        </div>
      ) : null}

      {serverError ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {serverError}
        </div>
      ) : null}

      <label className="block text-sm font-semibold text-slate-700">
        Email <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={errors.email ? "login-email-error" : undefined} aria-invalid={Boolean(errors.email)} autoComplete="email" className={inputClassName} name="email" onChange={handleChange} placeholder="you@example.com" required type="email" value={values.email} />
        <FieldError id="login-email-error" message={errors.email} />
      </label>

      <label className="mt-5 block text-sm font-semibold text-slate-700">
        Password <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={errors.password ? "login-password-error" : undefined} aria-invalid={Boolean(errors.password)} autoComplete="current-password" className={inputClassName} name="password" onChange={handleChange} placeholder="Enter your password" required type="password" value={values.password} />
        <FieldError id="login-password-error" message={errors.password} />
      </label>

      <div className="mt-4 text-right">
        <Link className="text-sm font-semibold text-violet-600 hover:text-violet-800" href="/forgot-password">Forgot Password?</Link>
      </div>

      <button className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending OTP…" : "Login"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Do not have an account? <Link className="font-bold text-violet-600 hover:text-violet-800" href="/register">Sign up</Link>
      </p>
    </form>
  );
}
