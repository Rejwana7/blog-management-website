import PublicLayout from "@/components/PublicLayout";
import VerifyOtpForm from "@/components/VerifyOtpForm";

export const metadata = {
  title: "Verify OTP | Blog Application",
  description: "Verify the one-time password sent to your email.",
};

export default function VerifyOtpPage() {
  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute -left-32 top-12 -z-10 size-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -right-32 bottom-12 -z-10 size-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">One more step</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Verify your login</h1>
            
          </div>
          <VerifyOtpForm />
        </div>
      </section>
    </PublicLayout>
  );
}
