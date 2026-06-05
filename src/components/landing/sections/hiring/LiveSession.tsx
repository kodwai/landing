"use client";

/* ══════════════════════════════════════════════════════════════════════════
   LiveSession :: // 03  "The whole session, not the diff."  (hiring)
   ─────────────────────────────────────────────────────────────────────────
   Full-bleed warm-dark band (palette D + T terminal chrome), over the same
   faint earthy-band.jpg backdrop HiringIntegrations / VibeShowcase use. The
   one big showpiece for the hiring track: a take-home hands you the final
   files, kodwai hands you everything that led there.

   The visual is a large SESSION REPLAY panel split in two:
     • LEFT (wider)  : the CHRONOLOGICAL TRANSCRIPT. A Claude-Code-style session
       header, then a stack of timestamped event rows on a believable
       rate-limiter session, prompts / agent actions / tool runs / test results
       / a commit. This is an event/transcript view, NOT video, NOT a scrubber.
     • RIGHT (rail)  : live SIGNALS (time, cost, tools, tests) as mono rows, then
       async TEAM COMMENT bubbles, so the team can review any moment together.

   Honesty: chronological transcript + async comments only. No timeline
   scrubber, no "scrub to", no video. "Follow it live, or open it after."

   Motion: the global choreography owns the header/lede (k-reveal) and the
   transcript rows (data-stagger + k-item). The only bespoke motion is a tiny
   blinking caret and a single live pulse dot, both gated behind reduced-motion.
   Content renders fully with no JS.

   Imports only from ../../system (double dot-dot: one folder deeper). Scoped
   class prefix: k-lsess-
   ══════════════════════════════════════════════════════════════════════════ */

import {
  D, T, TYPE, Band, Inner, Marker, Serif, Accent, CSS_EASE,
} from "../../system";

/* ── The believable rate-limiter session, as a chronological event log ──────
   Kept in-file: this is presentation chrome (a mock replay), not canonical
   page copy. Each row carries a mono timestamp and one typed line. Kinds map
   to the mono voice: user prompts (rust), agent actions (green), tool runs
   (dim "$ ..."), test results (green pass / amber fail), a commit row. */
type Row =
  | { t: string; kind: "user"; text: string }
  | { t: string; kind: "agent"; text: string }
  | { t: string; kind: "tool"; text: string }
  | { t: string; kind: "test"; text: string; tone: "pass" | "fail" }
  | { t: string; kind: "commit"; text: string };

const SESSION: Row[] = [
  { t: "00:00", kind: "user", text: "spec first: per-key sliding window, monotonic clock, no leak" },
  { t: "00:31", kind: "agent", text: "scaffolds limiter.py, adds RateLimiter + window store" },
  { t: "02:48", kind: "tool", text: "$ pytest -q" },
  { t: "02:55", kind: "test", text: "9 passed, 1 failed", tone: "fail" },
  { t: "03:20", kind: "user", text: "the burst test races. write the failing test, then fix it" },
  { t: "05:02", kind: "agent", text: "adds per-key lock, scopes the critical section" },
  { t: "07:41", kind: "tool", text: "$ pytest -k concurrency" },
  { t: "07:49", kind: "test", text: "4 passed", tone: "pass" },
  { t: "09:18", kind: "agent", text: "edits limiter.py: evict stale keys on read" },
  { t: "11:36", kind: "commit", text: "commit: handle burst window + per-key lock" },
];

/* live signals shown on the right rail (label + value, mono machine voice) */
const SIGNALS: { label: string; value: string; tone?: "green" | "amber" }[] = [
  { label: "time", value: "18:24" },
  { label: "cost", value: "$0.42" },
  { label: "tools", value: "7" },
  { label: "tests", value: "4 / 5", tone: "green" },
];

/* async team review: a couple of reviewers commenting on the session */
const COMMENTS: { initial: string; name: string; color: string; text: string }[] = [
  { initial: "M", name: "Maya", color: D.accent, text: "Nice, wrote the failing test first before touching the lock." },
  { initial: "R", name: "Raf", color: D.green, text: "Caught the race in one steer. Strong recovery." },
];

/* per-row glyph + color in the transcript (mono voice, no deps) */
function rowMeta(r: Row): { tag: string; tagColor: string; textColor: string } {
  switch (r.kind) {
    case "user": return { tag: "you ›", tagColor: T.prompt, textColor: T.text };
    case "agent": return { tag: "claude", tagColor: T.green, textColor: T.text };
    case "tool": return { tag: "", tagColor: T.faint, textColor: T.faint };
    case "test": return { tag: r.tone === "pass" ? "✓" : "!", tagColor: r.tone === "pass" ? T.green : T.amber, textColor: r.tone === "pass" ? T.green : T.amber };
    case "commit": return { tag: "◇", tagColor: D.muted, textColor: T.text };
  }
}

