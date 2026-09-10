export default function PageShell({
  title,
  description,
  children,
  titleClassName = "break-words text-2xl font-bold text-slate-900 sm:text-3xl",
  descriptionClassName = "text-slate-600",
}) {
  return (
    <section className="mx-auto w-full min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

      <h1 className={titleClassName}>
        {title}
      </h1>

      {description ? (
        <p className={`mt-2 break-words ${descriptionClassName}`}>
          {description}
        </p>
      ) : null}

      {children ? (
        <div className="mt-8 min-w-0">
          {children}
        </div>
      ) : null}

    </section>
  );
}
