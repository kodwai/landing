"use client";

/* ══════════════════════════════════════════════════════════════════════════
   SECTION: FAQ  (the last objections, cleared before the close)

   Outship-grade editorial accordion on kodwai's warm-light cream: a centered
   Fraunces headline with one rust accent, then a minimalist list of native
   <details>/<summary> rows separated by full-width hairlines. The question
   sits in a quiet grotesk/mono mix; a "+" glyph rotates to an "x" on open via
   the shared .k-faq utilities. Answers expand with the CSS grid-rows trick, so
   the whole thing works with zero JavaScript.

   SIGNATURE MOTION (pure CSS, reduced-motion safe by construction):
     • plus → x rotate on open (k-faq, shared)
     • grid-rows 0fr → 1fr answer expand (k-faq, shared)
     • a mono row index ( · 01 ) and a rust left-rail tick that slide/colour in
       when a row opens, scoped under a unique k-faq2- prefix.

   Imagery: none. A single hand-drawn underline flourish under the accent word,
   plus a hairline rule that opens and closes the list. Quiet by design.

   Imports: ../system, ../data, react only. No raster assets.
   ══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import {
  C, TYPE, CSS_EASE, Band, Inner, Marker, Serif, Accent, Doodle, GhostLink,
} from "../system";
import { FAQ } from "../data";

/* Tight machine-voice topic tag per question, so the eye can scan the list.
   Order matches ../data FAQ; if FAQ grows past this, the tag simply falls back
   to a generic "faq" without breaking the row. */
const TOPICS = [
  "scoring",
  "agents · langs",
  "local",
  "pricing",
  "fairness",
  "profile",
  "hiring",
] as const;

function FaqRow({ q, a, index, topic, last }: {
  q: string; a: string; index: string; topic: string; last: boolean;
}) {
  const [hover, setHover] = useState(false);

  return (
    <details
      className="k-item k-faq2-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: last ? `1px solid ${C.line}` : "none",
        position: "relative",
      }}
    >
      {/* rust left-rail tick: invisible by default, paints + grows when open */}
      <span aria-hidden className="k-faq2-rail" />

      <summary
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "clamp(14px, 2.4vw, 26px)",
          padding: "clamp(22px, 3.2vw, 30px) 0",
          borderTop: `1px solid ${C.line}`,
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* row index, machine voice */}
        <span
          className="k-faq2-idx"
          aria-hidden
          style={{
            fontFamily: C.mono,
            fontSize: 12,
            lineHeight: 1.7,
            letterSpacing: "0.06em",
            color: hover ? C.accent : C.faint,
            flexShrink: 0,
            width: "2.4ch",
            transition: `color .3s ${CSS_EASE}`,
            paddingTop: 2,
          }}
        >
          {index}
        </span>

        {/* question + topic tag */}
        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 9 }}>
          <span
            style={{
              fontFamily: C.sans,
              fontWeight: 500,
              fontSize: "clamp(17px, 2.15vw, 22px)",
              lineHeight: 1.32,
              letterSpacing: "-0.012em",
              color: C.text,
              textWrap: "balance",
            }}
          >
            {q}
          </span>
          <span
            style={{
              fontFamily: C.mono,
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.faint,
            }}
          >
            {"// "}{topic}
          </span>
        </span>

        {/* + → x glyph (rotated by shared .k-faq css) */}
        <span
          className="k-faq-plus"
          aria-hidden
          style={{
            flexShrink: 0,
            width: 30,
            height: 30,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${hover ? C.accent : C.lineBright}`,
            color: hover ? C.accent : C.muted,
            transition: `border-color .3s ${CSS_EASE}, color .3s ${CSS_EASE}`,
            marginTop: 2,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
            <line x1="6.5" y1="1.5" x2="6.5" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="1.5" y1="6.5" x2="11.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </summary>

      {/* answer: grid-rows 0fr→1fr (shared .k-faq-body) */}
      <div className="k-faq-body">
        <div>
          <p
            style={{
              ...TYPE.body,
              fontSize: "clamp(15px, 1.75vw, 17px)",
              lineHeight: 1.66,
              color: C.muted,
              margin: 0,
              // align the answer under the question text, past the index gutter
              paddingLeft: "calc(2.4ch + clamp(14px, 2.4vw, 26px))",
              paddingRight: "clamp(0px, 6vw, 56px)",
              paddingBottom: "clamp(24px, 3.4vw, 34px)",
              maxWidth: "64ch",
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </details>
  );
}

export default function Faq() {
  const items = FAQ.map((f, i) => ({
    ...f,
    index: String(i + 1).padStart(2, "0"),
    topic: TOPICS[i] ?? "faq",
  }));

  return (
    <Band tone="cream" id="faq">
      {/* scoped styles: a unique prefix so nothing can collide with siblings.
         Only expresses things inline style cannot (open-state rail + idx). */}
      <style>{`
        .k-faq2-rail {
          position: absolute;
          left: -18px;
          top: 50%;
          width: 2px;
          height: 0;
          background: ${C.accent};
          transform: translateY(-50%);
          transition: height .42s ${CSS_EASE};
          pointer-events: none;
        }
        .k-faq2-row[open] > .k-faq2-rail { height: calc(100% - 1px); }
        .k-faq2-row[open] .k-faq2-idx { color: ${C.accent}; }
        .k-faq2-row summary:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
        }
        @media (max-width: 560px) {
          .k-faq2-rail { display: none; }
        }
      `}</style>

      <Inner narrow>
        <Marker index="09" label="questions" />

        {/* ── Centered editorial headline (Outship-style) ── */}
        <div className="k-reveal" style={{ textAlign: "center", marginBottom: "clamp(10px, 1.6vw, 16px)" }}>
          <Serif as="h2" size="h2" style={{ display: "inline-block", position: "relative" }}>
            Frequently asked{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <Accent>questions</Accent>
              <Doodle
                kind="underline"
                width={220}
                height={26}
                strokeWidth={2}
                style={{ position: "absolute", left: "-3%", bottom: "-0.42em", width: "106%", height: "auto" }}
              />
            </span>
            .
          </Serif>
        </div>

        <p
          className="k-reveal"
          style={{
            ...TYPE.body,
            color: C.muted,
            textAlign: "center",
            maxWidth: "48ch",
            margin: "0 auto",
            marginBottom: "clamp(40px, 6vw, 64px)",
          }}
        >
          Everything worth knowing before your first run. Still curious, the answer is one
          message away.
        </p>

        {/* ── The accordion ── */}
        <div className="k-faq" data-stagger>
          {items.map((f, i) => (
            <FaqRow
              key={f.q}
              q={f.q}
              a={f.a}
              index={f.index}
              topic={f.topic}
              last={i === items.length - 1}
            />
          ))}
        </div>

        {/* ── Quiet closing line: one more route to an answer ── */}
        <div
          className="k-reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginTop: "clamp(34px, 4.5vw, 52px)",
          }}
        >
          <span style={{ fontFamily: C.sans, fontSize: 14.5, color: C.muted }}>
            Question that is not here?
          </span>
          <GhostLink
            label="hakan@kodwai.com"
            href="mailto:hakan@kodwai.com"
            event="faq_contact_clicked"
            eventProps={{ location: "faq" }}
          />
        </div>
      </Inner>
    </Band>
  );
}
