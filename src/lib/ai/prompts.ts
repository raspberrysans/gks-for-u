export type EssayKind =
  | "personal_statement"
  | "study_plan"
  | "study_plan_language"
  | "study_plan_goal"
  | "study_plan_future"
  | "recommendation";

export const ESSAY_LABELS: Record<EssayKind, string> = {
  personal_statement: "Personal Statement (FORM 2)",
  study_plan: "Study Plan (FORM 3)",
  study_plan_language: "Study Plan — Language Study Plan (FORM 3)",
  study_plan_goal: "Study Plan — Goal of Study & Study Plan (FORM 3)",
  study_plan_future: "Study Plan — Future Plan after Study (FORM 3)",
  recommendation: "Recommendation Letter (FORM 4) — drafted from recommender's POV",
};

export const ESSAY_LIMITS: Record<EssayKind, { maxChars: number; pages: number }> = {
  personal_statement: { maxChars: 6000, pages: 2 },
  study_plan: { maxChars: 9000, pages: 3 },
  study_plan_language: { maxChars: 3000, pages: 1 },
  study_plan_goal: { maxChars: 4000, pages: 1.5 },
  study_plan_future: { maxChars: 2000, pages: 0.5 },
  recommendation: { maxChars: 4000, pages: 1 },
};

export const ESSAY_PROMPTS: Record<EssayKind, string[]> = {
  personal_statement: [
    "Motivation — why Korea, why GKS, why this field of study?",
    "Background — family, schooling, key formative experiences.",
    "Achievements — extracurriculars, awards, leadership, community work.",
    "Character — values, growth moments, what makes you a strong fit.",
  ],
  study_plan: [
    "Korean language plan — current level, plan to reach TOPIK 4+ before degree.",
    "Academic plan — degree goals, courses, research interests, timeline.",
    "Post-graduation plan — how you'll use the degree to contribute (in Korea or your home country).",
  ],
  study_plan_language: [
    "Current Korean (and English) level — TOPIK level / scores, prior coursework.",
    "Concrete plan during the 1-year language program in Korea (target TOPIK 4+).",
    "How you will keep improving throughout the degree.",
  ],
  study_plan_goal: [
    "Why this degree, why this field, why these universities.",
    "Specific courses, professors, labs, or research areas you want to engage with.",
    "Year-by-year academic plan with milestones (coursework, projects, internships).",
  ],
  study_plan_future: [
    "Concrete plan after graduating — career, further study, or return to home country.",
    "How the degree connects to that plan and benefits Korea–home relations or your field.",
  ],
  recommendation: [
    "Capacity in which the recommender knows you (role, years, classes).",
    "Specific examples of academic ability (avoid generic praise).",
    "Specific examples of character / leadership / resilience.",
    "Why you're a strong GKS candidate, and a clear endorsement statement.",
  ],
};

export const FEEDBACK_SYSTEM_PROMPT = `You are an experienced advisor helping international students apply to the Global Korea Scholarship (GKS) Undergraduate program.

You give concise, specific, actionable feedback on application essays. You NEVER rewrite the student's essay or generate a new draft for them. You ONLY:
1. Flag structural/content gaps against the GKS rubric.
2. Point out specific sentences that are too generic, off-topic, or grammatically problematic.
3. Suggest what the student could add or strengthen — without writing it for them.

The GKS evaluation rubric weighs (in rough order): genuine motivation specifically tied to Korea and the field of study; academic preparation and capacity; clarity of post-graduation goals and how they benefit the home country or Korea-home relations; character (resilience, leadership, intercultural readiness); and concrete evidence over vague claims.

Return your feedback as a JSON object with this exact shape:
{
  "rubric": [
    {"criterion": "Motivation", "score": 1-5, "comment": "..."},
    {"criterion": "Academic preparation", "score": 1-5, "comment": "..."},
    {"criterion": "Post-graduation plan", "score": 1-5, "comment": "..."},
    {"criterion": "Character & evidence", "score": 1-5, "comment": "..."},
    {"criterion": "Clarity & structure", "score": 1-5, "comment": "..."}
  ],
  "strengths": ["short bullet", "short bullet"],
  "gaps": ["short bullet describing what is missing or weak"],
  "lineNotes": [{"quote": "exact phrase from essay", "note": "what to fix"}],
  "overallSuggestion": "one paragraph summary of the single most important next revision"
}

Output ONLY valid JSON, no markdown fences, no preamble.`;
