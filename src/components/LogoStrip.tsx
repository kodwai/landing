"use client";

import Image from "next/image";

/* ═══════════════════════════════════════════════════════
   Real company logos from /public/logos/*.svg
   Accepts a `tint` class for CSS filter-based coloring.
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
  /** CSS filter to apply (e.g. "brightness(0) invert(1)" for white on dark) */
  filter?: string;
  /** Base opacity */
  opacity?: number;
  /** Hover opacity */
  hoverOpacity?: number;
  /** Gap between logos */
  gap?: number;
  /** Logo height */
  height?: number;
}

export default function LogoStrip({
  filter = "brightness(0)",
  opacity = 0.35,
  hoverOpacity = 0.7,
  gap = 44,
  height = 22,
}: LogoStripProps) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      flexWrap: "wrap", gap: `20px ${gap}px`,
    }}>
      {logos.map(logo => (
        <div
          key={logo.name}
          style={{
            opacity,
            transition: "opacity 0.3s",
            display: "flex", alignItems: "center",
            filter,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = String(hoverOpacity); }}
          onMouseLeave={e => { e.currentTarget.style.opacity = String(opacity); }}
        >
          <Image
            src={logo.file}
            alt={logo.name}
            width={logo.w}
            height={height}
            style={{ height, width: "auto", maxWidth: 120 }}
          />
        </div>
      ))}
    </div>
  );
}
