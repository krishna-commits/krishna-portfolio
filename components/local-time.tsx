"use client";

import { useEffect, useState } from "react";

const TZ = "Asia/Kathmandu";

/** Krishna's local time (UTC+5:45), so remote teams can see the clock at a glance. */
export function LocalTime({ className = "", seconds = false, bare = false }: { className?: string; seconds?: boolean; bare?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), seconds ? 1000 : 30_000);
    return () => clearInterval(id);
  }, [seconds]);

  const time = now?.toLocaleTimeString("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
    hour12: false,
  });

  return (
    <span className={`num ${className}`}>
      {/* Reserve width before hydration so nothing shifts. */}
      <time dateTime={now?.toISOString()} className={`inline-block ${seconds ? "min-w-[8ch]" : "min-w-[5ch]"}`}>
        {time ?? "UTC+5:45"}
      </time>
      {!bare && " in Kathmandu · UTC+5:45"}
    </span>
  );
}
