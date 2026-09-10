export default function OTPInput({ value, onChange, error, disabled = false }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      One-time password <span className="text-red-500" aria-hidden="true">*</span>
      <input aria-describedby={error ? "otp-error" : "otp-help"} aria-invalid={Boolean(error)} autoComplete="one-time-code" className="mt-2 w-full min-w-0 rounded-xl border border-slate-300 px-3 py-3 text-center text-xl font-bold tracking-[0.3em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-100 sm:px-4 sm:tracking-[0.5em]" disabled={disabled} inputMode="numeric" name="otp" onChange={onChange} pattern="[0-9]{6}" placeholder="000000" required value={value} />
      {error ? <p className="mt-1.5 text-sm font-medium text-red-600" id="otp-error">{error}</p> : <p className="mt-1.5 text-xs font-normal text-slate-400" id="otp-help">Enter the six-digit code from your email.</p>}
    </label>
  );
}
