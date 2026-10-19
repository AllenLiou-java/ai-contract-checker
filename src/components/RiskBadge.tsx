import type { Severity } from "@/lib/analyze";

const STYLES: Record<Severity, { label: string; className: string; dot: string }> = {
  low: { label: "低風險", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  medium: { label: "中風險", className: "bg-amber-50 text-amber-700 ring-amber-600/20", dot: "bg-amber-500" },
  high: { label: "高風險", className: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
};

export default function RiskBadge({ level }: { level?: Severity | null }) {
  const style = STYLES[level ?? "medium"];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
