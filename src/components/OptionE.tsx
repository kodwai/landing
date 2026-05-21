"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LogoStrip from "./LogoStrip";

const styles = `
  @media (max-width: 900px) {
    .k-grid-2col {
      grid-template-columns: 1fr !important;
      gap: 32px !important;
      align-items: start !important;
    }
    .k-score-row {
      grid-template-columns: 56px 1fr !important;
      row-gap: 8px !important;
    }
    .k-score-row > .k-score-desc {
      grid-column: 2 / -1 !important;
      max-width: none !important;
    }
    .k-roster-row {
      grid-template-columns: 1fr auto !important;
      row-gap: 16px !important;
      padding: 20px !important;
    }
    .k-roster-row > .k-roster-bars {
      grid-column: 1 / -1 !important;
    }
    .k-roster-row > .k-roster-submitted,
    .k-roster-head > .k-roster-submitted-h,
    .k-roster-head > .k-roster-bars-h {
      display: none !important;
    }
    .k-roster-head {
      grid-template-columns: 1fr auto auto !important;
    }
    .k-begin-paths {
      grid-template-columns: 1fr !important;
      gap: 28px !important;
      text-align: left !important;
    }
    .k-begin-paths > a {
      text-align: left !important;
    }
    .k-begin-paths > span[aria-hidden] {
      width: 100% !important;
      height: 1px !important;
      justify-self: stretch !important;
    }
    .k-challenge-row {
      grid-template-columns: 36px 1fr !important;
      row-gap: 8px !important;
      gap: 16px !important;
      padding: 22px 0 !important;
    }
    .k-challenge-row > .k-challenge-desc,
    .k-challenge-row > .k-challenge-time {
      grid-column: 2 !important;
      justify-self: start !important;
    }
  }
`;

const E = {
  bg: "#faf8f4",
  text: "#1a1a1a",
  accent: "#c23616",
  ink: "#8a2410",
  muted: "#9a948a",
  border: "#e4e0d8",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontMono: "'Space Mono', monospace",
};

const APP_URL = "https://app.kodwai.com";

