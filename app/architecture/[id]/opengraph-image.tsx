import { ImageResponse } from "next/og";
import { architectures } from "@/lib/architectures";
import { site } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Reference architecture by Krishna Neupane";

export function generateStaticParams() {
  return architectures.map((a) => ({ id: a.id }));
}

// Share card that draws the architecture itself: the stages as connected boxes.
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = architectures.find((x) => x.id === id) ?? architectures[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#070b14",
          color: "#e6ebf5",
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#7dd3fc", letterSpacing: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#22d3ee" }} />
            REFERENCE ARCHITECTURE
          </div>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 700, letterSpacing: -2, marginTop: 18 }}>{a.title}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {a.stages.map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 182,
                  padding: "16px 16px",
                  borderRadius: 14,
                  border: `2px solid ${i === 0 || i === a.stages.length - 1 ? "#22d3ee" : "#1f2a44"}`,
                  background: "#0c1220",
                }}
              >
                <div style={{ display: "flex", fontSize: 14, color: "#7dd3fc" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ display: "flex", fontSize: 22, fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                <div style={{ display: "flex", fontSize: 15, color: "#8a96ac", marginTop: 6 }}>{s.items[0]}</div>
              </div>
              {i < a.stages.length - 1 && <div style={{ display: "flex", fontSize: 24, color: "#22d3ee" }}>→</div>}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8a96ac" }}>
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex" }}>krishnaneupane.com/architecture</div>
        </div>
      </div>
    ),
    size,
  );
}
