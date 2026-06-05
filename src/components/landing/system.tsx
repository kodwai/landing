"use client";

/* ══════════════════════════════════════════════════════════════════════════
   kodwai landing — shared design system  ("editorial instrument", v2)

   THE SYSTEM IN ONE BREATH
   ────────────────────────
   Warm-light cream page (matches the app), Outship-grade editorial layout:
   big Fraunces serif headlines carry the emotion, JetBrains Mono carries the
   machine voice (markers, labels, data, terminal), Hanken Grotesk carries the
   prose. A single rust accent. Two full-bleed WARM-DARK bands punctuate the
   page (the hero product frame and the vibe-showcase / hiring bands) for
   Outship-style drama. Square corners, hairline rules, generous air. Motion is
   anime.js, declarative via classNames, always gated behind reduced-motion.

   THREE PALETTES
   ──────────────
   • C  — light page (cream / ink / rust). Default everywhere.
   • D  — dark band (warm near-black / cream text / brighter rust). Full-bleed
          punctuation bands only.
   • T  — terminal / inline code chrome (darkest, component-scoped).

   EVERY SECTION imports from THIS file only. Do not invent new tokens, do not
   re-import anime/posthog config, do not touch globals.css / page.tsx.
   ══════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import anime from "animejs";
import posthog from "posthog-js";

/* ─── Palettes ─────────────────────────────────────────────────────────── */

/** Light page palette — cream paper, ink, rust. The default. */
export const C = {
  bg: "#faf8f4",         // cream paper (app background)
  paper2: "#f3efe8",     // subtle section tint
  paper3: "#efe9df",     // a touch deeper, for nested wells
  panel: "#fffdf9",      // near-white warm card lift
  line: "#e4e0d8",       // hairline border / beige
  lineBright: "#d6cfc1", // stronger rule
  text: "#1a1a1a",       // ink
  muted: "#6f695f",      // readable secondary text
  faint: "#736d63",      // labels, captions
  accent: "#c23616",     // rust (app brand)
  accentDeep: "#a82d12", // rust hover
  accentSoft: "rgba(194,54,22,0.10)",
  green: "#1f9d55",      // pass signal on light
  amber: "#cf8a1a",      // score-mid on light
  mono: "var(--font-mono-jb)",
  sans: "var(--font-grotesk)",
  serif: "var(--font-serif-fr)",
} as const;

/** Dark band palette — warm near-black, cream text, brighter rust. */
export const D = {
  bg: "#0e0d0c",
  bg2: "#100f0e",
  panel: "#161514",
  elevated: "#1c1a18",
  line: "#272522",
  lineBright: "#37332d",
  text: "#ece9e2",
  muted: "#a39d92",
  faint: "#8a857c",
  accent: "#ff6a45",
  accentDeep: "#d2502c",
  accentSoft: "rgba(255,106,69,0.12)",
  green: "#5fd68a",
  amber: "#f3b03a",
  mono: "var(--font-mono-jb)",
  sans: "var(--font-grotesk)",
  serif: "var(--font-serif-fr)",
} as const;

/** Terminal / inline-code chrome — darkest, component-scoped. */
export const T = {
  bg: "#0a0a0b",
  header: "#141315",
  line: "#242426",
  text: "#cbc7bf",
  faint: "#5a5852",
  prompt: "#ff6b4a",
  agent: "#4ade80",
  green: "#4ade80",
  amber: "#fbbf24",
} as const;

export type Palette = typeof C | typeof D;

/* ─── Constants ────────────────────────────────────────────────────────── */

export const APP_URL = "https://app.kodwai.com";
export const EASE = "cubicBezier(0.16, 1, 0.3, 1)";
export const CSS_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const MAXW = 1160;
export const PAD = "clamp(20px, 5vw, 56px)";

/** Vertical rhythm for a major section. */
export const SECTION_PAD = "clamp(80px, 11vw, 132px)";

