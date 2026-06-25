"use client";

/* ══════════════════════════════════════════════════════════════════════════
   /hiring HERO :: the establishing shot.

   A centered cream title block (Eyebrow + Fraunces display headline with one
   rust accent + grotesk subhead + CTA row), then a wide, hand-built LIVE
   INTERVIEW SESSION panel. The panel is dominated by a TALL Claude-Code-styled
   terminal that types the interview start command char-by-char, prints the
   setup lines one at a time, drops the Claude Code WELCOME box (header glyph +
   a two-panel body, the right panel made interview-specific), then runs a LONG,
   flowing rate-limiter interview session (rust "you ›" prompts, green
   "claude ·" actions, dim "$ ..." tool runs, pass/fail results, file-change
   notes, a failing-test recovery, commits) that keeps appending and subtly
   LOOPS so the terminal always feels alive. The body is height-capped and
   scrolls internally, auto-scrolling to the newest line. A slim candidate top
   bar sits above it (live pulse + Jamie Brooks + Senior Backend + active pill
   + time/cost/tokens meters) and a compact signals strip sits below it. Static
   product chrome, NO HeroVideo (that is the developer landing). The page shell
   drives k-hero-el (first-paint load stagger); the terminal typing is gated on
   reduced-motion and renders its FULL final state (everything visible, body
   scrolled to the bottom) with no JS.

   CLAUDE CODE ONLY. Imports only from ../../system. Scoped prefix: k-hhero-
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import anime from "animejs";
import {
  C, T, PAD,
  Eyebrow, Accent, PrimaryButton, GhostLink,
} from "../../system";

/* ── the setup transcript we "type" out (mono machine voice, presentation
   chrome). Line 0 (the command) types char-by-char, the rest reveal one at a
   time, then the Claude Code welcome box appears, then the long live session
   streams in line by line. ───────────────────────────────────────────────── */
type Line = { p?: string; pColor?: string; text: string; color?: string };
const SETUP_LINES: Line[] = [
  { p: "$", pColor: T.prompt, text: "npx @kodwai/cli start sr-backend-a91f --token kdw_live_••••" },
  { text: "resolving interview  sr-backend-a91f  ·  60:00 limit", color: T.faint },
  { p: "✓", pColor: T.green, text: "downloaded PROBLEM.md · starter files · tests" },
  { p: "✓", pColor: T.green, text: "git repo initialized · timer started 00:00" },
  { p: "✓", pColor: T.green, text: "launching claude-code in ~/kodwai/rate-limiter" },
];

/* ── the LONG live session that streams after the welcome box. A believable
   sliding-window rate-limiter story: a plan, a failing test written first,
   edits, tool runs, a passing batch, a fresh failure under concurrency, the
   recovery (a per-key lock), and commits, ending on a live caret. Kinds:
     you    rust prompt, the interviewer / candidate intent
     claude green agent action
     tool   dim "$ ..." shell command
     pass   green "✓ ..." result
     fail   amber "✗ ..." result
     diff   dim file-change note (slightly indented)
   ─────────────────────────────────────────────────────────────────────────── */
type Kind = "you" | "claude" | "tool" | "pass" | "fail" | "diff";
type Sess = { k: Kind; text: string };
const SESSION: Sess[] = [
  { k: "you",    text: "start with a failing test for window eviction, then implement." },
  { k: "claude", text: "added test_window_eviction to tests/test_limiter.py" },
  { k: "tool",   text: "pytest -q tests/test_limiter.py::test_window_eviction" },
  { k: "fail",   text: "1 failed in 0.41s  ·  NameError: SlidingWindow" },
  { k: "claude", text: "implementing SlidingWindow in limiter.py" },
  { k: "diff",   text: "limiter.py  +24 -2" },
  { k: "tool",   text: "pytest -q" },
  { k: "pass",   text: "7 passed in 0.63s" },
  { k: "you",    text: "now make it safe across threads, two workers hit the same key." },
  { k: "claude", text: "adding a per-key lock around the deque mutation" },
  { k: "diff",   text: "limiter.py  +18 -4" },
  { k: "tool",   text: "pytest -q tests/test_concurrency.py" },
  { k: "fail",   text: "1 failed in 0.88s  ·  RuntimeError: deque mutated during iteration" },
  { k: "claude", text: "snapshotting the window before pruning, narrowing the lock" },
  { k: "diff",   text: "limiter.py  +9 -6" },
  { k: "tool",   text: "pytest -q" },
  { k: "pass",   text: "9 passed in 0.71s" },
  { k: "tool",   text: "ruff check limiter.py" },
  { k: "pass",   text: "all checks passed" },
  { k: "claude", text: "git commit -m \"sliding-window limiter, per-key lock\"" },
  { k: "tool",   text: "git commit  ·  3 files changed, 51 insertions(+)" },
  { k: "you",    text: "good. add a quick benchmark note in the PR body." },
  { k: "claude", text: "writing PR body  ·  ~9.4k req/s single key, p99 0.21ms" },
];

