<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the kodwai landing page. Here's what was set up:

**Infrastructure:**
- `instrumentation-client.ts` — initializes `posthog-js` at app startup using Next.js 15.3+ instrumentation pattern, with reverse proxy routing and error tracking enabled
- `src/lib/posthog-server.ts` — singleton `posthog-node` client for server-side event capture
- `next.config.ts` — reverse proxy rewrites added (`/ingest/*` → `us.i.posthog.com`, `/ingest/static/*` and `/ingest/array/*` → `us-assets.i.posthog.com`)
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set

**Events instrumented:**

| Event | Description | File |
|---|---|---|
| `waitlist_signed_up` | Server-side capture when an email joins the waitlist. Includes `email` and `is_existing_signup` flag. | `src/app/api/waitlist/route.ts` |
| `cta_clicked` | Fired when any primary CTA or ghost link is clicked. Includes `label` (and `kicker` for ghost links). | `src/components/OptionE.tsx` |
| `open_app_clicked` | Fired when the "open app" nav link is clicked. Includes `location: "nav"`. | `src/components/OptionE.tsx` |
| `challenge_clicked` | Fired when a challenge card is clicked. Includes `slug`, `difficulty`, `category`, and `minutes`. | `src/components/OptionE.tsx` |
| `challenge_category_filtered` | Fired when user selects a challenge category pill. Includes `category` and `count`. | `src/components/OptionE.tsx` |
| `challenges_expanded` | Fired when user toggles show-all / show-fewer for challenges. Includes `expanded` (bool) and `category`. | `src/components/OptionE.tsx` |
| `demo_video_interacted` | Fired on hero video controls. Includes `action`: `"play"`, `"pause"`, `"mute"`, `"unmute"`, or `"fullscreen"`. | `src/components/OptionE.tsx` |
| `pitch_deck_slide_viewed` | Fired when a pitch deck slide scrolls into view. Includes `slide_id` and `slide_index`. | `src/app/pitch/page.tsx` |

## Next steps

We've built a dashboard and insights for you to keep an eye on user behavior:

- [Analytics basics dashboard](/dashboard/1642339)
- [Waitlist signups over time](/insights/qVyw5dCN)
- [CTA clicks by label](/insights/YZAYpqe4)
- [Challenge clicks by category](/insights/ZuOLa6OO)
- [Landing page engagement overview](/insights/PU5mkrFd)
- [Demo video interactions](/insights/GGT4nNbS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
