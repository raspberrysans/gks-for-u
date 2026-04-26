"use client";

import Link from "next/link";
import { resetDraft, useDraft } from "@/lib/wizard/store";
import { computeProgress } from "@/lib/wizard/progress";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { computeRubric } from "@/lib/scoring/rubric";
import { computeCompetitiveness } from "@/lib/scoring/competitiveness";
import type { ApplicantProfile } from "@/lib/eligibility/types";
import type { ScoringInput } from "@/lib/scoring/types";

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
  const lastSaved = new Date(draft.updatedAt).toLocaleString();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {name ? `${name}'s GKS 2026 application` : "Your GKS 2026 application"}
          </h1>
          <p className="mt-1 text-xs text-zinc-500">Last saved {lastSaved} · Stored in your browser only.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/apply"
            className="inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue editing →
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this draft? This cannot be undone.")) resetDraft();
            }}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Reset
          </button>
        </div>
      </header>

      <section className="mb-8 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Overall progress</span>
          <span className="font-mono text-xs text-zinc-500">{overallPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${overallPercent}%` }} />
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Eligibility"
          value={eligibility.blockers.length === 0 ? "Eligible" : `${eligibility.blockers.length} issue(s)`}
          tone={eligibility.blockers.length === 0 ? "good" : "warn"}
          hint={eligibility.eligibleTracks.length > 0 ? `${eligibility.eligibleTracks.length} tracks open` : "—"}
        />
        <Stat
          label="Rubric score"
          value={`${rubric.total} / ${rubric.max}`}
          tone={rubric.total / rubric.max >= 0.7 ? "good" : "neutral"}
          hint={`${Math.round((rubric.total / rubric.max) * 100)}% of max`}
        />
        <Stat
          label="Competitiveness"
          value={comp.tier}
          tone={comp.tier === "Strong" || comp.tier === "Very Strong" ? "good" : "neutral"}
          hint="Heuristic estimate"
        />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">Sections</h2>
        <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {sections.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <StatusDot status={s.status} />
                  <span className="font-medium">{s.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{s.detail}</span>
                  <span>→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {comp.suggestions.length > 0 && (
        <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">Top suggestions</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {comp.suggestions.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        <Link
          href="/apply/review"
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          Review & export →
        </Link>
        <Link
          href="/eligibility"
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Re-run eligibility check
        </Link>
      </section>
    </main>
  );
}

function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone: "good" | "warn" | "neutral" }) {
  const toneCls =
    tone === "good"
      ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950"
      : tone === "warn"
      ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
      : "border-zinc-200 dark:border-zinc-800";
  return (
    <div className={`rounded-2xl border p-5 ${toneCls}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

function StatusDot({ status }: { status: "empty" | "partial" | "complete" }) {
  const cls =
    status === "complete"
      ? "bg-green-500"
      : status === "partial"
      ? "bg-amber-500"
      : "bg-zinc-300 dark:bg-zinc-700";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${cls}`} />;
}
