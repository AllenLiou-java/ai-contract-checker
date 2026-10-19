import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/dal";
import UploadForm from "@/components/UploadForm";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "審查合約 | AI 合約審查器" };

async function ApiKeyNotice() {
  const user = await requireUser();
  if (user.openaiKeyLast4) {
    return (
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        使用你的 API Key <span className="font-mono">sk-…{user.openaiKeyLast4}</span>
        <Link href="/settings" className="text-brand-700 hover:underline">
          更換
        </Link>
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-amber-900">尚未設定 OpenAI API Key</p>
        <p className="mt-0.5 text-sm text-amber-800/80">本服務採用 BYOK 模式，請先設定你自己的金鑰才能開始審查。</p>
      </div>
      <Link href="/settings" className="shrink-0 rounded-full bg-amber-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-amber-950">
        前往設定
      </Link>
    </div>
  );
}

const TIPS = [
  { title: "重點摘要", text: "當事人、期限、金額一次整理" },
  { title: "風險分級", text: "高、中、低風險條款逐條標示" },
  { title: "修改建議", text: "可直接拿去談判的替代方案" },
];

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="New review" title="上傳合約，開始審查" description="AI 會整理合約重點、標出不利或模糊的條款，並提供修改建議。" />
      <Suspense fallback={<div className="h-5 w-56 animate-pulse rounded bg-ink/5" />}>
        <ApiKeyNotice />
      </Suspense>
      <UploadForm />
      <div className="grid gap-4 sm:grid-cols-3">
        {TIPS.map((tip) => (
          <div key={tip.title} className="rounded-2xl border border-ink/[0.06] bg-white/60 p-5">
            <p className="text-sm font-semibold">{tip.title}</p>
            <p className="mt-1 text-sm text-slate-500">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
