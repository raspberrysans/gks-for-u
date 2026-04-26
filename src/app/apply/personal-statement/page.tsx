"use client";

import { WizardShell } from "@/components/wizard/WizardShell";
import { EssayEditor } from "@/components/wizard/EssayEditor";
import { patchSection, useDraft } from "@/lib/wizard/store";

export default function PersonalStatementPage() {
 const draft = useDraft();
 return (
 <WizardShell
 section="personal-statement"
 title="Personal Statement (FORM 2)"
 description="2-page essay covering motivation, background, achievements, and character."
 >
 <EssayEditor
 kind="personal_statement"
 value={draft.essays.personalStatement}
 onChange={(v) => patchSection("essays", { personalStatement: v })}
 context={{
 track: draft.track,
 fieldOfStudy: draft.universities.choices[0]?.fieldOfStudy,
 country: draft.profile.citizenshipCountryCode,
 }}
 />
 </WizardShell>
 );
}
