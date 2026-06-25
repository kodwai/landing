"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING · 04 · SCORING : score the work, not the memory.

   The interview scorecard read like an instrument, not a black box. You author
   the rubric for the role; every finished session is scored against it on a
   0-10 scale, with the reasoning shown per dimension, and your team scores it
   too. Honest to the real product: a transparent AI score (overall + per-dim
   justification, strengths, weaknesses) sitting SIDE BY SIDE with manual human
   scores and comments, plus a candidate compare heatmap.

   Mirrors Score.tsx (scorecard + axis bars + evidence) in scaffold and motion.

   IMPORTANT: interview scores are 0-10, NOT the public 0-100 axis scale, so the
   overall is a custom "8.4 / 10" display, never <ScoreRing> (which is /100).
   The dimension <Bar> takes pct 0-100, so each row passes score * 10.

   Tone: cream (light page default). id="scoring". Reduced-motion safe: the only
   bespoke effect is a CSS hover transition (no keyframes); all reveal motion is
   the global choreography, which no-ops under prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════════════════ */

import {
  C, TYPE, Band, Inner, Marker, Serif, Accent, Bar, useMediaMax,
} from "../../system";
import { HIRING_RUBRIC, HIRING_AI_REVIEW, HIRING_COMPARE } from "../../data";

