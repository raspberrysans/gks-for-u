export type GpaScale = "4.0" | "4.3" | "4.5" | "5.0" | "100";

export type Track =
  | "embassy-general"
  | "embassy-overseas-korean"
  | "embassy-irts"
  | "university-uic"
  | "university-rgks"
  | "associate";

export type ApplicantProfile = {
  dateOfBirth: string;
  citizenshipCountryCode: string;
  holdsKoreanCitizenship: boolean;
  parentHoldsKoreanCitizenship: boolean;
  hasBachelorsDegree: boolean;
  graduatedKoreanHighSchool: boolean;
  expectedGraduationDate: string;
  gpaValue: number;
  gpaScale: GpaScale;
  classRankPercentile?: number;
  priorKoreanGovScholarship: boolean;
  withdrewFromGksWithin3Years: boolean;
  criminalRecord: boolean;
  infectiousDisease: boolean;
  currentlyEnrolledInKoreanUniversity: boolean;
  isOverseasKorean?: boolean;
  isUkrainian?: boolean;
  applyingToStem?: boolean;
};

export type Blocker = {
  code: string;
  message: string;
  severity: "hard";
};

export type Warning = {
  code: string;
  message: string;
  severity: "soft";
};

export type EligibilityResult = {
  eligibleTracks: Track[];
  blockers: Blocker[];
  warnings: Warning[];
  meetsAge: boolean;
  meetsGpa: boolean;
  isCountrySupported: boolean;
};
