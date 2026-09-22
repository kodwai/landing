import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";
import type { Challenge } from "@/components/landing/system";
import { turso } from "@/lib/turso";
import {
  APP_URL, ORGANIZATION_ID, SAME_AS, SITE_DEFINITION, SITE_NAME, SITE_URL, WEBSITE_ID, jsonLdScript,
} from "@/lib/site";

// Refresh the challenge catalog from Turso every 5 minutes.
export const revalidate = 300;

async function getChallenges(): Promise<Challenge[]> {
  try {
    const res = await turso.execute(
      "select slug, title, description, difficulty, category, time_limit_minutes from challenges where is_public = 1 order by is_featured desc, submission_count desc, title"
    );
    return res.rows.map((r) => ({
      slug: String(r.slug),
      title: String(r.title),
      description: String(r.description ?? ""),
      difficulty: String(r.difficulty ?? "medium"),
      category: String(r.category ?? "backend"),
      minutes: Number(r.time_limit_minutes ?? 60),
    }));
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Structured data so search engines and AI answer engines can classify kodwai
// from schema rather than guessing the category from prose. Every @id and url
// uses the canonical www host; the description is the shared entity definition.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: SITE_DEFINITION,
      logo: `${SITE_URL}/icon`,
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DEFINITION,
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: SITE_NAME,
      url: APP_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description: SITE_DEFINITION,
      publisher: { "@id": ORGANIZATION_ID },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default async function Home() {
  const challenges = await getChallenges();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <LandingPage challenges={challenges} />
    </>
  );
}
