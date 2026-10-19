import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { requireUser } from "@/lib/dal";
import { Contract } from "@/models/Contract";
import RiskBadge from "@/components/RiskBadge";

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="card p-6 sm:p-7">
      <h2 className="mb-5 flex items-center gap-2 font-serif text-xl font-bold">
        {title}
        {count !== undefined && (
          <span className="rounded-full bg-ink/5 px-2 py-0.5 font-sans text-xs font-medium text-slate-500">{count}</span>
        )}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-slate-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

export default async function ContractDetailPage({ params }: PageProps<"/contracts/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  // 只查詢屬於目前使用者的合約；別人的合約一律當作不存在
  const contract = await Contract.findOne({ _id: id, user: user.id }).lean();
  if (!contract?.analysis) notFound();
  const { analysis } = contract;

  const risks = [...analysis.risks].sort(
    (a, b) => SEVERITY_ORDER[a.severity ?? "medium"] - SEVERITY_ORDER[b.severity ?? "medium"],
  );
  const counts = {
    high: risks.filter((r) => r.severity === "high").length,
    medium: risks.filter((r) => r.severity === "medium").length,
    low: risks.filter((r) => r.severity === "low").length,
  };

  return (
    <div className="space-y-6">
      <Link href="/contracts" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        ← 審查紀錄
      </Link>

      {/* 報告封面 */}
      <section className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-9">
        <div className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">{analysis.contractType}</p>
            <h1 className="mt-2 break-all font-serif text-2xl font-bold sm:text-3xl">{contract.fileName}</h1>
            <p className="mt-2 text-sm text-slate-400">審查於 {contract.createdAt.toLocaleString("zh-TW")}</p>
          </div>
          <a
            href={`/api/contracts/${id}/file`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            查看原始檔案 ↗
          </a>
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-slate-400">整體風險</p>
            <div className="mt-2">
              <RiskBadge level={analysis.overallRisk} />
            </div>
          </div>
          {[
            { label: "高風險條款", value: counts.high, color: "text-red-300" },
            { label: "中風險條款", value: counts.medium, color: "text-amber-300" },
            { label: "低風險條款", value: counts.low, color: "text-emerald-300" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`mt-1 font-serif text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      <Section title="摘要">
        <p className="leading-loose text-slate-700">{analysis.summary}</p>
        {analysis.parties.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {analysis.parties.map((party) => (
              <span key={party} className="rounded-full bg-paper px-3 py-1 text-sm text-slate-600 ring-1 ring-inset ring-ink/[0.08]">
                {party}
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section title="重要條款" count={analysis.keyTerms.length}>
        <dl className="grid gap-3 sm:grid-cols-2">
          {analysis.keyTerms.map((term, i) => (
            <div key={i} className="rounded-2xl bg-paper p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{term.title}</dt>
              <dd className="mt-1.5 leading-relaxed text-slate-800">{term.content}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="風險條款" count={risks.length}>
        <ul className="space-y-4">
          {risks.map((risk, i) => (
            <li key={i} className="rounded-2xl border border-ink/[0.08] p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="font-semibold leading-relaxed">{risk.clause}</p>
                <RiskBadge level={risk.severity} />
              </div>
              <p className="leading-relaxed text-slate-700">{risk.issue}</p>
              <div className="mt-4 rounded-xl border-l-2 border-brand-500 bg-brand-50/70 px-4 py-3 text-sm leading-relaxed text-brand-900">
                <span className="font-semibold">修改建議　</span>
                {risk.suggestion}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        {analysis.missingClauses.length > 0 && (
          <Section title="建議補充的條款">
            <BulletList items={analysis.missingClauses} />
          </Section>
        )}
        <Section title="簽約建議">
          <BulletList items={analysis.recommendations} />
        </Section>
      </div>

      <p className="text-center text-xs text-slate-400">由 {contract.model} 產生，僅供參考，不構成法律意見。</p>
    </div>
  );
}
