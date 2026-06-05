"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HiringIntegrations : FOR HIRING TEAMS  (the secondary track, told honestly)
   ─────────────────────────────────────────────────────────────────────────
   Full-bleed warm-dark band (palette D). The one place the hiring story gets
   real estate, kept clearly SECONDARY to the developer story. Two acts:
     1. "Interview the way they really work.": serif h2 + rust accent, lede,
        the four HIRING_FEATURES as a clean dark list, a cream LightButton CTA.
     2. The HONEST companion panel. The product has NO ATS integrations yet, so
        we do not claim any. Instead we tell the truth that is actually a
        stronger pitch: there is nothing to connect. You send a link, the
        candidate solves locally in the agent they already use (Claude Code or
        Cursor, shown with their REAL marks), and you get back a scored session
        with the full replay. A three-step mini-flow spells it out.

   Signature motion: the feature list and the flow steps stagger in; a hairline
   connector between the steps draws on view. Everything is gated behind
   reduced-motion (the connector is left fully drawn when motion is off; the
   stagger no-ops via the global choreography). Content renders with no JS;
   motion is progressive enhancement only.

   No fake brand logos beyond the two real, transparent agent marks shipped in
   /public/landing/logos. No ATS / "connect your stack / synced" claims.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  Band, Inner, Eyebrow, Serif, Accent, LightButton,
  D, CSS_EASE, EASE,
} from "../system";
import { HIRING_FEATURES } from "../data";
import anime from "animejs";

/* The agents a candidate already lives in. Real, transparent marks that ship
   in /public/landing/logos. cursor-light.svg is the cream-on-dark variant of
   cursor.svg, so the mark stays legible on the warm-dark band. We claim no
   capability here beyond "this is what they already use". */
const AGENTS_USED = [
  { name: "Claude Code", src: "/landing/logos/claude.svg" },
  { name: "Cursor", src: "/landing/logos/cursor-light.svg" },
] as const;

/* The honest interview loop. No integration step exists, and we do not invent
   one: a link goes out, the candidate solves on their own machine, a scored
   replay comes back. */
const FLOW_STEPS = [
  {
    n: "01",
    label: "Send the invite",
    body: "One link, scoped to the challenge and time limit you set. No account to provision, no stack to wire up.",
  },
  {
    n: "02",
    label: "They solve locally",
    body: "The candidate works on their own machine in the agent they already use. Same CLI as the developer track, nothing new to learn.",
  },
  {
    n: "03",
    label: "You review the replay",
    body: "A scored session lands back: the prompts, commits, test runs, and transcript next to the score. Share one link with your team.",
  },
] as const;

