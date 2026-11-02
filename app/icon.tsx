import { ImageResponse } from "next/og";

// Favicon: the KN monogram, ink tile with Saturn-gold initials. Readable at 16px, unlike a photo.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0f0d",
          borderRadius: 14,
          color: "#e2c27e",
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -1,
          fontFamily: "Georgia, serif",
        }}
      >
        KN
      </div>
    ),
    size,
  );
}
