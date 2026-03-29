"use client";

import { useState, useEffect, useRef } from "react";
import { allLogos } from "./CompanyLogos";

/* ══════════════════════════════════════════════════════════════
   OPTION H — "Midnight Garden"
   Dark with ORGANIC/NATURAL feel. Deep forest greens + warm
   candlelight. Soft rounded shapes. Like a luxury botanical
   brand meets developer tools. Fraunces italic + Inconsolata.
   ══════════════════════════════════════════════════════════════ */

const H = {
  bg: "#0b1210",
  bgCard: "#0f1a16",
  bgElevated: "#142019",
  text: "#e8e0d4",
  textDim: "#a89e8e",
  textMuted: "#4a5c52",
  accent: "#7cb68e",
  accent2: "#d4a56a",
  muted: "#4a5c52",
  border: "#1e2e27",
  red: "#c47a6a",
  fontDisplay: "'Fraunces', serif",
  fontMono: "'Inconsolata', monospace",
};

/* ─── Terminal ─── */
const lines = [
  { t: "p", s: "$ kodwai start --challenge system-design" },
  { t: "s", s: "  Session live -- agent connected" },
  { t: "s", s: "  Rate limiter -- 10M req/s" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "architect a solution"' },
  { t: "a", s: "Sliding-window rate limiter with Redis." },
  { t: "a", s: "Let me scaffold the service now..." },
  { t: "b", s: "" },
  { t: "s", s: "  sliding-window.ts created" },
  { t: "s", s: "  redis-cluster.ts created" },
  { t: "s", s: "  12/12 tests green" },
  { t: "b", s: "" },
  { t: "x", s: "  Score: 94 / 100" },
  { t: "x", s: "   Decomposition  --------..  87" },
  { t: "x", s: "   Agent mastery  ---------.  92" },
  { t: "x", s: "   Verification   ----------  98" },
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

  const col = (t: string) => t === "p" ? H.accent : t === "a" ? H.accent2 : t === "x" ? H.text : "#5a7a66";

  return (
    <div style={{
      background: H.bg, border: `1px solid ${H.border}`, borderRadius: 16,
      overflow: "hidden", position: "relative", fontFamily: H.fontMono,
      boxShadow: `0 8px 40px ${H.bg}88, 0 0 0 1px ${H.border}`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "14px 18px",
        background: H.bgElevated, borderBottom: `1px solid ${H.border}`, position: "relative", zIndex: 1,
      }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#c47a6a" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: H.accent2 }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: H.accent }} />
        <span style={{ fontSize: 11, color: H.textMuted, marginLeft: 10, fontStyle: "italic" }}>kodwai session</span>
      </div>
      <div ref={ref} style={{ padding: 20, fontSize: 13, lineHeight: 1.85, height: 290, overflowY: "auto", position: "relative", zIndex: 1 }}>
        {lines.slice(0, vl + 1).map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 8 }} />;
          const cur = i === vl;
          return (
            <div key={i} style={{ color: col(l.t), whiteSpace: "pre" }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && <span style={{ display: "inline-block", width: 7, height: 14, background: H.accent, marginLeft: 1, verticalAlign: "text-bottom", borderRadius: 1, animation: "blink 1s step-end infinite" }} />}
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
  return <span style={{ fontFamily: H.fontMono, color: H.accent2, fontWeight: 600 }}>{n.toLocaleString()}+</span>;
}

/* ─── Leaf icon (CSS-only) ─── */
function Leaf({ size = 14, color = H.accent }: { size?: number; color?: string }) {
  return (
    <span style={{ display: "inline-block", position: "relative", width: size, height: size }}>
      <span style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: size * 0.5, height: size * 0.5, borderRadius: "50%", background: color,
      }} />
      <span style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%) rotate(45deg)",
        width: size * 0.5, height: size * 0.5, borderRadius: 2, background: color,
      }} />
    </span>
  );
}

/* ─── Organic decorative blob (CSS circle) ─── */
function Blob({ top, left, right, bottom, size = 300, color = H.accent, opacity = 0.03 }: {
  top?: string; left?: string; right?: string; bottom?: string; size?: number; color?: string; opacity?: number;
}) {
  return (
    <div style={{
      position: "absolute", top, left, right, bottom,
      width: size, height: size * 1.3,
      borderRadius: "50%",
      background: `radial-gradient(ellipse, ${color}, transparent 70%)`,
      opacity, pointerEvents: "none",
    }} />
  );
}

