"use client";

/* /challenges/<slug>: one public challenge. Everything a reader or crawler
   needs is in the server HTML: what the challenge is, the exact command, what
   the CLI does, how the session is scored, and a free signup. Score numbers
   appear only when the stats gate in lib/challenges passes. */

import Link from "next/link";
import { C, TYPE, Serif, Accent } from "@/components/landing/system";
import {
  PublicShell, Section, Crumbs, H2, P, Code, DifficultyPill, CopyCommand, ChallengeGrid, ScoreAxes, SignupBand, useTrackOnce,
} from "@/components/landing/PublicShell";
import {
  type ChallengeScoreStats, type ChallengeSummary,
  appChallengeUrl, capitalize, challengeCommand,
} from "@/lib/challenges";
import { CLI_SUBMIT_COMMAND } from "@/lib/site";

const CAMPAIGN = "challenge_page";

export default function ChallengeView({ challenge: c, related, stats }: {
  challenge: ChallengeSummary; related: ChallengeSummary[]; stats: ChallengeScoreStats | null;
}) {
  const command = challengeCommand(c.slug);
  const eventProps = { challenge_slug: c.slug, challenge_title: c.title, difficulty: c.difficulty, category: c.category };
  useTrackOnce("challenge_viewed", { ...eventProps, logged_in: false, source: "landing" });

  const facts: [string, string][] = [
    ["Difficulty", capitalize(c.difficulty)],
    ["Category", c.category],
    ["Time limit", `${c.time_limit_minutes} minutes`],
    ["Agents", "Claude Code, Cursor, or Codex"],
    ["Where", "Your own machine and editor"],
    ["Cost", "Free for developers"],
  ];

  return (
    <PublicShell section="challenges" campaign={CAMPAIGN}>
      <Section first>
        <Crumbs items={[{ label: "Home", href: "/" }, { label: "Challenges", href: "/challenges" }, { label: c.title }]} />

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <DifficultyPill difficulty={c.difficulty} />
          <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: C.faint }}>{c.category}</span>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4 }}>~{c.time_limit_minutes} min</span>
        </div>

        <Serif as="h1" size="h2" style={{ maxWidth: "22ch", marginBottom: 22 }}>{c.title}</Serif>
        <P lead style={{ maxWidth: "62ch" }}>{c.description}</P>

        {c.tags.length > 0 && (
          <ul aria-label="Tags" style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: 8, margin: "22px 0 0", padding: 0 }}>
            {c.tags.map((tag) => (
              <li key={tag} style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, border: `1px solid ${C.line}`, background: C.panel, padding: "4px 10px" }}>{tag}</li>
            ))}
          </ul>
        )}
      </Section>

      <Section>
        <div className="k-split-2" style={{ alignItems: "start" }}>
          <div style={{ minWidth: 0 }}>
            <H2>Start this challenge</H2>
            <P>Run this in your terminal. You need Node.js 20+ and git.</P>
            <div style={{ margin: "22px 0 28px" }}>
              <CopyCommand command={command} eventProps={{ ...eventProps, location: "challenge_page" }} />
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                <>The CLI signs you in through the browser if needed and asks which agent you will use: Claude Code, Cursor, or Codex.</>,
                <>It downloads PROBLEM.md, starter files and tests, inits a git repo, and starts a {c.time_limit_minutes}-minute timer. The full problem statement is revealed only once you start.</>,
                <>You solve it on your own machine, in your own editor, with your own agent. No browser sandbox.</>,
                <>When you are done, <Code>{CLI_SUBMIT_COMMAND}</Code> packages your code, git history, test runs, agent transcript, and the time you took, then ships it for scoring.</>,
              ].map((step, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 10, alignItems: "baseline" }}>
                  <span aria-hidden style={{ fontFamily: C.mono, fontSize: 12, color: C.accent }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ ...TYPE.body, fontSize: 16, color: C.muted }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <aside aria-label="Challenge facts" style={{ border: `1px solid ${C.line}`, background: C.panel, padding: "clamp(22px, 3vw, 28px)" }}>
            <dl style={{ margin: 0 }}>
              {facts.map(([k, v], i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
                  <dt style={{ ...TYPE.label, fontSize: 10.5, color: C.faint, paddingTop: 2 }}>{k}</dt>
                  <dd style={{ margin: 0, fontFamily: C.mono, fontSize: 13, color: C.text, textAlign: "right" }}>{v}</dd>
                </div>
              ))}
            </dl>
            {stats && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.lineBright}` }}>
                <p style={{ fontFamily: C.mono, fontSize: 13, color: C.text, margin: "0 0 6px" }}>Median score {stats.medianScore} / 100</p>
                <p style={{ fontFamily: C.sans, fontSize: 13.5, lineHeight: 1.5, color: C.muted, margin: 0 }}>
                  From {stats.realScoredSubmissions} real scored submissions. Demo and internal accounts are excluded.
                </p>
              </div>
            )}
          </aside>
        </div>
      </Section>

      <Section>
        <H2>How you are scored</H2>
        <P>
          Your session gets a score from 0 to 100 across three axes. The score is dominated by how you direct the
          agent, the part a careless prompt cannot fake: passing tests is necessary but not sufficient. Every signal
          cites its own evidence from your transcript, commits, and test runs, and your score comes with a confidence
          interval instead of false precision.
        </P>
        <div style={{ margin: "30px 0 28px" }}>
          <ScoreAxes />
        </div>
        <P style={{ marginBottom: 0 }}>
          Read <Link href="/ai-collaboration-score" className="k-pub-link">how the AI Collaboration Score for coding agents works</Link> for every signal and how the axes are weighted.
        </P>
      </Section>

      <SignupBand
        campaign={CAMPAIGN}
        content={c.slug}
        heading={<>Try <Accent>{c.title}</Accent> with your agent.</>}
        body="Create a free account, then run the command above. Solving challenges, your score, your profile, and the leaderboard are free for developers."
        secondary={{ kicker: "already signed up?", label: "open it in the app", href: appChallengeUrl(c.slug) }}
      />

      {related.length > 0 && (
        <Section>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
            <H2 style={{ marginBottom: 0 }}>More challenges</H2>
            <Link href="/challenges" className="k-pub-link" style={{ fontFamily: C.mono, fontSize: 12 }}>all challenges</Link>
          </div>
          <ChallengeGrid challenges={related} />
        </Section>
      )}
    </PublicShell>
  );
}
