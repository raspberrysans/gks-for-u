"use client";

import { useState } from "react";
import countries from "../../../data/countries.json";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import type { ApplicantProfile, GpaScale } from "@/lib/eligibility/types";

const TRACK_LABEL: Record<string, string> = {
  "embassy-general": "Embassy Track — General",
  "embassy-overseas-korean": "Embassy Track — Overseas Korean",
  "embassy-irts": "Embassy Track — IRTS (Ukraine)",
  "university-uic": "University Track — UIC (STEM)",
  "university-rgks": "University Track — R-GKS (Regional)",
  associate: "Associate Degree Track",
};

export default function EligibilityPage() {
  const [profile, setProfile] = useState<ApplicantProfile>({
    dateOfBirth: "2005-01-01",
    citizenshipCountryCode: "VN",
    holdsKoreanCitizenship: false,
    parentHoldsKoreanCitizenship: false,
    hasBachelorsDegree: false,
    graduatedKoreanHighSchool: false,
    expectedGraduationDate: "2025-06-30",
    gpaValue: 3.5,
    gpaScale: "4.0",
    priorKoreanGovScholarship: false,
    withdrewFromGksWithin3Years: false,
    criminalRecord: false,
    infectiousDisease: false,
    currentlyEnrolledInKoreanUniversity: false,
    applyingToStem: false,
  });

  const result = evaluateEligibility(profile);
  const update = <K extends keyof ApplicantProfile>(k: K, v: ApplicantProfile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Eligibility check</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Answer honestly. You can keep exploring the app even if you don&apos;t qualify.
      </p>

      <div className="mt-8 grid gap-5">
        <Field label="Date of birth">
          <input
            type="date"
            className={inputCls}
            value={profile.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
          />
        </Field>

        <Field label="Citizenship">
          <select
            className={inputCls}
            value={profile.citizenshipCountryCode}
            onChange={(e) => update("citizenshipCountryCode", e.target.value)}
          >
            {countries.countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="GPA">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              className={inputCls}
              value={profile.gpaValue}
              onChange={(e) => update("gpaValue", parseFloat(e.target.value) || 0)}
            />
            <select
              className={inputCls}
              value={profile.gpaScale}
              onChange={(e) => update("gpaScale", e.target.value as GpaScale)}
            >
              <option value="4.0">/ 4.0</option>
              <option value="4.3">/ 4.3</option>
              <option value="4.5">/ 4.5</option>
              <option value="5.0">/ 5.0</option>
              <option value="100">/ 100</option>
            </select>
          </div>
        </Field>

        <Field label="Expected high school graduation date">
          <input
            type="date"
            className={inputCls}
            value={profile.expectedGraduationDate}
            onChange={(e) => update("expectedGraduationDate", e.target.value)}
          />
        </Field>

        <Checkbox
          label="I (or my parents) hold Korean citizenship"
          checked={profile.holdsKoreanCitizenship}
          onChange={(v) => update("holdsKoreanCitizenship", v)}
        />
        <Checkbox
          label="I already hold a bachelor's degree"
          checked={profile.hasBachelorsDegree}
          onChange={(v) => update("hasBachelorsDegree", v)}
        />
        <Checkbox
          label="I graduated from a Korean high school"
          checked={profile.graduatedKoreanHighSchool}
          onChange={(v) => update("graduatedKoreanHighSchool", v)}
        />
        <Checkbox
          label="I have previously received a Korean government degree scholarship"
          checked={profile.priorKoreanGovScholarship}
          onChange={(v) => update("priorKoreanGovScholarship", v)}
        />
        <Checkbox
          label="I plan to apply to a STEM field (engineering, AI, natural science)"
          checked={!!profile.applyingToStem}
          onChange={(v) => update("applyingToStem", v)}
        />
      </div>

      <ResultPanel result={result} />

      <div className="mt-8">
        <a
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Continue to application →
        </a>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function ResultPanel({ result }: { result: ReturnType<typeof evaluateEligibility> }) {
  const ok = result.blockers.length === 0;
  return (
    <div
      className={`mt-10 rounded-2xl border p-5 ${
        ok ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950"
           : "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950"
      }`}
    >
      <h2 className="text-lg font-semibold">
        {ok ? "You appear eligible" : "Some requirements aren't met"}
      </h2>

      {ok && result.eligibleTracks.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Tracks you can apply for:</p>
          <ul className="mt-1 list-disc pl-6 text-sm">
            {result.eligibleTracks.map((t) => (
              <li key={t}>{TRACK_LABEL[t] ?? t}</li>
            ))}
          </ul>
        </div>
      )}

      {result.blockers.length > 0 && (
        <ul className="mt-3 list-disc pl-6 text-sm text-amber-900 dark:text-amber-200">
          {result.blockers.map((b) => (
            <li key={b.code}>{b.message}</li>
          ))}
        </ul>
      )}

      {result.warnings.length > 0 && (
        <ul className="mt-3 list-disc pl-6 text-sm text-amber-800 dark:text-amber-300">
          {result.warnings.map((w) => (
            <li key={w.code}>⚠ {w.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
