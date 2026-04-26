"use client";

import { WizardShell, btnPrimary, btnSecondary } from "@/components/wizard/WizardShell";
import { useDraft } from "@/lib/wizard/store";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { computeRubric } from "@/lib/scoring/rubric";
import { computeCompetitiveness } from "@/lib/scoring/competitiveness";
import type { ApplicantProfile } from "@/lib/eligibility/types";
import type { ScoringInput } from "@/lib/scoring/types";

function downloadBlob(bytes: Uint8Array, mime: string, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReviewPage() {
  const draft = useDraft();

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
    isOverseasKorean: draft.flags.isOverseasKorean,
    isUkrainian: draft.flags.isUkrainian,
  };

  const eligibility = evaluateEligibility(profile);

  const scoringInput: ScoringInput = {
    ...profile,
    topikLevel: draft.languages.topikLevel,
    englishTest:
      draft.languages.englishTest && draft.languages.englishTest !== "none" && draft.languages.englishScore !== undefined
        ? { type: draft.languages.englishTest, score: draft.languages.englishScore }
        : undefined,
    veteranDescendant: draft.flags.veteranDescendant,
    selectedTrack: draft.track,
  };
  const rubric = computeRubric(scoringInput);
  const comp = computeCompetitiveness(scoringInput, rubric);

  async function exportPdf() {
    const { generateApplicationPdf } = await import("@/lib/export/pdf");
    const bytes = await generateApplicationPdf(draft);
    downloadBlob(bytes, "application/pdf", "gks-2026-application.pdf");
  }
  async function exportDocx() {
    const { generateApplicationDocx } = await import("@/lib/export/docx");
    const bytes = await generateApplicationDocx(draft);
    downloadBlob(
      bytes,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "gks-2026-application.docx",
    );
  }

  return (
    <WizardShell section="review" title="Review & export" description="Final scorecard and downloadable application bundle.">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Eligibility</p>
          <p className="mt-1 text-lg font-semibold">
            {eligibility.blockers.length === 0 ? "✓ Appears eligible" : `${eligibility.blockers.length} issue(s)`}
          </p>
          {eligibility.blockers.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-700 dark:text-amber-400">
              {eligibility.blockers.map((b) => <li key={b.code}>{b.message}</li>)}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Competitiveness</p>
          <p className="mt-1 text-lg font-semibold">{comp.tier}</p>
          <p className="mt-1 text-xs text-zinc-500">Heuristic estimate — NIIED's actual selection is opaque.</p>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Rubric score</p>
          <p className="text-2xl font-bold">{rubric.total} <span className="text-sm font-normal text-zinc-500">/ {rubric.max}</span></p>
        </div>
        <ul className="mt-3 divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
          {rubric.lineItems.map((li, i) => (
            <li key={i} className="flex items-baseline justify-between gap-3 py-2">
              <span className="text-zinc-700 dark:text-zinc-300">{li.label}</span>
              <span className="font-mono text-xs">{li.points} / {li.max}</span>
            </li>
          ))}
        </ul>
      </section>

      {(comp.reasons.length > 0 || comp.suggestions.length > 0) && (
        <section className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Reasoning</p>
            <ul className="list-disc space-y-1 pl-5 text-xs text-zinc-700 dark:text-zinc-300">
              {comp.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">Suggestions</p>
            <ul className="list-disc space-y-1 pl-5 text-xs">
              {comp.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="mt-8 flex flex-wrap gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button onClick={exportPdf} className={btnPrimary}>Download PDF</button>
        <button onClick={exportDocx} className={btnSecondary}>Download DOCX</button>
      </section>
    </WizardShell>
  );
}
