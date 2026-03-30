"use client";

import { useState, useEffect, useRef } from "react";
import LogoStrip from "./LogoStrip";

/* ══════════════════════════════════════════════════════════════
   OPTION F — "Neon Arcade"
   MAXIMALIST retro-futuristic. Cyberpunk energy.
   Hot pink + electric lime + deep purple.
   CRT scanlines. Glitch typography. LOUD and memorable.
   Press Start 2P + Anybody + Space Mono.
   ══════════════════════════════════════════════════════════════ */

const F = {
  bg: "#0d001a",
  bgCard: "#150025",
  text: "#ede8ff",
  accent1: "#ff2d78",
  accent2: "#a3ff12",
  muted: "#5a4d70",
  fontPixel: "'Press Start 2P', cursive",
  fontDisplay: "'Anybody', sans-serif",
  fontMono: "'Space Mono', monospace",
};

/* ─── Keyframes injected once ─── */
const STYLE_ID = "__optionf_keyframes__";
function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes neonBorderSpin {
      0% { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes crtFlicker {
      0%,97%,100% { opacity: 1; }
      97.5% { opacity: 0.85; }
      98% { opacity: 1; }
      98.5% { opacity: 0.9; }
    }
    @keyframes glitchShift {
      0%,90%,100% { transform: translate(0); }
      92% { transform: translate(-2px, 1px); }
      94% { transform: translate(2px, -1px); }
      96% { transform: translate(-1px, 0); }
    }
    @keyframes float { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.05); } }
    @keyframes pulseGlow { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .animate-in.visible { opacity: 1; transform: translateY(0); }
    .animate-in-delay-1 { transition-delay: 0.12s; }
    .animate-in-delay-2 { transition-delay: 0.24s; }
    .animate-in-delay-3 { transition-delay: 0.36s; }
  `;
  document.head.appendChild(s);
}

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

  const col = (t: string) =>
    t === "p" ? F.accent1 : t === "a" ? F.accent2 : t === "x" ? "#ffffff" : "#8866aa";

  return (
    <div style={{
      background: F.bg, border: `1px solid ${F.accent1}33`,
      borderRadius: 4, overflow: "hidden", position: "relative",
      fontFamily: F.fontMono, boxShadow: `0 0 40px ${F.accent1}15, inset 0 0 60px ${F.bg}`,
    }}>
      {/* circuit texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/images/circuit-macro.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.04, mixBlendMode: "screen",
        filter: "hue-rotate(280deg)",
        pointerEvents: "none",
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
        background: F.bgCard, borderBottom: `1px solid ${F.accent1}33`,
        position: "relative", zIndex: 1,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: F.accent1 }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: F.accent2 }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: F.muted }} />
        <span style={{ fontSize: 9, color: F.muted, marginLeft: 8, letterSpacing: 2, textTransform: "uppercase", fontFamily: F.fontPixel }}>kodwai / session</span>
      </div>
      <div ref={ref} style={{ padding: 18, fontSize: 12, lineHeight: 1.85, height: 280, overflowY: "auto", position: "relative", zIndex: 1 }}>
        {lines.slice(0, vl + 1).map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 8 }} />;
          const cur = i === vl;
          return (
            <div key={i} style={{ color: col(l.t), whiteSpace: "pre", textShadow: l.t === "x" ? `0 0 8px ${F.accent2}88` : "none" }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && <span style={{ display: "inline-block", width: 7, height: 13, background: F.accent1, marginLeft: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />}
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
    injectStyles();
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: 0.08 });
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
  return <span style={{ fontFamily: F.fontMono, color: F.accent2, fontWeight: 600, textShadow: `0 0 10px ${F.accent2}66` }}>{n.toLocaleString()}+</span>;
}

/* ─── Neon-bordered card wrapper ─── */
function NeonCard({ children, accent = F.accent1, style = {} }: { children: React.ReactNode; accent?: string; style?: React.CSSProperties }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", padding: 2, borderRadius: 6,
        background: hover
          ? `linear-gradient(90deg, ${accent}, ${F.accent2}, ${accent}, ${F.accent2})`
          : `linear-gradient(90deg, ${accent}44, ${F.accent2}22, ${accent}44)`,
        backgroundSize: "300% 100%",
        animation: hover ? "neonBorderSpin 2s linear infinite" : "none",
        transition: "all 0.4s",
        transform: hover ? "scale(1.02)" : "scale(1)",
        boxShadow: hover ? `0 0 30px ${accent}33, 0 0 60px ${accent}11` : "none",
      }}
    >
      <div style={{
        background: F.bgCard, borderRadius: 4, overflow: "hidden",
        position: "relative", height: "100%", ...style,
      }}>
        {/* Circuit texture inside card */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/images/circuit-macro.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.03, mixBlendMode: "screen",
          filter: "hue-rotate(280deg)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function WaitlistForm({ id, large }: { id: string; large?: boolean }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [focused, setFocused] = useState(false);
  if (ok) return <div style={{ fontFamily: F.fontPixel, fontSize: 10, color: F.accent2, padding: "16px 0", textShadow: `0 0 10px ${F.accent2}66` }}>PLAYER REGISTERED. CHECK INBOX.</div>;
  return (
    <form onSubmit={e => { e.preventDefault(); if (email) setOk(true); }}
      style={{
        display: "flex", gap: 0, width: "100%", maxWidth: large ? 540 : 460,
        border: `2px solid ${focused ? F.accent1 : F.muted}`,
        borderRadius: 4, overflow: "hidden", transition: "all 0.4s",
        boxShadow: focused ? `0 0 20px ${F.accent1}44, 0 0 40px ${F.accent1}22, inset 0 0 20px ${F.accent1}11` : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <input id={id} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
        style={{ flex: 1, background: "transparent", border: "none", color: F.text, fontFamily: F.fontMono, fontSize: 14, padding: large ? "18px 20px" : "15px 18px", outline: "none" }}
      />
      <button type="submit" style={{
        background: F.accent1, color: "#fff", fontFamily: F.fontPixel,
        fontSize: 9, padding: large ? "18px 24px" : "15px 20px",
        border: "none", cursor: "pointer", transition: "all 0.3s",
        letterSpacing: 1, whiteSpace: "nowrap",
        textShadow: `0 0 8px ${F.accent1}`,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "#ff5599"; e.currentTarget.style.boxShadow = `0 0 20px ${F.accent1}66`; }}
        onMouseLeave={e => { e.currentTarget.style.background = F.accent1; e.currentTarget.style.boxShadow = "none"; }}
      >JOIN</button>
    </form>
  );
}

/* ══════════════════════════ OPTION F ══════════════════════════ */

export default function OptionF() {
  useReveal();

  return (
    <div style={{ background: F.bg, color: F.text, fontFamily: F.fontDisplay, position: "relative", zIndex: 2 }}>

      {/* ═══ CRT SCANLINE OVERLAY ═══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        mixBlendMode: "multiply",
      }} />

      {/* ═══ PARTICLE FIELD OVERLAY (green-tinted) ═══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: "url(/images/particle-field.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.06, mixBlendMode: "screen",
        filter: "hue-rotate(80deg) saturate(2)",
      }} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
        padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(20px)", background: `${F.bg}dd`,
        borderBottom: `1px solid ${F.accent1}33`,
        animation: "crtFlicker 4s ease-in-out infinite",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Pixel-art K logo */}
          <div style={{
            width: 28, height: 28, background: F.accent1, borderRadius: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.fontPixel, fontWeight: 800, fontSize: 11, color: "#fff",
            boxShadow: `0 0 12px ${F.accent1}66`,
            imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
          }}>K</div>
          <span style={{ fontFamily: F.fontDisplay, fontWeight: 900, fontSize: 22, letterSpacing: 2, textTransform: "uppercase" }}>kodwai</span>
        </div>
        <a href="#waitlist-f" style={{
          background: "transparent", color: F.accent1, fontFamily: F.fontPixel,
          fontSize: 8, padding: "10px 20px", border: `2px solid ${F.accent1}`,
          borderRadius: 2, textDecoration: "none", letterSpacing: 2,
          transition: "all 0.3s", textShadow: `0 0 8px ${F.accent1}88`,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = F.accent1; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = `0 0 20px ${F.accent1}66`; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = F.accent1; e.currentTarget.style.boxShadow = "none"; }}
        >WAITLIST</a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "160px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Orb hero — huge pink/magenta ambient glow */}
        <div style={{
          position: "absolute", top: "30%", left: "55%", transform: "translate(-50%, -50%)",
          width: 900, height: 900,
          backgroundImage: "url(/images/orb-hero.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.2, mixBlendMode: "screen",
          filter: "hue-rotate(310deg) saturate(2.5)",
          maskImage: "radial-gradient(circle, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 60%)",
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 3 }}>
          <div style={{ maxWidth: 700 }}>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              marginBottom: 36, animation: "fade-in-up 0.6s ease forwards",
            }}>
              <div style={{ width: 40, height: 2, background: F.accent2, boxShadow: `0 0 10px ${F.accent2}66` }} />
              <span style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.accent2, letterSpacing: 3, textShadow: `0 0 8px ${F.accent2}44` }}>
                <Counter /> ON THE WAITLIST
              </span>
            </div>

            <h1 style={{
              fontFamily: F.fontDisplay, fontWeight: 900,
              fontSize: "clamp(44px, 7vw, 88px)", lineHeight: 0.95,
              letterSpacing: 2, marginBottom: 32, textTransform: "uppercase",
              animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
            }}>
              Your interview
              <br />stack is
              <br /><span style={{
                color: F.accent1,
                textShadow: `0 0 20px ${F.accent1}88, 0 0 40px ${F.accent1}44, 0 0 80px ${F.accent1}22`,
              }}>obsolete.</span>
            </h1>

            <p style={{
              fontFamily: F.fontMono, fontSize: "clamp(14px, 1.8vw, 17px)",
              lineHeight: 1.8, color: `${F.text}bb`, maxWidth: 480, marginBottom: 44,
              animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
            }}>
              Engineers use AI agents daily. Your platform gives them a chatbot.
              kodwai gives them <span style={{ color: F.accent1, fontWeight: 700 }}>Claude Code</span> — a real agent with full capabilities.
            </p>

            <div id="waitlist-f" style={{ animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0 }}>
              <WaitlistForm id="hero-f" large />
            </div>
            <p style={{ fontFamily: F.fontPixel, fontSize: 7, color: F.muted, marginTop: 16, letterSpacing: 2, animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0 }}>
              FREE ACCESS &middot; NO CREDIT CARD
            </p>
          </div>

          {/* Terminal */}
          <div style={{
            marginTop: 64, maxWidth: 600,
            animation: "fade-in-up 1s ease 0.5s forwards", opacity: 0,
          }}>
            <Terminal />
          </div>
        </div>
      </section>

      {/* ═══ LOGO STRIP ═══ */}
      <section style={{
        borderTop: `1px solid ${F.accent1}22`, borderBottom: `1px solid ${F.accent1}22`,
        background: F.bgCard, padding: "32px 28px", position: "relative", zIndex: 3,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 24, height: 2, background: F.muted }} />
            <span style={{ fontFamily: F.fontPixel, fontSize: 7, color: F.muted, letterSpacing: 3 }}>BUILT FOR TEAMS AT</span>
          </div>
          <LogoStrip filter="brightness(0) invert(1)" opacity={0.2} hoverOpacity={0.5} height={20} gap={40} />
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section style={{ padding: "140px 24px", position: "relative", overflow: "hidden", zIndex: 3 }}>
        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 40, height: 2, background: F.accent1, boxShadow: `0 0 10px ${F.accent1}44` }} />
            <span style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.accent1, letterSpacing: 3, textShadow: `0 0 8px ${F.accent1}44` }}>THE PROBLEM</span>
          </div>
          <h2 style={{
            fontFamily: F.fontDisplay, fontWeight: 900,
            fontSize: "clamp(32px, 5.5vw, 60px)", lineHeight: 1.0,
            letterSpacing: 1, marginBottom: 28, textTransform: "uppercase",
            animation: "glitchShift 6s ease-in-out infinite",
          }}>
            Chatbots are not
            <br /><span style={{ color: F.accent1, textShadow: `0 0 20px ${F.accent1}66` }}>AI agents.</span>
          </h2>
          <p style={{ fontFamily: F.fontMono, fontSize: 16, color: `${F.text}aa`, lineHeight: 1.8, maxWidth: 520 }}>
            Every interview platform offers a chat window. Your candidates use Claude Code, Cursor, and Copilot.
            The gap between what they use and what you test is{" "}
            <span style={{ color: F.accent1, fontWeight: 700 }}>costing you top talent.</span>
          </p>
        </div>
      </section>

      {/* ═══ VALUE PROPS — Neon bordered cards ═══ */}
      <section style={{ padding: "0 24px 120px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 3 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            {
              n: "01", title: "Real Agent", desc: "Full Claude Code. Terminal, file system, multi-file projects. The way engineers actually work — not a chat widget.",
              accent: F.accent1,
            },
            {
              n: "02", title: "Full Capture", desc: "Every prompt, edit, and command recorded. A complete transcript of how the candidate thinks and directs AI.",
              accent: F.accent2,
            },
            {
              n: "03", title: "AI Scoring", desc: "Automated analysis of decomposition, agent control, verification habits. Not vibes — data.",
              accent: "#ffffff",
            },
          ].map((card, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`}>
              <NeonCard accent={card.accent}>
                <div style={{ padding: "44px 32px" }}>
                  <span style={{
                    fontFamily: F.fontPixel, fontSize: 28, fontWeight: 800, color: card.accent,
                    opacity: 0.2, lineHeight: 1, display: "block", marginBottom: 20,
                    textShadow: `0 0 20px ${card.accent}33`,
                  }}>{card.n}</span>
                  <h3 style={{
                    fontFamily: F.fontDisplay, fontWeight: 900, fontSize: 28,
                    letterSpacing: 1, marginBottom: 14, textTransform: "uppercase",
                  }}>{card.title}</h3>
                  <p style={{ fontFamily: F.fontMono, fontSize: 13, color: `${F.text}99`, lineHeight: 1.8 }}>{card.desc}</p>
                </div>
              </NeonCard>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{
        padding: "120px 24px", position: "relative", overflow: "hidden",
        borderTop: `1px solid ${F.accent2}22`, borderBottom: `1px solid ${F.accent2}22`,
        background: F.bgCard, zIndex: 3,
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="animate-in" style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{ width: 40, height: 2, background: F.accent2, boxShadow: `0 0 10px ${F.accent2}44` }} />
              <span style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.accent2, letterSpacing: 3, textShadow: `0 0 8px ${F.accent2}44` }}>HOW IT WORKS</span>
            </div>
            <h2 style={{
              fontFamily: F.fontDisplay, fontWeight: 900,
              fontSize: "clamp(30px, 4.5vw, 52px)", letterSpacing: 1, textTransform: "uppercase",
            }}>
              Configure. Observe. Score.
            </h2>
          </div>

          {[
            { title: "Set up", desc: "Define the challenge. System design, debugging, greenfield — configure AI access and time limits.", color: F.accent1 },
            { title: "Observe live", desc: "Candidate works with Claude Code. You watch in real-time. Full terminal, full IDE, no toy sandbox.", color: F.accent2 },
            { title: "Review transcript", desc: "AI-generated evaluation. Every prompt, every decision, full replay. Scoring you can defend in a debrief.", color: "#ffffff" },
          ].map((step, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              display: "flex", gap: 24, padding: "28px 0",
              borderTop: `1px solid ${F.muted}33`,
            }}>
              <div style={{
                width: 4, minHeight: 40, background: step.color, borderRadius: 2, flexShrink: 0, marginTop: 4,
                boxShadow: `0 0 10px ${step.color}44`,
              }} />
              <div>
                <h3 style={{ fontFamily: F.fontDisplay, fontWeight: 900, fontSize: 22, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{step.title}</h3>
                <p style={{ fontFamily: F.fontMono, fontSize: 14, color: `${F.text}99`, lineHeight: 1.8 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "120px 24px", maxWidth: 950, margin: "0 auto", position: "relative", zIndex: 3 }}>
        <div className="animate-in" style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 40, height: 2, background: F.accent1, boxShadow: `0 0 10px ${F.accent1}44` }} />
            <span style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.accent1, letterSpacing: 3, textShadow: `0 0 8px ${F.accent1}44` }}>VS. LEGACY</span>
          </div>
          <h2 style={{
            fontFamily: F.fontDisplay, fontWeight: 900,
            fontSize: "clamp(30px, 4.5vw, 48px)", letterSpacing: 1, textTransform: "uppercase",
          }}>
            Not an upgrade.
            <br /><span style={{ color: F.muted }}>A replacement.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* Legacy column — dim */}
          <div className="animate-in animate-in-delay-1" style={{
            background: `${F.bgCard}88`, border: `1px solid ${F.muted}33`, borderRight: "none", padding: 32,
          }}>
            <p style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.muted, letterSpacing: 3, marginBottom: 24, opacity: 0.6 }}>LEGACY</p>
            {["Chat widget", "No filesystem", "Toy editor", "No terminal", "Manual review", "AI = invisible"].map((x, i) => (
              <div key={i} style={{
                fontFamily: F.fontMono, fontSize: 13, color: F.muted, padding: "10px 0",
                borderBottom: `1px solid ${F.muted}22`, display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ color: F.accent1, fontSize: 10, opacity: 0.6 }}>✕</span>{x}
              </div>
            ))}
          </div>
          {/* kodwai column — GLOWS */}
          <div className="animate-in animate-in-delay-2" style={{
            background: F.bgCard, border: `2px solid ${F.accent1}66`, padding: 32, position: "relative",
            boxShadow: `0 0 40px ${F.accent1}22, inset 0 0 40px ${F.accent1}08`,
          }}>
            <div style={{ position: "absolute", top: -2, left: -2, right: -2, height: 3, background: `linear-gradient(90deg, ${F.accent1}, ${F.accent2})`, boxShadow: `0 0 20px ${F.accent1}66` }} />
            <p style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.accent1, letterSpacing: 3, marginBottom: 24, textShadow: `0 0 10px ${F.accent1}66` }}>KODWAI</p>
            {["Claude Code agent", "Full multi-file", "Real IDE", "Full terminal", "AI scoring", "Full transcript"].map((x, i) => (
              <div key={i} style={{
                fontFamily: F.fontMono, fontSize: 13, color: F.text, padding: "10px 0",
                borderBottom: `1px solid ${F.accent1}15`, display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ color: F.accent2, textShadow: `0 0 6px ${F.accent2}88` }}>→</span>{x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section style={{
        padding: "80px 24px", borderTop: `1px solid ${F.accent1}22`, borderBottom: `1px solid ${F.accent1}22`,
        background: F.bgCard, position: "relative", zIndex: 3,
      }}>
        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ width: 4, background: `linear-gradient(${F.accent1}, ${F.accent2})`, borderRadius: 2, flexShrink: 0, boxShadow: `0 0 12px ${F.accent1}44` }} />
            <div>
              <p style={{ fontFamily: F.fontDisplay, fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                &ldquo;We allowed AI in interviews but were blind to how candidates actually used it. That changed everything.&rdquo;
              </p>
              <p style={{ fontFamily: F.fontPixel, fontSize: 7, color: F.muted, letterSpacing: 2 }}>— ENGINEERING MANAGER, 200+ ENGINEERS</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS — Huge neon numbers ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 3 }}>
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { stat: "87%", label: "of FAANG allow AI in interviews", accent: F.accent1 },
            { stat: "3×", label: "faster hiring with AI scoring", accent: F.accent2 },
            { stat: "0", label: "real AI agent platforms — until now", accent: "#ffffff" },
          ].map((x, i) => (
            <NeonCard key={i} accent={x.accent}>
              <div style={{ padding: "44px 28px", textAlign: "center" }}>
                <div style={{
                  fontFamily: F.fontDisplay, fontWeight: 900, fontSize: 64,
                  letterSpacing: 2, color: x.accent, marginBottom: 12,
                  textShadow: `0 0 20px ${x.accent}88, 0 0 40px ${x.accent}44, 0 0 80px ${x.accent}22`,
                  animation: "pulseGlow 3s ease-in-out infinite",
                }}>{x.stat}</div>
                <p style={{ fontFamily: F.fontPixel, fontSize: 7, color: F.muted, lineHeight: 1.8, letterSpacing: 1 }}>{x.label.toUpperCase()}</p>
              </div>
            </NeonCard>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA — "INSERT COIN" vibes ═══ */}
      <section style={{
        padding: "160px 24px", position: "relative", overflow: "hidden", zIndex: 3,
      }}>
        {/* Orb ambient glow */}
        <div style={{
          position: "absolute", top: "40%", left: "55%", transform: "translate(-50%, -50%)",
          width: 700, height: 700,
          backgroundImage: "url(/images/orb-hero.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.15, mixBlendMode: "screen",
          filter: "hue-rotate(310deg) saturate(2)",
          maskImage: "radial-gradient(circle, black 25%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 25%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div className="animate-in" style={{ maxWidth: 620, position: "relative", zIndex: 2, margin: "0 auto", textAlign: "center" }}>
          {/* Easter egg */}
          <div style={{
            fontFamily: F.fontPixel, fontSize: 9, color: F.accent2, letterSpacing: 4,
            marginBottom: 40, animation: "blink 1.5s step-end infinite",
            textShadow: `0 0 10px ${F.accent2}66`,
          }}>
            PLAYER 1 READY
          </div>

          <h2 style={{
            fontFamily: F.fontDisplay, fontWeight: 900,
            fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.0,
            letterSpacing: 2, marginBottom: 24, textTransform: "uppercase",
          }}>
            Stop testing the past.
            <br /><span style={{
              color: F.accent1,
              textShadow: `0 0 20px ${F.accent1}88, 0 0 40px ${F.accent1}44, 0 0 80px ${F.accent1}22`,
            }}>Hire for the future.</span>
          </h2>
          <p style={{ fontFamily: F.fontMono, fontSize: 15, color: `${F.text}99`, lineHeight: 1.8, maxWidth: 460, marginBottom: 40, margin: "0 auto 40px" }}>
            Early access includes priority onboarding, feature input, and lifetime pricing.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WaitlistForm id="bottom-f" large />
          </div>

          {/* INSERT COIN easter egg */}
          <p style={{
            fontFamily: F.fontPixel, fontSize: 7, color: F.muted, marginTop: 32,
            letterSpacing: 3, opacity: 0.5,
          }}>
            INSERT COIN TO CONTINUE
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${F.accent1}22`, padding: "40px 24px", position: "relative", zIndex: 3 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 22, height: 22, background: F.accent1, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: F.fontPixel, fontWeight: 800, fontSize: 9, color: "#fff",
              boxShadow: `0 0 8px ${F.accent1}44`,
            }}>K</div>
            <span style={{ fontFamily: F.fontDisplay, fontWeight: 900, fontSize: 18, letterSpacing: 2, textTransform: "uppercase" }}>kodwai</span>
            <span style={{ fontFamily: F.fontPixel, fontSize: 7, color: F.muted, marginLeft: 8, letterSpacing: 1 }}>GAME ON.</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.muted, textDecoration: "none", letterSpacing: 1 }}>X</a>
            <a href="mailto:hello@kodwai.com" style={{ fontFamily: F.fontPixel, fontSize: 8, color: F.muted, textDecoration: "none", letterSpacing: 1 }}>EMAIL</a>
            <span style={{ fontFamily: F.fontPixel, fontSize: 7, color: F.muted, opacity: 0.4 }}>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
