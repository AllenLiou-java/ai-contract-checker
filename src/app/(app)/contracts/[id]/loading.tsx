export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-24 animate-pulse rounded bg-ink/5" />
      <div className="h-64 animate-pulse rounded-3xl bg-ink/10" />
      <div className="card h-40 animate-pulse" />
      <div className="card h-64 animate-pulse" />
    </div>
  );
}
