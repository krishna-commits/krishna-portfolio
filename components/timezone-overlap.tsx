"use client";

import { useEffect, useMemo, useState } from "react";
import { workingHours } from "@/lib/data";
import { fmtMinutes, overlapUtc, toLocalMinute, tzOffsetMinutes } from "@/lib/timezone";

const CITIES = [
  { label: "San Francisco", tz: "America/Los_Angeles" },
  { label: "New York", tz: "America/New_York" },
  { label: "Toronto", tz: "America/Toronto" },
  { label: "London", tz: "Europe/London" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Bengaluru", tz: "Asia/Kolkata" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Sydney", tz: "Australia/Sydney" },
];

const DAY = 1440;

/** "Where's your team?" Shows shared working hours with Krishna in the visitor's time zone. */
export function TimezoneOverlap() {
  const [tz, setTz] = useState<string | null>(null);
  const [teamStart, setTeamStart] = useState(9);
  const [teamEnd, setTeamEnd] = useState(18);

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const result = useMemo(() => {
    if (!tz) return null;
    const theirOffset = tzOffsetMinutes(tz);
    const myOffset = tzOffsetMinutes(workingHours.timeZone);
    const ranges = overlapUtc(
      { start: workingHours.start, end: workingHours.end, offset: myOffset },
      { start: teamStart, end: teamEnd, offset: theirOffset },
    );
    const minutes = ranges.reduce((n, [s, e]) => n + (e - s), 0);
    const toLocal = (start: number, end: number, offset: number) => {
      const s = toLocalMinute(start * 60 - myOffset, offset);
      return { s, e: s + (end - start) * 60 };
    };
    return {
      theirOffset,
      minutes,
      ranges,
      krishna: toLocal(workingHours.start, workingHours.end, theirOffset),
    };
  }, [tz, teamStart, teamEnd]);

  const cityOptions = tz && !CITIES.some((c) => c.tz === tz) ? [{ label: `Your time zone (${tz})`, tz }, ...CITIES] : CITIES;
  const hours = result ? result.minutes / 60 : 0;
  const flexible = workingHours.end - workingHours.start >= 24;

  return (
    <div className="card">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="text-sm">
          <span className="eyebrow muted mb-1.5 block">Your team is in</span>
          <select value={tz ?? ""} onChange={(e) => setTz(e.target.value)} className="input" style={{ background: "var(--bg)" }}>
            {cityOptions.map((c) => <option key={c.tz} value={c.tz}>{c.label}</option>)}
          </select>
        </label>
        <HourSelect label="From" value={teamStart} onChange={setTeamStart} />
        <HourSelect label="To" value={teamEnd} onChange={setTeamEnd} />
      </div>

      {result && (
        <>
          {/* 24-hour bar in the visitor's local time */}
          <div className="mt-6" aria-hidden>
            <div className="relative h-14 overflow-hidden rounded-lg border rule" style={{ background: "var(--bg)" }}>
              <Band start={teamStart * 60} end={(teamEnd <= teamStart ? teamEnd + 24 : teamEnd) * 60} top="8%" color="var(--border)" label="Your team" />
              <Band start={result.krishna.s} end={result.krishna.e} top="54%" color="color-mix(in srgb, var(--accent) 35%, transparent)" label="Krishna" />
              {result.ranges.map(([s, e]) => (
                <Band key={s} start={toLocalMinute(s, result.theirOffset)} end={toLocalMinute(s, result.theirOffset) + (e - s)} top="0" height="100%" color="color-mix(in srgb, var(--ok) 22%, transparent)" />
              ))}
            </div>
            <div className="muted mt-1 flex justify-between font-mono text-[10px]">
              {["00", "06", "12", "18", "24"].map((h) => <span key={h}>{h}:00</span>)}
            </div>
          </div>

          <p className="mt-5 text-lg font-semibold tracking-tight" aria-live="polite">
            {flexible ? (
              <>
                <span style={{ color: "var(--ok)" }}>Full overlap.</span> I work your team&apos;s hours
                <span className="muted font-normal"> · {String(teamStart).padStart(2, "0")}:00–{String(teamEnd).padStart(2, "0")}:00 your time, every working day</span>
              </>
            ) : hours > 0 ? (
              <>
                <span style={{ color: "var(--ok)" }}>{hours % 1 === 0 ? hours : hours.toFixed(2)} hours</span> of shared working time
                <span className="muted font-normal">
                  {" "}· {result.ranges.map(([s, e]) => `${fmtMinutes(s, result.theirOffset)}–${fmtMinutes(e, result.theirOffset)}`).join(", ")} your time
                </span>
              </>
            ) : (
              <>No overlap in standard hours. Async-first collaboration and scheduled calls still work well.</>
            )}
          </p>
          <p className="muted mt-1 text-sm">Working hours: {workingHours.label}. Based in Kathmandu (UTC+5:45, no daylight saving).</p>
        </>
      )}
    </div>
  );
}

function Band({ start, end, top, height = "38%", color, label }: { start: number; end: number; top: string; height?: string; color: string; label?: string }) {
  // Split bands that wrap past midnight.
  const segs: [number, number][] = end <= DAY ? [[start, end]] : [[start, DAY], [0, end - DAY]];
  return (
    <>
      {segs.map(([s, e]) => (
        <span
          key={s}
          className="absolute flex items-center overflow-hidden rounded px-2 font-mono text-[10px] whitespace-nowrap"
          style={{ left: `${(s / DAY) * 100}%`, width: `${((e - s) / DAY) * 100}%`, top, height, background: color }}
        >
          {label}
        </span>
      ))}
    </>
  );
}

function HourSelect({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="text-sm">
      <span className="eyebrow muted mb-1.5 block">{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="input w-auto" style={{ background: "var(--bg)" }}>
        {Array.from({ length: 25 }, (_, h) => (
          <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>
        ))}
      </select>
    </label>
  );
}
