import Link from "next/link";
import { SECTIONS } from "@/lib/wizard/types";

const LABELS: Record<(typeof SECTIONS)[number], string> = {
  track: "Track",
  profile: "Profile",
  education: "Education",
  languages: "Languages",
  universities: "Universities",
  "personal-statement": "Personal Statement",
  "study-plan": "Study Plan",
  recommendation: "Recommendation",
  review: "Review & Export",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <aside className="hidden w-56 shrink-0 lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          GKS 2026 Application
        </p>
        <nav className="space-y-1">
          {SECTIONS.map((s) => (
            <Link
              key={s}
              href={`/apply/${s}`}
              className="block rounded px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {LABELS[s]}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