/* ─── Type scale (apply as inline style, keeps the two-voice split honest) ─ */
export const TYPE = {
  /** Fraunces display — hero h1 + closing CTA. */
  display: {
    fontFamily: C.serif, fontWeight: 420, fontSize: "clamp(42px, 7.6vw, 88px)",
    lineHeight: 1.0, letterSpacing: "-0.018em", fontStyle: "normal",
  } as CSSProperties,
  /** Fraunces section headline. */
  h2: {
    fontFamily: C.serif, fontWeight: 430, fontSize: "clamp(30px, 4.7vw, 56px)",
    lineHeight: 1.04, letterSpacing: "-0.018em",
  } as CSSProperties,
  /** Fraunces sub-headline / card group title. */
  h3: {
    fontFamily: C.serif, fontWeight: 440, fontSize: "clamp(22px, 3vw, 33px)",
    lineHeight: 1.1, letterSpacing: "-0.01em",
  } as CSSProperties,
  /** Mono machine title (titles inside cards, when you want the technical voice). */
  monoTitle: {
    fontFamily: C.mono, fontWeight: 600, fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.2, letterSpacing: "-0.02em",
  } as CSSProperties,
  body: {
    fontFamily: C.sans, fontWeight: 400, fontSize: "clamp(15px, 1.85vw, 18px)",
    lineHeight: 1.62,
  } as CSSProperties,
  bodyLg: {
    fontFamily: C.sans, fontWeight: 400, fontSize: "clamp(16.5px, 2.1vw, 20.5px)",
    lineHeight: 1.58,
  } as CSSProperties,
  label: {
    fontFamily: C.mono, fontWeight: 500, fontSize: 11, letterSpacing: "0.14em",
    textTransform: "uppercase",
  } as CSSProperties,
} as const;

export const diffStyle: Record<string, { bg: string; fg: string }> = {
  easy: { bg: "rgba(31,157,85,0.12)", fg: "#1a7f44" },
  medium: { bg: "rgba(207,138,26,0.16)", fg: "#9a6206" },
  hard: { bg: "rgba(194,54,22,0.12)", fg: "#c23616" },
};

export function scoreColor(s: number, p: Palette = C) {
  return s >= 70 ? p.green : s >= 50 ? p.amber : p.faint;
}

/** True once the visitor has resolved the cookie banner (used to gate the demo). */
export function consentResolved() {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)cookie_consent=(?:accepted|declined)/.test(document.cookie);
}

export function track(event: string, props?: Record<string, unknown>) {
  try { posthog.capture(event, props); } catch { /* noop */ }
}

function reduced() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ══════════════════════════════════════════════════════════════════════════
   MOTION
   ──────
   One global driver, called once in LandingPage. Sections opt in declaratively:
     • class "k-hero-el"      → first-paint load stagger (hero only)
     • class "k-reveal"       → fade-up when scrolled into view (single element)
     • attr  data-stagger     → its ".k-item" children fade-up in a stagger
     • attr  data-draw        → SVG paths inside draw on (stroke-dashoffset)
   Counter / Bar / ScoreRing / Doodle self-animate via their own observers.
   Everything is a no-op under prefers-reduced-motion (content stays visible).
   ══════════════════════════════════════════════════════════════════════════ */
export function useChoreography() {
  useEffect(() => {
    if (typeof window === "undefined" || reduced()) return;

    const heroEls = Array.from(document.querySelectorAll<HTMLElement>(".k-hero-el"));
    if (heroEls.length) {
      anime.set(heroEls, { opacity: 0, translateY: 18 });
      anime({ targets: heroEls, opacity: [0, 1], translateY: [18, 0], delay: anime.stagger(80, { start: 120 }), duration: 840, easing: EASE });
    }

    const singles = Array.from(document.querySelectorAll<HTMLElement>(".k-reveal"));
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-stagger]"));
    anime.set(singles, { opacity: 0, translateY: 26 });
    groups.forEach(g => anime.set(g.querySelectorAll<HTMLElement>(".k-item"), { opacity: 0, translateY: 26 }));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        if (el.hasAttribute("data-stagger")) {
          anime({ targets: el.querySelectorAll(".k-item"), opacity: [0, 1], translateY: [26, 0], delay: anime.stagger(64), duration: 720, easing: EASE });
        } else {
          anime({ targets: el, opacity: [0, 1], translateY: [26, 0], duration: 800, easing: EASE });
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    [...singles, ...groups].forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);
}

/** Responsive column count, computed in JS (SSR-safe: starts desktop, adjusts on mount). */
export function useResponsiveCols(desktop: number, tablet: number, mobile: number) {
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

/** True when viewport width <= bp (SSR-safe: false until mount). */
export function useMediaMax(bp: number) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const apply = () => setM(window.innerWidth <= bp);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [bp]);
  return m;
}

