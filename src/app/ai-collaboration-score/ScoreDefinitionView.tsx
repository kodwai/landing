"use client";

/* /ai-collaboration-score: the canonical definition of kodwai's score for
   coding-agent sessions. Answer first (a self-contained definition sentence a
   model can quote), then the axes, the scoring flow, who it is for, and a
   visible FAQ. Corrix uses similar wording for general AI use, so every
   mention ties the term to coding agents and the page never claims the name.
   Wording comes from the kodwai-context fact sheet and the live site copy. */

import Link from "next/link";
import type { ReactNode } from "react";
import { C, TYPE, Serif, Accent, GhostLink } from "@/components/landing/system";
import {
  PublicShell, Section, Crumbs, Kicker, H2, P, Code, CopyCommand, ChallengeGrid, ScoreAxes, SignupBand,
} from "@/components/landing/PublicShell";
import { type ChallengeSummary, challengeCommand } from "@/lib/challenges";
import { CLI_CHALLENGE_COMMAND, CLI_SUBMIT_COMMAND, SITE_DEFINITION } from "@/lib/site";

const CAMPAIGN = "ai_collaboration_score";

const SCORE_DEFINITION =
  "kodwai's AI Collaboration Score is a 0 to 100 score for one coding session with an AI coding agent (Claude Code, Cursor, or Codex) that measures how well the developer directed the agent, across three axes: Direction, Outcome, and Lift.";

const BYLINE = "Ege Hakan Karaagac, co-founder of kodwai";
const UPDATED = "2026-09-22";
const HELLO_META = "https://www.hellointerview.com/blog/meta-ai-enabled-coding";
const CORRIX = "https://app.corrix.ai/";

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "Is a high score the same as passing the tests?",
    a: "No. Tests are one signal inside Outcome. Passing tests is necessary but not sufficient: the score is dominated by Direction, the part a careless prompt cannot fake. A solution that clears tests with no steering, no verification, and no decomposition scores poorly on the axis that matters most.",
  },
  {
    q: "Which coding agents can I use?",
    a: "When you start a challenge, the CLI asks whether you will use Claude Code, Cursor, or Codex. You work in your own editor on your own machine.",
  },
  {
    q: "Are the axes weighted the same on every challenge?",
    a: "No. In the default profile Direction is worth 50 points, Outcome 35 and Lift 15. Other challenges use other splits: a debugging profile weights Direction higher, and a challenge with its own rubric scores Direction, a Challenge Rubric axis and Lift.",
  },
  {
    q: "Can I see why I got my score?",
    a: "Yes. Every signal cites its own evidence from your transcript, commits, and test runs, and your score comes with a confidence interval instead of false precision.",
  },
  {
    q: "What does the CLI collect?",
    a: "Only the challenge workspace: the code files, the challenge session's git history, and agent traces from the challenge time window. Nothing from your other projects.",
  },
  {
    q: "Is it free?",
    a: "Yes. Solving challenges, your score, your profile, and the leaderboard are free for developers.",
  },
  {
    q: "Is this the score hiring teams see?",
    a: "Not directly. kodwai's hiring track scores interview sessions against each team's own per-role rubric, 0 to 10 per dimension, with a written justification. That is a different number from the public 0 to 100 score described here.",
  },
  {
    q: "Is the name unique to kodwai?",
    a: <>No. Other products use similar wording: <a href={CORRIX} className="k-pub-link" target="_blank" rel="noopener noreferrer">Corrix</a>, for example, offers an AI Collaboration Profile about how effectively people work with AI in general. On kodwai, the AI Collaboration Score always means the score for a session with an AI coding agent.</>,
  },
];

