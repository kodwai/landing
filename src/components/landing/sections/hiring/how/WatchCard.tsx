"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HowCandidatesWork · 01 · WatchCard  (area="watch")
   ─────────────────────────────────────────────────────────────────────────
   The hero tile of the bento (2x2). A compact LIVE OBSERVATION panel that
   previews the real live dashboard: a header (rust live dot + label, the
   session name, an elapsed timer + running API cost), a multi-line mono
   transcript of a believable rate-limiter session (prompts / agent actions /
   tool runs / pass + fail results / a commit), and a thin footer of mini
   signals (tools / tests / diff). A small teaser, not the full hero mock.

   Chrome (k-hcw-cell / -frag / -meta / -titlerow / -idx / -title / -body)
   comes from the shell; this file owns its inline-styled fragment + copy.
   Honest: Claude Code only. Imports three levels up. Card-unique prefix wcd-.
   ══════════════════════════════════════════════════════════════════════════ */

import type { CSSProperties } from "react";
import { C, T } from "../../../system";

/* the believable session, as a chronological mono transcript */
type Line =
  | { kind: "user"; text: string }
  | { kind: "agent"; text: string }
  | { kind: "tool"; text: string }
  | { kind: "pass"; text: string }
  | { kind: "fail"; text: string }
  | { kind: "commit"; text: string };

const LINES: Line[] = [
  { kind: "user", text: "per-key sliding window, monotonic clock, no leak" },
  { kind: "agent", text: "scaffolds limiter.py, adds RateLimiter + store" },
  { kind: "tool", text: "$ pytest -q" },
  { kind: "fail", text: "✗ 1 failed  ·  burst window races" },
  { kind: "agent", text: "adds per-key lock, scopes critical section" },
  { kind: "tool", text: "$ pytest -k concurrency" },
  { kind: "pass", text: "✓ 4 passed" },
  { kind: "commit", text: "+ commit: handle burst window + per-key lock" },
  { kind: "user", text: "now evict idle keys so memory stays flat" },
  { kind: "agent", text: "adds a sweep on the monotonic clock tick" },
  { kind: "tool", text: "$ pytest -q tests/test_eviction.py" },
  { kind: "pass", text: "✓ 6 passed" },
  { kind: "user", text: "what is the p99 under one hot key?" },
  { kind: "agent", text: "benchmarks it, 9.4k req/s, p99 0.21ms" },
  { kind: "tool", text: "$ ruff check limiter.py" },
  { kind: "pass", text: "✓ all checks passed" },
  { kind: "agent", text: "writes the PR body with the trade-offs" },
  { kind: "commit", text: "+ commit: evict idle keys, add benchmark" },
];

/* per-kind tag + colors, matching the terminal voice used on the big mock */
function meta(l: Line): { tag: string; tagColor: string; textColor: string } {
  switch (l.kind) {
    case "user": return { tag: "you ›", tagColor: T.prompt, textColor: T.text };
    case "agent": return { tag: "claude ·", tagColor: T.green, textColor: T.text };
    case "tool": return { tag: "", tagColor: T.faint, textColor: T.faint };
    case "pass": return { tag: "", tagColor: T.green, textColor: T.green };
    case "fail": return { tag: "", tagColor: T.amber, textColor: T.amber };
    case "commit": return { tag: "", tagColor: T.green, textColor: T.green };
  }
}

/* thin footer signal strip */
const SIGNALS: { label: string; value: string; tone?: "green" }[] = [
  { label: "tools", value: "7" },
  { label: "tests", value: "4/5", tone: "green" },
  { label: "diff", value: "+38 -6" },
];

export default function WatchCard({ area }: { area: string }) {
  const k = "wcd-";

  const ellipsis: CSSProperties = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  };

  return (
    <article className="k-item k-hcw-cell k-hcw-watch" style={{ gridArea: area }}>
      <style>{`
        @keyframes ${k}beat { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
        .${k}dot { animation: ${k}beat 2.4s cubic-bezier(0.16,1,0.3,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .${k}dot { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="k-hcw-frag">
        {/* the live observation panel: a dark terminal well inside the cream cell */}
        <div
          style={{
            border: `1px solid ${T.line}`,
            background: T.bg,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            minHeight: 0,
            boxShadow: "0 24px 50px -34px rgba(40,22,10,0.5)",
          }}
        >
          {/* ── header: live dot + label · session name · timer + cost ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "9px 13px",
              background: T.header,
              borderBottom: `1px solid ${T.line}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span
                  className={`${k}dot`}
                  aria-hidden
                  style={{ width: 6, height: 6, borderRadius: "50%", background: T.prompt }}
                />
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 9.5,
                    color: T.prompt,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                  }}
                >
                  live
                </span>
              </span>
              <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 0.2, ...ellipsis }}>
                <span style={{ color: T.green }}>claude code</span>
                <span style={{ color: T.faint }}> · interview</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: T.text, letterSpacing: 0.3 }}>18:24</span>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: T.amber, letterSpacing: 0.3 }}>$0.42</span>
            </div>
          </div>

          {/* ── transcript: the multi-line live session (grows to fill, clips excess) ── */}
          <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
            {LINES.map((l, i) => {
              const { tag, tagColor, textColor } = meta(l);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    padding: "4.5px 0",
                    fontFamily: C.mono,
                    fontSize: 11.5,
                    lineHeight: 1.4,
                    minWidth: 0,
                  }}
                >
                  {tag && (
                    <span
                      style={{
                        color: tagColor,
                        fontWeight: l.kind === "user" ? 600 : 400,
                        flexShrink: 0,
                      }}
                    >
                      {tag}
                    </span>
                  )}
                  <span style={{ color: textColor, ...ellipsis }}>{l.text}</span>
                </div>
              );
            })}

            {/* the agent is still going: a working line under the last commit */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0 1px",
                fontFamily: C.mono,
                fontSize: 11.5,
              }}
            >
              <span style={{ color: T.prompt, fontWeight: 600 }}>you ›</span>
              <span
                className={`${k}dot`}
                aria-hidden
                style={{ width: 6, height: 13, background: T.prompt, transform: "translateY(2px)" }}
              />
            </div>
          </div>

          {/* ── footer: mini signal strip ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              borderTop: `1px solid ${T.line}`,
              background: T.header,
            }}
          >
            {SIGNALS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 7,
                  padding: "8px 13px",
                  borderLeft: i > 0 ? `1px solid ${T.line}` : "none",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 9,
                    color: T.faint,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 11.5,
                    letterSpacing: 0.2,
                    color: s.tone === "green" ? T.green : T.text,
                    ...ellipsis,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="k-hcw-meta">
        <div className="k-hcw-titlerow">
          <span className="k-hcw-idx" aria-hidden>01</span>
          <h3 className="k-hcw-title">Watch the session live</h3>
        </div>
        <p className="k-hcw-body">
          You follow the whole session as it happens, every prompt, every tool
          call, every test run, every commit, with elapsed time and running API
          cost. It is a live dashboard, not a recording you wait for at the end.
        </p>
      </div>
    </article>
  );
}
