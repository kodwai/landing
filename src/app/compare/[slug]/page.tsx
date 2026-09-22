import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CompareView from "./CompareView";
import { DEFAULT_OG_IMAGE, ORGANIZATION_ID, SITE_URL, jsonLdScript } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/challenges";
import { LAST_REVIEWED, getComparePage, publishedComparePages } from "@/lib/compare";

// Fully static: the copy lives in lib/compare.ts. Unknown or unpublished
// slugs are a real 404.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return publishedComparePages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();
  // The title already leads with the brand ("kodwai vs ..."), so no suffix.
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/compare/${page.slug}` },
    openGraph: {
      title: page.title, description: page.description, type: "article", url: `/compare/${page.slug}`,
      modifiedTime: `${LAST_REVIEWED}T00:00:00Z`, images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [DEFAULT_OG_IMAGE.url] },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  const url = `${SITE_URL}/compare/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([["Home", "/"], [`kodwai vs ${page.competitor}`, `/compare/${page.slug}`]]),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en",
        dateModified: LAST_REVIEWED,
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };

  const siblings = publishedComparePages()
    .filter((p) => p.slug !== page.slug)
    .map((p) => ({ slug: p.slug, competitor: p.competitor }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <CompareView page={page} siblings={siblings} />
    </>
  );
}
