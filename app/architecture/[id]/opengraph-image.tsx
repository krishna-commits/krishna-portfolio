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
          background: "#0e0f0d",
          color: "#ece9e1",
          backgroundImage:
            "linear-gradient(rgba(236,233,225,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(236,233,225,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#e3a46a", letterSpacing: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#e2c27e" }} />
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
                  border: `2px solid ${i === 0 || i === a.stages.length - 1 ? "#e2c27e" : "#2c2d28"}`,
                  background: "#141512",
                }}
              >
                <div style={{ display: "flex", fontSize: 14, color: "#e3a46a" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ display: "flex", fontSize: 22, fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                <div style={{ display: "flex", fontSize: 15, color: "#9a978d", marginTop: 6 }}>{s.items[0]}</div>
              </div>
              {i < a.stages.length - 1 && <div style={{ display: "flex", fontSize: 24, color: "#e2c27e" }}>→</div>}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#9a978d" }}>
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex" }}>krishnaneupane.com/architecture</div>
        </div>
      </div>
    ),
    size,
  );
}
