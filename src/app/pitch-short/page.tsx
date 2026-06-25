"use client";

import PitchDeckShell, { SlideData } from "@/components/pitchDeck";

/*
 * SHORT PITCH DECK — 9 slides, for an investor who asked for a tighter deck.
 *
 * Structure follows the canonical short-deck arc (Sequoia / YC / Kawasaki):
 *   purpose -> problem -> solution(+model) -> magic -> paid product -> money
 *   -> market -> why-now/moat -> team/close. One idea per slide.
 *
 * Every slide REUSES a renderer + vetted content from the full /pitch deck, so
 * the facts stay sourced and each slide is guaranteed to fit the 794px PDF page.
 * What changed vs the full deck: the 20-slide deck is compressed to 9 by merging
 *   wedge -> problem, solution -> scorecard, competitive + moat -> why-now,
 *   close -> team, and cutting how / before-after / bridge / buyer-roi / roadmap.
 * Load-bearing facts the critics flagged are preserved: the price ladder + the
 *   ~85-90% margin / $0-LLM-cost mechanism (slide 6), the paid product as its own
 *   hero (slide 5), the dataset moat (slide 8), and the "live in production" proof.
 */
const SLIDES: SlideData[] = [

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
        { value: "Built", label: "CLI · Web · API" },
      ],
    },
  },

  /* ── 2. PROBLEM (the wedge, made tangible and sourced) ── */
  {
    id: "problem",
    type: "problem-numbers",
    dark: true,
    content: {
      overline: "The Wedge · Every company hires for AI-agent skill, and no platform measures it",
      items: [
        { value: "81%", label: "of Big Tech interviewers suspect AI cheating", sub: "31% have caught a candidate. The legacy LeetCode interview no longer signals skill. (interviewing.io, 2025)" },
        { value: "84%", label: "of developers use or plan to use AI tools", sub: "51% use them every day. Directing an agent has become the job. (Stack Overflow survey, 2025)" },
        { value: "29%", label: "of developers trust AI output accuracy", sub: "The scarce, hireable skill is the human judgment to verify and steer agents. (Stack Overflow, 2025)" },
      ],
    },
  },

  /* ── 3. TWO PLATFORMS, ONE SKILL (solution + business-model essence) ── */
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
          "Companies bring their own API key, so margins run ~85-90%",
        ],
      },
      note: "Free developers build the audience and the labeled dataset. We then sell the hiring product to the companies those developers already work at.",
    },
  },

  /* ── 4. THE AI COLLABORATION SCORE (the proprietary magic) ── */
  {
    id: "score",
    type: "scorecard",
    dark: true,
    content: {
      overline: "The AI Collaboration Score · Free, live, in production",
      dimensions: [
        { name: "Direction · 6 signals · 50 pts", score: 88 },
        { name: "Outcome · 3 signals · 35 pts", score: 92 },
        { name: "Lift · 2 signals · 15 pts", score: 74 },
      ],
      meta: "Solve via npx @kodwai/cli challenge <slug>, then 11 signals across three axes: algorithmic where it can be (tests, code quality, complexity), LLM-judged where it must be (spec precision, verification, decomposition, recovery). Per-signal evidence, exportable.",
      overall: "86",
    },
  },

  /* ── 5. THE HIRING PRODUCT (paid B2B hero — bespoke "observed candidate" renderer) ──
     Copy + product mock are hardcoded in the `hiring-observer` case in pitchDeck.tsx. */
  {
    id: "hiring",
    type: "hiring-observer",
    content: {},
  },

  /* ── 6. BUSINESS MODEL (bespoke "margin ledger" renderer) ──
     Copy + pricing-CLI mock are hardcoded in the `business-ledger` case in pitchDeck.tsx. */
  {
    id: "business",
    type: "business-ledger",
    content: {},
  },

  /* ── 7. MARKET (large market, empty quadrant) ── */
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
      growth: "~12-15% CAGR toward ~$3-4.5B by 2030. The agent-native, own-terminal, free-community quadrant is still empty (mid-2026).",
    },
  },

  /* ── 8. WHY NOW + THE MOAT (timing and defensibility) ── */
  {
    id: "why-now",
    type: "validation",
    content: {
      overline: "Why Now · And Why It Holds",
      title: "The market is moving our way.",
      signals: [
        { event: "Meta ships an AI-enabled coding interview", date: "Oct 2025", detail: "Framed as more representative of the environment its future employees will work in. The biggest employer concedes the premise. (Hello Interview)" },
        { event: "Autonomous coding agents went mainstream", date: "2025-26", detail: "Claude Code at a ~$2.5B run rate, authoring ~4% of public GitHub commits; Cursor past $2B ARR. Directing agents is the job. (SemiAnalysis)" },
        { event: "Incumbents validated the category, stayed in the browser", date: "Now", detail: "CodeSignal and HackerRank shipped agentic assessments, but none paired a real agent in the developer's own terminal with a free, terminal-native community. That intersection is empty." },
        { event: "The moat: a dataset no incumbent can buy", date: "Moat", detail: "The Agent SDK is public. The edge is the community and the real, labeled agent-collaboration data it produces. Category ownership, won in a 12-18 month window." },
      ],
    },
  },

  /* ── 9. TEAM & CLOSE ── */
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
      hiring: "Two people shipped the CLI, web app, API, and scoring engine, live in production, before taking a dollar.  Where developers prove it, companies hire it.  ·  hakan@kodwai.com  ·  kodwai.com",
    },
  },
];

export default function ShortPitchDeck() {
  return <PitchDeckShell slides={SLIDES} />;
}
