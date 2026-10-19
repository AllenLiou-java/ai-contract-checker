import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { Contract } from "@/models/Contract";
import RiskBadge from "@/components/RiskBadge";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "審查紀錄 | AI 合約審查器" };

export default async function ContractsPage() {
  const user = await requireUser();
  const contracts = await Contract.find({ user: user.id })
    .select("fileName analysis.contractType analysis.overallRisk analysis.risks createdAt")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="History" title="審查紀錄" description={`共 ${contracts.length} 份合約`}>
        <Link href="/upload" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-ink-soft">
          ＋ 審查新合約
        </Link>
      </PageHeader>

      {contracts.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <p className="font-serif text-xl font-bold">還沒有審查紀錄</p>
          <p className="mt-2 text-sm text-slate-500">上傳第一份合約，一分鐘內取得完整的審查報告。</p>
          <Link href="/upload" className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-soft">
            開始審查
          </Link>
        </div>
      ) : (
        <ul className="card divide-y divide-ink/[0.06] overflow-hidden">
          {contracts.map((c) => (
            <li key={c._id.toString()}>
              <Link
                href={`/contracts/${c._id.toString()}`}
                className="group flex items-center gap-4 px-5 py-4 transition hover:bg-paper"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.04] font-mono text-[10px] font-semibold uppercase text-slate-500">
                  {c.fileName.split(".").pop()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.fileName}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {c.analysis?.contractType}・{c.analysis?.risks?.length ?? 0} 項風險・
                    {c.createdAt.toLocaleDateString("zh-TW")}
                  </p>
                </div>
                <RiskBadge level={c.analysis?.overallRisk} />
                <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
