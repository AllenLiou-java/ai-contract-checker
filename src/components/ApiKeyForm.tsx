"use client";

import { useEffect, useState, useTransition } from "react";
import { manageApiKey, type ApiKeyState } from "@/app/actions/settings";

export default function ApiKeyForm({ last4 }: { last4: string | null }) {
  // 不用 useActionState：頁面被 Next 保留在背景再切回來時，它會重新讀取已完成的 action promise 而報錯
  const [state, setState] = useState<ApiKeyState>();
  const [pending, startTransition] = useTransition();
  const [visible, setVisible] = useState(false);

  // Next 會保留離開過的頁面狀態；頁面被隱藏時清掉訊息，回來時才不會看到上次操作的舊結果
  useEffect(() => () => setState(undefined), []);

  function action(formData: FormData) {
    startTransition(async () => {
      setState(await manageApiKey(undefined, formData));
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-ink/[0.08] bg-paper px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${last4 ? "bg-brand-500" : "bg-amber-400"}`} />
          <div>
            <p className="text-sm font-medium">{last4 ? "已設定 API Key" : "尚未設定 API Key"}</p>
            <p className="font-mono text-xs text-slate-500">{last4 ? `sk-••••••••••••${last4}` : "設定後才能使用 AI 審查"}</p>
          </div>
        </div>
        {last4 && (
          <form action={action}>
            <button
              type="submit"
              name="intent"
              value="delete"
              disabled={pending}
              className="rounded-full px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              刪除
            </button>
          </form>
        )}
      </div>

      <form action={action} className="space-y-3">
        <label htmlFor="apiKey" className="text-sm font-medium">
          {last4 ? "更換 API Key" : "輸入 API Key"}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              id="apiKey"
              name="apiKey"
              type={visible ? "text" : "password"}
              required
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-proj-..."
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 pr-16 font-mono text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-ink/5"
            >
              {visible ? "隱藏" : "顯示"}
            </button>
          </div>
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={pending}
            className="rounded-xl bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-soft disabled:bg-slate-300"
          >
            {pending ? "處理中…" : "驗證並儲存"}
          </button>
        </div>
      </form>

      {state?.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">{state.success}</p>}
    </div>
  );
}
