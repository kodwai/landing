/* ══════════════════════════════════════════════════════════════════════════
   Canonical landing content. One source of truth for copy + data so the
   section components stay consistent. House style: no em dashes (use commas,
   colons, periods, or split the sentence). One rust accent word per headline.
   ══════════════════════════════════════════════════════════════════════════ */

import type { Challenge } from "./system";

/* ── Positioning ── */
export const CATEGORY_CLAIM =
  "The first platform where developers test their AI vibe coding skills.";
export const HERO_SUB =
  "Solve real coding challenges on your own machine with your own AI agent, Claude Code or Cursor. Kodwai scores how well you direct the agent, not what you memorized, and ranks you on a public leaderboard.";
export const TAGLINE = "measure real ai collaboration";

/* ── Used only if the live Turso fetch fails ── */
export const FALLBACK_CHALLENGES: Challenge[] = [
  { slug: "algorithm-rate-limiter", title: "Algorithm: Rate Limiter", description: "A sliding-window rate limiter that handles concurrent requests without leaking memory.", difficulty: "hard", category: "algorithms", minutes: 45 },
  { slug: "oauth-refresh-rotation", title: "OAuth with refresh rotation", description: "Authorization-code flow, PKCE, refresh-token rotation, and replay detection.", difficulty: "medium", category: "backend", minutes: 75 },
  { slug: "collaborative-cursor-sync", title: "Collaborative cursor sync", description: "CRDT-backed presence, conflict-free merges, and sub-50ms perceived latency.", difficulty: "hard", category: "frontend", minutes: 75 },
  { slug: "webhook-idempotency", title: "Idempotent webhook intake", description: "Dedup, retries with backoff, and exactly-once processing under burst load.", difficulty: "medium", category: "backend", minutes: 60 },
  { slug: "query-n-plus-one", title: "Kill the N+1", description: "Find and fix a hot path drowning in queries without changing the API surface.", difficulty: "easy", category: "databases", minutes: 40 },
  { slug: "flaky-test-quarantine", title: "Quarantine the flaky suite", description: "Diagnose nondeterminism, stabilize the suite, and gate it in CI.", difficulty: "medium", category: "testing", minutes: 55 },
];

/* ── The five-step flow (pick → scored) ── */
export const FLOW = [
  { n: "01", title: "Pick a challenge", body: "Browse real, ticket-sized problems across every category you actually ship in. Filter by difficulty and pick one that looks like the work you actually do.", chip: null as string | null, tags: null as string[] | null },
  { n: "02", title: "Run the CLI", body: "Start it from your terminal and choose your agent. We download PROBLEM.md, starter files and tests, init a git repo, and start the timer.", chip: "npx @kodwai/cli challenge <slug>", tags: ["Claude Code", "Cursor"] },
  { n: "03", title: "Solve on your machine", body: "Work the problem with your own agent in your own editor. No sandbox to fight, no artificial constraints, just how you really build.", chip: null, tags: null },
  { n: "04", title: "Submit", body: "One command packages your code, git history, test runs, agent transcript, and the time you took, then ships it for scoring.", chip: "npx @kodwai/cli submit", tags: null },
  { n: "05", title: "Get your score", body: "Direction, Outcome, and Lift land with per-signal evidence, so you can see why each axis scored the way it did. Then you are on the leaderboard.", chip: null, tags: null },
];

/* ── Scoring v2: Direction (50) · Outcome (35) · Lift (15) ── */
export const DIRECTION_DIMS = [
  { name: "Intent fidelity", pct: 96 },
  { name: "Verification rigor", pct: 92 },
  { name: "Spec precision", pct: 89 },
  { name: "Decomposition", pct: 86 },
  { name: "Recovery", pct: 84 },
  { name: "Engagement", pct: 90 },
];
export const OUTCOME_DIMS = [
  { name: "Tests passed", pct: 100 },
  { name: "Code quality", pct: 93 },
  { name: "Complexity", pct: 88 },
];
export const LIFT_DIMS = [
  { name: "Edge-case coverage", pct: 82 },
];

/* ── Leaderboard (illustrative) ── */
export const LEADERBOARD = [
  { rank: 1, name: "Jamie Brooks", handle: "@jamie", agent: "claude-code", score: 96 },
  { rank: 2, name: "Sarah Chen", handle: "@schen", agent: "claude-code", score: 94 },
  { rank: 3, name: "Kenji Tanaka", handle: "@ktanaka", agent: "cursor", score: 93 },
  { rank: 4, name: "Alex Mendez", handle: "@amendez", agent: "claude-code", score: 91 },
  { rank: 5, name: "Priya Rao", handle: "@priyar", agent: "claude-code", score: 90 },
];

/* ── Real achievement badges (public/badges/<slug>.png) ── */
export const BADGES = [
  { slug: "first-blood", name: "First Blood" },
  { slug: "five-down", name: "Five Down" },
  { slug: "ten-strong", name: "Ten Strong" },
  { slug: "quarter-century", name: "Quarter Century" },
  { slug: "streak-3", name: "On Fire" },
  { slug: "streak-7", name: "Week Warrior" },
  { slug: "streak-30", name: "Monthly Machine" },
  { slug: "top-10", name: "Top 10%" },
  { slug: "speed-demon", name: "Speed Demon" },
  { slug: "perfect-score", name: "Perfectionist" },
  { slug: "polyglot", name: "Polyglot" },
  { slug: "claude-master", name: "Claude Master" },
  { slug: "cursor-pro", name: "Cursor Pro" },
  { slug: "early-adopter", name: "Early Adopter" },
];

/* ── Agents you can bring ── */
export const AGENTS = ["Claude Code", "Cursor", "Codex CLI", "Aider", "Cline", "Windsurf", "Gemini CLI", "Continue"];

