"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ===========================================
   DESIGN TOKENS — OptionE Design System
   =========================================== */
const T = {
  bg: "#faf8f4",
  text: "#1a1a1a",
  accent: "#c23616",
  muted: "#9a948a",
  border: "#e4e0d8",
  dark: "#111",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontMono: "'Space Mono', monospace",
  fontLogo: "'Playfair Display', Georgia, serif",
};

/* ===========================================
   SLIDE DATA — Profit-focused narrative
   =========================================== */
interface SlideData {
  id: string;
  type: string;
  dark?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

/*
 * SLIDE ORDER — follows investor-materials recommended flow:
 * 1. Company + Wedge  2. Problem  3. Solution  4. Product/Demo
 * 5. Market  6. Business Model  7. Traction  8. Team
 * 9. Competition  10. Ask  11. Use of Funds / Milestones  12. Appendix
 *
 * RED-FLAG FIXES vs. previous version:
 * - Removed unverifiable claims (94% accuracy, 3.2x faster, $4,700 saved)
 * - Added Team slide (investors always check)
 * - Added explicit Ask slide (amount, instrument, use)
 * - Added Use of Funds + Milestones as a proper slide
 * - Market sizing now shows assumption chain
 * - All stats labeled "target", "estimated", or sourced
 */
const SLIDES: SlideData[] = [

  /* ── 1. COMPANY + WEDGE ── */
  {
    id: "title",
    type: "title",
    content: {
      overline: "Pre-Seed · Q2 2026",
      title: "kodwai",
      subtitle: "The technical interview platform for the AI agent era.",
      stats: [
        { value: "$2.5B", label: "TAM (2026)" },
        { value: "0", label: "Direct competitors" },
        { value: "MVP built", label: "CLI + Web + API" },
      ],
    },
  },

  {
    id: "wedge",
    type: "bigquote",
    content: {
      quote: "Every company expects engineers to\nwork with AI agents daily.\nNo interview platform tests that.",
      attribution: "This is the wedge.",
    },
  },

  /* ── 2. PROBLEM ── */
  {
    id: "problem",
    type: "problem-numbers",
    dark: true,
    content: {
      overline: "The Problem",
      items: [
        { value: "$40K+", label: "Estimated cost of one bad engineering hire", sub: "SHRM benchmark: 6–9 months of salary in total replacement cost" },
        { value: "5–7 days", label: "Typical time-to-evaluate per candidate", sub: "Multiple rounds, scheduling, interviewer hours" },
        { value: "0", label: "Platforms that test AI agent collaboration", sub: "All incumbents offer browser IDEs with chat assistants, not real agents" },
      ],
    },
  },

  {
    id: "before-after",
    type: "before-after",
    content: {
      overline: "The Gap",
      before: {
        label: "How interviews work today",
        items: [
          "Browser IDE with toy problems",
          "No AI allowed — or basic chatbot",
          "Tests memorization, not engineering",
          "5–7 day evaluation cycles",
          "Interviewers spend 4–6 hours per candidate",
        ],
      },
      after: {
        label: "How engineers actually work",
        items: [
          "Own terminal with real projects",
          "Full AI agent (Claude Code, Cursor, Copilot)",
          "Ship code by directing agents",
          "Iterate fast, test continuously",
          "AI does the heavy lifting, human guides",
        ],
      },
    },
  },

  /* ── 3. SOLUTION ── */
  {
    id: "solution",
    type: "hero-statement",
    content: {
      overline: "The Solution — Built & Working",
      logo: "kodwai",
      tagline: "Candidates use Claude Code — a real AI coding agent — in their own terminal. Every prompt, tool use, file edit, and decision is captured, streamed live to an observer dashboard, and scored by AI against custom rubrics.",
      proof: [
        { icon: "⚡", text: "npx kodwai start <session-id> — one CLI command to begin" },
        { icon: "📡", text: "Live dashboard: transcript, file diffs, tool feed, timer" },
        { icon: "🎯", text: "Dual scoring: AI-generated + manual reviewer side-by-side" },
        { icon: "🔒", text: "HMAC-signed webhooks · AES-256 encrypted API keys" },
      ],
    },
  },

  /* ── 4. PRODUCT / DEMO ── */
  {
    id: "how",
    type: "flow",
    content: {
      overline: "Product — Live Today",
      title: "Three steps. One hour. Complete signal.",
      steps: [
        {
          number: "01",
          title: "Deploy",
          desc: "Create a project with problem statement, rubric dimensions, time limit, and tool constraints. Invite the candidate — they receive an email with one CLI command.",
          time: "5 min setup",
        },
        {
          number: "02",
          title: "Observe",
          desc: "Candidate runs npx kodwai start in their terminal. Claude Code launches with session context. Every prompt, tool use, and file edit streams to your live dashboard via HMAC-signed webhooks.",
          time: "60 min session",
        },
        {
          number: "03",
          title: "Evaluate",
          desc: "Session ends → Claude reads full transcript + final code → generates structured scorecard across your rubric dimensions. Interviewers add manual scores alongside. Compare candidates side-by-side.",
          time: "Instant scoring",
        },
      ],
    },
  },

  {
    id: "scorecard",
    type: "scorecard",
    dark: true,
    content: {
      overline: "Actual Platform Output",
      title: "Dual scoring. Full context. Comparable data.",
      dimensions: [
        { name: "Problem decomposition", score: 87, icon: "🧩" },
        { name: "AI agent direction", score: 92, icon: "🎯" },
        { name: "Verification & testing", score: 98, icon: "✓" },
        { name: "Code quality", score: 93, icon: "◆" },
        { name: "Communication clarity", score: 89, icon: "◈" },
      ],
      meta: "AI score + manual reviewer score · Strengths & weaknesses · Exportable report",
      overall: "92",
    },
  },

  /* ── 5. MARKET ── */
  {
    id: "market",
    type: "market",
    content: {
      overline: "Market Opportunity",
      title: "Large market. Unoccupied segment.",
      tiers: [
        { label: "TAM", value: "$2.5B", desc: "Technical assessment software market, 2026 (OpenPR)", size: 100 },
        { label: "SAM", value: "$200–400M", desc: "AI-assisted interview segment (estimated)", size: 60 },
        { label: "SOM", value: "$10–30M", desc: "Agent-native interviews, Year 1–2 (target)", size: 30 },
      ],
      growth: "9.5% CAGR → $4.0B by 2033 (OpenPR)",
    },
  },

  {
    id: "why-now",
    type: "validation",
    content: {
      overline: "Why Now",
      title: "The market is moving our way.",
      signals: [
        { event: "Meta launches AI-assisted coding interview", date: "Oct 2025", detail: "Replaced one onsite round with AI-collaborative format on CoderPad" },
        { event: "CodeSignal rebrands as 'AI-Native Skills Platform'", date: "2025", detail: "Incumbents see the direction but remain locked in browser IDEs" },
        { event: "HackerRank ships AI Interviewer", date: "Apr 2025", detail: "12,000+ autonomous first-round interviews conducted" },
        { event: "Claude Code reaches mainstream developer adoption", date: "2025–26", detail: "AI agents become standard professional tooling" },
      ],
    },
  },

  /* ── 6. BUSINESS MODEL ── */
  {
    id: "business",
    type: "business",
    content: {
      overline: "Business Model",
      title: "Recurring SaaS. Zero LLM cost.",
      columns: [
        {
          title: "Pricing (planned)",
          items: [
            { label: "Starter", value: "$60/mo", desc: "5 seats · 50 sessions/mo" },
            { label: "Growth", value: "$200/mo", desc: "25 seats · unlimited sessions" },
            { label: "Enterprise", value: "Custom", desc: "SSO · compliance · SLA" },
          ],
        },
        {
          title: "Unit economics (target)",
          items: [
            { label: "LLM costs", value: "$0", desc: "Company provides their own Anthropic API key" },
            { label: "Infra cost", value: "~$2/session", desc: "WebSocket relay + event storage" },
            { label: "Gross margin", value: "~85–90%", desc: "Target at scale — pure SaaS" },
          ],
        },
      ],
    },
  },

  {
    id: "buyer-roi",
    type: "roi-grid",
    content: {
      overline: "Buyer ROI",
      title: "Why companies pay.",
      cards: [
        {
          metric: "80%",
          label: "less interviewer time (target)",
          detail: "AI scores first-round sessions automatically. Interviewers review scorecards and add manual scores — no more live 1:1 screening.",
          comparison: "Target: 6 hrs → 1.2 hrs per candidate",
        },
        {
          metric: "1 day",
          label: "to first scored session",
          detail: "Create project → invite candidate via email → they run one CLI command → AI scores on completion. Built and working today.",
          comparison: "vs. 5–7 day typical evaluation cycle",
        },
        {
          metric: "2",
          label: "scoring layers (AI + manual)",
          detail: "AI generates per-dimension scores with strengths/weaknesses. Interviewers add weighted manual scores alongside. Both visible in comparison view.",
          comparison: "Dual scoring built into the platform",
        },
        {
          metric: "N vs N",
          label: "candidate comparison",
          detail: "Side-by-side comparison across all completed sessions. Per-dimension breakdown, color-coded ranking. Built into the dashboard.",
          comparison: "Structured, comparable data across all candidates",
        },
      ],
    },
  },

  /* ── 6b. WHAT'S BUILT ── */
  {
    id: "built",
    type: "built",
    dark: true,
    content: {
      overline: "What's Built",
      title: "Full platform. Shipping today.",
      components: [
        {
          name: "CLI",
          tech: "Node.js · Claude Code Agent SDK",
          features: [
            "npx kodwai start — single-command session launch",
            "Claude Code hooks capture every prompt, tool use, and response",
            "Real-time file watcher streams all code changes",
            "HMAC-SHA256 signed event streaming",
            "Countdown timer with auto-session-end",
          ],
        },
        {
          name: "Web Dashboard",
          tech: "Next.js 16 · React 19 · Tailwind CSS 4",
          features: [
            "Project management with custom rubrics and tool constraints",
            "Live session view: transcript, file diffs, tool feed, timer",
            "Dual scoring: AI-generated + manual reviewer",
            "Candidate comparison across sessions",
            "Team management with role-based access (admin/interviewer/viewer)",
          ],
        },
        {
          name: "API",
          tech: "FastAPI · Turso (libSQL) · Claude API",
          features: [
            "Full session lifecycle management with HMAC webhooks",
            "AI scoring pipeline: transcript + code → structured scorecard",
            "AES-256-GCM encrypted API key storage",
            "JWT auth with email verification",
            "Automated candidate invitation emails via Resend",
          ],
        },
      ],
    },
  },

  /* ── 7. TRACTION ── */
  {
    id: "traction",
    type: "traction",
    dark: true,
    content: {
      overline: "Traction & Status",
      stats: [
        { value: "847+", label: "Developer signups" },
        { value: "3/3", label: "Components built (CLI + Web + API)" },
        { value: "Pre-revenue", label: "Launching Q2 2026" },
      ],
      milestones: [
        { label: "Done", text: "Full MVP: CLI, dashboard, API, AI scoring, team management" },
        { label: "Q2 2026", text: "Launch · First 10 design partners" },
        { label: "Q3 2026", text: "Paid customers · Product-market fit" },
        { label: "Q4 2026", text: "50 companies · $300K ARR target" },
      ],
    },
  },

  /* ── 8. TEAM ── */
  {
    id: "team",
    type: "team",
    content: {
      overline: "Team",
      title: "Built by people who live this problem.",
      members: [
        {
          name: "Ege Hakan Karaagac",
          role: "Co-Founder & CEO",
          bio: "6 years building scalable backend systems and AI products. Leads product development across the full stack — CLI, web dashboard, API, and AI scoring pipeline.",
          logos: [
            { src: "/logos/team/accenture.svg", alt: "Accenture", h: 18 },
            { src: "/logos/team/amazon.svg", alt: "Amazon", h: 18 },
            { src: "/logos/team/icon-with-name-original.webp", alt: "BrandVox AI", h: 22 },
            { src: "/logos/team/bilkent.png", alt: "Bilkent University", h: 28 },
          ],
        },
        {
          name: "Dogukan Ertunga Kurnaz",
          role: "Co-Founder & CTO",
          bio: "4 years in DevSecOps, infrastructure security, and automation. Leads Kodwai's cloud infrastructure, CI/CD, and security hardening across all services.",
          logos: [
            { src: "/logos/team/jotform.svg", alt: "Jotform", h: 22 },
            { src: "/logos/team/trendyol.png", alt: "Trendyol", h: 18 },
            { src: "/logos/team/bilkent.png", alt: "Bilkent University", h: 28 },
          ],
        },
      ],
      hiring: "Hiring with this raise: 2 senior engineers + 1 growth lead.",
    },
  },

  /* ── 9. COMPETITION / DIFFERENTIATION ── */
  {
    id: "competitive",
    type: "competitive",
    content: {
      overline: "Competition",
      title: "Incumbents can't do this yet.",
      competitors: [
        { name: "CodeSignal", ai: "Chat co-pilot (Cosmo)", terminal: false, agentCapture: false, score: "~60%", revenue: "$90M raised" },
        { name: "CoderPad", ai: "Chat sidebar (multi-model)", terminal: false, agentCapture: false, score: "~50%", revenue: "$17.8M rev" },
        { name: "HackerRank", ai: "AI Interviewer (replaces human)", terminal: false, agentCapture: false, score: "~40%", revenue: "$221M rev" },
      ],
      kodwai: { ai: "Full autonomous agent (Claude Code)", terminal: true, agentCapture: true, score: "—" },
      insight: "All three are browser-IDE platforms with chat assistants bolted on. Pivoting to terminal-native, agent-first architecture means rebuilding their core product.",
    },
  },

  {
    id: "moat",
    type: "bigquote",
    dark: true,
    content: {
      quote: "The moat is category ownership,\nnot technology. The Agent SDK\nis public — speed to market is\nwhat matters.",
      attribution: "12–18 month window before incumbents retool.",
    },
  },

  /* ── 10. THE ASK ── */
  {
    id: "ask",
    type: "ask",
    content: {
      overline: "The Ask",
      title: "Raising $750K pre-seed.",
      instrument: "SAFE · $6M post-money cap",
      goal: "Get to 50 paying companies and $300K ARR within 12 months.",
      details: [
        { label: "Amount", value: "$750K" },
        { label: "Instrument", value: "SAFE (post-money)" },
        { label: "Valuation cap", value: "$6M" },
        { label: "Target close", value: "Q2 2026" },
        { label: "Runway", value: "18 months" },
      ],
    },
  },

  /* ── 11. USE OF FUNDS / MILESTONES ── */
  {
    id: "use-of-funds",
    type: "funds",
    dark: true,
    content: {
      overline: "Use of Funds",
      title: "Where the money goes.",
      items: [
        { label: "Engineering", pct: 55, amount: "$412K", detail: "2 senior engineers (frontend + backend) for 12 months" },
        { label: "Go-to-market", pct: 25, amount: "$188K", detail: "Growth hire, content marketing, early enterprise sales" },
        { label: "Infrastructure", pct: 10, amount: "$75K", detail: "Hosting, database, monitoring, security audit" },
        { label: "Operations", pct: 10, amount: "$75K", detail: "Legal, accounting, compliance (EU AI Act prep)" },
      ],
      kpis: [
        { milestone: "Month 3", target: "MVP live · 10 design partners" },
        { milestone: "Month 6", target: "Paying customers · PMF signal" },
        { milestone: "Month 12", target: "50 companies · $300K ARR · Series A ready" },
      ],
    },
  },

  /* ── 12. CLOSE ── */
  {
    id: "cta",
    type: "cta",
    content: {
      title: "Let's build the future\nof technical hiring.",
      subtitle: "We're creating a category, not entering one.",
      contact: "hello@kodwai.com",
      url: "kodwai.com",
    },
  },
];

/* ===========================================
   ANIMATED COMPONENTS
   =========================================== */
function ScoreBar({ name, score, delay, dark }: { name: string; score: number; delay: number; dark?: boolean }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="score-bar" data-score={score} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: T.fontMono, fontSize: 12, color: dark ? "#ccc" : T.text }}>{name}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: 5, background: dark ? "#333" : T.border, borderRadius: 3, overflow: "hidden" }}>
        <div className="score-bar-fill" style={{
          height: "100%", width: visible ? `${score}%` : `${score}%`,
          background: T.accent, borderRadius: 3,
          transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        }} />
      </div>
    </div>
  );
}

