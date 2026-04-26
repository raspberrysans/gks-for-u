import rules from "../../../data/eligibility-rules.json";
import countries from "../../../data/countries.json";
import type {
  ApplicantProfile,
  Blocker,
  EligibilityResult,
  GpaScale,
  Track,
  Warning,
} from "./types";

const ALL_TRACKS: Track[] = [
  "embassy-general",
  "embassy-overseas-korean",
  "embassy-irts",
  "university-uic",
  "university-rgks",
  "associate",
];

export function meetsGpaThreshold(value: number, scale: GpaScale, classRankPercentile?: number): boolean {
  if (classRankPercentile !== undefined && classRankPercentile <= rules.gpaMinimums.topPercentile) {
    return true;
  }
  const key = `scale_${scale.replace(".", "_")}` as keyof typeof rules.gpaMinimums;
  const min = rules.gpaMinimums[key];
  return typeof min === "number" && value >= min;
}

export function meetsAgeRequirement(dateOfBirth: string): boolean {
  return new Date(dateOfBirth) > new Date(rules.ageCutoffBornAfter);
}

export function isCountryNiiedDesignated(code: string): boolean {
  return countries.countries.some((c) => c.code === code.toUpperCase());
}

export function evaluateEligibility(profile: ApplicantProfile): EligibilityResult {
  const blockers: Blocker[] = [];
  const warnings: Warning[] = [];

  const meetsAge = meetsAgeRequirement(profile.dateOfBirth);
  if (!meetsAge) {
    blockers.push({
      code: "age_over_limit",
      message: `Applicants must be born after ${rules.ageCutoffBornAfter} (under 25 at application).`,
      severity: "hard",
    });
  }

  const isCountrySupported = isCountryNiiedDesignated(profile.citizenshipCountryCode);
  if (!isCountrySupported) {
    blockers.push({
      code: "country_not_designated",
      message: "Your country is not on the NIIED-designated list for this cycle.",
      severity: "hard",
    });
  }

  if (profile.holdsKoreanCitizenship || profile.parentHoldsKoreanCitizenship) {
    blockers.push({
      code: "korean_citizenship",
      message: "Applicants and their parents must hold non-Korean citizenship.",
      severity: "hard",
    });
  }

  if (profile.hasBachelorsDegree) {
    blockers.push({
      code: "already_has_bachelors",
      message: "Applicants who already hold a bachelor's degree are ineligible for the undergraduate program.",
      severity: "hard",
    });
  }

  if (profile.graduatedKoreanHighSchool) {
    blockers.push({
      code: "korean_high_school",
      message: "Graduates of Korean high schools (including international schools in Korea) are ineligible.",
      severity: "hard",
    });
  }

  if (profile.priorKoreanGovScholarship) {
    blockers.push({
      code: "prior_kgov_scholarship",
      message: "Applicants who previously received a Korean government degree scholarship are ineligible.",
      severity: "hard",
    });
  }

  if (profile.withdrewFromGksWithin3Years) {
    blockers.push({
      code: "gks_withdrawal_recent",
      message: "Applicants who withdrew from GKS within the past 3 years are ineligible.",
      severity: "hard",
    });
  }

  if (profile.criminalRecord) {
    blockers.push({
      code: "criminal_record",
      message: "A criminal record disqualifies the applicant.",
      severity: "hard",
    });
  }

  if (profile.infectiousDisease) {
    blockers.push({
      code: "infectious_disease",
      message: "Applicants with active infectious disease are ineligible until cleared.",
      severity: "hard",
    });
  }

  if (profile.currentlyEnrolledInKoreanUniversity) {
    blockers.push({
      code: "currently_in_korean_uni",
      message: "Applicants currently enrolled in a Korean university are ineligible.",
      severity: "hard",
    });
  }

  const meetsGpa = meetsGpaThreshold(profile.gpaValue, profile.gpaScale, profile.classRankPercentile);
  if (!meetsGpa) {
    blockers.push({
      code: "gpa_below_threshold",
      message: `GPA does not meet the minimum threshold for scale ${profile.gpaScale}.`,
      severity: "hard",
    });
  } else {
    const buffer = nearThresholdBuffer(profile.gpaValue, profile.gpaScale);
    if (buffer < 0.1) {
      warnings.push({
        code: "gpa_close_to_threshold",
        message: "Your GPA is close to the minimum cutoff — make other parts of the application very strong.",
        severity: "soft",
      });
    }
  }

  const eligibleTracks: Track[] = blockers.length === 0 ? deriveTracks(profile) : [];

  return {
    eligibleTracks,
    blockers,
    warnings,
    meetsAge,
    meetsGpa,
    isCountrySupported,
  };
}

function nearThresholdBuffer(value: number, scale: GpaScale): number {
  const key = `scale_${scale.replace(".", "_")}` as keyof typeof rules.gpaMinimums;
  const min = rules.gpaMinimums[key];
  if (typeof min !== "number") return 999;
  return value - min;
}

function deriveTracks(profile: ApplicantProfile): Track[] {
  const tracks: Track[] = ["embassy-general", "university-rgks", "associate"];
  const country = countries.countries.find((c) => c.code === profile.citizenshipCountryCode.toUpperCase());
  if (profile.applyingToStem) tracks.push("university-uic");
  if (profile.isOverseasKorean) tracks.push("embassy-overseas-korean");
  if (profile.isUkrainian || country?.code === "UA") tracks.push("embassy-irts");
  return Array.from(new Set(tracks)).filter((t) => ALL_TRACKS.includes(t));
}
