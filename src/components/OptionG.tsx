"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import LogoStrip from "./LogoStrip";

/* ══════════════════════════════════════════════════════════════
   OPTION G — "Swiss Poster"
   International Typographic Style. Typography IS the design.
   Bold red (#e60012) + black (#000) on white (#fff).
   Strong grid. Massive type. Helvetica-inspired precision.
   Archivo Black + Overpass Mono. Pure flat typography.
   ══════════════════════════════════════════════════════════════ */

const G = {
  bg: "#ffffff",
  text: "#000000",
  accent: "#e60012",
  muted: "#777777",
  border: "#e5e5e5",
  fontDisplay: "'Archivo Black', sans-serif",
  fontMono: "'Overpass Mono', monospace",
};

/* ─── Terminal ─── */
const lines = [
  { t: "p", s: "$ kodwai start --challenge system-design" },
  { t: "s", s: "⚡ Session live — agent connected" },
  { t: "s", s: "📋 Rate limiter — 10M req/s" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "architect a solution"' },
  { t: "a", s: "Sliding-window rate limiter with Redis." },
  { t: "a", s: "Let me scaffold the service now..." },
  { t: "b", s: "" },
  { t: "s", s: "📁 sliding-window.ts created" },
  { t: "s", s: "📁 redis-cluster.ts created" },
  { t: "s", s: "✅ 12/12 tests green" },
  { t: "b", s: "" },
  { t: "x", s: "🎯 Score: 94 / 100" },
  { t: "x", s: "   Decomposition  ████████░░  87" },
  { t: "x", s: "   Agent mastery  █████████░  92" },
  { t: "x", s: "   Verification   ██████████  98" },
];

function Terminal() {
  const [vl, setVl] = useState(0);
  const [ci, setCi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vl >= lines.length) { const t = setTimeout(() => { setVl(0); setCi(0); }, 4000); return () => clearTimeout(t); }
    const l = lines[vl];
    if (l.t === "b") { const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, 200); return () => clearTimeout(t); }
    if (ci < l.s.length) { const t = setTimeout(() => setCi(c => c + 1), l.t === "p" ? 26 : l.t === "a" ? 14 : 8); return () => clearTimeout(t); }
    const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, l.t === "p" ? 500 : l.t === "x" ? 280 : 130);
    return () => clearTimeout(t);
  }, [vl, ci]);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vl, ci]);

  const col = (t: string) => t === "p" ? G.accent : t === "a" ? "#22c55e" : t === "x" ? "#ffffff" : "#888888";

  return (
    <div style={{
      background: "#000000", overflow: "hidden", position: "relative",
      fontFamily: G.fontMono, border: `3px solid ${G.text}`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
        background: "#111111", borderBottom: "1px solid #333333",
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca42" }} />
        <span style={{ fontSize: 10, color: "#666666", marginLeft: 8, letterSpacing: 2, textTransform: "uppercase", fontFamily: G.fontMono }}>kodwai / session</span>
      </div>
      <div ref={ref} style={{ padding: 20, fontSize: 13, lineHeight: 1.9, height: 300, overflowY: "auto" }}>
        {lines.slice(0, vl + 1).map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 8 }} />;
          const cur = i === vl;
          return (
            <div key={i} style={{ color: col(l.t), whiteSpace: "pre" }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && <span style={{ display: "inline-block", width: 7, height: 14, background: G.accent, marginLeft: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />}
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
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: 0.08 });
    document.querySelectorAll(".animate-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function WaitlistForm({ id, large }: { id: string; large?: boolean }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  if (ok) return <div style={{ fontFamily: G.fontMono, fontSize: 14, color: G.text, padding: "16px 0", fontWeight: 700 }}>&#10003; You&apos;re on the list. Check your inbox.</div>;
  return (
    <form onSubmit={e => { e.preventDefault(); if (email) setOk(true); }} style={{ display: "flex", gap: 0, width: "100%", maxWidth: large ? 560 : 480 }}>
      <input id={id} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
        style={{
          flex: 1, background: G.bg, border: `3px solid ${G.text}`, borderRight: "none",
          color: G.text, fontFamily: G.fontMono, fontSize: 14, fontWeight: 700,
          padding: large ? "18px 20px" : "15px 18px", outline: "none", borderRadius: 0,
        }}
      />
      <button type="submit" style={{
        background: G.text, color: G.bg, fontFamily: G.fontDisplay,
        fontSize: 13, padding: large ? "18px 32px" : "15px 26px",
        border: `3px solid ${G.text}`, borderRadius: 0, cursor: "pointer",
        textTransform: "uppercase", letterSpacing: 3, whiteSpace: "nowrap",
        transition: "background 0.2s, color 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = G.accent; e.currentTarget.style.borderColor = G.accent; }}
        onMouseLeave={e => { e.currentTarget.style.background = G.text; e.currentTarget.style.borderColor = G.text; }}
      >JOIN</button>
    </form>
  );
}

function RedRule() {
  return <div style={{ width: "100%", height: 4, background: G.accent }} />;
}

function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 28px", ...style }}>
      {children}
    </section>
  );
}

/* ══════════════════════════ OPTION G ══════════════════════════ */

export default function OptionG() {
  useReveal();

  const valueProps = [
    { num: "01", title: "REAL AGENTS, NOT CHATBOTS", desc: "Candidates use Claude Code — a full autonomous agent with file system, terminal, and browser access. Not a prompt box." },
    { num: "02", title: "SIGNAL, NOT NOISE", desc: "Every keystroke, architectural decision, and agent interaction is captured and scored. You see exactly how engineers think." },
    { num: "03", title: "BUILT FOR THE AI ERA", desc: "The old whiteboard is dead. kodwai tests the skill that actually matters: wielding AI agents to ship production code." },
  ];

  const howItWorks = [
    { step: "01", title: "DEPLOY A CHALLENGE", desc: "Pick from our library or create custom system-design and coding challenges calibrated to your stack." },
    { step: "02", title: "CANDIDATE SOLVES WITH AI", desc: "They get a full Claude Code environment. Real agent, real tools, real constraints. 60 minutes." },
    { step: "03", title: "REVIEW THE SIGNAL", desc: "AI-generated scorecard with granular breakdowns: decomposition, agent mastery, code quality, verification." },
  ];

  const stats = [
    { value: "94%", label: "Hiring signal accuracy" },
    { value: "3.2×", label: "Faster than traditional loops" },
    { value: "847+", label: "Engineers on waitlist" },
    { value: "12min", label: "Average time to first score" },
  ];

  return (
    <div style={{ background: G.bg, color: G.text, fontFamily: G.fontDisplay, position: "relative" }}>

      {/* ═══ GLOBAL STYLES ═══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Overpass+Mono:wght@400;600;700&display=swap');
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        .animate-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .animate-in.visible { opacity: 1; transform: translateY(0); }
        .animate-in-delay-1 { transition-delay: 0.1s; }
        .animate-in-delay-2 { transition-delay: 0.2s; }
        .animate-in-delay-3 { transition-delay: 0.3s; }
        .animate-in-delay-4 { transition-delay: 0.4s; }
        .animate-in-delay-5 { transition-delay: 0.5s; }
        ::selection { background: ${G.accent}; color: #fff; }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        height: 60, background: G.bg, borderBottom: `3px solid ${G.text}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: G.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: G.fontDisplay, fontWeight: 900, fontSize: 16, color: "#fff",
          }}>K</div>
          <span style={{ fontFamily: G.fontDisplay, fontSize: 22, letterSpacing: "-0.5px", textTransform: "uppercase" }}>kodwai</span>
        </div>
        <a href="#waitlist-g" style={{
          background: G.text, color: G.bg, fontFamily: G.fontDisplay,
          fontSize: 11, padding: "10px 24px", border: "none", borderRadius: 0,
          textDecoration: "none", textTransform: "uppercase", letterSpacing: 3,
          transition: "background 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = G.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = G.text; }}
        >WAITLIST</a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "140px 28px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Tiny mesh accent — circular clipped decorative element */}
        <div style={{
          position: "absolute", top: 120, right: "8%",
          width: 100, height: 100, borderRadius: "50%", overflow: "hidden",
          opacity: 0.15, filter: "grayscale(100%)", pointerEvents: "none",
        }}>
          <Image src="/images/mesh-accent.jpg" alt="" fill style={{ objectFit: "cover" }} />
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div style={{ fontFamily: G.fontMono, fontSize: 12, color: G.muted, letterSpacing: 4, textTransform: "uppercase", marginBottom: 32 }}>
            THE INTERVIEW PLATFORM FOR THE AI ERA
          </div>

          <h1 style={{
            fontFamily: G.fontDisplay,
            fontSize: "clamp(56px, 10vw, 140px)",
            lineHeight: 0.95,
            letterSpacing: "-2px",
            textTransform: "uppercase",
            marginBottom: 40,
            maxWidth: 900,
          }}>
            YOUR INTERVIEW<br />
            STACK IS<br />
            <span style={{ color: G.accent }}>OBSOLETE.</span>
          </h1>

          <p style={{
            fontFamily: G.fontMono, fontSize: "clamp(14px, 1.5vw, 18px)",
            lineHeight: 1.8, color: G.muted, maxWidth: 520, marginBottom: 48,
          }}>
            Engineers use AI agents every day. Your platform still gives them a chatbot.
            kodwai gives them <span style={{ color: G.text, fontWeight: 700 }}>Claude Code</span> — a real agent, real tools, real signal.
          </p>

          <div id="waitlist-g">
            <WaitlistForm id="hero-g" large />
          </div>
          <p style={{ fontFamily: G.fontMono, fontSize: 11, color: G.muted, marginTop: 14, letterSpacing: 1 }}>
            Free access — No card required
          </p>
        </div>
      </section>

      <RedRule />

      {/* ═══ LOGO STRIP ═══ */}
      <section style={{ padding: "40px 28px", borderBottom: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: G.fontMono, fontSize: 10, color: G.muted, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
            BUILT FOR TEAMS AT
          </div>
          <LogoStrip filter="brightness(0)" opacity={0.3} hoverOpacity={0.6} height={20} gap={44} />
        </div>
      </section>

      <RedRule />

      {/* ═══ PROBLEM ═══ */}
      <Section>
        <div className="animate-in">
          <div style={{ fontFamily: G.fontMono, fontSize: 11, color: G.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
            THE PROBLEM
          </div>
          <h2 style={{
            fontFamily: G.fontDisplay, fontSize: "clamp(32px, 5vw, 64px)",
            lineHeight: 1.0, textTransform: "uppercase", letterSpacing: "-1px",
            marginBottom: 32, maxWidth: 800,
          }}>
            YOU&apos;RE TESTING<br />
            SKILLS THAT<br />
            <span style={{ color: G.accent }}>DON&apos;T MATTER</span><br />
            ANYMORE.
          </h2>
          <p style={{
            fontFamily: G.fontMono, fontSize: 15, lineHeight: 1.9, color: G.muted, maxWidth: 600,
          }}>
            Whiteboard algorithms. Toy problems. No AI allowed. These interviews measure memorization, not engineering.
            The best engineers ship with agents. Your interview should test that.
          </p>
        </div>
      </Section>

      <RedRule />

      {/* ═══ VALUE PROPS ═══ */}
      <Section>
        <div style={{ fontFamily: G.fontMono, fontSize: 11, color: G.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 48 }}>
          WHY KODWAI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {valueProps.map((v, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1} flex-col sm:flex-row`} style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              <div style={{
                fontFamily: G.fontDisplay, fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1, color: G.accent, flexShrink: 0, minWidth: 120,
              }}>
                {v.num}
              </div>
              <div>
                <h3 style={{
                  fontFamily: G.fontDisplay, fontSize: "clamp(20px, 2.5vw, 28px)",
                  textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12, lineHeight: 1.2,
                }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: G.fontMono, fontSize: 14, lineHeight: 1.8, color: G.muted, maxWidth: 480 }}>
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <RedRule />

      {/* ═══ HOW IT WORKS ═══ */}
      <Section>
        <div style={{ fontFamily: G.fontMono, fontSize: 11, color: G.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
          HOW IT WORKS
        </div>
        <h2 style={{
          fontFamily: G.fontDisplay, fontSize: "clamp(28px, 4vw, 48px)",
          textTransform: "uppercase", letterSpacing: "-1px", marginBottom: 56, lineHeight: 1.0,
        }}>
          THREE STEPS.<br />
          <span style={{ color: G.accent }}>TOTAL CLARITY.</span>
        </h2>

        {/* Terminal */}
        <div className="animate-in" style={{ marginBottom: 64, maxWidth: 640 }}>
          <Terminal />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {howItWorks.map((h, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1} flex-col sm:flex-row`} style={{
              display: "flex", gap: 28, alignItems: "flex-start",
              paddingBottom: i < howItWorks.length - 1 ? 48 : 0,
              borderBottom: i < howItWorks.length - 1 ? `1px solid ${G.border}` : "none",
            }}>
              <div style={{
                fontFamily: G.fontDisplay, fontSize: 56, lineHeight: 1, color: G.accent,
                flexShrink: 0, minWidth: 80,
              }}>
                {h.step}
              </div>
              <div>
                <h3 style={{
                  fontFamily: G.fontDisplay, fontSize: 20,
                  textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10, lineHeight: 1.2,
                }}>
                  {h.title}
                </h3>
                <p style={{ fontFamily: G.fontMono, fontSize: 14, lineHeight: 1.8, color: G.muted, maxWidth: 460 }}>
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <RedRule />

      {/* ═══ COMPARISON TABLE ═══ */}
      <Section>
        <div style={{ fontFamily: G.fontMono, fontSize: 11, color: G.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
          COMPARISON
        </div>
        <h2 style={{
          fontFamily: G.fontDisplay, fontSize: "clamp(28px, 4vw, 48px)",
          textTransform: "uppercase", letterSpacing: "-1px", marginBottom: 48, lineHeight: 1.0,
        }}>
          THE <span style={{ color: G.accent }}>DATA SHEET.</span>
        </h2>

        {/* Tiny crystal-data accent */}
        <div style={{
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -40, right: 0,
            width: 100, height: 100, borderRadius: "50%", overflow: "hidden",
            opacity: 0.15, filter: "grayscale(100%)", pointerEvents: "none",
          }}>
            <Image src="/images/crystal-data.jpg" alt="" fill style={{ objectFit: "cover" }} />
          </div>

          <div className="animate-in" style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse",
              fontFamily: G.fontMono, fontSize: 14,
            }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "16px 20px", borderBottom: `3px solid ${G.text}`, borderTop: `3px solid ${G.text}`, fontFamily: G.fontDisplay, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: G.muted }}>Feature</th>
                  <th style={{ textAlign: "center", padding: "16px 20px", borderBottom: `3px solid ${G.text}`, borderTop: `3px solid ${G.text}`, fontFamily: G.fontDisplay, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: G.muted }}>Traditional</th>
                  <th style={{ textAlign: "center", padding: "16px 20px", borderBottom: `3px solid ${G.text}`, borderTop: `3px solid ${G.text}`, fontFamily: G.fontDisplay, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, background: G.text, color: G.bg }}>KODWAI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI agents in interview", "✗", "✓"],
                  ["Real-world environment", "✗", "✓"],
                  ["Automated scoring", "Partial", "Full"],
                  ["Agent interaction analysis", "✗", "✓"],
                  ["Time to evaluate", "5–7 days", "60 min"],
                  ["Candidate experience", "Stressful", "Authentic"],
                  ["Signal-to-noise ratio", "Low", "Very High"],
                ].map(([feature, trad, kodwai], i) => (
                  <tr key={i}>
                    <td style={{ padding: "14px 20px", borderBottom: `1px solid ${G.border}`, fontWeight: 700, color: G.text }}>{feature}</td>
                    <td style={{ padding: "14px 20px", borderBottom: `1px solid ${G.border}`, textAlign: "center", color: G.muted }}>{trad}</td>
                    <td style={{ padding: "14px 20px", borderBottom: `1px solid ${G.border}`, textAlign: "center", fontWeight: 700, color: G.accent }}>{kodwai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <RedRule />

      {/* ═══ QUOTE ═══ */}
      <Section style={{ padding: "100px 28px" }}>
        <div className="animate-in">
          <blockquote style={{
            fontFamily: G.fontDisplay,
            fontSize: "clamp(24px, 4vw, 52px)",
            lineHeight: 1.15,
            fontStyle: "italic",
            textTransform: "uppercase",
            letterSpacing: "-0.5px",
            margin: 0,
            maxWidth: 960,
          }}>
            &ldquo;WE STOPPED ASKING CANDIDATES TO REVERSE LINKED LISTS. NOW WE SEE HOW THEY <span style={{ color: G.accent }}>ACTUALLY BUILD</span> WITH AI.&rdquo;
          </blockquote>
          <div style={{ marginTop: 32, fontFamily: G.fontMono, fontSize: 13, color: G.muted, letterSpacing: 1 }}>
            — VP ENGINEERING, SERIES B STARTUP
          </div>
        </div>
      </Section>

      <RedRule />

      {/* ═══ STATS ═══ */}
      <Section>
        <div style={{ fontFamily: G.fontMono, fontSize: 11, color: G.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 48 }}>
          THE NUMBERS
        </div>
        <div className="flex-col sm:flex-row" style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
          {stats.map((s, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              flex: "1 1 200px", padding: "32px 0",
              borderRight: i < stats.length - 1 ? `1px solid ${G.border}` : "none",
              paddingRight: i < stats.length - 1 ? 40 : 0,
              paddingLeft: i > 0 ? 40 : 0,
            }}>
              <div style={{
                fontFamily: G.fontDisplay,
                fontSize: "clamp(56px, 6vw, 96px)",
                lineHeight: 1, letterSpacing: "-2px",
                marginBottom: 12,
              }}>
                {s.value}
              </div>
              <div style={{ fontFamily: G.fontMono, fontSize: 13, color: G.muted, letterSpacing: 1, textTransform: "uppercase" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <RedRule />

      {/* ═══ BOTTOM CTA ═══ */}
      <Section style={{ padding: "100px 28px", textAlign: "center" }}>
        <div className="animate-in">
          <h2 style={{
            fontFamily: G.fontDisplay,
            fontSize: "clamp(36px, 7vw, 80px)",
            lineHeight: 0.95, textTransform: "uppercase",
            letterSpacing: "-2px", marginBottom: 32,
          }}>
            STOP<br />
            <span style={{ color: G.accent }}>GUESSING.</span>
          </h2>
          <p style={{
            fontFamily: G.fontMono, fontSize: 15, lineHeight: 1.8,
            color: G.muted, maxWidth: 480, margin: "0 auto 48px",
          }}>
            Join the waitlist. Be first to interview engineers the way they actually work.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WaitlistForm id="cta-g" large />
          </div>
        </div>
      </Section>

      <RedRule />

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "32px 28px",
        borderTop: `3px solid ${G.text}`,
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: G.fontMono, fontSize: 12, color: G.muted,
        }}>
          <span>&copy; 2026 kodwai</span>
          <span style={{ letterSpacing: 2, textTransform: "uppercase" }}>International Typographic Style</span>
        </div>
      </footer>
    </div>
  );
}
