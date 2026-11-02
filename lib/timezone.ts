/** Offset of `timeZone` from UTC in minutes at `date` (DST-aware, via Intl). */
export function tzOffsetMinutes(timeZone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((asUtc - date.getTime()) / 60000);
}

const DAY = 24 * 60;
const mod = (n: number) => ((n % DAY) + DAY) % DAY;

/** A local working window [start, end) in hours, converted to UTC minute ranges (split if it wraps midnight). */
function utcRanges(startHour: number, endHour: number, offset: number): [number, number][] {
  const s = mod(startHour * 60 - offset);
  const e = mod(endHour * 60 - offset);
  return s < e ? [[s, e]] : [[s, DAY], [0, e]];
}

/** Overlap between two local working windows, as UTC minute ranges. */
export function overlapUtc(a: { start: number; end: number; offset: number }, b: { start: number; end: number; offset: number }) {
  const out: [number, number][] = [];
  for (const [as, ae] of utcRanges(a.start, a.end, a.offset)) {
    for (const [bs, be] of utcRanges(b.start, b.end, b.offset)) {
      const s = Math.max(as, bs);
      const e = Math.min(ae, be);
      if (e > s) out.push([s, e]);
    }
  }
  return out;
}

/** Format a UTC minute-of-day in a zone with the given offset, as HH:MM. */
export function fmtMinutes(utcMinute: number, offset: number) {
  const m = mod(utcMinute + offset);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export const toLocalMinute = (utcMinute: number, offset: number) => mod(utcMinute + offset);
