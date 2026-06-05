"use client";

/* ══════════════════════════════════════════════════════════════════════════
   02 · HOW IT WORKS  ::  "From pick to scored, in five steps."

   Psychology: collapse perceived friction. No sandbox fights you, you work on
   YOUR machine with YOUR agent, and the whole session is scored.

   Layout (Outship-grade editorial, not five identical cards):
     • Top: a numbered VERTICAL RAIL. A hairline connects the step nodes and
       DRAWS on scroll (useDrawOnView). Steps stagger in. Big rust mono numeral,
       mono title, grotesk body, CodeChip + agent tags where present.
     • Below (the step-02 payoff): a LARGE, wide Claude-Code-styled terminal in
       palette T, sitting in a warm paper well. It "types" the kodwai CLI
       invocation, prints a few setup lines, then renders a Claude Code welcome
       box (header glyph + two panels) in the spirit of the real CLI.
   Collapses to a single column under ~860px; the terminal stays full width.

   Imports only from ../system, ../data, next/image, react, animejs.
   Scoped style prefix: k-how-
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import anime from "animejs";
import {
  C, T, TYPE, PAD, SECTION_PAD,
  Inner, Marker, Serif, Accent, CodeChip, useDrawOnView, useMediaMax,
} from "../system";
import { FLOW } from "../data";

/* ── local: the setup transcript we "type" out (mono machine voice) ─────────
   Kept in-file because it is presentation chrome, not canonical page copy.
   Line 0 (the command) types char-by-char, the rest reveal one at a time, and
   the Claude Code welcome box appears last. */
type Line = { p?: string; pColor?: string; text: string; color?: string; type?: boolean };
const TERMINAL_LINES: Line[] = [
  { p: "$", pColor: T.prompt, text: "npx @kodwai/cli challenge rate-limiter", type: true },
  { text: "resolving challenge  rate-limiter  ·  hard", color: T.faint },
  { p: "✓", pColor: T.green, text: "downloaded PROBLEM.md · starter files · tests" },
  { p: "✓", pColor: T.green, text: "git repo initialized · timer started 00:00" },
  { p: "✓", pColor: T.green, text: "launching claude-code in ~/kodwai/rate-limiter" },
];

function reducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── The small pixel-robot mascot, hand-drawn in SVG (Claude coral) ─────────
   A blocky friendly bot, echoing the reference welcome screen. */
function PixelBot({ size = 84 }: { size?: number }) {
  const coral = "#d97757";
  // a 14×11 pixel grid scaled up; body squares + two eye holes (bg color)
  return (
    <svg width={size} height={size * (11 / 14)} viewBox="0 0 14 11" shapeRendering="crispEdges" aria-hidden style={{ display: "block" }}>
      {/* head / body block */}
      <rect x="3" y="2" width="8" height="5" fill={coral} />
      {/* shoulders */}
      <rect x="2" y="3" width="1" height="3" fill={coral} />
      <rect x="11" y="3" width="1" height="3" fill={coral} />
      {/* antenna nubs */}
      <rect x="4" y="1" width="1" height="1" fill={coral} />
      <rect x="9" y="1" width="1" height="1" fill={coral} />
      {/* eyes (cut out to the terminal bg) */}
      <rect x="5" y="3" width="1" height="2" fill={T.bg} />
      <rect x="8" y="3" width="1" height="2" fill={T.bg} />
      {/* legs */}
      <rect x="4" y="7" width="1" height="2" fill={coral} />
      <rect x="6" y="7" width="1" height="2" fill={coral} />
      <rect x="9" y="7" width="1" height="2" fill={coral} />
    </svg>
  );
}

/* ─── A Claude-Code-styled welcome box, in the spirit of the real CLI ───────
   Header glyph + "Claude Code" + dim version, then a two-panel body. */
