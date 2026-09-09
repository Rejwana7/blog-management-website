export default function OTPInput() {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">One-time password</span>
      <input autoComplete="one-time-code" className="w-full rounded-lg border border-slate-300 px-3 py-2 tracking-[0.5em]" inputMode="numeric" maxLength={6} name="otp" pattern="[0-9]{6}" placeholder="000000" required />
    </label>
  );
}
