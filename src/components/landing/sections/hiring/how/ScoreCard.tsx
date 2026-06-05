"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING · // 02 bento · 03 — a transparent AI score (1x1, ~260px)
   A compact score readout: big serif 8.4 + mono / 10 + "vs your rubric", then
   three mini dimension rows (name · 2px Bar · 0-10 score), and a mono justify
   tag with a one-line clipped justification. Conveys reasoned, not black-box.
   Honest: Claude Code only, interview scores are 0-10. Reduced-motion safe
   (only the global reveal + Bar grow, both no-op under reduced-motion).
   ══════════════════════════════════════════════════════════════════════════ */

import { C, Bar } from "../../../system";

const DIMS: { name: string; score: number }[] = [
  { name: "correctness", score: 9.0 },
  { name: "code quality", score: 8.0 },
  { name: "verification", score: 7.5 },
];

export default function ScoreCard({ area }: { area: string }) {
  return (
    <article className="k-item k-hcw-cell" style={{ gridArea: area }}>
      <div className="k-hcw-frag" style={{ gap: 16 }}>
        {/* ── the overall: big serif numeral + mono / 10 + rubric caption ── */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 11 }}>
          <span
            style={{
              fontFamily: C.serif,
              fontWeight: 430,
              fontSize: 52,
              lineHeight: 0.85,
              letterSpacing: "-0.02em",
              color: C.text,
            }}
          >
            8.4
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontFamily: C.mono, fontSize: 13, color: C.faint, letterSpacing: 0.4 }}>
              / 10
            </span>
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 9,
                color: C.accent,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              vs your rubric
            </span>
          </div>
        </div>

        {/* ── three rubric dimensions: name · 2px meter · 0-10 score ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {DIMS.map((d) => (
            <div key={d.name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: C.sans, fontSize: 12, color: C.text, lineHeight: 1.1 }}>
                  {d.name}
                </span>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 0.3 }}>
                  {d.score.toFixed(1)}
                </span>
              </div>
              <Bar pct={d.score * 10} color={C.accent} track={C.line} height={2} />
            </div>
          ))}
        </div>

        {/* ── mono justify tag + one-line clipped per-dimension justification ── */}
        <div
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 9,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: C.mono,
              fontSize: 9,
              color: C.faint,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: C.accent }}>{"// "}</span>justified per dimension
          </span>
          <span
            style={{
              fontFamily: C.sans,
              fontSize: 12,
              color: C.muted,
              lineHeight: 1.35,
              fontStyle: "italic",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            "verified every claim before shipping."
          </span>
        </div>
      </div>

      <div className="k-hcw-meta">
        <div className="k-hcw-titlerow">
          <span className="k-hcw-idx" aria-hidden>03</span>
          <h3 className="k-hcw-title">A transparent AI score</h3>
        </div>
        <p className="k-hcw-body">
          Every finished session is scored against your rubric, 0 to 10, with a
          written justification for each dimension. Reasoned, not a black box.
        </p>
      </div>
    </article>
  );
}
