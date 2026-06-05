"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HERO: identity + instant proof.

   A centered cream title block (Outship-grade serif display headline with a
   word-by-word rise reveal, gated on reduced-motion), THEN the live demo on
   the SAME cream surface, sitting just below the fold so it invites a scroll.
   The demo itself is the product proof, reusing the robust <HeroVideo/>.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import anime from "animejs";
import {
  C, TYPE, MAXW, PAD, CSS_EASE,
  Inner, Eyebrow, PrimaryButton, HeroVideo,
} from "../system";
import { HERO_SUB } from "../data";

/* The headline split into words, so we can rise-reveal them one at a time.
   "first" is the hero emphasis (rust italic + hand-drawn underline); the
   category term "vibe coding" stays lightly distinguished in italic. */
const HEADLINE_WORDS: { text: string; strong?: boolean; highlight?: boolean }[] = [
  { text: "The" }, { text: "first", strong: true }, { text: "platform" }, { text: "where" },
  { text: "developers" }, { text: "test" }, { text: "their" },
  { text: "vibe coding", highlight: true }, { text: "skills." },
];

const TRUST = ["fully free", "bring your own agent", "claude code or cursor"];

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const btnWrapRef = useRef<HTMLDivElement>(null);

  /* ── Signature: word-by-word serif rise+fade on first paint, plus a
     magnetic nudge on the primary CTA. Gated on reduced-motion. ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const head = headlineRef.current;
    const words = head ? Array.from(head.querySelectorAll<HTMLElement>(".k-hero-word")) : [];
    if (words.length) {
      anime.set(words, { opacity: 0, translateY: "0.42em" });
      anime({
        targets: words,
        opacity: [0, 1],
        translateY: ["0.42em", 0],
        rotateZ: [1.1, 0],
        delay: anime.stagger(56, { start: 170 }),
        duration: 860,
        easing: "cubicBezier(0.16, 1, 0.3, 1)",
      });
    }

    /* Magnetic nudge on the primary CTA (pointer proximity within its hit area). */
    const wrap = btnWrapRef.current;
    const btn = wrap?.querySelector<HTMLAnchorElement>("a");
    if (!wrap || !btn) return;
    btn.style.transition = `transform .35s ${CSS_EASE}`;
    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.14}px, ${dy * 0.18 - 2}px)`;
    };
    const onLeave = () => { btn.style.transform = ""; };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .k-hero-word { opacity: 1 !important; transform: none !important; }
        }
        .k-herob-vsep { color: ${C.lineBright}; }
        @media (max-width: 460px) {
          .k-herob-vsep { display: none; }
          .k-herob-trust { gap: 6px 14px !important; }
        }
        .k-herob-arc { animation: k-herob-drift 26s ease-in-out infinite alternate; }
        @keyframes k-herob-drift {
          from { transform: translate3d(0,0,0) rotate(0deg); }
          to   { transform: translate3d(0,-10px,0) rotate(2.5deg); }
        }
        @media (prefers-reduced-motion: reduce) { .k-herob-arc { animation: none; } }
        @media (max-width: 520px) {
          .k-hero-h1 { max-width: 100% !important; font-size: clamp(33px, 9vw, 44px) !important; line-height: 1.15 !important; }
          .k-hero-sub { font-size: 14.5px !important; }
        }
      `}</style>

      {/* ─────────────────────────────  CREAM TITLE BLOCK  ───────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: C.bg,
          padding: `clamp(120px, 16vh, 150px) ${PAD} clamp(40px, 6vw, 68px)`,
          overflow: "hidden",
        }}
      >
        {/* faint original motif: warm glow + sparse code-grid + single orbital arc */}
        <HeroBackdrop />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <h1
            ref={headlineRef}
            className="k-hero-el k-hero-h1"
            style={{
              ...TYPE.display,
              lineHeight: 1.16,
              color: C.text,
              margin: "0 auto",
              maxWidth: "20ch",
              textWrap: "balance",
            }}
          >
            {HEADLINE_WORDS.map((w, i) => (
              <span key={i} style={{ display: "inline-block", whiteSpace: "pre" }}>
                <span
                  className="k-hero-word"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    willChange: "transform, opacity",
                    ...(w.strong
                      ? { color: "#15803d", fontStyle: "italic", fontWeight: 500 }
                      : w.highlight
                        ? { color: C.accent, fontStyle: "italic" }
                        : null),
                  }}
                >
                  {w.text}
                  {w.strong && (
                    <svg
                      aria-hidden
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                      style={{ position: "absolute", left: 0, bottom: "0.0em", width: "100%", height: "0.15em", overflow: "visible" }}
                    >
                      <path d="M3 5 C 28 8, 72 8, 97 4" fill="none" stroke="#15803d" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  )}
                  {w.highlight && (
                    <svg
                      aria-hidden
                      viewBox="0 0 120 12"
                      preserveAspectRatio="none"
                      style={{ position: "absolute", left: 0, bottom: "-0.16em", width: "100%", height: "0.3em", overflow: "visible" }}
                    >
                      <path d="M2 7 Q 12 1, 22 7 T 42 7 T 62 7 T 82 7 T 102 7 T 118 7" fill="none" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {i < HEADLINE_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p
            className="k-hero-el k-hero-sub"
            style={{
              ...TYPE.bodyLg,
              color: C.muted,
              maxWidth: "60ch",
              margin: "clamp(22px, 3vw, 30px) auto clamp(30px, 4vw, 40px)",
              textWrap: "pretty",
            }}
          >
            {HERO_SUB}
          </p>

          <div
            className="k-hero-el"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "18px 26px",
              marginBottom: "clamp(26px, 3.4vw, 34px)",
            }}
          >
            <div ref={btnWrapRef} style={{ display: "inline-flex", padding: "clamp(20px, 3.5vw, 24px)", margin: "clamp(-24px, -3.5vw, -20px)" }}>
              <PrimaryButton label="Start a challenge" large event="hero_cta_clicked" eventProps={{ location: "hero" }} />
            </div>
          </div>

          <div
            className="k-hero-el k-herob-trust"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px 16px",
              fontFamily: C.mono,
              fontSize: 11,
              color: C.faint,
              letterSpacing: 0.6,
            }}
          >
            {TRUST.map((t, i) => (
              <span key={t} style={{ display: "contents" }}>
                {i > 0 && <span className="k-herob-vsep" aria-hidden>/</span>}
                <span>{t}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────  LIVE DEMO (cream, just below the hero)  ───────────────────────── */}
      <section
        style={{
          position: "relative",
          background: C.bg,
          padding: `clamp(4px, 1vw, 14px) ${PAD} clamp(56px, 8vw, 92px)`,
          overflow: "hidden",
        }}
      >
        <Inner style={{ maxWidth: MAXW }}>
          <div className="k-reveal" style={{ marginBottom: 16, textAlign: "center" }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: C.faint }}>
              <span style={{ color: C.accent }}>{"// "}</span>live demo
            </span>
          </div>

          <div className="k-reveal">
            <HeroVideo tone="light" />
          </div>

          <p
            className="k-reveal"
            style={{
              fontFamily: C.mono,
              fontSize: 12,
              color: C.muted,
              letterSpacing: 0.4,
              margin: "20px 0 0",
              textAlign: "center",
            }}
          >
            <FlowCaption />
          </p>
        </Inner>
      </section>
    </>
  );
}

