"use client";

/* ══════════════════════════════════════════════════════════════════════════
   /hiring — the B2B interview track, told as a full editorial page that
   mirrors the developer landing's house style (warm-light cream, Fraunces
   serif headlines + JetBrains Mono machine voice, two warm-dark punctuation
   bands) and stays HONEST to what is actually built: custom interview
   projects, one-link invites, a live observation dashboard, AI + manual
   scoring against a custom rubric, candidate compare, and team roles. No ATS,
   no billing, no template library, no video scrubber. Each band is its own
   component under ./sections/hiring, built against ./system + ./data.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  C, MAXW, PAD, SECTION_PAD, CSS_EASE,
  Serif, Accent, PrimaryButton, GhostLink, OutlineButton,
  useChoreography, useDrawOnView, track,
} from "./system";
import { HIRING_FOOTER } from "./data";

import Hero from "./sections/hiring/Hero";
import Premise from "./sections/hiring/Premise";
import HowCandidatesWork from "./sections/hiring/HowCandidatesWork";
import LiveSession from "./sections/hiring/LiveSession";
import Scoring from "./sections/hiring/Scoring";
import Stats from "./sections/hiring/Stats";
import NothingToConnect from "./sections/hiring/NothingToConnect";
import Faq from "./sections/hiring/Faq";

/* ─── Scroll-progress hairline ─── */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setP(max > 0 ? h.scrollTop / max : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return (
    <div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 200, background: "transparent", pointerEvents: "none" }}>
      <div style={{ height: "100%", width: "100%", background: C.accent, transformOrigin: "left", transform: `scaleX(${p})` }} />
    </div>
  );
}

/* ─── Nav (mirrors the main nav, pointed back at the developer page) ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: `${scrolled ? 11 : 15}px ${PAD}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: scrolled ? "rgba(250,248,244,0.86)" : "rgba(250,248,244,0.6)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      borderBottom: `1px solid ${scrolled ? C.line : "transparent"}`,
      transition: `padding .3s ${CSS_EASE}, background .3s ${CSS_EASE}, border-color .3s ${CSS_EASE}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link href="/" onClick={() => track("nav_logo_clicked", { page: "hiring" })} style={{ fontFamily: C.serif, fontWeight: 500, fontSize: 24, letterSpacing: "-0.01em", color: C.text, textDecoration: "none" }}>kodwai</Link>
        <span className="k-nav-blog" style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 1, textTransform: "uppercase" }}>for hiring</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link href="/" className="k-nav-hire" onClick={() => track("cta_clicked", { label: "for developers", location: "hiring_nav" })} style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none" }}>for developers</Link>
        <OutlineButton label="set up interviews" event="cta_clicked" eventProps={{ location: "hiring_nav" }} />
      </div>
    </nav>
  );
}

/* ─── Closing CTA (cream) — // 08 · begin ─── */
function Closing() {
  const ruleRef = useDrawOnView<SVGSVGElement>({ duration: 900 });
  return (
    <section style={{ background: C.bg, borderTop: `1px solid ${C.line}`, padding: `${SECTION_PAD} ${PAD}`, position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(58% 60% at 50% 8%, rgba(194,54,22,0.07), transparent 70%)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <div className="k-reveal" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 30 }}>
          <span style={{ fontFamily: C.mono, fontSize: 12, color: C.accent, letterSpacing: 0.5 }}>{"//"}</span>
          <span style={{ fontFamily: C.mono, fontSize: 12, color: C.faint, letterSpacing: 1 }}>08</span>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, textTransform: "lowercase", letterSpacing: 2 }}>begin</span>
        </div>
        <Serif as="h2" size="display" className="k-reveal" style={{ margin: 0 }}>
          Hire for how they <Accent>drive AI.</Accent>
        </Serif>
        <svg ref={ruleRef} className="k-reveal" width="200" height="22" viewBox="0 0 200 22" fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" aria-hidden style={{ display: "block", margin: "26px auto 0" }}>
          <path d="M6 11 L 86 11" />
          <path d="M114 11 L 194 11" />
          <path d="M100 4 L 100 18" />
          <circle cx="100" cy="11" r="4" fill="none" />
        </svg>
        <p className="k-reveal" style={{ fontFamily: C.sans, fontSize: "clamp(16px, 2.1vw, 20px)", lineHeight: 1.56, color: C.muted, maxWidth: "48ch", margin: "clamp(22px, 3vw, 30px) auto clamp(34px, 5vw, 46px)" }}>
          The take-home is dead. Watch the real work, score it on your own rubric, and decide as a team, all from one link.
        </p>
        <div className="k-reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "16px 24px" }}>
          <PrimaryButton label="Set up interviews" large event="cta_clicked" eventProps={{ location: "hiring_closing" }} />
          <GhostLink kicker="a developer?" label="start a challenge" href="/" event="cta_clicked" eventProps={{ location: "hiring_closing", path: "developer" }} />
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.line}`, padding: `clamp(48px, 6vw, 72px) ${PAD} clamp(30px, 4vw, 44px)` }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: "clamp(28px, 4vw, 48px)" }} className="k-foot-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
          <Link href="/" style={{ fontFamily: C.serif, fontWeight: 500, fontSize: 22, color: C.text, textDecoration: "none", width: "fit-content" }}>kodwai</Link>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4, lineHeight: 1.6 }}>{HIRING_FOOTER.tagline}</span>
        </div>
        {HIRING_FOOTER.columns.map((col) => (
          <div key={col.head} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: C.mono, fontWeight: 500, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint }}>{col.head}</span>
            {col.links.map((l) => {
              const internal = l.href.startsWith("/") || l.href.startsWith("#");
              const common = { fontFamily: C.mono, fontSize: 12, color: C.muted, letterSpacing: 0.3, textDecoration: "none" } as const;
              return internal
                ? <Link key={l.label} href={l.href} style={common}>{l.label}</Link>
                : <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={common}>{l.label}</a>;
            })}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: MAXW, margin: "clamp(36px, 5vw, 52px) auto 0", paddingTop: 22, borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint }}>© {new Date().getFullYear()} kodwai</span>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint }}>{HIRING_FOOTER.bottom}</span>
      </div>
    </footer>
  );
}

export default function HiringPage() {
  useChoreography();
  return (
    <div id="top" style={{ background: C.bg, color: C.text, fontFamily: C.sans, position: "relative", zIndex: 2, overflowX: "hidden" }}>
      <style>{`@media (max-width: 760px){ .k-foot-grid{ grid-template-columns: 1fr 1fr !important; } } @media (max-width: 460px){ .k-foot-grid{ grid-template-columns: 1fr !important; } }`}</style>
      <div className="k-field" aria-hidden />
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <Premise />
        <HowCandidatesWork />
        <LiveSession />
        <Scoring />
        <Stats />
        <NothingToConnect />
        <Faq />
        <Closing />
      </main>

      <Footer />
    </div>
  );
}
