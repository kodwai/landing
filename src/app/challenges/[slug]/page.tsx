import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChallengeView from "./ChallengeView";
import { ORGANIZATION_ID, SITE_URL, jsonLdScript } from "@/lib/site";
import {
  type ChallengeSummary,
  breadcrumbJsonLd, getPublicChallenge, listPublicChallenges, publicScoreStats, truncate, withBuildFallback,
} from "@/lib/challenges";

// Static HTML per challenge, refreshed from the API at most every 15 minutes
// (keep in step with CHALLENGES_REVALIDATE; segment config must be a literal).
// Challenges published after the build render on first request
// (dynamicParams defaults to true); unknown or private slugs are a real 404.
export const revalidate = 900;

/* Prerender every public challenge so its title, description, and canonical
   are in <head> for every crawler (GPTBot, ClaudeBot and PerplexityBot are not
   in Next's default htmlLimitedBots list, so streamed metadata would miss them). */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const challenges = await withBuildFallback(listPublicChallenges, []);
  return challenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getPublicChallenge(slug);
  if (!c) notFound();

  const title = `${c.title} · AI agent coding challenge | kodwai`;
  const description = truncate(c.description, 155);
  return {
    title,
    description,
    alternates: { canonical: `/challenges/${c.slug}` },
    openGraph: { title: `${c.title} | kodwai challenge`, description, type: "website", url: `/challenges/${c.slug}` },
    twitter: { card: "summary_large_image", title: `${c.title} | kodwai challenge`, description },
  };
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = await getPublicChallenge(slug);
  if (!challenge) notFound();

  // Related challenges are a nice-to-have: an outage here never blocks the page.
  let catalog: ChallengeSummary[] = [];
  try {
    catalog = await listPublicChallenges();
  } catch {
    catalog = [];
  }
  const others = catalog.filter((c) => c.slug !== challenge.slug);
  const related = [
    ...others.filter((c) => c.category === challenge.category),
    ...others.filter((c) => c.category !== challenge.category && c.difficulty === challenge.difficulty),
    ...others.filter((c) => c.category !== challenge.category && c.difficulty !== challenge.difficulty),
  ].slice(0, 3);

  const url = `${SITE_URL}/challenges/${challenge.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([["Home", "/"], ["Challenges", "/challenges"], [challenge.title, `/challenges/${challenge.slug}`]]),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: challenge.title,
        description: challenge.description,
        inLanguage: "en",
        keywords: challenge.tags.join(", ") || undefined,
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <ChallengeView
        challenge={{
          id: challenge.id, slug: challenge.slug, title: challenge.title, description: challenge.description,
          difficulty: challenge.difficulty, category: challenge.category, tags: challenge.tags,
          time_limit_minutes: challenge.time_limit_minutes,
        }}
        related={related}
        stats={publicScoreStats(challenge)}
      />
    </>
  );
}
