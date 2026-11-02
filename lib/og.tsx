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
          background: "#0e0f0d",
          color: "#ece9e1",
          backgroundImage:
            "linear-gradient(rgba(236,233,225,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(236,233,225,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#e3a46a", letterSpacing: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#e2c27e" }} />
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 60 : 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9a978d" }}>
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex" }}>{footer}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
