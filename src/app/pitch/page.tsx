"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import posthog from "posthog-js";

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
   SLIDE DATA — Dual-track product & vision deck
   =========================================== */
interface SlideData {
  id: string;
  type: string;
  dark?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

/*
 * NARRATIVE: a product + vision deck (not a fundraise) in two acts.
 * ACT I, the DEVELOPER platform (free): wedge, two-platform overview,
 *   the developer problem (AI broke the interview), the gap, the free
 *   arena, the flow, the AI Collaboration Score.
 * ACT II, the BUSINESS platform (paid): the bridge, the hiring product,
 *   free-audience-to-revenue, business model, market, why-now, what is
 *   built, the path, team, competition, moat, close.
 *
 * GROUND RULES (honest + defensible):
 * - No fundraise: ask / use-of-funds slides removed.
 * - No vanity traction: developers are "live and challenging now", no counts.
 * - Product facts match the shipped product: 3-axis score (Direction /
 *   Outcome / Lift, 11 signals), npx @kodwai/cli challenge <slug>.
 * - Leaderboard framed as a built mechanism awaiting audience (seeded today).
 * - Tighter, sourced market sizing with a visible assumption chain.
 * - Competitive moat led by community + dataset; capture claim hedged.
 * - Forward metrics labeled target / modeled; billing is a future milestone.
 */
const SLIDES: SlideData[] = [

  /* ════════ ACT I: THE DEVELOPER PLATFORM (free, the audience) ════════ */

  /* ── 1. TITLE ── */
  {
    id: "title",
    type: "title",
    content: {
      overline: "Product & Vision · 2026",
      title: "kodwai",
      subtitle: "Where developers prove how they work with AI agents, and companies hire for it.",
      stats: [
        { value: "Live", label: "In production" },
        { value: "Free", label: "For developers" },
        { value: "Built", label: "CLI, Web, API" },
      ],
    },
  },

  /* ── 2. WEDGE ── */
  {
    id: "wedge",
    type: "bigquote",
    content: {
      quote: "Every company now expects engineers\nto ship with AI agents.\nNo platform measures that skill,\nlet alone teaches it.",
      attribution: "This is the wedge.",
    },
  },

  /* ── 3. TWO PLATFORMS, ONE SKILL ── */
  {
    id: "platforms",
    type: "platforms",
    content: {
      overline: "Two platforms. One skill.",
      left: {
        tag: "Developer Platform · Free",
        desc: "Solve real, ticket-sized challenges with Claude Code, Cursor, or Codex, on your own machine. Get scored on how well you direct it. Climb a public leaderboard.",
        points: [
          "Free for every developer, forever",
          "The audience and the data moat",
          "The top of the funnel",
        ],
      },
      right: {
        tag: "Business Platform · Paid",
        desc: "Interview on deeper, role-specific challenges, or author your own. Watch the real process, not just the answer, then score and compare candidates.",
        points: [
          "Sold to hiring teams and companies",
          "Where the revenue comes from",
          "Funded by the audience above",
        ],
      },
      note: "Free developers build the audience and the dataset. That becomes the moat behind the paid hiring product.",
    },
  },

  /* ── 4. THE DEVELOPER PROBLEM ── */
  {
    id: "problem",
    type: "problem-numbers",
    dark: true,
    content: {
      overline: "The Developer Problem",
      items: [
        { value: "81%", label: "of Big Tech interviewers suspect AI cheating", sub: "31% have caught a candidate. The legacy LeetCode interview no longer signals skill. (interviewing.io, 2025)" },
        { value: "84%", label: "of developers use or plan to use AI tools", sub: "51% use them every day. Directing an agent has become the job. (Stack Overflow survey, 2025)" },
        { value: "29%", label: "of developers trust AI output accuracy", sub: "The scarce, hireable skill is the human judgment to verify and steer agents. (Stack Overflow, 2025)" },
      ],
    },
  },

  /* ── 5. THE GAP ── */
  {
    id: "before-after",
    type: "before-after",
    content: {
      overline: "The Gap",
      before: {
        label: "How skill is tested today",
        items: [
          "Browser IDE, algorithm puzzles",
          "AI banned, or treated as cheating",
          "Memorization under a webcam",
          "A pass or fail with no context",
          "Detached from real engineering",
        ],
      },
      after: {
        label: "How engineers actually work",
        items: [
          "Own terminal, real projects",
          "A real agent: Claude Code, Cursor, Codex",
          "Ship by directing the agent well",
          "Decompose, verify, recover, judge",
          "The exact skill Kodwai measures",
        ],
      },
    },
  },

  /* ── 6. THE DEVELOPER PLATFORM (solution) ── */
  {
    id: "solution",
    type: "hero-statement",
    content: {
      overline: "The Developer Platform, Free and Live",
      logo: "kodwai",
      tagline: "Pick a challenge, solve it on your own machine with Claude Code, Cursor, or Codex, and submit the session. Kodwai captures every prompt, tool call, and decision, then scores how well you directed the agent. Climb a public leaderboard and build a profile that shows how you engineer, not what you memorized. Fully free.",
      proof: [
        { icon: "⚡", text: "npx @kodwai/cli challenge <slug> : one command, in your terminal" },
        { icon: "🎯", text: "AI Collaboration Score: Direction, Outcome, Lift across 11 signals" },
        { icon: "🏆", text: "Public leaderboard and a shareable developer profile" },
        { icon: "∞", text: "Free for every developer. Bring Claude Code, Cursor, or Codex and your own machine." },
      ],
    },
  },

  /* ── 7. THE DEVELOPER FLOW ── */
  {
    id: "how",
    type: "flow",
    content: {
      overline: "How It Works, Live Today",
      title: "Three steps. One hour. Complete signal.",
      steps: [
        {
          number: "01",
          title: "Pick a challenge",
          desc: "Browse real, ticket-sized problems across nine categories. Filter by difficulty and pick one that looks like the work you actually do.",
          time: "Curated catalog",
        },
        {
          number: "02",
          title: "Run the CLI",
          desc: "Start it in your terminal and choose Claude Code, Cursor, or Codex. Kodwai pulls the problem, starter files, and tests, initializes git, and starts the timer. You solve it for real.",
          time: "Your machine",
        },
        {
          number: "03",
          title: "Get your score",
          desc: "On submit, Kodwai reads your transcript, code, tests, and git history, then returns Direction, Outcome, and Lift with per-signal evidence. Then you are on the leaderboard.",
          time: "Instant scoring",
        },
      ],
    },
  },

  /* ── 8. THE AI COLLABORATION SCORE ── */
  {
    id: "scorecard",
    type: "scorecard",
    dark: true,
    content: {
      overline: "The AI Collaboration Score",
      title: "Dual scoring. Full context. Comparable data.",
      dimensions: [
        { name: "Direction · 6 signals · 50 pts", score: 88 },
        { name: "Outcome · 3 signals · 35 pts", score: 92 },
        { name: "Lift · 2 signals · 15 pts", score: 74 },
      ],
      meta: "11 signals across three axes. Algorithmic where it can be (tests, code quality, complexity), LLM-judged where it must be (spec precision, verification, decomposition, recovery). Per-signal evidence, exportable.",
      overall: "86",
    },
  },

  /* ════════ ACT II: THE BUSINESS PLATFORM (paid, the revenue) ════════ */

  /* ── 9. THE BRIDGE ── */
  {
    id: "bridge",
    type: "bigquote",
    dark: true,
    content: {
      quote: "The skill the free platform measures\nis the skill companies are desperate\nto hire for.\nSo we sell it to them.",
      attribution: "Act II: the business.",
    },
  },

  /* ── 10. THE HIRING PRODUCT ── */
  {
    id: "hiring",
    type: "hero-statement",
    content: {
      overline: "The Business Platform, Built Today",
      logo: "Hiring, measured.",
      tagline: "Interview on deeper, role-specific challenges, or author your own with a custom rubric and time limit. Invite a candidate, they solve on their own machine with Claude Code or Cursor, and you watch the real process live: the prompts, the commits, the tests, the score. Not just the final answer.",
      proof: [
        { icon: "🧩", text: "Deeper, role-specific challenges, or author your own with a custom rubric" },
        { icon: "🖥️", text: "Live observer dashboard: transcript, file diffs, tool feed, timer, cost" },
        { icon: "⚖️", text: "Dual scoring: AI scorecard plus manual reviewer, side by side" },
        { icon: "🔐", text: "Candidate comparison, team roles, AES-256 keys, HMAC-signed events" },
      ],
    },
  },

  /* ── 13. MARKET OPPORTUNITY ── */
  {
    id: "market",
    type: "market",
    content: {
      overline: "Market Opportunity",
      title: "Large market. Unoccupied segment.",
      tiers: [
        { label: "TAM", value: "~$1.4B", desc: "Coding and technical assessment software, 2024 (DataIntelo, Verified Market Reports)", size: 100 },
        { label: "SAM", value: "$280-420M", desc: "AI-native assessment: the 20-30% of teams measuring agent skill (Kodwai estimate)", size: 60 },
        { label: "SOM", value: "$3-8M", desc: "Year 2-3 ARR: 150-400 paying teams at $15-25K ACV (target)", size: 30 },
      ],
      growth: "~12-15% CAGR toward ~$3-4.5B by 2030. Funnel: 36.5M professional developers (SlashData, 2025).",
    },
  },

  /* ── 15. WHY NOW ── */
  {
    id: "why-now",
    type: "validation",
    content: {
      overline: "Why Now",
      title: "The market is moving our way.",
      signals: [
        { event: "Meta ships an AI-enabled coding interview", date: "Oct 2025", detail: "Framed as more representative of the environment its future employees will work in. The biggest employer concedes the premise. (Hello Interview)" },
        { event: "AI broke the legacy interview", date: "2025", detail: "Cluely raised on 'cheat on everything'; verbatim LeetCode is trivial for AI. Fresh, reasoning-forcing work is the only durable signal. (interviewing.io)" },
        { event: "Autonomous coding agents went mainstream", date: "2025-26", detail: "Claude Code at a ~$2.5B run rate, authoring ~4% of public GitHub commits; Cursor past $2B ARR. Directing agents is the job. (SemiAnalysis)" },
        { event: "Incumbents validated the category, stayed in the browser", date: "2025-26", detail: "CodeSignal and HackerRank shipped agentic assessments, but none paired it with a free, terminal-native developer community." },
      ],
    },
  },

  /* ── 14. BUSINESS MODEL ── */
  {
    id: "business",
    type: "business",
    content: {
      overline: "Business Model",
      title: "Free for developers. Recurring for companies.",
      columns: [
        {
          title: "Developer · the funnel",
          items: [
            { label: "Developer", value: "Free", desc: "Challenges, score, leaderboard, profile. Forever." },
            { label: "Developer Pro", value: "Future", desc: "Company-tagged question banks (asked at Amazon, Google, Meta), prep, analytics. The LeetCode Premium model." },
          ],
        },
        {
          title: "Business · the revenue",
          items: [
            { label: "Starter", value: "$60/mo", desc: "5 seats, 50 sessions. Planned." },
            { label: "Growth", value: "$200/mo", desc: "25 seats, unlimited. The expansion tier. Planned." },
            { label: "Enterprise", value: "Custom", desc: "SSO, compliance, SLA. Planned." },
            { label: "Economics", value: "~85-90%", desc: "Target gross margin. Companies bring their own API key, so LLM cost to Kodwai is $0. Modeled." },
          ],
        },
      ],
    },
  },

  /* ── 11. FROM FREE AUDIENCE TO REVENUE ── */
  {
    id: "buyer-roi",
    type: "roi-grid",
    content: {
      overline: "From Free Audience to Revenue",
      title: "Free developers. Paid companies.",
      cards: [
        {
          metric: "Brand",
          label: "and outbound",
          detail: "A trusted, free developer audience gives us reach and credibility. We sell the hiring product to the companies those developers already work at.",
          comparison: "Audience first, then enterprise sales",
        },
        {
          metric: "Talent",
          label: "and sourcing",
          detail: "The leaderboard surfaces developers who provably direct agents well. That becomes a vetted talent signal companies pay to access.",
          comparison: "Proof of skill becomes a sourcing funnel",
        },
        {
          metric: "Hand-off",
          label: "to assessments",
          detail: "Developers who practice for free get funneled into employer-run interviews on the same engine. The proven LeetCode and HackerRank playbook.",
          comparison: "Practice today, get hired tomorrow",
        },
        {
          metric: "Bottom-up",
          label: "adoption",
          detail: "Individual engineers and teams adopt Kodwai, then expand into org-wide paid hiring. The buyer, the company, differs from the free user.",
          comparison: "Land with a developer, expand to the org",
        },
      ],
    },
  },

  /* ── 17. WHAT'S BUILT ── */
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
          tech: "@kodwai/cli on npm · Claude Code Agent SDK",
          features: [
            "npx @kodwai/cli challenge <slug>: one-command launch",
            "Captures every prompt, tool call, and file edit via hooks",
            "Real-time file and transcript watchers",
            "HMAC-SHA256 signed event streaming",
            "Auto-installs Claude Code, timer, auto-submit",
          ],
        },
        {
          name: "Web",
          tech: "Next.js 16 · React 19 · Tailwind 4",
          features: [
            "Developer: challenges, leaderboard, profiles, badges",
            "Hiring: projects, rubric builder, tool constraints",
            "Live observer: transcript, diffs, tool feed, timer",
            "Dual scoring and multi-candidate comparison",
            "Team management with role-based access",
          ],
        },
        {
          name: "API",
          tech: "FastAPI · Turso (libSQL) · Claude API",
          features: [
            "AI Collaboration Score: 3 axes, 11 signals",
            "Full session lifecycle with HMAC webhooks",
            "AES-256-GCM encrypted keys, JWT auth",
            "Per-session cost tracking via proxy",
            "Transactional email via Resend",
          ],
        },
      ],
    },
  },

  /* ── 19. THE PATH ── */
  {
    id: "roadmap",
    type: "traction",
    dark: true,
    content: {
      overline: "The Path",
      stats: [
        { value: "Now", label: "Free developer platform, live" },
        { value: "Next", label: "Grow the community and dataset" },
        { value: "Then", label: "B2B hiring revenue" },
      ],
      milestones: [
        { label: "Live", text: "Developers are taking on challenges and getting scored right now, in production" },
        { label: "Near term", text: "Grow the free developer community and the agent-collaboration dataset" },
        { label: "Then", text: "Monetize the business platform: agent-native interviews sold to companies" },
        { label: "Later", text: "Developer Pro: company-tagged question banks and prep, the LeetCode Premium model" },
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
          bio: "6 years building scalable backend systems and AI products. Leads product across the full stack: CLI, web app, API, and the AI scoring pipeline.",
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
      hiring: "A two-person team that shipped the CLI, web app, API, and scoring engine before taking a dollar.",
    },
  },

  /* ── 18. COMPETITION ── */
  {
    id: "competitive",
    type: "competitive",
    content: {
      overline: "Competition",
      title: "Incumbents can't do this yet.",
      competitors: [
        { name: "HackerRank", note: "$221M rev · 26M devs", ownTerminal: false, community: true, agentNative: false },
        { name: "CodeSignal", note: "~$90M raised", ownTerminal: false, community: false, agentNative: true },
        { name: "CoderPad", note: "~$18M rev", ownTerminal: false, community: false, agentNative: false },
        { name: "Codility", note: "12M+ assessments", ownTerminal: false, community: false, agentNative: false },
        { name: "LeetCode", note: "26M visitors", ownTerminal: false, community: true, agentNative: false },
      ],
      kodwai: { ownTerminal: true, community: true, agentNative: true },
      insight: "Incumbents capture AI inside their own browser sandbox, and the ones with a community built it for puzzle prep. None pair a real agent in the developer's own terminal with a free developer-led community and hiring monetization. To our knowledge, as of mid-2026, that intersection is empty.",
      footnote: "Funding and revenue figures are public reporting, 2024 to 2026.",
    },
  },

  /* ── 16. MOAT ── */
  {
    id: "moat",
    type: "bigquote",
    dark: true,
    content: {
      quote: "The Agent SDK is public.\nThe moat is the community and the dataset:\nreal, labeled agent-collaboration data\nthat no incumbent can buy.",
      attribution: "Category ownership, won in a 12 to 18 month window.",
    },
  },

  /* ── 20. CLOSE ── */
  {
    id: "cta",
    type: "cta",
    content: {
      subtitle: "Developers prove how they build. Companies hire who can. One platform, one skill, the new standard for the AI-coding era.",
      contact: "hakan@kodwai.com",
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

    case "platforms":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 28, color: fg }}>
              Developer-first. <span style={{ color: T.accent, fontStyle: "italic" }}>Business-funded.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[c.left, c.right].map((col: { tag: string; desc: string; points: string[] }, i: number) => (
                <div key={i} className="reveal" style={{
                  padding: "24px 28px", borderRadius: 8,
                  border: i === 0 ? `1px solid ${borderColor}` : `2px solid ${T.accent}`,
                  background: i === 0 ? `${T.text}04` : "transparent",
                }}>
                  <p style={{ fontFamily: T.fontMono, fontSize: 10, color: i === 0 ? mutedColor : T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                    {col.tag}
                  </p>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 15, color: fg, lineHeight: 1.6, marginBottom: 16 }}>
                    {col.desc}
                  </p>
                  {col.points.map((p: string, j: number) => (
                    <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ color: T.accent, fontSize: 11, fontFamily: T.fontMono, marginTop: 3 }}>{i === 0 ? "→" : "◆"}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="reveal" style={{ marginTop: 20, padding: "14px 18px", background: `${T.accent}10`, borderRadius: 6, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1, flexShrink: 0 }}>FLYWHEEL</span>
              <span style={{ fontFamily: T.fontDisplay, fontSize: 14, color: fg, lineHeight: 1.5 }}>{c.note}</span>
            </div>
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
              Free developers. <span style={{ color: T.accent, fontStyle: "italic" }}>Paid companies.</span>
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
                    {["", "Own-terminal agent", "Free dev community", "Agent-skill native"].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 0 ? "left" : "center", padding: "10px 14px",
                        borderBottom: `2px solid ${fg}`, borderTop: `2px solid ${fg}`,
                        fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: mutedColor,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.competitors.map((comp: { name: string; note: string; ownTerminal: boolean; community: boolean; agentNative: boolean }, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, fontWeight: 600, color: fg }}>
                        {comp.name} <span style={{ fontWeight: 400, color: mutedColor, fontSize: 10 }}>{comp.note}</span>
                      </td>
                      {[comp.ownTerminal, comp.community, comp.agentNative].map((v, j) => (
                        <td key={j} style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, textAlign: "center", color: v ? fg : `${mutedColor}66` }}>
                          {v ? "✓" : "✗"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: T.accent }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#fff" }}>kodwai</td>
                    {[c.kodwai.ownTerminal, c.kodwai.community, c.kodwai.agentNative].map((v: boolean, j: number) => (
                      <td key={j} style={{ padding: "10px 14px", textAlign: "center", color: "#fff", fontWeight: 700 }}>{v ? "✓" : "✗"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 14, color: mutedColor, lineHeight: 1.6, marginTop: 20, fontStyle: "italic" }}>
              {c.insight}
            </p>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: `${mutedColor}aa`, letterSpacing: 0.5, marginTop: 12 }}>
              {c.footnote}
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

    case "cta":
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <h2 className="reveal" style={{
              fontFamily: T.fontDisplay, fontWeight: 400,
              fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 1.1,
              letterSpacing: "-2px", marginBottom: 24, whiteSpace: "pre-line", color: fg,
            }}>
              Where developers prove it,{"\n"}and companies <span style={{ color: T.accent, fontStyle: "italic" }}>hire</span> it.
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
            if (idx !== -1) {
              setCurrentSlide(idx);
              posthog.capture("pitch_deck_slide_viewed", { slide_id: SLIDES[idx]?.id, slide_index: idx });
            }
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
