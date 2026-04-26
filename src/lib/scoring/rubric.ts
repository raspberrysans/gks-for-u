import langBonuses from "../../../data/language-bonuses.json";
import type { GpaScale } from "../eligibility/types";
import type { RubricLineItem, RubricScore, ScoringInput } from "./types";

const SCALE_MAX: Record<GpaScale, number> = {
  "4.0": 4.0,
  "4.3": 4.3,
  "4.5": 4.5,
  "5.0": 5.0,
  "100": 100,
};

const SCALE_MIN_PASS: Record<GpaScale, number> = {
  "4.0": 2.64,
  "4.3": 2.80,
  "4.5": 2.91,
  "5.0": 3.23,
  "100": 80,
};

export function gpaToAcademicPoints(value: number, scale: GpaScale, classRankPercentile?: number): number {
  if (classRankPercentile !== undefined) {
    return Math.round(80 - Math.min(classRankPercentile, 20) * 1.5);
  }
  const min = SCALE_MIN_PASS[scale];
  const max = SCALE_MAX[scale];
  if (value < min) return 0;
  const ratio = (value - min) / (max - min);
  return Math.round(40 + ratio * 40);
}

export function topikBonusPoints(level: number): number {
  const entry = langBonuses.topik.levels.find((l) => l.level === level);
  return entry ? Math.round((entry.bonusPercent / 100) * 10) : 0;
}

export function englishBonusPoints(test?: ScoringInput["englishTest"]): number {
  if (!test) return 0;
  const bands = test.type === "toefl_ibt" ? langBonuses.english.toefl_ibt : langBonuses.english.ielts;
  for (const band of bands) {
    if (test.score >= band.min) return Math.round((band.bonusPercent / 100) * 10);
  }
  return 0;
}

export function computeRubric(input: ScoringInput): RubricScore {
  const lineItems: RubricLineItem[] = [];

  const academic = gpaToAcademicPoints(input.gpaValue, input.gpaScale, input.classRankPercentile);
  lineItems.push({
    label: "Academic record (GPA / class rank)",
    points: academic,
    max: 80,
    source: "Guideline §6 academic evaluation",
  });

  const topik = topikBonusPoints(input.topikLevel);
  lineItems.push({
    label: `TOPIK Level ${input.topikLevel} bonus`,
    points: topik,
    max: 10,
    source: "Guideline §6 language bonus (Korean)",
  });

  const english = englishBonusPoints(input.englishTest);
  lineItems.push({
    label: input.englishTest ? `English bonus (${input.englishTest.type.toUpperCase()} ${input.englishTest.score})` : "English bonus (none)",
    points: english,
    max: 10,
    source: "Guideline §6 language bonus (English)",
  });

  const stem = input.applyingToStem ? 5 : 0;
  lineItems.push({
    label: "STEM applicant bonus",
    points: stem,
    max: 5,
    source: "Guideline §6 STEM preference",
  });

  const veteran = input.veteranDescendant ? 5 : 0;
  lineItems.push({
    label: "Korean War veteran descendant bonus",
    points: veteran,
    max: 5,
    source: "Guideline §6 special bonus",
  });

  const total = lineItems.reduce((s, l) => s + l.points, 0);
  const max = lineItems.reduce((s, l) => s + l.max, 0);
  return { total, max, lineItems };
}
