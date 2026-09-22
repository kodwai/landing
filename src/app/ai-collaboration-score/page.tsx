import type { Metadata } from "next";
import ScoreDefinitionView from "./ScoreDefinitionView";
import { DEFAULT_OG_IMAGE, ORGANIZATION_ID, SITE_URL, jsonLdScript } from "@/lib/site";
import { breadcrumbJsonLd, difficultyRank, listPublicChallenges, withBuildFallback } from "@/lib/challenges";
import { publishedComparePages } from "@/lib/compare";

// Static page; the starter challenge links refresh from the API with the
// catalog (every 15 minutes, CHALLENGES_REVALIDATE).
export const revalidate = 900;

const TITLE = "AI Collaboration Score for coding agents, explained | kodwai";
const DESCRIPTION =
  "kodwai's AI Collaboration Score rates how well you direct an AI coding agent on a real challenge, from 0 to 100, across Direction, Outcome, and Lift.";

/* Own openGraph and twitter blocks replace the root ones, so the image is
   listed explicitly. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ai-collaboration-score" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: "/ai-collaboration-score", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [DEFAULT_OG_IMAGE.url] },
};

/* The starter challenge from the app's welcome flow leads the "try it" list. */
const STARTER_SLUG = "bookshelf-rest-api";

export default async function AiCollaborationScorePage() {
  const catalog = await withBuildFallback(listPublicChallenges, []);
  const starter = catalog.find((c) => c.slug === STARTER_SLUG) ?? null;
  const tryThese = [
    ...(starter ? [starter] : []),
    ...catalog.filter((c) => c.slug !== STARTER_SLUG).sort((a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty)),
  ].slice(0, 3);

  const url = `${SITE_URL}/ai-collaboration-score`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([["Home", "/"], ["AI Collaboration Score", "/ai-collaboration-score"]]),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "AI Collaboration Score for coding agents",
        description: DESCRIPTION,
        inLanguage: "en",
        dateModified: "2026-09-22",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <ScoreDefinitionView
        starter={starter}
        tryThese={tryThese}
        comparisons={publishedComparePages().map((p) => ({ slug: p.slug, competitor: p.competitor }))}
      />
    </>
  );
}
