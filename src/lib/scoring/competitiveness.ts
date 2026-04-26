import countries from "../../../data/countries.json";
import type { CompetitivenessScore, CompetitivenessTier, RubricScore, ScoringInput } from "./types";

const TIERS: CompetitivenessTier[] = ["Low", "Moderate", "Strong", "Very Strong"];

export function computeCompetitiveness(input: ScoringInput, rubric: RubricScore): CompetitivenessScore {
  const reasons: string[] = [];
  const suggestions: string[] = [];
  let signal = 0;

  const country = countries.countries.find((c) => c.code === input.citizenshipCountryCode.toUpperCase());
  const quota = country?.embassyQuota ?? 1;
  if (quota >= 2) {
    signal += 1;
    reasons.push(`Your country has an embassy quota of ${quota} — slightly less competitive than single-quota countries.`);
  } else {
    reasons.push(`Your country has an embassy quota of ${quota} — extremely competitive.`);
    suggestions.push("Consider the University Track (R-GKS) where regional quotas are larger.");
  }

  const rubricRatio = rubric.total / rubric.max;
  if (rubricRatio >= 0.85) {
    signal += 2;
    reasons.push(`Strong rubric score (${Math.round(rubricRatio * 100)}%).`);
  } else if (rubricRatio >= 0.7) {
    signal += 1;
    reasons.push(`Solid rubric score (${Math.round(rubricRatio * 100)}%).`);
  } else {
    reasons.push(`Below-average rubric score (${Math.round(rubricRatio * 100)}%).`);
    suggestions.push("Take TOPIK or improve TOEFL/IELTS to add up to 20 points.");
  }

  if (input.topikLevel >= 4) {
    signal += 1;
    reasons.push(`TOPIK Level ${input.topikLevel} signals strong Korean readiness.`);
  } else {
    suggestions.push("TOPIK Level 4+ unlocks more departments and skips the language program.");
  }

  if (input.university1Type === "A") {
    reasons.push("First choice is a Type A university — high prestige, high competition.");
    suggestions.push("Add at least one Type B as a safety choice (Embassy Track requires this).");
  }

  if (input.applyingToStem) {
    reasons.push("STEM applicants get a +5 rubric bonus and access to UIC track.");
  }

  const tierIdx = Math.min(Math.max(signal, 0), TIERS.length - 1);
  return { tier: TIERS[tierIdx], reasons, suggestions };
}
