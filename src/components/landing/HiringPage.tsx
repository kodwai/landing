"use client";

/* ══════════════════════════════════════════════════════════════════════════
   /hiring — the B2B interview track, split out from the developer landing so
   each audience gets a clear, single-purpose page. Reuses the shared design
   system and the HiringIntegrations band (features + ATS constellation),
   wrapped in its own nav, hero, closing CTA, and footer.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  C, D, TYPE, MAXW, PAD, SECTION_PAD, CSS_EASE, APP_URL,
  Eyebrow, Serif, Accent, PrimaryButton, GhostLink, OutlineButton,
  useChoreography, track,
} from "./system";
import { FOOTER } from "./data";
import HiringIntegrations from "./sections/HiringIntegrations";

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

/* ─── Nav (mirrors the main nav, but pointed back at the developer page) ─── */
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
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link href="/" onClick={() => track("nav_logo_clicked", { page: "hiring" })} style={{ fontFamily: C.serif, fontWeight: 500, fontSize: 24, letterSpacing: "-0.01em", color: C.text, textDecoration: "none" }}>kodwai</Link>
        <span className="k-nav-blog" style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, letterSpacing: 1, textTransform: "uppercase" }}>for hiring</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link href="/" className="k-nav-hire" onClick={() => track("cta_clicked", { label: "for developers", location: "hiring_nav" })} style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none" }}>for developers</Link>
        <OutlineButton label="open app" event="open_app_clicked" eventProps={{ location: "hiring_nav" }} />
      </div>
    </nav>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.line}`, padding: `clamp(48px, 6vw, 72px) ${PAD} clamp(30px, 4vw, 44px)` }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: "clamp(28px, 4vw, 48px)" }} className="k-foot-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
          <Link href="/" style={{ fontFamily: C.serif, fontWeight: 500, fontSize: 22, color: C.text, textDecoration: "none", width: "fit-content" }}>kodwai</Link>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4, lineHeight: 1.6 }}>{FOOTER.tagline}</span>
        </div>
        {FOOTER.columns.map((col) => (
          <div key={col.head} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ ...TYPE.label, color: C.faint }}>{col.head}</span>
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
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint }}>built for teams hiring in the agent era</span>
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
        {/* ── Hiring hero (cream) ── */}
        <section style={{ position: "relative", background: C.bg, padding: `clamp(118px, 16vh, 150px) ${PAD} clamp(56px, 8vw, 88px)`, overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(60% 50% at 50% 0%, rgba(194,54,22,0.06), transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
            <div className="k-hero-el" style={{ display: "inline-flex", marginBottom: "clamp(22px, 3vw, 30px)" }}>
              <Eyebrow label="for hiring teams" />
            </div>
            <h1 className="k-hero-el" style={{ ...TYPE.display, color: C.text, margin: "0 auto", maxWidth: "16ch", textWrap: "balance" }}>
              See how candidates <span style={{ color: C.accent, fontStyle: "italic" }}>really</span> build.
            </h1>
            <p className="k-hero-el" style={{ ...TYPE.bodyLg, color: C.muted, maxWidth: "56ch", margin: "clamp(22px, 3vw, 30px) auto clamp(30px, 4vw, 40px)", textWrap: "pretty" }}>
              Kodwai interviews measure how an engineer actually works with an AI agent on a realistic ticket:
              the prompts, the recovery, the verification, the result. You get a transparent score, the full replay, and shared review for your team.
            </p>
            <div className="k-hero-el" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "18px 26px" }}>
              <PrimaryButton label="Set up interviews" large event="cta_clicked" eventProps={{ location: "hiring_hero" }} />
              <GhostLink kicker="a developer?" label="start a challenge" href="/" event="cta_clicked" eventProps={{ location: "hiring_hero", path: "developer" }} />
            </div>
          </div>
        </section>

        {/* ── The detail: features + ATS constellation (shared dark band) ── */}
        <HiringIntegrations />

        {/* ── Closing CTA (cream) ── */}
        <section style={{ background: C.bg, borderTop: `1px solid ${C.line}`, padding: `${SECTION_PAD} ${PAD}`, textAlign: "center" }}>
          <div className="k-reveal" style={{ maxWidth: 820, margin: "0 auto" }}>
            <Serif as="h2" size="display" style={{ margin: 0 }}>
              Hire for how they <Accent>drive AI.</Accent>
            </Serif>
            <p style={{ ...TYPE.bodyLg, color: C.muted, maxWidth: "46ch", margin: "clamp(24px, 3vw, 32px) auto clamp(36px, 5vw, 48px)" }}>
              The take-home is dead. Watch real work, score it transparently, and fill roles faster.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PrimaryButton label="Set up interviews" large event="cta_clicked" eventProps={{ location: "hiring_closing" }} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
