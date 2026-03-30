"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ===========================================
   DESIGN TOKENS — OptionE Design System
   Colors, fonts, and spacing that define the visual language.
   Change these to retheme the entire deck.
   =========================================== */
const T = {
  bg: "#faf8f4",
  text: "#1a1a1a",
  accent: "#c23616",
  muted: "#9a948a",
  border: "#e4e0d8",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontMono: "'Space Mono', monospace",
  fontLogo: "'Playfair Display', Georgia, serif",
};

/* ===========================================
   SLIDE DATA
   All content for the pitch deck lives here.
   =========================================== */

const SLIDES: SlideData[] = [
  /* ── 0: TITLE ── */
  {
    id: "title",
    type: "title",
    content: {
      overline: "Investor Presentation · 2026",
      title: "kodwai",
      subtitle: "The interview platform for the AI agent era.",
      footnote: "Technical interviews, reimagined.",
    },
  },

  /* ── 1: PROBLEM ── */
  {
    id: "problem",
    type: "statement",
    content: {
      overline: "The Problem",
      title: "Interviews test skills\nthat don't matter anymore.",
      body: "Every major company now expects engineers to work with AI agents daily. But every interview platform still uses browser-based IDEs with toy chatbots. They're testing 2020 skills in a 2026 world.",
    },
  },

  /* ── 2: SHIFT ── */
  {
    id: "shift",
    type: "stats",
    content: {
      overline: "The Market Shift",
      title: "AI agents are the new IDE.",
      stats: [
        { value: "78%", label: "of professional developers use AI coding agents daily" },
        { value: "Oct '25", label: "Meta launched AI-assisted coding interviews" },
        { value: "0", label: "platforms let candidates use a real AI agent" },
      ],
      body: "The industry is moving from 'Can they code?' to 'Can they ship with AI?' — but no tool evaluates that.",
    },
  },

  /* ── 3: SOLUTION ── */
  {
    id: "solution",
    type: "statement",
    content: {
      overline: "The Solution",
      title: "kodwai lets candidates use\nClaude Code — the real agent.",
      body: "Not a chatbot in a browser. A full autonomous AI coding agent in the candidate's own terminal. Every prompt, tool use, file edit, and decision — captured, streamed, and scored.",
    },
  },

  /* ── 4: HOW IT WORKS ── */
  {
    id: "how",
    type: "steps",
    content: {
      overline: "How It Works",
      title: "Three steps. Total clarity.",
      steps: [
        {
          number: "01",
          title: "Company creates a challenge",
          desc: "Define the problem, set time limits, configure evaluation rubrics, upload starter files. Add your Anthropic API key.",
        },
        {
          number: "02",
          title: "Candidate runs one command",
          desc: "npx kodwai start <session-id> — bootstraps Claude Code in their terminal. Timer starts. Every interaction streams live to your dashboard.",
        },
        {
          number: "03",
          title: "AI scores the session",
          desc: "Full transcript + final code → AI-generated scorecard. Problem decomposition, agent mastery, code quality, verification. Side-by-side with your manual review.",
        },
      ],
    },
  },

  /* ── 5: LIVE DASHBOARD ── */
  {
    id: "dashboard",
    type: "feature",
    content: {
      overline: "Real-Time Observation",
      title: "Watch interviews unfold live.",
      features: [
        "Live transcript — every prompt and response as it happens",
        "File tree with real-time diffs and syntax highlighting",
        "Tool usage feed — see which Claude Code tools are invoked",
        "Countdown timer and session status for all observers",
      ],
      callout: "< 2 second latency from candidate action to dashboard update.",
    },
  },

  /* ── 6: SCORING ── */
  {
    id: "scoring",
    type: "scoring",
    content: {
      overline: "AI-Powered Evaluation",
      title: "From 5-day hiring loops\nto 60-minute clarity.",
      dimensions: [
        { name: "Problem decomposition", score: 87 },
        { name: "AI agent direction", score: 92 },
        { name: "Verification & testing", score: 98 },
        { name: "Code quality", score: 93 },
        { name: "Communication clarity", score: 89 },
      ],
      body: "Custom rubrics per project. AI reads the full transcript, final code, timing data, and tool usage patterns to generate structured, comparable evaluations.",
    },
  },

  /* ── 7: MARKET ── */
  {
    id: "market",
    type: "market",
    content: {
      overline: "Market Opportunity",
      title: "A $2.5B market\nwith an empty quadrant.",
      tiers: [
        { label: "TAM", value: "$2.5B", desc: "Technical assessment software (2026)" },
        { label: "SAM", value: "$200-400M", desc: "AI-assisted interview segment" },
        { label: "SOM", value: "$10-30M", desc: "Agent-native interviews (Year 1-2)" },
      ],
      growth: "9.5% CAGR → $4.0B by 2033",
      body: "Every incumbent clusters in 'browser IDE + chat assistant.' The agent-native quadrant is completely unoccupied.",
    },
  },

  /* ── 8: COMPETITIVE ── */
  {
    id: "competitive",
    type: "comparison",
    content: {
      overline: "Competitive Landscape",
      title: "Nobody does this.",
      columns: ["Feature", "CodeSignal", "CoderPad", "HackerRank", "kodwai"],
      rows: [
        ["Real AI agent (Claude Code)", "✗", "✗", "✗", "✓"],
        ["Terminal-native experience", "✗", "✗", "✗", "✓"],
        ["Full session + tool capture", "Partial", "Partial", "Partial", "Full"],
        ["AI interaction transcript", "✓", "✓", "Partial", "✓"],
        ["AI-powered scoring", "✓", "✗", "✓", "✓"],
        ["Custom rubrics", "✓", "✗", "Partial", "✓"],
        ["File diff tracking", "✗", "✗", "✗", "✓"],
      ],
    },
  },

  /* ── 9: POSITIONING ── */
  {
    id: "positioning",
    type: "statement",
    content: {
      overline: "Strategic Position",
      title: "Classic innovator's dilemma.",
      body: "Incumbents are optimizing their browser IDEs with better chat assistants. Their strength — millions of users locked into browser environments — is also what prevents them from pivoting to terminal-native, agent-first architecture. Kodwai has a 12-18 month window to own the category before they retool.",
    },
  },

  /* ── 10: BUSINESS MODEL ── */
  {
    id: "business",
    type: "business",
    content: {
      overline: "Business Model",
      title: "How companies profit.",
      items: [
        {
          title: "For hiring teams",
          points: [
            "3.2× faster than traditional interview loops",
            "Eliminate 80% of first-round interviewer time",
            "Structured, comparable data across all candidates",
            "Evaluate the skill that actually predicts job performance",
          ],
        },
        {
          title: "Revenue model",
          points: [
            "Per-seat SaaS subscription for hiring teams",
            "Per-session pricing for high-volume customers",
            "Company provides their own Anthropic API key (zero LLM cost to Kodwai)",
            "Enterprise tier: SSO, compliance, custom integrations",
          ],
        },
      ],
    },
  },

  /* ── 11: ROI ── */
  {
    id: "roi",
    type: "stats",
    content: {
      overline: "The ROI Case",
      title: "Every interview saves\ntime and money.",
      stats: [
        { value: "$4,700", label: "average cost-per-hire reduction" },
        { value: "3.2×", label: "faster than traditional loops" },
        { value: "94%", label: "hiring manager signal accuracy" },
      ],
      body: "Kodwai replaces first-round interviewer hours with AI-scored sessions, letting senior engineers focus on final rounds and culture fit — not screening.",
    },
  },

  /* ── 12: TRACTION ── */
  {
    id: "traction",
    type: "stats",
    content: {
      overline: "Early Traction",
      title: "Momentum is building.",
      stats: [
        { value: "847+", label: "engineers on the waitlist" },
        { value: "12-18mo", label: "first-mover window" },
        { value: "$0", label: "LLM cost to Kodwai per session" },
      ],
      body: "Meta's AI-assisted interview round (Oct 2025) validated our thesis. CodeSignal's 'AI-Native' rebrand confirms the market is moving. We're building the next paradigm — before they do.",
    },
  },

  /* ── 13: TECH ── */
  {
    id: "tech",
    type: "tech",
    content: {
      overline: "Technical Foundation",
      title: "Built on proven infrastructure.",
      stack: [
        { label: "CLI", value: "Node.js + Claude Code Agent SDK" },
        { label: "Web App", value: "Next.js 16 · React 19 · Tailwind CSS 4" },
        { label: "Database", value: "libSQL / Turso" },
        { label: "Real-Time", value: "WebSocket for live session streaming" },
        { label: "Scoring", value: "Claude API with full session context" },
        { label: "Security", value: "AES-256 encrypted API keys · HMAC webhook auth" },
      ],
    },
  },

  /* ── 14: VISION ── */
  {
    id: "vision",
    type: "statement",
    content: {
      overline: "The Vision",
      title: "Own the category\nbefore it exists.",
      body: "The moat isn't technology — the Agent SDK is public. The moat is category ownership: being the company that defines 'AI agent interviews,' signs the first enterprise customers, and builds the brand. We're not entering a market. We're creating one.",
    },
  },

  /* ── 15: CTA ── */
  {
    id: "cta",
    type: "cta",
    content: {
      title: "Stop guessing.\nStart measuring.",
      subtitle: "Join the companies that interview engineers the way they actually work.",
      contact: "hello@kodwai.com",
      url: "kodwai.com",
    },
  },
];

