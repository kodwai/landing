/* ══════════════════════════════════════════════════════════════════════════
   Canonical site identity. One source of truth for the host, the entity
   definition sentence, and the stable public profiles, so metadata, JSON-LD,
   robots.txt, the sitemap, and llms.txt never drift apart.

   The canonical host is www. The apex (kodwai.com) redirects to it, so every
   absolute URL we emit must use SITE_URL, never the apex.
   ══════════════════════════════════════════════════════════════════════════ */

export const SITE_URL = "https://www.kodwai.com";
export const APP_URL = "https://app.kodwai.com";
export const SITE_NAME = "kodwai";

/* The entity definition, verbatim from the kodwai-context fact sheet
   (.claude/skills/kodwai-context/references/facts.md). Use it unchanged
   wherever the site defines the product for machines (JSON-LD, llms.txt) so
   search and answer engines see one consistent description. If it changes,
   change it in both places. No em dashes. */
export const SITE_DEFINITION =
  "kodwai is a platform where developers solve real coding challenges on their own machine with their own AI coding agent (Claude Code, Cursor, or Codex) and get scored on how well they direct the agent, across three axes: Direction, Outcome, and Lift.";

/* The real CLI commands (see the @kodwai/cli README). */
export const CLI_CHALLENGE_COMMAND = "npx @kodwai/cli challenge <slug>";
export const CLI_SUBMIT_COMMAND = "npx @kodwai/cli submit";

/* Stable public profiles for JSON-LD sameAs. Only profiles verified to exist;
   no chat invites (they expire). */
export const SAME_AS = [
  "https://github.com/kodwai",
  "https://www.npmjs.com/package/@kodwai/cli",
  "https://www.producthunt.com/products/kodwai-launc",
  "https://x.com/kodwai_com",
];

/* The root file-based OG image. Pages that set their own openGraph block
   replace the inherited one (metadata merges shallowly), so they must list
   this image explicitly or they lose og:image. */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "kodwai · AI-Agent Coding Challenges for Developers",
};

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/* Normalize API timestamps for sitemaps and JSON-LD. SQLite datetime('now')
   yields "YYYY-MM-DD HH:MM:SS" in UTC with no zone marker; emit ISO 8601
   with an explicit Z. Values that already carry a zone pass through. */
export function toIsoUtc(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  const naive = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)$/.exec(v);
  const candidate = naive ? `${naive[1]}T${naive[2]}Z` : /^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T00:00:00Z` : v;
  const d = new Date(candidate);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

/* Serialize JSON-LD for an inline <script>, escaping "<" so content can never
   close the script tag early. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
