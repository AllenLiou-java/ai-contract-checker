import Link from "next/link";
import Logo from "@/components/Logo";

async function CurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

const COLUMNS = [
  {
    title: "產品",
    links: [
      { href: "/#features", label: "功能介紹" },
      { href: "/#how-it-works", label: "使用流程" },
      { href: "/upload", label: "開始審查" },
    ],
  },
  {
    title: "資源",
    links: [
      { href: "/#security", label: "資料安全" },
      { href: "/#faq", label: "常見問題" },
      { href: "/contracts", label: "審查紀錄" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-400">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo inverted />
            <p className="max-w-sm text-sm leading-relaxed">
              簽約前，先讓 AI 幫你看一遍。整理重點、標出風險條款、提供修改建議，讓你帶著底氣坐上談判桌。
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{column.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> AI 合約審查器. All rights reserved.
          </p>
          <p className="text-slate-500">AI 審查結果僅供參考，不構成法律意見；重要合約請諮詢專業律師。</p>
        </div>
      </div>
    </footer>
  );
}
