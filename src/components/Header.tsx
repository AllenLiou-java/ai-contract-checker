import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import Logo from "@/components/Logo";

const MARKETING_LINKS = [
  { href: "/#features", label: "功能" },
  { href: "/#how-it-works", label: "使用流程" },
  { href: "/#security", label: "資料安全" },
  { href: "/#faq", label: "常見問題" },
];

const navLink = "rounded-full px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-ink/5 hover:text-ink";

async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <nav className="mr-2 hidden items-center gap-1 md:flex">
          {MARKETING_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/login" className={navLink}>
          登入
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink-soft"
        >
          免費註冊
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link href="/upload" className={navLink}>
        審查合約
      </Link>
      <Link href="/contracts" className={navLink}>
        審查紀錄
      </Link>
      <Link href="/settings" className={`${navLink} flex items-center gap-1.5`}>
        設定
        {!user.openaiKeyLast4 && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="尚未設定 API Key" />}
      </Link>
      <div className="ml-2 flex items-center gap-2 border-l border-ink/10 pl-3">
        <span
          className="hidden h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold uppercase text-brand-800 sm:flex"
          title={user.email}
        >
          {user.email[0]}
        </span>
        <form action={logout}>
          <button type="submit" className={navLink}>
            登出
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <Suspense fallback={<div className="h-9 w-48 animate-pulse rounded-full bg-ink/5" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
