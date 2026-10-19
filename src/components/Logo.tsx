import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path d="M10 8.5h8.5l4 4V23a1.5 1.5 0 0 1-1.5 1.5H10A1.5 1.5 0 0 1 8.5 23V10A1.5 1.5 0 0 1 10 8.5Z" fill="none" stroke="white" strokeOpacity="0.9" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 14h6M12 17h4" stroke="white" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="21" cy="21" r="4.25" className="fill-brand-400" />
      <path d="m19.2 21 1.3 1.3 2.4-2.6" fill="none" stroke="#0b1220" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ href = "/", inverted = false }: { href?: string; inverted?: boolean }) {
  return (
    <Link href={href} className="group flex items-center gap-2.5">
      <LogoMark />
      <span className={`font-serif text-[17px] font-bold tracking-wide ${inverted ? "text-white" : "text-ink"}`}>
        合約審查器
        <span className="ml-1.5 rounded-md bg-brand-100 px-1.5 py-0.5 align-middle font-sans text-[10px] font-bold tracking-widest text-brand-800">
          AI
        </span>
      </span>
    </Link>
  );
}
