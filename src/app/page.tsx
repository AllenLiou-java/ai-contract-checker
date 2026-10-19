import Link from "next/link";

const STATS = [
  { value: "< 60 秒", label: "完成一份合約審查" },
  { value: "8 大面向", label: "結構化審查報告" },
  { value: "3 種格式", label: "PDF、Word、純文字" },
  { value: "100%", label: "使用你自己的 API Key" },
];

const FEATURES = [
  {
    title: "風險條款自動標示",
    description: "逐條檢視違約金、押金、終止條件、責任歸屬等條款，依高、中、低風險分級標示。",
    icon: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  },
  {
    title: "具體修改建議",
    description: "不只告訴你哪裡有問題，還會提出可以直接拿去談判的修改方向與替代文字。",
    icon: "M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z",
  },
  {
    title: "重點條款摘要",
    description: "自動整理當事人、期限、金額、付款方式等關鍵資訊，三十秒掌握整份合約。",
    icon: "M9 12h6m-6 4h6M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z",
  },
  {
    title: "缺漏條款提醒",
    description: "比對同類合約常見的保障條款，提醒你保密、爭議處理、不可抗力等是否遺漏。",
    icon: "M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm0-10v6m-3-3h6",
  },
  {
    title: "審查紀錄永久保存",
    description: "每一份審查報告與原始檔案都會保存在你的帳號中，隨時回頭查閱與比較。",
    icon: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
  },
  {
    title: "自備金鑰，費用透明",
    description: "使用你自己的 OpenAI API Key，費用直接由 OpenAI 計算，沒有額外加價或訂閱綁約。",
    icon: "M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.7 5.7L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.6a1 1 0 0 1 .3-.7l6-6A6 6 0 1 1 21 9Z",
  },
];

const STEPS = [
  { title: "設定你的 API Key", description: "註冊後在設定頁貼上 OpenAI API Key，系統會加密保存，只需設定一次。" },
  { title: "上傳合約", description: "拖曳 PDF、Word 或純文字檔，檔案會安全保存在你的帳號中。" },
  { title: "取得審查報告", description: "AI 在一分鐘內產出結構化報告：風險分級、修改建議、簽約前注意事項。" },
];

const SECURITY = [
  { title: "API Key 加密保存", description: "以 AES-256-GCM 加密後存入資料庫，頁面上只會顯示遮罩後的末四碼。" },
  { title: "資料只屬於你", description: "每份合約都綁定你的帳號，其他使用者無法查詢或下載你的檔案與報告。" },
  { title: "密碼雜湊儲存", description: "密碼經 bcrypt 雜湊後才寫入資料庫，任何人都無法看到你的原始密碼。" },
];

const FAQS = [
  {
    q: "為什麼需要自己的 OpenAI API Key？",
    a: "採用 BYOK（Bring Your Own Key）模式，AI 費用直接由 OpenAI 向你計費，我們不加價、不抽成。你也可以隨時在 OpenAI 後台查看用量或撤銷金鑰。",
  },
  {
    q: "審查一份合約大概要花多少錢？",
    a: "依合約長度與所選模型而定。一般數頁的合約，使用預設的輕量模型通常只需要幾塊新台幣以內。",
  },
  {
    q: "AI 的審查結果可以取代律師嗎？",
    a: "不行。AI 能快速找出常見的風險與遺漏，幫你在諮詢律師前做好準備，但審查結果僅供參考，不構成法律意見。",
  },
  {
    q: "支援哪些檔案格式？",
    a: "目前支援 PDF、Word（.docx）與純文字（.txt），單一檔案大小上限為 4MB。",
  },
];

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{eyebrow}</p>
      <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-relaxed text-slate-600">{description}</p>}
    </div>
  );
}

