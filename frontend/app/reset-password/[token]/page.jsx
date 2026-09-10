import PublicLayout from "@/components/PublicLayout";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | Blog Application",
  description: "Choose a new password for your account.",
};

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute -left-32 top-12 -z-10 size-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -right-32 bottom-12 -z-10 size-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">Secure your account</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Reset your password</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Create a new password for your Blog Application account.</p>
          </div>
          <ResetPasswordForm token={token} />
        </div>
      </section>
    </PublicLayout>
  );
}
