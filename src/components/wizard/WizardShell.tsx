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
    <div className="space-y-8">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs lowercase text-[color:var(--muted)]">
          <span>
            step {idx + 1} of {SECTIONS.length}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 w-full bg-[color:var(--line)]">
          <div
            className="h-full bg-[color:var(--accent)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <header>
        <h1 className="display text-4xl sm:text-5xl">{title.toLowerCase()}</h1>
        {description && (
          <p className="mt-3 text-sm lowercase text-[color:var(--muted)]">
            {description}
          </p>
        )}
      </header>

      <div>{children}</div>

      <nav className="flex justify-between border-t border-[color:var(--line)] pt-6">
        {prev ? (
          <Link href={`/apply/${prev}`} className="btn btn-ghost">
            <span className="mr-2">←</span> back
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/apply/${next}`} className="btn btn-primary">
            continue
            <span className="ml-2">→</span>
          </Link>
        ) : (
          <Link href="/apply/review" className="btn btn-primary">
            review
            <span className="ml-2">→</span>
          </Link>
        )}
      </nav>
    </div>
  );
}

export const inputCls = "input";
export const btnPrimary = "btn btn-primary";
export const btnSecondary = "btn btn-ghost";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="kicker mb-2 block text-[color:var(--muted)]">{label}</span>
      {children}
      {hint && (
        <span className="mt-2 block text-xs lowercase text-[color:var(--muted)]">
          {hint}
        </span>
      )}
    </label>
  );
}
