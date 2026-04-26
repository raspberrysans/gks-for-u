const pad = (n: number) => n.toString().padStart(2, "0");

export function formatYMD(input: Date | string | number | null | undefined): string {
  if (input === null || input === undefined || input === "") return "";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatYMDHM(input: Date | string | number | null | undefined): string {
  if (input === null || input === undefined || input === "") return "";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return `${formatYMD(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Parse a YYYY-MM-DD string as a local-time Date (no UTC drift). */
export function parseYMD(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isValidYMD(value: string): boolean {
  const d = parseYMD(value);
  if (!d) return false;
  // Reject e.g. "2024-02-31" — Date silently rolls over.
  return formatYMD(d) === value;
}
