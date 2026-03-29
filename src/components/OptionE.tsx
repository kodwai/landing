"use client";

import { useState, useEffect, useRef } from "react";
import { allLogos } from "./CompanyLogos";

/* ══════════════════════════════════════════════════════════════
   OPTION E — "Paper Cut"
   Japanese-inspired minimalism. Light theme. Warm off-white
   background, bold black typography, one saturated red accent.
   Maximum whitespace. Restrained, precise, elegant.
   Like a premium Japanese print poster meets a tech landing page.
   ══════════════════════════════════════════════════════════════ */

const E = {
  bg: "#faf8f4",
  text: "#1a1a1a",
  accent: "#c23616",
  muted: "#9a948a",
  border: "#e4e0d8",
  borderDark: "#d0cbc1",
  cardBg: "transparent",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontMono: "'Space Mono', monospace",
};

/* ─── Terminal Lines ─── */
const lines = [
  { t: "p", s: "$ kodwai start --challenge system-design" },
  { t: "s", s: "Session live — agent connected" },
  { t: "s", s: "Challenge: Rate limiter — 10M req/s" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "architect a solution"' },
  { t: "a", s: "Sliding-window rate limiter with Redis." },
  { t: "a", s: "Let me scaffold the service now..." },
  { t: "b", s: "" },
  { t: "s", s: "sliding-window.ts created" },
  { t: "s", s: "redis-cluster.ts created" },
  { t: "s", s: "12/12 tests green" },
  { t: "b", s: "" },
  { t: "x", s: "Score: 94 / 100" },
  { t: "x", s: "   Decomposition  ████████░░  87" },
  { t: "x", s: "   Agent mastery  █████████░  92" },
  { t: "x", s: "   Verification   ██████████  98" },
];

function Terminal() {
  const [vl, setVl] = useState(0);
  const [ci, setCi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vl >= lines.length) {
      const t = setTimeout(() => { setVl(0); setCi(0); }, 4000);
      return () => clearTimeout(t);
    }
    const l = lines[vl];
    if (l.t === "b") {
      const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, 200);
      return () => clearTimeout(t);
    }
    if (ci < l.s.length) {
      const t = setTimeout(() => setCi(c => c + 1), l.t === "p" ? 26 : l.t === "a" ? 14 : 8);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, l.t === "p" ? 500 : l.t === "x" ? 280 : 130);
    return () => clearTimeout(t);
  }, [vl, ci]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [vl, ci]);

  const col = (t: string) =>
    t === "p" ? E.accent : t === "a" ? "#2d6a4f" : t === "x" ? E.text : E.muted;

  return (
    <div style={{
      background: E.bg, border: `1px solid ${E.border}`,
      overflow: "hidden", position: "relative", fontFamily: E.fontMono,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
        borderBottom: `1px solid ${E.border}`, position: "relative", zIndex: 1,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e0dcd4" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e0dcd4" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e0dcd4" }} />
        <span style={{ fontSize: 9, color: E.muted, marginLeft: 8, letterSpacing: 2, textTransform: "uppercase", fontFamily: E.fontMono }}>kodwai / session</span>
      </div>
      <div ref={ref} style={{ padding: 20, fontSize: 12, lineHeight: 1.9, height: 280, overflowY: "auto", position: "relative", zIndex: 1 }}>
        {lines.slice(0, vl + 1).map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 8 }} />;
          const cur = i === vl;
          return (
            <div key={i} style={{ color: col(l.t), whiteSpace: "pre", fontWeight: l.t === "x" ? 600 : 400 }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && (
                <span style={{
                  display: "inline-block", width: 7, height: 13,
                  background: E.accent, marginLeft: 1, verticalAlign: "text-bottom",
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

function Counter() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let f: number;
    const s = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - s) / 2000, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * 847));
      if (p < 1) f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, []);
  return <span style={{ fontFamily: E.fontMono, color: E.accent, fontWeight: 600 }}>{n.toLocaleString()}+</span>;
}

function WaitlistForm({ id, large }: { id: string; large?: boolean }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  if (ok) return (
    <div style={{ fontFamily: E.fontMono, fontSize: 13, color: "#2d6a4f", padding: "16px 0" }}>
      You&apos;re on the list. Check your inbox.
    </div>
  );
  return (
    <form
      onSubmit={e => { e.preventDefault(); if (email) setOk(true); }}
      style={{
        display: "flex", gap: 0, width: "100%", maxWidth: large ? 480 : 420,
        borderBottom: `2px solid ${E.text}`, transition: "border-color 0.3s",
      }}
      onFocus={(e) => { (e.currentTarget as HTMLFormElement).style.borderBottomColor = E.accent; }}
      onBlur={(e) => { (e.currentTarget as HTMLFormElement).style.borderBottomColor = E.text; }}
    >
      <input
        id={id} type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        style={{
          flex: 1, background: "transparent", border: "none", color: E.text,
          fontFamily: E.fontMono, fontSize: 13, padding: large ? "16px 0" : "14px 0",
          outline: "none",
        }}
      />
      <button type="submit" style={{
        background: "transparent", color: E.accent, fontFamily: E.fontMono, fontWeight: 700,
        fontSize: 11, padding: large ? "16px 0 16px 24px" : "14px 0 14px 20px",
        border: "none", cursor: "pointer", transition: "color 0.3s",
        textTransform: "uppercase", letterSpacing: 2, whiteSpace: "nowrap",
      }}
        onMouseEnter={e => { e.currentTarget.style.color = E.text; }}
        onMouseLeave={e => { e.currentTarget.style.color = E.accent; }}
      >Join Waitlist</button>
    </form>
  );
}

/* ─── Red Divider ─── */
function RedLine() {
  return (
    <div style={{ width: 48, height: 1, background: E.accent, margin: "0 auto" }} />
  );
}

/* ══════════════════════════ OPTION E ══════════════════════════ */

export default function OptionE() {
  useReveal();

  return (
    <div style={{
      background: E.bg, color: E.text, fontFamily: E.fontDisplay,
      position: "relative", zIndex: 2, overflowX: "hidden",
    }}>

      {/* ═══ SUBTLE ORB BACKGROUND ═══ */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "url(/images/orb-hero.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.05, mixBlendMode: "multiply",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(20px)", background: `${E.bg}ee`,
        borderBottom: `1px solid ${E.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: E.fontDisplay, fontWeight: 400, fontSize: 22, letterSpacing: "-0.5px",
          }}>kodwai</span>
        </div>
        <a href="#waitlist-e" style={{
          background: "transparent", color: E.text, fontFamily: E.fontMono,
          fontSize: 10, padding: "8px 20px", border: `1px solid ${E.text}`,
          textDecoration: "none", textTransform: "uppercase", letterSpacing: 3,
          transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = E.text; e.currentTarget.style.color = E.bg; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = E.text; }}
        >Waitlist</a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "160px 24px 120px", position: "relative",
        textAlign: "center",
      }}>
        {/* Crystal accent — clipped into circle, top right */}
        <div style={{
          position: "absolute", top: 120, right: "8%",
          width: 180, height: 180, borderRadius: "50%",
          backgroundImage: "url(/images/crystal-data.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08, mixBlendMode: "multiply",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 900, position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            marginBottom: 48, animation: "fade-in-up 0.6s ease forwards",
          }}>
            <span style={{ fontFamily: E.fontMono, fontSize: 11, color: E.muted, letterSpacing: 3, textTransform: "uppercase" }}>
              <Counter /> on the waitlist
            </span>
          </div>

          <h1 style={{
            fontFamily: E.fontDisplay, fontWeight: 400,
            fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 1.0,
            letterSpacing: "-3px", marginBottom: 36,
            animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
          }}>
            The interview is
            <br /><span style={{ color: E.accent, fontStyle: "italic" }}>obsolete.</span>
          </h1>

          <p style={{
            fontFamily: E.fontDisplay, fontSize: "clamp(16px, 2vw, 20px)",
            lineHeight: 1.7, color: E.muted, maxWidth: 480, margin: "0 auto 48px",
            animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
          }}>
            Engineers use AI agents every day.<br />
            Your interview platform gives them a chatbot.
          </p>

          <div id="waitlist-e" style={{
            display: "flex", justifyContent: "center",
            animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0,
          }}>
            <WaitlistForm id="hero-e" large />
          </div>
          <p style={{
            fontFamily: E.fontMono, fontSize: 10, color: E.muted, marginTop: 16,
            letterSpacing: 2, textTransform: "uppercase",
            animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0,
          }}>
            Free early access &middot; No card required
          </p>
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ TERMINAL ═══ */}
      <section style={{ padding: "80px 24px 160px", maxWidth: 640, margin: "0 auto" }}>
        <div className="animate-in" style={{ opacity: 0 }}>
          <Terminal />
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ LOGO STRIP ═══ */}
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: E.fontMono, fontSize: 10, color: E.muted,
            letterSpacing: 3, textTransform: "uppercase", marginBottom: 32,
          }}>
            Built for teams at
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "20px 48px" }}>
            {allLogos.map(({ name, Component }) => (
              <div key={name} style={{ opacity: 0.5, transition: "opacity 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; }}
              >
                <Component color="#b0a99a" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ PROBLEM ═══ */}
      <section style={{ padding: "160px 24px", position: "relative" }}>
        <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{
            fontFamily: E.fontMono, fontSize: 10, color: E.accent,
            letterSpacing: 3, textTransform: "uppercase", marginBottom: 32,
          }}>
            The Problem
          </p>
          <h2 style={{
            fontFamily: E.fontDisplay, fontWeight: 400,
            fontSize: "clamp(30px, 5vw, 56px)", lineHeight: 1.1,
            letterSpacing: "-2px", marginBottom: 28,
          }}>
            Chatbots are not<br />AI agents.
          </h2>
          <p style={{
            fontFamily: E.fontDisplay, fontSize: 18, color: E.muted, lineHeight: 1.8, maxWidth: 520,
          }}>
            Every interview platform offers a chat window. Your candidates
            use Claude Code, Cursor, and Copilot. The gap between what they
            use and what you test is{" "}
            <span style={{ color: E.accent }}>costing you top talent.</span>
          </p>
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ THREE VALUE PROPS ═══ */}
      <section style={{ padding: "160px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64 }}>
          {[
            {
              title: "Real Agent",
              desc: "Full Claude Code. Terminal, file system, multi-file projects. The way engineers actually work.",
            },
            {
              title: "Full Capture",
              desc: "Every prompt, edit, and command recorded. A complete transcript of how the candidate thinks.",
            },
            {
              title: "AI Scoring",
              desc: "Automated analysis of decomposition, agent control, verification habits. Not vibes — data.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`animate-in animate-in-delay-${i + 1}`}
              style={{
                paddingLeft: 24, borderLeft: `2px solid ${E.accent}`,
                transition: "border-color 0.3s",
              }}
            >
              <h3 style={{
                fontFamily: E.fontDisplay, fontWeight: 400,
                fontSize: 28, letterSpacing: "-0.5px", marginBottom: 14,
              }}>
                {card.title}
              </h3>
              <p style={{
                fontFamily: E.fontDisplay, fontSize: 15, color: E.muted, lineHeight: 1.8,
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "160px 24px", position: "relative" }}>
        {/* Crystal circle accent — decorative */}
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: 220, height: 220, borderRadius: "50%",
          backgroundImage: "url(/images/crystal-data.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.06, mixBlendMode: "multiply",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="animate-in" style={{ marginBottom: 64 }}>
            <p style={{
              fontFamily: E.fontMono, fontSize: 10, color: E.accent,
              letterSpacing: 3, textTransform: "uppercase", marginBottom: 32,
            }}>
              How It Works
            </p>
            <h2 style={{
              fontFamily: E.fontDisplay, fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px",
            }}>
              Three steps. No complexity.
            </h2>
          </div>

          {[
            {
              n: "01",
              title: "Configure the challenge",
              desc: "System design, debugging, greenfield build. Set AI access level and time limits.",
            },
            {
              n: "02",
              title: "Observe the session",
              desc: "Candidate works with Claude Code. Full terminal, full IDE. You watch live or review later.",
            },
            {
              n: "03",
              title: "Review the transcript",
              desc: "AI-generated evaluation. Every prompt, every decision. Scoring you can defend in a debrief.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className={`animate-in animate-in-delay-${i + 1}`}
              style={{
                display: "flex", gap: 28, padding: "36px 0",
                borderTop: `1px solid ${E.border}`,
              }}
            >
              <span style={{
                fontFamily: E.fontMono, fontSize: 12, color: E.accent,
                letterSpacing: 1, flexShrink: 0, paddingTop: 4,
              }}>
                {step.n}
              </span>
              <div>
                <h3 style={{
                  fontFamily: E.fontDisplay, fontWeight: 400, fontSize: 22,
                  letterSpacing: "-0.3px", marginBottom: 10,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: E.fontDisplay, fontSize: 15, color: E.muted, lineHeight: 1.8,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "160px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div className="animate-in" style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: E.fontMono, fontSize: 10, color: E.accent,
            letterSpacing: 3, textTransform: "uppercase", marginBottom: 32,
          }}>
            Comparison
          </p>
          <h2 style={{
            fontFamily: E.fontDisplay, fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1.5px",
          }}>
            Not an upgrade.<br />
            <span style={{ color: E.muted }}>A replacement.</span>
          </h2>
        </div>

        <div className="flex-col sm:flex-row" style={{ display: "flex", gap: 0 }}>
          <div className="animate-in animate-in-delay-1" style={{
            flex: 1, padding: "36px 32px", borderTop: `1px solid ${E.border}`,
            borderBottom: `1px solid ${E.border}`, borderLeft: `1px solid ${E.border}`,
            borderRight: `1px solid ${E.border}`,
          }}>
            <p style={{
              fontFamily: E.fontMono, fontSize: 10, color: E.muted,
              letterSpacing: 3, textTransform: "uppercase", marginBottom: 28,
            }}>Legacy</p>
            {["Chat widget", "No filesystem", "Toy editor", "No terminal", "Manual review", "AI invisible"].map((x, i) => (
              <div key={i} style={{
                fontFamily: E.fontMono, fontSize: 12, color: E.muted,
                padding: "12px 0", borderBottom: `1px solid ${E.border}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ color: E.muted, fontSize: 9 }}>&#x2715;</span>{x}
              </div>
            ))}
          </div>
          <div className="animate-in animate-in-delay-2" style={{
            flex: 1, padding: "36px 32px",
            borderTop: `1px solid ${E.accent}30`,
            borderBottom: `1px solid ${E.accent}30`,
            borderRight: `1px solid ${E.accent}30`,
            borderLeft: `2px solid ${E.accent}`,
          }}>
            <p style={{
              fontFamily: E.fontMono, fontSize: 10, color: E.accent,
              letterSpacing: 3, textTransform: "uppercase", marginBottom: 28,
            }}>kodwai</p>
            {["Claude Code agent", "Full multi-file", "Real IDE", "Full terminal", "AI scoring", "Full transcript"].map((x, i) => (
              <div key={i} style={{
                fontFamily: E.fontMono, fontSize: 12, color: E.text,
                padding: "12px 0", borderBottom: `1px solid ${E.border}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ color: E.accent, fontSize: 11 }}>&rarr;</span>{x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ QUOTE ═══ */}
      <section style={{ padding: "160px 24px" }}>
        <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ paddingLeft: 28, borderLeft: `2px solid ${E.accent}` }}>
            <p style={{
              fontFamily: E.fontDisplay, fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 32px)", fontStyle: "italic",
              lineHeight: 1.6, marginBottom: 24, letterSpacing: "-0.5px",
            }}>
              &ldquo;We allowed AI in interviews but were blind to how
              candidates actually used it. kodwai changed everything.&rdquo;
            </p>
            <p style={{ fontFamily: E.fontMono, fontSize: 11, color: E.muted, letterSpacing: 1 }}>
              &mdash; Engineering Manager, 200+ engineers
            </p>
          </div>
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "160px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div className="animate-in" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48,
          textAlign: "center",
        }}>
          {[
            { stat: "87%", label: "of FAANG allow AI in interviews" },
            { stat: "3\u00d7", label: "faster hiring with AI scoring" },
            { stat: "0", label: "real AI agent platforms \u2014 until now" },
          ].map((x, i) => (
            <div key={i}>
              <div style={{
                fontFamily: E.fontDisplay, fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-3px",
                color: E.text, marginBottom: 10,
              }}>
                {x.stat}
              </div>
              <p style={{
                fontFamily: E.fontMono, fontSize: 11, color: E.muted, lineHeight: 1.6,
              }}>
                {x.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{ padding: "160px 24px", textAlign: "center", position: "relative" }}>
        {/* Crystal accent circle */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 300, height: 300, borderRadius: "50%",
          backgroundImage: "url(/images/crystal-data.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.04, mixBlendMode: "multiply",
          pointerEvents: "none",
        }} />

        <div className="animate-in" style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h2 style={{
            fontFamily: E.fontDisplay, fontWeight: 400,
            fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.05,
            letterSpacing: "-2px", marginBottom: 24,
          }}>
            Stop testing the past.
            <br /><span style={{ color: E.accent, fontStyle: "italic" }}>Hire for the future.</span>
          </h2>
          <p style={{
            fontFamily: E.fontDisplay, fontSize: 17, color: E.muted,
            lineHeight: 1.7, maxWidth: 420, margin: "0 auto 48px",
          }}>
            Early access includes priority onboarding, feature input, and lifetime pricing.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WaitlistForm id="bottom-e" large />
          </div>
        </div>
      </section>

      {/* ═══ RED LINE DIVIDER ═══ */}
      <RedLine />

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "48px 40px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", display: "flex",
          justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: E.fontDisplay, fontSize: 18, letterSpacing: "-0.3px" }}>kodwai</span>
            <span style={{ fontFamily: E.fontMono, fontSize: 10, color: E.muted, letterSpacing: 1 }}>
              For teams that take AI seriously.
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: E.fontMono, fontSize: 11, color: E.muted, textDecoration: "none",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = E.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = E.muted; }}
            >X</a>
            <a href="mailto:hello@kodwai.com" style={{
              fontFamily: E.fontMono, fontSize: 11, color: E.muted, textDecoration: "none",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = E.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = E.muted; }}
            >Email</a>
            <span style={{ fontFamily: E.fontMono, fontSize: 10, color: E.muted, opacity: 0.4 }}>
              &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
