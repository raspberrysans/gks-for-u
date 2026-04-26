import { NextResponse } from "next/server";
import { ESSAY_LABELS, FEEDBACK_SYSTEM_PROMPT, type EssayKind } from "@/lib/ai/prompts";

export const runtime = "nodejs";

type Body = {
  kind: EssayKind;
  essay: string;
  context?: {
    track?: string;
    fieldOfStudy?: string;
    country?: string;
  };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
  };
  error?: { message?: string };
};

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing GEMINI_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const essay = (body.essay ?? "").trim();
  if (essay.length < 50) {
    return NextResponse.json(
      { error: "Essay is too short to give meaningful feedback. Write at least a few sentences." },
      { status: 400 },
    );
  }

  const userMsg = [
    `Essay type: ${ESSAY_LABELS[body.kind]}.`,
    body.context?.track ? `Applicant track: ${body.context.track}.` : null,
    body.context?.fieldOfStudy ? `Intended field: ${body.context.fieldOfStudy}.` : null,
    body.context?.country ? `Citizenship: ${body.context.country}.` : null,
    "",
    "Essay text:",
    "<<<",
    essay,
    ">>>",
    "",
    "Return ONLY the JSON described in the system prompt.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const r = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: FEEDBACK_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userMsg }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
          maxOutputTokens: 1500,
        },
      }),
    });

    const data = (await r.json()) as GeminiResponse;
    if (!r.ok) {
      throw new Error(data.error?.message ?? `Gemini request failed (${r.status})`);
    }

    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("");

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start >= 0 && end > start) {
        parsed = JSON.parse(text.slice(start, end + 1));
      } else {
        throw new Error("Model did not return JSON");
      }
    }

    return NextResponse.json({
      feedback: parsed,
      usage: {
        inputTokens: data.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
