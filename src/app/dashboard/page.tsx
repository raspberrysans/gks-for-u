"use client";

import Link from "next/link";
import { resetDraft, useDraft } from "@/lib/wizard/store";
import { computeProgress } from "@/lib/wizard/progress";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { computeRubric } from "@/lib/scoring/rubric";
import { computeCompetitiveness } from "@/lib/scoring/competitiveness";
import type { ApplicantProfile } from "@/lib/eligibility/types";
import type { ScoringInput } from "@/lib/scoring/types";
import AppShell from "@/components/AppShell";
import { formatYMDHM } from "@/lib/format/date";

export default function DashboardPage() {
  const draft = useDraft();
  const { sections, overallPercent } = computeProgress(draft);

  const profile: ApplicantProfile = {
    dateOfBirth: draft.profile.dateOfBirth ?? "2000-01-01",
    citizenshipCountryCode: draft.profile.citizenshipCountryCode ?? "",
    holdsKoreanCitizenship: false,
    parentHoldsKoreanCitizenship: false,
    hasBachelorsDegree: false,
    graduatedKoreanHighSchool: false,
    expectedGraduationDate: draft.education.expectedGraduationDate ?? "",
    gpaValue: draft.education.gpaValue ?? 0,
    gpaScale: draft.education.gpaScale ?? "4.0",
    classRankPercentile: draft.education.classRankPercentile,
    priorKoreanGovScholarship: false,
    withdrewFromGksWithin3Years: false,
    criminalRecord: false,
    infectiousDisease: false,
    currentlyEnrolledInKoreanUniversity: false,
    applyingToStem: draft.flags.applyingToStem,
  };
  const eligibility = evaluateEligibility(profile);

  const scoring: ScoringInput = {
    ...profile,
    topikLevel: draft.languages.topikLevel,
    englishTest:
      draft.languages.englishTest && draft.languages.englishTest !== "none" && draft.languages.englishScore !== undefined
        ? { type: draft.languages.englishTest, score: draft.languages.englishScore }
        : undefined,
    veteranDescendant: draft.flags.veteranDescendant,
    selectedTrack: draft.track,
  };
  const rubric = computeRubric(scoring);
  const comp = computeCompetitiveness(scoring, rubric);

  const name = [draft.profile.givenName, draft.profile.familyName].filter(Boolean).join(" ");
  const lastSaved = formatYMDHM(draft.updatedAt);

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker text-[color:var(--accent-text)]">dashboard</p>
            <h1 className="display mt-3 text-4xl sm:text-5xl">
              {name ? `${name.toLowerCase()}'s gks 2026 application` : "your gks 2026 application"}
            </h1>
            <p className="mt-2 text-xs lowercase text-[color:var(--muted)]">
              last saved {lastSaved}. stored in your browser only.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/apply" className="btn btn-primary">
              continue editing
              <span className="ml-2">→</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (confirm("delete this draft? this cannot be undone.")) resetDraft();
              }}
              className="btn btn-ghost"
            >
              reset
            </button>
          </div>
        </header>

        <section className="mb-10 border border-[color:var(--line-strong)] bg-[color:var(--bg-card)] p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="kicker text-[color:var(--muted)]">overall progress</span>
            <span className="font-mono text-xs text-[color:var(--ink)]">{overallPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-[color:var(--line)]">
            <div
              className="h-full bg-[color:var(--accent)] transition-all"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </section>

        <section className="mb-10 grid gap-px overflow-hidden border border-[color:var(--line-strong)] bg-[color:var(--line-strong)] sm:grid-cols-3">
          <Stat
            label="eligibility"
            value={eligibility.blockers.length === 0 ? "eligible" : `${eligibility.blockers.length} issue(s)`}
            tone={eligibility.blockers.length === 0 ? "good" : "warn"}
            hint={eligibility.eligibleTracks.length > 0 ? `${eligibility.eligibleTracks.length} tracks open` : "no tracks open"}
          />
          <Stat
            label="rubric score"
            value={`${rubric.total} / ${rubric.max}`}
            tone={rubric.total / rubric.max >= 0.7 ? "good" : "neutral"}
            hint={`${Math.round((rubric.total / rubric.max) * 100)}% of max`}
          />
          <Stat
            label="competitiveness"
            value={comp.tier.toLowerCase()}
            tone={comp.tier === "Strong" || comp.tier === "Very Strong" ? "good" : "neutral"}
            hint="heuristic estimate"
          />
        </section>

        <section className="mb-10">
          <h2 className="kicker mb-4 text-[color:var(--muted)]">sections</h2>
          <ul className="divide-y divide-[color:var(--line)] border border-[color:var(--line-strong)] bg-[color:var(--bg-card)]">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[color:var(--bg-soft)]"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot status={s.status} />
                    <span className="lowercase text-[color:var(--ink)]">{s.label.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs lowercase text-[color:var(--muted)]">
                    <span>{s.detail}</span>
                    <span>→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {comp.suggestions.length > 0 && (
          <section
            className="mb-10 border p-6"
            style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
          >
            <h2 className="kicker text-[color:var(--accent-text)]">top suggestions</h2>
            <ul className="mt-3 space-y-2 text-sm lowercase text-[color:var(--ink)]">
              {comp.suggestions.slice(0, 3).map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[color:var(--accent-text)]">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-wrap gap-3">
          <Link href="/apply/review" className="btn btn-invert">
            review and export
            <span className="ml-2">→</span>
          </Link>
          <Link href="/eligibility" className="btn btn-ghost">
            re-run eligibility check
          </Link>
        </section>
      </main>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: "good" | "warn" | "neutral";
}) {
  const bg =
    tone === "good"
      ? "var(--good-soft)"
      : tone === "warn"
      ? "var(--warn-soft)"
      : "var(--bg-card)";
  return (
    <div className="p-6" style={{ background: bg }}>
      <p className="kicker text-[color:var(--muted)]">{label}</p>
      <p className="display mt-3 text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs lowercase text-[color:var(--muted)]">{hint}</p>}
    </div>
  );
}

function StatusDot({ status }: { status: "empty" | "partial" | "complete" }) {
  const bg =
    status === "complete"
      ? "var(--accent)"
      : status === "partial"
      ? "var(--warn)"
      : "var(--line-strong)";
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ background: bg }}
    />
  );
}
