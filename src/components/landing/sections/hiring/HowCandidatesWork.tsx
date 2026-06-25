"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING · // 02 · see the real work
   ───────────────────────────────────────────────────────────────────────────
   "See exactly how candidates work." A product TOUR, not an icon grid. The six
   real capabilities are an ASYMMETRIC BENTO, and each tile is its OWN component
   under ./how/<Card>.tsx so each can carry a genuinely rich, concrete fragment
   + specific copy. This file is the SHELL: header + the bento grid + the shared
   cell chrome / typography classes. Every named grid-area MUST be a rectangle or
   the browser drops the whole template.

   The cards render an <article className="k-item k-hcw-cell" style={{gridArea}}>
   with a `.k-hcw-frag` (the visual) and a `.k-hcw-meta` (title row + body). They
   own their inner fragment markup (inline-styled) and their copy. Honest scope:
   Claude Code only, no fabricated integrations / pricing / ATS / video / portal.

   Imports only from ../../system; cards import from ../../../system + ../../../data.
   ══════════════════════════════════════════════════════════════════════════ */

import { Band, Inner, Marker, Serif, Accent, C, TYPE } from "../../system";

import WatchCard from "./how/WatchCard";
import RubricCard from "./how/RubricCard";
import ScoreCard from "./how/ScoreCard";
import ReviewCard from "./how/ReviewCard";
import CompareCard from "./how/CompareCard";
import ControlsCard from "./how/ControlsCard";

export default function HowCandidatesWork() {
  const K = "k-hcw-"; // collision-proof scoped-style prefix

  return (
    <Band tone="cream" id="how-candidates-work">
      <ScopedStyle k={K} />

      <Inner>
        <Marker index="02" label="see the real work" />

        {/* ── header: two-column editorial grid (serif line + grotesk lede) ── */}
        <div className={`${K}head`}>
          <Serif as="h2" size="h2" className="k-reveal" style={{ maxWidth: "16ch" }}>
            See exactly how candidates <Accent>work.</Accent>
          </Serif>
          <p
            className="k-reveal"
            style={{ ...TYPE.body, color: C.muted, maxWidth: "48ch", margin: 0, paddingBottom: 6 }}
          >
            The same engine as the developer challenges, pointed at hiring. You watch
            the process, not just the result, and you score it on terms you set.
          </p>
        </div>

        {/* ── the six capabilities, as an asymmetric bento of rich fragments ── */}
        <div data-stagger className={`${K}bento`}>
          <WatchCard area="watch" />
          <RubricCard area="rubric" />
          <ScoreCard area="score" />
          <ReviewCard area="you" />
          <CompareCard area="compare" />
          <ControlsCard area="controls" />
        </div>
      </Inner>
    </Band>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SCOPED STYLE — the bento template + shared cell chrome + typography. Card
   fragments style their OWN internals inline; this provides the cell shell.
   ══════════════════════════════════════════════════════════════════════════ */
function ScopedStyle({ k }: { k: string }) {
  return (
    <style>{`
      .${k}head {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        align-items: end;
        gap: clamp(20px, 4vw, 56px);
        margin-bottom: clamp(40px, 6vw, 68px);
      }

      /* every named area MUST be a rectangle, and cards read 01..06 in order:
         watch = 2x2 hero, rubric + score the top-right squares, you (review) a
         wide bar beside the hero, then compare + controls the wide bottom pair. */
      .${k}bento {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-auto-rows: minmax(0, auto);
        align-items: start;
        gap: clamp(12px, 1.4vw, 18px);
        grid-template-areas:
          "watch   watch   rubric    score"
          "watch   watch   you       you"
          "compare compare controls  controls";
      }

      .${k}cell {
        display: flex;
        flex-direction: column;
        min-width: 0;
        padding: clamp(18px, 1.8vw, 22px);
        border: 1px solid ${C.line};
        background: ${C.panel};
        transition: transform .35s cubic-bezier(0.16,1,0.3,1),
                    border-color .35s cubic-bezier(0.16,1,0.3,1);
        will-change: transform;
      }
      .${k}cell:hover { transform: translateY(-2px); border-color: ${C.accent}; }

      /* the watch hero spans two rows: stretch it to fill that band and let its
         terminal grow into the space, so there is no cream left below it. */
      .${k}watch { align-self: stretch; }
      .${k}watch .${k}frag { flex: 1 1 auto; }

      /* fragment hugs its content at the top of the tile, copy underneath. No
         growth + align-items:start on the grid = tiles size to content, so there
         is never dead space floating around a fragment. */
      .${k}frag {
        flex: 0 0 auto;
        min-height: 0;
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
      }
      .${k}meta { flex: none; }

      .${k}titlerow { display: flex; align-items: baseline; gap: 9px; margin-bottom: 7px; }
      .${k}idx { font-family: ${C.mono}; font-size: 10px; letter-spacing: 0.12em; color: ${C.accent}; flex: none; }
      .${k}title {
        font-family: ${C.mono}; font-weight: 600; font-size: 16px; line-height: 1.2;
        letter-spacing: -0.02em; color: ${C.text}; margin: 0;
      }
      .${k}body {
        font-family: ${C.sans}; font-weight: 400; font-size: 14px; line-height: 1.55;
        color: ${C.muted}; margin: 0; max-width: 52ch;
      }

      /* ── header stacks under ~760px ── */
      @media (max-width: 760px) {
        .${k}head { grid-template-columns: 1fr; align-items: start; }
      }

      /* ── tablet (~920px): 2 cols, watch stays the hero ── */
      @media (max-width: 920px) {
        .${k}bento {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-auto-rows: auto;
          grid-template-areas:
            "watch    watch"
            "rubric   score"
            "you      you"
            "compare  controls";
        }
      }

      /* ── mobile (~620px): single column ── */
      @media (max-width: 620px) {
        .${k}bento {
          grid-template-columns: 1fr;
          grid-template-areas:
            "watch"
            "rubric"
            "score"
            "you"
            "compare"
            "controls";
        }
        .${k}cell { padding: 18px; }
        .${k}frag { margin-bottom: 14px; }
      }
    `}</style>
  );
}
