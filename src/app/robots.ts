import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* robots.txt
   Everything is crawlable except the PostHog ingest proxy and API routes.
   Search and answer bots are named explicitly so the intent is unambiguous
   (a site that blocks OAI-SearchBot is not shown in ChatGPT search answers).
   Training crawlers are allowed on purpose, so the brand enters future model
   knowledge. A crawler that matches a named group ignores the "*" group, so
   every group repeats the same disallow list.
   Never disallow /pitch: its noindex only works if the page can be crawled. */

const DISALLOW = ["/ingest/", "/api/"];

const SEARCH_AND_ANSWER_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: SEARCH_AND_ANSWER_BOTS, allow: "/", disallow: DISALLOW },
      { userAgent: TRAINING_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