/* ===========================================
   TYPE DEFINITIONS
   =========================================== */
interface SlideData {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

/* ===========================================
   ANIMATED COUNTER
   Counts up from 0 to target with easing.
   =========================================== */
function AnimCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const s = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - s) / 1800, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ===========================================
   SCORE BAR
   Animated horizontal bar that fills to a percentage.
   =========================================== */
function ScoreBar({ name, score, delay }: { name: string; score: number; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: T.fontMono, fontSize: 13, color: T.text }}>{name}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 13, color: T.accent, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: T.border, borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: visible ? `${score}%` : "0%",
            background: T.accent,
            borderRadius: 3,
            transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

/* ===========================================
   SLIDE RENDERER
   Maps slide data to visual components.
   Each slide type has its own layout logic.
   =========================================== */
function SlideContent({ slide }: { slide: SlideData }) {
  const c = slide.content;

  switch (slide.type) {
    /* ── TITLE SLIDE ── */
    case "title":
      return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "100%" }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 11, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
            {c.overline}
          </p>
          <h1
            className="reveal"
            style={{
              fontFamily: T.fontLogo,
              fontWeight: 550,
              fontSize: "clamp(56px, 10vw, 120px)",
              letterSpacing: "2px",
              color: T.text,
              marginBottom: 24,
            }}
          >
            {c.title}
          </h1>
          <p
            className="reveal"
            style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(18px, 2.5vw, 28px)",
              color: T.muted,
              fontStyle: "italic",
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            {c.subtitle}
          </p>
          <div className="reveal" style={{ width: 48, height: 1, background: T.accent, margin: "36px auto 0" }} />
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 11, color: T.muted, letterSpacing: 2, marginTop: 16 }}>
            {c.footnote}
          </p>
        </div>
      );

    /* ── STATEMENT SLIDE ── */
    case "statement":
      return (
        <div style={{ maxWidth: 900 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
            {c.overline}
          </p>
          <h2
            className="reveal"
            style={{
              fontFamily: T.fontDisplay,
              fontWeight: 400,
              fontSize: "clamp(30px, 4.5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: 24,
              whiteSpace: "pre-line",
            }}
          >
            {c.title.split("\n").map((line: string, i: number) => (
              <span key={i}>
                {i > 0 && <br />}
                {line.includes("don't matter") || line.includes("Claude Code") || line.includes("innovator's") || line.includes("Own the category") ? (
                  <span style={{ color: T.accent, fontStyle: "italic" }}>{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h2>
          <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 18, color: T.muted, lineHeight: 1.75, maxWidth: 640 }}>
            {c.body}
          </p>
        </div>
      );

    /* ── STATS SLIDE ── */
    case "stats":
      return (
        <div style={{ maxWidth: 1100 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2
            className="reveal"
            style={{
              fontFamily: T.fontDisplay,
              fontWeight: 400,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: 36,
              whiteSpace: "pre-line",
            }}
          >
            {c.title}
          </h2>
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 48, marginBottom: 32 }}>
            {c.stats.map((s: { value: string; label: string }, i: number) => (
              <div key={i} style={{ paddingLeft: 24, borderLeft: `2px solid ${T.accent}` }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(40px, 6vw, 56px)", letterSpacing: "-2px", color: T.text, marginBottom: 8 }}>
                  {s.value}
                </div>
                <p style={{ fontFamily: T.fontMono, fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
          {c.body && (
            <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 17, color: T.muted, lineHeight: 1.75, maxWidth: 700, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
              {c.body}
            </p>
          )}
        </div>
      );

    /* ── STEPS SLIDE ── */
    case "steps":
      return (
        <div style={{ maxWidth: 900 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-1.5px", marginBottom: 36 }}>
            {c.title.split(".")[0]}. <span style={{ color: T.accent, fontStyle: "italic" }}>{c.title.split(". ")[1]}</span>
          </h2>
          {c.steps.map((step: { number: string; title: string; desc: string }, i: number) => (
            <div key={i} className="reveal" style={{ display: "flex", gap: 28, padding: "32px 0", borderTop: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: T.fontMono, fontSize: 13, color: T.accent, letterSpacing: 1, flexShrink: 0, paddingTop: 4 }}>{step.number}</span>
              <div>
                <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 24, letterSpacing: "-0.3px", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontFamily: T.fontDisplay, fontSize: 15, color: T.muted, lineHeight: 1.8 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      );

    /* ── FEATURE SLIDE ── */
    case "feature":
      return (
        <div style={{ maxWidth: 900 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-1.5px", marginBottom: 32 }}>
            Watch interviews <span style={{ color: T.accent, fontStyle: "italic" }}>unfold live.</span>
          </h2>
          <div style={{ display: "grid", gap: 20, marginBottom: 40 }}>
            {c.features.map((f: string, i: number) => (
              <div key={i} className="reveal" style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", background: `${T.text}08`, borderRadius: 8 }}>
                <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent, flexShrink: 0, paddingTop: 2 }}>0{i + 1}</span>
                <p style={{ fontFamily: T.fontDisplay, fontSize: 16, color: T.text, lineHeight: 1.6 }}>{f}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ padding: "20px 24px", borderLeft: `2px solid ${T.accent}` }}>
            <p style={{ fontFamily: T.fontMono, fontSize: 14, color: T.accent, fontWeight: 600 }}>{c.callout}</p>
          </div>
        </div>
      );

    /* ── SCORING SLIDE ── */
    case "scoring":
      return (
        <div style={{ maxWidth: 1000 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 32, whiteSpace: "pre-line" }}>
            From 5-day hiring loops<br />to <span style={{ color: T.accent, fontStyle: "italic" }}>60-minute clarity.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 40, alignItems: "start" }}>
            <div className="reveal">
              {c.dimensions.map((d: { name: string; score: number }, i: number) => (
                <ScoreBar key={i} name={d.name} score={d.score} delay={i * 0.15} />
              ))}
            </div>
            <div className="reveal" style={{ paddingTop: 8 }}>
              <div style={{ padding: "32px", background: `${T.text}06`, borderRadius: 12, border: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                  Sample Score Card
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 56, fontWeight: 400, color: T.accent, letterSpacing: "-3px", marginBottom: 8 }}>
                  94<span style={{ fontSize: 24, color: T.muted }}>/100</span>
                </div>
                <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
                  9 prompts · 14 files · 11 tests<br />
                  43:17 elapsed of 60:00
                </div>
              </div>
              <p style={{ fontFamily: T.fontDisplay, fontSize: 15, color: T.muted, lineHeight: 1.75, marginTop: 24 }}>
                {c.body}
              </p>
            </div>
          </div>
        </div>
      );

    /* ── MARKET SLIDE ── */
    case "market":
      return (
        <div style={{ maxWidth: 1000 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 36, whiteSpace: "pre-line" }}>
            A <span style={{ color: T.accent, fontStyle: "italic" }}>$2.5B market</span><br />with an empty quadrant.
          </h2>
          <div className="reveal" style={{ display: "flex", gap: 0, marginBottom: 32 }}>
            {c.tiers.map((tier: { label: string; value: string; desc: string }, i: number) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "32px 28px",
                  borderLeft: i > 0 ? `1px solid ${T.border}` : "none",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                  {tier.label}
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: T.text, letterSpacing: "-1px", marginBottom: 8 }}>
                  {tier.value}
                </div>
                <p style={{ fontFamily: T.fontMono, fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{tier.desc}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ display: "flex", gap: 24, alignItems: "center", padding: "20px 0", borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, fontWeight: 700, letterSpacing: 1 }}>GROWTH</span>
            <span style={{ fontFamily: T.fontDisplay, fontSize: 20, color: T.text }}>{c.growth}</span>
          </div>
          <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 17, color: T.muted, lineHeight: 1.75, marginTop: 24 }}>
            {c.body}
          </p>
        </div>
      );

    /* ── COMPARISON SLIDE ── */
    case "comparison":
      return (
        <div style={{ maxWidth: 1100 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-1.5px", marginBottom: 32 }}>
            <span style={{ color: T.accent, fontStyle: "italic" }}>Nobody</span> does this.
          </h2>
          <div className="reveal hide-scrollbar" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontFamily: T.fontMono, fontSize: 13 }}>
              <thead>
                <tr>
                  {c.columns.map((col: string, i: number) => (
                    <th
                      key={i}
                      style={{
                        textAlign: i === 0 ? "left" : "center",
                        padding: "14px 16px",
                        borderBottom: `2px solid ${T.text}`,
                        borderTop: `2px solid ${T.text}`,
                        fontSize: 11,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: i === c.columns.length - 1 ? T.bg : T.muted,
                        background: i === c.columns.length - 1 ? T.text : "transparent",
                        fontWeight: 600,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row: string[], ri: number) => (
                  <tr key={ri}>
                    {row.map((cell: string, ci: number) => (
                      <td
                        key={ci}
                        style={{
                          padding: "12px 16px",
                          borderBottom: `1px solid ${T.border}`,
                          textAlign: ci === 0 ? "left" : "center",
                          fontWeight: ci === 0 ? 600 : 400,
                          color:
                            ci === row.length - 1
                              ? cell === "✓" || cell === "Full"
                                ? T.accent
                                : T.text
                              : cell === "✗"
                                ? `${T.muted}88`
                                : T.muted,
                          fontSize: ci === 0 ? 12 : 13,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    /* ── BUSINESS MODEL SLIDE ── */
    case "business":
      return (
        <div style={{ maxWidth: 1000 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-1.5px", marginBottom: 36 }}>
            How companies <span style={{ color: T.accent, fontStyle: "italic" }}>profit.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 48 }}>
            {c.items.map((item: { title: string; points: string[] }, i: number) => (
              <div key={i} className="reveal" style={{ paddingLeft: 24, borderLeft: `2px solid ${i === 0 ? T.accent : T.border}` }}>
                <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 26, letterSpacing: "-0.3px", marginBottom: 20 }}>{item.title}</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {item.points.map((p: string, j: number) => (
                    <li key={j} style={{ fontFamily: T.fontDisplay, fontSize: 15, color: T.muted, lineHeight: 1.8, paddingLeft: 20, position: "relative", marginBottom: 8 }}>
                      <span style={{ position: "absolute", left: 0, color: T.accent, fontFamily: T.fontMono, fontSize: 10, top: 5 }}>→</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    /* ── TECH STACK SLIDE ── */
    case "tech":
      return (
        <div style={{ maxWidth: 800 }}>
          <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            {c.overline}
          </p>
          <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1.5px", marginBottom: 32 }}>
            Built on <span style={{ color: T.accent, fontStyle: "italic" }}>proven infrastructure.</span>
          </h2>
          <div className="reveal">
            {c.stack.map((s: { label: string; value: string }, i: number) => (
              <div key={i} style={{ display: "flex", gap: 24, padding: "18px 0", borderTop: `1px solid ${T.border}`, alignItems: "baseline" }}>
                <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", minWidth: 100, flexShrink: 0 }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: T.fontDisplay, fontSize: 17, color: T.text }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    /* ── CTA SLIDE ── */
    case "cta":
      return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "100%" }}>
          <h2
            className="reveal"
            style={{
              fontFamily: T.fontDisplay,
              fontWeight: 400,
              fontSize: "clamp(40px, 7vw, 72px)",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              marginBottom: 28,
              whiteSpace: "pre-line",
            }}
          >
            Stop <span style={{ color: T.accent, fontStyle: "italic" }}>guessing.</span>
            <br />
            Start measuring.
          </h2>
          <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 19, color: T.muted, lineHeight: 1.7, maxWidth: 550, marginBottom: 36 }}>
            {c.subtitle}
          </p>
          <div className="reveal" style={{ width: 48, height: 1, background: T.accent, marginBottom: 32 }} />
          <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: T.fontMono, fontSize: 16, color: T.text, fontWeight: 700, letterSpacing: 1 }}>{c.contact}</span>
            <span style={{ fontFamily: T.fontMono, fontSize: 13, color: T.muted }}>{c.url}</span>
          </div>
          <div className="reveal" style={{ marginTop: 40 }}>
            <span style={{ fontFamily: T.fontLogo, fontWeight: 550, fontSize: 32, letterSpacing: "0.75px", color: "#353431" }}>kodwai</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ===========================================
   PITCH DECK — Main Component
   Full-screen slide presentation with keyboard
   navigation, progress bar, and scroll-snap.
   =========================================== */
export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const isScrolling = useRef(false);

  /* ── Intersection Observer for reveal animations ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            // Update current slide index
            const idx = slideRefs.current.indexOf(e.target as HTMLElement);
            if (idx !== -1) setCurrentSlide(idx);
          }
        });
      },
      { threshold: 0.3 }
    );
    slideRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* ── Reveal children animations ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("reveal-visible");
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Navigate to slide ── */
  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, SLIDES.length - 1));
    const el = slideRefs.current[clamped];
    if (el) {
      isScrolling.current = true;
      el.scrollIntoView({ behavior: "smooth" });
      setCurrentSlide(clamped);
      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    }
  }, []);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goTo(currentSlide + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(currentSlide - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, goTo]);

  const progress = ((currentSlide + 1) / SLIDES.length) * 100;

  return (
    <div
      ref={containerRef}
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: T.fontDisplay,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Subtle mesh background ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/images/mesh-accent.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Progress Bar ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: `${progress}%`,
          background: T.accent,
          zIndex: 200,
          transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* ── Navigation Dots ── */}
      <nav
        style={{
          position: "fixed",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        className="nav-dots"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: currentSlide === i ? 10 : 6,
              height: currentSlide === i ? 10 : 6,
              borderRadius: "50%",
              background: currentSlide === i ? T.accent : T.border,
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </nav>

      {/* ── Slide Counter ── */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 28,
          fontFamily: T.fontMono,
          fontSize: 11,
          color: T.muted,
          letterSpacing: 2,
          zIndex: 100,
        }}
      >
        {String(currentSlide + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/* ── Keyboard hint ── */}
      <div
        className="keyboard-hint"
        style={{
          position: "fixed",
          bottom: 24,
          left: 28,
          fontFamily: T.fontMono,
          fontSize: 10,
          color: `${T.muted}88`,
          letterSpacing: 1,
          zIndex: 100,
        }}
      >
        ← → SPACE to navigate
      </div>

      {/* ── Slides ── */}
      {SLIDES.map((slide, i) => (
        <section
          key={slide.id}
          ref={(el) => {
            slideRefs.current[i] = el;
          }}
          className="pitch-slide"
          style={{
            minHeight: slide.type === "title" || slide.type === "cta" ? "100vh" : undefined,
            padding: `${slide.type === "title" || slide.type === "cta" ? "clamp(80px, 10vh, 120px)" : "clamp(48px, 6vh, 72px)"} clamp(24px, 6vw, 80px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: slide.type === "title" || slide.type === "cta" ? "center" : "flex-start",
            position: "relative",
            scrollSnapAlign: "start",
          }}
        >
          <SlideContent slide={slide} />
        </section>
      ))}

      {/* ── Inline Styles for animations ── */}
      <style>{`
        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal:nth-child(1) { transition-delay: 0.05s; }
        .reveal:nth-child(2) { transition-delay: 0.15s; }
        .reveal:nth-child(3) { transition-delay: 0.25s; }
        .reveal:nth-child(4) { transition-delay: 0.35s; }
        .reveal:nth-child(5) { transition-delay: 0.45s; }
        .reveal:nth-child(6) { transition-delay: 0.55s; }

        .hide-scrollbar {
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 768px) {
          .nav-dots,
          .keyboard-hint {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal {
            transition: opacity 0.3s ease;
            transform: none;
          }
          html {
            scroll-snap-type: none;
            scroll-behavior: auto;
          }
        }

        @media print {
          html {
            scroll-snap-type: none !important;
            scroll-behavior: auto !important;
          }
          .nav-dots,
          .keyboard-hint {
            display: none !important;
          }
          .pitch-slide {
            page-break-after: always;
            page-break-inside: avoid;
            min-height: auto !important;
            padding: 40px 48px !important;
          }
          .pitch-slide:last-child {
            page-break-after: auto;
          }
          .reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .reveal-visible {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
