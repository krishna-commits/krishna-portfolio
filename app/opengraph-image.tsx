import { ImageResponse } from "next/og";
import { profile, site } from "@/lib/data";

export const alt = `${site.name} — ${profile.roles.join(" & ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#8a96ac", letterSpacing: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#22d3ee" }} />
          KRISHNANEUPANE.COM
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 600, letterSpacing: -3 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 16 }}>{profile.roles.join(" & ")}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8a96ac" }}>
          {`DevSecOps · Cloud Security · Kubernetes · Threat Detection · ${site.location.city}, ${site.location.country}`}
        </div>
      </div>
    ),
    size,
  );
}
