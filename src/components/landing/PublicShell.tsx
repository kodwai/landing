"use client";

/* ══════════════════════════════════════════════════════════════════════════
   Public, crawlable pages (/challenges, /challenges/<slug>,
   /ai-collaboration-score, /compare/<slug>): shared shell and building blocks.

   Same house style as the landing and /hiring (warm-light cream, Fraunces
   headlines, JetBrains Mono machine voice, Hanken Grotesk prose, one rust
   accent, square corners, hairlines), built only from ./system tokens. These
   pages exist for readers and crawlers, so nothing is hidden behind motion:
   no reveal choreography, every word is in the server-rendered HTML, and
   hovers are plain CSS. No em dashes in any copy.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  C, T, MAXW, PAD, TYPE, CSS_EASE,
  Serif, OutlineButton, PrimaryButton, GhostLink, diffStyle, track,
} from "./system";
import { FOOTER } from "./data";
import { type ChallengeSummary, capitalize, signupUrl, truncate } from "@/lib/challenges";

/* ─── Shell: sticky nav, content, footer ─── */
export function PublicShell({ section, campaign, children }: { section: string; campaign: string; children: ReactNode }) {
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.sans, position: "relative", zIndex: 2, overflowX: "hidden", minHeight: "100vh" }}>
      <PublicStyles />
      <div className="k-field" aria-hidden />
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, padding: `13px ${PAD}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
        background: "rgba(250,248,244,0.88)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <Link href="/" onClick={() => track("nav_logo_clicked", { page: section })} style={{ fontFamily: C.serif, fontWeight: 500, fontSize: 24, letterSpacing: "-0.01em", color: C.text, textDecoration: "none" }}>kodwai</Link>
          <span className="k-nav-blog" style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 1, textTransform: "uppercase" }}>{section}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link href="/challenges" className="k-nav-hire k-pub-navlink">challenges</Link>
          <Link href="/ai-collaboration-score" className="k-nav-hire k-pub-navlink">the score</Link>
          <OutlineButton label="start a challenge" href={signupUrl(campaign, "nav")} event="cta_clicked" eventProps={{ location: "public_nav", page: section }} />
        </div>
      </nav>

      <main style={{ position: "relative" }}>{children}</main>

      <footer style={{ borderTop: `1px solid ${C.line}`, padding: `clamp(48px, 6vw, 72px) ${PAD} clamp(30px, 4vw, 44px)` }}>
        <div className="k-pub-foot" style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
            <Link href="/" style={{ fontFamily: C.serif, fontWeight: 540, fontSize: 22, color: C.text, textDecoration: "none", width: "fit-content" }}>kodwai</Link>
            <span style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, letterSpacing: 0.6, lineHeight: 1.5 }}>{FOOTER.tagline}</span>
          </div>
          {FOOTER.columns.map((col) => (
            <nav key={col.head} aria-label={col.head} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ ...TYPE.label, fontSize: 10.5, color: C.faint }}>{col.head}</span>
              {col.links.map((l) => {
                // Homepage anchors (#how, #faq) only resolve on the homepage.
                const href = l.href.startsWith("#") ? `/${l.href}` : l.href;
                const external = href.startsWith("http") || href.startsWith("mailto:");
                return external
                  ? <a key={l.label} href={href} className="k-pub-footlink" target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" onClick={() => track("footer_link_clicked", { label: l.label, column: col.head, page: section })}>{l.label}</a>
                  : <Link key={l.label} href={href} className="k-pub-footlink" onClick={() => track("footer_link_clicked", { label: l.label, column: col.head, page: section })}>{l.label}</Link>;
              })}
            </nav>
          ))}
        </div>
        <div style={{ maxWidth: MAXW, margin: "clamp(36px, 5vw, 52px) auto 0", paddingTop: 22, borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint }}>© {new Date().getFullYear()} kodwai</span>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint }}>{FOOTER.tagline}</span>
        </div>
      </footer>
    </div>
  );
}

/* Scoped CSS for what inline styles cannot express (hover, focus, grids). */
function PublicStyles() {
  return (
    <style>{`
      .k-pub-navlink { font-family: ${C.mono}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${C.muted}; text-decoration: none; transition: color .25s ${CSS_EASE}; }
      .k-pub-navlink:hover { color: ${C.accent}; }
      .k-pub-footlink { font-family: ${C.mono}; font-size: 12.5px; color: ${C.muted}; letter-spacing: .2px; text-decoration: none; width: fit-content; transition: color .25s ${CSS_EASE}; }
      .k-pub-footlink:hover { color: ${C.accent}; }
      .k-pub-foot { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: clamp(28px, 4vw, 56px); align-items: start; }
      .k-pub-card { display: flex; flex-direction: column; text-decoration: none; border: 1px solid ${C.line}; background: ${C.panel}; padding: 22px 22px 18px; position: relative; transition: border-color .3s ${CSS_EASE}, transform .3s ${CSS_EASE}, box-shadow .3s ${CSS_EASE}; }
      .k-pub-card:hover { border-color: ${C.accent}; transform: translateY(-3px); box-shadow: 0 18px 38px -16px rgba(194,54,22,0.32); }
      .k-pub-card:hover .k-pub-go { transform: translateX(3px); }
      .k-pub-card:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
      .k-pub-link { color: ${C.accent}; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
      .k-pub-link:hover { color: ${C.accentDeep}; }
      .k-pub-table { width: 100%; border-collapse: collapse; min-width: 640px; }
      .k-pub-table th, .k-pub-table td { text-align: left; vertical-align: top; padding: 16px 18px 16px 0; border-top: 1px solid ${C.line}; }
      .k-pub-table thead th { border-top: none; }
      @media (max-width: 860px) { .k-pub-foot { grid-template-columns: 1fr 1fr; row-gap: 40px; } }
      @media (max-width: 520px) { .k-pub-foot { grid-template-columns: 1fr; row-gap: 34px; } }
    `}</style>
  );
}

/* ─── Layout primitives ─── */

export function Section({ children, tone = "cream", first = false, style }: { children: ReactNode; tone?: "cream" | "paper2"; first?: boolean; style?: CSSProperties }) {
  return (
    <section style={{
      background: tone === "paper2" ? C.paper2 : "transparent", position: "relative",
      padding: `${first ? "clamp(32px, 5vw, 56px)" : "clamp(56px, 8vw, 96px)"} ${PAD} clamp(56px, 8vw, 96px)`,
      borderTop: first ? undefined : `1px solid ${C.line}`, ...style,
    }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", position: "relative" }}>{children}</div>
    </section>
  );
}

/* Visible breadcrumb trail; the page adds the matching BreadcrumbList JSON-LD. */
export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, marginBottom: "clamp(28px, 4vw, 40px)" }}>
      <ol style={{ listStyle: "none", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, margin: 0, padding: 0 }}>
        {items.map((it, i) => (
          <li key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {i > 0 && <span aria-hidden style={{ color: C.lineBright }}>&rsaquo;</span>}
            {it.href
              ? <Link href={it.href} style={{ color: C.faint, textDecoration: "none" }}>{it.label}</Link>
              : <span aria-current="page" style={{ color: C.text }}>{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* Mono "// label" kicker above a heading (static; the landing Marker animates). */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 18px", fontFamily: C.mono, fontSize: 11.5, color: C.muted, letterSpacing: 1.6, textTransform: "lowercase" }}>
      <span style={{ color: C.accent }}>{"//"}</span>
      <span>{children}</span>
    </p>
  );
}

export function H2({ children, id, style }: { children: ReactNode; id?: string; style?: CSSProperties }) {
  return <Serif as="h2" size="h3" style={{ marginBottom: 18, scrollMarginTop: 90, ...style }}>{id ? <span id={id}>{children}</span> : children}</Serif>;
}

export function P({ children, lead, style }: { children: ReactNode; lead?: boolean; style?: CSSProperties }) {
  return <p style={{ ...(lead ? TYPE.bodyLg : TYPE.body), color: lead ? C.text : C.muted, margin: "0 0 16px", maxWidth: "68ch", ...style }}>{children}</p>;
}

/* Inline code in prose (light chip, not the dark terminal). */
export function Code({ children }: { children: ReactNode }) {
  return <code style={{ fontFamily: C.mono, fontSize: "0.86em", background: C.paper3, border: `1px solid ${C.line}`, padding: "1px 6px", color: C.text, wordBreak: "break-word" }}>{children}</code>;
}

export function DifficultyPill({ difficulty }: { difficulty: string }) {
  const ds = diffStyle[difficulty] || diffStyle.medium;
  return <span style={{ fontFamily: C.mono, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: ds.fg, background: ds.bg, padding: "3px 8px" }}>{difficulty}</span>;
}

/* ─── Copyable CLI command (dark terminal chip). Fires
   challenge_cli_command_copied with logged_in:false so anonymous visitors
   enter the same funnel as the app's copy button. ─── */
export function CopyCommand({ command, eventProps }: { command: string; eventProps: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: the command stays selectable */ }
    track("challenge_cli_command_copied", { ...eventProps, logged_in: false, source: "landing" });
  };
  return (
    <div style={{ display: "flex", alignItems: "stretch", border: `1px solid ${T.line}`, background: T.bg, maxWidth: "100%" }}>
      <code className="hide-scrollbar" style={{ flex: 1, minWidth: 0, fontFamily: C.mono, fontSize: 13, color: "#e8e6e1", padding: "13px 15px", overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: 10, alignItems: "center" }}>
        <span aria-hidden style={{ color: T.prompt }}>$</span>{command}
      </code>
      <button type="button" onClick={onCopy} aria-label={`Copy command: ${command}`} style={{
        flexShrink: 0, cursor: "pointer", border: "none", borderLeft: `1px solid ${T.line}`, background: copied ? "rgba(74,222,128,0.12)" : T.header,
        color: copied ? T.green : "#e8e6e1", fontFamily: C.mono, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", padding: "0 16px",
        transition: `background .25s ${CSS_EASE}, color .25s ${CSS_EASE}`,
      }}>
        <span aria-live="polite">{copied ? "copied" : "copy"}</span>
      </button>
    </div>
  );
}

/* ─── Challenge card linking to its public page ─── */
export function ChallengeCard({ c, headingLevel = "h3" }: { c: ChallengeSummary; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link href={`/challenges/${c.slug}`} className="k-pub-card" onClick={() => track("challenge_clicked", { slug: c.slug, difficulty: c.difficulty, category: c.category, minutes: c.time_limit_minutes, location: "public_page" })}>
      <span style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <DifficultyPill difficulty={c.difficulty} />
        <span style={{ fontFamily: C.mono, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: C.faint }}>{c.category}</span>
      </span>
      <H style={{ ...TYPE.monoTitle, fontSize: 17, margin: "0 0 10px", color: C.text, lineHeight: 1.28 }}>{c.title}</H>
      <span style={{ fontFamily: C.sans, fontSize: 14, lineHeight: 1.56, color: C.muted }}>{truncate(c.description, 150)}</span>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 18 }}>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4 }}>~{c.time_limit_minutes} min</span>
        <span className="k-pub-go" style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: C.accent, transition: `transform .3s ${CSS_EASE}` }}>details <span aria-hidden>&rarr;</span></span>
      </span>
    </Link>
  );
}

export function ChallengeGrid({ challenges }: { challenges: ChallengeSummary[] }) {
  return (
    <div className="k-chal-grid">
      {challenges.map((c) => <ChallengeCard key={c.slug} c={c} />)}
    </div>
  );
}

/* ─── The three axes, in the live site's own words (Score.tsx, data.ts FAQ).
   Signal labels match the app. Descriptions mirror the API's signal metadata
   (api/app/services/scoring/config.py SIGNAL_META). ─── */
export const SCORE_AXES = [
  {
    name: "Direction", line: "how you steer, verify, and decompose.",
    signals: [
      { label: "Spec Precision", desc: "Stating clear requirements and constraints before writing code." },
      { label: "Verification Rigor", desc: "Checking the AI's output, catching mistakes, pushing back." },
      { label: "Decomposition", desc: "Breaking the problem into ordered steps instead of one mega-prompt." },
      { label: "Recovery", desc: "Redirecting effectively when the AI goes down the wrong path." },
      { label: "Intent Fidelity", desc: "The final solution matches what you actually asked for." },
      { label: "Engagement", desc: "Staying engaged and iterating, instead of pasting the spec and walking away." },
    ],
  },
  {
    name: "Outcome", line: "what shipped, replayed and stress-tested to prove it holds.",
    signals: [
      { label: "Tests", desc: "Share of the challenge's tests your solution passes." },
      { label: "Code Quality", desc: "Clean, readable code without obvious smells." },
      { label: "Complexity", desc: "Reasonable structure and nesting." },
    ],
  },
  {
    name: "Lift", line: "how far you beat a solo AI, not just that you passed.",
    signals: [
      { label: "Edge-Case Coverage", desc: "Handling subtle requirements a careless one-shot would miss." },
      { label: "Lift over AI", desc: "How far you out-perform a solo AI on this challenge." },
    ],
  },
] as const;

export function ScoreAxes({ detailed = false, headingLevel = "h3" }: { detailed?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="k-grid-3" style={{ gap: "clamp(20px, 3vw, 32px)" }}>
      {SCORE_AXES.map((axis) => (
        <div key={axis.name} style={{ borderTop: `2px solid ${C.accent}`, paddingTop: 18 }}>
          <H style={{ ...TYPE.monoTitle, margin: "0 0 8px", color: C.text }}>{axis.name}</H>
          <p style={{ ...TYPE.body, fontSize: 16, color: C.muted, margin: "0 0 14px" }}>{capitalize(axis.line)}</p>
          {detailed ? (
            <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {axis.signals.map((s) => (
                <div key={s.label}>
                  <dt style={{ fontFamily: C.mono, fontSize: 12.5, color: C.text, fontWeight: 600 }}>{s.label}</dt>
                  <dd style={{ margin: "2px 0 0", fontFamily: C.sans, fontSize: 14.5, lineHeight: 1.5, color: C.muted }}>{s.desc}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p style={{ fontFamily: C.mono, fontSize: 11.5, lineHeight: 1.7, color: C.faint, margin: 0 }}>
              {axis.signals.map((s) => s.label).join(" · ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Closing call to action: free signup with UTM tags ─── */
export function SignupBand({ campaign, content, heading, body, secondary }: {
  campaign: string; content: string; heading: ReactNode; body: string;
  secondary?: { label: string; href: string; kicker?: string };
}) {
  return (
    <Section tone="paper2">
      <div style={{ maxWidth: 760 }}>
        <Serif as="h2" size="h2" style={{ marginBottom: 18 }}>{heading}</Serif>
        <P>{body}</P>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 26px", marginTop: 26 }}>
          <PrimaryButton label="Create a free account" large href={signupUrl(campaign, content)} event="cta_clicked" eventProps={{ location: "public_page_cta", page: campaign, content }} />
          {secondary && <GhostLink label={secondary.label} kicker={secondary.kicker} href={secondary.href} event="cta_clicked" eventProps={{ location: "public_page_cta_secondary", page: campaign, content }} />}
        </div>
      </div>
    </Section>
  );
}

/* Fire one event when a public page mounts. */
export function useTrackOnce(event: string, props: Record<string, unknown>) {
  const key = JSON.stringify(props);
  useEffect(() => {
    track(event, JSON.parse(key));
  }, [event, key]);
}