/* ── Editorial stats ── */
export const STATS = [
  { value: "1st", caption: "platform built to score how you drive AI agents, not what you memorized.", count: false as const },
  { value: 100, suffix: "%", caption: "local. Your machine, your agent, your editor. No sandbox to fight, no fake constraints.", count: true as const },
  { value: 0, prefix: "$", caption: "to play. Fully free, bring your own agent, keep your machine.", count: false as const, display: "$0" },
  { value: 3, suffix: "\u00a0axes", caption: "Direction, Outcome, and Lift, every signal citing its own evidence.", count: true as const },
];

/* ── Testimonial wall: "Coding agents are eating software" ── */
export const TESTIMONIALS = [
  { name: "Dani R.", handle: "@danir", role: "Staff Engineer", agent: "claude-code", body: "Finally something that measures the thing I actually do all day. Not inverting a binary tree, steering an agent through a real ticket." },
  { name: "Marcus L.", handle: "@mlcodes", role: "Senior SWE", agent: "cursor", body: "Ran a challenge on my lunch break, got a Direction breakdown that taught me more about my own prompting than any blog post." },
  { name: "Aisha K.", handle: "@aishak", role: "Full-stack", agent: "claude-code", body: "The score is brutal in the best way. It caught that I let the agent ship without checking the edge cases. It was right." },
  { name: "Tomás V.", handle: "@tomasv", role: "Backend Lead", agent: "claude-code", body: "I sent my profile to a hiring manager instead of doing a take-home. Got the call back the same day." },
  { name: "Priya R.", handle: "@priyar", role: "Platform Eng", agent: "cursor", body: "It runs on my machine with my setup. No sandbox to fight, no fake constraints. That alone makes it worth it." },
  { name: "Jonas W.", handle: "@jonasw", role: "Frontend", agent: "claude-code", body: "Climbed from 71 to 92 in a week by actually reading the evidence on each axis. It is a practice tool that happens to rank you." },
  { name: "Lena F.", handle: "@lenaf", role: "Senior SWE", agent: "aider", body: "The leaderboard is the first dev ranking I do not find embarrassing. It rewards judgment, not memorization." },
  { name: "Sam O.", handle: "@samo", role: "Eng Manager", agent: "claude-code", body: "We started screening with Kodwai. The transcript plus the score tells me in five minutes what a take-home told me in five days." },
  { name: "Ravi N.", handle: "@ravin", role: "Infra", agent: "cursor", body: "Watching how someone recovers when the agent goes confidently wrong is the most honest signal of seniority I have seen." },
];

/* ── Hiring track (B2B, secondary motion) ── */
export const HIRING_FEATURES = [
  { title: "Custom rubrics and time limits", body: "Weight the axes for the role and set the clock. The same engine, tuned to what you hire for." },
  { title: "Bring your own challenges", body: "Use the catalog or upload a problem shaped like your real codebase." },
  { title: "Replay the full session", body: "Prompts, commits, test runs, and the agent transcript, not just the final diff." },
  { title: "Shared review for your team", body: "Score, evidence, and replay in one link. Decide together, fast." },
];

/* ── ATS / stack the hiring track connects to ── */
export const INTEGRATIONS = [
  "Greenhouse", "Lever", "Ashby", "Workday", "GitHub", "GitLab", "Slack", "Linear",
];

/* ── FAQ ── */
export const FAQ = [
  { q: "What is vibe coding, and how do you score it?", a: "Vibe coding is building real software by directing an AI agent instead of typing every line yourself. Kodwai scores the session across three axes: Direction (how you steer, verify, and decompose), Outcome (what actually shipped and whether it passes), and Lift (the edge cases a one-shot prompt misses). Every signal cites its own evidence from your transcript, commits, and test runs." },
  { q: "Which agents and languages are supported?", a: "Bring your own agent. Claude Code and Cursor are first-class, and anything you run in your terminal works, including Codex CLI, Aider, Cline, and more. Challenges span every mainstream category and most mainstream languages, since you solve on your machine with your own setup." },
  { q: "Do I solve challenges locally or in a sandbox?", a: "Locally, always. The CLI downloads the problem, starter files, and tests, inits a git repo, and starts the timer. You work in your own editor with your own agent. There is no browser sandbox to fight and no artificial constraints." },
  { q: "Is it really free?", a: "Yes. Solving challenges, your score, your profile, and the leaderboard are free for developers. The hiring track is the paid product, for teams running interviews." },
  { q: "How can a score be fair if a one-shot prompt passes the tests?", a: "Passing tests is necessary but not sufficient. The score is dominated by Direction, the part a careless prompt cannot fake. A solution that clears tests with no steering, no verification, and no decomposition scores poorly on the axis that matters most." },
  { q: "What does the public profile show?", a: "Your score, your rank, the badges you have earned, and the agents you drive, at kodwai.com/developers/you. It is built to send to anyone, including a hiring manager instead of a take-home." },
];

/* ── Footer ── */
export const FOOTER = {
  tagline: "measure real ai collaboration",
  columns: [
    { head: "Platform", links: [
      { label: "Start a challenge", href: "https://app.kodwai.com" },
      { label: "How it works", href: "#how" },
      { label: "The score", href: "#score" },
      { label: "Leaderboard", href: "https://app.kodwai.com" },
    ]},
    { head: "Resources", links: [
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "/blog" },
    ]},
    { head: "Follow", links: [
      { label: "X", href: "https://x.com/kodwai_com" },
      { label: "Discord", href: "https://discord.gg/d663XRC7" },
      { label: "Email", href: "mailto:hakan@kodwai.com" },
    ]},
  ],
};
