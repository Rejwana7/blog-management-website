import OTPInput from "@/components/OTPInput";
import PageShell from "@/components/PageShell";

export default function VerifyOtpPage() {
  return (
    <PageShell title="Verify OTP" description="Enter the six-digit code sent to your email.">
      <form className="max-w-md space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <OTPInput />
        <button className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white" type="submit">Verify code</button>
      </form>
    </PageShell>
  );
}
