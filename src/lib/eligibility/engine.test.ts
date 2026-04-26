import { describe, expect, it } from "vitest";
import { evaluateEligibility, meetsAgeRequirement, meetsGpaThreshold } from "./engine";
import type { ApplicantProfile } from "./types";

const baseProfile: ApplicantProfile = {
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
};

describe("meetsAgeRequirement", () => {
  it("accepts a 19-year-old", () => {
    expect(meetsAgeRequirement("2006-01-01")).toBe(true);
  });
  it("rejects someone born before the cutoff", () => {
    expect(meetsAgeRequirement("2000-01-01")).toBe(false);
  });
});

describe("meetsGpaThreshold", () => {
  it("passes 3.5/4.0", () => {
    expect(meetsGpaThreshold(3.5, "4.0")).toBe(true);
  });
  it("fails 2.0/4.0", () => {
    expect(meetsGpaThreshold(2.0, "4.0")).toBe(false);
  });
  it("passes 80/100", () => {
    expect(meetsGpaThreshold(80, "100")).toBe(true);
  });
  it("passes when class rank percentile is top 20", () => {
    expect(meetsGpaThreshold(2.0, "4.0", 15)).toBe(true);
  });
  it("each scale has a threshold", () => {
    expect(meetsGpaThreshold(3.0, "4.3")).toBe(true);
    expect(meetsGpaThreshold(3.0, "4.5")).toBe(true);
    expect(meetsGpaThreshold(3.5, "5.0")).toBe(true);
  });
});

describe("evaluateEligibility", () => {
  it("clean profile produces no blockers and includes embassy-general", () => {
    const r = evaluateEligibility(baseProfile);
    expect(r.blockers).toHaveLength(0);
    expect(r.eligibleTracks).toContain("embassy-general");
  });

  it("Korean citizenship is a hard blocker", () => {
    const r = evaluateEligibility({ ...baseProfile, holdsKoreanCitizenship: true });
    expect(r.blockers.map((b) => b.code)).toContain("korean_citizenship");
    expect(r.eligibleTracks).toEqual([]);
  });

  it("over-age is a hard blocker", () => {
    const r = evaluateEligibility({ ...baseProfile, dateOfBirth: "1995-01-01" });
    expect(r.blockers.map((b) => b.code)).toContain("age_over_limit");
  });

  it("non-NIIED country is a hard blocker", () => {
    const r = evaluateEligibility({ ...baseProfile, citizenshipCountryCode: "ZZ" });
    expect(r.blockers.map((b) => b.code)).toContain("country_not_designated");
  });

  it("low GPA blocks", () => {
    const r = evaluateEligibility({ ...baseProfile, gpaValue: 2.0 });
    expect(r.blockers.map((b) => b.code)).toContain("gpa_below_threshold");
  });

  it("Ukrainian applicant gets IRTS track", () => {
    const r = evaluateEligibility({ ...baseProfile, citizenshipCountryCode: "UA" });
    expect(r.eligibleTracks).toContain("embassy-irts");
  });

  it("STEM applicant gets UIC track", () => {
    const r = evaluateEligibility({ ...baseProfile, applyingToStem: true });
    expect(r.eligibleTracks).toContain("university-uic");
  });

  it("GPA close to threshold produces a soft warning", () => {
    const r = evaluateEligibility({ ...baseProfile, gpaValue: 2.7 });
    expect(r.warnings.map((w) => w.code)).toContain("gpa_close_to_threshold");
  });
});
