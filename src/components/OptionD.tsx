"use client";

import { useState, useEffect, useRef } from "react";
import { allLogos } from "./CompanyLogos";

/* ══════════════════════════════════════════════════════════════
   OPTION D — "Forge"
   Warm industrial. Copper/emerald from the mesh + circuit images.
   Bricolage Grotesque + IBM Plex Mono. Brutalist-editorial hybrid.
   Images used as: textured card skins, masked hero layers,
   circular-clipped accents, blend-mode atmospheric layers.
   ══════════════════════════════════════════════════════════════ */

const D = {
  bg: "#09090b",
  bgWarm: "#0c0a08",
  bgCard: "#111110",
  bgElevated: "#19181a",
  border: "#222220",
  borderAccent: "#3d3930",
  text: "#edebe6",
  textDim: "#908a7e",
  textMuted: "#5a5548",
  copper: "#d4845a",
  copperDim: "#d4845a1a",
  emerald: "#34d399",
  emeraldDim: "#34d39915",
  cream: "#f5f0e8",
  red: "#ef6461",
  fontDisplay: "'Bricolage Grotesque', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
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

  const col = (t: string) => t === "p" ? D.copper : t === "a" ? D.emerald : t === "x" ? D.cream : D.textDim;

  return (
    <div style={{
      background: D.bg, border: `1px solid ${D.border}`, borderRadius: 4,
      overflow: "hidden", position: "relative", fontFamily: D.fontMono,
    }}>
      {/* Circuit texture as terminal skin */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/images/circuit-macro.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.03, mixBlendMode: "screen", pointerEvents: "none",
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
        background: D.bgElevated, borderBottom: `1px solid ${D.border}`, position: "relative", zIndex: 1,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: 2, background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: 2, background: "#28ca42" }} />
        <span style={{ fontSize: 10, color: D.textMuted, marginLeft: 8, letterSpacing: 1, textTransform: "uppercase" }}>kodwai / session</span>
      </div>
      <div ref={ref} style={{ padding: 18, fontSize: 12, lineHeight: 1.85, height: 280, overflowY: "auto", position: "relative", zIndex: 1 }}>
        {lines.slice(0, vl + 1).map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 8 }} />;
          const cur = i === vl;
          return (
            <div key={i} style={{ color: col(l.t), whiteSpace: "pre" }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && <span style={{ display: "inline-block", width: 7, height: 13, background: D.copper, marginLeft: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />}
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

function Counter() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let f: number; const s = performance.now();
    const tick = (now: number) => { const p = Math.min((now - s) / 2000, 1); setN(Math.floor((1 - Math.pow(1 - p, 3)) * 847)); if (p < 1) f = requestAnimationFrame(tick); };
    f = requestAnimationFrame(tick); return () => cancelAnimationFrame(f);
  }, []);
  return <span style={{ fontFamily: D.fontMono, color: D.copper, fontWeight: 600 }}>{n.toLocaleString()}+</span>;
}

function WaitlistForm({ id, large }: { id: string; large?: boolean }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  if (ok) return <div style={{ fontFamily: D.fontMono, fontSize: 14, color: D.emerald, padding: "16px 0" }}>✓ You&apos;re on the list. Check your inbox.</div>;
  return (
    <form onSubmit={e => { e.preventDefault(); if (email) setOk(true); }} style={{ display: "flex", gap: 0, width: "100%", maxWidth: large ? 520 : 460, border: `2px solid ${D.border}`, borderRadius: 4, overflow: "hidden", transition: "border-color 0.3s" }}
      onFocus={(e) => { (e.currentTarget as HTMLFormElement).style.borderColor = D.copper; }}
      onBlur={(e) => { (e.currentTarget as HTMLFormElement).style.borderColor = D.border; }}
    >
      <input id={id} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
        style={{ flex: 1, background: "transparent", border: "none", color: D.text, fontFamily: D.fontMono, fontSize: 14, padding: large ? "18px 20px" : "15px 18px", outline: "none" }}
      />
      <button type="submit" style={{
        background: D.copper, color: D.bg, fontFamily: D.fontMono, fontWeight: 700,
        fontSize: 12, padding: large ? "18px 28px" : "15px 24px",
        border: "none", cursor: "pointer", transition: "all 0.3s",
        textTransform: "uppercase", letterSpacing: 2, whiteSpace: "nowrap",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "#e09468"; }}
        onMouseLeave={e => { e.currentTarget.style.background = D.copper; }}
      >Join</button>
    </form>
  );
}

/* ══════════════════════════ OPTION D ══════════════════════════ */

