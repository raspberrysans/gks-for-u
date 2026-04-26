"use client";

import { WizardShell } from "@/components/wizard/WizardShell";
import { EssayEditor } from "@/components/wizard/EssayEditor";
import { updateDraft, useDraft } from "@/lib/wizard/store";
import type { EssayKind } from "@/lib/ai/prompts";

type SectionKey = "languagePlan" | "goalOfStudy" | "futurePlan";

const SECTIONS: Array<{
  key: SectionKey;
  kind: EssayKind;
  title: string;
  description: string;
}> = [
  {
    key: "languagePlan",
    kind: "study_plan_language",
    title: "1. Language Study Plan",
    description:
      "Plan to improve Korean (and English, if relevant) before and after arriving in Korea.",
  },
  {
    key: "goalOfStudy",
    kind: "study_plan_goal",
    title: "2. Goal of Study & Study Plan",
    description: "Goal of study and the detailed degree-program study plan.",
  },
  {
    key: "futurePlan",
    kind: "study_plan_future",
    title: "3. Future Plan after Study",
    description:
      "Future plan in Korea or another country after finishing the GKS program.",
  },
];

export default function StudyPlanPage() {
  const draft = useDraft();
  const sp = draft.essays.studyPlan;
  return (
    <WizardShell
      section="study-plan"
      title="Study Plan (FORM 3)"
      description="Three official sections. Type each on its own — they will be inserted under the matching FORM 3 heading on download."
    >
      <div className="space-y-10">
        {SECTIONS.map((s) => (
          <div key={s.key}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="text-sm text-[color:var(--muted)]">{s.description}</p>
            </div>
            <EssayEditor
              kind={s.kind}
              value={sp[s.key]}
              onChange={(v) =>
                updateDraft((d) => ({
                  ...d,
                  essays: {
                    ...d.essays,
                    studyPlan: { ...d.essays.studyPlan, [s.key]: v },
                  },
                }))
              }
              context={{
                track: draft.track,
                fieldOfStudy: draft.universities.choices[0]?.fieldOfStudy,
                country: draft.profile.citizenshipCountryCode,
              }}
            />
          </div>
        ))}
      </div>
    </WizardShell>
  );
}
