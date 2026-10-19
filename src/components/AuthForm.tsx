"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup } from "@/app/actions/auth";
import { LogoMark } from "@/components/Logo";

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-100";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [state, action, pending] = useActionState(isSignup ? signup : login, undefined);

  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="mb-8 flex flex-col items-center text-center">
        <LogoMark className="h-11 w-11" />
        <h1 className="mt-5 font-serif text-3xl font-bold">{isSignup ? "建立你的帳號" : "歡迎回來"}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {isSignup ? "免費註冊，設定 API Key 後即可開始審查合約" : "登入以繼續審查你的合約"}
        </p>
      </div>

      <div className="card p-7 sm:p-8">
        <form action={action} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              defaultValue={state?.email}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={isSignup ? 8 : undefined}
              placeholder={isSignup ? "至少 8 個字元" : "••••••••"}
              className={inputClass}
            />
          </div>

          {isSignup && (
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                確認密碼
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="再輸入一次密碼"
                className={inputClass}
              />
            </div>
          )}

          {state?.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 font-medium text-white shadow-lg shadow-ink/15 transition hover:bg-ink-soft disabled:bg-slate-300 disabled:shadow-none"
          >
            {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
            {pending ? "處理中…" : isSignup ? "建立帳號" : "登入"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        {isSignup ? "已經有帳號了？" : "還沒有帳號？"}
        <Link href={isSignup ? "/login" : "/signup"} className="ml-1 font-medium text-brand-700 hover:underline">
          {isSignup ? "登入" : "免費註冊"}
        </Link>
      </p>
    </div>
  );
}
