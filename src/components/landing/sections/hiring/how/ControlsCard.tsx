"use client";

/* ──────────────────────────────────────────────────────────────────────────
   // 06 · controls  ::  a real per-interview settings BAR (wide cell).
   Four controls laid horizontally: TIME, BUDGET, TOOLS (allow/block toggle),
   AGENT (Claude Code). They wrap to a 2x2 on narrow. Honest: Claude Code only,
   no pricing / seats fabrication.
   ────────────────────────────────────────────────────────────────────────── */

import Image from "next/image";
import { C } from "../../../system";

/* one control cell: tiny mono label over a value, hairline box, fills the row */
function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: "1 1 120px",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        border: `1px solid ${C.line}`,
        background: C.bg,
        padding: "10px 12px",
      }}
    >
      <span
        style={{
          fontFamily: C.mono,
          fontSize: 9.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: C.faint,
        }}
      >
        {label}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center" }}>{children}</span>
    </div>
  );
}

export default function ControlsCard({ area }: { area: string }) {
  const val: React.CSSProperties = {
    fontFamily: C.mono,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: C.text,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  return (
    <article className="k-item k-hcw-cell" style={{ gridArea: area }}>
      <div className="k-hcw-frag">
        {/* a wide settings bar: four controls in a row, wrapping on narrow */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Control label="time limit">
            <span style={val}>
              60<span style={{ color: C.faint }}>:</span>00
            </span>
          </Control>

          <Control label="budget">
            <span style={val}>
              <span style={{ color: C.faint }}>$</span>5.00
            </span>
          </Control>

          <Control label="tools">
            <span style={{ display: "inline-flex", border: `1px solid ${C.line}`, lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: "#fbf7f0", background: C.accent, padding: "5px 9px",
                }}
              >
                allow
              </span>
              <span
                style={{
                  fontFamily: C.mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: C.faint, background: C.panel, padding: "5px 9px",
                  borderLeft: `1px solid ${C.line}`,
                }}
              >
                block
              </span>
            </span>
          </Control>

          <Control label="agent">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, ...val }}>
              <Image
                src="/landing/logos/claude.svg"
                alt="Claude"
                width={14}
                height={14}
                style={{ width: 14, height: 14, display: "block" }}
              />
              Claude Code
            </span>
          </Control>
        </div>

        {/* footnote: these constraints are uniform across the candidate pool */}
        <div
          style={{
            marginTop: 12,
            fontFamily: C.mono,
            fontSize: 10,
            letterSpacing: "0.04em",
            color: C.faint,
            lineHeight: 1.4,
          }}
        >
          applied to every candidate
        </div>
      </div>

      <div className="k-hcw-meta">
        <div className="k-hcw-titlerow">
          <span className="k-hcw-idx" aria-hidden>06</span>
          <h3 className="k-hcw-title">Time, budget, tools</h3>
        </div>
        <p className="k-hcw-body">
          Set the clock, cap the API spend, and allow or block tools per interview.
          The same constraints for every candidate, so the comparison is fair.
        </p>
      </div>
    </article>
  );
}