export default function ScoreDefinitionView({ starter, tryThese, comparisons }: {
  starter: ChallengeSummary | null; tryThese: ChallengeSummary[]; comparisons: { slug: string; competitor: string }[];
}) {
  return (
    <PublicShell section="the score" campaign={CAMPAIGN}>
      <Section first>
        <Crumbs items={[{ label: "Home", href: "/" }, { label: "AI Collaboration Score" }]} />
        <Kicker>definition</Kicker>
        <Serif as="h1" size="h2" style={{ maxWidth: "20ch", marginBottom: 24 }}>
          The AI Collaboration Score, for <Accent>coding agents.</Accent>
        </Serif>
        <P lead style={{ maxWidth: "64ch" }}>{SCORE_DEFINITION}</P>
        <P style={{ maxWidth: "64ch" }}>
          It is the score kodwai gives every challenge submission. It rewards how you steer, verify, and decompose the
          work, not what you memorized, and it ranks you on a public leaderboard.
        </P>
        <p style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, letterSpacing: 0.4, margin: "18px 0 0", lineHeight: 1.7 }}>
          By {BYLINE} <span style={{ color: C.accent }}>·</span> Last updated <time dateTime={UPDATED}>{UPDATED}</time>
        </p>
      </Section>

      <Section>
        <H2>The three axes</H2>
        <P>Direction, Outcome, and Lift, built from 11 signals. These are the labels the app shows on every scored session.</P>
        <div style={{ margin: "30px 0 30px" }}>
          <ScoreAxes detailed />
        </div>
        <P style={{ marginBottom: 0 }}>
          In the default profile Direction is worth 50 points, Outcome 35 and Lift 15. Other challenges use other
          splits, and a challenge with its own rubric scores Direction, a Challenge Rubric axis and Lift. On the
          default profile Direction carries the most weight: it is the part a careless prompt cannot fake.
        </P>
      </Section>

      <Section>
        <H2>How a session is scored</H2>
        <P>{SITE_DEFINITION}</P>
        <ol style={{ margin: "26px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 18, maxWidth: "72ch" }}>
          {[
            <>You start a challenge with <Code>{CLI_CHALLENGE_COMMAND}</Code>. The CLI asks which agent you will use, downloads PROBLEM.md, starter files and tests, inits a git repo, and starts the timer.</>,
            <>You solve it on your own machine, in your own editor, with your own agent. No browser sandbox, no artificial constraints.</>,
            <><Code>{CLI_SUBMIT_COMMAND}</Code> packages your code, git history, test runs, agent transcript, and the time you took. The CLI only collects from the challenge workspace.</>,
            <>The session is scored on Direction, Outcome, and Lift. Every signal cites its own evidence from your transcript, commits, and test runs.</>,
            <>You get a score from 0 to 100 with a confidence interval instead of false precision, per-signal evidence, and a place on the public leaderboard.</>,
          ].map((step, i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 10, alignItems: "baseline" }}>
              <span aria-hidden style={{ fontFamily: C.mono, fontSize: 12, color: C.accent }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ ...TYPE.body, fontSize: 16.5, color: C.muted }}>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <H2>Why passing tests is not enough</H2>
        <P>
          A one-shot &ldquo;solve this&rdquo; prompt can clear the tests, so tests alone say little about how someone
          works with an agent. The score is dominated by how you direct the agent: whether you stated the spec,
          checked the agent&apos;s output, broke the work into steps, and recovered when it went wrong. Lift then asks
          how far you beat a solo AI, not just that you passed.
        </P>
      </Section>

      <Section>
        <H2>Who it is for</H2>
        <div className="k-split-even" style={{ marginTop: 10 }}>
          <div>
            <h3 style={{ ...TYPE.monoTitle, margin: "0 0 10px" }}>Developers</h3>
            <P>
              Practice directing Claude Code, Cursor, or Codex on ticket-sized work and see which signals held you back.
              Your public profile at <Code>app.kodwai.com/developers/your-username</Code> is built to send to anyone,
              including a hiring manager instead of a take-home.
            </P>
            <P>
              It is also practice for interview rounds where AI use is allowed, such as the{" "}
              <a href={HELLO_META} className="k-pub-link" target="_blank" rel="noopener noreferrer">AI-enabled coding interview Meta started rolling out in October 2025</a>.
            </P>
          </div>
          <div>
            <h3 style={{ ...TYPE.monoTitle, margin: "0 0 10px" }}>Hiring teams</h3>
            <P>
              Teams use kodwai&apos;s hiring track: custom interview projects, one link per candidate, the full session
              live (prompts, commits, test runs, tools, time, and API cost), and AI scoring against your own per-role
              rubric next to your team&apos;s manual scores. Candidates work in Claude Code on their own machine.
            </P>
            <P>
              <Link href="/hiring" className="k-pub-link">See kodwai for hiring</Link>
            </P>
          </div>
        </div>
      </Section>

      <Section>
        <H2>Try it on a real challenge</H2>
        {starter ? (
          <>
            <P>
              The starter challenge is {starter.title} ({starter.difficulty}, {starter.category},{" "}
              {starter.time_limit_minutes} minutes). Create a free account, then run:
            </P>
            <div style={{ margin: "20px 0 30px", maxWidth: 620 }}>
              <CopyCommand
                command={challengeCommand(starter.slug)}
                eventProps={{ challenge_slug: starter.slug, challenge_title: starter.title, difficulty: starter.difficulty, category: starter.category, location: "ai_collaboration_score" }}
              />
            </div>
          </>
        ) : (
          <P>Pick any public challenge and run its command in your terminal.</P>
        )}
        {tryThese.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <ChallengeGrid challenges={tryThese} />
          </div>
        )}
        <GhostLink label="browse all challenges" href="/challenges" event="cta_clicked" eventProps={{ location: "ai_collaboration_score_try" }} />
      </Section>

      {comparisons.length > 0 && (
        <Section>
          <H2>How kodwai compares</H2>
          <P>Honest comparisons that say where each product is the better choice.</P>
          <ul style={{ listStyle: "none", margin: "18px 0 0", padding: 0, display: "flex", flexWrap: "wrap", gap: "12px 28px" }}>
            {comparisons.map((cmp) => (
              <li key={cmp.slug}>
                <Link href={`/compare/${cmp.slug}`} className="k-pub-link" style={{ fontFamily: C.mono, fontSize: 13 }}>kodwai vs {cmp.competitor}</Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section>
        <H2>Frequently asked questions</H2>
        <div style={{ maxWidth: 820, marginTop: 10 }}>
          {FAQ.map((item, i) => (
            <div key={item.q} style={{ padding: "22px 0", borderTop: `1px solid ${C.line}`, borderBottom: i === FAQ.length - 1 ? `1px solid ${C.line}` : undefined }}>
              <h3 style={{ fontFamily: C.sans, fontWeight: 500, fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.35, color: C.text, margin: "0 0 10px" }}>{item.q}</h3>
              <p style={{ ...TYPE.body, fontSize: 16, color: C.muted, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 style={{ ...TYPE.monoTitle, margin: "0 0 14px", color: C.text }}>How this was made</h2>
        <P style={{ marginBottom: 0 }}>
          Written from kodwai&apos;s scoring code and the live site copy, with help from Claude, an AI model, on{" "}
          {UPDATED}. The signal names and descriptions are the ones the kodwai API serves with every challenge. If
          something here is wrong or out of date, email{" "}
          <a href="mailto:hakan@kodwai.com" className="k-pub-link">hakan@kodwai.com</a>.
        </P>
      </Section>

      <SignupBand
        campaign={CAMPAIGN}
        content="closing"
        heading={<>Get your own <Accent>score.</Accent></>}
        body="Pick a challenge, solve it with your agent on your own machine, and see how you direct it. Free for developers."
      />
    </PublicShell>
  );
}
