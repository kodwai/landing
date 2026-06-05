"use client";

/* ══════════════════════════════════════════════════════════════════════════
   kodwai landing — page shell + composition  (v2 "editorial instrument")

   Warm-light cream page with three full-bleed warm-dark punctuation bands
   (hero product proof, the vibe showcase, the hiring band). One serif voice
   for emotion, one mono voice for the machine, one rust accent. The shell
   owns the fixed nav, the scroll-progress hairline, the code-grid field, and
   the single motion driver (useChoreography). Each band is its own component
   under ./sections, built against ./system.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { C, CSS_EASE, PAD, OutlineButton, useChoreography, track, type Challenge } from "./system";

import Hero from "./sections/Hero";
import Trust from "./sections/Trust";
import Premise from "./sections/Premise";
import HowItWorks from "./sections/HowItWorks";
import VibeShowcase from "./sections/VibeShowcase";
import Challenges from "./sections/Challenges";
import Score from "./sections/Score";
import Climb from "./sections/Climb";
import Stats from "./sections/Stats";
import Faq from "./sections/Faq";
import ClosingFooter from "./sections/ClosingFooter";

/* ─── Thin rust scroll-progress hairline at the very top ─── */
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

/* ─── Fixed nav: cream blur, elevates on scroll ─── */
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
        <a href="#top" onClick={() => track("nav_logo_clicked")} style={{ fontFamily: C.serif, fontWeight: 500, fontSize: 24, letterSpacing: "-0.01em", color: C.text, textDecoration: "none" }}>kodwai</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <OutlineButton label="start a challenge" event="open_app_clicked" eventProps={{ location: "nav" }} />
      </div>
    </nav>
  );
}

export default function LandingPage({ challenges = [] }: { challenges?: Challenge[] }) {
  useChoreography();
  return (
    <div id="top" style={{ background: C.bg, color: C.text, fontFamily: C.sans, position: "relative", zIndex: 2, overflowX: "hidden" }}>
      <div className="k-field" aria-hidden />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Premise />
        <HowItWorks />
        <VibeShowcase />
        <Challenges challenges={challenges} />
        <Score />
        <Climb />
        <Stats />
        <Faq />
        <ClosingFooter />
      </main>
    </div>
  );
}
