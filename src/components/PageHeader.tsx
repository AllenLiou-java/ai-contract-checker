export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{eyebrow}</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-slate-600">{description}</p>}
      </div>
      {children}
    </div>
  );
}
