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

/* Dark palette for the inline code chips, kept dark on the light page. */
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
  { n: "05", title: "Get your score", body: "Direction, Outcome, and Lift land with per-signal evidence, so you can see why each axis scored the way it did. Then you are on the leaderboard.", chip: null, tags: null },
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

/* Scoring v2 — Lift. The score is the weighted sum of three axes:
   Direction (50), Outcome (35), Lift (15). Direction is dominant by design:
   a one-shot prompt can still pass tests, but it will lose Direction points,
   so a high score only comes from steering the agent well. */
const directionDims = [
  { name: "Intent fidelity", pct: 96 },
  { name: "Verification rigor", pct: 92 },
  { name: "Spec precision", pct: 89 },
  { name: "Decomposition", pct: 86 },
  { name: "Recovery", pct: 84 },
  { name: "Engagement", pct: 90 },
];
const outcomeDims = [
  { name: "Tests passed", pct: 100 },
  { name: "Code quality", pct: 93 },
  { name: "Complexity", pct: 88 },
];
const liftDims = [
  { name: "Edge-case coverage", pct: 82 },
];

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

/* True once the visitor has resolved the cookie banner (accept or decline),
   which is the moment it closes. Read from the `cookie_consent` cookie that
   CookieConsent writes, so a revisit (consent already stored) reads true. */
function consentResolved() {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)cookie_consent=(?:accepted|declined)/.test(document.cookie);
}

