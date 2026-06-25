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
  "Solve real coding challenges on your own machine with your own AI agent, Claude Code, Cursor, or Codex. Kodwai scores how well you direct the agent, not what you memorized, and ranks you on a public leaderboard.";
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
  { n: "02", title: "Run the CLI", body: "Start it from your terminal and choose your agent. We download PROBLEM.md, starter files and tests, init a git repo, and start the timer.", chip: "npx @kodwai/cli challenge <slug>", tags: ["Claude Code", "Cursor", "Codex"] },
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
  { rank: 4, name: "Alex Mendez", handle: "@amendez", agent: "codex", score: 91 },
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
  { name: "Theo B.", handle: "@theob", role: "Backend Dev", agent: "codex", body: "Ran a challenge with Codex straight from my terminal. The Direction breakdown showed exactly where I over-trusted the agent and shipped too early." },
  { name: "Lena F.", handle: "@lenaf", role: "Senior SWE", agent: "aider", body: "The leaderboard is the first dev ranking I do not find embarrassing. It rewards judgment, not memorization." },
  { name: "Sam O.", handle: "@samo", role: "Eng Manager", agent: "claude-code", body: "We started screening with Kodwai. The transcript plus the score tells me in five minutes what a take-home told me in five days." },
  { name: "Ravi N.", handle: "@ravin", role: "Infra", agent: "cursor", body: "Watching how someone recovers when the agent goes confidently wrong is the most honest signal of seniority I have seen." },
];

/* ══════════════════════════════════════════════════════════════════════════
   HIRING TRACK  (B2B)  —  the /hiring page content.
   Single source of truth, kept HONEST against what is actually built:
   custom interview projects, one-link email invite, a live observation
   dashboard (real-time transcript, file diffs, tools, timer, cost), AI scoring
   against a CUSTOM per-role rubric (0-10 scale, with justification, strengths,
   weaknesses), manual team scores + comments, candidate compare, and team
   roles (admin / interviewer / viewer). We do NOT claim: ATS integrations,
   pricing, a template library, video/scrubber playback, a candidate web
   portal, scheduling, or analytics dashboards. House style: no em dashes.
   ══════════════════════════════════════════════════════════════════════════ */

/* The agents a candidate already lives in (real, transparent marks in
   /public/landing/logos). Used in the hero, trust strip, and closing band. */
export const HIRING_AGENTS = [
  { name: "Claude Code", src: "/landing/logos/claude.svg", srcLight: "/landing/logos/claude.svg" },
] as const;

/* "See exactly how candidates work" — the six real capabilities. */
export const HIRING_FEATURES = [
  {
    title: "Watch the session live",
    body: "Follow the prompts, commits, test runs, tools, time, and cost as the candidate works. Not a recording you wait for, the real session as it happens.",
  },
  {
    title: "Your problem, your rubric",
    body: "Author a ticket shaped like your codebase and define the dimensions you score on and how much each one weighs. The same engine, tuned to the role.",
  },
  {
    title: "A transparent AI score",
    body: "Every finished session is scored against your rubric, with a written justification, strengths, and weaknesses for each dimension. No black box.",
  },
  {
    title: "Score it yourself too",
    body: "Add your own scores and leave comments on the session. AI review and human review sit side by side, never one instead of the other.",
  },
  {
    title: "Compare candidates side by side",
    body: "Put everyone for a role on one board and read the rubric as a heatmap. The strongest and weakest dimensions jump out at a glance.",
  },
  {
    title: "Time, budget, and tools, controlled",
    body: "Set the clock, cap the API spend, and allow or block tools per interview. The same constraints for every candidate, so the comparison is fair.",
  },
];

/* The honest end-to-end interview flow (// from link to decision). */
export const HIRING_FLOW = [
  { n: "01", title: "Create the interview", body: "Write the problem, set a time limit and a budget, and define the rubric for the role. Save it once and reuse it for every candidate." },
  { n: "02", title: "Send one link", body: "Add a candidate by name and email. They get a link with a single command to start. No portal for them to set up, no account to provision." },
  { n: "03", title: "They solve locally", body: "The candidate works on their own machine, in Claude Code, on a real ticket. No browser sandbox, no artificial setup." },
  { n: "04", title: "Watch it happen", body: "Follow the session live or open it after. Every prompt, commit, test run, and tool call, in the order it happened." },
  { n: "05", title: "Score and compare", body: "Read the transparent score, add your own, leave comments for your team, and line the candidate up against the rest." },
];

/* Example CUSTOM rubric for the scorecard mock. Interview scores are 0-10 per
   dimension (NOT the public 0-100 Direction/Outcome/Lift). Weights are the
   team's own, shown here as an illustrative role rubric. */
