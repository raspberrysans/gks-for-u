import JSZip from "jszip";
import universities from "../../../data/universities.json";
import countries from "../../../data/countries.json";
import type { ApplicationDraft } from "../wizard/types";
import { FORM_META, type FormNumber } from "./formMeta";

export { FORM_META, type FormNumber };

const ALL_UNIS = [...universities.typeA, ...universities.typeB];
const uniName = (id?: string) =>
  id ? ALL_UNIS.find((u) => u.id === id)?.name ?? id : "";
const countryName = (code?: string) =>
  code ? countries.countries.find((c) => c.code === code)?.name ?? code : "";

const TEMPLATE_URL = "/templates/gks-2026-application.docx";

let templateBytesCache: ArrayBuffer | null = null;
async function loadTemplate(): Promise<ArrayBuffer> {
  if (templateBytesCache) return templateBytesCache;
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok)
    throw new Error(`Failed to load form template: ${res.status} ${res.statusText}`);
  templateBytesCache = await res.arrayBuffer();
  return templateBytesCache;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildRun(text: string, opts: { bold?: boolean } = {}): string {
  const lines = text.split("\n");
  const runs: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) runs.push("<w:br/>");
    if (lines[i].length > 0) {
      runs.push(
        `<w:t xml:space="preserve">${escapeXml(lines[i])}</w:t>`,
      );
    }
  }
  const rPr = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:eastAsia="굴림" w:hAnsi="Times New Roman"/><w:sz w:val="22"/><w:szCs w:val="22"/>${opts.bold ? "<w:b/>" : ""}</w:rPr>`;
  return `<w:r>${rPr}${runs.join("")}</w:r>`;
}

function buildParagraph(text: string, opts: { bold?: boolean } = {}): string {
  return `<w:p><w:pPr><w:spacing w:after="0" w:line="276" w:lineRule="auto"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:eastAsia="굴림" w:hAnsi="Times New Roman"/><w:sz w:val="22"/></w:rPr></w:pPr>${buildRun(text, opts)}</w:p>`;
}

type TextIndex = {
  joined: string;
  runs: Array<{ xmlStart: number; length: number; joinedStart: number }>;
};

function buildTextIndex(xml: string): TextIndex {
  const re = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
  const runs: TextIndex["runs"] = [];
  let joined = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const text = m[1];
    if (!text) continue;
    const xmlStart = m.index + m[0].indexOf(">", 0) + 1;
    runs.push({ xmlStart, length: text.length, joinedStart: joined.length });
    joined += text;
  }
  return { joined, runs };
}

function findAnchorXmlOffset(
  index: TextIndex,
  needle: string,
  occurrence = 0,
): number {
  let from = 0;
  for (let i = 0; i <= occurrence; i++) {
    const hit = index.joined.indexOf(needle, from);
    if (hit < 0) return -1;
    if (i === occurrence) {
      for (const r of index.runs) {
        if (hit >= r.joinedStart && hit < r.joinedStart + r.length) {
          return r.xmlStart + (hit - r.joinedStart);
        }
      }
      return -1;
    }
    from = hit + 1;
  }
  return -1;
}

function findEnclosingTc(
  xml: string,
  innerIndex: number,
): [number, number] | null {
  let pos = innerIndex;
  while (pos >= 0) {
    const open = xml.lastIndexOf("<w:tc>", pos);
    const openWithAttr = xml.lastIndexOf("<w:tc ", pos);
    const tcStart = Math.max(open, openWithAttr);
    if (tcStart < 0) return null;

    let depth = 0;
    let i = tcStart;
    while (i < xml.length) {
      const o1 = xml.indexOf("<w:tc>", i);
      const o2 = xml.indexOf("<w:tc ", i);
      const nextOpen = o1 < 0 ? o2 : o2 < 0 ? o1 : Math.min(o1, o2);
      const nextClose = xml.indexOf("</w:tc>", i);
      if (nextClose < 0) return null;
      if (nextOpen >= 0 && nextOpen < nextClose) {
        depth++;
        i = nextOpen + 1;
      } else {
        depth--;
        if (depth === 0) {
          const tcEnd = nextClose + "</w:tc>".length;
          if (tcStart <= innerIndex && innerIndex < tcEnd)
            return [tcStart, tcEnd];
          break;
        }
        i = nextClose + 1;
      }
    }
    pos = tcStart - 1;
  }
  return null;
}

function appendInCell(
  xml: string,
  anchor: string,
  occurrence: number,
  value: string,
  opts: { bold?: boolean } = {},
): string {
  if (!value) return xml;
  const idx = buildTextIndex(xml);
  const off = findAnchorXmlOffset(idx, anchor, occurrence);
  if (off < 0) return xml;
  const tc = findEnclosingTc(xml, off);
  if (!tc) return xml;
  const insertAt = tc[1] - "</w:tc>".length;
  return xml.slice(0, insertAt) + buildParagraph(value, opts) + xml.slice(insertAt);
}

function appendInNextCell(
  xml: string,
  anchor: string,
  occurrence: number,
  value: string,
): string {
  if (!value) return xml;
  const idx = buildTextIndex(xml);
  const off = findAnchorXmlOffset(idx, anchor, occurrence);
  if (off < 0) return xml;
  const tc = findEnclosingTc(xml, off);
  if (!tc) return xml;
  const trCloseIdx = xml.indexOf("</w:tr>", tc[1]);
  const o1 = xml.indexOf("<w:tc>", tc[1]);
  const o2 = xml.indexOf("<w:tc ", tc[1]);
  const cands = [o1, o2].filter((n) => n >= 0);
  if (cands.length === 0) return xml;
  const nextTcOpen = Math.min(...cands);
  if (trCloseIdx >= 0 && nextTcOpen > trCloseIdx) return xml;
  const sib = findEnclosingTc(xml, nextTcOpen + 1);
  if (!sib) return xml;
  const insertAt = sib[1] - "</w:tc>".length;
  return xml.slice(0, insertAt) + buildParagraph(value) + xml.slice(insertAt);
}

function bodyToParagraphs(body: string): string {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks.map((b) => buildParagraph(b)).join("");
}

function insertEssayAfter(
  xml: string,
  anchor: string,
  body: string,
): string {
  if (!body || !body.trim()) return xml;
  const idx = buildTextIndex(xml);
  const off = findAnchorXmlOffset(idx, anchor, 0);
  if (off < 0) return xml;
  const pCloseIdx = xml.indexOf("</w:p>", off);
  if (pCloseIdx < 0) return xml;
  const insertAt = pCloseIdx + "</w:p>".length;
  return xml.slice(0, insertAt) + bodyToParagraphs(body) + xml.slice(insertAt);
}

// Insert a multi-paragraph block (built from `content`) after the paragraph that contains `anchor`.
function insertBlockAfter(
  xml: string,
  anchor: string,
  content: string,
): string {
  if (!content) return xml;
  const idx = buildTextIndex(xml);
  const off = findAnchorXmlOffset(idx, anchor, 0);
  if (off < 0) return xml;
  const pCloseIdx = xml.indexOf("</w:p>", off);
  if (pCloseIdx < 0) return xml;
  const insertAt = pCloseIdx + "</w:p>".length;
  return xml.slice(0, insertAt) + content + xml.slice(insertAt);
}

function fillAllForms(xml: string, draft: ApplicationDraft): string {
  const p = draft.profile;
  const e = draft.education;

  // FORM 1 — Personal info.
  xml = appendInCell(xml, "Family Name", 0, p.familyName ?? "");
  xml = appendInCell(xml, "Given Name", 0, p.givenName ?? "");
  xml = appendInCell(xml, "Middle Name", 0, p.middleName ?? "");
  xml = appendInNextCell(xml, "Date of Birth", 0, p.dateOfBirth ?? "");
  xml = appendInCell(xml, " of Citizenship ", 0, countryName(p.citizenshipCountryCode));
  xml = appendInCell(
    xml,
    "Address",
    0,
    [p.addressLine1, p.addressLine2, p.addressCountry].filter(Boolean).join(", "),
  );
  xml = appendInCell(xml, "Phone (start with the country code)", 0, p.phone ?? "");
  xml = appendInCell(xml, "-mail", 0, p.email ?? "");
  xml = appendInCell(xml, "High School Name", 0, e.highSchoolName ?? "");
  xml = appendInCell(
    xml,
    "Period of Attendance",
    0,
    e.highSchoolStart && e.highSchoolEnd
      ? `${e.highSchoolStart} ~ ${e.highSchoolEnd}`
      : "",
  );
  xml = appendInCell(xml, "Date of e", 0, e.expectedGraduationDate ?? "");
  if (e.gpaValue !== undefined) {
    xml = appendInCell(xml, "Converted CGPA", 0, `${e.gpaValue}/${e.gpaScale ?? "4.0"}`);
  }

  draft.universities.choices.forEach((c, i) => {
    if (!c.universityId && !c.department && !c.fieldOfStudy) return;
    const value = [uniName(c.universityId), c.fieldOfStudy, c.department]
      .filter(Boolean)
      .join(" — ");
    xml = appendInCell(xml, "Choice ", i + 1, value);
  });

  // FORM 2 — anchor on the LAST sentence of the instructions block so the essay lands
  // after every instruction paragraph (intro + bullet list + supplementary-docs note),
  // immediately before the Date/Signature footer.
  xml = insertEssayAfter(
    xml,
    "Other documents can be submitted",
    draft.essays.personalStatement,
  );

  // FORM 3 — three official sub-sections. The sub-section headings live inside table cells,
  // so we insert one composite block after FORM 3's instructions paragraph (which is a
  // top-level paragraph just above the Date/Signature footer). Each user-filled section gets
  // its own bold heading so reviewers can tell them apart.
  const sp = draft.essays.studyPlan;
  const studyPlanParts: string[] = [];
  if (sp.languagePlan?.trim()) {
    studyPlanParts.push(buildParagraph("1. Language Study Plan", { bold: true }));
    studyPlanParts.push(bodyToParagraphs(sp.languagePlan));
  }
  if (sp.goalOfStudy?.trim()) {
    studyPlanParts.push(buildParagraph("2. Goal of Study & Study Plan", { bold: true }));
    studyPlanParts.push(bodyToParagraphs(sp.goalOfStudy));
  }
  if (sp.futurePlan?.trim()) {
    studyPlanParts.push(buildParagraph("3. Future Plan after Study", { bold: true }));
    studyPlanParts.push(bodyToParagraphs(sp.futurePlan));
  }
  if (studyPlanParts.length > 0) {
    xml = insertBlockAfter(
      xml,
      "single spaced within THREE pages",
      studyPlanParts.join(""),
    );
  }

  // FORMs 4–6 left blank — they need ink signatures and applicant-specific acknowledgements.

  return xml;
}

// Find the start of the <w:p> paragraph that contains the given xml offset.
function findEnclosingParagraphStart(xml: string, off: number): number {
  const a = xml.lastIndexOf("<w:p>", off);
  const b = xml.lastIndexOf("<w:p ", off);
  return Math.max(a, b);
}

// Slice the filled XML to just the range of FORM `n`. Range = from the start of the form's
// heading paragraph to the start of the next form's heading paragraph (or to the trailing
// <w:sectPr> for FORM 6).
function sliceFormRange(xml: string, n: FormNumber): { start: number; end: number } | null {
  const idx = buildTextIndex(xml);
  const startOff = findAnchorXmlOffset(idx, `FORM ${n}.`, 0);
  if (startOff < 0) return null;
  const start = findEnclosingParagraphStart(xml, startOff);
  if (start < 0) return null;

  let end: number;
  if (n < 6) {
    const nextOff = findAnchorXmlOffset(idx, `FORM ${(n + 1) as FormNumber}.`, 0);
    if (nextOff < 0) return null;
    end = findEnclosingParagraphStart(xml, nextOff);
    if (end < 0) return null;
  } else {
    const bodyEnd = xml.lastIndexOf("</w:body>");
    const sectPrStart = xml.lastIndexOf("<w:sectPr", bodyEnd);
    end = sectPrStart >= 0 ? sectPrStart : bodyEnd;
  }
  return { start, end };
}

function wrapSingleFormBody(originalXml: string, slice: string): string {
  const bodyOpenAttr = originalXml.indexOf("<w:body>");
  const bodyOpenLen = "<w:body>".length;
  const bodyEnd = originalXml.lastIndexOf("</w:body>");
  const sectPrStart = originalXml.lastIndexOf("<w:sectPr", bodyEnd);
  let sectPr = "";
  if (sectPrStart >= 0) {
    const close = originalXml.indexOf("</w:sectPr>", sectPrStart);
    if (close >= 0) {
      sectPr = originalXml.slice(sectPrStart, close + "</w:sectPr>".length);
    } else {
      const selfClose = originalXml.indexOf("/>", sectPrStart);
      if (selfClose >= 0 && selfClose < bodyEnd) {
        sectPr = originalXml.slice(sectPrStart, selfClose + 2);
      }
    }
  }
  return (
    originalXml.slice(0, bodyOpenAttr + bodyOpenLen) +
    slice +
    sectPr +
    originalXml.slice(bodyEnd)
  );
}

async function buildDocxFromXml(xml: string): Promise<Uint8Array> {
  const tplBytes = await loadTemplate();
  const zip = await JSZip.loadAsync(tplBytes);
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export async function generateApplicationDocx(
  draft: ApplicationDraft,
): Promise<Uint8Array> {
  const tplBytes = await loadTemplate();
  const zip = await JSZip.loadAsync(tplBytes);
  const docXmlFile = zip.file("word/document.xml");
  if (!docXmlFile) throw new Error("Template missing word/document.xml");
  let xml = await docXmlFile.async("string");
  xml = fillAllForms(xml, draft);
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export async function buildSingleFormDocx(
  draft: ApplicationDraft,
  n: FormNumber,
): Promise<Uint8Array> {
  const tplBytes = await loadTemplate();
  const zip = await JSZip.loadAsync(tplBytes);
  const docXmlFile = zip.file("word/document.xml");
  if (!docXmlFile) throw new Error("Template missing word/document.xml");
  const originalXml = await docXmlFile.async("string");
  const filledXml = fillAllForms(originalXml, draft);

  const range = sliceFormRange(filledXml, n);
  if (!range)
    throw new Error(`Could not locate FORM ${n} boundaries in template.`);
  const slice = filledXml.slice(range.start, range.end);
  const finalXml = wrapSingleFormBody(filledXml, slice);
  return buildDocxFromXml(finalXml);
}
