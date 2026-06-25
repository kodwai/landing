"use client";

/* ══════════════════════════════════════════════════════════════════════════
   01 · THE PREMISE  (problem framing, cream tone)

   Names the enemy and agitates a frustration the developer already feels:
   LeetCode-grinding proves little now that an agent clears those puzzles in
   seconds. The real skill is judgment, steering an agent through a real ticket
   and catching it when it is confidently wrong. That is what kodwai scores.

   STRUCTURE (Outship-grade editorial):
   • Marker // 01 · the premise
   • Left-aligned serif headline (one rust accent) + grotesk lede
   • A two-column problem list, three sharp statements, each with an original
     monoline SVG icon (struck whiteboard / one-shot stopwatch / day-to-day eye)
   • A then/now diptych aside (whiteboard vs kodwai) with a warm texture on the
     "then" panel, the rust line drawing through it on scroll.

   SIGNATURE MOTION: the problem list staggers in (data-stagger / .k-item), and
   the strike-through on the whiteboard icon + the "then→now" connector draw on
   scroll (useDrawOnView). All gated behind reduced-motion by the shared hooks.

   Self-contained. Imports only from ../system + next/image. No shared edits.
   ══════════════════════════════════════════════════════════════════════════ */

import Image from "next/image";
import {
  C, TYPE,
  Band, Inner, Marker, Serif, Accent, Doodle,
  useDrawOnView, useMediaMax,
} from "../system";
import type { CSSProperties, ReactNode } from "react";

/* ── Local content (not in data.ts): the three problem statements ───────────
   Kept local per the contract. Voice: an engineer who respects your time. */
type Problem = {
  k: "whiteboard" | "oneshot" | "daily";
  kicker: string;
  title: ReactNode;
  body: string;
};

const PROBLEMS: Problem[] = [
  {
    k: "whiteboard",
    kicker: "the format is stale",
    title: <>Built for a different era</>,
    body:
      "Whiteboard puzzles and LeetCode grinds were designed for engineers working alone with nothing but an editor. Point an agent at one and it clears the puzzle in seconds. You learn nothing about the engineer.",
  },
  {
    k: "oneshot",
    kicker: "green is not the same as good",
    title: <>Passing tests proves little</>,
    body:
      "A single careless prompt can make the suite go green and still show no judgment at all. No verification, no decomposition, no recovery when the agent goes confidently wrong. The checkmark hides everything that matters.",
  },
  {
    k: "daily",
    kicker: "the real work is unmeasured",
    title: <>Nothing measures how you work</>,
    body:
      "You spend your day directing an agent: writing the spec, catching hallucinations, checking what actually shipped. That is the skill that decides who is good now, and until kodwai, nothing put a number on it.",
  },
];

/* ── Original monoline icons (rust + ink, 0 radius spirit, draw-on-view) ──── */

function IconWhiteboard({ stroke = C.text, accent = C.accent }: { stroke?: string; accent?: string }) {
  // A whiteboard with a binary-tree sketch, struck through in rust.
  const ref = useDrawOnView<SVGSVGElement>({ duration: 1000, delay: 70 });
  return (
    <svg ref={ref} width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden
      stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {/* board */}
      <rect x="4" y="6" width="32" height="22" />
      <line x1="14" y1="28" x2="12" y2="34" />
      <line x1="26" y1="28" x2="28" y2="34" />
      {/* tiny binary tree sketch */}
      <circle cx="20" cy="12" r="1.7" />
      <circle cx="14" cy="20" r="1.7" />
      <circle cx="26" cy="20" r="1.7" />
      <line x1="18.7" y1="13.3" x2="15.3" y2="18.7" />
      <line x1="21.3" y1="13.3" x2="24.7" y2="18.7" />
      {/* the strike: drawn last, in rust */}
      <line x1="6" y1="25" x2="34" y2="9" stroke={accent} strokeWidth={2.2} />
    </svg>
  );
}

function IconOneShot({ stroke = C.text, accent = C.accent }: { stroke?: string; accent?: string }) {
  // A stopwatch whose single hand snaps to "done", a one-shot prompt.
  const ref = useDrawOnView<SVGSVGElement>({ duration: 1000, delay: 70 });
  return (
    <svg ref={ref} width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden
      stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="22" r="12" />
      <line x1="20" y1="7" x2="20" y2="10" />
      <line x1="16" y1="7" x2="24" y2="7" />
      <line x1="30" y1="12" x2="32" y2="10" />
      {/* single hand snapped to a check, no steps */}
      <line x1="20" y1="22" x2="26" y2="16" stroke={accent} strokeWidth={2.2} />
      <path d="M15 22 l3 3 l5 -6" stroke={accent} strokeWidth={1.8} />
    </svg>
  );
}