export const HIRING_RUBRIC = [
  { name: "Problem decomposition", weight: 30, score: 8.5 },
  { name: "Direction and verification", weight: 30, score: 9.0 },
  { name: "Code quality", weight: 25, score: 8.0 },
  { name: "Recovery under failure", weight: 15, score: 7.5 },
];

/* A sample AI review for a finished session (mirrors the real scoring output:
   overall 0-10, per-dimension justification, strengths, weaknesses). */
export const HIRING_AI_REVIEW = {
  candidate: "Jamie Brooks",
  role: "Senior Backend Engineer",
  problem: "Sliding-window rate limiter",
  overall: 8.4,
  summary:
    "A methodical session. Scoped the ticket before touching code, drove the agent with tight, verifiable steps, and recovered cleanly when the first approach to the limiter leaked memory.",
  strengths: [
    "Wrote a failing test before each change",
    "Caught the agent's off-by-one in the window math",
    "Kept commits small and clearly labelled",
  ],
  weaknesses: [
    "Left clock-skew as an uncovered edge case",
    "Did not write down the final trade-off",
  ],
};

/* Candidate compare heatmap (illustrative). Scores 0-10 across the rubric. */
export const HIRING_COMPARE = {
  dims: ["Decompose", "Direction", "Quality", "Recovery"],
  candidates: [
    { name: "Jamie Brooks", handle: "@jamie", scores: [8.5, 9.0, 8.0, 7.5], overall: 8.4 },
    { name: "Sarah Chen", handle: "@schen", scores: [7.0, 7.5, 9.0, 6.5], overall: 7.5 },
    { name: "Kenji Tanaka", handle: "@ktanaka", scores: [6.0, 6.5, 7.0, 8.5], overall: 6.8 },
  ],
};

/* Honest editorial stats for the hiring proof band. */
export const HIRING_STATS = [
  { value: "1", suffix: " link", caption: "to invite a candidate. No portal for them to set up and no account to provision.", count: false as const },
  { value: 100, suffix: "%", caption: "local. They solve on their own machine, in Claude Code.", count: true as const },
  { value: "live", caption: "Watch the prompts, commits, tests, and cost as the session happens, not days later.", count: false as const },
  { value: 0, caption: "take-homes to grade at midnight. The session arrives scored, with the full replay.", count: false as const, display: "0" },
];

/* Hiring FAQ (honest). */
export const HIRING_FAQ = [
  { q: "How does a candidate take a Kodwai interview?", a: "You add them by name and email, and they get a link with one command to run. They solve the problem on their own machine in Claude Code, the agent they already know. There is no browser sandbox to fight and nothing to install beyond the CLI." },
  { q: "What can I see while they work?", a: "The full session, live: every prompt, the commits, the test runs, the tools used, the time elapsed, and the API cost. You can follow along in real time or open the session afterward and read it in the order it happened." },
  { q: "How are interviews scored?", a: "You define the rubric for the role, the dimensions, their weights, and what each one means. Every finished session is scored against that rubric with a written justification, strengths, and weaknesses per dimension. Your team can add manual scores and comments next to the AI score." },
  { q: "Can I use my own problem?", a: "Yes. Author the ticket so it looks like your real codebase, then set the time limit, the budget, and the tools the candidate may use. Reuse it for every candidate so the comparison stays fair." },
  { q: "Do you connect to my ATS?", a: "Not yet, and we will not pretend otherwise. There is nothing to wire up: you send a link and a scored session comes back. Share that session with your team with a link, and invite teammates as admins, interviewers, or viewers." },
  { q: "Is the hiring track free?", a: "Solving public challenges is free for developers. The hiring track is how we keep Kodwai sustainable. Reach out and we will get your team set up." },
];

/* ── ATS / stack the hiring track connects to (legacy, unused: no real ATS) ── */
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

/* ── Hiring footer (B2B, distinct from the developer footer) ── */
export const HIRING_FOOTER = {
  tagline: "interview the way engineers actually work",
  bottom: "built for teams hiring in the agent era",
  columns: [
    { head: "For hiring", links: [
      { label: "Set up interviews", href: "https://app.kodwai.com" },
      { label: "See the real work", href: "#how-candidates-work" },
      { label: "Transparent scoring", href: "#scoring" },
      { label: "Nothing to connect", href: "#connect" },
    ]},
    { head: "Product", links: [
      { label: "For developers", href: "/" },
      { label: "Browse challenges", href: "https://app.kodwai.com" },
      { label: "Blog", href: "/blog" },
    ]},
    { head: "Talk to us", links: [
      { label: "Email", href: "mailto:hakan@kodwai.com" },
      { label: "X", href: "https://x.com/kodwai_com" },
      { label: "Discord", href: "https://discord.gg/d663XRC7" },
    ]},
  ],
};

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
