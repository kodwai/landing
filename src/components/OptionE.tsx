"use client";

import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import anime from "animejs";
import LogoStrip from "./LogoStrip";

/* ══════════════════════════════════════════════════════════════
   kodwai landing — "developer's technical paper"
   Warm-light palette matching the app (cream / ink / rust), with a
   developer treatment: JetBrains Mono machine-voice headlines and
   data, Hanken Grotesk prose, a Playfair wordmark, code-comment
   section markers, a faint code-grid field, and a dark live
   terminal. Motion is anime.js, gated behind prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════ */

const C = {
  bg: "#faf8f4",
  paper2: "#f3efe8",
  panel: "#fffdf9",
  line: "#e4e0d8",
  lineBright: "#d6cfc1",
  text: "#1a1a1a",
  muted: "#6f695f",
  faint: "#9a948a",
  accent: "#c23616",
  accentDeep: "#a82d12",
  green: "#1f9d55",
  amber: "#cf8a1a",
  mono: "var(--font-mono-jb)",
  sans: "var(--font-grotesk)",
  serif: "'Playfair Display', Georgia, serif",
};

/* Terminal keeps a dark palette on the light page, like a real terminal. */
const T = {
  bg: "#0c0c0d",
  header: "#161617",
  line: "#242426",
  text: "#9b978f",
  faint: "#5a5852",
  prompt: "#ff6b4a",
  agent: "#4ade80",
  green: "#4ade80",
  amber: "#fbbf24",
};

const APP_URL = "https://app.kodwai.com";
const EASE = "cubicBezier(0.16, 1, 0.3, 1)";
const CSS_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const MAXW = 1120;
const PAD = "clamp(20px, 5vw, 56px)";

const diffStyle: Record<string, { bg: string; fg: string }> = {
  easy: { bg: "rgba(31,157,85,0.12)", fg: "#1a7f44" },
  medium: { bg: "rgba(207,138,26,0.16)", fg: "#9a6206" },
  hard: { bg: "rgba(194,54,22,0.12)", fg: "#c23616" },
};

/* ─── Terminal data ─── */
// Mirrors the real CLI flow (challenge -> pick agent -> workspace + git +
// timer -> solve -> submit -> score), with the dial turned slightly toward fun.
const lines = [
  { t: "p", s: "$ npx @kodwai/cli challenge algorithm-rate-limiter" },
  { t: "b", s: "" },
  { t: "d", s: "  kodwai · real problems, your own agent" },
  { t: "a", s: "? which agent will you use? › Claude Code" },
  { t: "g", s: "✓ workspace   kodwai-algorithm-rate-limiter/" },
  { t: "d", s: "  wrote PROBLEM.md, starter files, tests" },
  { t: "d", s: '  git init · commit "Initial: starter files"' },
  { t: "d", s: "⏱  45:00 on the clock. no pressure." },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "read PROBLEM.md, then build it"' },
  { t: "a", s: "→ reading problem… a sliding-window limiter. cute." },
  { t: "a", s: "→ plan: counter, limiter, tests. wiring it up." },
  { t: "d", s: "  created  rate-limiter.ts        71 lines" },
  { t: "d", s: "  created  rate-limiter.test.ts    6 tests" },
  { t: "d", s: "  $ node .kodwai/test-runner.js" },
  { t: "g", s: "  ✓ allows requests under the limit" },
  { t: "g", s: "  ✓ blocks the 6th request in the window" },
  { t: "g", s: "  ✓ resets after the window expires" },
  { t: "g", s: "  ✓ tracks each client independently" },
  { t: "g", s: "  ✓ cleans up expired entries (no leaks)" },
  { t: "g", s: "✓ 6/6 passing. attempt #3, but who's counting" },
  { t: "b", s: "" },
  { t: "p", s: "$ npx @kodwai/cli submit" },
  { t: "d", s: "  packing code · git log · tests · transcript" },
  { t: "a", s: "→ uploading 41 minutes of you correcting me…" },
  { t: "d", s: "✓ submission received · scoring" },
  { t: "b", s: "" },
  { t: "x", s: "  ai collaboration score      94 / 100" },
  { t: "h", s: "  ───────────────────────────────────" },
  { t: "x", s: "  objective (70%)             95" },
  { t: "x", s: "  ai analysis (30%)           91" },
  { t: "d", s: "  → kodwai.com/dev/submissions/8f2a" },
];

const scoreOnly = lines.slice(-5);

function lineColor(t: string) {
  return t === "p" ? T.prompt
    : t === "a" ? T.agent
    : t === "x" ? T.amber
    : t === "g" ? T.green
    : t === "h" ? T.faint
    : T.text;
}