/** Draw every <path>/<line>/<polyline> inside the ref on scroll-into-view. */
export function useDrawOnView<E extends SVGElement>(opts?: { duration?: number; delay?: number }) {
  const ref = useRef<E>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paths = Array.from(el.querySelectorAll<SVGGeometryElement>("path,line,polyline,circle,rect"));
    if (!paths.length) return;
    const setup = paths.map(p => {
      const len = typeof p.getTotalLength === "function" ? p.getTotalLength() : 0;
      return { p, len };
    });
    if (reduced()) return; // leave fully drawn
    setup.forEach(({ p, len }) => { if (len) { p.style.strokeDasharray = String(len); p.style.strokeDashoffset = String(len); } });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      anime({ targets: setup.filter(s => s.len).map(s => s.p), strokeDashoffset: [anime.setDashoffset, 0], duration: opts?.duration ?? 1100, delay: anime.stagger(opts?.delay ?? 90), easing: EASE });
      io.unobserve(el);
    }), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [opts?.duration, opts?.delay]);
  return ref;
}

/* ══════════════════════════════════════════════════════════════════════════
   LAYOUT PRIMITIVES
   ══════════════════════════════════════════════════════════════════════════ */

/** Full-bleed background section. tone picks the surface; cream is default. */
export function Band({
  tone = "cream", first = false, hairline = true, children, style, id,
}: {
  tone?: "cream" | "paper2" | "dark";
  first?: boolean;
  hairline?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  id?: string;
}) {
  const bg = tone === "dark" ? D.bg : tone === "paper2" ? C.paper2 : C.bg;
  const border = tone === "dark" ? D.line : C.line;
  return (
    <section
      id={id}
      style={{
        background: bg,
        position: "relative",
        padding: `${SECTION_PAD} ${PAD}`,
        borderTop: hairline && !first ? `1px solid ${border}` : undefined,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

/** Centered max-width container. */
export function Inner({ children, narrow, style }: { children: ReactNode; narrow?: boolean; style?: CSSProperties }) {
  return <div style={{ maxWidth: narrow ? 880 : MAXW, margin: "0 auto", position: "relative", ...style }}>{children}</div>;
}

/* ── Section marker: // 01 · the premise ── */
export function Marker({ index, label, tone = "light" }: { index: string; label: string; tone?: "light" | "dark" }) {
  const p = tone === "dark" ? D : C;
  return (
    <div className="k-reveal" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
      <span style={{ fontFamily: p.mono, fontSize: 12, color: p.accent, letterSpacing: 0.5 }}>{"//"}</span>
      <span style={{ fontFamily: p.mono, fontSize: 12, color: p.faint, letterSpacing: 1 }}>{index}</span>
      <span style={{ fontFamily: p.mono, fontSize: 11, color: p.muted, textTransform: "lowercase", letterSpacing: 2 }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: p.line }} aria-hidden />
    </div>
  );
}

/* ── Eyebrow pill with a live pulse dot ── */
export function Eyebrow({ label, tone = "light" }: { label: string; tone?: "light" | "dark" }) {
  const p = tone === "dark" ? D : C;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${p.line}`, background: tone === "dark" ? D.panel : C.panel, padding: "6px 13px" }}>
      <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: p.accent, animation: "live-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite" }} />
        <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: p.accent }} />
      </span>
      <span style={{ fontFamily: p.mono, fontSize: 11, color: p.muted, letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</span>
    </span>
  );
}

/* ── Serif headline with one rust accent span (Outship-grade editorial) ── */
export function Serif({
  children, as: As = "h2", size = "h2", tone = "light", style, className,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  size?: "display" | "h2" | "h3";
  tone?: "light" | "dark";
  style?: CSSProperties;
  className?: string;
}) {
  const p = tone === "dark" ? D : C;
  return <As className={className} style={{ ...TYPE[size], color: p.text, margin: 0, textWrap: "balance", ...style }}>{children}</As>;
}
/** Rust accent word/phrase inside a Serif headline. */
export function Accent({ children, tone = "light", italic = true }: { children: ReactNode; tone?: "light" | "dark"; italic?: boolean }) {
  const p = tone === "dark" ? D : C;
  return <span style={{ color: p.accent, fontStyle: italic ? "italic" : "normal" }}>{children}</span>;
}

/* ══════════════════════════════════════════════════════════════════════════
   BUTTONS
   ══════════════════════════════════════════════════════════════════════════ */

/** Primary rust button (the one filled CTA). Magnetic nudge + arrow. */
export function PrimaryButton({ label, large, href = APP_URL, event = "cta_clicked", eventProps, tone = "light" }:
  { label: string; large?: boolean; href?: string; event?: string; eventProps?: Record<string, unknown>; tone?: "light" | "dark" }) {
  const [h, setH] = useState(false);
  const p = tone === "dark" ? D : C;
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => track(event, { label, ...eventProps })} style={{
      display: "inline-flex", alignItems: "center", gap: 12, background: h ? p.accentDeep : p.accent, color: "#fbf7f0",
      fontFamily: p.mono, fontWeight: 700, fontSize: large ? 13 : 12, padding: large ? "16px 28px" : "12px 22px",
      textDecoration: "none", textTransform: "uppercase", letterSpacing: 2, whiteSpace: "nowrap", border: `1px solid ${p.accent}`,
      transition: `background .35s ${CSS_EASE}, transform .35s ${CSS_EASE}, box-shadow .35s ${CSS_EASE}`,
      transform: h ? "translateY(-2px)" : "translateY(0)",
      boxShadow: h ? `0 16px 34px -12px ${tone === "dark" ? "rgba(255,106,69,0.5)" : "rgba(194,54,22,0.55)"}` : `0 4px 16px -8px ${tone === "dark" ? "rgba(255,106,69,0.4)" : "rgba(194,54,22,0.4)"}`,
    }}>
      <span>{label}</span>
      <span style={{ display: "inline-block", transform: h ? "translateX(5px)" : "translateX(0)", transition: `transform .35s ${CSS_EASE}` }}>→</span>
    </a>
  );
}

/** Light/cream filled button (Outship "Book a Demo" on dark, or a quiet light CTA). */
export function LightButton({ label, href = APP_URL, event = "cta_clicked", eventProps, tone = "dark" }:
  { label: string; href?: string; event?: string; eventProps?: Record<string, unknown>; tone?: "light" | "dark" }) {
  const [h, setH] = useState(false);
  const fill = tone === "dark" ? D.text : C.text;
  const fg = tone === "dark" ? D.bg : C.bg;
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => track(event, { label, ...eventProps })} style={{
      display: "inline-flex", alignItems: "center", gap: 11, background: fill, color: fg, opacity: h ? 0.9 : 1,
      fontFamily: C.mono, fontWeight: 700, fontSize: 12, padding: "14px 26px", textDecoration: "none",
      textTransform: "uppercase", letterSpacing: 1.6, whiteSpace: "nowrap", border: `1px solid ${fill}`,
      transition: `opacity .3s ${CSS_EASE}, transform .3s ${CSS_EASE}`, transform: h ? "translateY(-2px)" : "translateY(0)",
    }}>
      <span>{label}</span>
      <span style={{ display: "inline-block", transform: h ? "translateX(4px)" : "translateX(0)", transition: `transform .3s ${CSS_EASE}` }}>→</span>
    </a>
  );
}

/** Ghost link with optional kicker. */
export function GhostLink({ label, kicker, href = APP_URL, event = "cta_clicked", eventProps, tone = "light" }:
  { label: string; kicker?: string; href?: string; event?: string; eventProps?: Record<string, unknown>; tone?: "light" | "dark" }) {
  const [h, setH] = useState(false);
  const p = tone === "dark" ? D : C;
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => track(event, { label, kicker, ...eventProps })} style={{
      display: "inline-flex", alignItems: "center", gap: 10, fontFamily: p.mono, fontSize: 12, letterSpacing: 1,
      textTransform: "uppercase", color: h ? p.accent : p.muted, textDecoration: "none", transition: `color .3s ${CSS_EASE}`,
    }}>
      {kicker && <span style={{ color: p.faint }}>{kicker}</span>}
      <span>{label}</span>
      <span style={{ display: "inline-block", transform: h ? "translateX(4px)" : "translateX(0)", transition: `transform .3s ${CSS_EASE}` }}>→</span>
    </a>
  );
}

/* ── Outline button (quiet secondary action) ── */
export function OutlineButton({ label, href = APP_URL, event = "cta_clicked", eventProps, tone = "light", icon }:
  { label: string; href?: string; event?: string; eventProps?: Record<string, unknown>; tone?: "light" | "dark"; icon?: ReactNode }) {
  const p = tone === "dark" ? D : C;
  return (
    <a href={href} onClick={() => track(event, { label, ...eventProps })} style={{
      fontFamily: p.mono, fontSize: 11, padding: "11px 20px", letterSpacing: 1.4, textTransform: "uppercase", color: p.text,
      textDecoration: "none", border: `1px solid ${p.lineBright}`, display: "inline-flex", alignItems: "center", gap: 9, whiteSpace: "nowrap",
      transition: `color .3s ${CSS_EASE}, border-color .3s ${CSS_EASE}`,
    }}
      onMouseEnter={e => { e.currentTarget.style.color = p.accent; e.currentTarget.style.borderColor = p.accent; }}
      onMouseLeave={e => { e.currentTarget.style.color = p.text; e.currentTarget.style.borderColor = p.lineBright; }}>
      {icon}<span>{label}</span><span aria-hidden>→</span>
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DATA-VIZ PRIMITIVES
   ══════════════════════════════════════════════════════════════════════════ */

/** Count-up numeral, fires once on view. */
export function Counter({ to, duration = 1500, decimals = 0, style }: { to: number; duration?: number; decimals?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fmt = (v: number) => decimals ? v.toFixed(decimals) : String(Math.round(v));
    if (reduced()) { el.textContent = fmt(to); return; }
    const obj = { v: 0 }; let played = false;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !played) {
        played = true;
        anime({ targets: obj, v: to, duration, easing: EASE, update: () => { el.textContent = fmt(obj.v); } });
        io.unobserve(el);
      }
    }), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, decimals]);
  return <span ref={ref} style={style}>{decimals ? (0).toFixed(decimals) : "0"}</span>;
}

/** Horizontal meter bar, grows from 0 on view. */
export function Bar({ pct, color = C.accent, track: trackColor = C.line, height = 4 }: { pct: number; color?: string; track?: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduced()) { el.style.transform = `scaleX(${pct / 100})`; return; }
    el.style.transform = "scaleX(0)";
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { anime({ targets: el, scaleX: [0, pct / 100], duration: 950, easing: EASE }); io.unobserve(el); }
    }), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);
  return (
    <div style={{ height, background: trackColor, position: "relative", overflow: "hidden", borderRadius: 2 }}>
      <div ref={ref} style={{ position: "absolute", inset: 0, background: color, transformOrigin: "left", transform: `scaleX(${pct / 100})`, borderRadius: 2 }} />
    </div>
  );
}

/** Circular score ring with count-up. */
export function ScoreRing({ score = 94, size = 168, tone = "light" }: { score?: number; size?: number; tone?: "light" | "dark" }) {
  const p = tone === "dark" ? D : C;
  const ref = useRef<SVGCircleElement>(null);
  const r = size / 2 - 9;
  const circ = 2 * Math.PI * r;
  const color = scoreColor(score, p);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.strokeDasharray = String(circ);
    const target = circ * (1 - score / 100);
    if (reduced()) { el.style.strokeDashoffset = String(target); return; }
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.line} strokeWidth={8} />
        <circle ref={ref} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: p.mono, fontWeight: 700, fontSize: size * 0.31, color: p.text, lineHeight: 1 }}><Counter to={score} /></span>
        <span style={{ fontFamily: p.mono, fontSize: 11, color: p.faint, letterSpacing: 1, marginTop: 4 }}>/ 100</span>
      </div>
    </div>
  );
}

/** Big editorial stat: serif numeral + mono caption. */
export function Stat({ value, suffix, prefix, caption, tone = "light", decimals = 0, count = true }:
  { value: number | string; suffix?: string; prefix?: string; caption: string; tone?: "light" | "dark"; decimals?: number; count?: boolean }) {
  const p = tone === "dark" ? D : C;
  return (
    <div className="k-item" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ ...TYPE.display, fontSize: "clamp(40px, 6vw, 72px)", color: p.text, lineHeight: 0.95 }}>
        {prefix}{typeof value === "number" && count ? <Counter to={value} decimals={decimals} /> : value}{suffix}
      </span>
      <span style={{ fontFamily: p.sans, fontSize: 15, lineHeight: 1.5, color: p.muted, maxWidth: "26ch" }}>{caption}</span>
    </div>
  );
}

/* ── Inline code chip (dark on the light page) ── */
export function CodeChip({ children, prompt = "$" }: { children: ReactNode; prompt?: string }) {
  return (
    <code className="hide-scrollbar" style={{
      fontFamily: C.mono, fontSize: 12.5, background: T.bg, color: "#e8e6e1", border: `1px solid ${T.line}`,
      padding: "8px 13px", display: "inline-flex", alignItems: "center", gap: 9, maxWidth: "100%", overflowX: "auto", whiteSpace: "nowrap",
    }}>
      {prompt && <span style={{ color: T.prompt }}>{prompt}</span>}{children}
    </code>
  );
}

/* ── Social share icon ── */
export function ShareIcon({ kind, url, tone = "light" }: { kind: "x" | "linkedin"; url: string; tone?: "light" | "dark" }) {
  const [h, setH] = useState(false);
  const p = tone === "dark" ? D : C;
  const hoverColor = tone === "dark" ? p.text : (kind === "x" ? "#000000" : "#0A66C2");
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={kind === "x" ? "Share on X" : "Share on LinkedIn"}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", color: h ? hoverColor : p.faint, transition: `color .2s ${CSS_EASE}` }}>
      {kind === "x"
        ? <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        : <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>}
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HAND-DRAWN DOODLES (editorial line-art, draw-on-view)
   kind: arrow | squiggle | underline | loop | star | bracket
   ══════════════════════════════════════════════════════════════════════════ */
export function Doodle({ kind, color, width = 120, height = 60, strokeWidth = 2.2, style, tone = "light" }:
  { kind: "arrow" | "squiggle" | "underline" | "loop" | "star" | "bracket"; color?: string; width?: number; height?: number; strokeWidth?: number; style?: CSSProperties; tone?: "light" | "dark" }) {
  const stroke = color ?? (tone === "dark" ? D.accent : C.accent);
  const ref = useDrawOnView<SVGSVGElement>({ duration: 900 });
  const paths: Record<string, ReactNode> = {
    arrow: <><path d="M6 40 C 40 10, 80 10, 112 30" /><path d="M112 30 L 100 22 M112 30 L 102 40" /></>,
    squiggle: <path d="M4 30 Q 20 10, 36 30 T 68 30 T 100 30 T 132 30" />,
    underline: <path d="M4 18 C 40 30, 90 30, 156 14" />,
    loop: <path d="M20 40 C 0 20, 30 4, 50 18 S 90 44, 100 22" />,
    star: <><path d="M30 6 L 30 54 M6 30 L 54 30 M13 13 L 47 47 M47 13 L 13 47" /></>,
    bracket: <path d="M40 6 C 18 6, 18 30, 18 30 C 18 30, 18 54, 40 54" />,
  };
  return (
    <svg ref={ref} width={width} height={height} viewBox={`0 0 ${kind === "star" || kind === "bracket" ? 60 : kind === "squiggle" || kind === "underline" ? 160 : 120} 60`}
      fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={style}>
      {paths[kind]}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HERO PRODUCT DEMO VIDEO (proven, reused)
   Looping ~40s walkthrough: muted inline autoplay (no consent gate), a
   loading spinner, a tap-to-play fallback if autoplay is blocked, an error
   fallback, plus mute / fullscreen / play controls. Honors reduced-motion.
   Accepts a `tone` so it can sit on a dark band.
   ══════════════════════════════════════════════════════════════════════════ */
export function HeroVideo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);
  const [failed, setFailed] = useState(false);
  const p = tone === "dark" ? D : C;

  // Make the demo START RELIABLY. The <video> carries the autoPlay attribute
  // (the most reliable muted-autoplay trigger) AND we retry play() from every
  // signal that can mean "ready or visible": loadeddata, canplay, intersection,
  // tab focus, plus a couple of timed kicks. No cookie-consent gate. Muted +
  // loop, so autoplay is permitted in every modern browser. Only if play()
  // genuinely rejects do we surface a tap-to-play button.
  useEffect(() => {
    const v = ref.current; if (!v) return;
    v.muted = true;
    let ok = false;
    const attempt = () => {
      if (!v) return;
      v.muted = true;
      const pr = v.play();
      if (pr && typeof pr.then === "function") {
        pr.then(() => { ok = true; setNeedsTap(false); }).catch(() => { if (!ok) setNeedsTap(true); });
      }
    };
    const onReady = () => { setLoading(false); attempt(); };
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    v.addEventListener("canplaythrough", onReady);
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) attempt(); }), { threshold: 0.25 });
    io.observe(v);
    const onVis = () => { if (document.visibilityState === "visible") attempt(); };
    document.addEventListener("visibilitychange", onVis);
    if (v.readyState >= 2) onReady();
    const t1 = window.setTimeout(attempt, 300);
    const t2 = window.setTimeout(attempt, 1200);
    return () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("canplaythrough", onReady);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.clearTimeout(t1); window.clearTimeout(t2);
    };
  }, []);

  const userPlay = () => { const v = ref.current; if (!v) return; v.play().then(() => { setNeedsTap(false); track("demo_video_interacted", { action: "tap_play" }); }).catch(() => {}); };
  const togglePlay = () => { const v = ref.current; if (!v) return; if (v.paused) { v.play().catch(() => {}); track("demo_video_interacted", { action: "play" }); } else { v.pause(); track("demo_video_interacted", { action: "pause" }); } };
  const toggleMute = () => { const v = ref.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); track("demo_video_interacted", { action: v.muted ? "mute" : "unmute" }); if (!v.muted) v.play().catch(() => {}); };
  const goFullscreen = () => {
    const v = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitRequestFullscreen?: () => void }) | null;
    if (!v) return;
    track("demo_video_interacted", { action: "fullscreen" });
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };

  const ctrl: CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "rgba(8,8,9,0.7)", color: "#f0ece4", border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
    fontFamily: C.mono, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase",
    padding: "7px 11px", cursor: "pointer", lineHeight: 1,
  };
  const frameBorder = tone === "dark" ? D.lineBright : C.lineBright;
  const frameBg = tone === "dark" ? D.panel : C.panel;
  const showPlay = !loading && !failed && needsTap;

  return (
    <div style={{ position: "relative" }}>
      <style>{`@keyframes k-vspin { to { transform: rotate(360deg); } }`}</style>
      <div aria-hidden style={{ position: "absolute", inset: "-6% -3% -9%", background: `radial-gradient(58% 62% at 50% 30%, ${tone === "dark" ? "rgba(255,106,69,0.16)" : "rgba(194,54,22,0.10)"}, transparent 72%)`, zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, border: `1px solid ${frameBorder}`, background: frameBg, overflow: "hidden", boxShadow: tone === "dark" ? "0 40px 90px -40px rgba(0,0,0,0.8)" : "0 34px 80px -34px rgba(40,22,10,0.45), 0 2px 12px -5px rgba(40,22,10,0.18)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url(/kodwai-demo-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/kodwai-demo-poster.jpg"
          disablePictureInPicture
          onLoadedData={() => setLoading(false)}
          onCanPlay={() => setLoading(false)}
          onWaiting={() => setLoading(true)}
          onPlaying={() => { setLoading(false); setPlaying(true); setNeedsTap(false); }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => { setFailed(true); setLoading(false); }}
          aria-label="A walkthrough of kodwai: browse a challenge, solve it with Claude Code in the terminal, submit, then see the score and the leaderboard."
          style={{ position: "relative", zIndex: 1, display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", background: "transparent" }}
        >
          <source src="/kodwai-demo.mp4?v=2026-05-28" type="video/mp4" />
          <source src="/kodwai-demo.webm?v=2026-05-28" type="video/webm" />
        </video>

        {loading && !failed && (
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(8,8,9,0.30)" }}>
            <svg width="34" height="34" viewBox="0 0 50 50" style={{ animation: "k-vspin 0.9s linear infinite" }}>
              <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
              <circle cx="25" cy="25" r="20" fill="none" stroke="#ff6a45" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 150" />
            </svg>
            <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: "#f0ece4" }}>loading demo</span>
          </div>
        )}

        {showPlay && (
          <button type="button" onClick={userPlay} aria-label="Play the demo" style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", background: "rgba(8,8,9,0.26)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(194,54,22,0.95)", boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5)" }}>
              <span aria-hidden style={{ color: "#fbf7f0", fontSize: 26, marginLeft: 4 }}>▶</span>
            </span>
          </button>
        )}

        {failed && (
          <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: 24, background: "rgba(8,8,9,0.64)" }}>
            <span style={{ fontFamily: C.sans, fontSize: 15, color: "#f0ece4", maxWidth: "34ch", lineHeight: 1.5 }}>The demo could not load here. You can watch it live inside the app.</span>
            <a href={APP_URL} onClick={() => track("demo_video_interacted", { action: "fallback_open_app" })} style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "#fbf7f0", border: "1px solid rgba(255,255,255,0.4)", padding: "10px 18px", textDecoration: "none" }}>open the app</a>
          </div>
        )}

        {!loading && !failed && (
          <div style={{ position: "absolute", right: 12, bottom: 12, zIndex: 4, display: "flex", gap: 8 }}>
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute the demo" : "Mute the demo"} style={ctrl}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                {muted ? <><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></> : <><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>}
              </svg>
              <span>{muted ? "unmute" : "mute"}</span>
            </button>
            <button type="button" onClick={goFullscreen} aria-label="Watch full screen" style={ctrl}>
              <span aria-hidden style={{ fontSize: 12 }}>{"⛶"}</span><span>full screen</span>
            </button>
            <button type="button" onClick={togglePlay} aria-label={playing ? "Pause the demo" : "Play the demo"} style={ctrl}>
              <span aria-hidden style={{ fontSize: 9 }}>{playing ? "❚❚" : "▶"}</span><span>{playing ? "pause" : "play"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shared challenge type (live from Turso, fallback in data.ts) ── */
export type Challenge = {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  minutes: number;
};
