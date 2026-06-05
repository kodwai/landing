"use client";

/* ══════════════════════════════════════════════════════════════════════════
   SECTION: TESTIMONIAL WALL  ("Coding agents are eating software")

   Outship-grade editorial: centered Fraunces headline with a single rust
   accent, two hand-drawn stat doodles framing the zeitgeist, then a WALL of
   peer testimonials. Two vertical marquee columns scroll in OPPOSITE
   directions, fade at the edges, and pause on hover. On mobile the wall
   collapses to a single static masonry stack (no infinite scroll). Avatars
   are original inline-SVG monograms with a deterministic warm tint per name.

   Imports: ../system, ../data, react only. No raster assets.
   ══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  C, TYPE, CSS_EASE, Band, Inner, Marker, Serif, Accent,
  useMediaMax,
} from "../system";
import { TESTIMONIALS } from "../data";

/* ── Deterministic warm tint per name (rust → amber → green, all earthy) ── */
const TINTS: { ring: string; fg: string; well: string }[] = [
  { ring: "rgba(194,54,22,0.22)", fg: "#a82d12", well: "rgba(194,54,22,0.07)" }, // rust
  { ring: "rgba(207,138,26,0.26)", fg: "#9a6206", well: "rgba(207,138,26,0.09)" }, // amber
  { ring: "rgba(31,157,85,0.22)", fg: "#1a7f44", well: "rgba(31,157,85,0.08)" }, // green
  { ring: "rgba(120,86,60,0.26)", fg: "#6b4a30", well: "rgba(120,86,60,0.08)" }, // walnut
  { ring: "rgba(143,98,122,0.24)", fg: "#7a4a63", well: "rgba(143,98,122,0.08)" }, // mauve
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name: string): string {
  const parts = name.replace(/[^A-Za-z .]/g, "").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase().slice(0, 2);
}

type Card = (typeof TESTIMONIALS)[number];

/* ── Original SVG monogram avatar (warm tinted circle, initials, draws once) ── */
function Monogram({ name }: { name: string }) {
  const tint = TINTS[hashName(name) % TINTS.length];
  const ini = initials(name);
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden style={{ flexShrink: 0, display: "block" }}>
      <circle cx="21" cy="21" r="20" fill={tint.well} stroke={tint.ring} strokeWidth="1.4" />
      {/* tiny terminal-prompt tick, lower-left, ties avatars to the machine voice */}
      <path d="M9 31 l2.4 -1.9 l-2.4 -1.9" fill="none" stroke={tint.fg} strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      <text x="21" y="22" textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: C.mono, fontWeight: 700, fontSize: 14, letterSpacing: "0.02em" }}
        fill={tint.fg}>{ini}</text>
    </svg>
  );
}

