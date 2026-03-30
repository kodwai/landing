"use client";

import { useState, useEffect, useRef } from "react";
import LogoStrip from "./LogoStrip";

/* ══════════════════════════════════════════════════════════════
   OPTION C — "Celestial"
   Deep space black. The glowing orb as gravitational center.
   Particle field as ambient atmosphere. Crystal as section accent.
   Warm gold + cool violet palette. Playfair Display + Source Code Pro.
   Images used via blend modes, masks, opacity layers, clip-paths.
   ══════════════════════════════════════════════════════════════ */

const C = {
  bg: "#030305",
  bgCard: "#08080c",
  bgElevated: "#0e0e14",
  border: "#1a1a24",
  text: "#f4f0eb",
  textDim: "#9590a0",
  textMuted: "#504b5c",
  gold: "#e8b931",
  goldDim: "#e8b93120",
  violet: "#a78bfa",
  violetDim: "#a78bfa18",
  cyan: "#67e8f9",
  cyanDim: "#67e8f915",
  green: "#6ee7b7",
  red: "#fca5a5",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody: "'DM Sans', sans-serif",
  fontMono: "'Source Code Pro', monospace",
};

/* ─── Terminal ─── */
const termLines = [
  { t: "p", s: "$ kodwai start --challenge system-design" },
  { t: "s", s: "⚡ Session live — Claude Code connected" },
  { t: "s", s: "📋 Design a rate limiter for 10M req/s" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "propose an architecture"' },
  { t: "a", s: "Designing a distributed sliding-window rate" },
  { t: "a", s: "limiter backed by Redis Cluster..." },
  { t: "b", s: "" },
  { t: "s", s: "📁 sliding-window.ts — created" },
  { t: "s", s: "📁 redis-cluster.ts — created" },
  { t: "s", s: "✅ 12/12 tests passing" },
  { t: "b", s: "" },
  { t: "x", s: "🎯 Score: 94/100" },
  { t: "x", s: "   Decomposition  ████████░░ 87%" },
  { t: "x", s: "   Agent control  █████████░ 92%" },
  { t: "x", s: "   Verification   ██████████ 98%" },
];

function Terminal() {
  const [vl, setVl] = useState(0);
  const [ci, setCi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vl >= termLines.length) { const t = setTimeout(() => { setVl(0); setCi(0); }, 4000); return () => clearTimeout(t); }
    const l = termLines[vl];
    if (l.t === "b") { const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, 200); return () => clearTimeout(t); }
    if (ci < l.s.length) { const t = setTimeout(() => setCi(c => c + 1), l.t === "p" ? 28 : l.t === "a" ? 16 : 10); return () => clearTimeout(t); }
    const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, l.t === "p" ? 500 : l.t === "x" ? 300 : 150);
    return () => clearTimeout(t);
  }, [vl, ci]);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vl, ci]);

  const col = (t: string) => t === "p" ? C.gold : t === "a" ? C.green : t === "x" ? C.violet : C.textDim;

  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16,
      overflow: "hidden", position: "relative",
      boxShadow: `0 4px 80px ${C.violetDim}, 0 0 0 1px ${C.border}`,
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.violet}33, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 18px", background: C.bgElevated, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28ca42" }} />
        <span style={{ fontFamily: C.fontMono, fontSize: 11, color: C.textMuted, marginLeft: 8 }}>kodwai session</span>
      </div>
      <div ref={ref} style={{ padding: 20, fontFamily: C.fontMono, fontSize: 12.5, lineHeight: 1.8, height: 300, overflowY: "auto" }}>
        {termLines.slice(0, vl + 1).map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 10 }} />;
          const cur = i === vl;
          return (
            <div key={i} style={{ color: col(l.t), whiteSpace: "pre" }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && <span style={{ display: "inline-block", width: 7, height: 14, background: C.gold, marginLeft: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Hooks & Helpers ─── */
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
    let f: number; const s = performance.now();
    const tick = (now: number) => { const p = Math.min((now - s) / 2000, 1); setN(Math.floor((1 - Math.pow(1 - p, 3)) * 847)); if (p < 1) f = requestAnimationFrame(tick); };
    f = requestAnimationFrame(tick); return () => cancelAnimationFrame(f);
  }, []);
  return <span style={{ fontFamily: C.fontMono, color: C.gold, fontWeight: 600 }}>{n.toLocaleString()}+</span>;
}

function WaitlistForm({ id, large }: { id: string; large?: boolean }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  if (ok) return <div style={{ fontFamily: C.fontMono, fontSize: 15, color: C.green, padding: "16px 0" }}>✓ You&apos;re on the list.</div>;
  return (
    <form onSubmit={e => { e.preventDefault(); if (email) setOk(true); }} style={{ display: "flex", gap: 12, width: "100%", maxWidth: large ? 520 : 460 }} className="flex-col sm:flex-row">
      <input id={id} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
        style={{ flex: 1, background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.fontMono, fontSize: 14, padding: large ? "18px 22px" : "15px 20px", borderRadius: 10, outline: "none", transition: "all 0.3s" }}
        onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.goldDim}`; }}
        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
      />
      <button type="submit" style={{
        background: `linear-gradient(135deg, ${C.gold}, #d4a017)`, color: C.bg,
        fontFamily: C.fontMono, fontWeight: 700, fontSize: 13, padding: large ? "18px 32px" : "15px 28px",
        border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.3s",
        textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 0 30px ${C.goldDim}, 0 8px 24px rgba(0,0,0,0.4)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      >Get Early Access</button>
    </form>
  );
}

/* ══════════════════════════ OPTION C ══════════════════════════ */

export default function OptionC() {
  useReveal();

  return (
    <div style={{ background: C.bg, color: C.text, position: "relative", zIndex: 2 }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(24px)", background: `${C.bg}dd`, borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontSize: 24, fontStyle: "italic", letterSpacing: "-0.5px" }}>kodwai</span>
        <a href="#waitlist-c" style={{
          background: C.gold, color: C.bg, fontFamily: C.fontMono, fontWeight: 700,
          fontSize: 11, padding: "10px 22px", borderRadius: 8, textDecoration: "none",
          textTransform: "uppercase", letterSpacing: 1,
        }}>Join Waitlist</a>
      </nav>

      {/* ═══ HERO — Orb as gravitational center ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "140px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Orb — positioned as a large ambient glow behind content */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -55%)",
          width: "min(90vw, 700px)", height: "min(90vw, 700px)",
          backgroundImage: "url(/images/orb-hero.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.35, filter: "blur(2px)",
          mixBlendMode: "screen",
          maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 70%)",
          pointerEvents: "none", animation: "float 8s ease-in-out infinite",
        }} />

        {/* Particle field as subtle ambient layer */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/images/particle-field.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08, mixBlendMode: "screen",
          pointerEvents: "none",
        }} />

        <div style={{ textAlign: "center", maxWidth: 720, position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 18px", borderRadius: 100,
            border: `1px solid ${C.border}`, background: `${C.bgCard}cc`,
            marginBottom: 36, animation: "fade-in-up 0.6s ease forwards",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 10px ${C.green}` }} />
            <span style={{ fontFamily: C.fontMono, fontSize: 12, color: C.textDim }}><Counter /> engineers waiting</span>
          </div>

          <h1 style={{
            fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic",
            fontSize: "clamp(44px, 7vw, 82px)", lineHeight: 1.05,
            letterSpacing: "-1px", marginBottom: 28,
            animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
          }}>
            The interview platform
            <br />
            <span style={{ fontFamily: C.fontBody, fontWeight: 400, fontStyle: "normal", color: C.textDim, fontSize: "0.55em" }}>
              that sees how engineers
            </span>
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.violet})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>actually think.</span>
          </h1>

          <p style={{
            fontFamily: C.fontBody, fontSize: "clamp(16px, 2vw, 19px)",
            lineHeight: 1.7, color: C.textDim, maxWidth: 480, margin: "0 auto 44px",
            animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
          }}>
            Real AI coding agent. Full session capture. AI-powered scoring.
            Not another chatbot in a text box.
          </p>

          <div id="waitlist-c" style={{ display: "flex", justifyContent: "center", animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0 }}>
            <WaitlistForm id="hero-c" large />
          </div>
          <p style={{ fontFamily: C.fontMono, fontSize: 11, color: C.textMuted, marginTop: 14, animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0 }}>
            Free early access · No credit card · Priority onboarding
          </p>
        </div>

        {/* Terminal — floating below, overlapping next section */}
        <div style={{
          marginTop: 64, width: "100%", maxWidth: 620, position: "relative", zIndex: 2,
          animation: "fade-in-up 1s ease 0.5s forwards", opacity: 0,
        }}>
          <Terminal />
        </div>
      </section>

      {/* ═══ LOGO STRIP ═══ */}
      <section style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: C.bgCard, padding: "36px 32px",
      }}>
        <p style={{ fontFamily: C.fontMono, fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", marginBottom: 24 }}>
          Built for teams hiring at
        </p>
        <LogoStrip filter="brightness(0) invert(1)" opacity={0.3} hoverOpacity={0.6} height={20} gap={44} />
      </section>

      {/* ═══ PROBLEM — with crystal accent ═══ */}
      <section style={{ padding: "140px 24px", position: "relative", overflow: "hidden" }}>
        {/* Crystal as a decorative accent — clipped, blended */}
        <div style={{
          position: "absolute", top: "-5%", right: "-10%",
          width: 500, height: 500,
          backgroundImage: "url(/images/crystal-data.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.12, mixBlendMode: "screen",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          pointerEvents: "none",
        }} />

        <div className="animate-in" style={{ textAlign: "center", maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <span style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase" }}>The Problem</span>
          <h2 style={{
            fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic",
            fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.15,
            letterSpacing: "-1px", margin: "20px 0 24px",
          }}>
            AI changed how engineers work.
            <br />
            <span style={{ color: C.textMuted, fontStyle: "normal", fontFamily: C.fontBody, fontWeight: 400, fontSize: "0.6em" }}>
              Interviews didn&apos;t get the memo.
            </span>
          </h2>
          <p style={{ fontFamily: C.fontBody, fontSize: 17, color: C.textDim, lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>
            Every major company now allows AI in technical interviews. But every interview platform still gives candidates a basic chat widget from 2019.
          </p>
        </div>
      </section>

      {/* ═══ VALUE PROPS ═══ */}
      <section style={{ padding: "0 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { icon: "⚡", title: "A Real Agent", sub: "Not a chatbot", desc: "Full Claude Code — terminal, file system, multi-file projects. The way engineers actually use AI.", accent: C.gold },
            { icon: "◉", title: "Complete Capture", sub: "Every interaction", desc: "Every prompt, edit, and command. A full transcript of how the candidate thinks and directs AI.", accent: C.violet },
            { icon: "△", title: "Smart Scoring", sub: "AI-powered evaluation", desc: "Automated analysis of problem decomposition, agent control, verification habits, and communication.", accent: C.cyan },
          ].map((card, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20,
              padding: "40px 32px", transition: "all 0.5s", position: "relative", overflow: "hidden",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.accent + "44"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.4)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              {/* Image texture overlay — circuit macro blended very subtly */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "url(/images/circuit-macro.jpg)",
                backgroundSize: "cover", backgroundPosition: "center",
                opacity: 0.04, mixBlendMode: "screen",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 24, display: "block", marginBottom: 20 }}>{card.icon}</span>
                <h3 style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic", fontSize: 24, marginBottom: 4, color: C.text }}>{card.title}</h3>
                <p style={{ fontFamily: C.fontMono, fontSize: 11, color: card.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>{card.sub}</p>
                <p style={{ fontFamily: C.fontBody, fontSize: 15, color: C.textDim, lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{
        padding: "120px 24px", position: "relative", overflow: "hidden",
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Mesh accent — masked and blended as a section background accent */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
          backgroundImage: "url(/images/mesh-accent.jpg)",
          backgroundSize: "cover", backgroundPosition: "top center",
          opacity: 0.06, mixBlendMode: "screen",
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="animate-in" style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{ fontFamily: C.fontMono, fontSize: 11, color: C.violet, letterSpacing: 3, textTransform: "uppercase" }}>How It Works</span>
            <h2 style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1px", marginTop: 16 }}>
              Three steps. Complete clarity.
            </h2>
          </div>

          {[
            { n: "01", title: "Set the stage", desc: "Define the challenge, configure AI access levels and time constraints. System design, debugging, greenfield — any format.", color: C.gold },
            { n: "02", title: "Watch them build", desc: "Candidate codes with a real Claude Code agent. Full terminal, full file system. You observe live — no toy sandboxes.", color: C.violet },
            { n: "03", title: "Trust the score", desc: "AI-generated evaluation with full session replay. Every decision, every prompt, every verification step — quantified.", color: C.green },
          ].map((step, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              display: "flex", gap: 28, padding: "36px 0",
              borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
            }}>
              <span style={{ fontFamily: C.fontMono, fontWeight: 700, fontSize: 13, color: step.color, minWidth: 40 }}>{step.n}</span>
              <div>
                <h3 style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic", fontSize: 24, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontFamily: C.fontBody, fontSize: 15, color: C.textDim, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "120px 24px", maxWidth: 950, margin: "0 auto" }}>
        <div className="animate-in" style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontFamily: C.fontMono, fontSize: 11, color: C.red, letterSpacing: 3, textTransform: "uppercase" }}>The Gap</span>
          <h2 style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic", fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px", marginTop: 16 }}>
            Not another chat widget.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="animate-in animate-in-delay-1" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
            <p style={{ fontFamily: C.fontMono, fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>Everyone Else</p>
            {["Chat assistant", "No file system", "Single-file editor", "No terminal", "Manual scoring", "AI usage invisible"].map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${C.border}`, fontFamily: C.fontMono, fontSize: 13, color: C.textMuted }}>
                <span style={{ color: C.red }}>—</span>{x}
              </div>
            ))}
          </div>
          <div className="animate-in animate-in-delay-2" style={{
            background: C.bgCard, border: `1px solid ${C.gold}33`, borderRadius: 20, padding: 32,
            position: "relative", boxShadow: `0 0 50px ${C.goldDim}`,
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
            <p style={{ fontFamily: C.fontMono, fontSize: 10, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>kodwai</p>
            {["Full Claude Code agent", "Multi-file projects", "Real IDE experience", "Full terminal access", "AI-powered scoring", "Complete transcript"].map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${C.gold}12`, fontFamily: C.fontMono, fontSize: 13, color: C.text }}>
                <span style={{ color: C.gold }}>✓</span>{x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section style={{
        padding: "100px 24px", textAlign: "center", position: "relative",
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Orb glow as ambient background for quote section */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, height: 400,
          backgroundImage: "url(/images/orb-hero.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08, mixBlendMode: "screen",
          maskImage: "radial-gradient(circle, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="animate-in" style={{ maxWidth: 580, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 56, fontFamily: C.fontDisplay, color: C.gold, lineHeight: 1, marginBottom: 20 }}>&ldquo;</div>
          <p style={{ fontFamily: C.fontDisplay, fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 500, fontStyle: "italic", lineHeight: 1.6, marginBottom: 24 }}>
            We let candidates use AI but had zero visibility into how they used it. We were flying blind.
          </p>
          <p style={{ fontFamily: C.fontMono, fontSize: 12, color: C.textMuted }}>— Engineering Manager, Series B (200+ engineers)</p>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { stat: "87%", label: "of FAANG now allow AI in interviews", color: C.gold },
            { stat: "3x", label: "faster decisions with AI scoring", color: C.violet },
            { stat: "0", label: "platforms with real AI agents — until now", color: C.green },
          ].map((x, i) => (
            <div key={i} style={{ padding: 32, textAlign: "center", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <div style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic", fontSize: 52, color: x.color, letterSpacing: "-2px", marginBottom: 8 }}>{x.stat}</div>
              <p style={{ fontFamily: C.fontMono, fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA — with particle atmosphere ═══ */}
      <section style={{ padding: "140px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/images/particle-field.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.1, mixBlendMode: "screen",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.goldDim} 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />
        <div className="animate-in" style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{
            fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic",
            fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1,
            letterSpacing: "-1.5px", marginBottom: 24,
          }}>
            See your candidates
            <br />
            <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.violet})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              as they truly are.
            </span>
          </h2>
          <p style={{ fontFamily: C.fontBody, fontSize: 17, color: C.textDim, maxWidth: 440, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Priority onboarding. Direct feature input. Lifetime early-adopter pricing.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}><WaitlistForm id="bottom-c" large /></div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "48px 24px", textAlign: "center" }}>
        <span style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontStyle: "italic", fontSize: 18 }}>kodwai</span>
        <p style={{ fontFamily: C.fontMono, fontSize: 11, color: C.textMuted, marginTop: 12 }}>Built for engineering teams that take AI seriously.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
          <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{ fontFamily: C.fontMono, fontSize: 12, color: C.textMuted, textDecoration: "none" }}>X / Twitter</a>
          <a href="mailto:hello@kodwai.com" style={{ fontFamily: C.fontMono, fontSize: 12, color: C.textMuted, textDecoration: "none" }}>hello@kodwai.com</a>
        </div>
        <p style={{ fontFamily: C.fontMono, fontSize: 10, color: C.textMuted, marginTop: 24, opacity: 0.4 }}>&copy; {new Date().getFullYear()} kodwai</p>
      </footer>
    </div>
  );
}