function Terminal() {
  const [playing, setPlaying] = useState(false);
  const [vl, setVl] = useState(0);
  const [ci, setCi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => { setVl(0); setCi(0); setPlaying(true); }, 650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (vl >= lines.length) {
      const t = setTimeout(() => { setPlaying(false); }, 3600);
      return () => clearTimeout(t);
    }
    const l = lines[vl];
    if (l.t === "b") {
      const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, 150);
      return () => clearTimeout(t);
    }
    if (ci < l.s.length) {
      const t = setTimeout(() => setCi(c => c + 1), l.t === "p" ? 20 : l.t === "a" ? 13 : 5);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, l.t === "p" ? 300 : l.t === "x" ? 150 : 70);
    return () => clearTimeout(t);
  }, [vl, ci, playing]);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vl, ci, playing]);

  const visible = playing || vl >= lines.length ? lines.slice(0, Math.min(vl + 1, lines.length)) : scoreOnly;

  return (
    <div style={{
      background: T.bg, border: `1px solid ${T.line}`, overflow: "hidden", position: "relative", maxWidth: "100%",
      fontFamily: C.mono, boxShadow: "0 26px 60px -26px rgba(40,22,10,0.45), 0 2px 10px -4px rgba(40,22,10,0.18)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: T.header, borderBottom: `1px solid ${T.line}` }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a3833" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a3833" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a3833" }} />
        <span style={{ fontSize: 11.5, color: T.faint, marginLeft: 10, letterSpacing: 0.3 }}>~/kodwai/rate-limiter · zsh</span>
        <button
          type="button"
          onClick={() => { setVl(0); setCi(0); setPlaying(true); }}
          aria-label="Replay the recorded session"
          style={{
            marginLeft: "auto", background: "transparent", color: playing ? T.faint : T.prompt,
            border: `1px solid ${playing ? T.line : "#7a3320"}`, fontFamily: C.mono, fontSize: 10, letterSpacing: 1.4,
            textTransform: "uppercase", padding: "5px 11px", cursor: "pointer",
            transition: `color 0.3s ${CSS_EASE}, border-color 0.3s ${CSS_EASE}`,
          }}
        >
          {playing && vl < lines.length ? "running" : "↻ replay"}
        </button>
      </div>
      <div ref={ref} className="hide-scrollbar" style={{ padding: "20px 22px", fontSize: 12.5, lineHeight: 1.85, height: 432, overflowX: "auto", overflowY: "auto", textAlign: "left" }}>
        {visible.map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 11 }} />;
          const cur = playing && i === vl;
          return (
            <div key={i} style={{ color: lineColor(l.t), whiteSpace: "pre", textAlign: "left", fontWeight: l.t === "x" ? 500 : 400 }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && (
                <span style={{ display: "inline-block", width: 7, height: 13, background: T.prompt, marginLeft: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Motion: load sequence + scroll-triggered staggers ─── */
function useChoreography() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heroEls = Array.from(document.querySelectorAll<HTMLElement>(".k-hero-el"));
    if (heroEls.length) {
      anime.set(heroEls, { opacity: 0, translateY: 16 });
      anime({ targets: heroEls, opacity: [0, 1], translateY: [16, 0], delay: anime.stagger(85, { start: 120 }), duration: 820, easing: EASE });
    }

    const singles = Array.from(document.querySelectorAll<HTMLElement>(".k-reveal"));
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-stagger]"));
    anime.set(singles, { opacity: 0, translateY: 24 });
    groups.forEach(g => anime.set(g.querySelectorAll<HTMLElement>(".k-item"), { opacity: 0, translateY: 24 }));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        if (el.hasAttribute("data-stagger")) {
          anime({ targets: el.querySelectorAll(".k-item"), opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(62), duration: 700, easing: EASE });
        } else {
          anime({ targets: el, opacity: [0, 1], translateY: [24, 0], duration: 780, easing: EASE });
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    [...singles, ...groups].forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Responsive column count, computed in JS so layout never depends on a
   globals.css class being emitted. SSR-safe: starts at desktop, adjusts on mount. ─── */
function useResponsiveCols(desktop: number, tablet: number, mobile: number) {
  const [cols, setCols] = useState(desktop);
  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      setCols(w <= 560 ? mobile : w <= 940 ? tablet : desktop);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [desktop, tablet, mobile]);
  return cols;
}

/* ─── Count-up numeral ─── */
function Counter({ to, duration = 1500, style }: { to: number; duration?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = String(to); return; }
    const obj = { v: 0 };
    let played = false;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !played) {
        played = true;
        anime({ targets: obj, v: to, round: 1, duration, easing: EASE, update: () => { el.textContent = String(obj.v); } });
        io.unobserve(el);
      }
    }), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref} style={style}>0</span>;
}

/* ─── Animated meter ─── */
function Bar({ pct, color = C.accent, track = C.line, height = 4 }: { pct: number; color?: string; track?: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.transform = `scaleX(${pct / 100})`; return; }
    el.style.transform = "scaleX(0)";
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { anime({ targets: el, scaleX: [0, pct / 100], duration: 950, easing: EASE }); io.unobserve(el); }
    }), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);
  return (
    <div style={{ height, background: track, position: "relative", overflow: "hidden", borderRadius: 2 }}>
      <div ref={ref} style={{ position: "absolute", inset: 0, background: color, transformOrigin: "left", transform: `scaleX(${pct / 100})`, borderRadius: 2 }} />
    </div>
  );
}