/* ─── Terminal data ─── */
const lines = [
  { t: "p", s: "$ npx @kodwai/cli challenge rate-limiter" },
  { t: "b", s: "" },
  { t: "s", s: "  kodwai · ai-agent coding platform" },
  { t: "s", s: "✓ Challenge: Distributed Rate Limiter" },
  { t: "s", s: "✓ Workspace ready · 60 min timer started" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Read PROBLEM.md, scaffold, solve, test"' },
  { t: "a", s: "Reading problem. Breaking into 6 steps..." },
  { t: "s", s: "📁 Created: src/counter.ts (67 lines)" },
  { t: "s", s: "📁 Created: src/limiter.ts (43 lines)" },
  { t: "s", s: "📁 Created: src/middleware.ts (38 lines)" },
  { t: "s", s: "📁 Created: tests/limiter.test.ts (5 tests)" },
  { t: "s", s: "  $ pnpm vitest run" },
  { t: "s", s: "  ✓ allows requests under the limit" },
  { t: "s", s: "  ✓ blocks when limit is exceeded" },
  { t: "s", s: "  ✓ returns correct retryAfter value" },
  { t: "s", s: "  ✓ isolates counts per client IP" },
  { t: "s", s: "  ✓ distributes keys across shards evenly" },
  { t: "s", s: "✅ 11/11 tests passing" },
  { t: "b", s: "" },
  { t: "p", s: "$ kodwai submit" },
  { t: "s", s: "✓ Submission received. Scoring..." },
  { t: "b", s: "" },
  { t: "x", s: "═══════════════════════════════════════════════" },
  { t: "x", s: "  AI Collaboration Score: 94 / 100" },
  { t: "x", s: "═══════════════════════════════════════════════" },
  { t: "x", s: "  Problem decomposition   ████████░░  87%" },
  { t: "x", s: "  AI agent direction      █████████░  92%" },
  { t: "x", s: "  Verification & testing  ██████████  98%" },
  { t: "x", s: "  Code quality            █████████░  93%" },
  { t: "x", s: "  Communication clarity   ████████░░  89%" },
  { t: "x", s: "═══════════════════════════════════════════════" },
];

const scoreOnly = lines.slice(-9);

function Terminal() {
  const [playing, setPlaying] = useState(false);
  const [vl, setVl] = useState(0);
  const [ci, setCi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    if (vl >= lines.length) {
      const t = setTimeout(() => { setPlaying(false); setVl(0); setCi(0); }, 2400);
      return () => clearTimeout(t);
    }
    const l = lines[vl];
    if (l.t === "b") {
      const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, 180);
      return () => clearTimeout(t);
    }
    if (ci < l.s.length) {
      const t = setTimeout(() => setCi(c => c + 1), l.t === "p" ? 22 : l.t === "a" ? 14 : 6);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, l.t === "p" ? 320 : l.t === "x" ? 180 : 80);
    return () => clearTimeout(t);
  }, [vl, ci, playing]);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vl, ci, playing]);

  const visible = playing ? lines.slice(0, vl + 1) : scoreOnly;

  return (
    <div style={{
      background: "#111", border: "1px solid #222", borderRadius: 12,
      overflow: "hidden", position: "relative", fontFamily: E.fontMono,
      boxShadow: "0 14px 50px rgba(0,0,0,0.14)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
        background: "#1a1a1a", borderBottom: "1px solid #2a2a2a",
      }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28ca42" }} />
        <span style={{ fontSize: 11, color: "#555", marginLeft: 8 }}>
          kodwai · sarah.chen · rate-limiter
        </span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => { setPlaying(p => !p); if (playing) { setVl(0); setCi(0); } else { setVl(0); setCi(0); } }}
            style={{
              background: playing ? "transparent" : "#ff6b4a",
              color: playing ? "#aaa" : "#fff",
              border: playing ? "1px solid #333" : "1px solid #ff6b4a",
              borderRadius: 4,
              fontFamily: E.fontMono,
              fontSize: 10,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              padding: "6px 12px",
              cursor: "pointer",
              transition: "background 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s",
            }}
          >
            {playing ? "■ Stop" : "▶ Replay run"}
          </button>
        </span>
      </div>
      <div ref={ref} style={{
        padding: 22, fontSize: 13, lineHeight: 1.85,
        height: 360, overflowY: "auto", textAlign: "left",
      }}>
        {visible.map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 12 }} />;
          const cur = playing && i === vl;
          const lineColor = l.t === "p" ? "#ff6b4a" : l.t === "a" ? "#4ade80" : l.t === "x" ? "#fbbf24" : "#888";
          return (
            <div key={i} style={{ color: lineColor, whiteSpace: "pre", textAlign: "left" }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && (
                <span style={{
                  display: "inline-block", width: 7, height: 14,
                  background: "#ff6b4a", marginLeft: 1, verticalAlign: "text-bottom",
                  animation: "blink 1s step-end infinite",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Helpers ─── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".animate-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Ink({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      color: E.accent,
      fontStyle: "italic",
      textShadow: `1px 0 0 ${E.ink}`,
    }}>{children}</span>
  );
}

function Chapter({ num, name, marginBottom = 40 }: { num: string; name: string; marginBottom?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom }}>
      <span style={{
        fontFamily: E.fontMono,
        fontSize: 12,
        color: E.accent,
        letterSpacing: 1.2,
        fontVariant: "all-small-caps",
      }}>Ch. {num}</span>
      <span style={{ width: 56, height: 1, background: E.accent, flexShrink: 0 }} aria-hidden />
      <span style={{
        fontFamily: E.fontMono,
        fontSize: 11,
        color: E.muted,
        fontVariant: "all-small-caps",
        letterSpacing: 0.8,
      }}>{name}</span>
    </div>
  );
}

function LaunchButton({ large, label = "Start a challenge" }: { large?: boolean; label?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={APP_URL}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        background: hover ? E.accent : E.text,
        color: E.bg,
        fontFamily: E.fontMono,
        fontWeight: 700,
        fontSize: large ? 13 : 12,
        padding: large ? "22px 44px" : "14px 26px",
        textDecoration: "none",
        textTransform: "uppercase",
        letterSpacing: 3,
        whiteSpace: "nowrap",
        transition:
          "background 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover
          ? "0 14px 32px rgba(194, 54, 22, 0.22)"
          : "0 4px 14px rgba(26, 26, 26, 0.12)",
      }}
    >
      <span>{label}</span>
      <span
        style={{
          display: "inline-block",
          transform: hover ? "translateX(6px)" : "translateX(0)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >→</span>
    </a>
  );
}

function LiveBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
        <span style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: E.accent,
          animation: "live-pulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        }} />
        <span style={{
          position: "relative",
          width: 8, height: 8, borderRadius: "50%",
          background: E.accent,
        }} />
      </span>
      <span style={{
        fontFamily: E.fontMono, fontSize: 11, color: E.muted,
        fontVariant: "all-small-caps", letterSpacing: 0.6,
      }}>
        Live · Free to start · No card required
      </span>
    </div>
  );
}

