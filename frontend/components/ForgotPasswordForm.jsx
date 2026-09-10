"use client";

import Link from "next/link";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { isRequired, isValidEmail } from "@/utils/validation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setEmail(event.target.value);
    setEmailError("");
    setServerError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!isRequired(email)) {
      setEmailError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await authService.forgotPassword({ email: normalizedEmail });
      setSuccessMessage(response?.message || "Password reset link has been sent to your email.");
      setEmail("");
    } catch (error) {
      setServerError(error.message || "Unable to send the reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" noValidate onSubmit={handleSubmit}>
      {successMessage ? (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-700" role="status">
          {successMessage}
        </div>
      ) : null}

      {serverError ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {serverError}
        </div>
      ) : null}

      <label className="block text-sm font-semibold text-slate-700">
        Email <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={emailError ? "forgot-email-error" : "forgot-email-help"} aria-invalid={Boolean(emailError)} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100" disabled={isSubmitting} name="email" onChange={handleChange} placeholder="you@example.com" required type="email" value={email} />
        {emailError ? <p className="mt-1.5 text-sm font-medium text-red-600" id="forgot-email-error">{emailError}</p> : <p className="mt-1.5 text-xs font-normal text-slate-400" id="forgot-email-help">Use the email registered with your account.</p>}
      </label>

      <button className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending reset link…" : "Send Reset Link"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password? <Link className="font-bold text-violet-600 hover:text-violet-800" href="/login">Back to login</Link>
      </p>
    </form>
  );
}