/* ─── Hero product demo (~40s, loops, has background music). Playback is
   JS-gated on cookie consent: it does NOT use the native autoplay attribute,
   so it only starts once the cookie banner is closed — and immediately on a
   revisit when consent is already stored (via the `kodwai:consent-resolved`
   event CookieConsent dispatches). A branded loading overlay (the end-of-intro
   frame) covers loading / pre-consent so there's never an empty box; it is
   removed on the first `playing`, so a later pause shows the real current
   frame. Starts muted with an unmute control; honors prefers-reduced-motion
   (manual play only) and exposes mute, full-screen, and pause controls. ─── */
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false); // a frame has actually played
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // React's `muted` prop is unreliable — enforce it imperatively
    // Don't autoplay for reduced-motion visitors; they can press play.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tryPlay = () => { v.muted = true; v.play().catch(() => {}); };
    if (consentResolved()) {
      tryPlay(); // revisit / consent already given → play now
      return;
    }
    // Fresh visitor with the banner open → wait until it's closed.
    window.addEventListener("kodwai:consent-resolved", tryPlay, { once: true });
    return () => window.removeEventListener("kodwai:consent-resolved", tryPlay);
  }, []);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {}); // unmuting is a gesture → also resume if paused
  };

  const goFullscreen = () => {
    const v = ref.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitRequestFullscreen?: () => void })
      | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS Safari
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };

  const ctrl: CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "rgba(12,12,13,0.66)", color: "#f0ece4", border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
    fontFamily: C.mono, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase",
    padding: "7px 11px", cursor: "pointer", lineHeight: 1,
  };

  return (
    <div style={{ position: "relative" }}>
      {/* warm glow behind the frame */}
      <div aria-hidden style={{ position: "absolute", inset: "-6% -3% -9%", background: "radial-gradient(58% 62% at 50% 30%, rgba(194,54,22,0.10), transparent 72%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, border: `1px solid ${C.lineBright}`, background: C.panel, overflow: "hidden", boxShadow: "0 34px 80px -34px rgba(40,22,10,0.45), 0 2px 12px -5px rgba(40,22,10,0.18)" }}>
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="auto"
          poster="/kodwai-demo-intro.jpg"
          disablePictureInPicture
          onPlaying={() => setStarted(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label="A walkthrough of kodwai: browse a challenge, solve it with Claude Code in the terminal, submit, then see the score and the leaderboard."
          style={{ display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", background: C.bg }}
        >
          <source src="/kodwai-demo.webm" type="video/webm" />
          <source src="/kodwai-demo.mp4" type="video/mp4" />
        </video>

        {/* loading / pre-consent overlay — the end-of-intro frame. Removed on
            the first `playing`, so a later pause shows the real current frame. */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            backgroundImage: "url(/kodwai-demo-intro.jpg)", backgroundSize: "cover", backgroundPosition: "center",
            opacity: started ? 0 : 1, transition: `opacity .5s ${CSS_EASE}`,
          }}
        />

        {/* controls — always visible so they work on touch / mobile */}
        <div style={{ position: "absolute", right: 12, bottom: 12, zIndex: 2, display: "flex", gap: 8 }}>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute the demo" : "Mute the demo"} style={ctrl}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              {muted ? (
                <>
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              ) : (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              )}
            </svg>
            <span>{muted ? "unmute" : "mute"}</span>
          </button>
          <button type="button" onClick={goFullscreen} aria-label="Watch full screen" style={ctrl}>
            <span aria-hidden style={{ fontSize: 12 }}>⛶</span>
            <span>full screen</span>
          </button>
          <button type="button" onClick={togglePlay} aria-label={playing ? "Pause the demo" : "Play the demo"} style={ctrl}>
            <span aria-hidden style={{ fontSize: 9 }}>{playing ? "❚❚" : "▶"}</span>
            <span>{playing ? "pause" : "play"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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

      <main>
      {/* ═══ HERO ═══ */}
      <section style={{ padding: `126px ${PAD} 88px` }}>
        {/* title block, centered */}
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <div className="k-hero-el" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 26, border: `1px solid ${C.line}`, background: C.panel, padding: "6px 12px" }}>
            <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.accent, animation: "live-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite" }} />
              <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>vibe code scoring</span>
          </div>

          <h1 className="k-hero-el" style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(33px, 8vw, 68px)", lineHeight: 1.05, letterSpacing: "-0.045em", margin: "0 auto 22px", color: C.text, textWrap: "balance" }}>
            Measure How You Actually <span style={{ color: C.accent, whiteSpace: "nowrap" }}>Vibe Code</span>
          </h1>

          <p className="k-hero-el" style={{ fontFamily: C.sans, fontSize: "clamp(15px, 1.9vw, 20px)", lineHeight: 1.6, color: C.muted, maxWidth: "54ch", margin: "0 auto 32px", textWrap: "pretty" }}>
            Real challenges, solved on your own machine with your own AI agent. We score how you actually drive the work, not what you memorized.
          </p>

          <div className="k-hero-el k-hero-actions" style={{ marginBottom: 22 }}>
            <PrimaryButton label="Start a challenge" large />
            <GhostLink kicker="hiring?" label="set up interviews" />
          </div>

          <div className="k-hero-el" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap", fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.5 }}>
            <span>fully free</span><span style={{ color: C.line }}>/</span>
            <span className="k-byoa">bring your own agent</span><span className="k-byoa" style={{ color: C.line }}>/</span>
            <span>claude code or cursor</span>
          </div>
        </div>

        {/* looping product demo, below the fold-line */}
        <div className="k-hero-el" style={{ maxWidth: MAXW, margin: "62px auto 0" }}>
          <HeroVideo />
          <p style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.5, margin: "14px 0 0", textAlign: "center" }}>
            browse → solve with your agent → submit → score
          </p>
        </div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section style={{ padding: `36px ${PAD}`, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <div style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 500, color: C.text, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", lineHeight: 2 }}>
            Made for developers who want to work at
          </div>
          <div style={{ width: "100%" }}>
            <LogoStrip marquee filter="brightness(0)" opacity={0.45} hoverOpacity={0.8} height={26} gap={88} mobileGap={38} speed={50} />
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
          <div className="k-2col k-reveal" style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 56, alignItems: "end", marginBottom: 56 }}>
            <h2 style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 44px)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, color: C.text, maxWidth: "22ch" }}>
              What the <span style={{ color: C.accent }}>score</span> actually measures.
            </h2>
            <p style={{ fontFamily: C.sans, fontSize: 16.5, lineHeight: 1.62, color: C.muted, margin: 0, maxWidth: "44ch" }}>
              A one-shot &ldquo;solve this&rdquo; prompt clears tests, so passing tests is not enough. The score is dominated by how you direct the agent, the part a careless prompt can&apos;t fake.
            </p>
          </div>

          <div className="k-score" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 64, alignItems: "start" }}>
            <div className="k-reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <ScoreRing score={91} />
              <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.8, textAlign: "center", textTransform: "uppercase" }}>sample run · rate limiter</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4, fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 0.4 }}>
                <span><span style={{ color: C.accent }}>direction</span> 45 / 50</span>
                <span><span style={{ color: C.accent }}>outcome</span> 31 / 35</span>
                <span><span style={{ color: C.accent }}>lift</span> 12 / 15</span>
              </div>
            </div>

            <div className="k-dims" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 44 }}>
              <div className="k-reveal">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <p style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.6, textTransform: "uppercase", margin: 0 }}>Direction</p>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 0.4 }}>50 pts</span>
                </div>
                <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.4, margin: "0 0 22px" }}>how you drive the agent</p>
                {directionDims.map((d) => (
                  <div key={d.name} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontFamily: C.sans, fontSize: 14, color: C.muted }}>{d.name}</span>
                      <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text }}>{d.pct}</span>
                    </div>
                    <Bar pct={d.pct} color={C.accent} />
                  </div>
                ))}
              </div>

              <div className="k-reveal" style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <p style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.6, textTransform: "uppercase", margin: 0 }}>Outcome</p>
                    <span style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 0.4 }}>35 pts</span>
                  </div>
                  <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.4, margin: "0 0 18px" }}>what you actually shipped</p>
                  {outcomeDims.map((d) => (
                    <div key={d.name} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ fontFamily: C.sans, fontSize: 14, color: C.muted }}>{d.name}</span>
                        <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text }}>{d.pct}</span>
                      </div>
                      <Bar pct={d.pct} color={C.accent} />
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <p style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.6, textTransform: "uppercase", margin: 0 }}>Lift</p>
                    <span style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 0.4 }}>15 pts</span>
                  </div>
                  <p style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.4, margin: "0 0 18px" }}>edges a one-shot misses</p>
                  {liftDims.map((d) => (
                    <div key={d.name} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ fontFamily: C.sans, fontSize: 14, color: C.muted }}>{d.name}</span>
                        <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text }}>{d.pct}</span>
                      </div>
                      <Bar pct={d.pct} color={C.accent} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="k-reveal" style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.6, marginTop: 36, textAlign: "right" }}>
            scored 0 to 100 · direction 50 · outcome 35 · lift 15 · every signal cites its evidence
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
      </main>

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
