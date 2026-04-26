import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
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

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it to .env.local." },
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

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    const resp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: [
        {
          type: "text",
          text: FEEDBACK_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMsg }],
    });

    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

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
        inputTokens: resp.usage.input_tokens,
        outputTokens: resp.usage.output_tokens,
        cacheReadTokens: resp.usage.cache_read_input_tokens ?? 0,
        cacheCreationTokens: resp.usage.cache_creation_input_tokens ?? 0,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
