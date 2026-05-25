import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | kodwai",
  description: "Insights on AI-agent coding, developer tools, and the future of technical interviews.",
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", position: "relative" }}>
      {/* Faint code-grid field, matching the landing page */}
      <div className="k-field" aria-hidden />

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "16px clamp(12px, 4vw, 48px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(20px)",
          background: "#faf8f4ee",
          borderBottom: "1px solid #e4e0d8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 550,
              fontSize: 22,
              color: "#353431",
              letterSpacing: "0.75px",
              textDecoration: "none",
            }}
          >
            kodwai
          </Link>
          <Link
            href="/blog"
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              color: "#c23616",
              letterSpacing: 1,
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            blog
          </Link>
        </div>
        <a
          href="https://app.kodwai.com"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#1a1a1a",
            background: "transparent",
            letterSpacing: 1.4,
            textTransform: "uppercase",
            textDecoration: "none",
            padding: "9px 18px",
            border: "1px solid #d6cfc1",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "color 0.3s, border-color 0.3s",
          }}
        >
          open app <span aria-hidden>→</span>
        </a>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px clamp(16px, 4vw, 48px) 80px", position: "relative", zIndex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ padding: "44px clamp(16px, 4vw, 48px)", borderTop: "1px solid #e4e0d8" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 550,
                fontSize: 20,
                letterSpacing: "0.75px",
                color: "#353431",
              }}
            >
              kodwai
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                color: "#9a948a",
                letterSpacing: 1,
              }}
            >
              For developers who build with AI.
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="https://x.com/kodwai_com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: "#9a948a", textDecoration: "none" }}>X</a>
            <a href="https://discord.gg/d663XRC7" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: "#9a948a", textDecoration: "none" }}>Discord</a>
            <a href="mailto:hello@kodwai.com" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: "#9a948a", textDecoration: "none" }}>Email</a>
            <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#9a948a", opacity: 0.4 }}>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
