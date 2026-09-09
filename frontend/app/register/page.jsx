import PublicLayout from "@/components/PublicLayout";
import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Register | Blog Application",
  description: "Create your Blog Application account.",
};

export default function RegisterPage() {
  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute -left-32 top-12 -z-10 size-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -right-32 bottom-12 -z-10 size-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">Join the community</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Create your account</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Register to write, publish, and manage your own blogs.</p>
          </div>
          <RegisterForm />
        </div>
      </section>
    </PublicLayout>
  );
}
