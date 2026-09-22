/* ══════════════════════════════════════════════════════════════════════════
   Honest comparison pages (/compare/<slug>). One source of truth for the
   copy, the difference table, the "choose them if" lists, and the sources.

   House rules (kodwai-context competitors.md, content-studio page-patterns):
   - Every statement about a competitor comes from its own site, an official
     announcement, or a neutral reference, read on LAST_REVIEWED, and cites a
     source id below. No ratings, no prices, no numbers we did not read.
   - Every page says where the competitor is the better choice.
   - No "first", "only" or "best" claims for kodwai. No em dashes.
   - Re-check every source before changing LAST_REVIEWED. A date-only bump is
     not a review.

   Sources read on 2026-09-22 (what each one supports):
   - wiki-leetcode  https://en.wikipedia.org/wiki/LeetCode
       "an online platform for software coding interview preparation" with
       "algorithmic problems"; thousands of questions across easy, medium,
       hard (January 2026); weekly and biweekly contests; daily challenges;
       mock interviews and online assessments; free and premium access, with
       premium adding questions previously used in interviews at large tech
       companies; solutions "evaluated based on execution speed and memory
       usage, and ... ranked against other submissions". leetcode.com itself
       returned 403 to our reader that day, hence the neutral reference.
   - hellointerview-meta  https://www.hellointerview.com/blog/meta-ai-enabled-coding
       "In October 2025, Meta started rolling out a new interview type called
       AI-enabled coding", run in CoderPad with an AI assistant panel.
   - hr-home  https://www.hackerrank.com/
       "Hire AI-Fluent Developers for the Agentic Era"; Screen (take-home
       assessments), Interview (pair-programming interviews), Chakra
       ("Pre-screen with AI interviews"), Engage (hackathons), SkillUp; "AI
       Mock Interviewer"; developers join "to certify their skills, practice
       interviewing, and discover relevant jobs"; used by thousands of
       companies.
   - hr-july-2026  https://support.hackerrank.com/articles/8142080826-july-2026-release-notes
       "AI Fluency evaluation now uses IDE activity instead of only AI chat
       interactions"; AI Assistant improved "across assessments and
       interviews"; the AI Assistant in Screen and Interview "now supports
       Plan Mode, allowing candidates to create and refine an implementation
       plan before writing code" (re-checked 2026-09-22 by the verifier).
   - hr-guide  https://www.hackerrank.com/writing/best-coding-assessment-tools
       HackerRank's own buyer's guide (vendor material): ATS integrations
       naming Workday, SAP SuccessFactors, iCIMS and BambooHR; integrity
       features: browser lockdown, copy-paste detection, tab-switching
       monitoring, optional webcam proctoring, plagiarism comparison.
   - hr-cert  https://help.hackerrank.com/articles/2563639100-introduction-to-certification
       "HackerRank certifications are free, timed assessments".
   - cs-home  https://codesignal.com/
       "Agentic skills validation & development"; AI Interviewer, Skills
       Assessments, Live Tech Interviews, Skills Development, Skills
       Intelligence.
   - cs-launch  https://www.prnewswire.com/news-releases/codesignal-launches-industry-first-agentic-coding-assessments-for-ai-era-engineering-hiring-302732265.html
       2026-04-02 launch of agentic coding assessments; candidates use
       "Claude Code, Cursor, and Codex"; evaluates extracting technical
       requirements, building a working solution with agentic AI, and
       explaining technical reasoning to human reviewers; names Netflix,
       Capital One, Meta and Dropbox. Does not say where the assessment runs.
       Its survey figures are vendor research and are not used here.
   - cs-pricing  https://codesignal.com/pricing/
       "CodeSignal Learn is free for individuals to start" with a paid Cosmo+
       tier; published company plans; ATS integrations including Ashby, Gem,
       Workday, iCIMS and Oracle. (Prices deliberately not quoted.)

   Facts about kodwai come from the kodwai-context fact sheet and the live
   site copy (landing/src/components/landing/data.ts).
   ══════════════════════════════════════════════════════════════════════════ */

import { CLI_CHALLENGE_COMMAND, CLI_SUBMIT_COMMAND, SITE_DEFINITION } from "@/lib/site";

export const LAST_REVIEWED = "2026-09-22";

export type Source = { id: string; label: string; url: string };

/* A paragraph or table cell with optional citations (source ids). */
export type Cited = { text: string; cite?: string[] };