/* ── X glyph (machine-voice mark in the card footer) ── */
function XGlyph({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill={color} aria-hidden style={{ flexShrink: 0 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ── One testimonial card ── */
function TestimonialCard({ t }: { t: Card }) {
  const [h, setH] = useState(false);
  return (
    <figure
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        margin: 0,
        background: C.panel,
        border: `1px solid ${h ? C.lineBright : C.line}`,
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        transition: `border-color .3s ${CSS_EASE}, transform .3s ${CSS_EASE}, box-shadow .3s ${CSS_EASE}`,
        transform: h ? "translateY(-3px)" : "translateY(0)",
        boxShadow: h
          ? "0 18px 40px -24px rgba(40,22,10,0.34)"
          : "0 1px 0 0 rgba(40,22,10,0.02)",
      }}
    >
      {/* faint opening-quote serif glyph, top-right */}
      <span aria-hidden style={{
        position: "absolute", top: 8, right: 16, fontFamily: C.serif, fontStyle: "italic",
        fontSize: 46, lineHeight: 1, color: C.accent, opacity: h ? 0.14 : 0.08,
        transition: `opacity .3s ${CSS_EASE}`, pointerEvents: "none",
      }}>&rdquo;</span>

      <blockquote style={{
        margin: 0, ...TYPE.body, fontSize: "clamp(14.5px, 1.6vw, 15.5px)", lineHeight: 1.58,
        color: C.text, position: "relative", zIndex: 1,
      }}>
        {t.body}
      </blockquote>

      <figcaption style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
        <Monogram name={t.name} />
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: C.mono, fontWeight: 600, fontSize: 12.5, color: C.text,
              letterSpacing: "-0.01em", whiteSpace: "nowrap",
            }}>{t.name}</span>
            <span style={{
              fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{t.handle}</span>
          </span>
          <span style={{
            fontFamily: C.sans, fontSize: 11.5, color: C.muted, lineHeight: 1.3,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{t.role}</span>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <span style={{
            fontFamily: C.mono, fontSize: 9.5, letterSpacing: 0.8, textTransform: "uppercase",
            color: C.muted, border: `1px solid ${C.line}`, background: C.paper2,
            padding: "3px 7px", whiteSpace: "nowrap",
          }}>{t.agent}</span>
          <XGlyph color={C.faint} />
        </span>
      </figcaption>
    </figure>
  );
}

/* ── A scrolling marquee column (duplicates the list for a seamless loop) ── */
function MarqueeColumn({ cards, dir, dur }: { cards: Card[]; dir: "up" | "down"; dur: number }) {
  // The list is rendered twice; the keyframe translates by -50% so the seam
  // lands exactly where the duplicate begins, giving an infinite loop.
  const doubled = [...cards, ...cards];
  return (
    <div
      className="k-fade-y k-vmarquee-pause"
      style={{ overflow: "hidden", height: 760, position: "relative" }}
    >
      <div
        className={`k-vmarquee ${dir === "up" ? "k-vmarquee-up" : "k-vmarquee-down"}`}
        style={{ ["--k-vdur" as string]: `${dur}s`, ["--k-vgap" as string]: "16px" } as CSSProperties}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.handle}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const isMobile = useMediaMax(720);

  // Split the wall into two columns; opposite scroll directions, slightly
  // different durations so the two never visually sync up.
  const colA = TESTIMONIALS.filter((_, i) => i % 2 === 0);
  const colB = TESTIMONIALS.filter((_, i) => i % 2 === 1);

  return (
    <Band tone="cream" id="testimonials">
      <Inner>
        <Marker index="08" label="the wall" />

        {/* ── Headline ── */}
        <div className="k-reveal" style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 14px" }}>
          <Serif as="h2" size="h2">
            Coding agents are <Accent>eating software</Accent>.
          </Serif>
        </div>
        <p className="k-reveal" style={{
          ...TYPE.body, color: C.muted, textAlign: "center", maxWidth: "52ch",
          margin: "0 auto", marginBottom: "clamp(44px, 6vw, 64px)",
        }}>
          The work moved into the agent loop, and the engineers who steer it well are pulling ahead.
          Here is what they say after a scored run.
        </p>

        {/* ── The wall ── */}
        {isMobile ? (
          /* Mobile: single static masonry stack, no infinite scroll */
          <div className="k-masonry k-masonry-2" data-stagger>
            {TESTIMONIALS.map((t) => (
              <div key={t.handle} className="k-item">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
            position: "relative",
          }}>
            {/* hairline seam between the two columns, faded at the edges */}
            <span aria-hidden className="k-fade-y" style={{
              position: "absolute", left: "50%", top: 0, bottom: 0, width: 1,
              background: C.line, transform: "translateX(-0.5px)", pointerEvents: "none",
            }} />
            <MarqueeColumn cards={colA} dir="up" dur={56} />
            <MarqueeColumn cards={colB} dir="down" dur={64} />
          </div>
        )}

        {/* ── Footer line (mono machine voice) ── */}
        <p style={{
          fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 1,
          textTransform: "uppercase", textAlign: "center", marginTop: "clamp(36px, 5vw, 52px)",
        }}>
          {TESTIMONIALS.length} runs from real developers, illustrative names, real voices.
        </p>
      </Inner>
    </Band>
  );
}
