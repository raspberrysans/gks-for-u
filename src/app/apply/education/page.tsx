"use client";

import { Field, WizardShell, inputCls } from "@/components/wizard/WizardShell";
import { patchSection, useDraft } from "@/lib/wizard/store";
import { meetsGpaThreshold } from "@/lib/eligibility/engine";
import type { GpaScale } from "@/lib/eligibility/types";

export default function EducationPage() {
 const { education } = useDraft();
 const set = <K extends keyof typeof education>(k: K, v: (typeof education)[K]) => patchSection("education", { [k]: v });

 const meets = education.gpaValue !== undefined && education.gpaScale
 ? meetsGpaThreshold(education.gpaValue, education.gpaScale, education.classRankPercentile)
 : null;

 return (
 <WizardShell section="education" title="Education" description="Matches FORM 1 §5. Your GPA must meet the cutoff or you must be in the top 20% of your class.">
 <div className="grid gap-4 sm:grid-cols-2">
 <Field label="High school name">
 <input className={inputCls} value={education.highSchoolName ?? ""} onChange={(e) => set("highSchoolName", e.target.value)} />
 </Field>
 <Field label="High school city / country">
 <input className={inputCls} value={education.highSchoolCity ?? ""} onChange={(e) => set("highSchoolCity", e.target.value)} />
 </Field>
 <Field label="Attendance start">
 <input type="date" className={inputCls} value={education.highSchoolStart ?? ""} onChange={(e) => set("highSchoolStart", e.target.value)} />
 </Field>
 <Field label="Attendance end">
 <input type="date" className={inputCls} value={education.highSchoolEnd ?? ""} onChange={(e) => set("highSchoolEnd", e.target.value)} />
 </Field>
 <Field label="Expected graduation date" hint="Must be on or before 2025-12-31 for the 2026 intake.">
 <input type="date" className={inputCls} value={education.expectedGraduationDate ?? ""} onChange={(e) => set("expectedGraduationDate", e.target.value)} />
 </Field>
 <Field label="GPA scale">
 <select className={inputCls} value={education.gpaScale ?? ""} onChange={(e) => set("gpaScale", e.target.value as GpaScale)}>
 <option value="">select</option>
 <option value="4.0">/ 4.0</option>
 <option value="4.3">/ 4.3</option>
 <option value="4.5">/ 4.5</option>
 <option value="5.0">/ 5.0</option>
 <option value="100">/ 100</option>
 </select>
 </Field>
 <Field label="GPA value">
 <input
 type="number"
 step="0.01"
 className={inputCls}
 value={education.gpaValue ?? ""}
 onChange={(e) => set("gpaValue", parseFloat(e.target.value))}
 />
 </Field>
 <Field label="Class rank percentile (optional)" hint="If you're top X% of your class, enter X. Top 20% bypasses the GPA cutoff.">
 <input
 type="number"
 min={0}
 max={100}
 className={inputCls}
 value={education.classRankPercentile ?? ""}
 onChange={(e) => set("classRankPercentile", e.target.value === "" ? undefined : parseInt(e.target.value, 10))}
 />
 </Field>
 </div>

 {meets !== null && (
 <p className={`mt-4 text-sm ${meets ? "text-[color:var(--good)] " : "text-[color:var(--warn)] "}`}>
 {meets ? "✓ Meets the GKS GPA requirement." : "⚠ Below the GPA cutoff for this scale. You can still continue but this will likely be a blocker."}
 </p>
 )}
 </WizardShell>
 );
}