/* per-kind rendering: prompt glyph + its color, plus the body text color */
const SESS_META: Record<Kind, { p: string; pColor: string; textColor: string; bold?: boolean; indent?: boolean }> = {
  you:    { p: "you ›",    pColor: T.prompt, textColor: T.text,  bold: true },
  claude: { p: "claude ·", pColor: T.agent,  textColor: T.text },
  tool:   { p: "$",        pColor: T.faint,  textColor: T.faint },
  pass:   { p: "✓",        pColor: T.green,  textColor: T.green },
  fail:   { p: "✗",        pColor: T.amber,  textColor: T.amber },
  diff:   { p: "",         pColor: T.faint,  textColor: T.faint, indent: true },
};

/* compact signals strip below the terminal (mono label + value) */
const SIGNALS: { label: string; value: string; accent?: boolean }[] = [
  { label: "time", value: "18:24" },
  { label: "cost", value: "$0.42" },
  { label: "tools", value: "9" },
  { label: "tests", value: "9 / 9", accent: true },
];

function reducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── The small pixel-robot mascot, hand-drawn in SVG (Claude coral) ─────────
   Ported from the developer landing. A blocky friendly bot. */
function PixelBot({ size = 82 }: { size?: number }) {
  const coral = "#d97757";
  return (
    <svg width={size} height={size * (11 / 14)} viewBox="0 0 14 11" shapeRendering="crispEdges" aria-hidden style={{ display: "block" }}>
      <rect x="3" y="2" width="8" height="5" fill={coral} />
      <rect x="2" y="3" width="1" height="3" fill={coral} />
      <rect x="11" y="3" width="1" height="3" fill={coral} />
      <rect x="4" y="1" width="1" height="1" fill={coral} />
      <rect x="9" y="1" width="1" height="1" fill={coral} />
      <rect x="5" y="3" width="1" height="2" fill={T.bg} />
      <rect x="8" y="3" width="1" height="2" fill={T.bg} />
      <rect x="4" y="7" width="1" height="2" fill={coral} />
      <rect x="6" y="7" width="1" height="2" fill={coral} />
      <rect x="9" y="7" width="1" height="2" fill={coral} />
    </svg>
  );
}

/* ─── A Claude-Code-styled welcome box, adapted for an interview session ─────
   Header glyph + "Claude Code" + dim version, then a two-panel body. LEFT is
   welcome + mascot + model line; RIGHT is interview-specific (problem, time
   limit, scored on your rubric) instead of tips / recent activity. */
