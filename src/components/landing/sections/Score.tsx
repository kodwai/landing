"use client";

/* ══════════════════════════════════════════════════════════════════════════
   04 · THE SCORE : earn trust in the judgment.

   The score must read like an instrument, not a black box. The ScoreRing draws
   and counts up, the dimension bars grow on scroll, and a single concrete
   "evidence" callout makes "every signal cites its evidence" tangible: a quoted
   transcript line, the axis it moved, and why it scored.

   Tone: cream (light page default). id="score".
   ══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  C, TYPE, Band, Inner, Marker, Serif, Accent, Bar, ScoreRing, useMediaMax,
} from "../system";
import { DIRECTION_DIMS, OUTCOME_DIMS, LIFT_DIMS } from "../data";

/* ── Local content: the axis headers (weights + one-line descriptions) ──
   data.ts ships the dimension lists; the editorial framing lives here. */
const AXES = [
  { key: "direction", title: "Direction", weight: 50, desc: "how you steer, verify, and decompose", dims: DIRECTION_DIMS },
  { key: "outcome", title: "Outcome", weight: 35, desc: "what actually shipped, and whether it holds", dims: OUTCOME_DIMS },
  { key: "lift", title: "Lift", weight: 15, desc: "the edges a one-shot prompt misses", dims: LIFT_DIMS },
] as const;

const BREAKDOWN = [
  { axis: "direction", got: 45, of: 50 },
  { axis: "outcome", got: 34, of: 35 },
  { axis: "lift", got: 12, of: 15 },
] as const;

/* The single concrete evidence signal: a cited transcript line + verdict. */
const EVIDENCE = {
  signal: "Verification rigor",
  axis: "Direction",
  delta: "+6",
  transcript:
    "before we move on, write a test that fires 1k concurrent requests and assert no tokens leak past the window",
  verdict:
    "You forced the agent to prove the concurrency claim instead of trusting it. Cited from turn 14, 41s before the first commit.",
} as const;

export default function Score() {
  const stack = useMediaMax(880);

  return (
    <Band tone="cream" id="score">
      <Inner>
        <style>{`
          @media (max-width: 920px) and (min-width: 681px) { .k-score-meters { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
          @media (max-width: 680px) { .k-score-meters { grid-template-columns: 1fr !important; } }
        `}</style>
        <Marker index="05" label="the score" />

        {/* ── Headline + thesis, Outship two-column framing ── */}
        <div
          className="k-reveal"
          style={{
            display: "grid",
            gridTemplateColumns: stack ? "1fr" : "1.5fr 1fr",
            gap: stack ? 22 : 56,
            alignItems: "end",
            marginBottom: "clamp(44px, 7vw, 76px)",
          }}
        >
          <Serif as="h2" size="h2" style={{ maxWidth: "16ch" }}>
            What the score <Accent>actually</Accent> measures.
          </Serif>
          <p style={{ ...TYPE.body, color: C.muted, margin: 0, maxWidth: "46ch" }}>
            A one-shot &ldquo;solve this&rdquo; prompt clears the tests, so passing tests is
            not enough. The score is dominated by how you direct the agent, the part a
            careless prompt cannot fake.
          </p>
        </div>

        {/* ── The instrument: ring + breakdown beside the three axes ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: stack ? "1fr" : "minmax(220px, 280px) 1fr",
            gap: stack ? 40 : "clamp(40px, 5vw, 72px)",
            alignItems: "start",
          }}
        >
          {/* Sample-run card with the ScoreRing */}
          <RingCard stack={stack} />

          {/* Three axes, each row staggered in */}
          <div
            data-stagger
            style={{
              display: "flex",
              flexDirection: "column",
              gap: stack ? 30 : 38,
            }}
          >
            {AXES.map((axis) => (
              <AxisBlock key={axis.key} axis={axis} />
            ))}
          </div>
        </div>

        {/* ── Original imagery: the cited-evidence callout ── */}
        <EvidenceCallout stack={stack} />

        {/* ── Mono evidence line ── */}
        <p
          className="k-reveal"
          style={{
            fontFamily: C.mono,
            fontSize: "clamp(10.5px, 1.4vw, 12px)",
            color: C.faint,
            letterSpacing: 0.6,
            margin: "clamp(40px, 6vw, 56px) 0 0",
            textAlign: stack ? "left" : "right",
            lineHeight: 1.7,
          }}
        >
          scored 0 to 100 <Dot /> direction 50 <Dot /> outcome 35 <Dot /> lift 15{" "}
          <Dot /> every signal cites its evidence
        </p>
      </Inner>
    </Band>
  );
}

/* ── The interpunct that separates mono tokens ── */
function Dot() {
  return <span style={{ color: C.accent, padding: "0 2px" }} aria-hidden>·</span>;
}

