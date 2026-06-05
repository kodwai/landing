"use client";

/* ══════════════════════════════════════════════════════════════════════════
   VibeShowcase: "See exactly how you vibe code"  (the showpiece)
   Full-bleed warm-dark band over the earthy desert-dusk backdrop.

   The core differentiating insight, proven with product: passing tests is not
   skill. The SAME challenge, two developers. A careless one-shot prompt passes
   the tests (Outcome high) but barely steers (Direction low) → low total. A
   developer who decomposes, steers, and verifies scores high. We SHOW the
   product showing this, side by side, with a tab toggle that cross-fades and
   morphs the score total. A subtle cursor-proximity warm glow lights the band.

   Imports ONLY from ../system. All imagery is original inline SVG/CSS over the
   shared /landing/tex/earthy-band.jpg plus a fine warm grain tile this section
   created at /landing/showcase/grain.png. Motion is progressive enhancement,
   gated behind reduced-motion. Content renders fully with no JS.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  D, TYPE, Band, Inner, Marker, Serif, Accent, Counter, Bar,
  CSS_EASE, scoreColor, track, useMediaMax,
} from "../system";

/* ── The two sessions on the SAME challenge (illustrative, on-brand) ──────── */

type Axis = { name: string; pct: number; note: string };
type Session = {
  key: "oneshot" | "driven";
  tab: string;            // mono toggle label
  cwd: string;            // Claude Code session working dir (header line)
  subLabel: string;       // italic serif sub-label (Outship voice)
  blurb: string;          // one-line characterization
  total: number;          // the punchline numeral
  verdict: string;        // short mono verdict under the total
  direction: number;      // /50
  outcome: number;        // /35
  lift: number;           // /15
  dims: { direction: Axis[]; outcome: Axis[]; lift: Axis[] };
  transcript: Line[];     // faux editor / agent transcript
};

type Line =
  | { kind: "user"; text: string }
  | { kind: "agent"; text: string }
  | { kind: "tool"; text: string; tone?: "ok" | "warn" }
  | { kind: "test"; text: string; tone: "pass" | "fail" }
  | { kind: "note"; text: string };

const CHALLENGE = "algorithm: rate limiter · hard · 45 min";

const ONESHOT: Session = {
  key: "oneshot",
  tab: "one-shot prompt",
  cwd: "~/kodwai/rate-limiter",
  subLabel: "Careless one-shot",
  blurb: "One prompt, no steering. Ships whatever the agent returns first.",
  total: 58,
  verdict: "tests green, judgment absent",
  direction: 21,
  outcome: 33,
  lift: 4,
  dims: {
    direction: [
      { name: "Intent fidelity", pct: 44, note: "vague spec, agent guessed" },
      { name: "Verification rigor", pct: 28, note: "never ran the tests itself" },
      { name: "Decomposition", pct: 30, note: "one monolithic ask" },
      { name: "Recovery", pct: 36, note: "accepted first answer" },
    ],
    outcome: [
      { name: "Tests passed", pct: 100, note: "all green" },
      { name: "Code quality", pct: 71, note: "works, but coarse" },
    ],
    lift: [{ name: "Edge cases", pct: 24, note: "concurrency unhandled" }],
  },
  transcript: [
    { kind: "user", text: "build a sliding-window rate limiter, make the tests pass" },
    { kind: "agent", text: "Done. Added RateLimiter with a deque per key." },
    { kind: "test", text: "12 passed", tone: "pass" },
    { kind: "user", text: "ship it" },
    { kind: "note", text: "no verification · no edge probing · 1 turn" },
  ],
};

