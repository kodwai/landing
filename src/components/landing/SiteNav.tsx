"use client";

/* ══════════════════════════════════════════════════════════════════════════
   Header nav links, shared by every landing header (home, /hiring, the public
   pages and the blog) so the challenge catalog and the blog are one click
   away from anywhere on the site.

   Same machine voice as the rest of the nav: JetBrains Mono, 11px, uppercase
   labels, muted until hover, then rust. The current section reads in ink
   with a rust hairline underline. On phones the secondary links fold away,
   "blog" stays, and the CTA beside it tightens so nothing scrolls sideways.

   Hooks for the headers that use it:
     • className "k-sn-bar"  → the right-hand group (links + CTA)
     • className "k-sn-cta"  → a wrapper around the header CTA
     • className "k-sn-logo" → the wordmark (shrinks a touch on tiny phones)
   ══════════════════════════════════════════════════════════════════════════ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { C, CSS_EASE, track } from "./system";

export type SiteNavItem = {
  label: string;
  href: string;
  /** Fold the link away at or below a width: "md" = 760px, "sm" = 560px. */
  hideBelow?: "md" | "sm";
  /** Analytics override; defaults to nav_link_clicked. */
  event?: string;
  eventProps?: Record<string, unknown>;
};

export const SITE_NAV: SiteNavItem[] = [
  { label: "challenges", href: "/challenges", hideBelow: "sm" },
  { label: "blog", href: "/blog" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavLinks({ page, items = SITE_NAV }: { page: string; items?: SiteNavItem[] }) {
  const pathname = usePathname() ?? "";
  return (
    <>
      <SiteNavStyles />
      <div className="k-sn">
        {items.map((it) => (
          <Link
            key={`${it.label}:${it.href}`}
            href={it.href}
            className={it.hideBelow ? `k-sn-link k-sn-hide-${it.hideBelow}` : "k-sn-link"}
            data-active={isActive(pathname, it.href) ? "" : undefined}
            aria-current={pathname === it.href ? "page" : undefined}
            onClick={() => track(it.event ?? "nav_link_clicked", { label: it.label, href: it.href, page, ...it.eventProps })}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </>
  );
}

/* Scoped CSS for what inline styles cannot express (hover, breakpoints). The
   CTA overrides need !important because the buttons style themselves inline. */
function SiteNavStyles() {
  return (
    <style>{`
      .k-sn-bar { display: flex; align-items: center; gap: 20px; }
      .k-sn-cta { display: flex; }
      .k-sn { display: flex; align-items: center; gap: 22px; }
      .k-sn-link { font-family: ${C.mono}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${C.muted}; text-decoration: none; white-space: nowrap; padding: 10px 0; transition: color .25s ${CSS_EASE}; }
      .k-sn-link:hover { color: ${C.accent}; }
      .k-sn-link[data-active] { color: ${C.text}; text-decoration: underline; text-decoration-color: ${C.accent}; text-decoration-thickness: 1px; text-underline-offset: 6px; }
      .k-sn-link[data-active]:hover { color: ${C.accent}; }
      @media (max-width: 760px) { .k-sn-hide-md { display: none !important; } }
      @media (max-width: 560px) { .k-sn-hide-sm { display: none !important; } }
      @media (max-width: 400px) {
        .k-sn-bar { gap: 14px; }
        .k-sn-cta > a { padding-left: 12px !important; padding-right: 12px !important; letter-spacing: 1px !important; gap: 7px !important; }
      }
      @media (max-width: 350px) {
        .k-sn-logo { font-size: 21px !important; }
        .k-sn-cta > a { padding-left: 10px !important; padding-right: 10px !important; letter-spacing: .6px !important; }
        .k-sn-cta > a > span[aria-hidden] { display: none; }
      }
    `}</style>
  );
}