function IconDaily({ stroke = C.text, accent = C.accent }: { stroke?: string; accent?: string }) {
  // An eye over a prompt cursor: how you actually drive, day to day.
  const ref = useDrawOnView<SVGSVGElement>({ duration: 1000, delay: 70 });
  return (
    <svg ref={ref} width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden
      stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 16 C 11 8, 29 8, 35 16 C 29 24, 11 24, 5 16 Z" />
      <circle cx="20" cy="16" r="3.4" stroke={accent} strokeWidth={2} />
      {/* prompt line below: the daily work */}
      <line x1="10" y1="31" x2="13" y2="31" stroke={accent} strokeWidth={2.2} />
      <line x1="17" y1="31" x2="30" y2="31" />
    </svg>
  );
}

const ICONS: Record<Problem["k"], () => ReactNode> = {
  whiteboard: () => <IconWhiteboard />,
  oneshot: () => <IconOneShot />,
  daily: () => <IconDaily />,
};

/* ── A single problem entry ────────────────────────────────────────────────
   Hover lifts the rule + brightens the kicker. No layout shift. */
function ProblemRow({ p, index }: { p: Problem; index: number }) {
  const Icon = ICONS[p.k];
  return (
    <li
      className="k-item"
      style={{
        listStyle: "none",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "clamp(16px, 2.4vw, 24px)",
        padding: "26px 0",
        borderTop: index === 0 ? "none" : `1px solid ${C.line}`,
      }}
    >
      {/* icon well */}
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          border: `1px solid ${C.lineBright}`,
          background: C.panel,
          flexShrink: 0,
        }}
      >
        <Icon />
      </span>

      <div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: C.mono,
            fontSize: 10.5,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 9,
          }}
        >
          <span style={{ color: C.faint }}>{String(index + 1).padStart(2, "0")}</span>
          {p.kicker}
        </span>
        <h3
          style={{
            ...TYPE.h3,
            fontSize: "clamp(20px, 2.4vw, 27px)",
            color: C.text,
            margin: "0 0 8px",
          }}
        >
          {p.title}
        </h3>
        <p
          style={{
            ...TYPE.body,
            fontSize: "clamp(14.5px, 1.7vw, 16.5px)",
            color: C.muted,
            margin: 0,
            maxWidth: "54ch",
          }}
        >
          {p.body}
        </p>
      </div>
    </li>
  );
}