/* ─── Data ─── */
const challenges = [
  { tag: "Backend · Infra",     title: "Distributed rate limiter",     time: "60 min", desc: "Redis sorted sets, sliding window counters, Express middleware. 10M req/s." },
  { tag: "Backend · Auth",      title: "OAuth with refresh rotation",  time: "75 min", desc: "Authorization code flow, PKCE, refresh-token rotation, replay detection." },
  { tag: "Backend · Payments",  title: "Idempotent webhook handler",   time: "60 min", desc: "Signature verify, dedupe via idempotency keys, retries with backoff." },
  { tag: "Backend · Caching",   title: "Distributed cache with TTL",   time: "90 min", desc: "Consistent hashing, hot-key mitigation, write-through and read-aside paths." },
  { tag: "Frontend · Realtime", title: "Collaborative cursor sync",    time: "75 min", desc: "CRDT-backed presence, conflict-free merges, sub-50ms perceived latency." },
  { tag: "DevOps · Pipeline",   title: "Image upload pipeline",        time: "90 min", desc: "Multipart upload, virus scan, resize ladder, CDN warm, signed-URL delivery." },
];

const leaderboard = [
  { rank: "01", handle: "jamie.b",   challenge: "Distributed rate limiter",  score: 96, agent: "claude-code" },
  { rank: "02", handle: "sarah.c",   challenge: "OAuth refresh rotation",     score: 94, agent: "claude-code" },
  { rank: "03", handle: "k.tanaka",  challenge: "Payment webhook handler",    score: 93, agent: "cursor" },
  { rank: "04", handle: "alex.m",    challenge: "Distributed cache TTL",      score: 91, agent: "claude-code" },
  { rank: "05", handle: "priya.r",   challenge: "Image upload pipeline",      score: 90, agent: "claude-code" },
];

const scoreDimensions = [
  {
    num: "01",
    name: "Problem decomposition",
    desc: "How cleanly the work was broken down before any code was written. The grader reads your first prompts, the file structure that resulted, the order in which decisions appeared.",
  },
  {
    num: "02",
    name: "Agent direction",
    desc: "How clearly you steered the agent. Vague prompts that wander cost points. Tight prompts that constrain scope earn them. A re-prompt that recovers from a bad output earns more.",
  },
  {
    num: "03",
    name: "Verification",
    desc: "Whether you trusted or tested. Tests written before code. Edge cases the agent missed. The moments you overruled a confident-but-wrong suggestion.",
  },
  {
    num: "04",
    name: "Code quality",
    desc: "Independent of time. Are modules well bounded. Is error handling deliberate. Is anything left as a sharp edge for the next reader.",
  },
  {
    num: "05",
    name: "Communication",
    desc: "Commits with meaning. A submission note another engineer could open six months later and follow. Variable names that explain themselves.",
  },
];

const candidates = [
  { name: "Sarah Chen",   role: "Distributed rate limiter", bars: [92, 88, 96, 91, 89], score: 94, submitted: "2h ago" },
  { name: "K. Tanaka",    role: "Distributed rate limiter", bars: [78, 82, 90, 85, 73], score: 87, submitted: "Yesterday" },
  { name: "Alex Mendez",  role: "Distributed rate limiter", bars: [85, 79, 72, 88, 80], score: 81, submitted: "2 days ago" },
];