/* ─── Circular score ring with count-up ─── */
function ScoreRing({ score = 94, size = 168 }: { score?: number; size?: number }) {
  const ref = useRef<SVGCircleElement>(null);
  const r = size / 2 - 9;
  const circ = 2 * Math.PI * r;
  const color = score >= 70 ? C.green : score >= 50 ? C.amber : C.accent;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.strokeDasharray = String(circ);
    const target = circ * (1 - score / 100);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.strokeDashoffset = String(target); return; }
    el.style.strokeDashoffset = String(circ);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { anime({ targets: el, strokeDashoffset: [circ, target], duration: 1500, easing: EASE }); io.unobserve(el); }
    }), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [circ, score]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={8} />
        <circle ref={ref} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: C.mono, fontWeight: 700, fontSize: size * 0.31, color: C.text, lineHeight: 1 }}><Counter to={score} /></span>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 1, marginTop: 4 }}>/ 100</span>
      </div>
    </div>
  );
}

function Marker({ index, label }: { index: string; label: string }) {
  return (
    <div className="k-reveal" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
      <span style={{ fontFamily: C.mono, fontSize: 12, color: C.accent, letterSpacing: 0.5 }}>{"//"}</span>
      <span style={{ fontFamily: C.mono, fontSize: 12, color: C.faint, letterSpacing: 1 }}>{index}</span>
      <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, textTransform: "lowercase", letterSpacing: 2 }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: C.line }} aria-hidden />
    </div>
  );
}

function CodeChip({ children }: { children: React.ReactNode }) {
  return (
    <code className="hide-scrollbar" style={{
      fontFamily: C.mono, fontSize: 12.5, background: T.bg, color: "#e8e6e1", border: `1px solid ${T.line}`,
      padding: "8px 13px", display: "inline-flex", alignItems: "center", gap: 9, maxWidth: "100%", overflowX: "auto", whiteSpace: "nowrap",
    }}>
      <span style={{ color: T.prompt }}>$</span>{children}
    </code>
  );
}

function PrimaryButton({ label, large }: { label: string; large?: boolean }) {
  const [h, setH] = useState(false);
  return (
    <a href={APP_URL} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "inline-flex", alignItems: "center", gap: 12, background: h ? C.accentDeep : C.accent, color: "#faf8f4",
      fontFamily: C.mono, fontWeight: 700, fontSize: large ? 13 : 12, padding: large ? "16px 28px" : "12px 22px",
      textDecoration: "none", textTransform: "uppercase", letterSpacing: 2, whiteSpace: "nowrap", border: `1px solid ${C.accent}`,
      transition: `background .35s ${CSS_EASE}, transform .35s ${CSS_EASE}, box-shadow .35s ${CSS_EASE}`,
      transform: h ? "translateY(-2px)" : "translateY(0)",
      boxShadow: h ? "0 16px 34px -12px rgba(194,54,22,0.55)" : "0 4px 16px -8px rgba(194,54,22,0.4)",
    }}>
      <span>{label}</span>
      <span style={{ display: "inline-block", transform: h ? "translateX(5px)" : "translateX(0)", transition: `transform .35s ${CSS_EASE}` }}>→</span>
    </a>
  );
}

function GhostLink({ label, kicker, href = APP_URL }: { label: string; kicker?: string; href?: string }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "inline-flex", alignItems: "center", gap: 10, fontFamily: C.mono, fontSize: 12, letterSpacing: 1,
      textTransform: "uppercase", color: h ? C.accent : C.muted, textDecoration: "none", transition: `color .3s ${CSS_EASE}`,
    }}>
      {kicker && <span style={{ color: C.faint }}>{kicker}</span>}
      <span>{label}</span>
      <span style={{ display: "inline-block", transform: h ? "translateX(4px)" : "translateX(0)", transition: `transform .3s ${CSS_EASE}` }}>→</span>
    </a>
  );
}

/* ─── Data ─── */
const flow = [
  { n: "01", title: "Pick a challenge", body: "Browse real, ticket-sized problems across nine categories. Filter by difficulty and pick one that looks like the work you actually do.", chip: null, tags: null },
  { n: "02", title: "Run the CLI", body: "Start it from your terminal and choose your agent. We download PROBLEM.md, starter files and tests, init a git repo, and start the timer.", chip: "npx @kodwai/cli challenge <slug>", tags: ["Claude Code", "Cursor"] },
  { n: "03", title: "Solve on your machine", body: "Work the problem with your own agent in your own editor. No sandbox to fight, no artificial constraints, just how you really build.", chip: null, tags: null },
  { n: "04", title: "Submit", body: "One command packages your code, git history, test runs, agent transcript and the time you took, then ships it for scoring.", chip: "npx @kodwai/cli submit", tags: null },
  { n: "05", title: "Get your score", body: "An objective score lands first. AI analysis adds a deeper read of how you worked. Then you are on the leaderboard.", chip: null, tags: null },
];