export default function HiringIntegrations() {
  // The step connector is the only bespoke motion in this section. It draws on
  // view and is left fully drawn under reduced-motion.
  const lineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el || typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const segs = Array.from(el.querySelectorAll<SVGLineElement>("line"));
    if (!segs.length) return;
    if (reduced) return; // leave the connector fully drawn
    segs.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          anime({
            targets: segs,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 1100,
            delay: anime.stagger(120),
            easing: EASE,
          });
          io.unobserve(el);
        }),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Band tone="dark" id="hiring">
      {/* scoped keyframes + responsive rules for THIS section only */}
      <style>{`
        .k-hir-grid {
          display: grid;
          grid-template-columns: 1fr minmax(380px, 0.92fr);
          gap: clamp(40px, 6vw, 80px);
          align-items: start;
        }
        @media (max-width: 980px) {
          .k-hir-grid { grid-template-columns: 1fr; gap: 56px; }
        }
        .k-hir-feat:hover .k-hir-arrow { transform: translateX(4px); color: ${D.accent}; }
        .k-hir-arrow { transition: transform .3s ${CSS_EASE}, color .3s ${CSS_EASE}; }
        .k-hir-agent { transition: border-color .3s ${CSS_EASE}, transform .3s ${CSS_EASE}, background .3s ${CSS_EASE}; }
        .k-hir-agent:hover { border-color: ${D.accent}; transform: translateY(-2px); background: ${D.elevated}; }
        .k-hir-stepnum {
          width: 34px; height: 34px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid ${D.lineBright}; background: ${D.panel};
          font-family: ${D.mono}; font-size: 12px; font-weight: 600;
          color: ${D.accent}; letter-spacing: 1px; position: relative; z-index: 1;
        }
      `}</style>

      {/* warm earthy/glow backdrop, kept faint so text stays AA-legible */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(180deg, rgba(14,13,12,0.86) 0%, rgba(14,13,12,0.62) 40%, rgba(14,13,12,0.9) 100%), url(/landing/tex/earthy-band.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        }}
      />

      <Inner style={{ zIndex: 1 }}>
        {/* ── secondary-track marker line ── */}
        <div
          className="k-reveal"
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}
        >
          <span style={{ fontFamily: D.mono, fontSize: 12, color: D.accent, letterSpacing: 0.5 }}>{"//"}</span>
          <span style={{ fontFamily: D.mono, fontSize: 11, color: D.muted, textTransform: "lowercase", letterSpacing: 2 }}>
            the secondary track
          </span>
          <span style={{ flex: 1, height: 1, background: D.line }} aria-hidden />
        </div>

        <div className="k-hir-grid">
          {/* ════════ LEFT: the hiring narrative ════════ */}
          <div>
            <div className="k-reveal" style={{ marginBottom: 22 }}>
              <Eyebrow label="for hiring teams" tone="dark" />
            </div>

            <Serif as="h2" size="h2" tone="dark" className="k-reveal" style={{ maxWidth: "16ch" }}>
              Interview the way <Accent tone="dark">they really work.</Accent>
            </Serif>

            <p
              className="k-reveal"
              style={{
                fontFamily: D.sans, fontSize: "clamp(15.5px, 1.9vw, 18.5px)",
                lineHeight: 1.62, color: D.muted, margin: "24px 0 0", maxWidth: "48ch",
              }}
            >
              Run the same challenges as private interviews and watch the real process: the
              prompts, the commits, the tests, the score. Not just the final answer.
            </p>

            {/* HIRING_FEATURES as a clean dark list (arrow + title + body), staggered */}
            <ul
              data-stagger
              style={{
                listStyle: "none", margin: "38px 0 0", padding: 0,
                display: "grid", gap: 0,
                borderTop: `1px solid ${D.line}`,
              }}
            >
              {HIRING_FEATURES.map((f) => (
                <li
                  key={f.title}
                  className="k-item k-hir-feat"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 16,
                    alignItems: "start",
                    padding: "18px 0",
                    borderBottom: `1px solid ${D.line}`,
                  }}
                >
                  <span
                    className="k-hir-arrow"
                    aria-hidden
                    style={{
                      fontFamily: D.mono, fontSize: 15, color: D.faint,
                      lineHeight: 1.4, marginTop: 1,
                    }}
                  >
                    →
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: D.sans, fontWeight: 600, fontSize: "clamp(15px, 1.7vw, 17px)",
                        color: D.text, letterSpacing: "-0.005em", marginBottom: 5,
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontFamily: D.sans, fontSize: 14.5, lineHeight: 1.55,
                        color: D.muted, maxWidth: "44ch",
                      }}
                    >
                      {f.body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="k-reveal" style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
              <LightButton
                label="Set up interviews"
                tone="dark"
                event="cta_clicked"
                eventProps={{ surface: "hiring_band", track: "hiring" }}
              />
            </div>
          </div>

          {/* ════════ RIGHT: the honest "no integration" panel ════════ */}
          <div className="k-reveal">
            <div
              style={{
                border: `1px solid ${D.lineBright}`,
                background: D.panel,
                boxShadow: "0 30px 70px -34px rgba(0,0,0,0.85)",
              }}
            >
              {/* ── panel header: the honest headline ── */}
              <div style={{ padding: "26px 26px 22px", borderBottom: `1px solid ${D.line}` }}>
                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16,
                    border: `1px solid ${D.line}`, background: D.bg, padding: "6px 12px",
                  }}
                >
                  <span style={{ fontFamily: D.mono, fontSize: 11, color: D.accent, letterSpacing: 1, textTransform: "uppercase" }}>
                    no integration required
                  </span>
                </div>
                <Serif as="h3" size="h3" tone="dark" style={{ fontSize: "clamp(20px, 2.6vw, 27px)" }}>
                  Nothing to <Accent tone="dark">connect.</Accent>
                </Serif>
                <p
                  style={{
                    fontFamily: D.sans, fontSize: 14.5, lineHeight: 1.56, color: D.muted,
                    margin: "12px 0 0", maxWidth: "42ch",
                  }}
                >
                  Send a candidate a link. They solve in the agent they already use. You get back a
                  scored session with the full replay.
                </p>
              </div>

              {/* ── the agents they already use (real marks) ── */}
              <div style={{ padding: "22px 26px 24px", borderBottom: `1px solid ${D.line}` }}>
                <span
                  style={{
                    display: "block", fontFamily: D.mono, fontSize: 10.5, color: D.faint,
                    letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 14,
                  }}
                >
                  the tools they already know
                </span>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {AGENTS_USED.map((a) => (
                    <span
                      key={a.name}
                      className="k-hir-agent"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 11,
                        padding: "10px 15px 10px 12px",
                        border: `1px solid ${D.line}`, background: D.bg,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 26, height: 26, flexShrink: 0,
                        }}
                      >
                        <Image src={a.src} alt="" width={20} height={20} style={{ display: "block" }} />
                      </span>
                      <span style={{ fontFamily: D.mono, fontSize: 12.5, color: D.text, letterSpacing: 0.3 }}>
                        {a.name}
                      </span>
                    </span>
                  ))}
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "10px 14px",
                      border: `1px dashed ${D.line}`, background: "transparent",
                      fontFamily: D.mono, fontSize: 12, color: D.faint, letterSpacing: 0.3,
                    }}
                  >
                    or any terminal agent
                  </span>
                </div>
              </div>

              {/* ── the honest three-step flow ── */}
              <div style={{ padding: "24px 26px 26px", position: "relative" }}>
                {/* hairline connector running through the step numerals, drawn on view */}
                <svg
                  ref={lineRef}
                  aria-hidden
                  style={{
                    position: "absolute", left: 43, top: 44, bottom: 44, width: 1,
                    height: "auto", zIndex: 0, overflow: "visible",
                  }}
                  width="1"
                  preserveAspectRatio="none"
                >
                  <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke={D.lineBright} strokeWidth="1" />
                </svg>

                <ul data-stagger style={{ listStyle: "none", margin: 0, padding: 0, position: "relative", zIndex: 1 }}>
                  {FLOW_STEPS.map((s, i) => (
                    <li
                      key={s.n}
                      className="k-item"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "34px 1fr",
                        gap: 16,
                        alignItems: "start",
                        paddingBottom: i < FLOW_STEPS.length - 1 ? 22 : 0,
                      }}
                    >
                      <span className="k-hir-stepnum">{s.n}</span>
                      <div style={{ paddingTop: 2 }}>
                        <div
                          style={{
                            fontFamily: D.sans, fontWeight: 600, fontSize: 15.5,
                            color: D.text, letterSpacing: "-0.005em", marginBottom: 4,
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          style={{
                            fontFamily: D.sans, fontSize: 14, lineHeight: 1.54,
                            color: D.muted, maxWidth: "40ch",
                          }}
                        >
                          {s.body}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Inner>
    </Band>
  );
}
