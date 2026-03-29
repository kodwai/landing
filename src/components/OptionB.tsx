"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ══════════════════════════════════════════════════════════════
   OPTION B — "Holographic Noir"
   Deep indigo-navy base, amber/gold primary accent, editorial layout.
   Uses Gemini-generated images. Different typography (Outfit + Fira Code).
   ══════════════════════════════════════════════════════════════ */

const B = {
  bg: "#06080f",
  bgCard: "#0b0e18",
  bgElevated: "#10142a",
  border: "#1a1f3a",
  borderGlow: "#f59e0b22",
  text: "#eee8df",
  textDim: "#8a8699",
  textMuted: "#4d4861",
  accent: "#f59e0b",
  accentDim: "#f59e0b22",
  accent2: "#818cf8",
  accent2Dim: "#818cf822",
  green: "#34d399",
  red: "#f87171",
  fontDisplay: "'Outfit', sans-serif",
  fontMono: "'Fira Code', 'JetBrains Mono', monospace",
};

/* ─────── COMPANY LOGOS (SVG) ─────── */

function CompanyLogo({ name }: { name: string }) {
  const logos: Record<string, React.ReactNode> = {
    Google: (
      <svg viewBox="0 0 74 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Google</text>
      </svg>
    ),
    Meta: (
      <svg viewBox="0 0 50 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Meta</text>
      </svg>
    ),
    Amazon: (
      <svg viewBox="0 0 80 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Amazon</text>
      </svg>
    ),
    Stripe: (
      <svg viewBox="0 0 62 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Stripe</text>
      </svg>
    ),
    Netflix: (
      <svg viewBox="0 0 68 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Netflix</text>
      </svg>
    ),
    Microsoft: (
      <svg viewBox="0 0 98 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Microsoft</text>
      </svg>
    ),
    Apple: (
      <svg viewBox="0 0 58 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Apple</text>
      </svg>
    ),
    Vercel: (
      <svg viewBox="0 0 64 24" fill="none" height="20">
        <text x="0" y="19" fontFamily={B.fontDisplay} fontWeight="700" fontSize="20" fill={B.textMuted} letterSpacing="-0.5">Vercel</text>
      </svg>
    ),
  };
  return logos[name] || null;
}

/* ─────── TERMINAL ─────── */

const terminalLines = [
  { type: "prompt", text: "$ kodwai start --challenge system-design" },
  { type: "system", text: "⚡ Session started — Claude Code agent connected" },
  { type: "system", text: "📋 Challenge: Design a rate limiter for 10M req/s" },
  { type: "blank", text: "" },
  { type: "prompt", text: '$ claude "analyze requirements, propose architecture"' },
  { type: "agent", text: "I'll design a distributed rate limiter using a sliding" },
  { type: "agent", text: "window approach with Redis. Let me scaffold this..." },
  { type: "blank", text: "" },
  { type: "system", text: "📁 Created: src/rate-limiter/sliding-window.ts" },
  { type: "system", text: "📁 Created: src/rate-limiter/redis-cluster.ts" },
  { type: "system", text: "✅ All tests passing — 12/12" },
  { type: "blank", text: "" },
  { type: "score", text: "🎯 AI Collaboration Score: 94/100" },
  { type: "score", text: "   Decomposition  ████████░░ 87%" },
  { type: "score", text: "   Agent control  █████████░ 92%" },
  { type: "score", text: "   Verification   ██████████ 98%" },
];

