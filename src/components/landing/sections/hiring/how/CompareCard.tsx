"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING · // 02 bento · 05 · Compare side by side
   ───────────────────────────────────────────────────────────────────────────
   A WIDE 1x2 tile (bottom-right). A compact COMPARE MINI-TABLE: four short
   dimension labels across the top (Decomp · Direction · Quality · Overall),
   then three candidate rows, each cell tinted by its 0-10 score so the
   strongest (Jamie 8.4) and weakest (Kenji 6.8) read at a glance. The overall
   column is bolder. Tints match the page heatmap convention exactly. On narrow
   widths the table scrolls horizontally instead of breaking. Honest: AI scores
   are 0 to 10, the same rubric applied to every candidate for the role.
   ══════════════════════════════════════════════════════════════════════════ */

import { C } from "../../../system";

/* the four heatmap columns; "overall" is the bolder rollup */
const DIMS = ["decomp", "direction", "quality"] as const;

/* three candidates for one role: a strongest, a middle, a weakest. Each row is
   [decomp, direction, quality] per-dimension, plus a rolled-up overall. */
const ROWS: { name: string; initials: string; scores: [number, number, number]; overall: number }[] = [
  { name: "Jamie", initials: "JM", scores: [8.6, 8.1, 8.5], overall: 8.4 },
  { name: "Sarah", initials: "SR", scores: [7.8, 7.2, 7.6], overall: 7.5 },
  { name: "Kenji", initials: "KN", scores: [7.1, 6.4, 6.8], overall: 6.8 },
];

/* page-wide tint convention: >=8 green, 6.5-8 amber, <6.5 faint neutral. */
function tint(score: number) {
  return score >= 8
    ? { bg: "rgba(31,157,85,0.14)", fg: "#1a7f44" }
    : score >= 6.5
      ? { bg: "rgba(207,138,26,0.16)", fg: "#9a6206" }
      : { bg: "rgba(115,109,99,0.11)", fg: C.muted };
}

export default function CompareCard({ area }: { area: string }) {
  // candidate label column + one per dim + a slightly wider, set-off overall.
  const cols = `minmax(116px, 1.3fr) repeat(${DIMS.length}, minmax(58px, 1fr)) minmax(64px, 0.92fr)`;

  const headCell = (accent?: boolean): React.CSSProperties => ({
    fontFamily: C.mono,
    fontSize: 9.5,
    color: accent ? C.text : C.faint,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    padding: "9px 8px",
    textAlign: "center",
    whiteSpace: "nowrap",
  });

  return (
    <article className="k-item k-hcw-cell" style={{ gridArea: area }}>
      <div className="k-hcw-frag">
        {/* ── the compare mini-table; scrolls horizontally on narrow widths ── */}
        <div
          className="hide-scrollbar"
          style={{
            width: "100%",
            border: `1px solid ${C.lineBright}`,
            background: C.panel,
            overflowX: "auto",
          }}
        >
          <div style={{ minWidth: 416 }}>
            {/* header row of short dimension labels */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                background: C.paper2,
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <div style={{ ...headCell(), textAlign: "left", paddingLeft: 13 }}>candidate</div>
              {DIMS.map((d) => (
                <div key={d} style={headCell()}>
                  {d}
                </div>
              ))}
              <div style={{ ...headCell(true), borderLeft: `1px solid ${C.line}` }}>overall</div>
            </div>

            {/* one tinted row per candidate */}
            {ROWS.map((r, i) => (
              <div
                key={r.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: cols,
                  borderBottom: i < ROWS.length - 1 ? `1px solid ${C.line}` : "none",
                  alignItems: "stretch",
                }}
              >
                {/* candidate label: square mono initials + name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "10px 13px",
                    minWidth: 0,
                    borderRight: `1px solid ${C.line}`,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      flex: "none",
                      width: 22,
                      height: 22,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: C.mono,
                      fontSize: 9.5,
                      fontWeight: 600,
                      letterSpacing: 0.4,
                      color: C.faint,
                      background: C.bg,
                      border: `1px solid ${C.line}`,
                    }}
                  >
                    {r.initials}
                  </span>
                  <span
                    style={{
                      fontFamily: C.sans,
                      fontSize: 13.5,
                      color: C.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.name}
                  </span>
                </div>

                {/* per-dimension tinted cells */}
                {r.scores.map((s, di) => {
                  const t = tint(s);
                  return (
                    <div
                      key={DIMS[di]}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px 6px",
                        background: t.bg,
                        borderRight: `1px solid ${C.line}`,
                      }}
                    >
                      <span style={{ fontFamily: C.mono, fontSize: 12.5, fontWeight: 500, color: t.fg, letterSpacing: 0.3 }}>
                        {s.toFixed(1)}
                      </span>
                    </div>
                  );
                })}

                {/* overall cell, bolder + set off by a left rule */}
                {(() => {
                  const t = tint(r.overall);
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px 6px",
                        background: t.bg,
                        borderLeft: `1px solid ${C.line}`,
                      }}
                    >
                      <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 700, color: t.fg, letterSpacing: 0.3 }}>
                        {r.overall.toFixed(1)}
                      </span>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* mono legend: honest 0-10 framing + the heatmap key */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "5px 12px",
            marginTop: 11,
            fontFamily: C.mono,
            fontSize: 10,
            letterSpacing: 0.4,
            color: C.faint,
          }}
        >
          <span>scored 0 to 10</span>
          <span aria-hidden style={{ color: C.line }}>·</span>
          <LegendKey swatch="rgba(31,157,85,0.14)" label="8+" />
          <LegendKey swatch="rgba(207,138,26,0.16)" label="6.5 to 8" />
          <LegendKey swatch="rgba(115,109,99,0.11)" label="under 6.5" />
        </div>
      </div>

      <div className="k-hcw-meta">
        <div className="k-hcw-titlerow">
          <span className="k-hcw-idx" aria-hidden>
            05
          </span>
          <h3 className="k-hcw-title">Compare side by side</h3>
        </div>
        <p className="k-hcw-body">
          Put everyone for a role on one board and read the rubric as a heatmap. The same
          dimensions apply to every candidate, so the strongest and weakest work surfaces at a
          glance before you open a single transcript.
        </p>
      </div>
    </article>
  );
}

/* a single inline legend swatch + its band label */
function LegendKey({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span
        aria-hidden
        style={{ width: 10, height: 10, flex: "none", background: swatch, border: `1px solid ${C.line}` }}
      />
      <span>{label}</span>
    </span>
  );
}
