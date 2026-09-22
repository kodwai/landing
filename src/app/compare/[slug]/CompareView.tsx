"use client";

/* /compare/<slug>: an honest comparison, rendered from lib/compare.ts.
   Structure (content-studio page-patterns): answer first, what each product
   is, where they differ, "choose them if" and "choose kodwai if", how we
   compared, numbered sources, and a "how this was made" note. Every claim
   about the competitor carries a citation to a dated source. */

import Link from "next/link";
import { C, TYPE, Serif, Accent } from "@/components/landing/system";
import { PublicShell, Section, Crumbs, Kicker, H2, P, SignupBand } from "@/components/landing/PublicShell";
import { type Cited, type ComparePage, LAST_REVIEWED } from "@/lib/compare";

const BYLINE = "Ege Hakan Karaagac, co-founder of kodwai";

/* Text followed by numbered citation links into the sources list. */
function CitedText({ c, order }: { c: Cited; order: string[] }) {
  return (
    <>
      {c.text}
      {(c.cite ?? []).map((id) => ({ id, n: order.indexOf(id) + 1 })).sort((a, b) => a.n - b.n).map(({ id, n }) => {
        return n > 0 ? (
          <sup key={id} style={{ fontFamily: C.mono, fontSize: "0.7em", marginLeft: 3 }}>
            <a href={`#source-${id}`} className="k-pub-link" style={{ textDecoration: "none" }} aria-label={`Source ${n}`}>[{n}]</a>
          </sup>
        ) : null;
      })}
    </>
  );
}

export default function CompareView({ page, siblings }: { page: ComparePage; siblings: { slug: string; competitor: string }[] }) {
  const order = page.sources.map((s) => s.id);
  const campaign = `compare_${page.slug}`;

  return (
    <PublicShell section="compare" campaign={campaign}>
      <Section first>
        <Crumbs items={[{ label: "Home", href: "/" }, { label: `kodwai vs ${page.competitor}` }]} />
        <Kicker>honest comparison</Kicker>
        <Serif as="h1" size="h2" style={{ marginBottom: 18 }}>
          kodwai vs <Accent>{page.competitor}</Accent>
        </Serif>
        <p style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, letterSpacing: 0.4, margin: "0 0 28px", lineHeight: 1.7 }}>
          By {BYLINE} <span style={{ color: C.accent }}>·</span> Last reviewed <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
        </p>
        {page.answer.map((c, i) => (
          <P key={i} lead style={{ maxWidth: "66ch" }}><CitedText c={c} order={order} /></P>
        ))}
      </Section>

      <Section>
        <div className="k-split-even">
          <div>
            <H2>What {page.competitor} is</H2>
            {page.competitorIs.map((c, i) => <P key={i}><CitedText c={c} order={order} /></P>)}
          </div>
          <div>
            <H2>What kodwai is</H2>
            {page.kodwaiIs.map((c, i) => <P key={i}><CitedText c={c} order={order} /></P>)}
          </div>
        </div>
      </Section>

      <Section>
        <H2>Where they differ</H2>
        <div className="hide-scrollbar" style={{ overflowX: "auto", marginTop: 12 }}>
          <table className="k-pub-table">
            <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              {page.competitor} and kodwai compared, as of {LAST_REVIEWED}
            </caption>
            <thead>
              <tr>
                <th scope="col" style={{ ...TYPE.label, fontSize: 10.5, color: C.faint, width: "22%" }}>Aspect</th>
                <th scope="col" style={{ ...TYPE.label, fontSize: 10.5, color: C.faint, width: "39%" }}>{page.competitor}</th>
                <th scope="col" style={{ ...TYPE.label, fontSize: 10.5, color: C.accent, width: "39%" }}>kodwai</th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((r) => (
                <tr key={r.aspect}>
                  <th scope="row" style={{ fontFamily: C.mono, fontSize: 12.5, fontWeight: 600, color: C.text }}>{r.aspect}</th>
                  <td style={{ fontFamily: C.sans, fontSize: 15, lineHeight: 1.55, color: C.muted }}><CitedText c={r.them} order={order} /></td>
                  <td style={{ fontFamily: C.sans, fontSize: 15, lineHeight: 1.55, color: C.text }}><CitedText c={r.kodwai} order={order} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="k-split-even">
          {[
            { title: `Choose ${page.competitor} if`, items: page.chooseThem, accent: false },
            { title: "Choose kodwai if", items: page.chooseKodwai, accent: true },
          ].map((col) => (
            <div key={col.title} style={{ border: `1px solid ${col.accent ? C.accent : C.line}`, background: C.panel, padding: "clamp(22px, 3vw, 30px)" }}>
              <h2 style={{ ...TYPE.h3, color: C.text, margin: "0 0 16px" }}>{col.title}</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.items.map((c, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8, ...TYPE.body, fontSize: 16, color: C.muted }}>
                    <span aria-hidden style={{ color: col.accent ? C.accent : C.faint, fontFamily: C.mono }}>&rarr;</span>
                    <span><CitedText c={c} order={order} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {page.closing && <P style={{ marginTop: 28, marginBottom: 0 }}>{page.closing}</P>}
      </Section>

      <Section>
        <H2>How we compared</H2>
        <P>{page.method}</P>

        <h2 id="sources" style={{ ...TYPE.monoTitle, margin: "34px 0 14px", color: C.text, scrollMarginTop: 90 }}>Sources</h2>
        <ol style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 10, maxWidth: "80ch" }}>
          {page.sources.map((s) => (
            <li key={s.id} id={`source-${s.id}`} style={{ ...TYPE.body, fontSize: 15, color: C.muted, scrollMarginTop: 90 }}>
              <a href={s.url} className="k-pub-link" target="_blank" rel="noopener noreferrer">{s.label}</a>, read {LAST_REVIEWED}.
            </li>
          ))}
        </ol>

        <h2 style={{ ...TYPE.monoTitle, margin: "34px 0 14px", color: C.text }}>How this was made</h2>
        <P style={{ marginBottom: 0 }}>
          This page was drafted with help from Claude, an AI model, from kodwai&apos;s own product facts and the public
          sources listed above, read on {LAST_REVIEWED}. Every statement about {page.competitor} links to one of
          those sources. If something here is wrong or out of date, email{" "}
          <a href="mailto:hakan@kodwai.com" className="k-pub-link">hakan@kodwai.com</a>.
        </P>
      </Section>

      <Section>
        <H2>Keep reading</H2>
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexWrap: "wrap", gap: "12px 28px" }}>
          <li><Link href="/ai-collaboration-score" className="k-pub-link" style={{ fontFamily: C.mono, fontSize: 13 }}>How the AI Collaboration Score for coding agents works</Link></li>
          <li><Link href="/challenges" className="k-pub-link" style={{ fontFamily: C.mono, fontSize: 13 }}>Browse the public challenges</Link></li>
          {siblings.map((s) => (
            <li key={s.slug}><Link href={`/compare/${s.slug}`} className="k-pub-link" style={{ fontFamily: C.mono, fontSize: 13 }}>kodwai vs {s.competitor}</Link></li>
          ))}
        </ul>
      </Section>

      <SignupBand
        campaign={campaign}
        content="closing"
        heading={<>See how you <Accent>direct an agent.</Accent></>}
        body="Pick a public challenge, solve it with Claude Code, Cursor, or Codex on your own machine, and get scored on Direction, Outcome, and Lift. Free for developers."
        secondary={{ kicker: "hiring?", label: "kodwai for hiring", href: "/hiring" }}
      />
    </PublicShell>
  );
}
