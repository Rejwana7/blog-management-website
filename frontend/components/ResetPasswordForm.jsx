"use client";

import Link from "next/link";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { isRequired, passwordsMatch } from "@/utils/validation";

const inputClassName = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

function FieldError({ id, message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm font-medium text-red-600" id={id}>{message}</p>;
}

export default function ResetPasswordForm({ token }) {
  const [values, setValues] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: name === "newPassword" && value.length > 8
        ? "Password cannot exceed 8 characters."
        : "",
    }));
    setServerError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!isRequired(values.newPassword)) {
      nextErrors.newPassword = "New password is required.";
    } else if (values.newPassword.length < 4) {
      nextErrors.newPassword = "Password must be at least 4 characters.";
    } else if (values.newPassword.length > 8) {
      nextErrors.newPassword = "Password cannot exceed 8 characters.";
    }

    if (!isRequired(values.confirmPassword)) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (!passwordsMatch(values.newPassword, values.confirmPassword)) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
      const response = await authService.resetPassword(token, values);
      setSuccessMessage(response?.message || "Password reset successfully.");
      setValues({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      setServerError(error.message || "Unable to reset your password. Please request a new link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-xl text-emerald-700" aria-hidden="true">&#10003;</div>
        <h2 className="mt-5 text-xl font-bold text-slate-900">Password updated</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600" role="status">{successMessage}</p>
        <Link className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-700" href="/login">Go to login</Link>
      </div>
    );
  }

  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" noValidate onSubmit={handleSubmit}>
      {serverError ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{serverError}</div> : null}

      <label className="block text-sm font-semibold text-slate-700">
        New Password <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={errors.newPassword ? "new-password-error" : "new-password-help"} aria-invalid={Boolean(errors.newPassword)} autoComplete="new-password" className={inputClassName} minLength={4} name="newPassword" onChange={handleChange} placeholder="4–8 characters" required type="password" value={values.newPassword} />
        <FieldError id="new-password-error" message={errors.newPassword} />
        {!errors.newPassword ? <p className="mt-1.5 text-xs font-normal text-slate-400" id="new-password-help">Use 4 to 8 characters.</p> : null}
      </label>

      <label className="mt-5 block text-sm font-semibold text-slate-700">
        Confirm Password <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={errors.confirmPassword ? "reset-confirm-password-error" : undefined} aria-invalid={Boolean(errors.confirmPassword)} autoComplete="new-password" className={inputClassName} name="confirmPassword" onChange={handleChange} placeholder="Repeat your new password" required type="password" value={values.confirmPassword} />
        <FieldError id="reset-confirm-password-error" message={errors.confirmPassword} />
      </label>

      <button className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Resetting password…" : "Reset Password"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Return to <Link className="font-bold text-violet-600 hover:text-violet-800" href="/login">Login</Link>
      </p>
    </form>
  );
}
