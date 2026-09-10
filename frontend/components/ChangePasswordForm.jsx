"use client";

import { useState } from "react";
import { userService } from "@/services/user.service";
import { isRequired, isValidPassword, passwordsMatch } from "@/utils/validation";

const inputClassName = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

function FieldError({ id, message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm font-medium text-red-600" id={id}>{message}</p>;
}

export default function ChangePasswordForm() {
  const [values, setValues] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
    setSuccessMessage("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!isRequired(values.newPassword)) {
      nextErrors.newPassword = "New password is required.";
    } else if (!isValidPassword(values.newPassword)) {
      nextErrors.newPassword = "Password must be between 4 and 8 characters.";
    }

    if (!isRequired(values.confirmPassword)) {
      nextErrors.confirmPassword = "Confirm new password is required.";
    } else if (!passwordsMatch(values.newPassword, values.confirmPassword)) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await userService.changePassword({ password: values.newPassword });
      setValues({ newPassword: "", confirmPassword: "" });
      setSuccessMessage(response?.message || "Password changed successfully.");
    } catch (error) {
      setServerError(error.message || "Unable to change your password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="w-full min-w-0 max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8" noValidate onSubmit={handleSubmit}>
      {serverError ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{serverError}</div> : null}
      {successMessage ? <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">{successMessage}</div> : null}

      <label className="block text-sm font-semibold text-slate-700" htmlFor="new-password">
        New Password <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={errors.newPassword ? "new-password-error" : "new-password-help"} aria-invalid={Boolean(errors.newPassword)} autoComplete="new-password" className={inputClassName} id="new-password" minLength={4} name="newPassword" onChange={handleChange} placeholder="4–8 characters" required type="password" value={values.newPassword} />
        <FieldError id="new-password-error" message={errors.newPassword} />
        {!errors.newPassword ? <p className="mt-1.5 text-xs font-normal text-slate-400" id="new-password-help">Use 4 to 8 characters.</p> : null}
      </label>

      <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="confirm-new-password">
        Confirm New Password <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={errors.confirmPassword ? "confirm-new-password-error" : undefined} aria-invalid={Boolean(errors.confirmPassword)} autoComplete="new-password" className={inputClassName} id="confirm-new-password" minLength={4} name="confirmPassword" onChange={handleChange} placeholder="Repeat your new password" required type="password" value={values.confirmPassword} />
        <FieldError id="confirm-new-password-error" message={errors.confirmPassword} />
      </label>

      <div className="mt-7 border-t border-slate-100 pt-6 sm:text-right">
        <button className="w-full rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
