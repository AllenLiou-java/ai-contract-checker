"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ACCEPT = ".pdf,.docx,.txt";

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; needsKey: boolean } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/contracts", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError({ message: data.error ?? "上傳失敗", needsKey: data.code === "NO_API_KEY" || data.code === "OPENAI_ERROR" });
        setLoading(false);
        return;
      }
      router.push(`/contracts/${data.id}`);
    } catch {
      setError({ message: "網路連線失敗，請稍後再試", needsKey: false });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label
        className={`group relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed px-6 py-16 text-center transition ${
          dragging ? "border-brand-500 bg-brand-50" : "border-ink/15 bg-white hover:border-brand-400 hover:bg-brand-50/40"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          setFile(e.dataTransfer.files[0] ?? null);
        }}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-brand-300 shadow-lg shadow-ink/20 transition group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        </span>
        {file ? (
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="mt-1 text-sm text-slate-500">{formatSize(file.size)}・點擊可更換檔案</p>
          </div>
        ) : (
          <div>
            <p className="font-medium">點擊選擇或拖曳合約檔案到這裡</p>
            <p className="mt-1 text-sm text-slate-500">支援 PDF、DOCX、TXT，檔案大小上限 4MB</p>
          </div>
        )}
        <input
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {error && (
        <div className="flex flex-col gap-2 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{error.message}</p>
          {error.needsKey && (
            <Link href="/settings" className="shrink-0 font-medium underline underline-offset-2">
              前往設定
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!file || loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-4 font-medium text-white shadow-lg shadow-ink/15 transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
        {loading ? "AI 審查中，約需數十秒…" : "開始審查"}
      </button>
    </form>
  );
}
