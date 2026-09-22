/* ══════════════════════════════════════════════════════════════════════════
   Public challenge catalog, read from the kodwai API for the server-rendered
   /challenges pages, the sitemap, and /ai-collaboration-score.

   Shapes mirror api/app/schemas/challenge.py (ChallengeListResponse,
   ChallengeResponse). Only public challenges ever render: the list endpoint
   filters is_public = 1, and the detail helper rejects anything that is not
   is_public, so a draft can never become a page even if the detail endpoint
   returns it.

   Plain module (no "use client"): server pages import the fetch helpers,
   client views import the link helpers.
   ══════════════════════════════════════════════════════════════════════════ */

import { APP_URL, SITE_URL } from "@/lib/site";

const API_URL = process.env.API_URL || "http://localhost:8000";

/* ISR window for every challenge fetch and page (seconds). */
export const CHALLENGES_REVALIDATE = 900;

export type ChallengeSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
  time_limit_minutes: number;
};

export type ChallengeDetail = ChallengeSummary & {
  is_public: boolean;
  created_at: string;
  updated_at: string;
  /* Not served by the API today; see publicScoreStats. */
  public_stats?: unknown;
};

/* Sibling API routes that share the /api/challenges/{x} path but are not
   challenges, plus anything that is not a plain slug (the detail endpoint also
   matches by id, which would duplicate a page under a second URL). */
const RESERVED_SLUGS = new Set(["featured", "categories", "daily"]);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isChallengeSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && !RESERVED_SLUGS.has(slug);
}

function toSummary(raw: Record<string, unknown>): ChallengeSummary | null {
  if (typeof raw.slug !== "string" || typeof raw.title !== "string" || !isChallengeSlug(raw.slug)) return null;
  return {
    id: String(raw.id ?? raw.slug),
    title: raw.title,
    slug: raw.slug,
    description: typeof raw.description === "string" ? raw.description : "",
    difficulty: typeof raw.difficulty === "string" ? raw.difficulty : "medium",
    category: typeof raw.category === "string" ? raw.category : "backend",
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === "string") : [],
    time_limit_minutes: Number(raw.time_limit_minutes ?? 60),
  };
}

const PAGE_SIZE = 100; // the API caps limit at 100
const MAX_PAGES = 5;

/* Every public challenge, easy to hard, then by title. Throws when the API is
   unreachable so callers choose their own fallback (the sitemap and
   generateStaticParams degrade to empty; pages keep their last ISR copy). */
export async function listPublicChallenges(): Promise<ChallengeSummary[]> {
  const out: ChallengeSummary[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`${API_URL}/api/challenges?sort=difficulty&limit=${PAGE_SIZE}&page=${page}`, {
      next: { revalidate: CHALLENGES_REVALIDATE },
    });
    if (!res.ok) throw new Error(`Challenges API returned ${res.status}`);
    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) throw new Error("Challenges API returned a non-list body");
    for (const row of rows) {
      const c = row && typeof row === "object" ? toSummary(row as Record<string, unknown>) : null;
      if (c) out.push(c);
    }
    if (rows.length < PAGE_SIZE) break;
  }
  return out.sort((a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty) || a.title.localeCompare(b.title));
}

/* Null only when the challenge does not exist or is not public. Any other
   failure throws, so an API outage never turns a real challenge into a 404:
   ISR keeps the last good page, and an uncached page returns a 5xx. */
export async function getPublicChallenge(slug: string): Promise<ChallengeDetail | null> {
  if (!isChallengeSlug(slug)) return null;
  const res = await fetch(`${API_URL}/api/challenges/${encodeURIComponent(slug)}`, {
    next: { revalidate: CHALLENGES_REVALIDATE },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Challenges API returned ${res.status} for "${slug}"`);
  const raw = (await res.json()) as Record<string, unknown>;
  const summary = raw && typeof raw === "object" ? toSummary(raw) : null;
  // Exact slug match: the endpoint also resolves ids, which must not render.
  if (!summary || summary.slug !== slug || raw.is_public !== true) return null;
  return {
    ...summary,
    is_public: true,
    created_at: String(raw.created_at ?? ""),
    updated_at: String(raw.updated_at ?? ""),
    public_stats: raw.public_stats,
  };
}

/* An API outage must not fail `next build`, so during the build a loader
   falls back (empty catalog, no prerendered pages). At runtime the error is
   rethrown instead: ISR then keeps serving the last good copy rather than
   caching an empty page. */
export async function withBuildFallback<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (err) {
    if (process.env.NEXT_PHASE === "phase-production-build") return fallback;
    throw err;
  }
}

/* ── Score statistics gate ──
   Numbers appear on a challenge page only when the API reports at least
   MIN_REAL_SCORED_FOR_STATS real scored submissions for it, with demo
   (@demo.kodwai.dev) and internal accounts excluded. The API does not serve
   such a count today: the submission_count and avg_score columns include the
   seeded demo cohort, so they are never read here and every page shows no
   numbers. The expected contract, if the API adds it, is
   public_stats: { real_scored_submissions: int, median_score: float | null }.
   30 matches the kodwai-context rule: no aggregate statistics from kodwai
   data below 30 real scored submissions. */
export const MIN_REAL_SCORED_FOR_STATS = 30;

export type ChallengeScoreStats = { realScoredSubmissions: number; medianScore: number };

export function publicScoreStats(c: Pick<ChallengeDetail, "public_stats">): ChallengeScoreStats | null {
  const s = c.public_stats;
  if (!s || typeof s !== "object") return null;
  const n = (s as Record<string, unknown>).real_scored_submissions;
  const median = (s as Record<string, unknown>).median_score;
  if (typeof n !== "number" || !Number.isInteger(n) || n < MIN_REAL_SCORED_FOR_STATS) return null;
  if (typeof median !== "number" || !Number.isFinite(median) || median < 0 || median > 100) return null;
  return { realScoredSubmissions: n, medianScore: Math.round(median) };
}

/* ── Display helpers ── */

export function difficultyRank(d: string): number {
  return d === "easy" ? 0 : d === "medium" ? 1 : d === "hard" ? 2 : 3;
}

export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/* Cut to at most `max` characters on a word boundary, for meta descriptions. */
export function truncate(text: string, max = 155): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 3);
  const atSpace = cut.lastIndexOf(" ");
  return `${(atSpace > max * 0.6 ? cut.slice(0, atSpace) : cut).replace(/[\s,.;:]+$/, "")}...`;
}

export const challengeCommand = (slug: string) => `npx @kodwai/cli challenge ${slug}`;

/* ── Links into the app ──
   Every signup link from a public page carries UTM tags so PostHog and GA4
   can tell which page and which challenge sent the visitor. */
export function signupUrl(campaign: string, content?: string): string {
  const params = new URLSearchParams({ utm_source: "kodwai.com", utm_medium: "public_page", utm_campaign: campaign });
  if (content) params.set("utm_content", content);
  return `${APP_URL}/signup?${params.toString()}`;
}

export const appChallengeUrl = (slug: string) => `${APP_URL}/dev/challenges/${encodeURIComponent(slug)}`;

/* ── Structured data shared by the public pages ──
   BreadcrumbList for a trail of [name, path] pairs; the last item is the
   current page. Paths are site-relative ("/challenges"). */
export function breadcrumbJsonLd(trail: [name: string, path: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    })),
  };
}