/* ── mono flow caption: browse → solve with your agent → submit → score ── */
function FlowCaption() {
  const steps = ["browse", "solve with your agent", "submit", "score"];
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "4px 9px" }}>
      {steps.map((s, i) => (
        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
          {i > 0 && <span aria-hidden style={{ color: C.accent }}>{"→"}</span>}
          <span style={{ color: i === steps.length - 1 ? C.text : C.muted }}>{s}</span>
        </span>
      ))}
    </span>
  );
}

/* ── Faint original motif behind the cream headline: warm glow + sparse
   code-grid + a single elegant orbital arc. SSR-safe, decorative only. ── */
function HeroBackdrop() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* warm rust glow behind the title */}
      <div
        style={{
          position: "absolute",
          top: "-8%",
          left: "50%",
          width: "min(900px, 92vw)",
          height: 560,
          transform: "translateX(-50%)",
          background: "radial-gradient(50% 50% at 50% 40%, rgba(194,54,22,0.07), transparent 70%)",
        }}
      />
      {/* sparse code-grid, masked to fade at edges so text stays crisp */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.4,
          maskImage: "radial-gradient(78% 62% at 50% 32%, #000 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(78% 62% at 50% 32%, #000 0%, transparent 72%)",
        }}
      />
      {/* single elegant orbital arc, drifting slowly */}
      <svg
        className="k-herob-arc"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}
      >
        <defs>
          <linearGradient id="k-herob-arcg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0" />
            <stop offset="45%" stopColor={C.accent} stopOpacity="0.34" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="600" cy="280" rx="540" ry="300" fill="none" stroke="url(#k-herob-arcg)" strokeWidth="1.2" />
        <ellipse cx="600" cy="280" rx="408" ry="222" fill="none" stroke={C.lineBright} strokeWidth="1" opacity="0.5" />
        {/* a couple of nodes riding the outer arc */}
        <circle cx="1080" cy="316" r="3.2" fill={C.accent} opacity="0.5" />
        <circle cx="160" cy="180" r="2.6" fill={C.lineBright} />
      </svg>
    </div>
  );
}