const DRIVEN: Session = {
  key: "driven",
  tab: "driven session",
  cwd: "~/kodwai/rate-limiter",
  subLabel: "Engineer who drives",
  blurb: "Decomposes the ticket, steers the agent, verifies every claim.",
  total: 92,
  verdict: "steered, checked, hardened",
  direction: 47,
  outcome: 33,
  lift: 12,
  dims: {
    direction: [
      { name: "Intent fidelity", pct: 96, note: "pinned the window contract" },
      { name: "Verification rigor", pct: 93, note: "ran tests every step" },
      { name: "Decomposition", pct: 90, note: "split into 4 commits" },
      { name: "Recovery", pct: 88, note: "caught a race, corrected" },
    ],
    outcome: [
      { name: "Tests passed", pct: 100, note: "all green" },
      { name: "Code quality", pct: 94, note: "lock scoped, no leak" },
    ],
    lift: [{ name: "Edge cases", pct: 84, note: "concurrent burst covered" }],
  },
  transcript: [
    { kind: "user", text: "spec first: per-key window, monotonic clock, no memory leak" },
    { kind: "agent", text: "Plan: window store, eviction, concurrency guard." },
    { kind: "test", text: "9 passed, 3 failing", tone: "fail" },
    { kind: "user", text: "the burst test races. add a per-key lock, prove it." },
    { kind: "tool", text: "pytest -k concurrency  →  3 passed", tone: "ok" },
    { kind: "note", text: "verified · race fixed · 4 commits" },
  ],
};

const SESSIONS = [ONESHOT, DRIVEN] as const;

/* ── Tiny inline glyphs for the transcript (mono voice, no deps) ──────────── */
function lineMeta(l: Line): { glyph: string; color: string } {
  switch (l.kind) {
    case "user": return { glyph: "›", color: D.accent };
    case "agent": return { glyph: "◇", color: D.green };
    case "tool": return { glyph: "»", color: l.tone === "warn" ? D.amber : D.muted };
    case "test": return { glyph: l.tone === "pass" ? "✓" : "✕", color: l.tone === "pass" ? D.green : D.accent };
    case "note": return { glyph: "//", color: D.faint };
  }
}

/* ══════════════════════════════════════════════════════════════════════════ */

