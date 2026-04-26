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
 const { generateApplicationDocx } = await import("@/lib/export/officialDocx");
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
 <div className="rounded-2xl border border-[color:var(--line)] p-5 ">
 <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Eligibility</p>
 <p className="mt-1 text-lg font-semibold">
 {eligibility.blockers.length === 0 ? "✓ Appears eligible" : `${eligibility.blockers.length} issue(s)`}
 </p>
 {eligibility.blockers.length > 0 && (
 <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[color:var(--warn)] ">
 {eligibility.blockers.map((b) => <li key={b.code}>{b.message}</li>)}
 </ul>
 )}
 </div>
 <div className="rounded-2xl border border-[color:var(--line)] p-5 ">
 <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Competitiveness</p>
 <p className="mt-1 text-lg font-semibold">{comp.tier}</p>
 <p className="mt-1 text-xs text-[color:var(--muted)]">Heuristic estimate. NIIED's actual selection is opaque.</p>
 </div>
 </section>

 <section className="mt-5 rounded-2xl border border-[color:var(--line)] p-5 ">
 <div className="flex items-baseline justify-between">
 <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Rubric score</p>
 <p className="text-2xl font-bold">{rubric.total} <span className="text-sm font-normal text-[color:var(--muted)]">/ {rubric.max}</span></p>
 </div>
 <ul className="mt-3 divide-y divide-[color:var(--line)] text-sm ">
 {rubric.lineItems.map((li, i) => (
 <li key={i} className="flex items-baseline justify-between gap-3 py-2">
 <span className="text-[color:var(--ink-soft)] ">{li.label}</span>
 <span className="font-mono text-xs">{li.points} / {li.max}</span>
 </li>
 ))}
 </ul>
 </section>

 {(comp.reasons.length > 0 || comp.suggestions.length > 0) && (
 <section className="mt-5 grid gap-4 md:grid-cols-2">
 <div className="rounded-2xl border border-[color:var(--line)] p-4 ">
 <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Reasoning</p>
 <ul className="list-disc space-y-1 pl-5 text-xs text-[color:var(--ink-soft)] ">
 {comp.reasons.map((r, i) => <li key={i}>{r}</li>)}
 </ul>
 </div>
 <div className="rounded-2xl border border-[color:var(--accent)] bg-[color:var(--accent-soft)] p-4 ">
 <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--accent-text)]">Suggestions</p>
 <ul className="list-disc space-y-1 pl-5 text-xs">
 {comp.suggestions.map((s, i) => <li key={i}>{s}</li>)}
 </ul>
 </div>
 </section>
 )}

 <section className="mt-8 flex flex-wrap gap-3 border-t border-[color:var(--line)] pt-6 ">
 <button onClick={exportPdf} className={btnPrimary}>Download PDF</button>
 <button onClick={exportDocx} className={btnSecondary}>Download DOCX</button>
 </section>
 </WizardShell>
 );
}
