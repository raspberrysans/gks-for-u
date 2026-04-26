"use client";

import { useState } from "react";
import countries from "../../../data/countries.json";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import type { ApplicantProfile, GpaScale } from "@/lib/eligibility/types";
import AppShell from "@/components/AppShell";

const TRACK_LABEL: Record<string, string> = {
  "embassy-general": "embassy track. general",
  "embassy-overseas-korean": "embassy track. overseas korean",
  "embassy-irts": "embassy track. irts (ukraine)",
  "university-uic": "university track. uic (stem)",
  "university-rgks": "university track. r-gks (regional)",
  associate: "associate degree track",
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
    <AppShell>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="kicker text-[color:var(--accent-text)]">eligibility check</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">
          two minutes. a clear answer.
        </h1>
        <p className="mt-4 max-w-xl text-base lowercase text-[color:var(--muted)]">
          answer honestly. you can keep exploring the app even if you do not qualify
          this year.
        </p>

        <div className="mt-12 grid gap-5">
          <Field label="date of birth">
            <input
              type="date"
              className="input"
              value={profile.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </Field>

          <Field label="citizenship">
            <select
              className="input"
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

          <Field label="gpa">
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                className="input"
                value={profile.gpaValue}
                onChange={(e) => update("gpaValue", parseFloat(e.target.value) || 0)}
              />
              <select
                className="input"
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

          <Field label="expected high school graduation date">
            <input
              type="date"
              className="input"
              value={profile.expectedGraduationDate}
              onChange={(e) => update("expectedGraduationDate", e.target.value)}
            />
          </Field>

          <Checkbox
            label="i (or my parents) hold korean citizenship"
            checked={profile.holdsKoreanCitizenship}
            onChange={(v) => update("holdsKoreanCitizenship", v)}
          />
          <Checkbox
            label="i already hold a bachelor's degree"
            checked={profile.hasBachelorsDegree}
            onChange={(v) => update("hasBachelorsDegree", v)}
          />
          <Checkbox
            label="i graduated from a korean high school"
            checked={profile.graduatedKoreanHighSchool}
            onChange={(v) => update("graduatedKoreanHighSchool", v)}
          />
          <Checkbox
            label="i have previously received a korean government degree scholarship"
            checked={profile.priorKoreanGovScholarship}
            onChange={(v) => update("priorKoreanGovScholarship", v)}
          />
          <Checkbox
            label="i plan to apply to a stem field (engineering, ai, natural science)"
            checked={!!profile.applyingToStem}
            onChange={(v) => update("applyingToStem", v)}
          />
        </div>

        <ResultPanel result={result} />

        <div className="mt-10">
          <a href="/dashboard" className="btn btn-primary">
            continue to application
            <span className="ml-2">→</span>
          </a>
        </div>
      </main>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="kicker mb-2 block text-[color:var(--muted)]">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm lowercase text-[color:var(--ink-soft)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[color:var(--accent)]"
      />
      {label}
    </label>
  );
}

function ResultPanel({ result }: { result: ReturnType<typeof evaluateEligibility> }) {
  const ok = result.blockers.length === 0;
  return (
    <div
      className="mt-12 border p-6"
      style={{
        borderColor: ok ? "var(--accent)" : "var(--warn)",
        background: ok ? "var(--good-soft)" : "var(--warn-soft)",
      }}
    >
      <p className="kicker text-[color:var(--muted)]">
        {ok ? "verdict" : "blockers found"}
      </p>
      <h2 className="display mt-3 text-3xl">
        {ok ? "you appear eligible." : "some requirements are not met."}
      </h2>

      {ok && result.eligibleTracks.length > 0 && (
        <div className="mt-5">
          <p className="kicker text-[color:var(--muted)]">tracks you can apply for</p>
          <ul className="mt-2 space-y-1 text-sm lowercase text-[color:var(--ink)]">
            {result.eligibleTracks.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                {TRACK_LABEL[t] ?? t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.blockers.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm lowercase text-[color:var(--ink)]">
          {result.blockers.map((b) => (
            <li key={b.code} className="flex gap-2">
              <span className="text-[color:var(--warn)]">×</span>
              {b.message}
            </li>
          ))}
        </ul>
      )}

      {result.warnings.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm lowercase text-[color:var(--muted)]">
          {result.warnings.map((w) => (
            <li key={w.code} className="flex gap-2">
              <span>!</span>
              {w.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
