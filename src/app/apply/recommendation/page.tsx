"use client";

import { WizardShell } from "@/components/wizard/WizardShell";
import { EssayEditor } from "@/components/wizard/EssayEditor";
import { patchSection, useDraft } from "@/lib/wizard/store";

export default function RecommendationPage() {
 const draft = useDraft();
 return (
 <WizardShell
 section="recommendation"
 title="Recommendation Letter (FORM 4)"
 description="Most recommenders ask the student to draft, then sign. Write this in your recommender's voice. they'll sign and submit it."
 >
 <div className="mb-4 rounded-xl border border-[color:var(--warn)] bg-[color:var(--warn-soft)] p-3 text-sm text-[color:var(--warn)] ">
 Write in third person, from your recommender's perspective. Use specific examples
 (a class, a project, a moment). the AI will flag generic praise.
 </div>
 <EssayEditor
 kind="recommendation"
 value={draft.essays.recommendation}
 onChange={(v) => patchSection("essays", { recommendation: v })}
 context={{
 track: draft.track,
 fieldOfStudy: draft.universities.choices[0]?.fieldOfStudy,
 country: draft.profile.citizenshipCountryCode,
 }}
 />
 </WizardShell>
 );
}
