"use client";

import { WizardShell } from "@/components/wizard/WizardShell";
import { EssayEditor } from "@/components/wizard/EssayEditor";
import { patchSection, useDraft } from "@/lib/wizard/store";

export default function StudyPlanPage() {
  const draft = useDraft();
  return (
    <WizardShell
      section="study-plan"
      title="Study Plan (FORM 3)"
      description="3-page plan covering Korean language, academic, and post-graduation goals."
    >
      <EssayEditor
        kind="study_plan"
        value={draft.essays.studyPlan}
        onChange={(v) => patchSection("essays", { studyPlan: v })}
        context={{
          track: draft.track,
          fieldOfStudy: draft.universities.choices[0]?.fieldOfStudy,
          country: draft.profile.citizenshipCountryCode,
        }}
      />
    </WizardShell>
  );
}