export default function Premise() {
  const stacked = useMediaMax(900);

  // Draw-on-view for the then→now connector arrow inside the diptych.
  const connectorRef = useDrawOnView<SVGSVGElement>({ duration: 1100, delay: 80 });

  const panelLabel: CSSProperties = {
    fontFamily: C.mono,
    fontSize: 10.5,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    margin: "0 0 12px",
  };

  return (
    <Band tone="cream" id="premise">
      <Inner>
        <Marker index="01" label="the premise" />

        {/* ── Headline + lede (left-aligned editorial) ── */}
        <div
          className="k-reveal"
          style={{ maxWidth: 920, marginBottom: "clamp(48px, 7vw, 80px)" }}
        >
          <Serif as="h2" size="h2" style={{ marginBottom: 22 }}>
            LeetCode doesn&apos;t prove <Accent>much anymore.</Accent>
          </Serif>
          <p
            style={{
              ...TYPE.bodyLg,
              color: C.muted,
              margin: 0,
              maxWidth: "62ch",
            }}
          >
            The work changed. You point an agent at a real problem, catch it when it is
            confidently wrong, and check what it actually shipped.{" "}
            <span style={{ color: C.text, fontWeight: 500 }}>
              That judgment is the skill, and it is the thing kodwai scores.
            </span>
          </p>
        </div>

        {/* ── Problem list (left) + then/now diptych (right) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: stacked ? "1fr" : "1.18fr 0.82fr",
            gap: stacked ? 44 : "clamp(40px, 5vw, 72px)",
            alignItems: "stretch",
          }}
        >
          {/* problem statements */}
          <div style={{ position: "relative" }}>
            <p
              className="k-reveal"
              style={{
                fontFamily: C.mono,
                fontSize: 11,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: C.faint,
                margin: "0 0 8px",
              }}
            >
              {"// three reasons the old test fails"}
            </p>
            <ol data-stagger style={{ margin: 0, padding: 0 }}>
              {PROBLEMS.map((p, i) => (
                <ProblemRow key={p.k} p={p} index={i} />
              ))}
            </ol>
          </div>

          {/* then / now diptych aside */}
          <aside
            className="k-reveal"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${C.lineBright}`,
              background: C.panel,
              boxShadow: "0 2px 8px rgba(40,24,12,0.05), 0 24px 48px -28px rgba(40,24,12,0.22)",
            }}
          >
            {/* THEN / the whiteboard, on a warm erased texture */}
            <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.line}`, flex: 1, display: "flex" }}>
              <Image
                src="/landing/premise/whiteboard-tex.jpg"
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 900px) 100vw, 380px"
                style={{ objectFit: "cover", opacity: 0.6, zIndex: 0 }}
              />
              {/* cream wash so text stays AA */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(250,248,244,0.62), rgba(250,248,244,0.86))",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1, padding: "24px 26px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, width: "100%" }}>
                <p style={{ ...panelLabel, color: C.faint }}>then / the whiteboard</p>
                <p
                  style={{
                    fontFamily: C.serif,
                    fontStyle: "italic",
                    fontSize: "clamp(18px, 2.3vw, 22px)",
                    lineHeight: 1.35,
                    color: C.text,
                    margin: "0 0 12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  &ldquo;Invert a binary tree.&rdquo;
                </p>
                <p style={{ ...TYPE.body, fontSize: 14.5, color: C.muted, margin: "0 0 14px" }}>
                  Alone, on a board, while a stranger watches the clock.
                </p>
                <p style={{ ...TYPE.body, fontSize: 14.5, color: C.muted, margin: "0 0 14px" }}>
                  It rewards recall, the one thing an agent now makes free. Nothing about how the person actually builds ever gets measured.
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: C.mono,
                    fontSize: 11,
                    letterSpacing: 0.4,
                    color: C.faint,
                    borderTop: `1px solid ${C.line}`,
                    paddingTop: 12,
                  }}
                >
                  <span style={{ color: C.accent }}>{"›"}</span>
                  an agent does it in under five seconds.
                </span>
              </div>
            </div>

            {/* connector: a small rust arrow that draws then→now on scroll */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: C.bg,
                border: `1px solid ${C.lineBright}`,
                borderRadius: "50%",
              }}
            >
              <svg
                ref={connectorRef}
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke={C.accent}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="9" y1="2" x2="9" y2="15" />
                <path d="M4.5 10.5 L9 15 L13.5 10.5" />
              </svg>
            </div>

            {/* NOW / kodwai */}
            <div style={{ padding: "26px 26px 24px", position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ ...panelLabel, color: C.accent }}>now / kodwai</p>
              <p
                style={{
                  fontFamily: C.serif,
                  fontSize: "clamp(18px, 2.3vw, 22px)",
                  lineHeight: 1.35,
                  color: C.text,
                  margin: "0 0 12px",
                  letterSpacing: "-0.01em",
                }}
              >
                Drive a real agent through a real feature, on your own machine.
              </p>
              <p style={{ ...TYPE.body, fontSize: 14.5, color: C.muted, margin: "0 0 14px" }}>
                The same loop you run every day. Kodwai watches the whole session, the prompts, the recovery, the result, not just the final diff.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                {["direct", "verify", "ship"].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: C.mono,
                      fontSize: 10.5,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                      color: C.text,
                      border: `1px solid ${C.line}`,
                      background: C.bg,
                      padding: "5px 10px",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: C.mono,
                  fontSize: 11,
                  letterSpacing: 0.4,
                  color: C.faint,
                  borderTop: `1px solid ${C.line}`,
                  paddingTop: 12,
                  width: "100%",
                }}
              >
                <span style={{ color: C.accent }}>{"›"}</span>
                scored on how you direct, verify, and ship.
              </span>

              {/* hand-drawn underline doodle under the panel, Outship flourish */}
              <Doodle
                kind="underline"
                width={120}
                height={26}
                strokeWidth={2}
                style={{ position: "absolute", right: 18, bottom: -10, opacity: 0.9 }}
              />
            </div>
          </aside>
        </div>
      </Inner>
    </Band>
  );
}