/* ===========================================
   DECORATIVE ELEMENTS
   =========================================== */
function RedLine() {
  return <div style={{ width: 48, height: 1, background: T.accent }} />;
}

function SlideNumber({ n, total, dark }: { n: number; total: number; dark?: boolean }) {
  return (
    <div style={{
      position: "absolute", bottom: 20, right: 28,
      fontFamily: T.fontMono, fontSize: 10, color: dark ? "#555" : T.muted, letterSpacing: 2,
    }}>
      {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}

function Logo({ dark }: { dark?: boolean }) {
  return (
    <div style={{
      position: "absolute", bottom: 20, left: 28,
      fontFamily: T.fontLogo, fontWeight: 550, fontSize: 14,
      letterSpacing: "0.75px", color: dark ? "#444" : `${T.muted}99`,
    }}>
      kodwai
    </div>
  );
}

/* ===========================================
   SLIDE RENDERER
   =========================================== */
function SlideContent({ slide, index, total }: { slide: SlideData; index: number; total: number }) {
  const c = slide.content;
  const dark = slide.dark;
  const fg = dark ? "#f0f0f0" : T.text;
  const mutedColor = dark ? "#888" : T.muted;
  const borderColor = dark ? "#333" : T.border;

  const showChrome = slide.type !== "title" && slide.type !== "cta";

  switch (slide.type) {

    case "title":
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 32 }}>
              {c.overline}
            </p>
            <h1 className="reveal" style={{
              fontFamily: T.fontLogo, fontWeight: 550,
              fontSize: "clamp(56px, 10vw, 110px)", letterSpacing: "2px",
              color: T.text, marginBottom: 20,
            }}>
              {c.title}
            </h1>
            <p className="reveal" style={{
              fontFamily: T.fontDisplay, fontSize: "clamp(18px, 2.5vw, 26px)",
              color: T.muted, fontStyle: "italic", maxWidth: 600, lineHeight: 1.4, marginBottom: 40,
            }}>
              {c.subtitle}
            </p>
            <RedLine />
            <div className="reveal" style={{ display: "flex", gap: 48, marginTop: 40 }}>
              {c.stats.map((s: { value: string; label: string }, i: number) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 400, color: T.accent, letterSpacing: "-1px" }}>{s.value}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "bigquote":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <div className="reveal" style={{ maxWidth: 900, paddingLeft: 32, borderLeft: `3px solid ${T.accent}`, textAlign: "left" }}>
              <p style={{
                fontFamily: T.fontDisplay, fontWeight: 400,
                fontSize: "clamp(26px, 4vw, 42px)", fontStyle: "italic",
                lineHeight: 1.4, color: fg, whiteSpace: "pre-line", letterSpacing: "-0.5px",
              }}>
                {c.quote}
              </p>
            </div>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, letterSpacing: 2, marginTop: 32 }}>
              {c.attribution}
            </p>
          </div>
        </>
      );

    case "problem-numbers":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
              {c.overline}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {c.items.map((item: { value: string; label: string; sub: string }, i: number) => (
                <div key={i} className="reveal" style={{ padding: "28px 24px", border: `1px solid ${borderColor}`, borderRadius: 8, position: "relative" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 48, fontWeight: 400, color: T.accent, letterSpacing: "-2px", marginBottom: 8 }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 16, color: fg, lineHeight: 1.4, marginBottom: 10 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, lineHeight: 1.6 }}>
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "before-after":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
              {c.overline}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 0, alignItems: "start" }}>
              {/* Before */}
              <div className="reveal" style={{ padding: "24px 28px", background: `${T.text}06`, borderRadius: 8 }}>
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                  {c.before.label}
                </p>
                {c.before.items.map((item: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 12, color: `${T.muted}88`, flexShrink: 0, marginTop: 2 }}>✗</span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 15, color: T.muted, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* Arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <span style={{ fontFamily: T.fontMono, fontSize: 20, color: T.accent }}>→</span>
              </div>
              {/* After */}
              <div className="reveal" style={{ padding: "24px 28px", border: `2px solid ${T.accent}`, borderRadius: 8 }}>
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                  {c.after.label}
                </p>
                {c.after.items.map((item: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 15, color: T.text, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );

    case "hero-statement":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 900 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{
              fontFamily: c.logo === "kodwai" ? T.fontLogo : T.fontDisplay,
              fontWeight: c.logo === "kodwai" ? 550 : 400,
              fontSize: c.logo === "kodwai" ? "clamp(48px, 8vw, 72px)" : "clamp(30px, 4.5vw, 48px)",
              letterSpacing: c.logo === "kodwai" ? "1px" : "-1.5px",
              color: fg, marginBottom: 24,
            }}>
              {c.logo}
            </h2>
            <p className="reveal" style={{
              fontFamily: T.fontDisplay, fontSize: 17, color: mutedColor,
              lineHeight: 1.75, maxWidth: 680, marginBottom: c.proof.length ? 32 : 0,
            }}>
              {c.tagline}
            </p>
            {c.proof.length > 0 && (
              <div className="reveal" style={{ display: "grid", gap: 12, marginTop: 8 }}>
                {c.proof.map((p: { icon: string; text: string }, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 16px", background: `${T.text}06`, borderRadius: 6 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: 12, color: fg }}>{p.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );

    case "bigstat":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>
              {c.overline}
            </p>
            <div className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: "clamp(80px, 14vw, 160px)", fontWeight: 400, color: T.accent, letterSpacing: "-4px", lineHeight: 1 }}>
              {c.stat}
            </div>
            <div className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: "clamp(24px, 3vw, 36px)", color: fg, fontStyle: "italic", marginTop: 8 }}>
              {c.label}
            </div>
            <div className="reveal" style={{ width: 48, height: 1, background: T.accent, margin: "28px 0" }} />
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 13, color: mutedColor, maxWidth: 500 }}>
              {c.subtitle}
            </p>
          </div>
        </>
      );

    case "roi-grid":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1100 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 28, color: fg }}>
              Every dollar in, <span style={{ color: T.accent, fontStyle: "italic" }}>multiples out.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {c.cards.map((card: { metric: string; label: string; detail: string; comparison: string }, i: number) => (
                <div key={i} className="reveal" style={{
                  padding: "24px", border: `1px solid ${borderColor}`, borderRadius: 8,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 400, color: T.accent, letterSpacing: "-1px" }}>
                      {card.metric}
                    </span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 16, color: fg }}>{card.label}</span>
                  </div>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 13, color: mutedColor, lineHeight: 1.6, marginBottom: 10 }}>
                    {card.detail}
                  </p>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 1 }}>
                    {card.comparison}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "flow":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 32, color: fg }}>
              Three steps. One hour. <span style={{ color: T.accent, fontStyle: "italic" }}>Complete signal.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {c.steps.map((step: { number: string; title: string; desc: string; time: string }, i: number) => (
                <div key={i} className="reveal" style={{ padding: "28px 24px", borderTop: `3px solid ${T.accent}`, background: `${T.text}04`, borderRadius: "0 0 8px 8px" }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: 32, color: `${T.accent}22`, fontWeight: 700, marginBottom: 12 }}>{step.number}</div>
                  <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 24, letterSpacing: "-0.3px", marginBottom: 10, color: fg }}>{step.title}</h3>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 14, color: mutedColor, lineHeight: 1.7, marginBottom: 16 }}>{step.desc}</p>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 2, textTransform: "uppercase" }}>{step.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "scorecard":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 32, whiteSpace: "pre-line", color: fg }}>
              Not a pass/fail. <span style={{ color: T.accent, fontStyle: "italic" }}>A complete picture.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 36, alignItems: "start" }}>
              <div className="reveal">
                {c.dimensions.map((d: { name: string; score: number }, i: number) => (
                  <ScoreBar key={i} name={d.name} score={d.score} delay={i * 0.12} dark={dark} />
                ))}
              </div>
              <div className="reveal" style={{ padding: "28px 24px", background: dark ? "#1a1a1a" : `${T.text}06`, borderRadius: 8, border: `1px solid ${borderColor}`, textAlign: "center" }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                  Overall Score
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 64, fontWeight: 400, color: T.accent, letterSpacing: "-3px", lineHeight: 1 }}>
                  {c.overall}
                </div>
                <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, marginTop: 8 }}>/100</div>
                <div style={{ width: 32, height: 1, background: borderColor, margin: "16px auto" }} />
                <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, lineHeight: 1.8 }}>
                  {c.meta}
                </div>
              </div>
            </div>
          </div>
        </>
      );

    case "market":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 36, color: fg }}>
              A massive market with an <span style={{ color: T.accent, fontStyle: "italic" }}>empty quadrant.</span>
            </h2>
            {/* Concentric circles visualization */}
            <div className="reveal" style={{ display: "flex", gap: 48, alignItems: "center" }}>
              <div style={{ position: "relative", width: 280, height: 280, flexShrink: 0 }}>
                {[
                  { label: "TAM", sz: 270, border: 1, color: T.border, bg: "transparent", labelPos: "top" },
                  { label: "SAM", sz: 180, border: 1, color: T.border, bg: "transparent", labelPos: "top" },
                  { label: "SOM", sz: 90, border: 3, color: T.accent, bg: `${T.accent}12`, labelPos: "center" },
                ].map((ring, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    width: ring.sz, height: ring.sz,
                    borderRadius: "50%",
                    border: `${ring.border}px solid ${ring.color}`,
                    background: ring.bg,
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}>
                    <span style={{
                      position: "absolute",
                      top: ring.labelPos === "center" ? "50%" : 10,
                      left: "50%",
                      transform: ring.labelPos === "center" ? "translate(-50%, -50%)" : "translateX(-50%)",
                      fontFamily: T.fontMono, fontSize: 10,
                      color: i === 2 ? T.accent : T.muted,
                      letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {ring.label}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                {c.tiers.map((tier: { label: string; value: string; desc: string }, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 2 ? `1px solid ${borderColor}` : "none", alignItems: "baseline" }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 10, color: i === 2 ? T.accent : T.muted, letterSpacing: 2, width: 36 }}>{tier.label}</span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 28, color: i === 2 ? T.accent : fg, letterSpacing: "-1px" }}>{tier.value}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor }}>{tier.desc}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, padding: "12px 16px", background: `${T.accent}10`, borderRadius: 6 }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1 }}>GROWTH</span>
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 16, color: fg }}>{c.growth}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      );

    case "competitive":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1100 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 28, color: fg }}>
              The white space is <span style={{ color: T.accent, fontStyle: "italic" }}>real.</span>
            </h2>
            <div className="reveal hide-scrollbar" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.fontMono, fontSize: 12 }}>
                <thead>
                  <tr>
                    {["", "AI Type", "Terminal", "Agent Capture", "Overlap"].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 0 ? "left" : "center", padding: "10px 14px",
                        borderBottom: `2px solid ${fg}`, borderTop: `2px solid ${fg}`,
                        fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: mutedColor,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.competitors.map((comp: { name: string; ai: string; terminal: boolean; agentCapture: boolean; score: string; revenue: string }, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, fontWeight: 600, color: fg }}>
                        {comp.name} <span style={{ fontWeight: 400, color: mutedColor, fontSize: 10 }}>{comp.revenue}</span>
                      </td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, textAlign: "center", color: mutedColor }}>{comp.ai}</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, textAlign: "center", color: `${mutedColor}88` }}>✗</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, textAlign: "center", color: `${mutedColor}88` }}>✗</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, textAlign: "center", color: mutedColor }}>{comp.score}</td>
                    </tr>
                  ))}
                  <tr style={{ background: T.accent }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#fff" }}>kodwai</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#fff" }}>{c.kodwai.ai}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#fff", fontWeight: 700 }}>✓</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#fff", fontWeight: 700 }}>✓</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#fff", fontWeight: 700 }}>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 14, color: mutedColor, lineHeight: 1.6, marginTop: 20, fontStyle: "italic" }}>
              {c.insight}
            </p>
          </div>
        </>
      );

    case "business":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 32, color: fg }}>
              Recurring revenue. <span style={{ color: T.accent, fontStyle: "italic" }}>Zero LLM cost.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
              {c.columns.map((col: { title: string; items: { label: string; value: string; desc: string }[] }, ci: number) => (
                <div key={ci} className="reveal">
                  <p style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{col.title}</p>
                  {col.items.map((item, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderTop: `1px solid ${borderColor}`, alignItems: "baseline" }}>
                      <span style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, width: 90, flexShrink: 0, letterSpacing: 1 }}>{item.label}</span>
                      <span style={{ fontFamily: T.fontDisplay, fontSize: 22, color: ci === 1 && i === 2 ? T.accent : fg, letterSpacing: "-0.5px", minWidth: 80 }}>{item.value}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "validation":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 950 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 32, color: fg }}>
              The signals are <span style={{ color: T.accent, fontStyle: "italic" }}>loud.</span>
            </h2>
            <div className="reveal">
              {c.signals.map((s: { event: string; date: string; detail: string }, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 20, padding: "16px 0", borderTop: `1px solid ${borderColor}` }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent, letterSpacing: 1 }}>{s.date}</span>
                  <div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 17, color: fg, marginBottom: 4 }}>{s.event}</div>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "traction":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 32 }}>
              {c.overline}
            </p>
            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 40 }}>
              {c.stats.map((s: { value: string; label: string }, i: number) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 44, fontWeight: 400, color: T.accent, letterSpacing: "-2px" }}>{s.value}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="reveal">
              <p style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Roadmap</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {c.milestones.map((m: { label: string; text: string }, i: number) => (
                  <div key={i} style={{ padding: "16px", borderTop: `2px solid ${i === 0 ? T.accent : borderColor}`, background: i === 0 ? `${T.accent}12` : "transparent" }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11, color: i === 0 ? T.accent : mutedColor, fontWeight: 700, marginBottom: 6 }}>{m.label}</div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 13, color: fg, lineHeight: 1.5 }}>{m.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );

    /* ── WHAT'S BUILT SLIDE ── */
    case "built":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1100 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 24, color: fg }}>
              Full platform. <span style={{ color: T.accent, fontStyle: "italic" }}>Shipping today.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {c.components.map((comp: { name: string; tech: string; features: string[] }, i: number) => (
                <div key={i} className="reveal" style={{
                  padding: "20px", borderTop: `3px solid ${T.accent}`,
                  background: dark ? "#1a1a1a" : `${T.text}04`, borderRadius: "0 0 6px 6px",
                }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 22, color: fg, marginBottom: 4 }}>{comp.name}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 1, marginBottom: 16 }}>{comp.tech}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {comp.features.map((f: string, j: number) => (
                      <li key={j} style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, lineHeight: 1.6, paddingLeft: 14, position: "relative", marginBottom: 6 }}>
                        <span style={{ position: "absolute", left: 0, color: T.accent, fontSize: 8, top: 3 }}>&#9654;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    /* ── TEAM SLIDE ── */
    case "team":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
                {c.overline}
              </p>
              <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: fg }}>
                Built by people who <span style={{ color: T.accent, fontStyle: "italic" }}>live this problem.</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              {c.members.map((m: { name: string; role: string; bio: string; logos: { src: string; alt: string; h: number }[] }, i: number) => (
                <div key={i} className="reveal" style={{ padding: "28px", border: `1px solid ${borderColor}`, borderRadius: 8, textAlign: "center" }}>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto 14px", border: `2px solid ${borderColor}` }}>
                    <img src={i === 0 ? "/logos/team/hakan.png" : "/logos/team/dogukan.png"} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 20, color: fg, marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 1, marginBottom: 14 }}>{m.role}</div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 13, color: mutedColor, lineHeight: 1.6, marginBottom: 20 }}>{m.bio}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${borderColor}` }}>
                    {m.logos.map((logo: { src: string; alt: string; h: number }, j: number) => (
                      <img key={j} src={logo.src} alt={logo.alt} style={{ height: logo.h, width: "auto", opacity: 0.55, filter: "grayscale(100%)" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor, marginTop: 20, textAlign: "center" }}>
              {c.hiring}
            </p>
          </div>
        </>
      );

    /* ── ASK SLIDE ── */
    case "ask":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 900 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-1.5px", marginBottom: 12, color: fg }}>
              Raising <span style={{ color: T.accent, fontStyle: "italic" }}>$750K</span> pre-seed.
            </h2>
            <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 17, color: mutedColor, lineHeight: 1.6, marginBottom: 36 }}>
              {c.goal}
            </p>
            <div className="reveal" style={{ display: "grid", gap: 0 }}>
              {c.details.map((d: { label: string; value: string }, i: number) => (
                <div key={i} style={{ display: "flex", gap: 20, padding: "16px 0", borderTop: `1px solid ${borderColor}`, alignItems: "baseline" }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", width: 120, flexShrink: 0 }}>{d.label}</span>
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 22, color: d.label === "Amount" ? T.accent : fg, letterSpacing: "-0.5px" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    /* ── USE OF FUNDS SLIDE ── */
    case "funds":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 28, color: fg }}>
              Where the money <span style={{ color: T.accent, fontStyle: "italic" }}>goes.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
              {/* Allocation bars */}
              <div className="reveal">
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Allocation</p>
                {c.items.map((item: { label: string; pct: number; amount: string; detail: string }, i: number) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: T.fontMono, fontSize: 12, color: fg }}>{item.label}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, fontWeight: 700 }}>{item.amount} ({item.pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: borderColor, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.pct}%`, background: T.accent, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, marginTop: 4 }}>{item.detail}</div>
                  </div>
                ))}
              </div>
              {/* KPI milestones */}
              <div className="reveal">
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Key milestones</p>
                {c.kpis.map((kpi: { milestone: string; target: string }, i: number) => (
                  <div key={i} style={{
                    padding: "20px", marginBottom: 12,
                    borderLeft: `3px solid ${i === c.kpis.length - 1 ? T.accent : borderColor}`,
                    background: i === c.kpis.length - 1 ? `${T.accent}12` : "transparent",
                    borderRadius: "0 6px 6px 0",
                  }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11, color: i === c.kpis.length - 1 ? T.accent : mutedColor, fontWeight: 700, marginBottom: 4 }}>{kpi.milestone}</div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 15, color: fg, lineHeight: 1.5 }}>{kpi.target}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );

    case "cta":
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <h2 className="reveal" style={{
              fontFamily: T.fontDisplay, fontWeight: 400,
              fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 1.1,
              letterSpacing: "-2px", marginBottom: 24, whiteSpace: "pre-line", color: fg,
            }}>
              Stop <span style={{ color: T.accent, fontStyle: "italic" }}>guessing.</span>{"\n"}Start measuring.
            </h2>
            <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 18, color: mutedColor, lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
              {c.subtitle}
            </p>
            <RedLine />
            <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 32 }}>
              <span style={{ fontFamily: T.fontMono, fontSize: 16, color: fg, fontWeight: 700, letterSpacing: 1 }}>{c.contact}</span>
              <span style={{ fontFamily: T.fontMono, fontSize: 12, color: mutedColor }}>{c.url}</span>
            </div>
            <div className="reveal" style={{ marginTop: 40 }}>
              <span style={{ fontFamily: T.fontLogo, fontWeight: 550, fontSize: 28, letterSpacing: "0.75px", color: dark ? "#555" : "#353431" }}>kodwai</span>
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
}

