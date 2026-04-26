"use client";

import { Field, WizardShell, inputCls } from "@/components/wizard/WizardShell";
import { patchSection, useDraft } from "@/lib/wizard/store";
import { englishBonusPoints, topikBonusPoints } from "@/lib/scoring/rubric";

export default function LanguagesPage() {
  const { languages } = useDraft();
  const set = <K extends keyof typeof languages>(k: K, v: (typeof languages)[K]) => patchSection("languages", { [k]: v });

  const topikPts = topikBonusPoints(languages.topikLevel);
  const englishPts = englishBonusPoints(
    languages.englishTest && languages.englishTest !== "none" && languages.englishScore !== undefined
      ? { type: languages.englishTest, score: languages.englishScore }
      : undefined,
  );

  return (
    <WizardShell section="languages" title="Languages" description="TOPIK and English proficiency. Each adds up to 10 points to your rubric score.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="TOPIK level" hint="Pick the highest level you've achieved. 0 if you haven't taken it.">
          <select
            className={inputCls}
            value={languages.topikLevel}
            onChange={(e) => set("topikLevel", parseInt(e.target.value, 10) as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((l) => (
              <option key={l} value={l}>{l === 0 ? "None" : `TOPIK ${l}`}</option>
            ))}
          </select>
        </Field>
        <Field label="TOPIK test date (optional)">
          <input type="date" className={inputCls} value={languages.topikDate ?? ""} onChange={(e) => set("topikDate", e.target.value)} />
        </Field>

        <Field label="English test">
          <select
            className={inputCls}
            value={languages.englishTest ?? "none"}
            onChange={(e) => set("englishTest", e.target.value as "toefl_ibt" | "ielts" | "none")}
          >
            <option value="none">None</option>
            <option value="toefl_ibt">TOEFL iBT</option>
            <option value="ielts">IELTS</option>
          </select>
        </Field>
        <Field label="English score">
          <input
            type="number"
            step="0.5"
            className={inputCls}
            value={languages.englishScore ?? ""}
            onChange={(e) => set("englishScore", e.target.value === "" ? undefined : parseFloat(e.target.value))}
          />
        </Field>
      </div>

      <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
        <p>Live language bonus: <strong>{topikPts}</strong> TOPIK + <strong>{englishPts}</strong> English = <strong>{topikPts + englishPts}</strong> / 20 points</p>
      </div>
    </WizardShell>
  );
}
