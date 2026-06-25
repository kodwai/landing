"use client";

/* ══════════════════════════════════════════════════════════════════════════
   NothingToConnect : // 06 · the honest "no integration" band
   ─────────────────────────────────────────────────────────────────────────
   Replaces the old HiringIntegrations band. Full-bleed warm-dark band (palette
   D) with the same faint earthy backdrop technique. The hiring product has NO
   ATS / Slack / GitHub-issue integrations, and we do not invent one. We tell
   the truth that is the stronger pitch: there is nothing to connect.

   LEFT  : the narrative. Serif h2 + one rust accent, a lede, and a short honest
           list of truths (staggered).
   RIGHT : a dark panel. A "no integration required" mono tag, a small serif
           line, the agents a candidate already uses (real, transparent marks:
           claude.svg + cursor-light.svg via HIRING_AGENTS.srcLight) plus a
           dashed "or any terminal agent" chip, then the honest three-step flow
           (Send the invite / They solve locally / You review the replay) as a
           vertical list with mono step numerals and a hairline connector.

   Motion: the truth list and flow steps stagger in via the global choreography;
   the connector draws on view (left fully drawn under reduced-motion). Content
   renders with no JS; motion is progressive enhancement only.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  Band, Inner, Marker, Serif, Accent, LightButton,
  D, CSS_EASE, EASE,
} from "../../system";
import { HIRING_AGENTS } from "../../data";
import anime from "animejs";

/* The honest truths of the loop. No ATS, no stack, no candidate accounts. */
const TRUTHS = [
  "One link out, one scored session back.",
  "They work in Claude Code, nothing new to learn.",
  "Invite your team as admin, interviewer, or viewer.",
  "Share any session with a link.",
] as const;

/* The honest three-step flow. No integration step exists, so none is invented:
   a link goes out, the candidate solves on their own machine, a scored replay
   comes back. */
const FLOW_STEPS = [
  {
    n: "01",
    label: "Send the invite",
    body: "One link, scoped to the challenge and time limit you set. No account to provision, no stack to wire up.",
  },
  {
    n: "02",
    label: "They solve locally",
    body: "The candidate works on their own machine in Claude Code, the agent they already know. Same CLI as the developer track.",
  },
  {
    n: "03",
    label: "You review the replay",
    body: "A scored session lands back: the prompts, commits, test runs, and transcript next to the score. Share one link with your team.",
  },
] as const;

export default function NothingToConnect() {
  // The step connector is the only bespoke motion. It draws on view and is left
  // fully drawn under reduced-motion.
  const lineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el || typeof window === "undefined") return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const segs = Array.from(el.querySelectorAll<SVGLineElement>("line"));
    if (!segs.length) return;
    if (isReduced) return; // leave the connector fully drawn
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
    <Band tone="dark" id="connect">
      {/* scoped responsive rules + hover transitions for THIS section only */}
      <style>{`
        .k-ntc-grid {
          display: grid;
          grid-template-columns: 1fr minmax(380px, 0.92fr);
          gap: clamp(40px, 6vw, 80px);
          align-items: start;
        }
        @media (max-width: 980px) {
          .k-ntc-grid { grid-template-columns: 1fr; gap: 56px; }
        }
        .k-ntc-agent { transition: border-color .3s ${CSS_EASE}, transform .3s ${CSS_EASE}, background .3s ${CSS_EASE}; }
        .k-ntc-agent:hover { border-color: ${D.accent}; transform: translateY(-2px); background: ${D.elevated}; }
        .k-ntc-stepnum {
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
        <Marker index="06" label="nothing to connect" tone="dark" />

        <div className="k-ntc-grid">
          {/* ════════ LEFT: the narrative ════════ */}
          <div>
            <Serif as="h2" size="h2" tone="dark" className="k-reveal" style={{ maxWidth: "13ch" }}>
              <Accent tone="dark">Nothing</Accent> to connect.
            </Serif>

            <p
              className="k-reveal"
              style={{
                fontFamily: D.sans, fontSize: "clamp(15.5px, 1.9vw, 18.5px)",
                lineHeight: 1.62, color: D.muted, margin: "24px 0 0", maxWidth: "46ch",
              }}
            >
              No ATS to wire up, no stack to sync, no candidate accounts to provision. You send a
              link, they solve where they already work, and a scored session comes back.
            </p>

            {/* the honest truths, staggered */}
            <ul
              data-stagger
              style={{
                listStyle: "none", margin: "36px 0 0", padding: 0,
                display: "grid", gap: 0,
                borderTop: `1px solid ${D.line}`,
              }}
            >
              {TRUTHS.map((t) => (
                <li
                  key={t}
                  className="k-item"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 14,
                    alignItems: "baseline",
                    padding: "15px 0",
                    borderBottom: `1px solid ${D.line}`,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      fontFamily: D.mono, fontSize: 14, color: D.accent,
                      lineHeight: 1.4,
                    }}
                  >
                    →
                  </span>
                  <span
                    style={{
                      fontFamily: D.sans, fontWeight: 500, fontSize: "clamp(15px, 1.7vw, 17px)",
                      color: D.text, letterSpacing: "-0.005em", lineHeight: 1.5,
                    }}
                  >
                    {t}
                  </span>
                </li>
              ))}
            </ul>

            <div className="k-reveal" style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
              <LightButton
                label="Set up interviews"
                tone="dark"
                event="cta_clicked"
                eventProps={{ surface: "nothing_to_connect", track: "hiring" }}
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
              {/* ── panel header: the honest one-liner ── */}
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
                  Send a link. <Accent tone="dark">That is the integration.</Accent>
                </Serif>
              </div>

              {/* ── the agents they already use (real marks) ── */}
              <div style={{ padding: "22px 26px 24px", borderBottom: `1px solid ${D.line}` }}>
                <span
                  style={{
                    display: "block", fontFamily: D.mono, fontSize: 10.5, color: D.faint,
                    letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 14,
                  }}
                >
                  the tool they already know
                </span>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {HIRING_AGENTS.map((a) => (
                    <span
                      key={a.name}
                      className="k-ntc-agent"
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
                        <Image src={a.srcLight} alt="" width={20} height={20} style={{ display: "block" }} />
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
                    the same CLI as the developer track
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
                      <span className="k-ntc-stepnum">{s.n}</span>
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
