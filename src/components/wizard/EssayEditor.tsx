"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ESSAY_LIMITS, ESSAY_PROMPTS, type EssayKind } from "@/lib/ai/prompts";
import { btnPrimary } from "./WizardShell";

type Feedback = {
 rubric: { criterion: string; score: number; comment: string }[];
 strengths: string[];
 gaps: string[];
 lineNotes: { quote: string; note: string }[];
 overallSuggestion: string;
};

const PASTE_NORMALIZE: Array<[RegExp, string]> = [
 [/[‘’‚‛]/g, "'"],
 [/[“”„‟]/g, '"'],
 [/[–—−]/g, "-"],
 [/…/g, "..."],
 [/→/g, "->"],
 [/←/g, "<-"],
 [/[   ​]/g, " "],
];

function normalize(text: string): string {
 let out = text;
 for (const [re, sub] of PASTE_NORMALIZE) out = out.replace(re, sub);
 return out;
}

function countWords(s: string): number {
 const trimmed = s.trim();
 if (!trimmed) return 0;
 return trimmed.split(/\s+/).length;
}

function countParagraphs(s: string): number {
 const blocks = s.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
 return blocks.length;
}

export function EssayEditor({
 kind,
 value,
 onChange,
 context,
}: {
 kind: EssayKind;
 value: string;
 onChange: (v: string) => void;
 context?: { track?: string; fieldOfStudy?: string; country?: string };
}) {
 const limit = ESSAY_LIMITS[kind];
 const prompts = ESSAY_PROMPTS[kind];
 const [feedback, setFeedback] = useState<Feedback | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [savedAt, setSavedAt] = useState<number | null>(null);
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 const chars = value.length;
 const words = useMemo(() => countWords(value), [value]);
 const paragraphs = useMemo(() => countParagraphs(value), [value]);
 const readMinutes = Math.max(1, Math.round(words / 200));

 const ratio = chars / limit.maxChars;
 const overLimit = chars > limit.maxChars;
 const nearLimit = ratio >= 0.9 && !overLimit;

 const limitColor = overLimit
 ? "text-[color:var(--warn)]"
 : nearLimit
 ? "text-[color:var(--warn)]"
 : "text-[color:var(--muted)]";

 useLayoutEffect(() => {
 const el = textareaRef.current;
 if (!el) return;
 el.style.height = "auto";
 el.style.height = `${Math.max(el.scrollHeight, 384)}px`;
 }, [value]);

 useEffect(() => {
 if (!value) return;
 const t = setTimeout(() => setSavedAt(Date.now()), 600);
 return () => clearTimeout(t);
 }, [value]);

 function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
 onChange(normalize(e.target.value));
 }

 function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
 if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
 e.preventDefault();
 if (!loading && value.length >= 50) void getFeedback();
 }
 }

 async function getFeedback() {
 setLoading(true);
 setError(null);
 setFeedback(null);
 try {
 const r = await fetch("/api/ai/essay-feedback", {
 method: "POST",
 headers: { "content-type": "application/json" },
 body: JSON.stringify({ kind, essay: value, context }),
 });
 const data = await r.json();
 if (!r.ok) throw new Error(data.error ?? "Request failed");
 setFeedback(data.feedback as Feedback);
 } catch (e) {
 setError(e instanceof Error ? e.message : "Unknown error");
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
 <div className="space-y-3">
 <div>
 <p className="mb-1 text-sm font-medium">Cover these points:</p>
 <ul className="list-disc space-y-1 pl-5 text-sm text-[color:var(--muted)] ">
 {prompts.map((p) => <li key={p}>{p}</li>)}
 </ul>
 </div>

 <div className="relative rounded-2xl bg-[color:var(--bg-card)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] ring-1 ring-[color:var(--line)]/70 transition-shadow focus-within:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_12px_32px_-12px_rgba(0,0,0,0.12)] focus-within:ring-[color:var(--line-strong)] ">
 <textarea
 ref={textareaRef}
 className="block min-h-[28rem] w-full resize-none bg-transparent px-8 py-7 font-serif text-[17px] leading-[1.75] tracking-[-0.003em] outline-none placeholder:text-[color:var(--muted)]/80 selection:bg-[color:var(--accent-soft)] "
 value={value}
 onChange={handleChange}
 onKeyDown={handleKeyDown}
 placeholder="Begin writing your essay… ⌘↵ for AI feedback"
 spellCheck
 lang="en"
 autoCorrect="on"
 autoCapitalize="sentences"
 aria-label={`${kind} essay`}
 aria-invalid={overLimit}
 />
 {savedAt && (
 <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--bg-card)]/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[color:var(--muted)] ring-1 ring-[color:var(--line)]/60 backdrop-blur ">
 <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
 Saved
 </span>
 )}
 </div>

 <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
 <div className="flex flex-wrap items-center gap-y-1">
 <span className={limitColor}>
 {chars.toLocaleString()} / {limit.maxChars.toLocaleString()} chars
 {overLimit && ` (over by ${(chars - limit.maxChars).toLocaleString()})`}
 </span>
 <span className="text-[color:var(--muted)] before:mx-2 before:content-['·']">{words.toLocaleString()} words</span>
 <span className="text-[color:var(--muted)] before:mx-2 before:content-['·']">{paragraphs} paragraph{paragraphs === 1 ? "" : "s"}</span>
 <span className="text-[color:var(--muted)] before:mx-2 before:content-['·']">~{readMinutes} min read</span>
 <span className="text-[color:var(--muted)] before:mx-2 before:content-['·']">~{limit.pages} pages target</span>
 </div>
 <button
 type="button"
 onClick={getFeedback}
 disabled={loading || value.length < 50}
 className={btnPrimary}
 title="⌘/Ctrl + Enter"
 >
 {loading ? "Reviewing…" : "Get AI feedback"}
 </button>
 </div>

 <div
 className="h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--bg-soft)] "
 role="progressbar"
 aria-valuenow={Math.min(100, Math.round(ratio * 100))}
 aria-valuemin={0}
 aria-valuemax={100}
 >
 <div
 className={`h-full rounded-full transition-all ${
 overLimit ? "bg-[color:var(--warn)]" : nearLimit ? "bg-[color:var(--warn)]" : "bg-[color:var(--accent)]"
 }`}
 style={{ width: `${Math.min(100, ratio * 100)}%` }}
 />
 </div>
 </div>

 <aside className="space-y-3">
 <h3 className="text-sm font-semibold">AI feedback</h3>
 {!feedback && !error && !loading && (
 <p className="text-xs text-[color:var(--muted)]">
 Write at least a few sentences, then click "Get AI feedback" or press ⌘/Ctrl + Enter.
 </p>
 )}
 {loading && <p className="text-xs text-[color:var(--muted)]">Gemini is reading your essay…</p>}
 {error && <p className="text-xs text-[color:var(--warn)]">{error}</p>}
 {feedback && <FeedbackPanel feedback={feedback} />}
 </aside>
 </div>
 );
}

