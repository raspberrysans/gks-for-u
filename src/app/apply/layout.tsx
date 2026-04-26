import Link from "next/link";
import { SECTIONS } from "@/lib/wizard/types";
import AppShell from "@/components/AppShell";

const LABELS: Record<(typeof SECTIONS)[number], string> = {
 track: "track",
 profile: "profile",
 education: "education",
 languages: "languages",
 universities: "universities",
 "personal-statement": "personal statement",
 "study-plan": "study plan",
 recommendation: "recommendation",
 review: "review and export",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
 return (
 <AppShell>
 <div className="mx-auto flex max-w-6xl gap-10 px-6 py-12">
 <aside className="hidden w-60 shrink-0 lg:block">
 <p className="kicker mb-4 text-[color:var(--accent-text)]">
 gks 2026 application
 </p>
 <nav className="space-y-1 border-l border-[color:var(--line)]">
 {SECTIONS.map((s) => (
 <Link
 key={s}
 href={`/apply/${s}`}
 className="block border-l-2 border-transparent px-4 py-2 text-sm lowercase text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--bg-soft)] hover:text-[color:var(--ink)]"
 >
 {LABELS[s]}
 </Link>
 ))}
 </nav>
 </aside>
 <main className="min-w-0 flex-1">{children}</main>
 </div>
 </AppShell>
 );
}