function CatPill({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: C.mono, fontSize: 11.5, letterSpacing: 0.4, textTransform: "lowercase",
        padding: "8px 14px", cursor: "pointer", border: `1px solid ${active ? C.accent : C.line}`,
        background: active ? C.accent : "transparent", color: active ? "#faf8f4" : C.muted,
        transition: `color .25s ${CSS_EASE}, border-color .25s ${CSS_EASE}, background .25s ${CSS_EASE}`,
        display: "inline-flex", alignItems: "center", gap: 7,
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = C.lineBright; e.currentTarget.style.color = C.text; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.muted; } }}
    >
      <span>{label}</span>
      <span style={{ color: active ? "rgba(255,255,255,0.72)" : C.faint, fontSize: 10 }}>{count}</span>
    </button>
  );
}

/* ─── Badge share buttons. On the landing these just open the app (where you
   actually earn and share a badge); they do not fire a real post. ─── */
function ShareIcon({ kind, url }: { kind: "x" | "linkedin"; url: string }) {
  const [h, setH] = useState(false);
  const hoverColor = kind === "x" ? "#000000" : "#0A66C2";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={kind === "x" ? "Share on X" : "Share on LinkedIn"}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", color: h ? hoverColor : C.faint, transition: `color .2s ${CSS_EASE}` }}
    >
      {kind === "x" ? (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
      )}
    </a>
  );
}

export type Challenge = {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  minutes: number;
};

// Used only if the live Turso fetch fails at build/request time.
const FALLBACK_CHALLENGES: Challenge[] = [
  { slug: "algorithm-rate-limiter", title: "Algorithm: Rate Limiter", description: "A sliding-window rate limiter that handles concurrent requests without leaking memory.", difficulty: "hard", category: "algorithms", minutes: 45 },
  { slug: "oauth-refresh-rotation", title: "OAuth with refresh rotation", description: "Authorization-code flow, PKCE, refresh-token rotation, and replay detection.", difficulty: "medium", category: "backend", minutes: 75 },
  { slug: "collaborative-cursor-sync", title: "Collaborative cursor sync", description: "CRDT-backed presence, conflict-free merges, and sub-50ms perceived latency.", difficulty: "hard", category: "frontend", minutes: 75 },
];

const objectiveDims = [
  { name: "Test pass rate", pct: 98 },
  { name: "Code quality", pct: 93 },
  { name: "Complexity", pct: 88 },
  { name: "Time efficiency", pct: 90 },
  { name: "Iteration", pct: 86 },
];
const aiDims = ["Problem solving", "Code quality", "Agent collaboration"];

const leaderboard = [
  { rank: 1, name: "Jamie Brooks", handle: "@jamie", agent: "claude-code", score: 96 },
  { rank: 2, name: "Sarah Chen", handle: "@schen", agent: "claude-code", score: 94 },
  { rank: 3, name: "Kenji Tanaka", handle: "@ktanaka", agent: "cursor", score: 93 },
  { rank: 4, name: "Alex Mendez", handle: "@amendez", agent: "claude-code", score: 91 },
  { rank: 5, name: "Priya Rao", handle: "@priyar", agent: "claude-code", score: 90 },
];
// Real achievement badges, imported from the app (public/badges/<slug>.png)
const badges = [
  { slug: "first-blood", name: "First Blood" },
  { slug: "five-down", name: "Five Down" },
  { slug: "ten-strong", name: "Ten Strong" },
  { slug: "quarter-century", name: "Quarter Century" },
  { slug: "streak-3", name: "On Fire" },
  { slug: "streak-7", name: "Week Warrior" },
  { slug: "streak-30", name: "Monthly Machine" },
  { slug: "top-10", name: "Top 10%" },
  { slug: "speed-demon", name: "Speed Demon" },
  { slug: "perfect-score", name: "Perfectionist" },
  { slug: "polyglot", name: "Polyglot" },
  { slug: "claude-master", name: "Claude Master" },
  { slug: "cursor-pro", name: "Cursor Pro" },
  { slug: "early-adopter", name: "Early Adopter" },
];

function scoreColor(s: number) { return s >= 70 ? C.green : s >= 50 ? C.amber : C.accent; }

