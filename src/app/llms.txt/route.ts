import {
  APP_URL, CLI_CHALLENGE_COMMAND, CLI_SUBMIT_COMMAND, SITE_DEFINITION, SITE_URL,
} from "@/lib/site";
import { COMPARE_PAGES } from "@/lib/compare";

/* /llms.txt: a short, factual briefing for coding agents and LLM tools that
   fetch it. Every line restates what the site, the app, or the CLI README
   already says (see the kodwai-context fact sheet); nothing here is new or
   promotional. Plain text, no em dashes. To list a new public page, append it
   to LINKS once it returns 200. */

export const dynamic = "force-static";

const LINKS: { label: string; url: string; note: string }[] = [
  { label: "Home", url: `${SITE_URL}/`, note: "what kodwai is, how it works, the score, FAQ" },
  { label: "For hiring", url: `${SITE_URL}/hiring`, note: "private interviews on the same engine, for hiring teams" },
  { label: "Blog", url: `${SITE_URL}/blog`, note: "articles on AI-agent coding and technical hiring" },
  { label: "Challenges", url: `${SITE_URL}/challenges`, note: "every public challenge, with the CLI command to start it" },
  { label: "AI Collaboration Score", url: `${SITE_URL}/ai-collaboration-score`, note: "what the score measures: Direction, Outcome, Lift" },
  // Same build as the pages themselves, and unpublished comparisons 404, so they are filtered out here.
  ...COMPARE_PAGES.filter((c) => c.published).map((c) => ({
    label: `kodwai vs ${c.competitor}`,
    url: `${SITE_URL}/compare/${c.slug}`,
    note: "an honest comparison, with sources",
  })),
  { label: "App", url: APP_URL, note: "sign up, browse challenges, see the leaderboard" },
  { label: "CLI on npm", url: "https://www.npmjs.com/package/@kodwai/cli", note: "@kodwai/cli, needs Node.js 20+" },
  { label: "CLI source", url: "https://github.com/kodwai/cli", note: "what the CLI collects from a challenge workspace" },
];

function body(): string {
  return `# kodwai

> ${SITE_DEFINITION}

Developers work locally, in their own editor, with their own agent. There is no browser sandbox. Claude Code and Cursor are first-class, and anything that runs in a terminal works, including Codex CLI, Aider, and Cline. Solving challenges, the score, the profile, and the leaderboard are free for developers. The hiring track is the paid product, for teams running interviews.

## How it works

1. Pick a challenge at ${APP_URL}.
2. Start it from your terminal: \`${CLI_CHALLENGE_COMMAND}\`. The CLI signs you in through the browser if needed, downloads PROBLEM.md, the starter files, and the tests, inits a git repo, and starts the timer.
3. Solve it on your machine with your own agent.
4. Submit: \`${CLI_SUBMIT_COMMAND}\`. This packages your code, git history, test runs, agent transcript, and the time you took.
5. Get your score, with per-signal evidence, and a place on the leaderboard.

## The score

- Direction: how you steer, verify, and decompose. Direction carries the most weight, because it is the part a careless prompt cannot fake.
- Outcome: what shipped, replayed and stress-tested to prove it holds.
- Lift: how far you beat a solo AI, not just that you passed.

Scores are calibrated 0 to 100. Every signal cites its own evidence from the transcript, commits, and test runs, and each score comes with a confidence interval.

## Links

${LINKS.map((l) => `- [${l.label}](${l.url}): ${l.note}`).join("\n")}
`;
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
