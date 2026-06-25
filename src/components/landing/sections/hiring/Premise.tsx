"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING · 01 · THE PREMISE  (problem framing, cream tone)

   Names the enemy: the take-home is broken. It is homework, not work. You wait
   days for a final diff that hides every decision, and the candidate with the
   most free time wins. You never watch them drive an agent, which is the one
   thing that predicts the job.

   STRUCTURE (mirrors the canonical landing Premise.tsx, then/now editorial):
   • Marker // 01 · the old interview fails
   • Two-column header: serif headline (one rust accent) + grotesk lede
   • A two-column body grid, align-items: stretch:
       LEFT  : a numbered "why the take-home fails" list (data-stagger / k-item),
               hairline-separated rows
       RIGHT : an equal-height THEN / NOW card. The two panels flex:1 with
               space-between so the card matches the list height exactly.

   SIGNATURE MOTION: the failure list staggers in (data-stagger / .k-item), the
   header fades up (.k-reveal), the then→now connector arrow draws on scroll
   (useDrawOnView). All no-op under prefers-reduced-motion (shared hooks).

   Self-contained. Imports only from ../../system. No shared edits.
   ══════════════════════════════════════════════════════════════════════════ */

import {
  C, TYPE,
  Band, Inner, Marker, Serif, Accent, Doodle,
  useDrawOnView, useMediaMax,
} from "../../system";
import type { CSSProperties } from "react";

/* ── Local content: the four reasons the take-home fails ────────────────────
   Kept local (mirrors how the landing Premise holds its statements locally).
   Voice: an engineer who respects the hiring team's time. */
type Fail = { title: string; body: string };

const FAILS: Fail[] = [
  {
    title: "It is homework, not the job.",
    body:
      "Graded blind, days later, on a final diff that hides every decision that mattered.",
  },
  {
    title: "It rewards free time, not skill.",
    body:
      "The candidate who can spend a weekend on it wins. That is not the signal you want.",
  },
  {
    title: "It is easy to outsource and easy to game.",
    body:
      "You cannot tell who actually drove the work, or how.",
  },
  {
    title: "You never watch them work.",
    body:
      "The one thing that predicts the job, how they steer and recover with an agent, is exactly what you never see.",
  },
];

/* ── A single failure row ──────────────────────────────────────────────────
   A mono ordinal, then title + body. Hairline-separated from the row above. */
function FailRow({ f, index }: { f: Fail; index: number }) {
  return (
    <li
      className="k-item"
      style={{
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "clamp(14px, 2.2vw, 22px)",
        padding: "24px 0",
        borderTop: index === 0 ? "none" : `1px solid ${C.line}`,
      }}
    >
      {/* mono ordinal */}
      <span
        aria-hidden
        style={{
          fontFamily: C.mono,
          fontSize: 12,
          lineHeight: 1,
          letterSpacing: 0.5,
          color: C.accent,
          paddingTop: 7,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div>
        <h3
          style={{
            ...TYPE.h3,
            fontSize: "clamp(19px, 2.3vw, 26px)",
            color: C.text,
            margin: "0 0 8px",
          }}
        >
          {f.title}
        </h3>
        <p
          style={{
            ...TYPE.body,
            fontSize: "clamp(14.5px, 1.7vw, 16.5px)",
            color: C.muted,
            margin: 0,
            maxWidth: "52ch",
          }}
        >
          {f.body}
        </p>
      </div>
    </li>
  );
}

export default function Premise() {
  const stacked = useMediaMax(900);

  // Draw-on-view for the then→now connector arrow inside the card.
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
        <Marker index="01" label="the old interview fails" />

        {/* ── Header: serif headline (left) + lede (right) ── */}
        <div
          className="k-reveal"
          style={{
            display: "grid",
            gridTemplateColumns: stacked ? "1fr" : "1.05fr 0.95fr",
            gap: stacked ? 22 : "clamp(36px, 5vw, 72px)",
            alignItems: "end",
            marginBottom: "clamp(48px, 7vw, 80px)",
          }}
        >
          <Serif as="h2" size="h2">
            The take-home is <Accent>broken.</Accent>
          </Serif>
          <p
            style={{
              ...TYPE.body,
              color: C.muted,
              margin: 0,
              maxWidth: "46ch",
            }}
          >
            It is homework, not work. You wait days for a diff that hides the process,
            and the candidate with the most free time wins.{" "}
            <span style={{ color: C.text, fontWeight: 500 }}>
              You never see how they actually drive an agent.
            </span>
          </p>
        </div>

        {/* ── Failure list (left) + then/now card (right) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: stacked ? "1fr" : "1.18fr 0.82fr",
            gap: stacked ? 44 : "clamp(40px, 5vw, 72px)",
            alignItems: "stretch",
          }}
        >
          {/* why the take-home fails */}
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
              {"// why the take-home fails"}
            </p>
            <ol data-stagger style={{ margin: 0, padding: 0 }}>
              {FAILS.map((f, i) => (
                <FailRow key={f.title} f={f} index={i} />
              ))}
            </ol>
          </div>

          {/* then / now card (equal-height aside) */}
          <aside
            className="k-reveal"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${C.lineBright}`,
              background: C.panel,
              boxShadow:
                "0 2px 8px rgba(40,24,12,0.05), 0 24px 48px -28px rgba(40,24,12,0.22)",
            }}
          >
            {/* THEN / the take-home (content vertically centered in the panel) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "clamp(26px, 3vw, 34px) 26px",
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <p style={{ ...panelLabel, color: C.faint }}>then</p>
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
                The take-home.
              </p>
              <p style={{ ...TYPE.body, fontSize: 14.5, color: C.muted, margin: 0 }}>
                A zip file and a deadline. Async homework, graded on the final diff
                alone. Nothing about how the person actually builds ever gets seen.
              </p>
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

            {/* NOW / a live session (rust-tinted accent, content centered) */}
            <div
              style={{
                position: "relative",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "clamp(26px, 3vw, 34px) 26px",
                background: C.accentSoft,
              }}
            >
              <p style={{ ...panelLabel, color: C.accent }}>now</p>
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
                A live session.
              </p>
              <p style={{ ...TYPE.body, fontSize: 14.5, color: C.muted, margin: 0 }}>
                A real ticket, solved in Claude Code, on their own machine. Kodwai
                captures the whole session, the prompts, the recovery, the result,
                and scores it against your rubric.
              </p>

              {/* hand-drawn underline doodle, Outship flourish */}
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