export default function VibeShowcase() {
  const stacked = useMediaMax(900);
  const [active, setActive] = useState<"oneshot" | "driven">("driven");
  const bandRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Cursor-proximity warm glow on the dark band (gated, transform/opacity only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch
    const band = bandRef.current, glow = glowRef.current;
    if (!band || !glow) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = band.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        glow.style.opacity = "1";
      });
    };
    const onLeave = () => { glow.style.opacity = "0"; };
    band.addEventListener("mousemove", onMove);
    band.addEventListener("mouseleave", onLeave);
    return () => {
      band.removeEventListener("mousemove", onMove);
      band.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const k = "k-vshow-";

  return (
    <Band tone="dark" id="showcase" style={{ overflow: "hidden", position: "relative" }}>
      {/* Scoped keyframes / hover / responsive that inline styles cannot express */}
      <style>{`
        .${k}tab { transition: color .3s ${CSS_EASE}; }
        .${k}tab:focus-visible { outline: 2px solid ${D.accent}; outline-offset: 2px; }
        @media (hover: hover) {
          .${k}card:hover { border-color: ${D.lineBright}; }
        }
        .${k}stack { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 2.4vw, 30px); align-items: start; }
        @media (max-width: 900px) { .${k}stack { grid-template-columns: 1fr; } }
        .${k}tab { min-height: 44px; }
        @keyframes ${k}beat { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        .${k}beat { animation: ${k}beat 2.6s ${CSS_EASE} infinite; }
        @keyframes ${k}xfade { from { opacity: 0; } to { opacity: 1; } }
        .${k}xfade { animation: ${k}xfade .42s ${CSS_EASE} both; }
        @media (prefers-reduced-motion: reduce) {
          .${k}beat { animation: none; }
          .${k}xfade { animation: none; }
        }
      `}</style>

      {/* ── Backdrop: earthy desert-dusk + warm grain + readability scrim ── */}
      <div ref={bandRef} aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/landing/tex/earthy-band.jpg)",
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(/landing/showcase/grain.png)",
          backgroundSize: "200px 200px", opacity: 0.5, mixBlendMode: "overlay",
        }} />
        {/* top + bottom fade so the band reads as warm-dark, art stays legible */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, ${D.bg} 0%, rgba(14,13,12,0.62) 26%, rgba(14,13,12,0.62) 74%, ${D.bg} 100%)`,
        }} />
        {/* cursor-proximity warm glow (JS-driven; hidden until first move) */}
        <div ref={glowRef} style={{
          position: "absolute", left: 0, top: 0, width: 540, height: 540, opacity: 0,
          background: "radial-gradient(circle, rgba(255,106,69,0.16), transparent 66%)",
          transition: `opacity .5s ${CSS_EASE}`, willChange: "transform, opacity",
        }} />
      </div>

      <Inner style={{ position: "relative", zIndex: 1 }}>
        <Marker index="03" label="the aha" tone="dark" />

        {/* ── Headline + lede (Outship two-column framing) ── */}
        <div className="k-split-2 k-reveal" style={{ alignItems: "end", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          <Serif as="h2" size="h2" tone="dark" style={{ maxWidth: "16ch" }}>
            See exactly how you{" "}
            <Accent tone="dark">vibe code.</Accent>
          </Serif>
          <p style={{ ...TYPE.body, color: D.muted, margin: 0, maxWidth: "46ch" }}>
            Same challenge, two developers. A careless one-shot prompt can pass
            the tests. It still scores low, because passing tests is not skill.
            kodwai reads the whole session, so the score rewards how you drive.
          </p>
        </div>

        {/* ── Signature interaction: tab toggle (one-shot | driven) ── */}
        <div className="k-reveal" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: "clamp(26px, 3vw, 38px)" }}>
          <span style={{ ...TYPE.label, color: D.faint }}>focus</span>
          <Toggle k={k} active={active} onChange={(key) => { setActive(key); track("showcase_toggle", { session: key }); }} />
          <span style={{ fontFamily: D.mono, fontSize: 11, color: D.faint, letterSpacing: 0.5 }}>
            <span className={`${k}beat`} style={{ color: D.accent }}>●</span>{" "}
            {stacked ? "tap to switch" : "both shown · highlighted in rust"}
          </span>
        </div>

        {/* ── The product mockups. Desktop: both side by side, active
            highlighted and the other dimmed. Mobile: only the active one,
            the toggle switches which single terminal is visible (cross-fade). ── */}
        <div className={`${k}stack`} data-stagger>
          {(stacked ? SESSIONS.filter((s) => s.key === active) : SESSIONS).map((s) => (
            <Mockup
              key={stacked ? `mobile-${active}` : s.key}
              k={k}
              session={s}
              focused={active === s.key}
              dimmed={!stacked && active !== s.key}
              crossfade={stacked}
            />
          ))}
        </div>

        {/* ── Caption tying it together ── */}
        <div className="k-reveal" style={{
          marginTop: "clamp(34px, 4vw, 52px)", display: "flex", alignItems: "flex-start", gap: 14,
          borderTop: `1px solid ${D.line}`, paddingTop: 26, maxWidth: 760,
        }}>
          <span aria-hidden style={{ fontFamily: D.mono, fontSize: 13, color: D.accent, lineHeight: 1.5, flexShrink: 0 }}>{"//"}</span>
          <p style={{ ...TYPE.body, fontSize: "clamp(14.5px, 1.7vw, 17px)", color: D.text, margin: 0 }}>
            kodwai reads the whole session: the prompts, the recovery, the test
            runs, the commits. The score is dominated by <span style={{ color: D.accent, fontFamily: D.serif, fontStyle: "italic" }}>Direction</span>,
            {" "}the part a one-shot cannot fake.
          </p>
        </div>
      </Inner>
    </Band>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Toggle: a single sliding-pill segmented control. Real keyboard focus,
   the indicator slides under the active label (Outship-clean, mono voice).
   ══════════════════════════════════════════════════════════════════════════ */
function Toggle({ k, active, onChange }: {
  k: string;
  active: "oneshot" | "driven";
  onChange: (key: "oneshot" | "driven") => void;
}) {
  const idx = active === "oneshot" ? 0 : 1;
  return (
    <div
      role="tablist"
      aria-label="Compare a one-shot prompt against a driven session"
      style={{
        position: "relative", display: "inline-grid", gridTemplateColumns: "1fr 1fr",
        border: `1px solid ${D.line}`, background: D.panel, padding: 3, gap: 0,
      }}
    >
      {/* sliding indicator */}
      <span aria-hidden style={{
        position: "absolute", top: 3, bottom: 3, left: 3, width: "calc(50% - 3px)",
        background: D.elevated, border: `1px solid ${D.lineBright}`,
        transform: `translateX(${idx * 100}%)`,
        transition: `transform .42s ${CSS_EASE}`, zIndex: 0,
      }} />
      {SESSIONS.map((s) => {
        const on = (s.key === active);
        return (
          <button
            key={s.key}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(s.key)}
            className={`${k}tab`}
            style={{
              position: "relative", zIndex: 1, background: "transparent", border: "none", cursor: "pointer",
              fontFamily: D.mono, fontSize: 11.5, letterSpacing: 1, textTransform: "uppercase",
              color: on ? D.text : D.faint, padding: "10px 18px", whiteSpace: "nowrap",
            }}
          >
            {s.tab}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Mockup: one original dark IDE + score card. Editor/transcript chrome on
   top, score panel below. The total numeral is the punchline. When focused,
   the card lifts and the rust accent strengthens. Both render with no JS.
   ══════════════════════════════════════════════════════════════════════════ */
function Mockup({ k, session, focused, dimmed, crossfade = false }: {
  k: string;
  session: Session;
  focused: boolean;
  dimmed: boolean;
  crossfade?: boolean;
}) {
  const sc = scoreColor(session.total, D);
  const isHigh = session.key === "driven";

  return (
    // Outer .k-item carries the entrance stagger (choreography owns its opacity).
    // On mobile the single terminal cross-fades when the toggle switches it.
    // The inner wrapper carries focus/dim, so the two never fight over opacity.
    <div className={crossfade ? `k-item ${k}xfade` : "k-item"} style={{ minWidth: 0 }}>
    <article
      className={`${k}card`}
      aria-current={focused || undefined}
      style={{
        position: "relative",
        border: `1px solid ${focused ? D.lineBright : D.line}`,
        background: D.bg2,
        boxShadow: focused
          ? "0 44px 90px -44px rgba(0,0,0,0.85)"
          : "0 30px 70px -48px rgba(0,0,0,0.8)",
        opacity: dimmed ? 0.52 : 1,
        transform: focused ? "translateY(-3px)" : "translateY(0)",
        transition: `opacity .42s ${CSS_EASE}, transform .42s ${CSS_EASE}, border-color .42s ${CSS_EASE}, box-shadow .42s ${CSS_EASE}`,
        display: "flex", flexDirection: "column", minWidth: 0,
      }}
    >
      {/* focus rail: a rust top hairline when this card is the focus */}
      <span aria-hidden style={{
        position: "absolute", top: -1, left: -1, right: -1, height: 2,
        background: focused ? sc : "transparent",
        transition: `background .42s ${CSS_EASE}`,
      }} />

      {/* ── Claude Code session banner (reads as a real CC session) ── */}
      <div style={{
        padding: "13px 16px 12px", borderBottom: `1px solid ${D.line}`,
        background: D.bg2, display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
          <Image
            src="/landing/logos/claude.svg"
            alt=""
            aria-hidden
            width={13}
            height={13}
            style={{ width: 13, height: 13, flexShrink: 0, opacity: 0.95 }}
          />
          <span style={{ fontFamily: D.mono, fontSize: 12, color: D.muted, letterSpacing: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Welcome to <span style={{ color: D.text, fontWeight: 600 }}>Claude Code</span>{" "}
            <span style={{ color: D.faint }}>(v2.1.34)</span>
          </span>
        </div>
        <span style={{ fontFamily: D.mono, fontSize: 11, color: D.faint, letterSpacing: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          cwd: <span style={{ color: D.muted }}>{session.cwd}</span> · model: <span style={{ color: D.muted }}>claude-opus-4-7</span>
        </span>
      </div>

      {/* ── window chrome + sub-label ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        padding: "12px 16px", borderBottom: `1px solid ${D.line}`, background: D.panel,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ display: "inline-flex", gap: 6 }} aria-hidden>
            {["#3a3733", "#3a3733", "#3a3733"].map((c, i) => (
              <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
          </span>
          <span style={{ fontFamily: D.mono, fontSize: 11, color: D.faint, letterSpacing: 0.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            session · {session.tab}
          </span>
        </div>
        {/* italic serif sub-label, Outship "Inexperienced vibe coder" voice */}
        <span style={{
          fontFamily: D.serif, fontStyle: "italic", fontSize: 14, lineHeight: 1,
          color: isHigh ? D.accent : D.muted, whiteSpace: "nowrap",
        }}>
          {session.subLabel}
        </span>
      </header>

      {/* ── challenge strip ── */}
      <div style={{ padding: "9px 16px", borderBottom: `1px solid ${D.line}`, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 6, height: 6, background: D.accent, flexShrink: 0 }} aria-hidden />
        <span style={{ fontFamily: D.mono, fontSize: 10.5, color: D.faint, letterSpacing: 0.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {CHALLENGE}
        </span>
      </div>

      {/* ── faux transcript ── */}
      <div style={{
        padding: "14px 16px", background: D.bg, borderBottom: `1px solid ${D.line}`,
        display: "flex", flexDirection: "column", gap: 9, fontFamily: D.mono, fontSize: 12, lineHeight: 1.45,
        minHeight: 168,
      }}>
        {session.transcript.map((l, i) => {
          const { glyph, color } = lineMeta(l);
          const muted = l.kind === "note";
          return (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "baseline", minWidth: 0 }}>
              <span aria-hidden style={{ color, flexShrink: 0, width: 14, textAlign: "center", fontSize: l.kind === "note" ? 10 : 12 }}>{glyph}</span>
              <span style={{
                color: muted ? D.faint : (l.kind === "user" ? D.text : D.muted),
                letterSpacing: muted ? 0.4 : 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {l.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── score panel: the punchline ── */}
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* total numeral + verdict + axis chips */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: D.serif, fontSize: "clamp(46px, 7.4vw, 72px)", fontWeight: 460, lineHeight: 0.86, color: sc, letterSpacing: "-0.03em" }}>
              <Counter to={session.total} duration={1700} />
            </span>
            <span style={{ fontFamily: D.mono, fontSize: 13, color: D.faint, letterSpacing: 0.5 }}>/ 100</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, textAlign: "right" }}>
            <span style={{ fontFamily: D.mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: sc }}>
              {isHigh ? "high score" : "low score"}
            </span>
            <span style={{ fontFamily: D.mono, fontSize: 11, color: D.muted, letterSpacing: 0.3 }}>
              {session.verdict}
            </span>
          </div>
        </div>

        {/* per-axis breakdown (Direction dominant; bars grow on view) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <AxisRow label="Direction" pts={session.direction} max={50} pct={Math.round((session.direction / 50) * 100)} accent strong={isHigh} />
          <AxisRow label="Outcome" pts={session.outcome} max={35} pct={Math.round((session.outcome / 35) * 100)} />
          <AxisRow label="Lift" pts={session.lift} max={15} pct={Math.round((session.lift / 15) * 100)} />
        </div>

        {/* the tell: one evidence line that explains the gap */}
        <p style={{
          margin: 0, fontFamily: D.sans, fontSize: 12.5, lineHeight: 1.5, color: D.muted,
          borderLeft: `2px solid ${isHigh ? D.green : D.accent}`, paddingLeft: 11,
        }}>
          {isHigh
            ? "Tests green and the agent was steered, verified, and hardened. Direction carries the score."
            : "Tests are green, but no steering, no verification, no recovery. Direction collapses the total."}
        </p>
      </div>
    </article>
    </div>
  );
}

/* ── One scored axis: label, points, a meter that grows on view ──────────── */
function AxisRow({ label, pts, max, pct, accent = false, strong = false }: {
  label: string; pts: number; max: number; pct: number; accent?: boolean; strong?: boolean;
}) {
  // Direction (the dominant axis) reads in rust; others in muted ink-on-dark.
  const color = accent ? (strong ? D.accent : D.amber) : D.muted;
  const trackColor = D.line;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "78px 1fr auto", gap: 12, alignItems: "center" }}>
      <span style={{
        fontFamily: D.mono, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase",
        color: accent ? color : D.faint, whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <Bar pct={pct} color={color} track={trackColor} height={accent ? 6 : 4} />
      <span style={{ fontFamily: D.mono, fontSize: 12, color: D.text, whiteSpace: "nowrap", textAlign: "right", minWidth: 46 }}>
        <span style={{ color }}>{pts}</span>
        <span style={{ color: D.faint }}> / {max}</span>
      </span>
    </div>
  );
}
