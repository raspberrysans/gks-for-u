import type { ApplicationDraft } from "./types";
import { ESSAY_LIMITS } from "../ai/prompts";

export type SectionProgress = {
  id: string;
  label: string;
  href: string;
  status: "empty" | "partial" | "complete";
  detail: string;
};

export function computeProgress(draft: ApplicationDraft): {
  sections: SectionProgress[];
  overallPercent: number;
} {
  const p = draft.profile;
  const e = draft.education;
  const l = draft.languages;
  const u = draft.universities.choices;

  const profileFilled = [p.familyName, p.givenName, p.dateOfBirth, p.citizenshipCountryCode, p.email].filter(Boolean).length;
  const educationFilled = [e.highSchoolName, e.gpaValue, e.gpaScale, e.expectedGraduationDate].filter((v) => v !== undefined && v !== "").length;
  const universitiesFilled = u.filter((c) => c.universityId).length;

  const sections: SectionProgress[] = [
    {
      id: "track",
      label: "Track",
      href: "/apply/track",
      status: draft.track ? "complete" : "empty",
      detail: draft.track ?? "Not selected",
    },
    {
      id: "profile",
      label: "Personal info",
      href: "/apply/profile",
      status: profileFilled === 0 ? "empty" : profileFilled >= 5 ? "complete" : "partial",
      detail: `${profileFilled}/5 key fields`,
    },
    {
      id: "education",
      label: "Education",
      href: "/apply/education",
      status: educationFilled === 0 ? "empty" : educationFilled >= 4 ? "complete" : "partial",
      detail: `${educationFilled}/4 key fields`,
    },
    {
      id: "languages",
      label: "Languages",
      href: "/apply/languages",
      status: l.topikLevel > 0 || (l.englishTest && l.englishTest !== "none") ? "complete" : "empty",
      detail:
        l.topikLevel > 0
          ? `TOPIK ${l.topikLevel}${l.englishTest && l.englishTest !== "none" ? ` + ${l.englishTest.toUpperCase()}` : ""}`
          : "No tests entered",
    },
    {
      id: "universities",
      label: "Universities",
      href: "/apply/universities",
      status: universitiesFilled === 0 ? "empty" : universitiesFilled >= 1 ? "partial" : "complete",
      detail: `${universitiesFilled} chosen`,
    },
    {
      id: "personal-statement",
      label: "Personal Statement",
      href: "/apply/personal-statement",
      status: essayStatus(draft.essays.personalStatement, ESSAY_LIMITS.personal_statement.maxChars),
      detail: `${draft.essays.personalStatement.length.toLocaleString()} chars`,
    },
    {
      id: "study-plan",
      label: "Study Plan",
      href: "/apply/study-plan",
      status: essayStatus(
        draft.essays.studyPlan.languagePlan +
          draft.essays.studyPlan.goalOfStudy +
          draft.essays.studyPlan.futurePlan,
        ESSAY_LIMITS.study_plan.maxChars,
      ),
      detail: `${(
        draft.essays.studyPlan.languagePlan.length +
        draft.essays.studyPlan.goalOfStudy.length +
        draft.essays.studyPlan.futurePlan.length
      ).toLocaleString()} chars`,
    },
    {
      id: "recommendation",
      label: "Recommendation",
      href: "/apply/recommendation",
      status: essayStatus(draft.essays.recommendation, ESSAY_LIMITS.recommendation.maxChars),
      detail: `${draft.essays.recommendation.length.toLocaleString()} chars`,
    },
  ];

  const completed = sections.filter((s) => s.status === "complete").length;
  const partial = sections.filter((s) => s.status === "partial").length;
  const overallPercent = Math.round(((completed + partial * 0.5) / sections.length) * 100);

  return { sections, overallPercent };
}

function essayStatus(text: string, max: number): "empty" | "partial" | "complete" {
  if (text.length === 0) return "empty";
  if (text.length >= max * 0.6) return "complete";
  return "partial";
}
