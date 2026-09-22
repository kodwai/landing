"use client";

/* /challenges: the public catalog, grouped easy to hard. Every card links to
   its server-rendered /challenges/<slug> page. */

import { C, Serif, Accent, CodeChip, GhostLink, APP_URL } from "@/components/landing/system";
import {
  PublicShell, Section, Crumbs, Kicker, H2, P, ChallengeGrid, ScoreAxes, SignupBand,
} from "@/components/landing/PublicShell";
import { type ChallengeSummary, capitalize } from "@/lib/challenges";
import { CLI_CHALLENGE_COMMAND } from "@/lib/site";

const CAMPAIGN = "challenges_index";

export default function ChallengesIndexView({ challenges }: { challenges: ChallengeSummary[] }) {
  const groups = ["easy", "medium", "hard"]
    .map((d) => ({ difficulty: d, items: challenges.filter((c) => c.difficulty === d) }))
    .filter((g) => g.items.length > 0);
  const other = challenges.filter((c) => !["easy", "medium", "hard"].includes(c.difficulty));
  if (other.length) groups.push({ difficulty: "other", items: other });
  const categories = new Set(challenges.map((c) => c.category)).size;

  return (
    <PublicShell section="challenges" campaign={CAMPAIGN}>
      <Section first>
        <Crumbs items={[{ label: "Home", href: "/" }, { label: "Challenges" }]} />
        <Kicker>public challenges</Kicker>
        <Serif as="h1" size="h2" style={{ maxWidth: "18ch", marginBottom: 22 }}>
          Coding challenges for your <Accent>AI agent.</Accent>
        </Serif>
        <P lead>
          Real, ticket-sized problems you solve on your own machine with your own AI coding agent: Claude Code,
          Cursor, or Codex. Each one is scoped like a real ticket, not a riddle. Start one with a single command,
          submit when you are done, and get scored on how well you directed the agent, across three axes:
          Direction, Outcome, and Lift.
        </P>
        <div style={{ margin: "26px 0 14px" }}>
          <CodeChip>{CLI_CHALLENGE_COMMAND}</CodeChip>
        </div>
        <p style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, letterSpacing: 0.4, margin: 0 }}>
          {challenges.length > 0
            ? `${challenges.length} public ${challenges.length === 1 ? "challenge" : "challenges"} across ${categories} ${categories === 1 ? "category" : "categories"}. Each page has its exact command.`
            : "Each challenge page has its exact command."}
        </p>
      </Section>

      {challenges.length === 0 ? (
        <Section>
          <H2>The catalog did not load</H2>
          <P>The challenge list is read live from the kodwai API, and it did not answer just now. The same catalog is in the app.</P>
          <GhostLink label="browse challenges in the app" href={APP_URL} event="cta_clicked" eventProps={{ location: "challenges_index_empty" }} />
        </Section>
      ) : (
        groups.map((g) => (
          <Section key={g.difficulty}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
              <H2 style={{ marginBottom: 0 }}>{g.difficulty === "other" ? "More challenges" : capitalize(g.difficulty)}</H2>
              <span style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, letterSpacing: 0.4 }}>
                {g.items.length} {g.items.length === 1 ? "challenge" : "challenges"}
              </span>
            </div>
            <ChallengeGrid challenges={g.items} />
          </Section>
        ))
      )}

      <Section>
        <H2>How every challenge is scored</H2>
        <P>
          The score runs from 0 to 100 and is dominated by how you direct the agent, the part a careless prompt
          cannot fake. Passing tests is necessary but not sufficient.
        </P>
        <div style={{ margin: "30px 0 28px" }}>
          <ScoreAxes />
        </div>
        <GhostLink label="the score, explained" href="/ai-collaboration-score" event="cta_clicked" eventProps={{ location: "challenges_index_score" }} />
      </Section>

      <SignupBand
        campaign={CAMPAIGN}
        content="closing"
        heading={<>Pick one and <Accent>ship it.</Accent></>}
        body="Solving challenges, your score, your profile, and the leaderboard are free for developers. Sign up, pick a challenge, and run its command in your terminal."
      />
    </PublicShell>
  );
}