/* ─── Candidate Roster Mock (hiring-team evidence) ─── */
function CandidateRoster() {
  return (
    <div className="animate-in" style={{
      border: `1px solid ${E.border}`,
      background: E.bg,
    }}>
      {/* Dashboard header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: `1px solid ${E.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{
            fontFamily: E.fontDisplay,
            fontSize: 22,
            letterSpacing: "-0.4px",
            color: E.text,
          }}>Backend Engineer</span>
          <span style={{
            fontFamily: E.fontMono,
            fontSize: 11,
            color: E.muted,
            fontVariant: "all-small-caps",
            letterSpacing: 0.6,
          }}>Round 2 · Acme</span>
        </div>
        <span style={{
          fontFamily: E.fontMono,
          fontSize: 11,
          color: E.muted,
          fontVariant: "all-small-caps",
          letterSpacing: 0.6,
        }}>3 submissions · 1 reviewed</span>
      </div>

      {/* Table header */}
      <div className="k-roster-head" style={{
        padding: "14px 24px",
        display: "grid",
        gridTemplateColumns: "1.5fr 2.2fr auto auto auto",
        gap: 24,
        borderBottom: `1px solid ${E.border}`,
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: E.fontMono, fontSize: 10, color: E.muted,
          fontVariant: "all-small-caps", letterSpacing: 0.6, textAlign: "left",
        }}>Candidate</span>
        <span className="k-roster-bars-h" style={{
          fontFamily: E.fontMono, fontSize: 10, color: E.muted,
          fontVariant: "all-small-caps", letterSpacing: 0.6, textAlign: "left",
        }}>Score by dimension</span>
        <span style={{
          fontFamily: E.fontMono, fontSize: 10, color: E.muted,
          fontVariant: "all-small-caps", letterSpacing: 0.6, textAlign: "right",
        }}>Final</span>
        <span className="k-roster-submitted-h" style={{
          fontFamily: E.fontMono, fontSize: 10, color: E.muted,
          fontVariant: "all-small-caps", letterSpacing: 0.6, textAlign: "right",
        }}>Submitted</span>
        <span style={{
          fontFamily: E.fontMono, fontSize: 10, color: E.muted,
          fontVariant: "all-small-caps", letterSpacing: 0.6, textAlign: "right",
        }}>·</span>
      </div>

      {/* Candidate rows */}
      {candidates.map((c, i) => (
        <div key={i} className="k-roster-row" style={{
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "1.5fr 2.2fr auto auto auto",
          gap: 24,
          alignItems: "center",
          borderBottom: i < candidates.length - 1 ? `1px solid ${E.border}` : "none",
        }}>
          <div>
            <p style={{
              fontFamily: E.fontDisplay,
              fontSize: 19,
              color: E.text,
              margin: 0,
              marginBottom: 4,
              letterSpacing: "-0.3px",
            }}>{c.name}</p>
            <p style={{
              fontFamily: E.fontMono,
              fontSize: 10,
              color: E.muted,
              fontVariant: "all-small-caps",
              letterSpacing: 0.5,
              margin: 0,
            }}>{c.role}</p>
          </div>

          <div className="k-roster-bars" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {c.bars.map((b, j) => (
              <div key={j}>
                <div style={{
                  height: 3,
                  background: E.border,
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: b >= 90 ? E.text : E.muted,
                    transformOrigin: "left",
                    transform: `scaleX(${b / 100})`,
                  }} />
                </div>
                <span style={{
                  display: "block",
                  marginTop: 6,
                  fontFamily: E.fontMono,
                  fontSize: 9,
                  color: E.muted,
                  letterSpacing: 0.4,
                }}>{b}</span>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: E.fontDisplay,
            fontSize: 28,
            color: E.text,
            letterSpacing: "-0.5px",
            margin: 0,
            lineHeight: 1,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}>{c.score}<span style={{ color: E.muted, fontSize: 13 }}> / 100</span></p>

          <span className="k-roster-submitted" style={{
            fontFamily: E.fontMono,
            fontSize: 10,
            color: E.muted,
            fontVariant: "all-small-caps",
            letterSpacing: 0.5,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}>{c.submitted}</span>

          <a href={APP_URL} style={{
            fontFamily: E.fontMono,
            fontSize: 11,
            color: E.accent,
            fontVariant: "all-small-caps",
            letterSpacing: 0.6,
            textDecoration: "none",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}>Review →</a>
        </div>
      ))}

      {/* Bottom dashboard footer */}
      <div style={{
        padding: "16px 24px",
        borderTop: `1px solid ${E.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        background: `${E.text}03`,
      }}>
        <span style={{
          fontFamily: E.fontMono, fontSize: 10, color: E.muted,
          fontVariant: "all-small-caps", letterSpacing: 0.6,
        }}>Each bar shows score on one of the five dimensions</span>
        <span style={{
          fontFamily: E.fontMono, fontSize: 10, color: E.muted,
          fontVariant: "all-small-caps", letterSpacing: 0.6,
        }}>Open transcript on review</span>
      </div>
    </div>
  );
}

/* ══════════════════════════ OPTION E ══════════════════════════ */

export default function OptionE() {
  useReveal();

  return (
    <div style={{ background: E.bg, color: E.text, fontFamily: E.fontDisplay, position: "relative", zIndex: 2, overflowX: "hidden" }}>
      <style>{styles}</style>

      {/* Subtle mesh bg */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "url(/images/mesh-accent.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.05, mixBlendMode: "multiply", pointerEvents: "none", zIndex: 0,
      }} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px clamp(12px, 4vw, 48px)", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: `${E.bg}f0`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        borderBottom: `1px solid ${E.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 550, fontSize: 24, letterSpacing: "0.75px", color: "#353431" }}>kodwai</span>
          <Link href="/blog" style={{
            fontFamily: E.fontMono, fontSize: 11, color: E.muted,
            fontVariant: "all-small-caps", letterSpacing: 0.6, textDecoration: "none",
          }}>Blog</Link>
        </div>
        <a href={APP_URL} style={{
          background: E.text, color: E.bg, fontFamily: E.fontMono,
          fontSize: 10, padding: "10px 20px", border: `1px solid ${E.text}`,
          textDecoration: "none", textTransform: "uppercase", letterSpacing: 2.5,
          transition: "background 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s, border-color 0.4s",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = E.accent; e.currentTarget.style.borderColor = E.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = E.text; e.currentTarget.style.borderColor = E.text; }}
        >Open app <span aria-hidden>→</span></a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "92vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "120px clamp(16px, 4vw, 48px) 64px",
        position: "relative",
      }}>
        <div style={{ maxWidth: 920, width: "100%", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: 32, animation: "fade-in-up 0.6s ease forwards" }}>
            <LiveBadge />
          </div>

          <h1 style={{
            fontFamily: E.fontDisplay, fontWeight: 400,
            fontSize: "clamp(44px, 8.8vw, 108px)", lineHeight: 1.0,
            letterSpacing: "-2.4px", marginBottom: 28,
            animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
          }}>
            Measure real
            <br />
            <Ink>AI collaboration.</Ink>
          </h1>

          <p style={{
            fontFamily: E.fontDisplay, fontSize: "clamp(18px, 2.2vw, 22px)",
            lineHeight: 1.55, color: E.muted, maxWidth: "52ch", margin: "0 auto 44px",
            animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
          }}>
            Production challenges, on your machine, with your agent. Scored on how you actually work, not what you can recall.
          </p>

          <div style={{
            animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
          }}>
            <LaunchButton large label="Start a challenge" />
            <a
              href={APP_URL}
              style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.muted,
                fontVariant: "all-small-caps", letterSpacing: 0.6,
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
                transition: "color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = E.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = E.muted; }}
            >
              Hiring? Set up interviews <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER I · THE PREMISE (manifesto with drop-cap) ═══ */}
      <section style={{
        padding: "120px clamp(16px, 4vw, 48px) 96px",
        borderTop: `1px solid ${E.border}`,
      }}>
        <div className="animate-in" style={{ maxWidth: 720, margin: "0 auto" }}>
          <Chapter num="I" name="The Premise" />

          <p style={{
            fontFamily: E.fontDisplay,
            fontSize: "clamp(20px, 2.2vw, 25px)",
            lineHeight: 1.55,
            color: E.text,
            margin: 0,
            marginBottom: 28,
          }}>
            <span style={{
              float: "left",
              fontFamily: E.fontDisplay,
              fontSize: "5.4em",
              lineHeight: 0.84,
              color: E.accent,
              margin: "0.08em 0.1em -0.06em 0",
              fontWeight: 400,
              textShadow: `1px 0 0 ${E.ink}`,
            }}>C</span>
            oding interviews still measure the wrong skill. They ask if you can solve a puzzle on a whiteboard, in a sandbox, alone, while a stranger watches. None of that resembles how software actually ships now.
          </p>

          <p style={{
            fontFamily: E.fontDisplay,
            fontSize: "clamp(18px, 1.8vw, 20px)",
            lineHeight: 1.7,
            color: E.muted,
            margin: 0,
            marginBottom: 28,
          }}>
            The skill that matters now is invisible to the puzzle test. How clearly you direct an agent through ambiguous work. How fast you notice when it&apos;s wrong. How thoroughly you verify what it produced. Whether your commits read like an engineer wrote them or a model did.
          </p>

          <p style={{
            fontFamily: E.fontDisplay,
            fontSize: "clamp(18px, 1.8vw, 20px)",
            lineHeight: 1.7,
            color: E.muted,
            margin: 0,
          }}>
            Kodwai measures that. Real problems, your own tools, a transcript another engineer can read. The score isn&apos;t a number you memorize. It&apos;s a number you can argue with.
          </p>
        </div>
      </section>

      {/* ═══ CHAPTER II · THE DEMO (terminal) ═══ */}
      <section style={{
        padding: "0 clamp(16px, 4vw, 48px) 120px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="animate-in" style={{ marginBottom: 36 }}>
            <Chapter num="II" name="The Demo" />
          </div>
          <Terminal />
          <p style={{
            fontFamily: E.fontMono, fontSize: 11, color: E.muted,
            fontVariant: "all-small-caps", letterSpacing: 0.6, marginTop: 24,
            textAlign: "right",
          }}>
            Sarah Chen · 43 minutes · final score 94 / 100
          </p>
        </div>
      </section>

      {/* ═══ ENGINEERS-FROM STRIP ═══ */}
      <section style={{ padding: "56px clamp(16px, 4vw, 48px) 96px", borderTop: `1px solid ${E.border}`, borderBottom: `1px solid ${E.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: E.fontMono, fontSize: 11, color: E.muted,
            fontVariant: "all-small-caps", letterSpacing: 0.6, marginBottom: 32,
          }}>
            Engineers running submissions from
          </p>
          <LogoStrip filter="brightness(0)" opacity={0.28} hoverOpacity={0.6} height={28} gap={52} mobileHeight={18} mobileGap={28} />
        </div>
      </section>

      {/* ═══ CHAPTER III · THE SCORE (5 dimensions) ═══ */}
      <section style={{ padding: "120px clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="animate-in" style={{ marginBottom: 64 }}>
            <Chapter num="III" name="The Score" />
            <h2 style={{
              fontFamily: E.fontDisplay,
              fontWeight: 400,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.02,
              margin: 0,
              maxWidth: "18ch",
            }}>
              What the <Ink>score</Ink> actually measures.
            </h2>
          </div>

          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {scoreDimensions.map((d, i) => (
              <li key={i} className={`animate-in k-score-row`} style={{
                display: "grid",
                gridTemplateColumns: "84px 1.1fr 2fr",
                gap: 40,
                padding: "40px 0",
                borderTop: `1px solid ${E.border}`,
                borderBottom: i === scoreDimensions.length - 1 ? `1px solid ${E.border}` : "none",
                alignItems: "baseline",
              }}>
                <span style={{
                  fontFamily: E.fontMono,
                  fontSize: 13,
                  color: E.accent,
                  letterSpacing: 0.6,
                }}>{d.num}</span>
                <h3 style={{
                  fontFamily: E.fontDisplay,
                  fontSize: "clamp(26px, 3.2vw, 36px)",
                  fontWeight: 400,
                  letterSpacing: "-0.8px",
                  lineHeight: 1.1,
                  margin: 0,
                  color: E.text,
                }}>{d.name}<span style={{ color: E.accent }}>.</span></h3>
                <p className="k-score-desc" style={{
                  fontFamily: E.fontDisplay,
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: E.muted,
                  margin: 0,
                  maxWidth: "48ch",
                }}>{d.desc}</p>
              </li>
            ))}
          </ol>

          <p className="animate-in" style={{
            fontFamily: E.fontMono, fontSize: 11, color: E.muted,
            fontVariant: "all-small-caps", letterSpacing: 0.6, marginTop: 32, textAlign: "right",
          }}>
            Weighted 70 AI · 30 objective. Audited weekly against human review.
          </p>
        </div>
      </section>

      {/* ═══ CHAPTER IV · FOR ENGINEERS (challenges + roster) ═══ */}
      <section style={{
        padding: "120px clamp(16px, 4vw, 48px)",
        borderTop: `1px solid ${E.border}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="animate-in" style={{ marginBottom: 80 }}>
            <Chapter num="IV" name="For Engineers" />
            <div className="k-grid-2col" style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 64,
              alignItems: "end",
            }}>
              <h2 style={{
                fontFamily: E.fontDisplay,
                fontWeight: 400,
                fontSize: "clamp(36px, 5.5vw, 64px)",
                letterSpacing: "-1.8px",
                lineHeight: 1.02,
                margin: 0,
              }}>
                Build something <Ink>you&apos;d actually ship.</Ink>
              </h2>
              <p style={{
                fontFamily: E.fontDisplay,
                fontSize: 18,
                lineHeight: 1.65,
                color: E.muted,
                margin: 0,
                maxWidth: "42ch",
              }}>
                Fifty-plus production problems. Backend, infra, payments, realtime. Pick one, work it on your own machine, submit. New problems each week.
              </p>
            </div>
          </div>

          {/* Sub-article: The challenges */}
          <div style={{ marginBottom: 120 }}>
            <div className="animate-in" style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28,
              borderBottom: `2px solid ${E.text}`, paddingBottom: 12,
            }}>
              <span style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.text,
                fontVariant: "all-small-caps", letterSpacing: 0.8,
              }}>Selected · Week 19</span>
              <span style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.muted,
                fontVariant: "all-small-caps", letterSpacing: 0.6,
              }}>50+ live · added weekly</span>
            </div>

            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {challenges.map((c, i) => (
                <li key={i} className={`animate-in k-challenge-row`} style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1fr 1fr auto",
                  gap: 32,
                  padding: "26px 0",
                  borderBottom: `1px solid ${E.border}`,
                  alignItems: "baseline",
                }}>
                  <span style={{
                    fontFamily: E.fontMono, fontSize: 12, color: E.accent,
                    letterSpacing: 0.5,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 style={{
                      fontFamily: E.fontDisplay, fontWeight: 400, fontSize: "clamp(22px, 2.4vw, 26px)",
                      letterSpacing: "-0.4px", lineHeight: 1.15, margin: 0, marginBottom: 4,
                    }}>{c.title}</h3>
                    <p style={{
                      fontFamily: E.fontMono, fontSize: 10, color: E.muted,
                      fontVariant: "all-small-caps", letterSpacing: 0.5, margin: 0,
                    }}>{c.tag}</p>
                  </div>
                  <p className="k-challenge-desc" style={{
                    fontFamily: E.fontDisplay, fontSize: 16, color: E.muted,
                    lineHeight: 1.55, margin: 0, maxWidth: "44ch",
                  }}>{c.desc}</p>
                  <span className="k-challenge-time" style={{
                    fontFamily: E.fontMono, fontSize: 11, color: E.muted,
                    letterSpacing: 0.4, whiteSpace: "nowrap", justifySelf: "end",
                  }}>{c.time}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sub-article: Top runs */}
          <div>
            <div className="animate-in" style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28,
              borderBottom: `2px solid ${E.text}`, paddingBottom: 12,
            }}>
              <span style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.text,
                fontVariant: "all-small-caps", letterSpacing: 0.8,
              }}>Top runs · This week</span>
              <a href={APP_URL} style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.accent,
                fontVariant: "all-small-caps", letterSpacing: 0.6, textDecoration: "none",
              }}>Full leaderboard →</a>
            </div>

            <div className="animate-in hide-scrollbar" style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%", minWidth: 600, borderCollapse: "collapse",
                fontFamily: E.fontMono,
              }}>
                <tbody>
                  {leaderboard.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: "20px 8px 20px 0", borderBottom: `1px solid ${E.border}`, color: E.accent, fontSize: 13, letterSpacing: 0.5, width: 36 }}>{r.rank}</td>
                      <td style={{ padding: "20px 16px", borderBottom: `1px solid ${E.border}`, color: E.text, fontSize: 14, fontWeight: 600 }}>{r.handle}</td>
                      <td style={{
                        padding: "20px 16px", borderBottom: `1px solid ${E.border}`,
                        color: E.muted, fontSize: 15, fontFamily: E.fontDisplay,
                      }}>{r.challenge}</td>
                      <td style={{
                        padding: "20px 16px", borderBottom: `1px solid ${E.border}`,
                        color: E.muted, fontSize: 10, textAlign: "right",
                        fontVariant: "all-small-caps", letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                      }}>{r.agent}</td>
                      <td style={{
                        padding: "20px 0 20px 16px", borderBottom: `1px solid ${E.border}`,
                        fontSize: 22, fontFamily: E.fontDisplay, color: E.text,
                        fontWeight: 400, textAlign: "right", letterSpacing: "-0.5px",
                        whiteSpace: "nowrap",
                      }}>
                        {r.score}<span style={{ color: E.muted, fontSize: 13 }}> / 100</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER V · FOR HIRING TEAMS (UI evidence) ═══ */}
      <section style={{
        padding: "120px clamp(16px, 4vw, 48px)",
        borderTop: `1px solid ${E.border}`,
        background: `${E.text}05`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="animate-in" style={{ marginBottom: 64 }}>
            <Chapter num="V" name="For Hiring Teams" />
            <div className="k-grid-2col" style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 64,
              alignItems: "end",
            }}>
              <h2 style={{
                fontFamily: E.fontDisplay,
                fontWeight: 400,
                fontSize: "clamp(36px, 5.5vw, 64px)",
                letterSpacing: "-1.8px",
                lineHeight: 1.02,
                margin: 0,
              }}>
                Watch the <Ink>work,</Ink>
                <br />not the answer.
              </h2>
              <p style={{
                fontFamily: E.fontDisplay,
                fontSize: 18,
                lineHeight: 1.65,
                color: E.muted,
                margin: 0,
                maxWidth: "42ch",
              }}>
                Most interview tools grade the output and hide the process. Kodwai shows the process. Every prompt, every commit, every moment your candidate overruled the agent. Or didn&apos;t.
              </p>
            </div>
          </div>

          <CandidateRoster />

          <div className="animate-in" style={{
            marginTop: 56,
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            flexWrap: "wrap", gap: 24,
          }}>
            <p style={{
              fontFamily: E.fontDisplay,
              fontSize: 17,
              color: E.muted,
              lineHeight: 1.55,
              margin: 0,
              maxWidth: "44ch",
            }}>
              Custom rubrics, time limits, your own challenges. Team review on a shared dashboard. Free tier for first hires.
            </p>
            <a
              href={APP_URL}
              style={{
                fontFamily: E.fontMono, fontSize: 12, color: E.text,
                fontVariant: "all-small-caps", letterSpacing: 0.8,
                textDecoration: "none",
                borderBottom: `1px solid ${E.text}`,
                paddingBottom: 4,
                transition: "color 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = E.accent; e.currentTarget.style.borderColor = E.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = E.text; e.currentTarget.style.borderColor = E.text; }}
            >
              Set up an interview →
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER VI · BEGIN (CTA) ═══ */}
      <section style={{
        padding: "144px clamp(16px, 4vw, 48px)",
        borderTop: `1px solid ${E.border}`,
      }}>
        <div className="animate-in" style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", marginBottom: 36, justifyContent: "center" }}>
            <Chapter num="VI" name="Begin" marginBottom={0} />
          </div>

          <h2 style={{
            fontFamily: E.fontDisplay, fontWeight: 400,
            fontSize: "clamp(48px, 8vw, 96px)",
            letterSpacing: "-2.4px", lineHeight: 1.0,
            margin: 0, marginBottom: 28,
          }}>
            Open the app.
            <br />
            Ship something <Ink>real.</Ink>
          </h2>

          <p style={{
            fontFamily: E.fontDisplay, fontSize: "clamp(17px, 1.9vw, 21px)",
            lineHeight: 1.6, color: E.muted, maxWidth: "44ch", margin: "0 auto 56px",
          }}>
            Free to start. Sixty-second signup. You&apos;ll pick your path on the way in.
          </p>

          <div className="k-begin-paths" style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 40,
            alignItems: "center",
            maxWidth: 720,
            margin: "0 auto",
          }}>
            <a
              href={APP_URL}
              style={{
                fontFamily: E.fontDisplay,
                fontSize: "clamp(24px, 3vw, 32px)",
                color: E.text,
                textDecoration: "none",
                letterSpacing: "-0.4px",
                lineHeight: 1.2,
                textAlign: "right",
                display: "inline-flex",
                flexDirection: "column",
                gap: 4,
                transition: "color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = E.accent;
                const span = e.currentTarget.querySelector("[data-arrow]") as HTMLSpanElement | null;
                if (span) span.style.transform = "translateX(6px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = E.text;
                const span = e.currentTarget.querySelector("[data-arrow]") as HTMLSpanElement | null;
                if (span) span.style.transform = "translateX(0)";
              }}
            >
              <span style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.muted,
                fontVariant: "all-small-caps", letterSpacing: 0.6,
              }}>For developers</span>
              <span>
                Start a challenge
                {" "}
                <span data-arrow style={{
                  display: "inline-block",
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}>→</span>
              </span>
            </a>

            <span aria-hidden style={{
              width: 1, height: 56, background: E.border, justifySelf: "center",
            }} />

            <a
              href={APP_URL}
              style={{
                fontFamily: E.fontDisplay,
                fontSize: "clamp(24px, 3vw, 32px)",
                color: E.text,
                textDecoration: "none",
                letterSpacing: "-0.4px",
                lineHeight: 1.2,
                textAlign: "left",
                display: "inline-flex",
                flexDirection: "column",
                gap: 4,
                transition: "color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = E.accent;
                const span = e.currentTarget.querySelector("[data-arrow]") as HTMLSpanElement | null;
                if (span) span.style.transform = "translateX(6px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = E.text;
                const span = e.currentTarget.querySelector("[data-arrow]") as HTMLSpanElement | null;
                if (span) span.style.transform = "translateX(0)";
              }}
            >
              <span style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.muted,
                fontVariant: "all-small-caps", letterSpacing: 0.6,
              }}>For hiring teams</span>
              <span>
                Set up an interview
                {" "}
                <span data-arrow style={{
                  display: "inline-block",
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}>→</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "40px clamp(16px, 4vw, 48px)", borderTop: `1px solid ${E.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 550, fontSize: 20, letterSpacing: "0.75px", color: "#353431" }}>kodwai</span>
            <span style={{
              fontFamily: E.fontMono, fontSize: 11, color: E.muted,
              fontVariant: "all-small-caps", letterSpacing: 0.6,
            }}>Measure real AI collaboration.</span>
          </div>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            {[
              { href: "https://x.com/kodwai_com", label: "X" },
              { href: "https://discord.gg/d663XRC7", label: "Discord" },
              { href: "mailto:hello@kodwai.com", label: "Email" },
            ].map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{
                fontFamily: E.fontMono, fontSize: 12, color: E.muted,
                fontVariant: "all-small-caps", letterSpacing: 0.5, textDecoration: "none",
              }}>{l.label}</a>
            ))}
            <span style={{ fontFamily: E.fontMono, fontSize: 10, color: E.muted, opacity: 0.4 }}>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
