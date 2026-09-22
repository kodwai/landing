import type { Metadata } from "next";
import ChallengesIndexView from "./ChallengesIndexView";
import { DEFAULT_OG_IMAGE, SITE_URL, jsonLdScript } from "@/lib/site";
import { breadcrumbJsonLd, listPublicChallenges, withBuildFallback } from "@/lib/challenges";

// The catalog is static HTML, refreshed from the API at most every 15 minutes
// (keep in step with CHALLENGES_REVALIDATE; segment config must be a literal).
export const revalidate = 900;

const TITLE = "Coding challenges for AI coding agents | kodwai";
const DESCRIPTION =
  "Real, ticket-sized coding challenges you solve on your own machine with your own AI agent. kodwai scores how well you direct it: Direction, Outcome, Lift.";

/* This page sets its own openGraph and twitter blocks, which replace the root
   ones wholesale, so the image is listed explicitly. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/challenges" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/challenges", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [DEFAULT_OG_IMAGE.url] },
};

export default async function ChallengesIndex() {
  // An API outage during the build renders an honest empty state; at runtime
  // it keeps the last good ISR copy (see withBuildFallback).
  const challenges = await withBuildFallback(listPublicChallenges, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([["Home", "/"], ["Challenges", "/challenges"]]),
      {
        "@type": "ItemList",
        name: "kodwai public coding challenges",
        itemListElement: challenges.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.title,
          url: `${SITE_URL}/challenges/${c.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <ChallengesIndexView challenges={challenges} />
    </>
  );
}
