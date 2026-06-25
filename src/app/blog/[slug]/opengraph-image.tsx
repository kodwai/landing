import { ImageResponse } from "next/og";

export const alt = "kodwai Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const API_URL = process.env.API_URL || "http://localhost:8000";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title = "kodwai Blog";
  let category = "";

  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}`);
    if (res.ok) {
      const post = await res.json();
      title = post.title || title;
      category = post.category?.name || "";
    }
  } catch {
    // fallback to default
  }

  const playfair = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDQ.ttf"
    )
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
        {category && (
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              color: "#c23616",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {category}
          </span>
        )}
        <span
          style={{
            fontFamily: "Playfair Display",
            fontWeight: 600,
            fontSize: title.length > 60 ? 40 : 52,
            color: "#1a1a1a",
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
          <span
            style={{
              fontFamily: "Playfair Display",
              fontWeight: 550,
              fontSize: 24,
              color: "#353431",
              letterSpacing: 1,
            }}
          >
            kodwai
          </span>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 14,
              color: "#8a8680",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Blog
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfair,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
