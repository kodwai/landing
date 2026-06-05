"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING · // 02 · bento 04 · "Score it yourself too"
   ───────────────────────────────────────────────────────────────────────────
   The WIDE bottom-left tile (1x2, area="you"). It makes one honest point: the AI
   review and a human review sit SIDE BY SIDE, never one instead of the other.
   LEFT mini-column = the AI verdict (tag + 8.4 / 10 + clipped justification).
   A thin "and" divider. RIGHT mini-column = a human comment (rust "M" avatar,
   "Maya, staff eng", a short agree line) plus a "+ add your score" chip.

   Honest scope: interview scores are 0-10, Claude Code only. No keyframes here,
   so it renders its final state with no JS and is reduced-motion safe by default.
   Inline styles only; the cell chrome / meta classes come from the shell.
   ══════════════════════════════════════════════════════════════════════════ */

import { C, TYPE } from "../../../system";

export default function ReviewCard({ area }: { area: string }) {
  return (
    <article className="k-item k-hcw-cell" style={{ gridArea: area }}>
      <div className="k-hcw-frag">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1.05fr)",
            alignItems: "stretch",
            gap: "clamp(12px, 1.6vw, 18px)",
          }}
        >
          {/* ── LEFT: the AI verdict ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minWidth: 0,
              border: `1px solid ${C.line}`,
              background: C.bg,
              padding: "13px 14px",
            }}
          >
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 9.5,
                color: C.faint,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              AI review
            </span>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  ...TYPE.display,
                  fontSize: "clamp(30px, 4vw, 40px)",
                  lineHeight: 0.9,
                  color: C.text,
                }}
              >
                8.4
              </span>
              <span style={{ fontFamily: C.mono, fontSize: 12, color: C.faint, letterSpacing: 0.5 }}>
                / 10
              </span>
            </div>

            <p
              style={{
                fontFamily: C.sans,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: C.muted,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              Reverted a failing migration, then shipped a clean fix with tests.
            </p>
          </div>

          {/* ── DIVIDER: a thin rule with an "and" so the two read as a pair ── */}
          <div
            aria-hidden
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              alignSelf: "stretch",
            }}
          >
            <span style={{ flex: 1, width: 1, background: C.line }} />
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 9.5,
                color: C.accent,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              and
            </span>
            <span style={{ flex: 1, width: 1, background: C.line }} />
          </div>

          {/* ── RIGHT: the human review ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minWidth: 0,
              border: `1px solid ${C.line}`,
              background: C.panel,
              padding: "13px 14px",
            }}
          >
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 9.5,
                color: C.faint,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              your team
            </span>

            {/* the human comment bubble */}
            <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  border: `1px solid ${C.accent}`,
                  background: C.accentSoft,
                  fontFamily: C.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.accent,
                }}
              >
                M
              </span>
              <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.3 }}>
                  Maya, staff eng
                </span>
                <p
                  style={{
                    fontFamily: C.sans,
                    fontSize: 12.5,
                    lineHeight: 1.45,
                    color: C.muted,
                    margin: 0,
                  }}
                >
                  Agree, strong recovery. I would hire.
                </p>
              </div>
            </div>

            {/* the "+ add your score" chip */}
            <span
              style={{
                marginTop: 2,
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: C.mono,
                fontSize: 10.5,
                color: C.accent,
                letterSpacing: 0.6,
                border: `1px solid ${C.lineBright}`,
                background: C.bg,
                padding: "5px 10px",
              }}
            >
              <span aria-hidden style={{ fontSize: 12, lineHeight: 1 }}>+</span>
              add your score
            </span>
          </div>
        </div>
      </div>

      <div className="k-hcw-meta">
        <div className="k-hcw-titlerow">
          <span className="k-hcw-idx" aria-hidden>04</span>
          <h3 className="k-hcw-title">Score it yourself too</h3>
        </div>
        <p className="k-hcw-body">
          Your team adds their own scores and comments right next to the AI score, on
          the same 0 to 10 rubric. The AI verdict and your read sit side by side, never
          one instead of the other.
        </p>
      </div>
    </article>
  );
}
