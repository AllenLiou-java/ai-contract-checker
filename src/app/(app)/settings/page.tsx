import { Suspense } from "react";
import type { Metadata } from "next";
import { requireUser } from "@/lib/dal";
import ApiKeyForm from "@/components/ApiKeyForm";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "設定 | AI 合約審查器" };

async function ApiKeySection() {
  const user = await requireUser();
  return <ApiKeyForm last4={user.openaiKeyLast4} />;
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Settings" title="帳號設定" description="管理你用來進行 AI 審查的 OpenAI API Key。" />

      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">OpenAI API Key</h2>
        <p className="mb-6 mt-1 text-sm leading-relaxed text-slate-600">
          本服務採用 BYOK（Bring Your Own Key）模式，審查合約時會使用你自己的金鑰呼叫 OpenAI，費用由 OpenAI 直接向你計算。
        </p>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-ink/5" />}>
          <ApiKeySection />
        </Suspense>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-2 font-semibold">如何取得 API Key？</h3>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
            <li>
              登入{" "}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline-offset-2 hover:underline">
                OpenAI Platform
              </a>
            </li>
            <li>點選「Create new secret key」建立金鑰</li>
            <li>複製以 sk- 開頭的金鑰並貼到上方欄位</li>
          </ol>
        </div>
        <div className="card p-6">
          <h3 className="mb-2 font-semibold">我們如何保護你的金鑰</h3>
          <ul className="space-y-1.5 text-sm leading-relaxed text-slate-600">
            <li>・儲存前會先向 OpenAI 驗證金鑰是否有效</li>
            <li>・以 AES-256-GCM 加密後才寫入資料庫</li>
            <li>・只在伺服器端解密，絕不回傳到瀏覽器</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