export type ComparePage = {
  slug: string;
  competitor: string;
  /* false hides the page (404, sitemap, sibling and hub links), so pages can
     be released one at a time. Also drop its footer link in
     components/landing/data.ts (FOOTER), which is hand-maintained. */
  published: boolean;
  title: string;
  description: string;
  /* Answer first: the two short paragraphs a reader or an answer engine needs. */
  answer: Cited[];
  competitorIs: Cited[];
  kodwaiIs: Cited[];
  method: string;
  rows: { aspect: string; them: Cited; kodwai: Cited }[];
  chooseThem: Cited[];
  chooseKodwai: Cited[];
  closing?: string;
  sources: Source[];
};

const KODWAI_DEFINITION: Cited = { text: SITE_DEFINITION };

const KODWAI_FLOW: Cited = {
  text: `Each challenge is scoped like a real ticket. You start it with ${CLI_CHALLENGE_COMMAND}, work it in your own editor with your own agent, and submit with ${CLI_SUBMIT_COMMAND}. Passing tests is necessary but not sufficient: the score is dominated by how you direct the agent, the part a careless prompt cannot fake.`,
};

const KODWAI_HIRING: Cited = {
  text: "For hiring teams, kodwai runs custom interview projects: you author the ticket, send one link, watch the prompts, commits, test runs, tools, time and API cost as the candidate works in Claude Code, and score the session against your own per-role rubric next to your team's manual scores. There is no published price for the hiring track, and no ATS integration yet.",
};

const HELLO_META: Source = {
  id: "hellointerview-meta",
  label: "Hello Interview, Meta's AI-enabled coding interview guide",
  url: "https://www.hellointerview.com/blog/meta-ai-enabled-coding",
};

