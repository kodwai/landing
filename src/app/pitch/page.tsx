"use client";

import PitchDeckShell, { SlideData } from "@/components/pitchDeck";

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
          bio: "5 years building scalable backend systems and AI products. Leads product across the full stack: CLI, web app, API, and the AI scoring pipeline.",
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
            { src: "/logos/team/icon-with-name-original.webp", alt: "BrandVox AI", h: 22 },
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

export default function PitchDeck() {
  return <PitchDeckShell slides={SLIDES} />;
}