/* ══════════════════════════ PAGE ══════════════════════════ */
export default function OptionE({ challenges = [] }: { challenges?: Challenge[] }) {
  useChoreography();

  const catalog = challenges.length ? challenges : FALLBACK_CHALLENGES;
  const catCounts = catalog.reduce<Record<string, number>>((m, c) => { m[c.category] = (m[c.category] || 0) + 1; return m; }, {});
  const cats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const [activeCat, setActiveCat] = useState<string>("");
  const [showAllChal, setShowAllChal] = useState(false);
  const effectiveCat = activeCat || (cats[0]?.[0] ?? "");
  const inCat = catalog.filter(c => c.category === effectiveCat);
  const visibleChallenges = showAllChal ? inCat : inCat.slice(0, 3);
  const chalCols = useResponsiveCols(3, 2, 1);
  const badgeCols = useResponsiveCols(7, 5, 3);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.sans, position: "relative", zIndex: 2, overflowX: "hidden" }}>
      <div className="k-field" aria-hidden />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: `13px ${PAD}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(250,248,244,0.82)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <span style={{ fontFamily: C.serif, fontWeight: 600, fontSize: 23, letterSpacing: 0.4, color: C.text }}>kodwai</span>
          <Link href="/blog" className="k-nav-blog" style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none" }}>blog</Link>
        </div>
        <a href={APP_URL} style={{
          fontFamily: C.mono, fontSize: 11, padding: "9px 18px", letterSpacing: 1.4, textTransform: "uppercase", color: C.text,
          textDecoration: "none", border: `1px solid ${C.lineBright}`, display: "inline-flex", alignItems: "center", gap: 8,
          transition: `color .3s ${CSS_EASE}, border-color .3s ${CSS_EASE}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.lineBright; }}
        >open app <span aria-hidden>→</span></a>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: `132px ${PAD} 76px` }}>
        <div className="k-hero" style={{ maxWidth: MAXW, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.08fr)", gap: 60, alignItems: "center" }}>
          <div>
            <div className="k-hero-el" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 26, border: `1px solid ${C.line}`, background: C.panel, padding: "6px 12px" }}>
              <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.accent, animation: "live-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite" }} />
                <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
              </span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>vibe code scoring</span>
            </div>

            <h1 className="k-hero-el" style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(40px, 8.2vw, 55px)", lineHeight: 1.06, letterSpacing: "-0.045em", margin: 0, marginBottom: 24, color: C.text, whiteSpace: "nowrap" }}>
              Measure how you<br /><span style={{ color: C.accent }}>actually ship.</span>
            </h1>

            <p className="k-hero-el" style={{ fontFamily: C.sans, fontSize: "clamp(16px, 1.9vw, 19px)", lineHeight: 1.6, color: C.muted, maxWidth: "46ch", margin: 0, marginBottom: 34 }}>
              Real challenges, solved on your own machine with your own AI agent. We score how you actually drive the work, not what you memorized.
            </p>

            <div className="k-hero-el" style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", marginBottom: 26 }}>
              <PrimaryButton label="Start a challenge" large />
              <GhostLink kicker="hiring?" label="set up interviews" />
            </div>

            <div className="k-hero-el" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.5 }}>
              <span>fully free</span><span style={{ color: C.line }}>/</span>
              <span>bring your own agent</span><span style={{ color: C.line }}>/</span>
              <span>claude code or cursor</span>
            </div>
          </div>

          <div className="k-hero-el k-hero-term">
            <Terminal />
            <p style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.5, marginTop: 14, textAlign: "right" }}>
              jamie.b · final <span style={{ color: C.amber }}>94/100</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section style={{ padding: `36px ${PAD}`, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", lineHeight: 1.4 }}>
            Made for developers who want to work at
          </div>
          <div style={{ width: "100%" }}>
            <LogoStrip marquee filter="brightness(0)" opacity={0.45} hoverOpacity={0.8} height={26} gap={88} speed={50} />
          </div>
        </div>
      </section>

      {/* ═══ 01 · PREMISE ═══ */}
      <section style={{ padding: `100px ${PAD}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <Marker index="01" label="the premise" />
          <div className="k-2col" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <p className="k-reveal" style={{ fontFamily: C.sans, fontSize: "clamp(21px, 2.5vw, 27px)", lineHeight: 1.45, color: C.text, margin: 0, marginBottom: 20, fontWeight: 500 }}>
                LeetCode doesn&apos;t prove much anymore. An agent clears those puzzles in seconds, so grinding them just shows you can memorize.
              </p>
              <p className="k-reveal" style={{ fontFamily: C.sans, fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.7, color: C.muted, margin: 0 }}>
                The work looks different now. You point an agent at the problem, catch it when it&apos;s confidently wrong, and check what it actually shipped. That&apos;s the skill that decides who&apos;s good, and it&apos;s what Kodwai scores, on real problems with your own agent.
              </p>
            </div>
            <aside className="k-reveal" style={{ border: `1px solid ${C.line}`, background: C.panel }}>
              <div style={{ padding: "22px 24px", borderBottom: `1px solid ${C.line}` }}>
                <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>then / the whiteboard</p>
                <p style={{ fontFamily: C.sans, fontSize: 16, lineHeight: 1.55, color: C.muted, margin: "0 0 10px" }}>&ldquo;Invert a binary tree.&rdquo; Alone, on a whiteboard, while a stranger watches the clock.</p>
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.3, margin: 0 }}>an agent does it in under five seconds.</p>
              </div>
              <div style={{ padding: "22px 24px" }}>
                <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.accent, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>now / kodwai</p>
                <p style={{ fontFamily: C.sans, fontSize: 16, lineHeight: 1.55, color: C.text, margin: "0 0 10px" }}>Drive a real agent through a real feature on your own machine.</p>
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.3, margin: 0 }}>scored on how you direct, verify, and ship.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══ 02 · HOW IT WORKS ═══ */}
      <section style={{ padding: `100px ${PAD}`, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <div className="k-2col k-reveal" style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <h2 style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 44px)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, color: C.text }}>
              From pick to <span style={{ color: C.accent }}>scored,</span> in five steps.
            </h2>
            <p style={{ fontFamily: C.sans, fontSize: 16.5, lineHeight: 1.62, color: C.muted, margin: 0, maxWidth: "42ch" }}>
              No sandbox, nothing to install. You work on your own machine with your own agent, and we score the whole session.
            </p>
          </div>
          <div data-stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {flow.map((s) => (
              <div key={s.n} className="k-item" style={{ border: `1px solid ${C.lineBright}`, background: C.panel, padding: 24, display: "flex", flexDirection: "column", boxShadow: "0 1px 2px rgba(40,24,12,0.04), 0 10px 22px -18px rgba(40,24,12,0.16)" }}>
                <span style={{ fontFamily: C.mono, fontSize: 24, fontWeight: 700, color: C.accent, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 16 }}>{s.n}</span>
                <h3 style={{ fontFamily: C.mono, fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 9px", color: C.text }}>{s.title}</h3>
                <p style={{ fontFamily: C.sans, fontSize: 14.5, lineHeight: 1.6, color: C.muted, margin: 0 }}>{s.body}</p>
                {(s.chip || s.tags) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                    {s.chip && <CodeChip>{s.chip}</CodeChip>}
                    {s.tags && s.tags.map(t => (
                      <span key={t} style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, border: `1px solid ${C.line}`, background: C.bg, padding: "6px 11px", letterSpacing: 0.4 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 · CHALLENGES ═══ */}
      <section style={{ padding: `100px ${PAD}`, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <Marker index="03" label="the challenges" />
          <div className="k-2col k-reveal" style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 56, alignItems: "end", marginBottom: 36 }}>
            <h2 style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 44px)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, color: C.text }}>
              Problems worth <span style={{ color: C.accent }}>shipping.</span>
            </h2>
            <p style={{ fontFamily: C.sans, fontSize: 16.5, lineHeight: 1.62, color: C.muted, margin: 0, maxWidth: "42ch" }}>
              {catalog.length} challenges across {cats.length} categories and three difficulties. Each one is scoped like a real ticket, not a riddle. Pick a track.
            </p>
          </div>

          {/* clickable category filter (live from the catalog) */}
          <div className="k-reveal" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
            {cats.map(([cat, n]) => (
              <CatPill key={cat} label={cat} count={n} active={effectiveCat === cat} onClick={() => setActiveCat(cat)} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${chalCols}, minmax(0, 1fr))`, gap: 16, alignItems: "stretch" }}>
            {visibleChallenges.map((c) => {
              const ds = diffStyle[c.difficulty] || diffStyle.medium;
              return (
                <a key={c.slug} href={APP_URL} style={{ display: "flex", flexDirection: "column", textDecoration: "none", border: `1px solid #d9cfba`, background: "#fffefb", padding: 22, boxShadow: "0 2px 6px rgba(26,16,8,0.07), 0 16px 30px -10px rgba(26,16,8,0.17)", transition: `border-color .3s ${CSS_EASE}, transform .3s ${CSS_EASE}, box-shadow .3s ${CSS_EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 18px 34px -12px rgba(194,54,22,0.30)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#d9cfba"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(26,16,8,0.07), 0 16px 30px -10px rgba(26,16,8,0.17)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase", color: ds.fg, background: ds.bg, padding: "3px 8px" }}>{c.difficulty}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase", color: C.faint }}>{c.category}</span>
                  </div>
                  <h3 style={{ fontFamily: C.mono, fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 10px", color: C.text, lineHeight: 1.25 }}>{c.title}</h3>
                  <p style={{ fontFamily: C.sans, fontSize: 14, lineHeight: 1.55, color: C.muted, margin: 0 }}>{c.description.length > 104 ? c.description.slice(0, 104).trimEnd() + "…" : c.description}</p>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4, marginTop: "auto", paddingTop: 16 }}>{c.minutes} min</span>
                </a>
              );
            })}
          </div>

          {inCat.length > 3 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
              <button
                type="button"
                onClick={() => setShowAllChal(v => !v)}
                aria-expanded={showAllChal}
                style={{
                  fontFamily: C.mono, fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
                  color: C.accent, background: "transparent", border: `1px solid ${C.accent}`, padding: "12px 26px",
                  display: "inline-flex", alignItems: "center", gap: 10, transition: `color .25s ${CSS_EASE}, background .25s ${CSS_EASE}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = "#faf8f4"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.accent; }}
              >
                {showAllChal ? "show fewer" : `show all ${inCat.length}`}
                <span aria-hidden>{showAllChal ? "↑" : "↓"}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ 04 · SCORING ═══ */}
      <section style={{ padding: `100px ${PAD}`, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <Marker index="04" label="the score" />
          <h2 className="k-reveal" style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 44px)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 56px", color: C.text, maxWidth: "18ch" }}>
            What the <span style={{ color: C.accent }}>score</span> actually measures.
          </h2>

          <div className="k-score" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 72, alignItems: "center" }}>
            <div className="k-reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <ScoreRing score={94} />
              <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.8, textAlign: "center", textTransform: "uppercase" }}>sample run · rate limiter</p>
            </div>

            <div className="k-dims" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44 }}>
              <div className="k-reveal">
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.6, textTransform: "uppercase", margin: "0 0 4px" }}>Objective</p>
                <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.4, margin: "0 0 22px" }}>70% · every submission</p>
                {objectiveDims.map((d) => (
                  <div key={d.name} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontFamily: C.sans, fontSize: 14, color: C.muted }}>{d.name}</span>
                      <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text }}>{d.pct}</span>
                    </div>
                    <Bar pct={d.pct} color={C.accent} />
                  </div>
                ))}
              </div>

              <div className="k-reveal">
                <p style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.6, textTransform: "uppercase", margin: "0 0 4px" }}>AI analysis</p>
                <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.4, margin: "0 0 22px" }}>30% · a deeper read</p>
                {aiDims.map((d) => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: `1px solid ${C.line}` }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
                    <span style={{ fontFamily: C.sans, fontSize: 15, color: C.text }}>{d}</span>
                  </div>
                ))}
                <p style={{ fontFamily: C.sans, fontSize: 13.5, lineHeight: 1.6, color: C.muted, margin: "18px 0 0" }}>
                  Reads your prompts, commits, and the diff to judge how you steered the agent and held the line on quality.
                </p>
              </div>
            </div>
          </div>

          <p className="k-reveal" style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.6, marginTop: 36, textAlign: "right" }}>
            scored 0 to 100 · 70% objective · 30% ai analysis
          </p>
        </div>
      </section>

      {/* ═══ 05 · CLIMB (leaderboard + badges) ═══ */}
      <section style={{ padding: `100px ${PAD}`, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <Marker index="05" label="climb" />
          <div className="k-2col k-reveal" style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <h2 style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 44px)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, color: C.text }}>
              Rank, <span style={{ color: C.accent }}>earn,</span> and prove it.
            </h2>
            <p style={{ fontFamily: C.sans, fontSize: 16.5, lineHeight: 1.62, color: C.muted, margin: 0, maxWidth: "42ch" }}>
              Every scored run moves you up the global leaderboard and builds a public profile you can send to anyone.
            </p>
          </div>

          {/* leaderboard as a ranked list */}
          <div className="k-reveal" style={{ border: `1px solid ${C.line}`, background: C.panel }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 22px", borderBottom: `1px solid ${C.line}`, flexWrap: "wrap", gap: 10 }}>
              <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text, letterSpacing: 0.4 }}>global leaderboard</span>
              <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.5 }}>difficulty-weighted · filter by agent &amp; category</span>
            </div>
            {leaderboard.map((r) => (
              <div key={r.rank} className="k-lb-row" style={{
                display: "grid", gridTemplateColumns: "44px 1fr auto auto", gap: 18, alignItems: "center", padding: "16px 22px",
                borderBottom: r.rank < leaderboard.length ? `1px solid ${C.line}` : "none",
              }}>
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {r.rank <= 3
                    ? <Image src={`/badges/rank-${r.rank}.png`} alt={`Rank ${r.rank}`} width={28} height={28} style={{ width: 28, height: 28, objectFit: "contain" }} />
                    : <span style={{ fontFamily: C.mono, fontSize: 13, color: C.faint }}>{r.rank}</span>}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
                  <span style={{ fontFamily: C.sans, fontSize: 16, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint }}>{r.handle}</span>
                </div>
                <span className="k-lb-agent" style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{r.agent}</span>
                <span style={{ fontFamily: C.mono, fontSize: 19, fontWeight: 600, color: scoreColor(r.score), textAlign: "right", whiteSpace: "nowrap" }}>
                  {r.score}<span style={{ color: C.faint, fontSize: 12, fontWeight: 400 }}> /100</span>
                </span>
              </div>
            ))}
          </div>

          {/* badges */}
          <div style={{ marginTop: 56 }}>
            <div className="k-reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
              <h3 style={{ fontFamily: C.mono, fontSize: "clamp(20px, 2.6vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0, color: C.text }}>Earn badges as you go</h3>
              <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.5, textTransform: "uppercase" }}>shareable to x &amp; linkedin</span>
            </div>
            <div data-stagger style={{ display: "grid", gridTemplateColumns: `repeat(${badgeCols}, minmax(0, 1fr))`, gap: 12 }}>
              {badges.map((b) => (
                <div key={b.slug} className="k-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, border: `1px solid ${C.lineBright}`, background: C.panel, padding: "20px 8px", minWidth: 0 }}>
                  <Image src={`/badges/${b.slug}.png`} alt={b.name} width={46} height={46} style={{ width: 46, height: 46, objectFit: "contain" }} />
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.2, lineHeight: 1.3, maxWidth: "100%", overflowWrap: "anywhere", wordBreak: "break-word" }}>{b.name}</span>
                  <div style={{ display: "flex", gap: 14, marginTop: 2 }}>
                    <ShareIcon kind="x" url={APP_URL} />
                    <ShareIcon kind="linkedin" url={APP_URL} />
                  </div>
                </div>
              ))}
            </div>
            <p className="k-reveal" style={{ fontFamily: C.sans, fontSize: 14.5, lineHeight: 1.6, color: C.muted, margin: "26px 0 0", maxWidth: "60ch" }}>
              Milestones, streaks, skill and agent badges land automatically as you submit. Your profile at <span style={{ fontFamily: C.mono, fontSize: 13, color: C.accent }}>kodwai.com/developers/you</span> shows your score, rank, badges, and the agents you drive.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FOR HIRING TEAMS (trimmed callout) ═══ */}
      <section style={{ padding: `52px ${PAD}`, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <div className="k-hiring k-reveal" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center", border: `1px solid ${C.line}`, background: C.panel, padding: "clamp(28px, 4vw, 44px)" }}>
            <div>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 1, textTransform: "uppercase" }}>for hiring teams</span>
              <h2 style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(24px, 3.4vw, 38px)", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "14px 0 14px", color: C.text }}>
                Interview the way they really work.
              </h2>
              <p style={{ fontFamily: C.sans, fontSize: 16, lineHeight: 1.6, color: C.muted, margin: 0, maxWidth: "48ch" }}>
                Run the same challenges as private interviews and watch the real process: the prompts, the commits, the tests, the score. Not just the final answer.
              </p>
              <div style={{ marginTop: 22 }}><GhostLink label="set up interviews" /></div>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
              {["Custom rubrics and time limits", "Bring your own challenges", "Replay the full agent transcript", "Shared review for your team"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 11, fontFamily: C.sans, fontSize: 15, color: C.text }}>
                  <span style={{ fontFamily: C.mono, color: C.accent, lineHeight: 1.5 }}>→</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ BEGIN (CTA) ═══ */}
      <section style={{ padding: `92px ${PAD}`, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div className="k-reveal" style={{ display: "inline-flex", alignItems: "baseline", gap: 10, marginBottom: 28 }}>
            <span style={{ fontFamily: C.mono, fontSize: 12, color: C.accent }}>{"//"}</span>
            <span style={{ fontFamily: C.mono, fontSize: 12, color: C.faint, letterSpacing: 1 }}>06</span>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 2 }}>begin</span>
          </div>
          <h2 className="k-reveal" style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(34px, 7vw, 74px)", letterSpacing: "-0.045em", lineHeight: 1.0, margin: "0 0 24px", color: C.text }}>
            Open the app.<br />Ship something <span style={{ color: C.accent }}>real.</span>
          </h2>
          <p className="k-reveal" style={{ fontFamily: C.sans, fontSize: "clamp(16px, 1.9vw, 20px)", lineHeight: 1.55, color: C.muted, maxWidth: "46ch", margin: "0 auto 46px" }}>
            Fully free. Bring your own agent and your own machine. You choose your path on the way in.
          </p>
          <div className="k-begin k-reveal" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 40, alignItems: "center", maxWidth: 680, margin: "0 auto" }}>
            <a href={APP_URL} style={{ fontFamily: C.mono, fontSize: "clamp(17px, 2.2vw, 22px)", color: C.text, textDecoration: "none", letterSpacing: "-0.01em", display: "inline-flex", flexDirection: "column", gap: 6, textAlign: "right", transition: `color .3s ${CSS_EASE}` }}
              onMouseEnter={e => { e.currentTarget.style.color = C.accent; }} onMouseLeave={e => { e.currentTarget.style.color = C.text; }}>
              <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 1, textTransform: "uppercase" }}>for developers</span>
              <span>start a challenge →</span>
            </a>
            <span aria-hidden style={{ width: 1, height: 52, background: C.line, justifySelf: "center" }} />
            <a href={APP_URL} style={{ fontFamily: C.mono, fontSize: "clamp(17px, 2.2vw, 22px)", color: C.text, textDecoration: "none", letterSpacing: "-0.01em", display: "inline-flex", flexDirection: "column", gap: 6, textAlign: "left", transition: `color .3s ${CSS_EASE}` }}
              onMouseEnter={e => { e.currentTarget.style.color = C.accent; }} onMouseLeave={e => { e.currentTarget.style.color = C.text; }}>
              <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 1, textTransform: "uppercase" }}>for hiring teams</span>
              <span>set up an interview →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: `34px ${PAD}`, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: C.serif, fontWeight: 600, fontSize: 18, letterSpacing: 0.4, color: C.text }}>kodwai</span>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.6 }}>measure real ai collaboration</span>
          </div>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            {[
              { href: "https://x.com/kodwai_com", label: "x" },
              { href: "https://discord.gg/d663XRC7", label: "discord" },
              { href: "mailto:hello@kodwai.com", label: "email" },
            ].map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", textDecoration: "none" }}>{l.label}</a>
            ))}
            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, opacity: 0.6 }}>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