export const COMPARE_PAGES: ComparePage[] = [
  {
    slug: "leetcode",
    competitor: "LeetCode",
    published: true,
    title: "kodwai vs LeetCode: algorithm practice or AI agent practice",
    description:
      "LeetCode is built for classic algorithm interviews. kodwai scores how well you direct an AI coding agent on real, ticket-sized work. Where each one fits.",
    answer: [
      {
        text: "LeetCode and kodwai train different skills. LeetCode is built around algorithm and data-structure problems for classic coding interviews. kodwai scores how well you direct an AI coding agent (Claude Code, Cursor, or Codex) through a ticket-sized problem on your own machine.",
        cite: ["wiki-leetcode"],
      },
      {
        text: "If your next round is a classic algorithm interview, LeetCode is the better tool. If you want to practice working with an agent, which some interviews now test directly, that is what kodwai is for. Many developers can use both.",
        cite: ["hellointerview-meta"],
      },
    ],
    competitorIs: [
      {
        text: "LeetCode is an online platform for coding interview preparation built around algorithmic problems. Its library runs to thousands of problems at three difficulty levels: easy, medium and hard.",
        cite: ["wiki-leetcode"],
      },
      {
        text: "It hosts weekly and biweekly contests and daily challenges, and offers mock interviews and online assessments. Solutions are evaluated on execution speed and memory use and ranked against other submissions. LeetCode has free and premium access, and Premium adds questions previously used in interviews at large tech companies.",
        cite: ["wiki-leetcode"],
      },
    ],
    kodwaiIs: [
      KODWAI_DEFINITION,
      KODWAI_FLOW,
      { text: "kodwai is small and early. The public catalog is a short list of longer challenges, not thousands of problems." },
    ],
    method:
      "We read the public sources listed below on 2026-09-22, and every statement about LeetCode links to one of them. LeetCode's own site blocked automated access that day, so the LeetCode facts come from Wikipedia's article on LeetCode as it stood on that date. We did not buy LeetCode Premium for this page. Facts about kodwai come from our own product.",
    rows: [
      {
        aspect: "What you practice",
        them: { text: "Algorithm and data-structure problems, the format of classic coding interviews.", cite: ["wiki-leetcode"] },
        kodwai: { text: "Ticket-sized engineering work, solved by directing an AI coding agent." },
      },
      {
        aspect: "Where you solve",
        them: { text: "On LeetCode's website.", cite: ["wiki-leetcode"] },
        kodwai: { text: "On your own machine, in your own editor, started from the CLI. No browser sandbox." },
      },
      {
        aspect: "What gets measured",
        them: { text: "Your solution's execution speed and memory use, ranked against other submissions.", cite: ["wiki-leetcode"] },
        kodwai: { text: "Direction, Outcome and Lift on a 0 to 100 scale. Tests are one signal inside Outcome." },
      },
      {
        aspect: "Catalog",
        them: { text: "Thousands of problems across easy, medium and hard.", cite: ["wiki-leetcode"] },
        kodwai: { text: "A small catalog of longer, ticket-sized challenges." },
      },
      {
        aspect: "Community",
        them: { text: "Weekly and biweekly contests and daily challenges.", cite: ["wiki-leetcode"] },
        kodwai: { text: "A public leaderboard and public developer profiles." },
      },
      {
        aspect: "Cost for developers",
        them: { text: "Free access, with a paid Premium tier.", cite: ["wiki-leetcode"] },
        kodwai: { text: "Free: challenges, your score, your profile and the leaderboard." },
      },
      {
        aspect: "Company-specific questions",
        them: { text: "Premium adds questions previously used in interviews at large tech companies.", cite: ["wiki-leetcode"] },
        kodwai: { text: "None." },
      },
    ],
    chooseThem: [
      { text: "Your next interview is a classic algorithm and data-structure round." },
      { text: "You want a very large problem set, regular contests and a big community to compare notes with." },
      { text: "You want company-specific questions and are willing to pay for Premium." },
      { text: "You want to practice without an AI agent in the loop." },
    ],
    chooseKodwai: [
      { text: "You want to practice directing Claude Code, Cursor, or Codex on realistic, ticket-sized work." },
      {
        text: "You are preparing for a round where AI use is allowed, such as the AI-enabled coding interview Meta started rolling out in October 2025.",
        cite: ["hellointerview-meta"],
      },
      { text: "You want a score that shows how you steer, verify, and decompose, not only whether the tests pass." },
      { text: "You want a public profile you can send to a hiring manager instead of a take-home." },
    ],
    closing: "They are not substitutes. LeetCode drills the algorithm round. kodwai practices the part of the job where you direct an agent and check its work.",
    sources: [
      { id: "wiki-leetcode", label: "Wikipedia, LeetCode", url: "https://en.wikipedia.org/wiki/LeetCode" },
      HELLO_META,
    ],
  },
  {
    slug: "hackerrank",
    competitor: "HackerRank",
    published: true,
    title: "kodwai vs HackerRank for AI-era coding interviews",
    description:
      "HackerRank is a full technical hiring suite. kodwai runs custom interviews in Claude Code on the candidate's own machine, plus a free developer arena.",
    answer: [
      {
        text: "HackerRank is a full technical hiring suite with a large developer community. kodwai is a small, early product: a free arena where developers solve real challenges with their own AI coding agent, and a hiring track that runs custom interviews in Claude Code on the candidate's own machine.",
        cite: ["hr-home"],
      },
      {
        text: "If you need an enterprise assessment program with ATS integrations and integrity tooling, HackerRank is the safer choice today. If you want to watch candidates drive an agent through a realistic ticket and score that on your own rubric, kodwai is built for that.",
      },
    ],
    competitorIs: [
      {
        text: "HackerRank describes itself as a way to \"Hire AI-Fluent Developers for the Agentic Era.\" Its products include Screen (take-home assessments), Interview (pair-programming interviews), Chakra (pre-screening with AI interviews), Engage (hackathons) and SkillUp (skills inside your company).",
        cite: ["hr-home"],
      },
      {
        text: "Its July 2026 release notes say its AI Fluency evaluation \"now uses IDE activity instead of only AI chat interactions\", and describe an improved AI Assistant across assessments and interviews and a Plan Mode that lets candidates create and refine an implementation plan before writing code.",
        cite: ["hr-july-2026"],
      },
      {
        text: "HackerRank's own buyer's guide lists ATS integrations including Workday, SAP SuccessFactors, iCIMS and BambooHR, and integrity features such as browser lockdown, copy-paste detection, tab-switching monitoring and optional webcam proctoring.",
        cite: ["hr-guide"],
      },
      {
        text: "For developers, HackerRank offers free, timed skills certifications, an AI Mock Interviewer and interview practice.",
        cite: ["hr-cert", "hr-home"],
      },
    ],
    kodwaiIs: [KODWAI_DEFINITION, KODWAI_HIRING, { text: "kodwai is small and early, and it does not try to replace a full assessment suite." }],
    method:
      "We read HackerRank's homepage, its July 2026 release notes, its certification help page and its own buyer's guide on 2026-09-22, and every statement about HackerRank links to one of them. The buyer's guide is HackerRank's marketing material. We did not run a paid HackerRank trial for this page. Facts about kodwai come from our own product.",
    rows: [
      {
        aspect: "Built for",
        them: { text: "Technical hiring, from screening to live and AI interviews, plus developer certifications.", cite: ["hr-home"] },
        kodwai: { text: "Developers practicing with AI agents, and teams running custom interviews." },
      },
      {
        aspect: "Where candidates work",
        them: { text: "In HackerRank's assessments and interviews, where its AI Assistant is available.", cite: ["hr-july-2026"] },
        kodwai: { text: "On their own machine, in Claude Code, started with one command from the invite link." },
      },
      {
        aspect: "How AI use is judged",
        them: { text: "An AI Fluency evaluation that reads IDE activity as well as AI chat.", cite: ["hr-july-2026"] },
        kodwai: { text: "The session itself is the evidence: prompts, commits, test runs and tool calls, scored against the rubric you define." },
      },
      {
        aspect: "ATS integrations",
        them: { text: "Yes, including Workday, SAP SuccessFactors, iCIMS and BambooHR.", cite: ["hr-guide"] },
        kodwai: { text: "Not yet, and we will not pretend otherwise. You send a link and a scored session comes back." },
      },
      {
        aspect: "For developers",
        them: { text: "Free skills certifications, an AI Mock Interviewer and interview practice.", cite: ["hr-cert", "hr-home"] },
        kodwai: { text: "Free public challenges scored on Direction, Outcome and Lift, a public profile and a leaderboard." },
      },
      {
        aspect: "Maturity",
        them: { text: "An established platform used by thousands of companies.", cite: ["hr-home"] },
        kodwai: { text: "Small and early." },
      },
    ],
    chooseThem: [
      { text: "You need a full assessment suite: screening, live interviews and AI interviews in one place." },
      { text: "ATS integrations and integrity tooling such as proctoring are requirements for your process." },
      { text: "You screen at high volume with standardized coding or role-based tests." },
      { text: "As a developer, you want free skills certifications or classic interview practice." },
    ],
    chooseKodwai: [
      { text: "You want candidates to solve a ticket you author, on their own machine, in Claude Code." },
      { text: "You want to follow the prompts, commits, test runs, tools, time and API cost live, not read a summary afterward." },
      { text: "You want AI scoring against your own per-role rubric, with a written justification per dimension, next to your team's own scores." },
      { text: "As a developer, you want to practice directing your own agent and get scored on it, for free." },
    ],
    sources: [
      { id: "hr-home", label: "HackerRank homepage", url: "https://www.hackerrank.com/" },
      { id: "hr-july-2026", label: "HackerRank, July 2026 release notes", url: "https://support.hackerrank.com/articles/8142080826-july-2026-release-notes" },
      { id: "hr-guide", label: "HackerRank, Best Coding Assessment Tools (vendor buyer's guide)", url: "https://www.hackerrank.com/writing/best-coding-assessment-tools" },
      { id: "hr-cert", label: "HackerRank Help, Introduction to Certification", url: "https://help.hackerrank.com/articles/2563639100-introduction-to-certification" },
    ],
  },
  {
    slug: "codesignal",
    competitor: "CodeSignal",
    published: true,
    title: "kodwai vs CodeSignal: agentic coding assessments compared",
    description:
      "CodeSignal launched agentic coding assessments in April 2026. kodwai pairs custom interviews on the candidate's machine with a free developer arena.",
    answer: [
      {
        text: "CodeSignal is an established skills assessment company, and on April 2, 2026 it launched agentic coding assessments in which candidates use Claude Code, Cursor and Codex. kodwai is built around the same shift but is much smaller: a free public arena where developers get scored on how they direct their agent, and custom interviews that run on the candidate's own machine.",
        cite: ["cs-launch"],
      },
      {
        text: "If you need an established enterprise assessment vendor now, choose CodeSignal. If you want a public place for developers to practice and share their scores, or interviews built on a ticket shaped like your codebase, look at kodwai.",
      },
    ],
    competitorIs: [
      {
        text: "CodeSignal's homepage headline reads \"Agentic skills validation & development.\" It lists an AI Interviewer, Skills Assessments, Live Tech Interviews, Skills Development and Skills Intelligence.",
        cite: ["cs-home"],
      },
      {
        text: "Its agentic coding assessments ask candidates to extract technical requirements, build a working solution with agentic AI tools such as Claude Code, Cursor and Codex, and explain their technical reasoning to human reviewers. The launch announcement names Netflix, Capital One, Meta and Dropbox as companies that use CodeSignal.",
        cite: ["cs-launch"],
      },
      {
        text: "For individuals, CodeSignal Learn is free to start, with a paid tier for unlimited use of its AI tutor, Cosmo. For companies, CodeSignal publishes plan pricing and lists ATS integrations including Ashby, Workday and iCIMS.",
        cite: ["cs-pricing"],
      },
    ],
    kodwaiIs: [KODWAI_DEFINITION, KODWAI_HIRING, { text: "kodwai is small and early, without CodeSignal's scale, enterprise customer list or support operation." }],
    method:
      "We read CodeSignal's homepage, its April 2, 2026 launch announcement and its pricing page on 2026-09-22, and every statement about CodeSignal links to one of them. The announcement's survey figures are vendor research, so we left them out. We did not run a CodeSignal trial for this page. Facts about kodwai come from our own product.",
    rows: [
      {
        aspect: "Built for",
        them: { text: "Validating and developing skills at company scale: assessments, AI interviews, live interviews and learning.", cite: ["cs-home"] },
        kodwai: { text: "Developers practicing with AI agents, and teams running custom interviews." },
      },
      {
        aspect: "Agentic coding",
        them: { text: "Agentic coding assessments since April 2026, with Claude Code, Cursor and Codex.", cite: ["cs-launch"] },
        kodwai: { text: "The whole product: developer challenges with Claude Code, Cursor, or Codex, and interviews in Claude Code." },
      },
      {
        aspect: "Where the work happens",
        them: { text: "Not stated in the launch announcement we read.", cite: ["cs-launch"] },
        kodwai: { text: "On the developer's or candidate's own machine, in their own editor." },
      },
      {
        aspect: "What is evaluated",
        them: { text: "Extracting requirements, building with agentic tools, and explaining decisions to human reviewers.", cite: ["cs-launch"] },
        kodwai: { text: "Developers: Direction, Outcome and Lift, 0 to 100, with evidence per signal. Hiring: your own rubric, 0 to 10 per dimension, with a written justification." },
      },
      {
        aspect: "For developers",
        them: { text: "CodeSignal Learn, with the Cosmo AI tutor, free to start.", cite: ["cs-pricing"] },
        kodwai: { text: "Free public challenges, a public score, a profile and a leaderboard." },
      },
      {
        aspect: "Integrations and pricing",
        them: { text: "Published company plans and ATS integrations.", cite: ["cs-pricing"] },
        kodwai: { text: "No ATS integrations and no published hiring price. Reach out and we will get your team set up." },
      },
      {
        aspect: "Company stage",
        them: { text: "An established vendor with enterprise customers.", cite: ["cs-launch"] },
        kodwai: { text: "Small and early." },
      },
    ],
    chooseThem: [
      { text: "You need an established enterprise assessment vendor now, with published plans and ATS integrations." },
      { text: "You want agentic coding assessments inside a broader platform that also covers AI interviews, live interviews and skills development." },
      { text: "You hire at a volume where a mature vendor's operations and support matter." },
    ],
    chooseKodwai: [
      { text: "You want candidates to work on their own machine, in Claude Code, on a ticket you write to look like your codebase." },
      { text: "You want to follow each session live and score it on your own rubric, with your team's scores next to the AI's." },
      { text: "You want a free, public arena where developers practice with Claude Code, Cursor, or Codex and share their scores." },
    ],
    sources: [
      { id: "cs-home", label: "CodeSignal homepage", url: "https://codesignal.com/" },
      { id: "cs-launch", label: "CodeSignal launch announcement, April 2, 2026 (PR Newswire)", url: "https://www.prnewswire.com/news-releases/codesignal-launches-industry-first-agentic-coding-assessments-for-ai-era-engineering-hiring-302732265.html" },
      { id: "cs-pricing", label: "CodeSignal pricing page", url: "https://codesignal.com/pricing/" },
    ],
  },
];

export const publishedComparePages = () => COMPARE_PAGES.filter((p) => p.published);

export function getComparePage(slug: string): ComparePage | null {
  return COMPARE_PAGES.find((p) => p.slug === slug && p.published) ?? null;
}