/* ══════════════════════════════════════════════════════════════════════════
   RING CARD : the instrument face, ScoreRing + sample-run caption + breakdown
   ══════════════════════════════════════════════════════════════════════════ */
function RingCard({ stack }: { stack: boolean }) {
  return (
    <div
      className="k-reveal"
      style={{
        border: `1px solid ${C.line}`,
        background: C.panel,
        padding: "clamp(26px, 4vw, 34px) clamp(22px, 3vw, 30px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        position: "relative",
        // corner ticks read like a measuring instrument
        boxShadow: "0 2px 18px -12px rgba(40,22,10,0.18)",
      }}
    >
      {/* instrument tick marks at the corners */}
      <CornerTicks />

      <ScoreRing score={91} size={stack ? 160 : 176} />

      <p
        style={{
          fontFamily: C.mono,
          fontSize: 10,
          color: C.faint,
          letterSpacing: 1.1,
          textTransform: "uppercase",
          textAlign: "center",
          margin: 0,
        }}
      >
        sample run <span style={{ color: C.accent }}>·</span> rate limiter
      </p>

      {/* axis breakdown, got / of, the headline weights paid out */}
      <div
        style={{
          width: "100%",
          borderTop: `1px solid ${C.line}`,
          paddingTop: 18,
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {BREAKDOWN.map((b) => (
          <div
            key={b.axis}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontFamily: C.mono,
              fontSize: 12,
            }}
          >
            <span style={{ color: C.muted, textTransform: "lowercase" }}>{b.axis}</span>
            <span style={{ color: C.text, letterSpacing: 0.3 }}>
              {b.got}
              <span style={{ color: C.faint }}> / {b.of}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Four hairline corner ticks, drawn as absolute SVG, instrument styling. */
function CornerTicks() {
  const t = 10;
  const tick = (extra: CSSProperties): CSSProperties => ({
    position: "absolute",
    width: t,
    height: t,
    borderColor: C.lineBright,
    pointerEvents: "none",
    ...extra,
  });
  return (
    <>
      <span aria-hidden style={tick({ top: 8, left: 8, borderTop: `1px solid ${C.lineBright}`, borderLeft: `1px solid ${C.lineBright}` })} />
      <span aria-hidden style={tick({ top: 8, right: 8, borderTop: `1px solid ${C.lineBright}`, borderRight: `1px solid ${C.lineBright}` })} />
      <span aria-hidden style={tick({ bottom: 8, left: 8, borderBottom: `1px solid ${C.lineBright}`, borderLeft: `1px solid ${C.lineBright}` })} />
      <span aria-hidden style={tick({ bottom: 8, right: 8, borderBottom: `1px solid ${C.lineBright}`, borderRight: `1px solid ${C.lineBright}` })} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AXIS BLOCK : header with point weight + description, then Bar meters per dim
   ══════════════════════════════════════════════════════════════════════════ */
function AxisBlock({
  axis,
}: {
  axis: (typeof AXES)[number];
}) {
  return (
    <div className="k-item">
      {/* axis header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: C.mono,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          {axis.title}
        </span>
        <span style={{ flex: 1, height: 1, background: C.line }} aria-hidden />
        <span
          style={{
            fontFamily: C.mono,
            fontSize: 12,
            color: C.accent,
            letterSpacing: 0.4,
            whiteSpace: "nowrap",
          }}
        >
          {axis.weight} pts
        </span>
      </div>
      <p
        style={{
          fontFamily: C.mono,
          fontSize: 11,
          color: C.faint,
          letterSpacing: 0.3,
          margin: "0 0 18px",
        }}
      >
        {axis.desc}
      </p>

      {/* dimension meters */}
      <div
        className="k-score-meters"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          columnGap: 32,
          rowGap: 15,
        }}
      >
        {axis.dims.map((d) => (
          <div key={d.name}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 7,
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: C.sans,
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.2,
                }}
              >
                {d.name}
              </span>
              <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text }}>
                {d.pct}
              </span>
            </div>
            <Bar pct={d.pct} color={C.accent} track={C.line} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EVIDENCE CALLOUT : original imagery making "cites its evidence" concrete.
   A single signal: the quoted transcript line that moved it, plus the verdict.
   The connector line draws on hover; the whole thing reads like a margin note.
   ══════════════════════════════════════════════════════════════════════════ */
function EvidenceCallout({ stack }: { stack: boolean }) {
  const [hover, setHover] = useState(false);
  const K = "k-scoreev-";

  return (
    <>
      <style>{`
        .${K}card { transition: border-color .35s cubic-bezier(0.16,1,0.3,1), box-shadow .35s cubic-bezier(0.16,1,0.3,1); }
        @media (prefers-reduced-motion: reduce) {
          .${K}beam { stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <div
        className="k-reveal"
        style={{ marginTop: "clamp(44px, 6vw, 64px)" }}
      >
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`${K}card`}
          style={{
            border: `1px solid ${hover ? C.lineBright : C.line}`,
            background: C.panel,
            display: "grid",
            gridTemplateColumns: stack ? "1fr" : "auto 1fr",
            alignItems: "stretch",
            boxShadow: hover
              ? "0 18px 40px -22px rgba(40,22,10,0.28)"
              : "0 2px 16px -12px rgba(40,22,10,0.16)",
          }}
        >
          {/* left rail: the signal that fired + its axis + delta */}
          <div
            style={{
              padding: "clamp(22px, 3vw, 28px) clamp(22px, 3vw, 30px)",
              borderRight: stack ? "none" : `1px solid ${C.line}`,
              borderBottom: stack ? `1px solid ${C.line}` : "none",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              minWidth: stack ? "auto" : 240,
              background: C.paper2,
              position: "relative",
            }}
          >
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 10,
                color: C.faint,
                letterSpacing: 1.4,
                textTransform: "uppercase",
              }}
            >
              evidence · one signal
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SignalGlyph />
              <span
                style={{
                  ...TYPE.h3,
                  fontSize: "clamp(19px, 2.4vw, 23px)",
                  color: C.text,
                  lineHeight: 1.05,
                }}
              >
                {EVIDENCE.signal}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 10.5,
                  color: C.muted,
                  border: `1px solid ${C.line}`,
                  background: C.bg,
                  padding: "4px 9px",
                  letterSpacing: 0.6,
                  textTransform: "lowercase",
                }}
              >
                axis · {EVIDENCE.axis.toLowerCase()}
              </span>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: C.green,
                  border: `1px solid rgba(31,157,85,0.30)`,
                  background: "rgba(31,157,85,0.08)",
                  padding: "4px 9px",
                  letterSpacing: 0.6,
                }}
              >
                {EVIDENCE.delta} pts
              </span>
            </div>
          </div>

          {/* right: the cited transcript line + the verdict */}
          <div
            style={{
              padding: "clamp(22px, 3vw, 28px) clamp(22px, 3vw, 32px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
            }}
          >
            {/* connector beam, draws toward the quote on hover */}
            {!stack && (
              <svg
                aria-hidden
                width="40"
                height="16"
                viewBox="0 0 40 16"
                fill="none"
                style={{ position: "absolute", left: -20, top: 30, overflow: "visible" }}
              >
                <path
                  className={`${K}beam`}
                  d="M0 8 H40"
                  stroke={C.accent}
                  strokeWidth="1.5"
                  strokeDasharray="40"
                  strokeDashoffset={hover ? 0 : 40}
                  style={{ transition: "stroke-dashoffset .5s cubic-bezier(0.16,1,0.3,1)" }}
                />
                <path d="M34 3 L40 8 L34 13" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={hover ? 1 : 0} style={{ transition: "opacity .3s ease" }} />
              </svg>
            )}

            {/* the quoted transcript line */}
            <figure style={{ margin: 0 }}>
              <figcaption
                style={{
                  fontFamily: C.mono,
                  fontSize: 9.5,
                  color: C.faint,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  marginBottom: 9,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: C.accent }}>you →</span> transcript · turn 14
              </figcaption>
              <blockquote
                style={{
                  margin: 0,
                  borderLeft: `2px solid ${C.accent}`,
                  paddingLeft: 16,
                  fontFamily: C.mono,
                  fontSize: "clamp(12.5px, 1.6vw, 14px)",
                  lineHeight: 1.62,
                  color: C.text,
                }}
              >
                &ldquo;{EVIDENCE.transcript}&rdquo;
              </blockquote>
            </figure>

            {/* the verdict: why it scored */}
            <p
              style={{
                fontFamily: C.sans,
                fontSize: 14.5,
                lineHeight: 1.6,
                color: C.muted,
                margin: 0,
              }}
            >
              <span style={{ color: C.text, fontWeight: 500 }}>Why it scored. </span>
              {EVIDENCE.verdict}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* A small target-reticle glyph: the score "aimed" at a signal. Instrument-like. */
function SignalGlyph() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      stroke={C.accent}
      strokeWidth="1.4"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <circle cx="15" cy="15" r="11" stroke={C.lineBright} />
      <circle cx="15" cy="15" r="5.5" />
      <circle cx="15" cy="15" r="1.6" fill={C.accent} stroke="none" />
      <path d="M15 1 V6 M15 24 V29 M1 15 H6 M24 15 H29" strokeLinecap="round" />
    </svg>
  );
}