export default function OptionD() {
  useReveal();

  return (
    <div style={{ background: D.bg, color: D.text, fontFamily: D.fontDisplay, position: "relative", zIndex: 2 }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(20px)", background: `${D.bg}ee`,
        borderBottom: `2px solid ${D.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, background: D.copper, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D.fontMono, fontWeight: 800, fontSize: 13, color: D.bg }}>K</div>
          <span style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>kodwai</span>
        </div>
        <a href="#waitlist-d" style={{
          background: "transparent", color: D.copper, fontFamily: D.fontMono, fontWeight: 600,
          fontSize: 11, padding: "8px 20px", border: `2px solid ${D.copper}`, borderRadius: 2,
          textDecoration: "none", textTransform: "uppercase", letterSpacing: 2, transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = D.copper; e.currentTarget.style.color = D.bg; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = D.copper; }}
        >Waitlist</a>
      </nav>

      {/* ═══ HERO — Split layout with mesh texture ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "140px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Mesh as hero atmosphere — masked to right side */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "60%",
          backgroundImage: "url(/images/mesh-accent.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.12, mixBlendMode: "screen",
          maskImage: "linear-gradient(to right, transparent 10%, black 50%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 10%, black 50%)",
          pointerEvents: "none",
        }} />

        {/* Particle field — very subtle full overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/images/particle-field.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.04, mixBlendMode: "lighten",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 640 }}>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              marginBottom: 32, animation: "fade-in-up 0.6s ease forwards",
            }}>
              <div style={{ width: 32, height: 2, background: D.copper }} />
              <span style={{ fontFamily: D.fontMono, fontSize: 11, color: D.copper, letterSpacing: 3, textTransform: "uppercase" }}>
                <Counter /> on the waitlist
              </span>
            </div>

            <h1 style={{
              fontFamily: D.fontDisplay, fontWeight: 800,
              fontSize: "clamp(40px, 6.5vw, 76px)", lineHeight: 1.0,
              letterSpacing: "-2px", marginBottom: 28,
              animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
            }}>
              Your interview
              <br />stack is
              <br /><span style={{ color: D.copper }}>obsolete.</span>
            </h1>

            <p style={{
              fontFamily: D.fontDisplay, fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.7, color: D.textDim, maxWidth: 440, marginBottom: 40,
              animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
            }}>
              Engineers use AI agents daily. Your platform gives them a chatbot.
              kodwai gives them <span style={{ color: D.copper, fontWeight: 700 }}>Claude Code</span> — a real agent with full capabilities.
            </p>

            <div id="waitlist-d" style={{ animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0 }}>
              <WaitlistForm id="hero-d" large />
            </div>
            <p style={{ fontFamily: D.fontMono, fontSize: 11, color: D.textMuted, marginTop: 14, letterSpacing: 0.5, animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0 }}>
              Free access · No card required
            </p>
          </div>

          {/* Terminal — offset right */}
          <div style={{
            marginTop: 56, maxWidth: 580,
            animation: "fade-in-up 1s ease 0.5s forwards", opacity: 0,
          }}>
            <Terminal />
          </div>
        </div>
      </section>

      {/* ═══ LOGO STRIP ═══ */}
      <section style={{
        borderTop: `2px solid ${D.border}`, borderBottom: `2px solid ${D.border}`,
        background: D.bgCard, padding: "32px 28px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 24, height: 2, background: D.textMuted }} />
            <span style={{ fontFamily: D.fontMono, fontSize: 10, color: D.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>Built for teams at</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px 40px" }}>
            {allLogos.map(({ name, Component }) => (
              <div key={name} style={{ opacity: 0.35, transition: "opacity 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.75"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.35"; }}>
                <Component color={D.textDim} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE PROBLEM — with circuit texture ═══ */}
      <section style={{ padding: "140px 24px", position: "relative", overflow: "hidden" }}>
        {/* Circuit board as a circular masked accent */}
        <div style={{
          position: "absolute", top: "10%", right: "5%",
          width: 400, height: 400,
          backgroundImage: "url(/images/circuit-macro.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.1, mixBlendMode: "screen",
          borderRadius: "50%",
          maskImage: "radial-gradient(circle, black 40%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 32, height: 2, background: D.copper }} />
            <span style={{ fontFamily: D.fontMono, fontSize: 11, color: D.copper, letterSpacing: 3, textTransform: "uppercase" }}>The Problem</span>
          </div>
          <h2 style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: 24 }}>
            Chatbots are not
            <br />AI agents.
          </h2>
          <p style={{ fontFamily: D.fontDisplay, fontSize: 18, color: D.textDim, lineHeight: 1.75, maxWidth: 520 }}>
            Every interview platform offers a chat window. Your candidates use Claude Code, Cursor, and Copilot.
            The gap between what they use and what you test is <span style={{ color: D.copper, fontWeight: 700 }}>costing you top talent.</span>
          </p>
        </div>
      </section>

      {/* ═══ THREE PILLARS — with image-textured cards ═══ */}
      <section style={{ padding: "0 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 2 }}>
          {[
            {
              n: "01", title: "Real Agent", desc: "Full Claude Code. Terminal, file system, multi-file projects. The way engineers actually work — not a chat widget.",
              img: "/images/circuit-macro.jpg", accent: D.copper,
            },
            {
              n: "02", title: "Full Capture", desc: "Every prompt, edit, and command recorded. A complete transcript of how the candidate thinks and directs AI.",
              img: "/images/mesh-accent.jpg", accent: D.emerald,
            },
            {
              n: "03", title: "AI Scoring", desc: "Automated analysis of decomposition, agent control, verification habits. Not vibes — data.",
              img: "/images/crystal-data.jpg", accent: D.cream,
            },
          ].map((card, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              background: D.bgCard, border: `1px solid ${D.border}`, borderRadius: 0,
              padding: "44px 32px", position: "relative", overflow: "hidden",
              transition: "all 0.5s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.accent + "44"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = D.border; }}
            >
              {/* Image as very subtle card texture */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${card.img})`,
                backgroundSize: "cover", backgroundPosition: "center",
                opacity: 0.04, mixBlendMode: "screen",
                pointerEvents: "none",
              }} />
              {/* Gradient overlay bottom */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
                background: `linear-gradient(to top, ${D.bgCard}, transparent)`,
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontFamily: D.fontMono, fontSize: 48, fontWeight: 800, color: card.accent, opacity: 0.15, lineHeight: 1, display: "block", marginBottom: 20 }}>{card.n}</span>
                <h3 style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", marginBottom: 14 }}>{card.title}</h3>
                <p style={{ fontFamily: D.fontDisplay, fontSize: 15, color: D.textDim, lineHeight: 1.75 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SESSION VISUAL — crystal as accent ═══ */}
      <section style={{
        padding: "120px 24px", position: "relative", overflow: "hidden",
        borderTop: `2px solid ${D.border}`, borderBottom: `2px solid ${D.border}`,
        background: D.bgWarm,
      }}>
        {/* Crystal — floating accent, clipped to a rounded shape */}
        <div style={{
          position: "absolute", top: "10%", right: "8%",
          width: 280, height: 280,
          backgroundImage: "url(/images/crystal-data.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.2, mixBlendMode: "screen",
          borderRadius: 24,
          maskImage: "radial-gradient(circle, black 50%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle, black 50%, transparent 75%)",
          pointerEvents: "none", animation: "float 8s ease-in-out infinite",
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="animate-in" style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{ width: 32, height: 2, background: D.emerald }} />
              <span style={{ fontFamily: D.fontMono, fontSize: 11, color: D.emerald, letterSpacing: 3, textTransform: "uppercase" }}>How It Works</span>
            </div>
            <h2 style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1px" }}>
              Configure. Observe. Score.
            </h2>
          </div>

          {[
            { title: "Set up", desc: "Define the challenge. System design, debugging, greenfield — configure AI access and time limits.", color: D.copper },
            { title: "Observe live", desc: "Candidate works with Claude Code. You watch in real-time. Full terminal, full IDE, no toy sandbox.", color: D.emerald },
            { title: "Review transcript", desc: "AI-generated evaluation. Every prompt, every decision, full replay. Scoring you can defend in a debrief.", color: D.cream },
          ].map((step, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              display: "flex", gap: 24, padding: "28px 0",
              borderTop: `1px solid ${D.border}`,
            }}>
              <div style={{ width: 4, minHeight: 40, background: step.color, borderRadius: 2, flexShrink: 0, marginTop: 4 }} />
              <div>
                <h3 style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontFamily: D.fontDisplay, fontSize: 15, color: D.textDim, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "120px 24px", maxWidth: 950, margin: "0 auto" }}>
        <div className="animate-in" style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 32, height: 2, background: D.red }} />
            <span style={{ fontFamily: D.fontMono, fontSize: 11, color: D.red, letterSpacing: 3, textTransform: "uppercase" }}>vs. Legacy Platforms</span>
          </div>
          <h2 style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px" }}>
            This is not an upgrade.
            <br /><span style={{ color: D.textMuted }}>It&apos;s a replacement.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div className="animate-in animate-in-delay-1" style={{ background: D.bgCard, border: `1px solid ${D.border}`, borderRight: "none", padding: 32 }}>
            <p style={{ fontFamily: D.fontMono, fontSize: 10, color: D.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>Legacy</p>
            {["Chat widget", "No filesystem", "Toy editor", "No terminal", "Manual review", "AI = invisible"].map((x, i) => (
              <div key={i} style={{ fontFamily: D.fontMono, fontSize: 13, color: D.textMuted, padding: "10px 0", borderBottom: `1px solid ${D.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: D.red, fontSize: 10 }}>✕</span>{x}
              </div>
            ))}
          </div>
          <div className="animate-in animate-in-delay-2" style={{ background: D.bgCard, border: `2px solid ${D.copper}44`, padding: 32, position: "relative" }}>
            <div style={{ position: "absolute", top: -2, left: -2, right: -2, height: 3, background: D.copper }} />
            <p style={{ fontFamily: D.fontMono, fontSize: 10, color: D.copper, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>kodwai</p>
            {["Claude Code agent", "Full multi-file", "Real IDE", "Full terminal", "AI scoring", "Full transcript"].map((x, i) => (
              <div key={i} style={{ fontFamily: D.fontMono, fontSize: 13, color: D.text, padding: "10px 0", borderBottom: `1px solid ${D.copper}15`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: D.copper }}>→</span>{x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section style={{ padding: "80px 24px", borderTop: `2px solid ${D.border}`, borderBottom: `2px solid ${D.border}`, background: D.bgWarm }}>
        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ width: 4, background: D.copper, borderRadius: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: D.fontDisplay, fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 500, lineHeight: 1.6, marginBottom: 20 }}>
                &ldquo;We allowed AI in interviews but were blind to how candidates actually used it. That changed everything.&rdquo;
              </p>
              <p style={{ fontFamily: D.fontMono, fontSize: 12, color: D.textMuted }}>— Engineering Manager, 200+ engineers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {[
            { stat: "87%", label: "of FAANG allow AI in interviews", accent: D.copper },
            { stat: "3×", label: "faster hiring with AI scoring", accent: D.emerald },
            { stat: "0", label: "real AI agent platforms — until now", accent: D.cream },
          ].map((x, i) => (
            <div key={i} style={{ padding: "40px 28px", background: D.bgCard, border: `1px solid ${D.border}`, textAlign: "center" }}>
              <div style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: 52, letterSpacing: "-3px", color: x.accent, marginBottom: 8 }}>{x.stat}</div>
              <p style={{ fontFamily: D.fontMono, fontSize: 11, color: D.textDim, lineHeight: 1.5 }}>{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA — orb as ambient glow ═══ */}
      <section style={{ padding: "140px 24px", position: "relative", overflow: "hidden" }}>
        {/* Orb — large, very dim, atmospheric */}
        <div style={{
          position: "absolute", top: "40%", left: "60%", transform: "translate(-50%, -50%)",
          width: 600, height: 600,
          backgroundImage: "url(/images/orb-hero.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08, mixBlendMode: "screen",
          maskImage: "radial-gradient(circle, black 30%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div className="animate-in" style={{ maxWidth: 600, position: "relative", zIndex: 2, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: D.fontDisplay, fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05,
            letterSpacing: "-2px", marginBottom: 20,
          }}>
            Stop testing the past.
            <br /><span style={{ color: D.copper }}>Hire for the future.</span>
          </h2>
          <p style={{ fontFamily: D.fontDisplay, fontSize: 17, color: D.textDim, lineHeight: 1.7, maxWidth: 440, marginBottom: 36 }}>
            Early access includes priority onboarding, feature input, and lifetime pricing.
          </p>
          <WaitlistForm id="bottom-d" large />
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `2px solid ${D.border}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, background: D.copper, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D.fontMono, fontWeight: 800, fontSize: 11, color: D.bg }}>K</div>
            <span style={{ fontFamily: D.fontDisplay, fontWeight: 800, fontSize: 16 }}>kodwai</span>
            <span style={{ fontFamily: D.fontMono, fontSize: 11, color: D.textMuted, marginLeft: 8 }}>For teams that take AI seriously.</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{ fontFamily: D.fontMono, fontSize: 12, color: D.textMuted, textDecoration: "none" }}>X</a>
            <a href="mailto:hello@kodwai.com" style={{ fontFamily: D.fontMono, fontSize: 12, color: D.textMuted, textDecoration: "none" }}>Email</a>
            <span style={{ fontFamily: D.fontMono, fontSize: 11, color: D.textMuted, opacity: 0.4 }}>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
