"use client";

import { WizardShell } from "@/components/wizard/WizardShell";
import { useDraft, updateDraft } from "@/lib/wizard/store";
import type { Track } from "@/lib/eligibility/types";

const TRACKS: { id: Track; label: string; desc: string }[] = [
 { id: "embassy-general", label: "Embassy Track. General", desc: "Apply through your country's Korean embassy. Pick up to 3 universities." },
 { id: "embassy-overseas-korean", label: "Embassy Track. Overseas Korean", desc: "For applicants of Korean descent living abroad." },
 { id: "embassy-irts", label: "Embassy Track. IRTS (Ukraine)", desc: "International Reconstruction Talent Scholarship for Ukrainian applicants." },
 { id: "university-uic", label: "University Track. UIC", desc: "Direct application to one university for STEM majors (CS/AI/Engineering)." },
 { id: "university-rgks", label: "University Track. R-GKS", desc: "Regional universities track. Direct application, broader field choice." },
 { id: "associate", label: "Associate Degree Track", desc: "2–3 year vocational/junior college path." },
];

export default function TrackPage() {
 const draft = useDraft();
 return (
 <WizardShell section="track" title="Choose your track" description="Pick the GKS track you're applying to. You can change this later.">
 <div className="grid gap-3">
 {TRACKS.map((t) => {
 const selected = draft.track === t.id;
 return (
 <button
 key={t.id}
 type="button"
 onClick={() => updateDraft((d) => ({ ...d, track: t.id }))}
 className={`rounded-2xl border p-4 text-left transition ${
 selected ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] " : "border-[color:var(--line)] hover:border-[color:var(--ink)] "
 }`}
 >
 <div className="font-semibold">{t.label}</div>
 <div className="mt-1 text-sm text-[color:var(--muted)] ">{t.desc}</div>
 </button>
 );
 })}
 </div>
 </WizardShell>
 );
}
