import OptionE, { type Challenge } from "@/components/OptionE";
import { turso } from "@/lib/turso";

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

const SITE = "https://kodwai.com";
const DESCRIPTION =
  "Solve real-world coding challenges on your own machine with your preferred AI agent: Claude Code, Cursor, and more. Compete on leaderboards, build your profile, and prove your AI collaboration skills.";

// Structured data so search engines and AI answer engines can classify kodwai
// from schema rather than guessing the category from prose.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "kodwai",
      url: SITE,
      description: DESCRIPTION,
      logo: `${SITE}/icon`,
      sameAs: ["https://x.com/kodwai_com", "https://discord.gg/d663XRC7"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "kodwai",
      description: DESCRIPTION,
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "WebApplication",
      name: "kodwai",
      url: SITE,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description: DESCRIPTION,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <OptionE challenges={challenges} />
    </>
  );
}