function ClaudeWelcome() {
  const border = "rgba(217,119,87,0.34)";
  return (
    <div
      className="k-how-welcome"
      style={{
        border: `1px solid ${border}`,
        marginTop: 18,
        background: "rgba(217,119,87,0.035)",
      }}
    >
      {/* header row: logo + name + version */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "11px 16px",
          borderBottom: `1px solid ${border}`,
        }}
      >
        <Image
          src="/landing/logos/claude.svg"
          alt="Claude"
          width={16}
          height={16}
          style={{ width: 16, height: 16, display: "block" }}
        />
        <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: "#d97757", letterSpacing: 0.2 }}>
          Claude Code
        </span>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: T.faint, letterSpacing: 0.4 }}>
          v2.1.113
        </span>
      </div>

      {/* two-panel body */}
      <div className="k-how-welcome-body">
        {/* LEFT: welcome + mascot + model line */}
        <div
          className="k-how-welcome-left"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 14, padding: "22px 20px 24px", textAlign: "center",
          }}
        >
          <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: 0.2 }}>
            Welcome back
          </span>
          <PixelBot size={82} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, color: T.text, letterSpacing: 0.2 }}>
              Opus 4.7 <span style={{ color: T.faint }}>·</span> API usage billing
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 12, color: T.faint, letterSpacing: 0.2 }}>
              ~/kodwai/rate-limiter
            </span>
          </div>
        </div>

        {/* RIGHT: tips + recent activity */}
        <div
          className="k-how-welcome-right"
          style={{
            display: "flex", flexDirection: "column", gap: 16, padding: "22px 22px 24px",
            borderLeft: `1px solid ${border}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, fontWeight: 600, color: "#d97757", letterSpacing: 0.2 }}>
              Tips for getting started
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, lineHeight: 1.6, color: T.text }}>
              Run <span style={{ color: "#d97757" }}>/init</span> to create a CLAUDE.md file with
              instructions for your agent.
            </span>
          </div>

          <div style={{ height: 1, background: border }} aria-hidden />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, fontWeight: 600, color: "#d97757", letterSpacing: 0.2 }}>
              Recent activity
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, color: T.faint, letterSpacing: 0.2 }}>
              No recent activity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Large inline terminal mock: types the CLI, then drops the welcome box ── */
function TerminalMock() {
  const wrapRef = useRef<HTMLDivElement>(null);
  // index of the last fully-revealed line; line 0 (the command) types char-by-char
  const [typed, setTyped] = useState(reducedMotion() ? TERMINAL_LINES[0].text : "");
  const [shown, setShown] = useState(reducedMotion() ? TERMINAL_LINES.length : 1);
  // the Claude Code welcome box appears once the transcript finishes
  const [welcome, setWelcome] = useState(reducedMotion());

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const cmd = TERMINAL_LINES[0].text;

    const run = () => {
      // 1) type the command char by char
      const obj = { i: 0 };
      anime({
        targets: obj, i: cmd.length, duration: 1100, easing: "linear",
        update: () => setTyped(cmd.slice(0, Math.round(obj.i))),
        complete: () => {
          // 2) reveal the response lines one at a time, then the welcome box
          let n = 1;
          const tick = () => {
            n += 1;
            setShown(n);
            if (n < TERMINAL_LINES.length) {
              raf = window.setTimeout(tick, 320) as unknown as number;
            } else {
              raf = window.setTimeout(() => setWelcome(true), 420) as unknown as number;
            }
          };
          raf = window.setTimeout(tick, 380) as unknown as number;
        },
      });
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run();
        io.unobserve(el);
      });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(raf); };
  }, []);

  const dot = (c: string) => (
    <span style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "inline-block" }} />
  );

  return (
    <div ref={wrapRef} className="k-how-term" aria-hidden>
      {/* window chrome */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 17px",
        background: T.header, borderBottom: `1px solid ${T.line}`,
      }}>
        {dot("#ff5f57")}{dot("#febc2e")}{dot("#28c840")}
        <span style={{
          marginLeft: 8, fontFamily: C.mono, fontSize: 11.5, color: T.faint, letterSpacing: 0.4,
        }}>
          ~/kodwai · zsh
        </span>
        <span style={{
          marginLeft: "auto", fontFamily: C.mono, fontSize: 10, color: T.prompt,
          letterSpacing: 1.4, textTransform: "uppercase",
        }}>
          kodwai
        </span>
      </div>

      {/* body */}
      <div
        className="k-how-term-body"
        style={{
          padding: "22px 24px 26px", fontFamily: C.mono, fontSize: 13.5, lineHeight: 1.85,
          color: T.text, background: T.bg, minHeight: 500,
        }}
      >
        {TERMINAL_LINES.map((ln, i) => {
          if (i >= shown) return null;
          const isCmd = i === 0;
          const content = isCmd ? typed : ln.text;
          const done = isCmd ? typed.length >= ln.text.length : true;
          return (
            <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: ln.color ?? T.text }}>
              {ln.p && <span style={{ color: ln.pColor ?? T.prompt, marginRight: 8 }}>{ln.p}</span>}
              <span>{content}</span>
              {isCmd && !done && (
                <span className="k-how-caret" style={{
                  display: "inline-block", width: 7, height: 15, background: T.prompt,
                  marginLeft: 2, transform: "translateY(2px)",
                }} />
              )}
            </div>
          );
        })}

        {welcome && <ClaudeWelcome />}
      </div>
    </div>
  );
}

/* ─── A small score-chip teaser shown alongside the terminal (the payoff) ─── */
function ScoreTeaser() {
  return (
    <div className="k-how-teaser" style={{
      display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
      border: `1px solid ${C.line}`, background: C.panel,
    }}>
      <span style={{ fontFamily: C.mono, fontSize: 26, fontWeight: 700, color: C.green, lineHeight: 1 }}>94</span>
      <span style={{ width: 1, height: 26, background: C.line }} aria-hidden />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 1.2, textTransform: "uppercase" }}>
          and you are scored
        </span>
        <span style={{ fontFamily: C.mono, fontSize: 11.5, color: C.muted, letterSpacing: 0.2 }}>
          direction <b style={{ color: C.text }}>48</b> · outcome <b style={{ color: C.text }}>33</b> · lift <b style={{ color: C.text }}>13</b>
        </span>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  // Collapse to a single column under ~960px (steps first, then terminal).
  const isStacked = useMediaMax(960);
  // SVG rail that draws on view (vertical connector through the step nodes)
  const railRef = useDrawOnView<SVGSVGElement>({ duration: 1400, delay: 0 });

  const N = FLOW.length;

  return (
    <section
      id="how"
      style={{
        background: C.bg,
        position: "relative",
        padding: `${SECTION_PAD} ${PAD}`,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <Inner>
        <Marker index="02" label="how it works" />

        {/* headline + subhead, Outship two-column framing */}
        <div
          className="k-reveal k-how-head"
          style={{
            display: "grid",
            gridTemplateColumns: isStacked ? "1fr" : "1.5fr 1fr",
            gap: isStacked ? 18 : 56,
            alignItems: "end",
            marginBottom: "clamp(44px, 6vw, 72px)",
          }}
        >
          <Serif as="h2" size="h2">
            From pick to <Accent>scored,</Accent> in five steps.
          </Serif>
          <p style={{ ...TYPE.body, color: C.muted, margin: 0, maxWidth: "44ch" }}>
            No sandbox, nothing to install that fights you. You work on your own
            machine with your own agent, and Kodwai scores the whole session.
          </p>
        </div>

        {/* ── BALANCED TWO-COLUMN BODY ───────────────────────────────────────
            LEFT: the five-step rail (~520px). RIGHT: the large Claude Code
            terminal, sticky, with the score payoff card directly beneath it.
            Collapses to one column (steps then terminal) under 960px. */}
        <div
          className="k-how-grid"
          style={{
            display: "grid",
            gridTemplateColumns: isStacked ? "1fr" : "minmax(0, 520px) minmax(0, 1fr)",
            gap: isStacked ? "clamp(48px, 6vw, 64px)" : "clamp(40px, 4.4vw, 72px)",
            alignItems: "start",
          }}
        >
          {/* ── LEFT: numbered step rail ────────────────────────────────── */}
          <div style={{ position: "relative", maxWidth: isStacked ? "none" : 520 }}>
            {/* the drawing rail sits absolutely behind the number nodes */}
            <svg
              ref={railRef}
              viewBox={`0 0 24 ${RAIL_VB_H}`}
              preserveAspectRatio="none"
              aria-hidden
              style={{
                position: "absolute",
                left: RAIL_X - 1,
                top: 8,
                width: 24,
                height: "calc(100% - 16px)",
                overflow: "visible",
                pointerEvents: "none",
              }}
            >
              <line
                x1="12" y1="20" x2="12" y2={RAIL_VB_H - 20}
                stroke={C.lineBright} strokeWidth="2" strokeLinecap="round"
              />
            </svg>

            <ol
              data-stagger
              style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "clamp(26px, 3vw, 38px)" }}
            >
              {FLOW.map((s, i) => {
                const isCli = !!s.chip;
                return (
                  <li
                    key={s.n}
                    className="k-item k-how-step"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `${RAIL_COL}px 1fr`,
                      gap: "clamp(16px, 1.6vw, 22px)",
                      alignItems: "start",
                    }}
                  >
                    {/* number node — baseline-aligned with the title */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                      <span
                        style={{
                          fontFamily: C.mono,
                          fontWeight: 700,
                          fontSize: "clamp(26px, 2.8vw, 34px)",
                          color: C.accent,
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                          background: C.bg,
                          position: "relative",
                          zIndex: 1,
                          // pad top/bottom so the rail line is masked at each node
                          padding: "1px 0 7px",
                          // nudge so the numeral cap-height meets the title baseline
                          transform: "translateY(-1px)",
                        }}
                      >
                        {s.n}
                      </span>
                      {/* node dot, sits on the rail just under the numeral */}
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: "50%",
                          marginLeft: -3.5,
                          bottom: -7,
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: C.accent,
                          zIndex: 1,
                          display: i < N - 1 ? "block" : "none",
                        }}
                      />
                    </div>

                    {/* content */}
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          ...TYPE.monoTitle,
                          color: C.text,
                          margin: "0 0 8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        {s.title}
                        {isCli && (
                          <span style={{
                            fontFamily: C.mono, fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2,
                            textTransform: "uppercase", color: C.accent, border: `1px solid ${C.accentSoft}`,
                            background: C.accentSoft, padding: "2px 7px",
                          }}>
                            cli
                          </span>
                        )}
                      </h3>
                      <p style={{ ...TYPE.body, fontSize: "clamp(14.5px, 1.6vw, 16px)", color: C.muted, margin: 0, maxWidth: "46ch" }}>
                        {s.body}
                      </p>

                      {(s.chip || s.tags) && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                          {s.chip && <CodeChip>{s.chip}</CodeChip>}
                          {s.tags && s.tags.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontFamily: C.mono, fontSize: 11, color: C.muted,
                                border: `1px solid ${C.line}`, background: C.panel,
                                padding: "6px 11px", letterSpacing: 0.4, whiteSpace: "nowrap",
                                display: "inline-flex", alignItems: "center", gap: 7,
                              }}
                            >
                              {(t === "Claude Code" || t === "Cursor") && (
                                <Image
                                  src={t === "Claude Code" ? "/landing/logos/claude.svg" : "/landing/logos/cursor.svg"}
                                  alt=""
                                  width={13}
                                  height={13}
                                  style={{ width: 13, height: 13 }}
                                />
                              )}
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ── RIGHT: the LARGE Claude Code terminal, sticky, + score card ── */}
          <div
            className="k-how-stick"
            style={{
              position: isStacked ? "static" : "sticky",
              top: isStacked ? undefined : 96,
              alignSelf: "start",
            }}
          >
            <div
              className="k-reveal k-how-well"
              style={{
                position: "relative",
                padding: "clamp(20px, 2.6vw, 32px)",
                border: `1px solid ${C.line}`,
                backgroundColor: C.paper2,
                backgroundImage: "url(/landing/how/paper-well.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 0.4 }}>{"//"}</span>
                <span style={{
                  fontFamily: C.mono, fontSize: 10.5, color: C.muted, letterSpacing: 1.6, textTransform: "uppercase",
                }}>
                  step 02 · run the cli
                </span>
              </div>

              {/* terminal frame with a soft warm lift */}
              <div style={{
                border: `1px solid ${T.line}`,
                boxShadow: "0 40px 80px -38px rgba(40,22,10,0.6), 0 2px 12px -6px rgba(40,22,10,0.28)",
                overflow: "hidden",
              }}>
                <TerminalMock />
              </div>
            </div>

            {/* the "94 / and you are scored" payoff, directly under the terminal */}
            <div
              className="k-reveal"
              style={{
                marginTop: "clamp(14px, 1.4vw, 18px)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <p style={{
                fontFamily: C.sans, fontSize: "clamp(14.5px, 1.5vw, 16px)", lineHeight: 1.6, color: C.muted,
                margin: 0, maxWidth: "62ch",
              }}>
                One command pulls the problem, sets your agent, inits git, and
                starts the clock. Your agent opens right where you left off. Then
                you build it your way.
              </p>
              <ScoreTeaser />
            </div>
          </div>
        </div>
      </Inner>

      {/* scoped styles: caret blink + responsive welcome panels + reduced-motion */}
      <style>{`
        .k-how-welcome-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
        }
        @media (max-width: 620px) {
          .k-how-welcome-body { grid-template-columns: 1fr; }
          .k-how-welcome-right { border-left: none !important; border-top: 1px solid rgba(217,119,87,0.34); }
        }
        .k-how-caret {
          animation: k-how-blink 1s steps(1) infinite;
        }
        @keyframes k-how-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .k-how-caret { display: none !important; }
        }
        @media (max-width: 960px) {
          .k-how-stick { position: static !important; }
        }
        @media (max-width: 600px) {
          .k-how-well { padding: 12px !important; margin-left: -10px; margin-right: -10px; }
        }
      `}</style>
    </section>
  );
}

/* rail geometry: number column width, rail x-offset, and SVG viewBox height */
const RAIL_COL = 46;
const RAIL_X = RAIL_COL / 2;
const RAIL_VB_H = 1000;
