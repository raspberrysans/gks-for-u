"use client";

import { useState } from "react";
import { ESSAY_LIMITS, ESSAY_PROMPTS, type EssayKind } from "@/lib/ai/prompts";
import { btnPrimary } from "./WizardShell";

type Feedback = {
  rubric: { criterion: string; score: number; comment: string }[];
  strengths: string[];
  gaps: string[];
  lineNotes: { quote: string; note: string }[];
  overallSuggestion: string;
};

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

  const overLimit = value.length > limit.maxChars;

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

        <textarea
          className="h-96 w-full rounded-xl border border-zinc-300 bg-white p-3 font-serif text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-900"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start writing here. Save is automatic."
        />

        <div className="flex items-center justify-between text-xs">
          <span className={overLimit ? "text-red-600" : "text-zinc-500"}>
            {value.length.toLocaleString()} / {limit.maxChars.toLocaleString()} characters
            (~{limit.pages} pages)
          </span>
          <button type="button" onClick={getFeedback} disabled={loading || value.length < 50} className={btnPrimary}>
            {loading ? "Reviewing…" : "Get AI feedback"}
          </button>
        </div>
      </div>

      <aside className="space-y-3">
        <h3 className="text-sm font-semibold">AI feedback</h3>
        {!feedback && !error && !loading && (
          <p className="text-xs text-zinc-500">Write at least a few sentences, then click "Get AI feedback".</p>
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
