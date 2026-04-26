import type { GpaScale, Track } from "../eligibility/types";

export type UniversityChoice = {
  universityId?: string;
  department?: string;
  fieldOfStudy?: string;
};

export type ApplicationDraft = {
  id: string;
  cycle: 2026;
  updatedAt: string;
  track?: Track;

  profile: {
    familyName?: string;
    givenName?: string;
    middleName?: string;
    dateOfBirth?: string;
    gender?: "M" | "F" | "X";
    citizenshipCountryCode?: string;
    addressCountry?: string;
    addressLine1?: string;
    addressLine2?: string;
    phone?: string;
    email?: string;
  };

  education: {
    highSchoolName?: string;
    highSchoolCity?: string;
    highSchoolStart?: string;
    highSchoolEnd?: string;
    expectedGraduationDate?: string;
    gpaValue?: number;
    gpaScale?: GpaScale;
    classRankPercentile?: number;
    hasAssociateDegree?: boolean;
    associateDegreeSchool?: string;
  };

  languages: {
    topikLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    topikDate?: string;
    englishTest?: "toefl_ibt" | "ielts" | "none";
    englishScore?: number;
  };

  universities: {
    choices: UniversityChoice[];
  };

  essays: {
    personalStatement: string;
    studyPlan: string;
    recommendation: string;
  };

  flags: {
    applyingToStem?: boolean;
    isOverseasKorean?: boolean;
    isUkrainian?: boolean;
    veteranDescendant?: boolean;
  };
};

export const SECTIONS = [
  "track",
  "profile",
  "education",
  "languages",
  "universities",
  "personal-statement",
  "study-plan",
  "recommendation",
  "review",
] as const;

export type Section = (typeof SECTIONS)[number];