function WaitlistForm({ id, large }: { id: string; large?: boolean }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  if (ok) return <div style={{ fontFamily: H.fontMono, fontSize: 14, color: H.accent, padding: "16px 0" }}>You&apos;re on the list. Check your inbox.</div>;
  return (
    <form onSubmit={e => { e.preventDefault(); if (email) setOk(true); }}
      style={{
        display: "flex", gap: 0, width: "100%", maxWidth: large ? 520 : 460,
        border: `1.5px solid ${H.border}`, borderRadius: 16, overflow: "hidden",
        transition: "border-color 0.4s, box-shadow 0.4s",
        boxShadow: `0 2px 20px transparent`,
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLFormElement).style.borderColor = H.accent;
        (e.currentTarget as HTMLFormElement).style.boxShadow = `0 2px 24px ${H.accent}20`;
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLFormElement).style.borderColor = H.border;
        (e.currentTarget as HTMLFormElement).style.boxShadow = `0 2px 20px transparent`;
      }}
    >
      <input id={id} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
        style={{ flex: 1, background: "transparent", border: "none", color: H.text, fontFamily: H.fontMono, fontSize: 14, padding: large ? "18px 22px" : "15px 18px", outline: "none" }}
      />
      <button type="submit" style={{
        background: H.accent2, color: H.bg, fontFamily: H.fontDisplay, fontWeight: 600,
        fontStyle: "italic", fontSize: 14, padding: large ? "18px 32px" : "15px 24px",
        border: "none", cursor: "pointer", transition: "all 0.3s",
        borderRadius: "0 14px 14px 0", whiteSpace: "nowrap",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "#e0b47a"; }}
        onMouseLeave={e => { e.currentTarget.style.background = H.accent2; }}
      >Join</button>
    </form>
  );
}

/* ══════════════════════════ OPTION H ══════════════════════════ */

