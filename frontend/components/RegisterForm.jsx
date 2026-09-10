"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { isRequired, isValidEmail, isValidName, passwordsMatch } from "@/utils/validation";

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const inputClassName = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

function FieldError({ id, message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm font-medium text-red-600" id={id}>{message}</p>;
}

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    let liveError = "";
    if (name === "firstname" && value && !isValidName(value)) {
      liveError = "First name can contain only letters and spaces.";
    }
    if (name === "lastname" && value && !isValidName(value)) {
      liveError = "Last name can contain only letters and spaces.";
    }
    if (name === "password" && value.length > 8) {
      liveError = "Password cannot exceed 8 characters.";
    }
    setErrors((current) => ({
      ...current,
      [name]: liveError,
    }));
    setServerError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!isRequired(values.firstname)) {
      nextErrors.firstname = "First name is required.";
    } else if (!isValidName(values.firstname)) {
      nextErrors.firstname = "First name can contain only letters and spaces.";
    }

    if (isRequired(values.lastname) && !isValidName(values.lastname)) {
      nextErrors.lastname = "Last name can contain only letters and spaces.";
    }

    if (!isRequired(values.email)) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!isRequired(values.password)) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 4) {
      nextErrors.password = "Password must be at least 4 characters.";
    } else if (values.password.length > 8) {
      nextErrors.password = "Password cannot exceed 8 characters.";
    }

    if (!isRequired(values.confirmPassword)) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (!passwordsMatch(values.password, values.confirmPassword)) {
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
      await authService.register({
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim() || null,
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      router.push("/login?registered=true");
    } catch (error) {
      setServerError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" noValidate onSubmit={handleSubmit}>
    

      {serverError ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{serverError}</div> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          First Name <span className="text-red-500" aria-hidden="true">*</span>
          <input aria-describedby={errors.firstname ? "firstname-error" : undefined} aria-invalid={Boolean(errors.firstname)} autoComplete="given-name" className={inputClassName} name="firstname" onChange={handleChange} placeholder="First name" required type="text" value={values.firstname} />
          <FieldError id="firstname-error" message={errors.firstname} />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Last Name <span className="font-normal text-slate-400">(optional)</span>
          <input aria-describedby={errors.lastname ? "lastname-error" : undefined} aria-invalid={Boolean(errors.lastname)} autoComplete="family-name" className={inputClassName} name="lastname" onChange={handleChange} placeholder="Last name" type="text" value={values.lastname} />
          <FieldError id="lastname-error" message={errors.lastname} />
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-700">
        Email <span className="text-red-500" aria-hidden="true">*</span>
        <input aria-describedby={errors.email ? "email-error" : undefined} aria-invalid={Boolean(errors.email)} autoComplete="email" className={inputClassName} name="email" onChange={handleChange} placeholder="you@example.com" required type="email" value={values.email} />
        <FieldError id="email-error" message={errors.email} />
      </label>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Password <span className="text-red-500" aria-hidden="true">*</span>
          <input aria-describedby={errors.password ? "password-error" : "password-help"} aria-invalid={Boolean(errors.password)} autoComplete="new-password" className={inputClassName} minLength={4} name="password" onChange={handleChange} placeholder="4–8 characters" required type="password" value={values.password} />
          <FieldError id="password-error" message={errors.password} />
          {!errors.password ? <p className="mt-1 text-xs font-normal text-slate-400" id="password-help">Use 4 to 8 characters.</p> : null}
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Confirm Password <span className="text-red-500" aria-hidden="true">*</span>
          <input aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined} aria-invalid={Boolean(errors.confirmPassword)} autoComplete="new-password" className={inputClassName} name="confirmPassword" onChange={handleChange} placeholder="Repeat password" required type="password" value={values.confirmPassword} />
          <FieldError id="confirm-password-error" message={errors.confirmPassword} />
        </label>
      </div>

      <button className="mt-7 w-full rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account…" : "Register"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link className="font-bold text-violet-600 hover:text-violet-800" href="/login">Log in</Link></p>
    </form>
  );
}
