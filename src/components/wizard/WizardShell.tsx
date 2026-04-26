"use client";

import Link from "next/link";
import { SECTIONS, type Section } from "@/lib/wizard/types";

export function WizardShell({
  section,
  title,
  description,
  children,
}: {
  section: Section;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const idx = SECTIONS.indexOf(section);
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
  const pct = Math.round(((idx + 1) / SECTIONS.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
          <span>Step {idx + 1} of {SECTIONS.length}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <header>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
      </header>

      <div>{children}</div>

      <nav className="flex justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {prev ? (
          <Link href={`/apply/${prev}`} className={btnSecondary}>
            ← Back
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/apply/${next}`} className={btnPrimary}>
            Continue →
          </Link>
        ) : (
          <Link href="/apply/review" className={btnPrimary}>Review →</Link>
        )}
      </nav>
    </div>
  );
}

export const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
export const btnPrimary =
  "inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700";
export const btnSecondary =
  "inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}
