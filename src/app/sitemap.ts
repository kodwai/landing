import type { MetadataRoute } from "next";
import { SITE_URL, toIsoUtc } from "@/lib/site";
import { getPublicChallenge, listPublicChallenges } from "@/lib/challenges";
import { LAST_REVIEWED, publishedComparePages } from "@/lib/compare";

const API_URL = process.env.API_URL || "http://localhost:8000";

// Rebuild the sitemap at most once an hour.
export const revalidate = 3600;

/* Canonical www URLs only, each a direct 200 with a self canonical. No
   priority or changefreq (Google ignores both). lastModified is a real content
   change date, never the build time: bump a static date only when that page's
   visible content changes. /pitch and /pitch-short are noindex and stay out. */

type Entry = MetadataRoute.Sitemap[number];

// The root is written without a trailing slash so it matches, character for
// character, the canonical Next renders for "/".
const url = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

/* Hand-maintained pages and the date their content last changed. */
const STATIC_ROUTES: { path: string; lastModified: string }[] = [
  { path: "/", lastModified: "2026-09-22T00:00:00Z" },
  { path: "/hiring", lastModified: "2026-06-25T00:00:00Z" },
  { path: "/ai-collaboration-score", lastModified: "2026-09-22T00:00:00Z" },
];

/* The /blog index moves when a post does, so it is derived from the posts. */
const BLOG_INDEX_FALLBACK = "2026-06-25T00:00:00Z";

async function blogRoutes(): Promise<Entry[]> {
  let posts: { slug: string; published_at: string | null; updated_at: string | null }[] = [];
  try {
    const res = await fetch(`${API_URL}/api/blog/sitemap`, { next: { revalidate: 3600 } });
    if (res.ok) posts = await res.json();
  } catch {
    // API unreachable: still list the index so the sitemap never goes empty.
  }

  const entries: Entry[] = posts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: toIsoUtc(post.updated_at) ?? toIsoUtc(post.published_at),
  }));

  const newest = entries
    .map((e) => e.lastModified as string | undefined)
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();

  return [{ url: url("/blog"), lastModified: newest ?? BLOG_INDEX_FALLBACK }, ...entries];
}

/* Public challenge pages. A page changes when its challenge record does
   (updated_at) or when the shared page template does (bump
   CHALLENGE_PAGES_CONTENT_DATE only for a visible template change). The
   /challenges index moves with the newest of those. */
const CHALLENGE_PAGES_CONTENT_DATE = "2026-09-22T00:00:00Z";

const latest = (...dates: (string | undefined)[]) =>
  dates.filter((d): d is string => Boolean(d)).sort().pop();

async function challengeRoutes(): Promise<Entry[]> {
  const list = await listPublicChallenges();
  const details = await Promise.all(
    list.map(async (c) => {
      try {
        const d = await getPublicChallenge(c.slug);
        return d ? { slug: d.slug, updated: toIsoUtc(d.updated_at) ?? toIsoUtc(d.created_at) } : null;
      } catch {
        // Detail unreachable: keep the URL, dated by the template.
        return { slug: c.slug, updated: undefined };
      }
    }),
  );
  const entries: Entry[] = details
    .filter((d): d is { slug: string; updated: string | undefined } => d !== null)
    .map((d) => ({ url: url(`/challenges/${d.slug}`), lastModified: latest(d.updated, CHALLENGE_PAGES_CONTENT_DATE) }));
  const newest = latest(CHALLENGE_PAGES_CONTENT_DATE, ...entries.map((e) => e.lastModified as string | undefined));
  return [{ url: url("/challenges"), lastModified: newest }, ...entries];
}

/* Comparison pages move only when they are re-reviewed (LAST_REVIEWED). */
async function compareRoutes(): Promise<Entry[]> {
  return publishedComparePages().map((p) => ({ url: url(`/compare/${p.slug}`), lastModified: `${LAST_REVIEWED}T00:00:00Z` }));
}

/* Every dynamic section contributes one async source. To add a section
   (public challenges, comparison pages, ...), write a function that returns
   its entries and append it here. A failing source drops only its own URLs. */
const SOURCES: (() => Promise<Entry[]>)[] = [blogRoutes, challengeRoutes, compareRoutes];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: Entry[] = STATIC_ROUTES.map((r) => ({ url: url(r.path), lastModified: r.lastModified }));
  const dynamic = await Promise.all(SOURCES.map((source) => source().catch(() => [] as Entry[])));
  return [...staticEntries, ...dynamic.flat()];
}