function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleLines >= terminalLines.length) {
      const t = setTimeout(() => { setVisibleLines(0); setCharIdx(0); }, 4000);
      return () => clearTimeout(t);
    }
    const line = terminalLines[visibleLines];
    if (line.type === "blank") {
      const t = setTimeout(() => { setVisibleLines(v => v + 1); setCharIdx(0); }, 200);
      return () => clearTimeout(t);
    }
    if (charIdx < line.text.length) {
      const speed = line.type === "prompt" ? 28 : line.type === "agent" ? 16 : 10;
      const t = setTimeout(() => setCharIdx(c => c + 1), speed);
      return () => clearTimeout(t);
    }
    const pause = line.type === "prompt" ? 500 : line.type === "score" ? 300 : 150;
    const t = setTimeout(() => { setVisibleLines(v => v + 1); setCharIdx(0); }, pause);
    return () => clearTimeout(t);
  }, [visibleLines, charIdx]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [visibleLines, charIdx]);

  const color = (type: string) => {
    switch (type) {
      case "prompt": return B.accent;
      case "agent": return B.green;
      case "system": return B.textDim;
      case "score": return B.accent2;
      default: return B.text;
    }
  };

  return (
    <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: `0 0 80px ${B.accentDim}, 0 20px 60px rgba(0,0,0,0.5)` }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${B.accent}44, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", background: B.bgElevated, borderBottom: `1px solid ${B.border}` }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28ca42" }} />
        <span style={{ fontFamily: B.fontMono, fontSize: 11, color: B.textMuted, marginLeft: 8 }}>kodwai — live session</span>
      </div>
      <div ref={bodyRef} style={{ padding: 20, fontFamily: B.fontMono, fontSize: 12.5, lineHeight: 1.8, height: 320, overflowY: "auto" }}>
        {terminalLines.slice(0, visibleLines + 1).map((line, i) => {
          if (line.type === "blank") return <div key={i} style={{ height: 12 }} />;
          const isCurrent = i === visibleLines;
          const text = isCurrent ? line.text.slice(0, charIdx) : line.text;
          return (
            <div key={i} style={{ color: color(line.type), whiteSpace: "pre" }}>
              {text}
              {isCurrent && charIdx < line.text.length && (
                <span style={{ display: "inline-block", width: 7, height: 14, background: B.accent, marginLeft: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────── SCROLL REVEAL ─────── */

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".animate-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────── WAITLIST FORM ─────── */

function WaitlistForm({ id, variant }: { id: string; variant?: "large" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email) setSubmitted(true); };

  if (submitted) {
    return (
      <div style={{ fontFamily: B.fontMono, fontSize: 16, color: B.green, padding: "20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${B.green}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</span>
        You&apos;re on the list. Watch your inbox.
      </div>
    );
  }

  const isLarge = variant === "large";

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 12, width: "100%", maxWidth: isLarge ? 540 : 480, flexDirection: "column" }} className="sm:flex-row">
      <input
        id={id} type="email" required value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        style={{
          flex: 1, background: B.bgCard, border: `1px solid ${B.border}`, color: B.text,
          fontFamily: B.fontMono, fontSize: isLarge ? 15 : 14, padding: isLarge ? "18px 22px" : "16px 20px",
          borderRadius: 10, outline: "none", transition: "all 0.3s",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = B.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${B.accentDim}`; }}
        onBlur={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.boxShadow = "none"; }}
      />
      <button type="submit" style={{
        background: B.accent, color: B.bg, fontFamily: B.fontMono, fontWeight: 700,
        fontSize: isLarge ? 14 : 13, letterSpacing: 0.5, padding: isLarge ? "18px 32px" : "16px 28px",
        border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.3s",
        textTransform: "uppercase", whiteSpace: "nowrap",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 0 24px ${B.accentDim}, 0 8px 24px rgba(0,0,0,0.3)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      >
        Get Early Access
      </button>
    </form>
  );
}

/* ─────── COUNTER ─────── */

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
  return <span style={{ fontFamily: B.fontMono, color: B.accent, fontWeight: 700 }}>{n.toLocaleString()}+</span>;
}

/* ══════════════════════════════════════════════════════════════
   OPTION B — MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function OptionB() {
  useReveal();

  const companies = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Stripe", "Netflix", "Vercel"];

  return (
    <div style={{ background: B.bg, color: B.text, fontFamily: B.fontDisplay, position: "relative", zIndex: 2 }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(24px)", background: `${B.bg}cc`,
        borderBottom: `1px solid ${B.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${B.accent}, ${B.accent2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: B.fontMono, fontWeight: 800, fontSize: 14, color: B.bg,
          }}>k</div>
          <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>kodwai</span>
        </div>
        <a href="#waitlist-b" style={{
          background: B.accent, color: B.bg, fontFamily: B.fontMono, fontWeight: 700,
          fontSize: 12, padding: "10px 24px", borderRadius: 8, textDecoration: "none",
          textTransform: "uppercase", letterSpacing: 0.5, transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 20px ${B.accentDim}`; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; }}
        >Join Waitlist</a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr",
        alignItems: "center", padding: "160px 24px 80px",
        position: "relative", overflow: "hidden",
        backgroundImage: "url(/images/bg-texture.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${B.bg}ee 0%, ${B.bg}aa 50%, ${B.bg} 100%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr", gap: 64, alignItems: "center" }} className="lg:grid-cols-2">
          {/* Left — Copy */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 18px", borderRadius: 100,
              border: `1px solid ${B.border}`, background: `${B.bgCard}cc`,
              marginBottom: 36, animation: "fade-in-up 0.6s ease forwards",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.green, boxShadow: `0 0 10px ${B.green}` }} />
              <span style={{ fontFamily: B.fontMono, fontSize: 13, color: B.textDim }}><Counter /> engineers waiting</span>
            </div>

            <h1 style={{
              fontFamily: B.fontDisplay, fontWeight: 900,
              fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1.05,
              letterSpacing: "-2px", marginBottom: 28,
              animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
            }}>
              Stop guessing.
              <br />
              <span style={{
                background: `linear-gradient(135deg, ${B.accent}, ${B.accent2})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Start measuring.</span>
            </h1>

            <p style={{
              fontFamily: B.fontDisplay, fontSize: "clamp(17px, 2vw, 21px)",
              lineHeight: 1.65, color: B.textDim, maxWidth: 500, marginBottom: 40,
              animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
            }}>
              The first interview platform with a <span style={{ color: B.accent, fontWeight: 600 }}>real AI coding agent</span> — not a chatbot.
              See exactly how candidates think, build, and collaborate with AI.
            </p>

            <div id="waitlist-b" style={{ animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0 }}>
              <WaitlistForm id="hero-email-b" variant="large" />
            </div>
            <p style={{
              fontFamily: B.fontMono, fontSize: 12, color: B.textMuted, marginTop: 14,
              animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0,
            }}>Free early access. No credit card required.</p>
          </div>

          {/* Right — Terminal + Hero Image */}
          <div style={{ animation: "fade-in-up 1s ease 0.4s forwards", opacity: 0, position: "relative" }}>
            {/* Glow behind terminal */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: 500, height: 500, borderRadius: "50%",
              background: `radial-gradient(circle, ${B.accentDim} 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <Terminal />
          </div>
        </div>
      </section>

      {/* ═══ LOGOS ═══ */}
      <section style={{
        borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}`,
        background: B.bgCard, padding: "40px 48px",
      }}>
        <p style={{
          fontFamily: B.fontMono, fontSize: 11, color: B.textMuted,
          letterSpacing: 3, textTransform: "uppercase", textAlign: "center", marginBottom: 28,
        }}>Built for teams hiring at</p>
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          flexWrap: "wrap", gap: "24px 48px",
        }}>
          {companies.map(name => (
            <div key={name} style={{ opacity: 0.5, transition: "opacity 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; }}>
              <CompanyLogo name={name} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HERO IMAGE SHOWCASE ═══ */}
      <section style={{ padding: "100px 24px 0", maxWidth: 1100, margin: "0 auto" }}>
        <div className="animate-in" style={{
          borderRadius: 20, overflow: "hidden", position: "relative",
          border: `1px solid ${B.border}`,
          boxShadow: `0 0 60px ${B.accent2Dim}`,
        }}>
          <Image src="/images/hero-abstract.jpg" alt="AI-powered interview visualization" width={1100} height={500} style={{ width: "100%", height: "auto", display: "block" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, transparent 40%, ${B.bg} 100%)`,
          }} />
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section style={{ padding: "120px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div className="animate-in" style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block", fontFamily: B.fontMono, fontSize: 12, color: B.accent,
            padding: "6px 14px", borderRadius: 6, background: B.accentDim,
            textTransform: "uppercase", letterSpacing: 2, marginBottom: 28,
          }}>The Problem</div>

          <h2 style={{
            fontFamily: B.fontDisplay, fontWeight: 900,
            fontSize: "clamp(30px, 4.5vw, 52px)", lineHeight: 1.1,
            letterSpacing: "-1.5px", marginBottom: 28,
          }}>
            AI is everywhere in engineering.
            <br />
            <span style={{ color: B.textMuted }}>Except your interview stack.</span>
          </h2>
          <p style={{ fontSize: 18, color: B.textDim, lineHeight: 1.75, maxWidth: 580, margin: "0 auto" }}>
            Candidates use Claude Code, Cursor, and Copilot daily. Your interview platform gives them a chat window from 2019.
            <span style={{ color: B.accent, fontWeight: 600 }}> That gap costs you top talent.</span>
          </p>
        </div>
      </section>

      {/* ═══ VALUE PROPS ═══ */}
      <section style={{ padding: "0 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {[
            {
              icon: "⚡", label: "AGENT", title: "Real AI Agent",
              desc: "Full Claude Code with terminal, file system, and agentic capabilities. Not a glorified autocomplete.",
              color: B.accent,
            },
            {
              icon: "◉", label: "CAPTURE", title: "Full Session Replay",
              desc: "Every prompt, edit, and terminal command. A complete transcript of how the candidate thinks with AI.",
              color: B.accent2,
            },
            {
              icon: "△", label: "SCORING", title: "AI-Powered Scores",
              desc: "Automated evaluation of decomposition, agent control, verification habits, and communication.",
              color: B.green,
            },
          ].map((card, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 20,
              padding: "40px 36px", transition: "all 0.4s", cursor: "default", position: "relative",
              overflow: "hidden",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${card.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${card.color}44, transparent)` }} />
              <div style={{
                fontFamily: B.fontMono, fontSize: 10, color: card.color,
                letterSpacing: 3, textTransform: "uppercase", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 20 }}>{card.icon}</span>
                {card.label}
              </div>
              <h3 style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 24, marginBottom: 14, letterSpacing: "-0.3px" }}>{card.title}</h3>
              <p style={{ fontSize: 15, color: B.textDim, lineHeight: 1.7 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SESSION VISUAL ═══ */}
      <section style={{
        padding: "100px 24px", position: "relative",
        borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}`,
        background: B.bgCard,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 60, alignItems: "center" }}>
            <div style={{ maxWidth: 480 }}>
              <div style={{
                fontFamily: B.fontMono, fontSize: 11, color: B.accent2,
                letterSpacing: 3, textTransform: "uppercase", marginBottom: 20,
              }}>Live Collaboration</div>
              <h2 style={{
                fontFamily: B.fontDisplay, fontWeight: 900,
                fontSize: "clamp(28px, 3.5vw, 42px)", lineHeight: 1.15,
                letterSpacing: "-1px", marginBottom: 24,
              }}>
                Watch candidates think
                <span style={{ color: B.accent }}> in real time.</span>
              </h2>
              <p style={{ fontSize: 16, color: B.textDim, lineHeight: 1.75, marginBottom: 32 }}>
                Observe the entire interview session live. See how candidates decompose problems, direct the AI agent, and verify solutions. Two synchronized viewports — candidate and interviewer.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {["Live session observation", "Dual-viewport mode", "Complete interaction timeline", "Instant replay on demand"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: B.fontMono, fontSize: 13, color: B.text }}>
                    <span style={{ color: B.accent2, fontSize: 16 }}>→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${B.border}`, boxShadow: `0 0 50px ${B.accent2Dim}` }}>
              <Image src="/images/session-visual.jpg" alt="Live session dual viewports" width={600} height={340} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "120px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div className="animate-in" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{
            display: "inline-block", fontFamily: B.fontMono, fontSize: 12, color: B.accent2,
            padding: "6px 14px", borderRadius: 6, background: B.accent2Dim,
            textTransform: "uppercase", letterSpacing: 2, marginBottom: 24,
          }}>How It Works</div>
          <h2 style={{ fontFamily: B.fontDisplay, fontWeight: 900, fontSize: "clamp(28px, 4vw, 46px)", letterSpacing: "-1px" }}>
            Three steps. One source of truth.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 32, top: 40, bottom: 40, width: 2,
            background: `linear-gradient(180deg, ${B.accent}44, ${B.accent2}44, ${B.green}44)`,
          }} />

          {[
            { num: "01", title: "Configure the challenge", desc: "Define the problem, set AI access levels, configure time constraints. System design, debugging, greenfield — any format.", color: B.accent },
            { num: "02", title: "Candidate codes with AI", desc: "Real Claude Code agent. Real terminal. Real file system. The interviewer watches live. No sandboxed toy environments.", color: B.accent2 },
            { num: "03", title: "Review the transcript", desc: "AI-generated evaluation with full session replay. Every prompt, every decision, every verification step. Scoring you trust.", color: B.green },
          ].map((step, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              display: "grid", gridTemplateColumns: "64px 1fr", gap: 24,
              padding: "32px 0", alignItems: "start", position: "relative",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: B.bgCard, border: `1px solid ${B.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: B.fontMono, fontWeight: 800, fontSize: 18, color: step.color,
                position: "relative", zIndex: 2,
              }}>{step.num}</div>
              <div>
                <h3 style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 22, marginBottom: 10, letterSpacing: "-0.3px" }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: B.textDim, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ AI SCORING VISUAL ═══ */}
      <section style={{
        padding: "100px 24px",
        borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}`,
        background: B.bgCard, position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 60, alignItems: "center" }}>
          <div className="animate-in" style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${B.border}`, boxShadow: `0 0 50px ${B.accentDim}` }}>
            <Image src="/images/ai-scoring.jpg" alt="AI-powered scoring visualization" width={1100} height={500} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          <div className="animate-in animate-in-delay-1" style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{
              fontFamily: B.fontDisplay, fontWeight: 900,
              fontSize: "clamp(28px, 3.5vw, 40px)", lineHeight: 1.15,
              letterSpacing: "-1px", marginBottom: 20,
            }}>
              Scoring that actually means
              <span style={{ color: B.accent }}> something.</span>
            </h2>
            <p style={{ fontSize: 16, color: B.textDim, lineHeight: 1.75 }}>
              Our AI analyzes the complete interaction: problem decomposition, agent direction quality, verification patterns, and iterative refinement. Not just &ldquo;did the code compile.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "120px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div className="animate-in" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block", fontFamily: B.fontMono, fontSize: 12, color: B.red,
            padding: "6px 14px", borderRadius: 6, background: `${B.red}15`,
            textTransform: "uppercase", letterSpacing: 2, marginBottom: 24,
          }}>The Difference</div>
          <h2 style={{ fontFamily: B.fontDisplay, fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1px" }}>
            Not another chat widget.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="animate-in animate-in-delay-1" style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 20, padding: 36 }}>
            <p style={{ fontFamily: B.fontMono, fontSize: 11, color: B.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>Other Platforms</p>
            {["Basic chat assistant", "No file system access", "Single-file editor", "No terminal", "Manual scoring only", "Blind to AI usage"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${B.border}`, fontFamily: B.fontMono, fontSize: 13, color: B.textMuted }}>
                <span style={{ color: B.red, fontSize: 12, fontWeight: 700 }}>✕</span>{item}
              </div>
            ))}
          </div>
          <div className="animate-in animate-in-delay-2" style={{
            background: B.bgCard, border: `1px solid ${B.accent}44`, borderRadius: 20, padding: 36, position: "relative",
            boxShadow: `0 0 40px ${B.accentDim}`,
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${B.accent}, transparent)` }} />
            <div style={{ position: "absolute", top: -1, right: 24, background: B.accent, color: B.bg, fontFamily: B.fontMono, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: "0 0 6px 6px", letterSpacing: 1 }}>RECOMMENDED</div>
            <p style={{ fontFamily: B.fontMono, fontSize: 11, color: B.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>kodwai</p>
            {["Full Claude Code agent", "Complete file system & multi-file", "Real IDE experience", "Full terminal access", "AI-powered automated scoring", "Complete collaboration transcript"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${B.accent}15`, fontFamily: B.fontMono, fontSize: 13, color: B.text }}>
                <span style={{ color: B.accent, fontSize: 14, fontWeight: 700 }}>✓</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section style={{
        padding: "100px 24px", textAlign: "center",
        borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}`,
        background: B.bgCard, position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${B.accent2Dim} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 48, color: B.accent, marginBottom: 24, fontFamily: "Georgia, serif" }}>&ldquo;</div>
          <p style={{
            fontFamily: B.fontDisplay, fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 500, lineHeight: 1.6, color: B.text, marginBottom: 28,
          }}>
            We let candidates use AI in interviews but had no way to evaluate how they used it. We were flying blind.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: B.bgElevated, border: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: B.fontMono, fontSize: 14, color: B.accent }}>EM</div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: B.fontMono, fontSize: 13, color: B.text }}>Engineering Manager</p>
              <p style={{ fontFamily: B.fontMono, fontSize: 11, color: B.textMuted }}>Series B Startup, 200+ engineers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div className="animate-in" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24,
        }}>
          {[
            { stat: "87%", label: "of FAANG companies now allow AI in interviews", color: B.accent },
            { stat: "3x", label: "faster hiring decisions with AI-scored sessions", color: B.accent2 },
            { stat: "0", label: "platforms support real AI coding agents — until now", color: B.green },
          ].map((item, i) => (
            <div key={i} style={{
              padding: 36, background: B.bgCard, border: `1px solid ${B.border}`,
              borderRadius: 20, textAlign: "center",
            }}>
              <div style={{
                fontFamily: B.fontDisplay, fontWeight: 900, fontSize: 56,
                letterSpacing: "-3px", marginBottom: 12, color: item.color,
              }}>{item.stat}</div>
              <p style={{ fontFamily: B.fontMono, fontSize: 12, color: B.textDim, lineHeight: 1.6 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{
        padding: "140px 24px", textAlign: "center", position: "relative", overflow: "hidden",
        backgroundImage: "url(/images/bg-texture.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${B.bg} 0%, ${B.bg}cc 50%, ${B.bg} 100%)`, pointerEvents: "none" }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${B.accentDim} 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />
        <div className="animate-in" style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{
            fontFamily: B.fontDisplay, fontWeight: 900,
            fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1,
            letterSpacing: "-2px", marginBottom: 24,
          }}>
            The future of hiring is
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${B.accent}, ${B.accent2})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>AI-native.</span>
          </h2>
          <p style={{ fontSize: 18, color: B.textDim, marginBottom: 44, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.65 }}>
            Early access includes priority onboarding, direct feature input, and lifetime pricing.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WaitlistForm id="bottom-email-b" variant="large" />
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${B.border}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: `linear-gradient(135deg, ${B.accent}, ${B.accent2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: B.fontMono, fontWeight: 800, fontSize: 12, color: B.bg,
            }}>k</div>
            <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 18 }}>kodwai</span>
          </div>
          <p style={{ fontFamily: B.fontMono, fontSize: 12, color: B.textMuted, maxWidth: 380, textAlign: "center" }}>
            Built for engineering teams that take AI seriously.
          </p>
          <div style={{ display: "flex", gap: 28, marginTop: 4 }}>
            <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{ fontFamily: B.fontMono, fontSize: 12, color: B.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = B.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = B.textMuted; }}>X / Twitter</a>
            <a href="mailto:hello@kodwai.com" style={{ fontFamily: B.fontMono, fontSize: 12, color: B.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = B.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = B.textMuted; }}>hello@kodwai.com</a>
          </div>
          <p style={{ fontFamily: B.fontMono, fontSize: 11, color: B.textMuted, marginTop: 20, opacity: 0.4 }}>&copy; {new Date().getFullYear()} kodwai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
