"use client";

/* ══════════════════════════════════════════════════════════════════════════
   ClosingFooter, section 10 · begin  (cream, bookends the page in warm light)

   The decision moment. A huge Fraunces closing line, an elegant rust rule
   flourish, then a dual-path chooser (developer path is the loud primary, the
   hiring path is the quiet parallel) plus one dominant PrimaryButton. Below it
   a real <footer>: serif wordmark, tagline, three mono link columns, copyright.

   Self-contained. Imports only from ../system, ../data, next/link, next/image,
   react. Original imagery: an inline rust rule flourish + a faint warm glow
   raster behind the headline (both under /landing/closing/). Signature motion:
   the serif line reveals word-by-word on scroll, the dual paths warm to rust on
   hover. All motion is progressive enhancement and reduced-motion safe.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import anime from "animejs";
import {
  C, MAXW, PAD, SECTION_PAD, EASE, CSS_EASE, APP_URL,
  Serif, Accent, PrimaryButton, track, useDrawOnView,
} from "../system";
import { FOOTER } from "../data";

const APP = APP_URL;

const K = "k-clf-"; // unique scoped class prefix

export default function ClosingFooter() {
  /* Signature: reveal the closing serif line word-by-word on scroll-in.
     Content renders fully without JS; this only enhances when allowed. */
  const headRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("." + K + "word"));
    if (!words.length) return;
    anime.set(words, { opacity: 0, translateY: 22 });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        anime({
          targets: words,
          opacity: [0, 1],
          translateY: [22, 0],
          delay: anime.stagger(70, { start: 80 }),
          duration: 760,
          easing: EASE,
        });
        io.unobserve(el);
      });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const headWords = ["Stop", "grinding", "puzzles."];

  return (
    <>
      <ScopedStyle />

      {/* ═══════════════ CLOSING CTA (cream) ═══════════════ */}
      <section
        id="begin"
        style={{
          position: "relative",
          background: C.bg,
          borderTop: `1px solid ${C.line}`,
          padding: `clamp(52px, 7vw, 84px) ${PAD} clamp(44px, 6vw, 68px)`,
          overflow: "hidden",
        }}
      >
        {/* faint warm glow flourish behind the headline (original raster) */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            opacity: 0.7,
            maskImage: "radial-gradient(62% 58% at 50% 42%, #000 38%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(62% 58% at 50% 42%, #000 38%, transparent 78%)",
          }}
        >
          <Image
            src="/landing/closing/glow.jpg"
            alt=""
            fill
            sizes="100vw"
            priority={false}
            style={{ objectFit: "cover", objectPosition: "center 38%" }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          {/* marker, centered for the closing moment */}
          <div
            className="k-reveal"
            style={{ display: "inline-flex", alignItems: "baseline", gap: 11, marginBottom: "clamp(28px, 4vw, 42px)" }}
          >
            <span style={{ fontFamily: C.mono, fontSize: 12, color: C.accent }}>{"//"}</span>
            <span style={{ fontFamily: C.mono, fontSize: 12, color: C.faint, letterSpacing: 1 }}>10</span>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 2 }}>· begin</span>
          </div>

          {/* HUGE closing serif line */}
          <Serif as="h2" size="display" style={{ margin: 0 }}>
            <span ref={headRef} style={{ display: "block" }}>
              {headWords.map((w, i) => (
                <span key={i} className={K + "word"} style={{ display: "inline-block", marginRight: "0.26em" }}>{w}</span>
              ))}
              <br />
              <span className={K + "word"} style={{ display: "inline-block", marginRight: "0.26em" }}>Prove</span>
              <span className={K + "word"} style={{ display: "inline-block", marginRight: "0.26em" }}>how</span>
              <span className={K + "word"} style={{ display: "inline-block", marginRight: "0.26em" }}>you</span>
              <span className={K + "word"} style={{ display: "inline-block" }}><Accent>build.</Accent></span>
            </span>
          </Serif>

          {/* elegant rust rule flourish (original, draws on view) */}
          <div className="k-reveal" style={{ margin: "clamp(26px, 3.4vw, 38px) auto clamp(20px, 2.6vw, 30px)", width: "min(300px, 64vw)" }}>
            <RuleFlourish />
          </div>

          {/* subhead (grotesk prose) */}
          <p
            className="k-reveal"
            style={{
              fontFamily: C.sans, fontWeight: 400,
              fontSize: "clamp(16px, 1.95vw, 20px)", lineHeight: 1.56, color: C.muted,
              maxWidth: "44ch", margin: "0 auto clamp(40px, 5vw, 54px)",
            }}
          >
            Fully free. Your own agent, your own machine, your own editor. You pick your path on the way in.
          </p>

          {/* dominant primary action */}
          <div className="k-reveal" style={{ display: "flex", justifyContent: "center", marginBottom: "clamp(46px, 6vw, 64px)" }}>
            <PrimaryButton
              label="Start a challenge"
              large
              href={APP}
              event="cta_clicked"
              eventProps={{ location: "closing", path: "developer" }}
            />
          </div>

        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer
        style={{
          background: C.bg,
          borderTop: `1px solid ${C.line}`,
          padding: `clamp(48px, 6vw, 72px) ${PAD} clamp(30px, 4vw, 44px)`,
        }}
      >
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <div className={K + "ftgrid"}>
            {/* brand block */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 280 }}>
              <Link
                href={APP}
                onClick={() => track("cta_clicked", { location: "footer", label: "wordmark" })}
                style={{ textDecoration: "none", width: "fit-content" }}
                aria-label="kodwai"
              >
                <span style={{ fontFamily: C.serif, fontWeight: 540, fontSize: 24, letterSpacing: "-0.01em", color: C.text }}>
                  kodwai
                </span>
              </Link>
              <span style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, letterSpacing: 0.6, lineHeight: 1.5 }}>
                {FOOTER.tagline}
              </span>
            </div>

            {/* link columns */}
            {FOOTER.columns.map((col) => (
              <nav key={col.head} aria-label={col.head} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <span
                  style={{
                    fontFamily: C.mono, fontSize: 10.5, color: C.faint,
                    letterSpacing: 1.6, textTransform: "uppercase",
                  }}
                >
                  {col.head}
                </span>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink href={l.href} label={l.label} column={col.head} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* copyright rule */}
          <div
            className={K + "copy"}
            style={{
              marginTop: "clamp(40px, 5vw, 56px)",
              paddingTop: 22,
              borderTop: `1px solid ${C.line}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4 }}>
              © {new Date().getFullYear()} kodwai
            </span>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4 }}>
              measure real ai collaboration
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─── Original rust rule flourish: two rules meeting at a small seal/star.
   Strokes draw on scroll-into-view (reduced-motion: stays fully drawn). ─── */
function RuleFlourish() {
  const ref = useDrawOnView<SVGSVGElement>({ duration: 900, delay: 70 });
  return (
    <svg
      ref={ref}
      viewBox="0 0 320 40"
      width="100%"
      height="40"
      fill="none"
      stroke={C.accent}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M8 20 C 70 20, 120 20, 150 20" opacity={0.55} />
      <path d="M170 20 C 200 20, 250 20, 312 20" opacity={0.55} />
      <path d="M150 20 C 154 12, 166 12, 160 20 C 166 28, 154 28, 150 20 Z" opacity={0.9} />
      <path d="M160 9 L 160 31" opacity={0.7} />
      <circle cx={8} cy={20} r={1.6} fill={C.accent} stroke="none" opacity={0.6} />
      <circle cx={312} cy={20} r={1.6} fill={C.accent} stroke="none" opacity={0.6} />
    </svg>
  );
}

/* ─── Footer link: next/link for internal (/ , # , app), <a> for external/mailto ─── */
function FooterLink({ href, label, column }: { href: string; label: string; column: string }) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const isAppOrAnchor = href.startsWith("#") || href.startsWith("/");
  const baseStyle = {
    fontFamily: C.mono,
    fontSize: 12.5,
    color: C.muted,
    letterSpacing: 0.2,
    textDecoration: "none",
    transition: `color .25s ${CSS_EASE}`,
    width: "fit-content",
    display: "inline-block",
  } as const;
  const onEnter = (e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = C.accent; };
  const onLeave = (e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = C.muted; };
  const onClick = () => track("footer_link_clicked", { label, column });

  // External + mailto → plain <a>. Internal anchors / app routes → next/link.
  if (external && !isAppOrAnchor) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        style={baseStyle}
      >
        {label}
      </a>
    );
  }
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={baseStyle}
    >
      {label}
    </Link>
  );
}

/* ─── Scoped style: footer grid, copyright reflow ─── */
function ScopedStyle() {
  return (
    <style>{`
      /* footer grid: brand + three columns on desktop, fluid down to 360px */
      .${K}ftgrid {
        display: grid;
        grid-template-columns: 1.4fr 1fr 1fr 1fr;
        gap: clamp(28px, 4vw, 56px);
        align-items: start;
      }
      @media (max-width: 860px) {
        .${K}ftgrid { grid-template-columns: 1fr 1fr; row-gap: 40px; }
      }
      @media (max-width: 520px) {
        .${K}ftgrid { grid-template-columns: 1fr; row-gap: 34px; }
        .${K}copy { flex-direction: column; align-items: flex-start; gap: 8px; }
      }
    `}</style>
  );
}