export default function Scoring() {
  const stack = useMediaMax(760);

  return (
    <Band tone="cream" id="scoring">
      <Inner>
        <style>{`
          .k-scoring-card { display: grid; grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr); }
          @media (max-width: 760px) { .k-scoring-card { grid-template-columns: 1fr !important; } }
          .k-scoring-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
          .k-scoring-compare { transition: border-color .35s cubic-bezier(0.16,1,0.3,1); }
        `}</style>

        <Marker index="04" label="transparent scoring" />

        {/* ── Headline + lede, Outship two-column framing ── */}
        <div
          className="k-reveal"
          style={{
            display: "grid",
            gridTemplateColumns: stack ? "1fr" : "1.5fr 1fr",
            gap: stack ? 22 : 56,
            alignItems: "end",
            marginBottom: "clamp(40px, 6vw, 64px)",
          }}
        >
          <Serif as="h2" size="h2" style={{ maxWidth: "15ch" }}>
            Score the <Accent>work,</Accent> not the memory.
          </Serif>
          <p style={{ ...TYPE.body, color: C.muted, margin: 0, maxWidth: "48ch" }}>
            You define the rubric for the role. Every finished session is scored
            against it, with the reasoning shown for each dimension, and your team
            scores it too.
          </p>
        </div>

        {/* ════════ THE SCORECARD ════════ */}
        <Scorecard stack={stack} />

        {/* ════════ COMPARE STRIP ════════ */}
        <CompareStrip />
      </Inner>
    </Band>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SCORECARD : header (candidate / role / problem) + two-col body
   (rubric breakdown · AI review prose) + footer (AI beside human).
   ══════════════════════════════════════════════════════════════════════════ */
function Scorecard({ stack }: { stack: boolean }) {
  const r = HIRING_AI_REVIEW;

  return (
    <div
      className="k-reveal"
      style={{
        border: `1px solid ${C.lineBright}`,
        background: C.panel,
        boxShadow: "0 2px 18px -12px rgba(40,22,10,0.18)",
      }}
    >
      {/* ── card header: candidate · role · problem tag ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          padding: "clamp(18px, 2.6vw, 24px) clamp(20px, 3vw, 32px)",
          borderBottom: `1px solid ${C.line}`,
          background: C.paper2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
          <Avatar name={r.candidate} />
          <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
            <span style={{ fontFamily: C.mono, fontSize: 13.5, color: C.text, letterSpacing: 0.2 }}>
              {r.candidate}
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 0.4 }}>
              {r.role}
            </span>
          </div>
        </div>
        <span
          style={{
            fontFamily: C.mono,
            fontSize: 10.5,
            color: C.muted,
            border: `1px solid ${C.line}`,
            background: C.bg,
            padding: "5px 11px",
            letterSpacing: 0.6,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: C.accent }}>{"// "}</span>
          {r.problem}
        </span>
      </div>

      {/* ── card body: rubric breakdown | AI review prose ── */}
      <div className="k-scoring-card">
        {/* LEFT: the overall numeral + the four rubric dims as meters */}
        <div
          style={{
            padding: "clamp(24px, 3vw, 34px) clamp(22px, 3vw, 32px)",
            borderRight: stack ? "none" : `1px solid ${C.line}`,
            borderBottom: stack ? `1px solid ${C.line}` : "none",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(22px, 3vw, 30px)",
          }}
        >
          {/* the overall, as a big serif numeral with /10 (NOT a ScoreRing) */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span
              style={{
                ...TYPE.display,
                fontSize: "clamp(52px, 8vw, 76px)",
                color: C.text,
                lineHeight: 0.9,
              }}
            >
              {r.overall.toFixed(1)}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontFamily: C.mono, fontSize: 16, color: C.faint, letterSpacing: 0.5 }}>
                / 10
              </span>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 10,
                  color: C.accent,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                vs your rubric
              </span>
            </div>
          </div>

          {/* the four rubric dimensions, each a meter (Bar pct = score * 10) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {HIRING_RUBRIC.map((dim) => (
              <div key={dim.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 10,
                    marginBottom: 7,
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.sans,
                      fontSize: 14,
                      color: C.text,
                      lineHeight: 1.25,
                    }}
                  >
                    {dim.name}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "baseline", gap: 9, flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: C.mono,
                        fontSize: 10.5,
                        color: C.muted,
                        border: `1px solid ${C.line}`,
                        background: C.bg,
                        padding: "2px 7px",
                        letterSpacing: 0.4,
                      }}
                    >
                      {dim.weight}%
                    </span>
                    <span style={{ fontFamily: C.mono, fontSize: 13, color: C.text, letterSpacing: 0.3 }}>
                      {dim.score.toFixed(1)}
                    </span>
                  </span>
                </div>
                <Bar pct={dim.score * 10} color={C.accent} track={C.line} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: the AI review prose, strengths, weaknesses */}
        <div
          style={{
            padding: "clamp(24px, 3vw, 34px) clamp(22px, 3vw, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <span
            style={{
              fontFamily: C.mono,
              fontSize: 10,
              color: C.faint,
              letterSpacing: 1.6,
              textTransform: "uppercase",
            }}
          >
            AI review
          </span>

          <p style={{ ...TYPE.body, fontSize: 15.5, color: C.text, margin: 0, maxWidth: "46ch" }}>
            {r.summary}
          </p>

          {/* strengths + weaknesses, two columns that stack on narrow */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 20,
              borderTop: `1px solid ${C.line}`,
              paddingTop: 18,
            }}
          >
            <SignalList
              label="strengths"
              items={r.strengths}
              glyph="check"
            />
            <SignalList
              label="weaknesses"
              items={r.weaknesses}
              glyph="dot"
            />
          </div>
        </div>
      </div>

      {/* ── card footer: AI score beside the human reviewer ── */}
      <div
        style={{
          padding: "clamp(16px, 2.4vw, 22px) clamp(20px, 3vw, 32px)",
          borderTop: `1px solid ${C.line}`,
          background: C.paper2,
        }}
      >
        <div className="k-scoring-footer">
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* AI score */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: C.mono,
                fontSize: 12,
                color: C.text,
                border: `1px solid ${C.line}`,
                background: C.bg,
                padding: "7px 12px",
                letterSpacing: 0.3,
              }}
            >
              <span style={{ color: C.faint, letterSpacing: 1, textTransform: "uppercase", fontSize: 10 }}>
                AI
              </span>
              {HIRING_AI_REVIEW.overall.toFixed(1)} / 10
            </span>

            <span aria-hidden style={{ fontFamily: C.mono, fontSize: 13, color: C.faint }}>
              +
            </span>

            {/* a manual reviewer chip, conveying human review sits next to AI */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontFamily: C.mono,
                fontSize: 12,
                color: C.text,
                border: `1px solid ${C.line}`,
                background: C.bg,
                padding: "5px 12px 5px 6px",
                letterSpacing: 0.3,
              }}
            >
              <Avatar name="Priya Rao" size={22} />
              <span style={{ color: C.faint, letterSpacing: 1, textTransform: "uppercase", fontSize: 10 }}>
                reviewer
              </span>
              8 / 10
            </span>
          </div>

          <span
            style={{
              fontFamily: C.mono,
              fontSize: 11,
              color: C.faint,
              letterSpacing: 0.4,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: C.accent }}>{"// "}</span>
            you set the rubric. ai and your team both score against it.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SIGNAL LIST : strengths (green check) / weaknesses (amber dot).
   ══════════════════════════════════════════════════════════════════════════ */
function SignalList({
  label,
  items,
  glyph,
}: {
  label: string;
  items: string[];
  glyph: "check" | "dot";
}) {
  const tint = glyph === "check" ? C.green : C.amber;
  return (
    <div>
      <span
        style={{
          display: "block",
          fontFamily: C.mono,
          fontSize: 9.5,
          color: C.faint,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          marginBottom: 11,
        }}
      >
        {label}
      </span>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
        {items.map((it) => (
          <li
            key={it}
            style={{
              display: "grid",
              gridTemplateColumns: "16px 1fr",
              gap: 10,
              alignItems: "start",
            }}
          >
            <span aria-hidden style={{ marginTop: 2, lineHeight: 1 }}>
              {glyph === "check" ? (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={tint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5 L6.5 12 L13 4" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx="8" cy="8" r="3.4" fill="none" stroke={tint} strokeWidth="1.6" />
                  <circle cx="8" cy="8" r="1.2" fill={tint} />
                </svg>
              )}
            </span>
            <span style={{ fontFamily: C.sans, fontSize: 14, lineHeight: 1.5, color: C.muted }}>
              {it}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPARE STRIP : a compact candidate compare heatmap from HIRING_COMPARE.
   Header row = the four short dims + an Overall column; one row per candidate,
   each cell tinted by score (>=8 green, 6.5-8 amber, <6.5 faint). Mobile: the
   whole table scrolls horizontally rather than breaking the grid.
   ══════════════════════════════════════════════════════════════════════════ */
function CompareStrip() {
  const { dims, candidates } = HIRING_COMPARE;
  // grid: candidate column (label) + one per dim + overall
  const cols = `minmax(150px, 1.4fr) repeat(${dims.length}, minmax(74px, 1fr)) minmax(86px, 0.9fr)`;

  const headCell = (text: string, accent?: boolean): React.CSSProperties => ({
    fontFamily: C.mono,
    fontSize: 10.5,
    color: accent ? C.text : C.faint,
    letterSpacing: 1,
    textTransform: "uppercase",
    padding: "13px 12px",
    textAlign: "center",
    whiteSpace: "nowrap",
  });

  return (
    <div className="k-reveal" style={{ marginTop: "clamp(44px, 6vw, 64px)" }}>
      {/* compare header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
        <Serif as="h3" size="h3" style={{ fontSize: "clamp(19px, 2.4vw, 24px)" }}>
          Compare the <Accent>role.</Accent>
        </Serif>
        <span style={{ flex: 1, height: 1, background: C.line }} aria-hidden />
        <span
          style={{
            fontFamily: C.mono,
            fontSize: 10.5,
            color: C.faint,
            letterSpacing: 1,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          rubric heatmap
        </span>
      </div>

      {/* horizontally scrollable on mobile; the grid never breaks */}
      <div
        className="hide-scrollbar k-scoring-compare"
        style={{
          border: `1px solid ${C.lineBright}`,
          background: C.panel,
          overflowX: "auto",
          boxShadow: "0 2px 18px -12px rgba(40,22,10,0.16)",
        }}
      >
        <div style={{ minWidth: 560 }}>
          {/* header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              borderBottom: `1px solid ${C.line}`,
              background: C.paper2,
            }}
          >
            <div style={{ ...headCell("candidate"), textAlign: "left", paddingLeft: "clamp(16px, 2.4vw, 24px)" }}>
              candidate
            </div>
            {dims.map((d) => (
              <div key={d} style={headCell(d)}>
                {d}
              </div>
            ))}
            <div style={headCell("overall", true)}>overall</div>
          </div>

          {/* one row per candidate */}
          {candidates.map((cand, i) => (
            <div
              key={cand.handle}
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                borderBottom: i < candidates.length - 1 ? `1px solid ${C.line}` : "none",
                alignItems: "stretch",
              }}
            >
              {/* candidate label cell */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "14px clamp(16px, 2.4vw, 24px)",
                  minWidth: 0,
                  borderRight: `1px solid ${C.line}`,
                }}
              >
                <Avatar name={cand.name} size={26} />
                <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontFamily: C.sans,
                      fontSize: 14,
                      color: C.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cand.name}
                  </span>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.3 }}>
                    {cand.handle}
                  </span>
                </div>
              </div>

              {/* per-dimension tinted cells */}
              {cand.scores.map((s, di) => (
                <HeatCell key={dims[di]} score={s} />
              ))}

              {/* overall cell, bolder */}
              <HeatCell score={cand.overall} overall />
            </div>
          ))}
        </div>
      </div>

      {/* mono legend, honest framing */}
      <p
        style={{
          fontFamily: C.mono,
          fontSize: "clamp(10.5px, 1.4vw, 11.5px)",
          color: C.faint,
          letterSpacing: 0.5,
          margin: "16px 0 0",
          lineHeight: 1.7,
        }}
      >
        scored 0 to 10 <Dot /> the same rubric for everyone <Dot /> strongest and
        weakest dimensions surface at a glance
      </p>
    </div>
  );
}

/* A single heatmap cell, background-tinted by the 0-10 score. Text stays AA on
   the faint tints. The overall cell reads bolder. */
function HeatCell({ score, overall = false }: { score: number; overall?: boolean }) {
  // tints: >=8 green, 6.5-8 amber, <6.5 faint neutral
  const band =
    score >= 8
      ? { bg: "rgba(31,157,85,0.13)", fg: "#1a7f44" }
      : score >= 6.5
        ? { bg: "rgba(207,138,26,0.15)", fg: "#9a6206" }
        : { bg: "rgba(115,109,99,0.10)", fg: C.muted };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 12px",
        background: band.bg,
        borderRight: `1px solid ${C.line}`,
        borderLeft: overall ? `1px solid ${C.line}` : undefined,
      }}
    >
      <span
        style={{
          fontFamily: C.mono,
          fontSize: overall ? 15 : 13.5,
          fontWeight: overall ? 700 : 500,
          color: band.fg,
          letterSpacing: 0.3,
        }}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}

/* ── A square mono avatar showing the person's initial. ── */
function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        border: `1px solid ${C.lineBright}`,
        background: C.bg,
        fontFamily: C.mono,
        fontSize: size * 0.4,
        fontWeight: 600,
        color: C.accent,
        letterSpacing: 0,
      }}
    >
      {initial}
    </span>
  );
}

/* ── The interpunct that separates mono tokens (matches Score.tsx). ── */
function Dot() {
  return <span style={{ color: C.accent, padding: "0 2px" }} aria-hidden>·</span>;
}
