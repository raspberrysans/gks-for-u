export type FormNumber = 1 | 2 | 3 | 4 | 5 | 6;

export const FORM_META: Array<{
  n: FormNumber;
  title: string;
  filename: string;
  filled: boolean;
}> = [
  { n: 1, title: "Application Form", filename: "gks-2026-form1-application.docx", filled: true },
  { n: 2, title: "Personal Statement", filename: "gks-2026-form2-personal-statement.docx", filled: true },
  { n: 3, title: "Study Plan", filename: "gks-2026-form3-study-plan.docx", filled: true },
  { n: 4, title: "Recommender's Information", filename: "gks-2026-form4-recommender.docx", filled: false },
  { n: 5, title: "Applicant Agreement", filename: "gks-2026-form5-agreement.docx", filled: false },
  { n: 6, title: "Personal Medical Assessment", filename: "gks-2026-form6-medical.docx", filled: false },
];
