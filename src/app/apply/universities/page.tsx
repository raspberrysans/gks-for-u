"use client";

import universities from "../../../../data/universities.json";
import fields from "../../../../data/fields-of-study.json";
import { Field, WizardShell, inputCls } from "@/components/wizard/WizardShell";
import { updateDraft, useDraft } from "@/lib/wizard/store";

const ALL_UNIS = [
  ...universities.typeA.map((u) => ({ ...u, type: "A" as const })),
  ...universities.typeB.map((u) => ({ ...u, type: "B" as const })),
];

export default function UniversitiesPage() {
  const draft = useDraft();
  const isEmbassy = draft.track?.startsWith("embassy");
  const maxChoices = isEmbassy ? 3 : 1;
  const choices = draft.universities.choices.slice(0, maxChoices);
  while (choices.length < maxChoices) choices.push({});

  const setChoice = (i: number, patch: Partial<(typeof choices)[number]>) => {
    updateDraft((d) => {
      const next = d.universities.choices.slice(0, maxChoices);
      while (next.length < maxChoices) next.push({});
      next[i] = { ...next[i], ...patch };
      return { ...d, universities: { choices: next } };
    });
  };

  const hasTypeB = choices.some((c) => ALL_UNIS.find((u) => u.id === c.universityId)?.type === "B");
  const warnNoTypeB = isEmbassy && choices.some((c) => c.universityId) && !hasTypeB;

  return (
    <WizardShell
      section="universities"
      title="University choices"
      description={isEmbassy ? "Embassy Track: pick up to 3 universities. At least one must be Type B." : "University Track: pick exactly 1 university and department."}
    >
      <div className="space-y-5">
        {choices.map((c, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Choice {i + 1}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="University">
                <select className={inputCls} value={c.universityId ?? ""} onChange={(e) => setChoice(i, { universityId: e.target.value })}>
                  <option value="">—</option>
                  <optgroup label="Type A">
                    {universities.typeA.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Type B">
                    {universities.typeB.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </optgroup>
                </select>
              </Field>
              <Field label="Field of study">
                <select className={inputCls} value={c.fieldOfStudy ?? ""} onChange={(e) => setChoice(i, { fieldOfStudy: e.target.value })}>
                  <option value="">—</option>
                  {fields.divisions.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Department / major">
                <input className={inputCls} value={c.department ?? ""} onChange={(e) => setChoice(i, { department: e.target.value })} />
              </Field>
            </div>
          </div>
        ))}
      </div>

      {warnNoTypeB && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          ⚠ Embassy Track applicants generally must include at least one Type B university.
        </p>
      )}
    </WizardShell>
  );
}