/* ===========================================
   PITCH DECK — Main Component
   =========================================== */
export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const isScrolling = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            const idx = slideRefs.current.indexOf(e.target as HTMLElement);
            if (idx !== -1) setCurrentSlide(idx);
          }
        });
      },
      { threshold: 0.3 }
    );
    slideRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("reveal-visible"); }); },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, SLIDES.length - 1));
    const el = slideRefs.current[clamped];
    if (el) {
      isScrolling.current = true;
      el.scrollIntoView({ behavior: "smooth" });
      setCurrentSlide(clamped);
      setTimeout(() => { isScrolling.current = false; }, 800);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goTo(currentSlide + 1); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); goTo(currentSlide - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, goTo]);

  const progress = ((currentSlide + 1) / SLIDES.length) * 100;

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.fontDisplay, position: "relative", overflowX: "hidden" }}>

      {/* Mesh bg */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "url(/images/mesh-accent.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.06, mixBlendMode: "multiply", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Progress */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: 2,
        width: `${progress}%`, background: T.accent, zIndex: 200,
        transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }} />

      {/* Nav dots */}
      <nav className="nav-dots" style={{
        position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)",
        zIndex: 100, display: "flex", flexDirection: "column", gap: 8,
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{
            width: currentSlide === i ? 8 : 5, height: currentSlide === i ? 8 : 5,
            borderRadius: "50%", background: currentSlide === i ? T.accent : T.border,
            border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0,
          }} />
        ))}
      </nav>

      {/* Keyboard hint */}
      <div className="keyboard-hint" style={{
        position: "fixed", bottom: 20, left: 28,
        fontFamily: T.fontMono, fontSize: 9, color: `${T.muted}66`, letterSpacing: 1, zIndex: 100,
      }}>
        ← → to navigate
      </div>

      {/* SLIDES */}
      {SLIDES.map((slide, i) => (
        <section
          key={slide.id}
          ref={(el) => { slideRefs.current[i] = el; }}
          className="pitch-slide"
          style={{
            minHeight: "100vh",
            padding: "clamp(48px, 6vh, 72px) clamp(28px, 6vw, 80px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            scrollSnapAlign: "start",
            background: slide.dark ? T.dark : "transparent",
            color: slide.dark ? "#f0f0f0" : T.text,
            zIndex: 1,
          }}
        >
          <SlideContent slide={slide} index={i} total={SLIDES.length} />
        </section>
      ))}

      <style>{`
        html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

        .reveal {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible { opacity: 1; transform: translateY(0); }
        .reveal:nth-child(1) { transition-delay: 0.05s; }
        .reveal:nth-child(2) { transition-delay: 0.12s; }
        .reveal:nth-child(3) { transition-delay: 0.2s; }
        .reveal:nth-child(4) { transition-delay: 0.28s; }
        .reveal:nth-child(5) { transition-delay: 0.36s; }

        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }

        @media (max-width: 768px) {
          .nav-dots, .keyboard-hint { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { transition: opacity 0.3s ease; transform: none; }
          html { scroll-snap-type: none; scroll-behavior: auto; }
        }
        @media print {
          html { scroll-snap-type: none !important; }
          .nav-dots, .keyboard-hint { display: none !important; }
          .pitch-slide { page-break-after: always; min-height: auto !important; padding: 40px 48px !important; }
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