export default function OptionH() {
  useReveal();

  return (
    <div style={{ background: H.bg, color: H.text, fontFamily: H.fontDisplay, position: "relative", zIndex: 2, overflowX: "hidden" }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(24px)", background: `${H.bg}dd`,
        borderBottom: `1px solid ${H.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Leaf size={18} color={H.accent} />
          <span style={{ fontFamily: H.fontDisplay, fontWeight: 600, fontSize: 22, fontStyle: "italic", letterSpacing: "-0.5px", color: H.text }}>
            kodwai
          </span>
        </div>
        <a href="#waitlist-h" style={{
          background: "transparent", color: H.accent, fontFamily: H.fontDisplay, fontWeight: 500,
          fontStyle: "italic", fontSize: 14, padding: "9px 22px", border: `1.5px solid ${H.accent}55`,
          borderRadius: 24, textDecoration: "none", transition: "all 0.4s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = `${H.accent}15`; e.currentTarget.style.borderColor = H.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${H.accent}55`; }}
        >Join Waitlist</a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "140px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Orb-hero.jpg as glowing plant spore ambient glow */}
        <div style={{
          position: "absolute", top: "15%", right: "5%",
          width: 700, height: 700,
          backgroundImage: "url(/images/orb-hero.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "hue-rotate(90deg)",
          opacity: 0.15, mixBlendMode: "screen",
          maskImage: "radial-gradient(circle, black 20%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Organic blob decorations */}
        <Blob top="-10%" left="-5%" size={500} color={H.accent} opacity={0.04} />
        <Blob bottom="-15%" right="-10%" size={400} color={H.accent2} opacity={0.03} />

        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 640 }}>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              marginBottom: 36, animation: "fade-in-up 0.6s ease forwards",
            }}>
              <Leaf size={12} color={H.accent} />
              <span style={{ fontFamily: H.fontMono, fontSize: 12, color: H.accent, letterSpacing: 1 }}>
                <Counter /> on the waitlist
              </span>
            </div>

            <h1 style={{
              fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic",
              fontSize: "clamp(40px, 6.5vw, 76px)", lineHeight: 1.15,
              letterSpacing: "-1px", marginBottom: 28,
              fontVariationSettings: "'opsz' 72",
              animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
            }}>
              Your interviews
              <br />belong to
              <br /><span style={{ color: H.accent2 }}>another era.</span>
            </h1>

            <p style={{
              fontFamily: H.fontDisplay, fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.75, color: H.textDim, maxWidth: 460, marginBottom: 44,
              animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
            }}>
              Engineers cultivate solutions with AI agents daily. Your platform offers a chatbot.
              kodwai gives them <span style={{ color: H.accent2, fontWeight: 600 }}>Claude Code</span> -- a real agent, rooted in how they actually work.
            </p>

            <div id="waitlist-h" style={{ animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0 }}>
              <WaitlistForm id="hero-h" large />
            </div>
            <p style={{ fontFamily: H.fontMono, fontSize: 12, color: H.textMuted, marginTop: 14, animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0 }}>
              Free early access &middot; No card required
            </p>
          </div>

          {/* Terminal */}
          <div style={{
            marginTop: 60, maxWidth: 580,
            animation: "fade-in-up 1s ease 0.5s forwards", opacity: 0,
          }}>
            <Terminal />
          </div>
        </div>
      </section>

      {/* ═══ LOGO STRIP ═══ */}
      <section style={{
        borderTop: `1px solid ${H.border}`, borderBottom: `1px solid ${H.border}`,
        background: H.bgCard, padding: "36px 28px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Leaf size={10} color={H.textMuted} />
            <span style={{ fontFamily: H.fontMono, fontSize: 11, color: H.textMuted, letterSpacing: 1 }}>Trusted by teams at</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px 40px" }}>
            {allLogos.map(({ name, Component }) => (
              <div key={name} style={{ opacity: 0.3, transition: "opacity 0.4s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.3"; }}>
                <Component color="#3d5346" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section style={{ padding: "140px 24px", position: "relative", overflow: "hidden" }}>
        {/* Organic oval decoration */}
        <div style={{
          position: "absolute", top: "20%", right: "3%",
          width: 350, height: 450, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${H.accent}08, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <Leaf size={12} color={H.accent} />
            <span style={{ fontFamily: H.fontMono, fontSize: 12, color: H.accent, letterSpacing: 1 }}>The Problem</span>
          </div>
          <h2 style={{
            fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic",
            fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.15,
            letterSpacing: "-1px", marginBottom: 24,
            fontVariationSettings: "'opsz' 48",
          }}>
            Chatbots are not
            <br />AI agents.
          </h2>
          <p style={{ fontFamily: H.fontDisplay, fontSize: 18, color: H.textDim, lineHeight: 1.8, maxWidth: 520 }}>
            Every interview platform offers a chat window. Your candidates use Claude Code, Cursor, and Copilot.
            The gap between what they use and what you test is <span style={{ color: H.accent2, fontWeight: 600 }}>costing you top talent.</span>
          </p>
        </div>
      </section>

      {/* ═══ VALUE PROPS — Botanical specimen cards ═══ */}
      <section style={{ padding: "0 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            {
              n: "I", title: "Real Agent", desc: "Full Claude Code. Terminal, file system, multi-file projects. The way engineers actually work -- not a chat widget.",
              accent: H.accent,
            },
            {
              n: "II", title: "Full Capture", desc: "Every prompt, edit, and command recorded. A complete transcript of how the candidate thinks and directs AI.",
              accent: H.accent2,
            },
            {
              n: "III", title: "AI Scoring", desc: "Automated analysis of decomposition, agent control, verification habits. Not vibes -- data.",
              accent: H.text,
            },
          ].map((card, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              background: H.bgCard, border: `1px solid ${H.border}`, borderRadius: 24,
              padding: "48px 32px", position: "relative", overflow: "hidden",
              transition: "all 0.5s ease",
              boxShadow: `0 4px 24px ${H.bg}66`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${card.accent}44`; e.currentTarget.style.boxShadow = `0 8px 40px ${card.accent}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = H.border; e.currentTarget.style.boxShadow = `0 4px 24px ${H.bg}66`; }}
            >
              {/* Subtle organic shape in card background */}
              <div style={{
                position: "absolute", top: -30, right: -30,
                width: 120, height: 120, borderRadius: "50%",
                background: `radial-gradient(circle, ${card.accent}08, transparent 70%)`,
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{
                  fontFamily: H.fontDisplay, fontSize: 42, fontWeight: 300, fontStyle: "italic",
                  color: card.accent, opacity: 0.2, lineHeight: 1, display: "block", marginBottom: 20,
                  fontVariationSettings: "'opsz' 48",
                }}>{card.n}</span>
                <h3 style={{ fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic", fontSize: 26, letterSpacing: "-0.3px", marginBottom: 14 }}>{card.title}</h3>
                <p style={{ fontFamily: H.fontDisplay, fontSize: 15, color: H.textDim, lineHeight: 1.8 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS — with mesh-accent organic flow ═══ */}
      <section style={{
        padding: "120px 24px", position: "relative", overflow: "hidden",
        borderTop: `1px solid ${H.border}`, borderBottom: `1px solid ${H.border}`,
        background: H.bgCard,
      }}>
        {/* mesh-accent.jpg as organic flowing accent */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "50%",
          backgroundImage: "url(/images/mesh-accent.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "hue-rotate(120deg)",
          opacity: 0.07, mixBlendMode: "screen",
          maskImage: "linear-gradient(to right, transparent 10%, black 60%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 10%, black 60%)",
          pointerEvents: "none",
        }} />

        <Blob top="10%" right="-5%" size={350} color={H.accent} opacity={0.04} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="animate-in" style={{ marginBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <Leaf size={12} color={H.accent2} />
              <span style={{ fontFamily: H.fontMono, fontSize: 12, color: H.accent2, letterSpacing: 1 }}>How It Works</span>
            </div>
            <h2 style={{
              fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic",
              fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.5px",
              fontVariationSettings: "'opsz' 48",
            }}>
              Plant. Observe. Harvest.
            </h2>
          </div>

          {[
            { title: "Prepare the ground", desc: "Define the challenge. System design, debugging, greenfield -- configure AI access and time limits.", color: H.accent },
            { title: "Watch it grow", desc: "Candidate works with Claude Code. You watch in real-time. Full terminal, full IDE, no toy sandbox.", color: H.accent2 },
            { title: "Gather insights", desc: "AI-generated evaluation. Every prompt, every decision, full replay. Scoring you can defend in a debrief.", color: H.text },
          ].map((step, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{
              display: "flex", gap: 24, padding: "32px 0",
              borderTop: `1px solid ${H.border}`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `${step.color}12`, border: `1px solid ${step.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 2,
                fontFamily: H.fontDisplay, fontStyle: "italic", fontSize: 16, color: step.color, fontWeight: 400,
              }}>{i + 1}</div>
              <div>
                <h3 style={{ fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic", fontSize: 22, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontFamily: H.fontDisplay, fontSize: 15, color: H.textDim, lineHeight: 1.8 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COMPARISON — Garden labels: wilted vs flourishing ═══ */}
      <section style={{ padding: "120px 24px", maxWidth: 950, margin: "0 auto" }}>
        <div className="animate-in" style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <Leaf size={12} color={H.red} />
            <span style={{ fontFamily: H.fontMono, fontSize: 12, color: H.red, letterSpacing: 1 }}>vs. Legacy Platforms</span>
          </div>
          <h2 style={{
            fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic",
            fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.5px",
            fontVariationSettings: "'opsz' 48",
          }}>
            One is wilting.
            <br /><span style={{ color: H.textMuted }}>The other is flourishing.</span>
          </h2>
        </div>

        <div className="flex-col sm:flex-row" style={{ display: "flex", gap: 20 }}>
          {/* Wilted (legacy) */}
          <div className="animate-in animate-in-delay-1" style={{
            flex: 1, background: H.bgCard, border: `1px solid ${H.border}`, borderRadius: 24,
            padding: 36, position: "relative", overflow: "hidden",
            boxShadow: `0 4px 20px ${H.bg}44`,
          }}>
            {/* Faded / wilted label */}
            <div style={{
              position: "absolute", top: 16, right: 16, width: 8, height: 8,
              borderRadius: "50%", background: H.red, opacity: 0.4,
            }} />
            <p style={{ fontFamily: H.fontDisplay, fontStyle: "italic", fontSize: 13, color: H.textMuted, letterSpacing: 1, marginBottom: 28, opacity: 0.6 }}>Legacy</p>
            {["Chat widget", "No filesystem", "Toy editor", "No terminal", "Manual review", "AI = invisible"].map((x, i) => (
              <div key={i} style={{ fontFamily: H.fontMono, fontSize: 13, color: H.textMuted, padding: "11px 0", borderBottom: `1px solid ${H.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: H.red, fontSize: 10 }}>&#x2715;</span>{x}
              </div>
            ))}
          </div>

          {/* Flourishing (kodwai) */}
          <div className="animate-in animate-in-delay-2" style={{
            flex: 1, background: H.bgCard, border: `1.5px solid ${H.accent}33`, borderRadius: 24,
            padding: 36, position: "relative", overflow: "hidden",
            boxShadow: `0 8px 40px ${H.accent}08`,
          }}>
            {/* Flourishing dot */}
            <div style={{
              position: "absolute", top: 16, right: 16, width: 8, height: 8,
              borderRadius: "50%", background: H.accent,
              boxShadow: `0 0 12px ${H.accent}44`,
            }} />
            <p style={{ fontFamily: H.fontDisplay, fontStyle: "italic", fontSize: 13, color: H.accent, letterSpacing: 1, marginBottom: 28 }}>kodwai</p>
            {["Claude Code agent", "Full multi-file", "Real IDE", "Full terminal", "AI scoring", "Full transcript"].map((x, i) => (
              <div key={i} style={{ fontFamily: H.fontMono, fontSize: 13, color: H.text, padding: "11px 0", borderBottom: `1px solid ${H.accent}12`, display: "flex", alignItems: "center", gap: 10 }}>
                <Leaf size={10} color={H.accent} />{x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE — gilded page feel ═══ */}
      <section style={{
        padding: "100px 24px", borderTop: `1px solid ${H.border}`, borderBottom: `1px solid ${H.border}`,
        background: H.bgCard, position: "relative", overflow: "hidden",
      }}>
        <Blob top="-20%" left="30%" size={500} color={H.accent2} opacity={0.03} />

        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          {/* Gilded decorative quotation mark */}
          <div style={{
            fontFamily: H.fontDisplay, fontSize: 160, fontStyle: "italic", fontWeight: 300,
            color: H.accent2, opacity: 0.15, lineHeight: 0.6, marginBottom: -20,
            fontVariationSettings: "'opsz' 144",
          }}>&ldquo;</div>
          <p style={{
            fontFamily: H.fontDisplay, fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(20px, 3vw, 30px)", lineHeight: 1.6, marginBottom: 24,
            fontVariationSettings: "'opsz' 32",
          }}>
            We allowed AI in interviews but were blind to how candidates actually used it. That changed everything.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 1, background: H.accent2, opacity: 0.4 }} />
            <p style={{ fontFamily: H.fontMono, fontSize: 12, color: H.textMuted }}>Engineering Manager, 200+ engineers</p>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {[
            { stat: "87%", label: "of FAANG allow AI in interviews", accent: H.accent },
            { stat: "3\u00d7", label: "faster hiring with AI scoring", accent: H.accent2 },
            { stat: "0", label: "real AI agent platforms -- until now", accent: H.text },
          ].map((x, i) => (
            <div key={i} style={{
              padding: "48px 32px", background: H.bgCard, border: `1px solid ${H.border}`,
              borderRadius: 24, textAlign: "center",
              boxShadow: `0 4px 20px ${H.bg}44`,
            }}>
              <div style={{
                fontFamily: H.fontDisplay, fontWeight: 400, fontStyle: "italic",
                fontSize: 60, letterSpacing: "-2px", color: x.accent, marginBottom: 10,
                fontVariationSettings: "'opsz' 72",
              }}>{x.stat}</div>
              <p style={{ fontFamily: H.fontMono, fontSize: 12, color: H.textDim, lineHeight: 1.6 }}>{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA — particle-field warm atmosphere ═══ */}
      <section style={{ padding: "140px 24px", position: "relative", overflow: "hidden" }}>
        {/* particle-field.jpg warm golden particles */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/images/particle-field.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "hue-rotate(60deg)",
          opacity: 0.06, mixBlendMode: "screen",
          pointerEvents: "none",
        }} />

        {/* Large ambient blob */}
        <Blob top="20%" left="40%" size={600} color={H.accent2} opacity={0.04} />
        <Blob top="50%" left="20%" size={400} color={H.accent} opacity={0.03} />

        <div className="animate-in" style={{ maxWidth: 600, position: "relative", zIndex: 2, margin: "0 auto", textAlign: "center" }}>
          <Leaf size={20} color={H.accent2} />
          <h2 style={{
            fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic",
            fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.15,
            letterSpacing: "-1px", marginBottom: 20, marginTop: 24,
            fontVariationSettings: "'opsz' 72",
          }}>
            Stop testing the past.
            <br /><span style={{ color: H.accent2 }}>Cultivate the future.</span>
          </h2>
          <p style={{ fontFamily: H.fontDisplay, fontSize: 17, color: H.textDim, lineHeight: 1.75, maxWidth: 440, marginBottom: 40, margin: "0 auto 40px" }}>
            Early access includes priority onboarding, feature input, and lifetime pricing.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WaitlistForm id="bottom-h" large />
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${H.border}`, padding: "44px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Leaf size={14} color={H.accent} />
            <span style={{ fontFamily: H.fontDisplay, fontWeight: 500, fontStyle: "italic", fontSize: 18 }}>kodwai</span>
            <span style={{ fontFamily: H.fontMono, fontSize: 12, color: H.textMuted, marginLeft: 10 }}>For teams that take AI seriously.</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{ fontFamily: H.fontMono, fontSize: 12, color: H.textMuted, textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.color = H.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = H.textMuted; }}
            >X</a>
            <a href="mailto:hello@kodwai.com" style={{ fontFamily: H.fontMono, fontSize: 12, color: H.textMuted, textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.color = H.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = H.textMuted; }}
            >Email</a>
            <span style={{ fontFamily: H.fontMono, fontSize: 11, color: H.textMuted, opacity: 0.4 }}>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
