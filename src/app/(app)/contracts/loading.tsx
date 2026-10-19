export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-ink/5" />
        <div className="h-9 w-48 animate-pulse rounded-lg bg-ink/5" />
      </div>
      <div className="card space-y-4 p-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-ink/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-ink/5" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-ink/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
