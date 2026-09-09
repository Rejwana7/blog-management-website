"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OTPInput from "./OTPInput";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { getPendingLoginEmail, removePendingLoginEmail, setToken } from "@/utils/auth";
import { isRequired, isValidOtp } from "@/utils/validation";

export default function VerifyOtpForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const value = event.target.value;
    setOtp(value);
    setServerError("");

    if (value && !/^\d+$/.test(value)) {
      setError("OTP can contain only numbers.");
    } else if (value.length > 6) {
      setError("OTP must be exactly 6 digits.");
    } else {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const email = getPendingLoginEmail();

    if (!isRequired(otp)) {
      setError("OTP is required.");
      return;
    }
    if (!isValidOtp(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }
    if (!email) {
      setServerError("Your login session was not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await authService.verifyOtp({ email, otp });
      const token = response?.data?.token;

      if (!token) throw new Error("Authentication token was not returned.");

      setToken(token);

      let authenticatedUser = response?.data?.user ?? null;
      try {
        const profileResponse = await userService.getProfile();
        authenticatedUser = profileResponse?.data ?? authenticatedUser;
      } catch {
        // The verified user returned by the OTP endpoint is a safe fallback.
      }

      setUser(authenticatedUser);
      removePendingLoginEmail();
      router.replace("/dashboard");
    } catch (requestError) {
      setServerError(requestError.message || "OTP verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" noValidate onSubmit={handleSubmit}>
      {serverError ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{serverError}</div> : null}

      <OTPInput disabled={isSubmitting} error={error} onChange={handleChange} value={otp} />

      <button className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Verifying…" : "Verify OTP"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Wrong account? <Link className="font-bold text-violet-600 hover:text-violet-800" href="/login">Back to login</Link>
      </p>
    </form>
  );
}