function ClaudeWelcome() {
  const border = "rgba(217,119,87,0.34)";
  const coral = "#d97757";
  return (
    <div
      className="k-hhero-welcome"
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
        <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: coral, letterSpacing: 0.2 }}>
          Claude Code
        </span>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: T.faint, letterSpacing: 0.4 }}>
          v2.1.113
        </span>
      </div>

      {/* two-panel body */}
      <div className="k-hhero-welcome-body">
        {/* LEFT: welcome + mascot + model line */}
        <div
          className="k-hhero-welcome-left"
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
              Opus 4.7 <span style={{ color: T.faint }}>·</span> interview mode
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 12, color: T.faint, letterSpacing: 0.2 }}>
              ~/kodwai/rate-limiter
            </span>
          </div>
        </div>

        {/* RIGHT: interview-specific (problem, time limit, scoring) */}
        <div
          className="k-hhero-welcome-right"
          style={{
            display: "flex", flexDirection: "column", gap: 16, padding: "22px 22px 24px",
            borderLeft: `1px solid ${border}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, fontWeight: 600, color: coral, letterSpacing: 0.2 }}>
              Interview
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, lineHeight: 1.6, color: T.text }}>
              Sliding-window rate limiter
            </span>
          </div>

          <div style={{ height: 1, background: border }} aria-hidden />

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, lineHeight: 1.5, color: T.text }}>
              Time limit <span style={{ color: coral }}>60 min</span>
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 12.5, lineHeight: 1.5, color: T.faint }}>
              Scored on your rubric
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── one rendered session line (prompt glyph + colored body). When `text` is
   passed (a "you ›" prompt mid-type) it renders the partial text + a caret. ── */
function SessionRow({ line, text, caret }: { line: Sess; text?: string; caret?: boolean }) {
  const m = SESS_META[line.k];
  return (
    <div
      style={{
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        display: "flex", gap: m.p ? 8 : 0, alignItems: "baseline",
        paddingLeft: m.indent ? 22 : 0,
      }}
    >
      {m.p && (
        <span style={{ color: m.pColor, fontWeight: m.bold ? 600 : 400, flexShrink: 0 }}>
          {m.p}
        </span>
      )}
      <span style={{ color: m.textColor }}>
        {text ?? line.text}
        {caret && (
          <span
            className="k-hhero-caret"
            style={{
              display: "inline-block", width: 7, height: 15, background: T.prompt,
              marginLeft: 2, transform: "translateY(2px)", verticalAlign: "middle",
            }}
          />
        )}
      </span>
    </div>
  );
}

/* ─── The tall Claude Code terminal: types the CLI invocation, prints the
   setup lines, drops the welcome box, then streams the long live session and
   subtly loops. The body is height-capped and scrolls; new lines auto-scroll
   to the bottom. Reduced-motion renders the full final state, scrolled down. */
function TerminalMock() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const tokenRef = useRef(0);
  const runRef = useRef<() => void>(() => {});
  const rm = reducedMotion();
  // line 0 (the command) types char-by-char; the rest reveal one at a time
  const [typed, setTyped] = useState(rm ? SETUP_LINES[0].text : "");
  const [shown, setShown] = useState(rm ? SETUP_LINES.length : 1);
  const [welcome, setWelcome] = useState(rm);
  // how many of the long session lines (after the welcome) are revealed
  const [sess, setSess] = useState(rm ? SESSION.length : 0);
  // the "you ›" line currently being typed (index + partial text), -1 when idle
  const [typingIdx, setTypingIdx] = useState(-1);
  const [sessTyped, setSessTyped] = useState("");
  // whether the session has finished streaming (controls the live caret)
  const [done, setDone] = useState(rm);

  // auto-scroll the body to the bottom whenever new content lands
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [typed, shown, welcome, sess, sessTyped, typingIdx, done]);

  useEffect(() => {
    if (reducedMotion()) return;
    const cmd = SETUP_LINES[0].text;
    const after = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms) as unknown as number;
      timersRef.current.push(id);
      return id;
    };

    // one full pass: type the command, reveal setup, drop the welcome box, then
    // stream the long session with every "you ›" prompt TYPED char-by-char.
    // Pauses, then loops. A per-pass token neutralises stale callbacks when the
    // pass is restarted (by the loop or the replay button).
    const run = () => {
      const myToken = ++tokenRef.current;
      const alive = () => tokenRef.current === myToken;
      setTyped(""); setShown(1); setWelcome(false);
      setSess(0); setTypingIdx(-1); setSessTyped(""); setDone(false);

      const streamFrom = (s: number) => {
        if (!alive()) return;
        setSess(s + 1);
        const line = SESSION[s];
        const advance = () => {
          if (!alive()) return;
          if (s + 1 < SESSION.length) {
            const gap = line.k === "fail" ? 760 : line.k === "claude" ? 540 : 360;
            after(() => streamFrom(s + 1), gap);
          } else {
            setDone(true);
            after(() => { if (alive()) run(); }, 4400);
          }
        };
        if (line.k === "you") {
          // a person types their prompt: reveal it char-by-char with a caret
          setTypingIdx(s); setSessTyped("");
          const o = { i: 0 };
          anime({
            targets: o, i: line.text.length,
            duration: Math.max(560, line.text.length * 26), easing: "linear",
            update: () => { if (alive()) setSessTyped(line.text.slice(0, Math.round(o.i))); },
            complete: () => { if (!alive()) return; setTypingIdx(-1); after(advance, 420); },
          });
        } else {
          setTypingIdx(-1);
          advance();
        }
      };

      // 1) type the start command char by char
      const obj = { i: 0 };
      anime({
        targets: obj, i: cmd.length, duration: 1300, easing: "linear",
        update: () => { if (alive()) setTyped(cmd.slice(0, Math.round(obj.i))); },
        complete: () => {
          if (!alive()) return;
          // 2) reveal the setup lines one at a time
          let n = 1;
          const tick = () => {
            if (!alive()) return;
            n += 1;
            setShown(n);
            if (n < SETUP_LINES.length) {
              after(tick, 320);
            } else {
              // 3) the welcome box, then 4) the long typed session
              after(() => { if (!alive()) return; setWelcome(true); after(() => streamFrom(0), 600); }, 460);
            }
          };
          after(tick, 380);
        },
      });
    };

    runRef.current = run;

    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run();
        io.unobserve(el);
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => {
      io.disconnect();
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  // replay: stop the current pass and start a fresh one immediately
  const replay = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    runRef.current();
  };

  const dot = (c: string) => (
    <span style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "inline-block" }} />
  );

  // the live blinking caret shown after the session settles
  const liveCaret = (
    <span style={{ display: "flex", gap: 8, alignItems: "baseline", marginTop: 2 }}>
      <span style={{ color: T.prompt, fontWeight: 600, flexShrink: 0 }}>you ›</span>
      <span
        className="k-hhero-caret"
        style={{
          display: "inline-block", width: 7, height: 15, background: T.prompt,
          transform: "translateY(2px)",
        }}
      />
    </span>
  );

  return (
    <div ref={wrapRef} className="k-hhero-term">
      {/* window chrome */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 17px",
        background: T.header, borderBottom: `1px solid ${T.line}`,
      }}>
        {dot("#ff5f57")}{dot("#febc2e")}{dot("#28c840")}
        <span style={{
          marginLeft: 8, fontFamily: C.mono, fontSize: 11.5, color: T.faint, letterSpacing: 0.4,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0,
        }}>
          ~/kodwai/rate-limiter · zsh
        </span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <span style={{
            fontFamily: C.mono, fontSize: 10, color: T.prompt,
            letterSpacing: 1.4, textTransform: "uppercase",
          }}>
            REC 18:24
          </span>
          {!rm && (
            <button
              type="button"
              onClick={replay}
              aria-label="Replay the interview session"
              className="k-hhero-replay"
              onMouseEnter={(e) => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.faint; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.faint; e.currentTarget.style.borderColor = T.line; }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "transparent", border: `1px solid ${T.line}`, color: T.faint,
                fontFamily: C.mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
                padding: "4px 9px", cursor: "pointer", lineHeight: 1,
                transition: "color .2s ease, border-color .2s ease",
              }}
            >
              <span aria-hidden style={{ fontSize: 12, transform: "translateY(0.5px)" }}>⟲</span>
              <span className="k-hhero-replay-label">replay</span>
            </button>
          )}
        </span>
      </div>

      {/* body: FIXED height, scrolls internally, auto-scrolled to the newest line */}
      <div
        ref={bodyRef}
        aria-hidden
        className="k-hhero-term-body"
        style={{
          padding: "22px 24px 26px", fontFamily: C.mono, fontSize: 13.5, lineHeight: 1.85,
          color: T.text, background: T.bg,
          height: 500, overflowY: "auto",
        }}
      >
        {SETUP_LINES.map((ln, i) => {
          if (i >= shown) return null;
          const isCmd = i === 0;
          const content = isCmd ? typed : ln.text;
          const cmdDone = isCmd ? typed.length >= ln.text.length : true;
          return (
            <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: ln.color ?? T.text }}>
              {ln.p && <span style={{ color: ln.pColor ?? T.prompt, marginRight: 8 }}>{ln.p}</span>}
              <span>{content}</span>
              {isCmd && !cmdDone && (
                <span className="k-hhero-caret" style={{
                  display: "inline-block", width: 7, height: 15, background: T.prompt,
                  marginLeft: 2, transform: "translateY(2px)",
                }} />
              )}
            </div>
          );
        })}

        {welcome && <ClaudeWelcome />}

        {/* the long live session after the welcome box (you-prompts type out) */}
        {welcome && sess > 0 && (
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 7 }}>
            {SESSION.map((ln, i) => {
              if (i >= sess) return null;
              if (i === typingIdx) return <SessionRow key={i} line={ln} text={sessTyped} caret />;
              return <SessionRow key={i} line={ln} />;
            })}
            {done && liveCaret}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── top-bar meter: mono uppercase micro-label + value ──────────────────── */
function Meter({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 7, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: C.mono, fontSize: 9.5, color: C.faint, letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontFamily: C.mono, fontSize: 12.5, fontWeight: 600, color: C.text, letterSpacing: 0.2 }}>{value}</span>
    </span>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        background: C.bg,
        padding: `clamp(118px, 15vh, 148px) ${PAD} clamp(56px, 8vw, 92px)`,
        overflow: "hidden",
      }}
    >
      <style>{`
        .k-hhero-caret { animation: k-hhero-blink 1.05s steps(1) infinite; }
        @keyframes k-hhero-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        /* thin, quiet scrollbar for the scrolling terminal body */
        .k-hhero-term-body { scrollbar-width: thin; scrollbar-color: ${T.line} transparent; }
        .k-hhero-term-body::-webkit-scrollbar { width: 8px; }
        .k-hhero-term-body::-webkit-scrollbar-track { background: transparent; }
        .k-hhero-term-body::-webkit-scrollbar-thumb {
          background: ${T.line}; border-radius: 2px;
          border: 2px solid ${T.bg};
        }
        /* welcome two-panel body: collapses to one column on narrow */
        .k-hhero-welcome-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
        }
        @media (max-width: 620px) {
          .k-hhero-welcome-body { grid-template-columns: 1fr; }
          .k-hhero-welcome-right { border-left: none !important; border-top: 1px solid rgba(217,119,87,0.34); }
        }
        @media (prefers-reduced-motion: reduce) {
          .k-hhero-caret { display: none !important; }
        }
        @media (max-width: 720px) {
          .k-hhero-topbar { flex-wrap: wrap !important; row-gap: 10px !important; }
          .k-hhero-meters { width: 100%; margin-left: 0 !important; }
          .k-hhero-signals { flex-wrap: wrap !important; }
        }
        @media (max-width: 520px) {
          .k-hhero-h1 { font-size: clamp(34px, 10vw, 46px) !important; line-height: 1.12 !important; }
          .k-hhero-cta { gap: 14px 18px !important; }
          .k-hhero-topbar { padding: 11px 14px !important; }
          .k-hhero-term-body {
            padding: 16px 15px 20px !important; font-size: 12.5px !important;
            height: 360px !important;
          }
          .k-hhero-replay-label { display: none !important; }
          .k-hhero-welcome-left, .k-hhero-welcome-right { padding: 18px 16px !important; }
          .k-hhero-signals { padding: 13px 14px !important; }
        }
      `}</style>

      {/* ─────────────────────────────  TEXT BLOCK  ───────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <div className="k-hero-el" style={{ display: "inline-flex" }}>
          <Eyebrow label="for hiring teams" />
        </div>

        <h1
          className="k-hero-el k-hhero-h1"
          style={{
            fontFamily: C.serif,
            fontWeight: 420,
            fontSize: "clamp(42px, 7.6vw, 88px)",
            letterSpacing: "-0.018em",
            lineHeight: 1.08,
            color: C.text,
            margin: "clamp(22px, 3vw, 30px) auto 0",
            maxWidth: "15ch",
            textWrap: "balance",
          }}
        >
          See how candidates
          <br />
          <Accent>really</Accent> build.
        </h1>

        <p
          className="k-hero-el"
          style={{
            fontFamily: C.sans,
            fontWeight: 400,
            fontSize: "clamp(16.5px, 2.1vw, 20.5px)",
            lineHeight: 1.58,
            color: C.muted,
            maxWidth: "58ch",
            margin: "clamp(20px, 2.8vw, 28px) auto clamp(28px, 3.6vw, 38px)",
            textWrap: "pretty",
          }}
        >
          Kodwai runs a real ticket as a private interview and shows you the whole
          session: the prompts, the recovery, the verification, the result. You watch
          it live, score it against your own rubric, and compare candidates on one board.
        </p>

        <div
          className="k-hero-el k-hhero-cta"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px 24px",
          }}
        >
          <PrimaryButton
            label="Set up interviews"
            large
            event="cta_clicked"
            eventProps={{ location: "hiring_hero" }}
          />
          <GhostLink
            kicker="a developer?"
            label="start a challenge"
            href="/"
            event="cta_clicked"
            eventProps={{ location: "hiring_hero" }}
          />
        </div>
      </div>

      {/* ───────────────────────  LIVE INTERVIEW SESSION FRAME  ─────────────────── */}
      <div
        className="k-hero-el"
        style={{ position: "relative", maxWidth: 1000, margin: "clamp(48px, 6vw, 80px) auto 0" }}
      >
        {/* faint rust radial glow behind the frame */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-7% -4% -10%",
            background:
              "radial-gradient(56% 60% at 50% 26%, rgba(194,54,22,0.10), transparent 72%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* corner tag: // live session */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 14,
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 0.6 }}>{"//"}</span>
          <span
            style={{
              fontFamily: C.mono,
              fontSize: 10.5,
              color: C.muted,
              letterSpacing: 1.6,
              textTransform: "uppercase",
            }}
          >
            live session
          </span>
        </div>

        {/* the framed dashboard panel */}
        <div
          aria-label="A live interview session: candidate Jamie Brooks, a running timer, cost and token meters, a Claude Code terminal typing the interview start command, showing the welcome screen, and streaming a long rate-limiter coding session, and a signals strip."
          style={{
            position: "relative",
            zIndex: 1,
            border: `1px solid ${C.lineBright}`,
            background: C.panel,
            overflow: "hidden",
            boxShadow:
              "0 34px 80px -34px rgba(40,22,10,0.45), 0 2px 12px -5px rgba(40,22,10,0.18)",
          }}
        >
          {/* ── TOP BAR: candidate identity + meters ─────────────────────── */}
          <div
            className="k-hhero-topbar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "13px 18px",
              borderBottom: `1px solid ${C.line}`,
              background: C.bg,
            }}
          >
            {/* left: pulse + candidate + role */}
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: C.accent,
                    animation: "live-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
                  }}
                />
                <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
              </span>
              <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: 0.1, whiteSpace: "nowrap" }}>
                Jamie Brooks
              </span>
              <span style={{ width: 1, height: 13, background: C.line, flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: C.mono, fontSize: 12, color: C.muted, letterSpacing: 0.2, whiteSpace: "nowrap" }}>
                Senior Backend
              </span>
            </div>

            {/* right: status pill + meters */}
            <div className="k-hhero-meters" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: C.accent,
                  border: `1px solid ${C.accentSoft}`,
                  background: C.accentSoft,
                  padding: "3px 9px",
                  whiteSpace: "nowrap",
                }}
              >
                active
              </span>
              <Meter label="time" value="18:24" />
              <Meter label="cost" value="$0.42" />
              <Meter label="tokens" value="31.2k" />
            </div>
          </div>

          {/* ── THE TERMINAL: dominant centerpiece, full panel width ─────── */}
          <div style={{ borderBottom: `1px solid ${C.line}` }}>
            <TerminalMock />
          </div>

          {/* ── SIGNALS STRIP: compact read-out beneath the terminal ─────── */}
          <div
            className="k-hhero-signals"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "15px 20px",
              background: C.panel,
            }}
          >
            <span
              style={{
                fontFamily: C.mono,
                fontSize: 10,
                color: C.faint,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              signals
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              {SIGNALS.map((s) => (
                <span key={s.label} style={{ display: "inline-flex", alignItems: "baseline", gap: 8, whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: 10,
                      color: C.faint,
                      letterSpacing: 1.1,
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: 14,
                      fontWeight: 700,
                      color: s.accent ? C.green : C.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.value}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
