import Link from "next/link";

/* Rendered (with a real 404 status) when a post does not exist, inside the
   blog layout so readers keep the nav and can find their way back. */
export default function BlogNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "120px 0" }}>
      <h1
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 36,
          color: "#1a1a1a",
          marginBottom: 16,
        }}
      >
        Post not found
      </h1>
      <Link
        href="/blog"
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 12,
          color: "#c23616",
          textDecoration: "none",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Back to blog
      </Link>
    </div>
  );
}
