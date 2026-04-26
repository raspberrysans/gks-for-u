import { describe, expect, it } from "vitest";
import { computeRubric, englishBonusPoints, gpaToAcademicPoints, topikBonusPoints } from "./rubric";
import { computeCompetitiveness } from "./competitiveness";
import type { ScoringInput } from "./types";

const baseInput: ScoringInput = {
  dateOfBirth: "2005-06-15",
  citizenshipCountryCode: "VN",
  holdsKoreanCitizenship: false,
  parentHoldsKoreanCitizenship: false,
  hasBachelorsDegree: false,
  graduatedKoreanHighSchool: false,
  expectedGraduationDate: "2025-06-30",
  gpaValue: 3.5,
  gpaScale: "4.0",
  priorKoreanGovScholarship: false,
  withdrewFromGksWithin3Years: false,
  criminalRecord: false,
  infectiousDisease: false,
  currentlyEnrolledInKoreanUniversity: false,
  topikLevel: 3,
};

describe("gpaToAcademicPoints", () => {
  it("perfect GPA scores 80", () => {
    expect(gpaToAcademicPoints(4.0, "4.0")).toBe(80);
  });
  it("min passing GPA scores 40", () => {
    expect(gpaToAcademicPoints(2.64, "4.0")).toBe(40);
  });
  it("below threshold scores 0", () => {
    expect(gpaToAcademicPoints(2.0, "4.0")).toBe(0);
  });
  it("class rank top 1% scores ~78", () => {
    expect(gpaToAcademicPoints(0, "4.0", 1)).toBe(79);
  });
});

describe("topikBonusPoints", () => {
  it("level 6 = 10", () => expect(topikBonusPoints(6)).toBe(10));
  it("level 3 = 8", () => expect(topikBonusPoints(3)).toBe(8));
  it("level 0 = 0", () => expect(topikBonusPoints(0)).toBe(0));
});

describe("englishBonusPoints", () => {
  it("TOEFL 115 = 10", () => {
    expect(englishBonusPoints({ type: "toefl_ibt", score: 115 })).toBe(10);
  });
  it("IELTS 6.5 = 8", () => {
    expect(englishBonusPoints({ type: "ielts", score: 6.5 })).toBe(8);
  });
  it("missing test = 0", () => {
    expect(englishBonusPoints(undefined)).toBe(0);
  });
});

describe("computeRubric", () => {
  it("totals across all line items, capped at 110 max", () => {
    const r = computeRubric({
      ...baseInput,
      gpaValue: 4.0,
      topikLevel: 6,
      englishTest: { type: "toefl_ibt", score: 115 },
      applyingToStem: true,
      veteranDescendant: true,
    });
    expect(r.max).toBe(110);
    expect(r.total).toBe(110);
  });

  it("baseline profile has no STEM/veteran bonuses", () => {
    const r = computeRubric(baseInput);
    expect(r.lineItems.find((l) => l.label.includes("STEM"))?.points).toBe(0);
    expect(r.lineItems.find((l) => l.label.includes("veteran"))?.points).toBe(0);
  });
});

describe("computeCompetitiveness", () => {
  it("strong applicant gets Strong or Very Strong tier", () => {
    const rubric = computeRubric({
      ...baseInput,
      gpaValue: 3.9,
      topikLevel: 5,
      englishTest: { type: "ielts", score: 7.5 },
    });
    const c = computeCompetitiveness({ ...baseInput, topikLevel: 5 }, rubric);
    expect(["Strong", "Very Strong"]).toContain(c.tier);
  });

  it("weak applicant gets suggestions", () => {
    const rubric = computeRubric({ ...baseInput, gpaValue: 2.7, topikLevel: 0 });
    const c = computeCompetitiveness({ ...baseInput, topikLevel: 0 }, rubric);
    expect(c.suggestions.length).toBeGreaterThan(0);
  });
});
