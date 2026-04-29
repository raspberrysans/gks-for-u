import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "gks for u — apply to the Global Korea Scholarship with confidence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
          background: "#0a0a0a",
          color: "#f4f4f4",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#c6ff3d",
              color: "#0a0a0a",
              fontWeight: 800,
              fontSize: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            g
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em" }}>
            gks for u
          </div>
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.0,
            maxWidth: 1000,
            textTransform: "lowercase",
          }}
        >
          apply to the global korea scholarship with confidence.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8a8a8a",
            fontSize: 22,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          <div>guides · eligibility · application</div>
          <div style={{ color: "#c6ff3d" }}>gksforu.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
