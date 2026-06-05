"use client";

/* ══════════════════════════════════════════════════════════════════════════
   TRUST STRIP: borrowed credibility, right after the hook.
   Outship's "world-class teams already live with Outship" + quiet logo row,
   ported to kodwai's warm-light brand. Cream surface, hairline top & bottom,
   COMPACT vertical rhythm (not a full SECTION_PAD). The logo marquee is the
   visual; a centered mono eyebrow frames it, set off by a thin draw-on-view
   rust flourish so the strip reads as deliberate connective tissue, not filler.

   Signature motion: the two hairline flourishes flanking a small rust diamond
   draw outward from the centre on scroll-into-view (stroke-dashoffset), then
   the logo marquee scrolls beneath. Both transform/opacity only, both gated
   behind reduced-motion (drawn-state visible, marquee static via globals).
   ══════════════════════════════════════════════════════════════════════════ */

import { C, PAD, MAXW, useDrawOnView } from "../system";
import LogoStrip from "@/components/LogoStrip";

/* Local copy, kept in-file per the contract (no shared-file edits). */
const EYEBROW = "Made for developers who want to work at";

export default function Trust() {
  // Draw-on-view flourish ref (the symmetric hairlines + centre diamond).
  const flourishRef = useDrawOnView<SVGSVGElement>({ duration: 820, delay: 0 });

  return (
    <section
      aria-label="Companies developers aspire to"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
        padding: `clamp(34px, 5vw, 52px) ${PAD}`,
      }}
    >
      <div
        className="k-reveal"
        style={{
          maxWidth: MAXW,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(22px, 3.4vw, 34px)",
        }}
      >
        {/* ── Eyebrow + hairline flourish ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: C.mono,
              fontSize: 12,
              fontWeight: 500,
              color: C.text,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.7,
              maxWidth: "30ch",
            }}
          >
            {EYEBROW}
          </span>

          {/* Symmetric hairline flourish with a rust diamond at the centre.
              Draws outward on view; fully visible (static) under reduced-motion. */}
          <svg
            ref={flourishRef}
            width={132}
            height={12}
            viewBox="0 0 132 12"
            fill="none"
            aria-hidden
            style={{ display: "block" }}
          >
            {/* left rule: drawn from centre out (path runs centre to left) */}
            <line x1="60" y1="6" x2="6" y2="6" stroke={C.lineBright} strokeWidth={1} strokeLinecap="round" />
            {/* right rule: drawn from centre out (path runs centre to right) */}
            <line x1="72" y1="6" x2="126" y2="6" stroke={C.lineBright} strokeWidth={1} strokeLinecap="round" />
            {/* centre rust diamond */}
            <rect
              x="62.46"
              y="2.46"
              width="7.07"
              height="7.07"
              transform="rotate(45 66 6)"
              fill={C.accent}
            />
          </svg>
        </div>

        {/* ── Logo marquee (the visual) ── */}
        <div style={{ width: "100%" }}>
          <LogoStrip
            marquee
            filter="brightness(0)"
            opacity={0.45}
            hoverOpacity={0.8}
            height={26}
            gap={88}
            mobileGap={38}
            speed={50}
          />
        </div>
      </div>
    </section>
  );
}