function FeedbackPanel({ feedback }: { feedback: Feedback }) {
 return (
 <div className="space-y-4 text-sm">
 <div className="rounded-xl border border-[color:var(--line)] p-3 ">
 <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Rubric</p>
 <ul className="space-y-1.5">
 {feedback.rubric.map((r) => (
 <li key={r.criterion} className="flex items-start justify-between gap-2">
 <span>{r.criterion}</span>
 <span className="font-mono text-xs">{r.score}/5</span>
 </li>
 ))}
 </ul>
 </div>

 {feedback.gaps?.length > 0 && (
 <div>
 <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--warn)]">Gaps to address</p>
 <ul className="list-disc space-y-1 pl-5 text-xs">
 {feedback.gaps.map((g, i) => <li key={i}>{g}</li>)}
 </ul>
 </div>
 )}

 {feedback.strengths?.length > 0 && (
 <div>
 <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--good)]">Strengths</p>
 <ul className="list-disc space-y-1 pl-5 text-xs">
 {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
 </ul>
 </div>
 )}

 {feedback.lineNotes?.length > 0 && (
 <div>
 <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Line notes</p>
 <ul className="space-y-1.5 text-xs">
 {feedback.lineNotes.map((n, i) => (
 <li key={i} className="rounded-lg bg-[color:var(--bg-soft)] p-2 ">
 <span className="italic">&ldquo;{n.quote}&rdquo;</span> · {n.note}
 </li>
 ))}
 </ul>
 </div>
 )}

 {feedback.overallSuggestion && (
 <div className="rounded-xl border border-[color:var(--accent)] bg-[color:var(--accent-soft)] p-3 text-xs ">
 <p className="mb-1 font-semibold">Most important next revision</p>
 <p>{feedback.overallSuggestion}</p>
 </div>
 )}
 </div>
 );
}
