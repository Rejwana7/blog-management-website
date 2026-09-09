export default function PageShell({ title, description, children }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      {description ? <p className="mt-2 text-slate-600">{description}</p> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
