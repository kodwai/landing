"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING STATS BAND  ·  // 05 · the proof
   ───────────────────────────────────────────────────────────────────────────
   The proof band for the hiring page. Mirrors the landing Stats strip almost
   exactly: a two-column editorial header (serif framing line + grotesk lede)
   above a single horizontal row of four proof points separated by thin
   vertical hairline rules.

   Each cell: a small mono kicker with a short rust tick, a large Fraunces
   serif numeral on a shared baseline, then a one-to-two line grotesk caption.
   Everything is left-aligned within its cell and aligned across all four.

   Layout: CSS grid, 4 cols desktop -> 2 cols tablet (~920px) -> 1 col mobile
   (~560px), with dividers drawn as cell borders so they always line up.
   Numerals count up via the system Counter when count===true; otherwise the
   value/display renders verbatim. Content renders with no JS and the count-up
   self-gates under prefers-reduced-motion (built into Counter).
   ══════════════════════════════════════════════════════════════════════════ */

import { Band, Inner, Marker, Serif, Accent, Counter, C, TYPE } from "../../system";
import { HIRING_STATS } from "../../data";

/* Loosely typed so optional fields (prefix/suffix/display) are reachable.
   Sourced from ../../data; we only attach presentation (the kicker) here. */
type StatItem = {
  value: number | string;
  caption: string;
  count: boolean;
  prefix?: string;
  suffix?: string;
  display?: string;
};
const ITEMS = HIRING_STATS as readonly StatItem[];

/* Mono kicker per stat, index-aligned to HIRING_STATS. */
const KICKERS = ["the invite", "the machine", "the visibility", "the grading"] as const;

export default function Stats() {
  const K = "k-hstats-"; // unique scoped-style prefix (collision-proof)

  return (
    <Band tone="paper2" id="hiring-stats">
      <ScopedStyle k={K} />

      <Inner>
        <Marker index="05" label="the proof" />

        {/* ── header: serif framing line + a quiet grotesk lede ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "clamp(18px, 4vw, 44px)",
            marginBottom: "clamp(44px, 6.5vw, 76px)",
          }}
        >
          <Serif as="h2" size="h2" className="k-reveal" style={{ maxWidth: "16ch" }}>
            Hiring you can actually <Accent>see</Accent>.
          </Serif>

          <p
            className="k-reveal"
            style={{
              ...TYPE.body,
              color: C.muted,
              maxWidth: "46ch",
              margin: 0,
              paddingBottom: 8,
            }}
          >
            No sandbox, no take-home, no guessing. You watch the real work, you
            score it on your terms, and you compare like for like.
          </p>
        </div>

        {/* ── the aligned stat strip ──
            Dividers are drawn as left borders on each cell. The first cell in
            every visual row hides its border (handled in scoped CSS per
            breakpoint) so rules sit only between cells, never at the edges. */}
        <div data-stagger className={`${K}grid`}>
          {ITEMS.map((item, i) => {
            const numeral = item.display ?? (
              <>
                {item.prefix}
                {typeof item.value === "number" && item.count ? (
                  <Counter to={item.value} />
                ) : (
                  item.value
                )}
                {item.suffix}
              </>
            );
            return (
              <figure key={i} className={`k-item ${K}cell`}>
                {/* kicker: machine voice, mono, with a short rust tick */}
                <span className={`${K}kicker`}>
                  <span className={`${K}tick`} aria-hidden />
                  {KICKERS[i] ?? KICKERS[0]}
                </span>

                {/* the numeral: serif, baseline-aligned across the row */}
                <span className={`${K}num`}>{numeral}</span>

                {/* caption: prose, grotesk */}
                <figcaption className={`${K}cap`}>{item.caption}</figcaption>
              </figure>
            );
          })}
        </div>

        {/* ── footer rule: hairline + a single mono annotation, quiet ── */}
        <div className={`k-reveal ${K}foot`}>
          <span className={`${K}footTag`}>measured, not promised</span>
          <span className={`${K}footRule`} aria-hidden />
          <span className={`${K}footNote`}>the session is the resume</span>
        </div>
      </Inner>
    </Band>
  );
}

/* ── scoped style ──
   Static layout only (grid template, hairline dividers, type sizing). No
   animation here, so it is reduced-motion-safe by construction. Numerals share
   a fixed line-box and bottom alignment so all four numbers sit on one baseline
   regardless of glyph height. */
function ScopedStyle({ k }: { k: string }) {
  return (
    <style>{`
      .${k}grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        border-top: 1px solid ${C.line};
        border-bottom: 1px solid ${C.line};
      }
      .${k}cell {
        margin: 0;
        display: flex;
        flex-direction: column;
        padding: clamp(28px, 3vw, 40px) clamp(22px, 2.4vw, 34px);
        border-left: 1px solid ${C.line};
      }
      /* no rule at the left edge of each visual row */
      .${k}grid > .${k}cell:nth-child(4n + 1) { border-left: none; padding-left: 0; }

      .${k}kicker {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        font-family: ${C.mono};
        font-size: 10.5px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: ${C.faint};
        margin-bottom: clamp(18px, 2vw, 26px);
      }
      .${k}tick {
        width: 16px;
        height: 2px;
        background: ${C.accent};
        flex: none;
      }

      /* shared baseline: fixed line-box, numeral pinned to the bottom of it */
      .${k}num {
        display: flex;
        align-items: flex-end;
        min-height: clamp(56px, 8vw, 96px);
        font-family: ${C.serif};
        font-weight: 430;
        font-size: clamp(52px, 6.6vw, 88px);
        line-height: 0.86;
        letter-spacing: -0.03em;
        color: ${C.text};
        font-feature-settings: "tnum" 1, "lnum" 1;
      }

      .${k}cap {
        margin: clamp(16px, 1.8vw, 22px) 0 0;
        font-family: ${C.sans};
        font-weight: 400;
        font-size: 15px;
        line-height: 1.55;
        color: ${C.muted};
        max-width: 26ch;
      }

      /* ── footer ── */
      .${k}foot {
        margin-top: clamp(34px, 4.5vw, 56px);
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .${k}footTag {
        font-family: ${C.mono};
        font-size: 10.5px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: ${C.faint};
        white-space: nowrap;
      }
      .${k}footRule {
        flex: 1;
        min-width: 28px;
        height: 1px;
        background: ${C.line};
      }
      .${k}footNote {
        font-family: ${C.mono};
        font-size: 10.5px;
        letter-spacing: 0.12em;
        color: ${C.muted};
        white-space: nowrap;
      }

      /* ── tablet: 2 columns ── */
      @media (max-width: 920px) {
        .${k}grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .${k}grid > .${k}cell { border-left: 1px solid ${C.line}; padding-left: clamp(22px, 2.4vw, 34px); }
        .${k}grid > .${k}cell:nth-child(2n + 1) { border-left: none; padding-left: 0; }
        /* horizontal rule between the two stacked rows */
        .${k}grid > .${k}cell:nth-child(n + 3) { border-top: 1px solid ${C.line}; }
      }

      /* ── mobile: 1 column ── */
      @media (max-width: 560px) {
        .${k}grid { grid-template-columns: 1fr; }
        .${k}grid > .${k}cell { border-left: none; padding: clamp(26px, 7vw, 34px) 0; }
        .${k}grid > .${k}cell:nth-child(n + 2) { border-top: 1px solid ${C.line}; }
        .${k}num { min-height: 0; }
        .${k}cap { max-width: 34ch; }
      }
    `}</style>
  );
}
