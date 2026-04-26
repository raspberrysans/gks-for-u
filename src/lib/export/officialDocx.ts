import JSZip from "jszip";
import universities from "../../../data/universities.json";
import countries from "../../../data/countries.json";
import type { ApplicationDraft } from "../wizard/types";

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

// Build a Word run with Times New Roman 11pt, matching the form's font requirements.
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

// Build an index that lets us search the document's flowing text (joined across <w:t> runs)
// while mapping a hit back to a concrete byte offset in the original XML.
// `joined` is the concatenation of every <w:t>...</w:t> body; each entry in `runs` records
// the xml offset of that run's text content and the length of that content.
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

// Find the n-th occurrence (0-indexed) of `needle` in joined text; return the XML offset of its first character.
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
      // Find the run that contains this joined offset.
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

// Given an index that lies inside a <w:tc>, return [tcStart, tcEnd] (inclusive of tags).
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

    // Walk forward from tcStart with proper depth counting.
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

// Replace the empty paragraph block sitting just below a heading anchor (Form 2/3 essay body).
// We insert paragraphs immediately after the first <w:p>...anchor...</w:p> within the document
// region containing the form. Splits on \n\n into paragraphs.
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
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  const paragraphs = blocks.map((b) => buildParagraph(b)).join("");
  return xml.slice(0, insertAt) + paragraphs + xml.slice(insertAt);
}

export async function generateApplicationDocx(
  draft: ApplicationDraft,
): Promise<Uint8Array> {
  const tplBytes = await loadTemplate();
  const zip = await JSZip.loadAsync(tplBytes);
  const docXmlFile = zip.file("word/document.xml");
  if (!docXmlFile) throw new Error("Template missing word/document.xml");
  let xml = await docXmlFile.async("string");

  const p = draft.profile;
  const e = draft.education;

  // FORM 1 — Personal info. Each anchor's `occurrence` is its 0-indexed match in the document's
  // joined <w:t> text; values are appended as a new paragraph at the end of the cell that holds
  // the anchor. Sibling-cell mode is used when the label and value live in separate cells.
  xml = appendInCell(xml, "Family Name", 0, p.familyName ?? "");
  // "Given Name" appears in FORM 1 (occurrence 0) and again in FORM 4 (occurrence 1).
  xml = appendInCell(xml, "Given Name", 0, p.givenName ?? "");
  xml = appendInCell(xml, "Middle Name", 0, p.middleName ?? "");
  // DOB label is in a narrow label cell, value goes in the adjacent cell.
  xml = appendInNextCell(xml, "Date of Birth", 0, p.dateOfBirth ?? "");
  // "Country" + " of Citizenship " is split; anchor on the first " of Citizenship " text run.
  // First (FORM 1) match is occurrence 0; FORM 4 is occurrence 1.
  xml = appendInCell(xml, " of Citizenship ", 0, countryName(p.citizenshipCountryCode));
  // Address / Phone / E-mail share Row pattern: label cell + empty value paragraphs in same cell.
  xml = appendInCell(
    xml,
    "Address",
    0, // FORM 1 first
    [p.addressLine1, p.addressLine2, p.addressCountry].filter(Boolean).join(", "),
  );
  xml = appendInCell(xml, "Phone (start with the country code)", 0, p.phone ?? "");
  // "E-mail" is split as "E" + "-mail"; "-mail" appears once and is uniquely the email field.
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
  // "Date of expected graduation" is split — anchor on "Date of e" first occurrence (HS section).
  xml = appendInCell(xml, "Date of e", 0, e.expectedGraduationDate ?? "");
  if (e.gpaValue !== undefined) {
    xml = appendInCell(xml, "Converted CGPA", 0, `${e.gpaValue}/${e.gpaScale ?? "4.0"}`);
  }

  // University choices — "Choice " text runs appear in this order in the document:
  //   [0] "Choice of University and Department"  (header — skip)
  //   [1] Choice 1, [2] Choice 2, [3] Choice 3
  draft.universities.choices.forEach((c, i) => {
    if (!c.universityId && !c.department && !c.fieldOfStudy) return;
    const value = [uniName(c.universityId), c.fieldOfStudy, c.department]
      .filter(Boolean)
      .join(" — ");
    xml = appendInCell(xml, "Choice ", i + 1, value);
  });

  // FORM 2 — Personal Statement body. Anchor "PERSONAL STATEMENT" appears once in the
  // FORM 2 title; we insert paragraphs immediately after that title's <w:p>.
  xml = insertEssayAfter(xml, "PERSONAL STATEMENT", draft.essays.personalStatement);

  // FORM 3 — Study Plan body. "STUDY PLAN" first occurrence is FORM 3's title.
  xml = insertEssayAfter(xml, "STUDY PLAN", draft.essays.studyPlan);

  // FORM 4 (recommender), FORM 5 (agreement), FORM 6 (medical) are intentionally left
  // for the user to complete by hand on the printed form — those pages need ink signatures
  // and case-by-case acknowledgements.

  zip.file("word/document.xml", xml);
  const out = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
  });
  return out;
}
