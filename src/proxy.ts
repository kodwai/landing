import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

/* ══════════════════════════════════════════════════════════════════════════
   AI and search crawler logging (Next 16 proxy, formerly middleware).

   For every request from a known search, answer, or training crawler, send
   one server-side PostHog `ai_crawler_hit` event, first-party and free. The
   capture runs in waitUntil, after the response is on its way, and a failed
   capture is swallowed: the proxy never blocks, rewrites, or alters a
   response. The config matcher only invokes it for crawler user agents, so
   human traffic never runs this code at all. /ingest (the PostHog proxy
   rewrites) and static assets are excluded.

   The response status is not known here (the proxy runs before routing), so
   the event records the request only. Keep BOTS and the matcher regex in sync;
   the monthly drift check diffs both against the vendors' crawler docs.
   ══════════════════════════════════════════════════════════════════════════ */

type BotKind = "search" | "user-fetch" | "training" | "other";

/* Case-sensitive user agent tokens, as each vendor publishes them. */
const BOTS: { token: string; kind: BotKind }[] = [
  { token: "OAI-SearchBot", kind: "search" },
  { token: "ChatGPT-User", kind: "user-fetch" },
  { token: "GPTBot", kind: "training" },
  { token: "Claude-SearchBot", kind: "search" },
  { token: "Claude-User", kind: "user-fetch" },
  { token: "ClaudeBot", kind: "training" },
  { token: "PerplexityBot", kind: "search" },
  { token: "Perplexity-User", kind: "user-fetch" },
  { token: "Googlebot", kind: "search" },
  { token: "bingbot", kind: "search" },
  { token: "Applebot", kind: "search" },
  { token: "DuckAssistBot", kind: "search" },
  { token: "meta-externalagent", kind: "training" },
  { token: "CCBot", kind: "training" },
  { token: "Amazonbot", kind: "other" },
];

const POSTHOG_TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const POSTHOG_HOST = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/+$/, "");

function captureCrawlerHit(request: NextRequest, bot: { token: string; kind: BotKind }, ua: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fetch(`${POSTHOG_HOST}/batch/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: POSTHOG_TOKEN,
      sent_at: new Date().toISOString(),
      batch: [
        {
          event: "ai_crawler_hit",
          distinct_id: `crawler:${bot.token}`,
          timestamp: new Date().toISOString(),
          properties: {
            bot: bot.token,
            bot_kind: bot.kind,
            path: request.nextUrl.pathname,
            host: request.headers.get("host") ?? request.nextUrl.host,
            method: request.method,
            user_agent: ua.slice(0, 512),
            $current_url: request.url,
            $process_person_profile: false,
            $lib: "kodwai-landing-proxy",
            // Our own seo-audit probes spoof crawler user agents; hogql.md filters these out.
            ...(request.headers.get("x-kodwai-probe") ? { probe: true } : {}),
            ...(ip ? { $ip: ip } : {}),
          },
        },
      ],
    }),
    signal: AbortSignal.timeout(3000),
  })
    .then(() => undefined)
    .catch(() => undefined);
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const ua = request.headers.get("user-agent") ?? "";
  const { pathname } = request.nextUrl;
  const bot = BOTS.find((b) => ua.includes(b.token));

  if (bot && POSTHOG_TOKEN && !pathname.startsWith("/ingest")) {
    event.waitUntil(captureCrawlerHit(request, bot, ua));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      // Everything except the PostHog ingest proxy, Next internals, and
      // static assets. robots.txt, sitemap.xml, llms.txt stay in on purpose.
      source:
        "/((?!ingest|_next/static|_next/image|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|woff2?|ttf|otf|css|js|map)$).*)",
      // Only crawler user agents invoke the proxy. Mirrors BOTS above.
      has: [
        {
          type: "header",
          key: "user-agent",
          value:
            ".*(?:OAI-SearchBot|ChatGPT-User|GPTBot|Claude-SearchBot|Claude-User|ClaudeBot|PerplexityBot|Perplexity-User|Googlebot|bingbot|Applebot|DuckAssistBot|meta-externalagent|CCBot|Amazonbot).*",
        },
      ],
    },
  ],
};