function ReportPreview() {
  const risks = [
    { level: "高", clause: "第五條　提前終止", text: "押金全數沒收並賠償剩餘租期租金，明顯不對等。", tone: "bg-red-50 text-red-700 ring-red-600/15" },
    { level: "中", clause: "第四條　檢查權", text: "出租人可隨時進入，建議改為事先通知 24 小時。", tone: "bg-amber-50 text-amber-700 ring-amber-600/15" },
    { level: "低", clause: "第一條　租期", text: "起訖日期明確，建議補充續約條件。", tone: "bg-emerald-50 text-emerald-700 ring-emerald-600/15" },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-200/50 via-white/0 to-sky-200/40 blur-2xl" />
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/[0.06] bg-slate-50/70 px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          </div>
          <span className="font-mono text-[11px] text-slate-400">房屋租賃契約.pdf</span>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">整體風險評估</p>
              <p className="mt-1 font-serif text-2xl font-bold">高風險</p>
            </div>
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-ink/[0.07]" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-red-500" strokeWidth="3" strokeDasharray="78 100" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">78</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {risks.map((r) => (
              <div key={r.clause} className="flex gap-3 rounded-xl border border-ink/[0.06] p-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ring-1 ring-inset ${r.tone}`}>
                  {r.level}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{r.clause}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-900">
            <span className="font-semibold">修改建議：</span>提前終止時，違約金上限建議調整為一個月租金，押金扣除違約金後返還。
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-24">
          <div className="animate-fade-up">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs text-slate-600 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              BYOK 模式・使用你自己的 OpenAI API Key
            </p>
            <h1 className="font-serif text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              簽約之前，
              <br />
              先讓 <span className="relative whitespace-nowrap text-brand-700">AI 律師助理<svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full text-brand-300" preserveAspectRatio="none" aria-hidden="true"><path d="M2 9c50-6 146-8 196-3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span>
              <br />
              幫你看一遍。
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-slate-600">
              上傳合約，一分鐘內取得結構化審查報告：重點摘要、風險分級、修改建議與缺漏條款提醒，帶著底氣坐上談判桌。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/upload"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-white shadow-lg shadow-ink/20 transition hover:bg-ink-soft"
              >
                開始審查合約
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link href="#how-it-works" className="rounded-full px-5 py-3.5 font-medium text-slate-700 transition hover:bg-ink/5">
                了解運作方式
              </Link>
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <ReportPreview />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-ink/[0.06] bg-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-ink/[0.06] px-5 md:grid-cols-4 md:divide-x">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-4 py-8 text-center">
              <dt className="mt-1 text-sm text-slate-500">{s.label}</dt>
              <dd className="font-serif text-2xl font-bold sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Features"
            title="像資深律師一樣，逐條替你把關"
            description="從風險辨識到修改建議，一份報告涵蓋簽約前需要知道的一切。"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card group p-7 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-brand-300 transition group-hover:bg-brand-700 group-hover:text-white">
                  <Icon path={f.icon} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-ink/[0.06] bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="How it works" title="三個步驟，完成專業審查" />
          <ol className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-14 right-0 top-6 hidden h-px bg-gradient-to-r from-ink/15 to-transparent md:block" />
                )}
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-paper font-serif text-lg font-bold">
                  {i + 1}
                </span>
                <h3 className="mb-2 mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="scroll-mt-20 relative overflow-hidden bg-ink py-24 text-white">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Security</p>
            <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">你的合約，只有你看得到</h2>
            <p className="mt-4 leading-relaxed text-slate-400">合約往往包含最敏感的商業資訊，我們從設計之初就把資料保護放在第一位。</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {SECURITY.map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-400/15 text-brand-300">
                  <Icon path="M12 3 4.5 6v5.5c0 4.6 3.2 8.6 7.5 9.5 4.3-.9 7.5-4.9 7.5-9.5V6Zm-3 9 2 2 4-4" />
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-3xl px-5">
          <SectionHeading eyebrow="FAQ" title="常見問題" />
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium">
                  {faq.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-slate-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-900 to-ink px-8 py-16 text-center text-white sm:px-16">
          <div className="bg-grid-dark absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="relative">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">下一份合約，簽得更安心</h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100/80">免費註冊，設定好 API Key，馬上審查你的第一份合約。</p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-ink shadow-lg transition hover:bg-brand-50"
            >
              免費開始使用 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
