import { ImageResponse } from "next/og";
import { site } from "@/lib/data";

export const ogSize = { width: 1200, height: 630 };

/** Shared social card: dark grid, saffron signal, eyebrow + title + footer line. */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#070b14",
          color: "#e6ebf5",
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#7dd3fc", letterSpacing: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#22d3ee" }} />
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 60 : 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8a96ac" }}>
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex" }}>{footer}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
