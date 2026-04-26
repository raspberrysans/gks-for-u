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
    ? "text-red-600"
    : nearLimit
      ? "text-amber-600"
      : "text-zinc-500";

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
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {prompts.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            className="block min-h-96 w-full resize-none rounded-xl border border-zinc-300 bg-white p-4 font-serif text-base leading-7 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start writing here. Saves automatically. Press ⌘/Ctrl + Enter for AI feedback."
            spellCheck
            lang="en"
            autoCorrect="on"
            autoCapitalize="sentences"
            aria-label={`${kind} essay`}
            aria-invalid={overLimit}
          />
          {savedAt && (
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Saved
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className={limitColor}>
              {chars.toLocaleString()} / {limit.maxChars.toLocaleString()} chars
              {overLimit && ` (over by ${(chars - limit.maxChars).toLocaleString()})`}
            </span>
            <span className="text-zinc-500">{words.toLocaleString()} words</span>
            <span className="text-zinc-500">{paragraphs} paragraph{paragraphs === 1 ? "" : "s"}</span>
            <span className="text-zinc-500">~{readMinutes} min read</span>
            <span className="text-zinc-500">~{limit.pages} pages target</span>
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
          className="h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
          role="progressbar"
          aria-valuenow={Math.min(100, Math.round(ratio * 100))}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full transition-all ${
              overLimit ? "bg-red-500" : nearLimit ? "bg-amber-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(100, ratio * 100)}%` }}
          />
        </div>
      </div>

      <aside className="space-y-3">
        <h3 className="text-sm font-semibold">AI feedback</h3>
        {!feedback && !error && !loading && (
          <p className="text-xs text-zinc-500">
            Write at least a few sentences, then click "Get AI feedback" or press ⌘/Ctrl + Enter.
          </p>
        )}
        {loading && <p className="text-xs text-zinc-500">Claude is reading your essay…</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
        {feedback && <FeedbackPanel feedback={feedback} />}
      </aside>
    </div>
  );
}

function FeedbackPanel({ feedback }: { feedback: Feedback }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Rubric</p>
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
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">Gaps to address</p>
          <ul className="list-disc space-y-1 pl-5 text-xs">
            {feedback.gaps.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      )}

      {feedback.strengths?.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-700">Strengths</p>
          <ul className="list-disc space-y-1 pl-5 text-xs">
            {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {feedback.lineNotes?.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Line notes</p>
          <ul className="space-y-1.5 text-xs">
            {feedback.lineNotes.map((n, i) => (
              <li key={i} className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
                <span className="italic">&ldquo;{n.quote}&rdquo;</span> — {n.note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.overallSuggestion && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-950">
          <p className="mb-1 font-semibold">Most important next revision</p>
          <p>{feedback.overallSuggestion}</p>
        </div>
      )}
    </div>
  );
}
