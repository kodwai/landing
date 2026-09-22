import { ImageResponse } from "next/og";
import { getPublicChallenge } from "@/lib/challenges";

/* Per-challenge social card, same pattern as the blog post card. */
export const alt = "kodwai challenge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = "kodwai challenges";
  let meta = "";
  try {
    const c = await getPublicChallenge(slug);
    if (c) {
      title = c.title;
      meta = `${c.difficulty} · ${c.category} · ${c.time_limit_minutes} min`;
    }
  } catch {
    // fallback to the generic card
  }

  const playfair = await fetch(
    new URL("https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDQ.ttf")
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "#F5F0EB",
          gap: 24,
        }}
      >
        {meta && (
          <span style={{ fontFamily: "sans-serif", fontSize: 18, color: "#c23616", letterSpacing: 4, textTransform: "uppercase" }}>
            {meta}
          </span>
        )}
        <span
          style={{
            fontFamily: "Playfair Display",
            fontWeight: 600,
            fontSize: title.length > 48 ? 46 : 58,
            color: "#1a1a1a",
            lineHeight: 1.12,
            letterSpacing: -1,
          }}
        >
          {title}
        </span>
        <span style={{ fontFamily: "sans-serif", fontSize: 22, color: "#6f695f" }}>
          Solve it with your own AI agent. Scored on Direction, Outcome, Lift.
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
          <span style={{ fontFamily: "Playfair Display", fontWeight: 550, fontSize: 24, color: "#353431", letterSpacing: 1 }}>
            kodwai
          </span>
          <span style={{ fontFamily: "sans-serif", fontSize: 14, color: "#8a8680", letterSpacing: 3, textTransform: "uppercase" }}>
            Challenges
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Playfair Display", data: playfair, style: "normal", weight: 600 }],
    }
  );
}
