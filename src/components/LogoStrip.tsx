"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
  filter?: string;
  opacity?: number;
  hoverOpacity?: number;
  gap?: number;
  height?: number;
  mobileHeight?: number;
  mobileGap?: number;
}

export default function LogoStrip({
  filter = "brightness(0)",
  opacity = 0.35,
  hoverOpacity = 0.7,
  gap = 44,
  height = 22,
  mobileHeight,
  mobileGap,
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

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      flexWrap: "wrap", gap: `${isMobile ? 14 : 20}px ${g}px`,
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
            height={h}
            style={{ height: h, width: "auto", maxWidth: isMobile ? 70 : 120 }}
          />
        </div>
      ))}
    </div>
  );
}
