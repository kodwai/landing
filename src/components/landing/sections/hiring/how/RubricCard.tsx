"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING · // 02 · bento tile 02 · "Your problem, your rubric"
   ───────────────────────────────────────────────────────────────────────────
   A 1x1 cell (~260px). A mini rubric EDITOR: a "RUBRIC" mono header with a small
   edit affordance, four configurable dimension rows (name + weight pill + thin
   Bar), and a hairline footer that sums to 100%. Honest: rubric dimensions +
   weights drive AI scoring 0-10; you author the ticket and define what you score.
   ══════════════════════════════════════════════════════════════════════════ */

import { C, TYPE, Bar } from "../../../system";

const DIMS: { name: string; weight: number }[] = [
  { name: "Problem decomposition", weight: 30 },
  { name: "Direction & verification", weight: 30 },
  { name: "Code quality", weight: 25 },
  { name: "Recovery", weight: 15 },
];

export default function RubricCard({ area }: { area: string }) {
  return (
    <article className="k-item k-hcw-cell" style={{ gridArea: area }}>
      <div className="k-hcw-frag">
        {/* editor surface */}
        <div
          style={{
            border: `1px solid ${C.line}`,
            background: C.bg,
            padding: "11px 12px 10px",
          }}
        >
          {/* header: RUBRIC label + edit affordance */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 11,
            }}
          >
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 10,
                letterSpacing: "0.14em",
                color: C.faint,
              }}
            >
              RUBRIC
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: C.mono,
                fontSize: 9,
                letterSpacing: "0.08em",
                color: C.accent,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.accent,
                  display: "inline-block",
                }}
              />
              edit
            </span>
          </div>

          {/* dimension rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {DIMS.map((d) => (
              <div key={d.name}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.sans,
                      fontSize: 11.5,
                      lineHeight: 1.2,
                      color: C.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minWidth: 0,
                    }}
                  >
                    {d.name}
                  </span>
                  <span
                    style={{
                      flex: "none",
                      fontFamily: C.mono,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      color: C.accent,
                      background: C.accentSoft,
                      border: `1px solid ${C.line}`,
                      padding: "1px 5px",
                    }}
                  >
                    {d.weight}
                  </span>
                </div>
                <Bar pct={d.weight * 2.6} color={C.accent} height={3} />
              </div>
            ))}
          </div>

          {/* footer: sums to 100% */}
          <div
            style={{
              marginTop: 11,
              paddingTop: 9,
              borderTop: `1px solid ${C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 9.5,
                letterSpacing: "0.06em",
                color: C.faint,
              }}
            >
              weights
            </span>
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: C.green,
              }}
            >
              = 100%
            </span>
          </div>
        </div>
      </div>

      <div className="k-hcw-meta">
        <div className="k-hcw-titlerow">
          <span className="k-hcw-idx" aria-hidden>
            02
          </span>
          <h3 className="k-hcw-title">Your problem, your rubric</h3>
        </div>
        <p className="k-hcw-body">
          You author the ticket, then define the dimensions and weights you score on.
          The AI grades every candidate 0-10 against exactly those terms.
        </p>
      </div>
    </article>
  );
}
