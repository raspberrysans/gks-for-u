import type { ApplicantProfile, Track } from "../eligibility/types";

export type ScoringInput = ApplicantProfile & {
  topikLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  englishTest?: { type: "toefl_ibt" | "ielts"; score: number };
  university1Type?: "A" | "B" | "none";
  veteranDescendant?: boolean;
  selectedTrack?: Track;
};

export type RubricLineItem = {
  label: string;
  points: number;
  max: number;
  source: string;
};

export type RubricScore = {
  total: number;
  max: number;
  lineItems: RubricLineItem[];
};

export type CompetitivenessTier = "Low" | "Moderate" | "Strong" | "Very Strong";

export type CompetitivenessScore = {
  tier: CompetitivenessTier;
  reasons: string[];
  suggestions: string[];
};