export default function LiveSession() {
  const k = "k-lsess-";

  return (
    <Band tone="dark" id="session" style={{ overflow: "hidden", position: "relative" }}>
      {/* scoped responsive + bespoke motion (gated under reduced-motion) */}
      <style>{`
        .${k}head {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: clamp(28px, 4vw, 64px);
          align-items: end;
          margin-bottom: clamp(36px, 5vw, 60px);
        }
        @media (max-width: 880px) { .${k}head { grid-template-columns: 1fr; gap: 22px; align-items: start; } }

        .${k}grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
          align-items: stretch;
        }
        @media (max-width: 880px) { .${k}grid { grid-template-columns: 1fr; } }

        /* the rail sits to the right on desktop, drops below on narrow */
        .${k}rail { border-left: 1px solid ${D.line}; }
        @media (max-width: 880px) { .${k}rail { border-left: none; border-top: 1px solid ${D.line}; } }

        .${k}row { transition: background .3s ${CSS_EASE}; }
        @media (hover: hover) { .${k}row:hover { background: rgba(255,255,255,0.02); } }

        @keyframes ${k}blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
        .${k}caret { animation: ${k}blink 1s steps(1) infinite; }
        @keyframes ${k}beat { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
        .${k}beat { animation: ${k}beat 2.4s ${CSS_EASE} infinite; }

        @media (max-width: 560px) {
          .${k}transcript { padding: 16px 14px !important; }
          .${k}rail { padding: 18px 14px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .${k}caret { animation: none; opacity: 1; }
          .${k}beat { animation: none; opacity: 1; }
          .${k}row { transition: none; }
        }
      `}</style>

      {/* ── warm earthy backdrop, kept faint so D.text stays AA-legible ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(180deg, rgba(14,13,12,0.88) 0%, rgba(14,13,12,0.64) 42%, rgba(14,13,12,0.92) 100%), url(/landing/tex/earthy-band.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        }}
      />

      <Inner style={{ position: "relative", zIndex: 1 }}>
        <Marker index="03" label="the whole session" tone="dark" />

        {/* ── header: serif headline + lede (two-column, collapses) ── */}
        <div className={`${k}head k-reveal`}>
          <Serif as="h2" size="h2" tone="dark" style={{ maxWidth: "15ch" }}>
            The <Accent tone="dark">whole</Accent> session, not the diff.
          </Serif>
          <p style={{ ...TYPE.body, color: D.muted, margin: 0, maxWidth: "50ch" }}>
            A take-home shows you the final files. kodwai shows you everything
            that led there: every prompt, every commit, every test run, every
            tool call, in the order it happened. Follow it live, or open it after.
          </p>
        </div>

        {/* ── the SESSION REPLAY panel ── */}
        <div
          className="k-reveal"
          style={{
            border: `1px solid ${D.lineBright}`,
            background: D.panel,
            boxShadow: "0 44px 90px -44px rgba(0,0,0,0.85)",
          }}
        >
          {/* Claude-Code session header (dots + title + live REC / elapsed) */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12, padding: "13px 18px", borderBottom: `1px solid ${D.line}`,
              background: T.header,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <span style={{ display: "inline-flex", gap: 6 }} aria-hidden>
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                ))}
              </span>
              <span
                style={{
                  fontFamily: D.mono,
                  fontSize: 11.5, color: T.text, letterSpacing: 0.3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: T.prompt }}>claude-code</span>
                <span style={{ color: T.faint }}> · rate-limiter</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <span className={`${k}beat`} aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: T.prompt }} />
                <span style={{ fontFamily: D.mono, fontSize: 10, color: T.prompt, letterSpacing: 1.6, textTransform: "uppercase" }}>
                  rec
                </span>
              </span>
              <span style={{ fontFamily: D.mono, fontSize: 11, color: T.faint, letterSpacing: 0.5 }}>
                18:24
              </span>
            </div>
          </div>

          {/* the two-column body: transcript | signals + review */}
          <div className={`${k}grid`}>
            {/* ════════ LEFT: the chronological transcript ════════ */}
            <div
              className={`${k}transcript`}
              style={{
                padding: "18px 22px 22px", background: T.bg,
                display: "flex", flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontFamily: D.mono, fontSize: 10, color: T.faint,
                  letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 14,
                }}
              >
                session transcript · in order
              </span>

              <div
                data-stagger
                style={{ display: "flex", flexDirection: "column", gap: 0 }}
              >
                {SESSION.map((r, i) => {
                  const { tag, tagColor, textColor } = rowMeta(r);
                  return (
                    <div
                      key={i}
                      className={`${k}row k-item`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "46px 1fr",
                        gap: 12,
                        alignItems: "baseline",
                        padding: "7px 0",
                        borderBottom: i < SESSION.length - 1 ? `1px solid ${T.line}` : "none",
                        minWidth: 0,
                      }}
                    >
                      {/* timestamp */}
                      <span
                        style={{
                          fontFamily: D.mono, fontSize: 11, color: T.faint,
                          letterSpacing: 0.3, whiteSpace: "nowrap",
                        }}
                      >
                        {r.t}
                      </span>
                      {/* the line */}
                      <span
                        style={{
                          fontFamily: D.mono, fontSize: 12.5, lineHeight: 1.45,
                          color: textColor, minWidth: 0, wordBreak: "break-word",
                        }}
                      >
                        {tag && (
                          <span
                            style={{
                              color: tagColor,
                              marginRight: 9,
                              fontWeight: r.kind === "user" ? 600 : 400,
                            }}
                          >
                            {tag}
                          </span>
                        )}
                        {r.text}
                      </span>
                    </div>
                  );
                })}

                {/* live caret line: the agent is still working */}
                <div
                  className="k-item"
                  style={{
                    display: "grid", gridTemplateColumns: "46px 1fr", gap: 12,
                    alignItems: "baseline", padding: "9px 0 2px",
                  }}
                >
                  <span style={{ fontFamily: D.mono, fontSize: 11, color: T.faint, letterSpacing: 0.3 }}>
                    18:24
                  </span>
                  <span style={{ fontFamily: D.mono, fontSize: 12.5, color: T.faint }}>
                    <span style={{ color: T.prompt, marginRight: 9, fontWeight: 600 }}>you ›</span>
                    <span
                      className={`${k}caret`}
                      aria-hidden
                      style={{
                        display: "inline-block", width: 7, height: 14, background: T.prompt,
                        transform: "translateY(2px)",
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* ════════ RIGHT: signals + async team review ════════ */}
            <div
              className={`${k}rail`}
              style={{
                padding: "20px 22px 22px", background: D.bg2,
                display: "flex", flexDirection: "column", gap: 22,
              }}
            >
              {/* live signals */}
              <div>
                <span
                  style={{
                    display: "block", fontFamily: D.mono, fontSize: 10, color: D.faint,
                    letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 13,
                  }}
                >
                  signals
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {SIGNALS.map((s, i) => (
                    <div
                      key={s.label}
                      style={{
                        display: "flex", alignItems: "baseline", justifyContent: "space-between",
                        gap: 12, padding: "9px 0",
                        borderBottom: i < SIGNALS.length - 1 ? `1px solid ${D.line}` : "none",
                      }}
                    >
                      <span style={{ fontFamily: D.mono, fontSize: 11, color: D.faint, letterSpacing: 1, textTransform: "uppercase" }}>
                        {s.label}
                      </span>
                      <span
                        style={{
                          fontFamily: D.mono, fontSize: 14, letterSpacing: 0.3,
                          color: s.tone === "green" ? D.green : s.tone === "amber" ? D.amber : D.text,
                        }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* async team review */}
              <div style={{ borderTop: `1px solid ${D.line}`, paddingTop: 18 }}>
                <span
                  style={{
                    display: "block", fontFamily: D.mono, fontSize: 10, color: D.faint,
                    letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 14,
                  }}
                >
                  team review
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {COMMENTS.map((c) => (
                    <div key={c.name} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 11, alignItems: "start" }}>
                      {/* avatar circle with initial */}
                      <span
                        aria-hidden
                        style={{
                          width: 28, height: 28, flexShrink: 0, borderRadius: "50%",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          border: `1px solid ${c.color}`, background: D.panel,
                          fontFamily: D.mono, fontSize: 12, fontWeight: 600, color: c.color,
                        }}
                      >
                        {c.initial}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: D.mono, fontSize: 11, color: D.muted, letterSpacing: 0.4, marginBottom: 4 }}>
                          {c.name}
                        </span>
                        <span style={{ fontFamily: D.sans, fontSize: 13.5, lineHeight: 1.5, color: D.text }}>
                          {c.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <span
                  style={{
                    display: "block", fontFamily: D.mono, fontSize: 11, color: D.faint,
                    letterSpacing: 0.3, marginTop: 16, lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: D.accent, marginRight: 7 }}>{"//"}</span>
                  reviewers can comment on any moment
                </span>
              </div>
            </div>
          </div>
        </div>
      </Inner>
    </Band>
  );
}
