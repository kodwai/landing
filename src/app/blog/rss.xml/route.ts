const API_URL = process.env.API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/blog/rss`, { next: { revalidate: 300 } });
    if (!res.ok) {
      return new Response("<!-- RSS feed unavailable -->", {
        status: 502,
        headers: { "Content-Type": "application/rss+xml" },
      });
    }
    const xml = await res.text();
    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch {
    return new Response("<!-- RSS feed unavailable -->", {
      status: 502,
      headers: { "Content-Type": "application/rss+xml" },
    });
  }
}
