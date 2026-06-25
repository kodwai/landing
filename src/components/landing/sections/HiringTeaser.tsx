"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HIRING TEASER (main page): the developer landing stays developer-first, so
   the full B2B interview story lives on its own /hiring page. This is the slim
   bridge to it, a single quiet two-column band.
   ══════════════════════════════════════════════════════════════════════════ */

import { C, TYPE, MAXW, PAD, Serif, Accent, GhostLink } from "../system";

export default function HiringTeaser() {
  return (
    <section style={{ background: C.paper2, borderTop: `1px solid ${C.line}`, padding: `clamp(56px, 8vw, 96px) ${PAD}` }}>
      <div
        className="k-reveal k-split-2"
        style={{
          maxWidth: MAXW,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.35fr 0.9fr",
          gap: "clamp(28px, 4vw, 56px)",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ ...TYPE.label, color: C.accent }}>for hiring teams</span>
          <Serif as="h2" size="h3" style={{ margin: "14px 0 0" }}>
            Interview the way they <Accent>really work.</Accent>
          </Serif>
          <p style={{ ...TYPE.body, color: C.muted, margin: "16px 0 0", maxWidth: "54ch" }}>
            Run the same challenges as private interviews and watch the real process: the prompts, the
            commits, the tests, the score. Not just the final answer. The full hiring track lives on its own page.
          </p>
        </div>
        <div style={{ display: "flex" }}>
          <GhostLink label="see how interviews work" href="/hiring" event="cta_clicked" eventProps={{ location: "hiring_teaser" }} />
        </div>
      </div>
    </section>
  );
}
