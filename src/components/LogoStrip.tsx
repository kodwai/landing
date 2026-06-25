"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

/* ═══════════════════════════════════════════════════════
   Real company logos from /public/logos/*.svg
   Accepts a `filter` for CSS-based coloring, and an optional
   `marquee` mode that scrolls the strip in a seamless loop.
   ═══════════════════════════════════════════════════════ */

const logos = [
  { name: "Google", file: "/logos/google.svg", w: 22 },
  { name: "Meta", file: "/logos/meta.svg", w: 26 },
  { name: "Apple", file: "/logos/apple.svg", w: 20 },
  { name: "Microsoft", file: "/logos/microsoft.svg", w: 22 },
  { name: "Amazon", file: "/logos/amazon.svg", w: 24 },
  { name: "Stripe", file: "/logos/stripe.svg", w: 22 },
  { name: "Netflix", file: "/logos/netflix.svg", w: 22 },
  { name: "Vercel", file: "/logos/vercel.svg", w: 22 },
];

interface LogoStripProps {
  filter?: string;
  opacity?: number;
  hoverOpacity?: number;
  gap?: number;
  height?: number;
  mobileHeight?: number;
  mobileGap?: number;
  /** Scroll the strip in a seamless loop (pauses on hover, static under reduced-motion). */
  marquee?: boolean;
  /** Seconds for one full marquee cycle. */
  speed?: number;
}

export default function LogoStrip({
  filter = "brightness(0)",
  opacity = 0.35,
  hoverOpacity = 0.7,
  gap = 44,
  height = 22,
  mobileHeight,
  mobileGap,
  marquee = false,
  speed = 42,
}: LogoStripProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const h = isMobile && mobileHeight ? mobileHeight : height;
  const g = isMobile && mobileGap ? mobileGap : gap;

  const logo = (l: (typeof logos)[number], key: string) => (
    <div
      key={key}
      style={{ opacity, transition: "opacity 0.3s", display: "flex", alignItems: "center", filter, flexShrink: 0 }}
      onMouseEnter={e => { e.currentTarget.style.opacity = String(hoverOpacity); }}
      onMouseLeave={e => { e.currentTarget.style.opacity = String(opacity); }}
    >
      <Image src={l.file} alt={l.name} width={l.w} height={h} style={{ height: h, width: "auto", maxWidth: isMobile ? 70 : 120 }} />
    </div>
  );

  if (marquee) {
    // Two identical groups; each group carries its own trailing gap (marginRight),
    // so translateX(-50%) lands exactly one group forward = seamless loop.
    const trackStyle = { "--k-marquee-dur": `${speed}s` } as CSSProperties;
    return (
      <div className="k-marquee" style={{ width: "100%" }}>
        <div className="k-marquee-track" style={trackStyle}>
          {[0, 1].map(copy => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              style={{ display: "flex", alignItems: "center", gap: `${g}px`, marginRight: `${g}px`, flexShrink: 0 }}
            >
              {logos.map(l => logo(l, `${copy}-${l.name}`))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: `${isMobile ? 14 : 20}px ${g}px` }}>
      {logos.map(l => logo(l, l.name))}
    </div>
  );
}
