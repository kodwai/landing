"use client";

/* ══════════════════════════════════════════════════════════════════════════
   03 · THE CHALLENGES  :: "Problems worth shipping."

   Substance and credibility. Real, ticket-sized problems, not riddles. A live
   category filter lets the reader self-select into a track they care about.
   Editorial cream tone: Fraunces headline + one rust accent, mono machine
   voice on labels/data, grotesk prose in card bodies. Square corners, hairline
   panels, warm hover lift to a rust border.

   Signature motion: the grid cross-fades + restaggers when the filter changes
   (anime.js, transform/opacity only, gated behind reduced-motion). The category
   filter is a single-line tab strip that scrolls horizontally with a soft edge
   fade when it overflows, so every track stays on one row.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, ReactElement } from "react";
import anime from "animejs";
import {
  C, CSS_EASE, EASE, MAXW, PAD, SECTION_PAD, TYPE,
  Marker, Serif, Accent,
  useResponsiveCols, diffStyle, track,
  type Challenge,
} from "../system";
import { FALLBACK_CHALLENGES } from "../data";

/* ─── Category glyph SVGs (original, on-brand line-art). Keyed by category. ── */
function CatGlyph({ name, size = 17, color = C.muted }: { name: string; size?: number; color?: string }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: 1.7, strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const, "aria-hidden": true,
  };
  const glyphs: Record<string, ReactNode> = {
    // server stack
    backend: <svg {...common}><rect x="3" y="4" width="18" height="6" /><rect x="3" y="14" width="18" height="6" /><line x1="6.5" y1="7" x2="6.5" y2="7" /><line x1="6.5" y1="17" x2="6.5" y2="17" /></svg>,
    // browser frame
    frontend: <svg {...common}><rect x="3" y="4" width="18" height="16" /><line x1="3" y1="8.5" x2="21" y2="8.5" /><circle cx="6" cy="6.2" r="0.4" /><circle cx="8.4" cy="6.2" r="0.4" /></svg>,
    // braided flow / sort nodes
    algorithms: <svg {...common}><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="12" r="2" /><path d="M8 6 H13 a3 3 0 0 1 3 3 v0M8 18 H13 a3 3 0 0 0 3 -3 v0" /></svg>,
    // db cylinder
    databases: <svg {...common}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6 v6 c0 1.7 3.1 3 7 3 s7 -1.3 7 -3 V6" /><path d="M5 12 c0 1.7 3.1 3 7 3 s7 -1.3 7 -3" /></svg>,
    // check beaker
    testing: <svg {...common}><path d="M9 3 v6 l-4.5 8 a1.5 1.5 0 0 0 1.3 2.2 h12.4 a1.5 1.5 0 0 0 1.3 -2.2 L15 9 V3" /><line x1="8" y1="3" x2="16" y2="3" /><path d="M9.5 15.5 l1.5 1.5 l3 -3.5" /></svg>,
    // cloud / infra
    infra: <svg {...common}><path d="M7 18 a4 4 0 0 1 -0.4 -8 a5 5 0 0 1 9.7 -1.2 A3.5 3.5 0 0 1 17 18 Z" /><line x1="9.5" y1="14" x2="9.5" y2="14" /><line x1="14.5" y1="14" x2="14.5" y2="14" /></svg>,
    // shield key
    security: <svg {...common}><path d="M12 3 l7 3 v5 c0 4.6 -3 7.7 -7 9 c-4 -1.3 -7 -4.4 -7 -9 V6 Z" /><circle cx="12" cy="11" r="1.6" /><path d="M12 12.6 V15.5" /></svg>,
    // bidirectional arrows / api
    api: <svg {...common}><path d="M8 8 L4 12 L8 16" /><path d="M16 8 L20 12 L16 16" /><line x1="13.5" y1="6" x2="10.5" y2="18" /></svg>,
    // gauge / perf
    performance: <svg {...common}><path d="M4 17 a8 8 0 0 1 16 0" /><line x1="12" y1="17" x2="16" y2="11" /><circle cx="12" cy="17" r="1.1" /></svg>,
    // network nodes / systems
    systems: <svg {...common}><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="M11 6.7 L6 16.3M13 6.7 L18 16.3M7 18 H17" /></svg>,
  };
  return (glyphs[name] ?? glyphs.api) as ReactElement;
}

/* ─── Category filter pill (local: not exported from system). ── */
function CatPill({
  label, count, active, onClick,
}: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: C.mono, fontSize: 11.5, letterSpacing: 0.4, textTransform: "lowercase",
        padding: "8px 13px 8px 11px", cursor: "pointer",
        border: `1px solid ${active ? C.accent : C.line}`,
        background: active ? C.accent : C.panel,
        color: active ? "#fbf7f0" : C.muted,
        display: "inline-flex", alignItems: "center", gap: 8, lineHeight: 1,
        flex: "0 0 auto", whiteSpace: "nowrap",
        transition: `color .25s ${CSS_EASE}, border-color .25s ${CSS_EASE}, background .25s ${CSS_EASE}`,
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = C.lineBright;
        e.currentTarget.style.color = C.text;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = C.line;
        e.currentTarget.style.color = C.muted;
      }}
    >
      <CatGlyph name={label} size={14} color={active ? "rgba(251,247,240,0.85)" : C.faint} />
      <span>{label}</span>
      <span style={{ color: active ? "rgba(251,247,240,0.7)" : C.faint, fontSize: 10, fontVariantNumeric: "tabular-nums" }}>{count}</span>
    </button>
  );
}

export default function Challenges({ challenges }: { challenges: Challenge[] }) {
  const catalog = challenges.length ? challenges : FALLBACK_CHALLENGES;

  // category counts, sorted by frequency
  const cats = useMemo(() => {
    const counts = catalog.reduce<Record<string, number>>((m, c) => {
      m[c.category] = (m[c.category] || 0) + 1;
      return m;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [catalog]);

  const [activeCat, setActiveCat] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const effectiveCat = activeCat || (cats[0]?.[0] ?? "");

  const inCat = useMemo(
    () => catalog.filter((c) => c.category === effectiveCat),
    [catalog, effectiveCat],
  );
  const visible = showAll ? inCat : inCat.slice(0, 3);
  const cols = useResponsiveCols(3, 2, 1);

  // ── Signature: cross-fade + restagger the grid when the filter changes ──
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (firstRun.current) { firstRun.current = false; return; }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = grid.querySelectorAll<HTMLElement>(".k-chcard");
    if (!cards.length) return;
    anime.remove(cards);
    anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [14, 0],
      scale: [0.985, 1],
      delay: anime.stagger(48),
      duration: 540,
      easing: EASE,
    });
  }, [effectiveCat, showAll]);

  const onFilter = (cat: string) => {
    setActiveCat(cat);
    setShowAll(false);
    const count = cats.find(([c]) => c === cat)?.[1] ?? 0;
    track("challenge_category_filtered", { category: cat, count });
  };

  const onExpand = () => {
    const next = !showAll;
    setShowAll(next);
    track("challenges_expanded", { expanded: next, category: effectiveCat });
  };

  return (
    <section
      id="challenges"
      style={{
        background: C.bg,
        position: "relative",
        padding: `${SECTION_PAD} ${PAD}`,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div style={{ maxWidth: MAXW, margin: "0 auto", position: "relative" }}>
        <Marker index="04" label="the challenges" />

        {/* ── Header: clean headline + subhead block ── */}
        <div
          className="k-reveal"
          style={{ marginBottom: "clamp(34px, 4vw, 48px)" }}
        >
          <Serif as="h2" size="h2">
            Problems worth <Accent>shipping.</Accent>
          </Serif>
          <p
            style={{
              ...TYPE.body,
              color: C.muted,
              margin: "20px 0 0",
              maxWidth: "62ch",
            }}
          >
            {catalog.length} live {catalog.length === 1 ? "challenge" : "challenges"} across{" "}
            {cats.length} {cats.length === 1 ? "category" : "categories"} and three difficulties.
            Each one is scoped like a real ticket, not a riddle. Pick the track that looks like the work you actually do.
          </p>
        </div>

        {/* ── Category filter: single-line horizontal tab strip, scrolls if it overflows ── */}
        <div
          className="k-reveal"
          style={{ paddingBottom: 22, marginBottom: 26, borderBottom: `1px solid ${C.line}` }}
        >
          <div
            role="group"
            aria-label="Filter challenges by category"
            className="k-chal-filter hide-scrollbar k-fade-x"
            style={{
              display: "flex", flexWrap: "nowrap", gap: 8,
              overflowX: "auto", overflowY: "hidden",
              // breathing room so the edge fade never clips the first/last pill;
              // negative margin pulls the padded scroller flush with the column
              padding: "2px 18px",
              margin: "0 -18px",
            }}
          >
            {cats.map(([cat, n]) => (
              <CatPill
                key={cat}
                label={cat}
                count={n}
                active={effectiveCat === cat}
                onClick={() => onFilter(cat)}
              />
            ))}
          </div>
        </div>

        {/* ── Challenge cards ── */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 16,
            alignItems: "stretch",
          }}
        >
          {visible.map((c, i) => {
            const ds = diffStyle[c.difficulty] || diffStyle.medium;
            return (
              <a
                key={c.slug}
                href="https://app.kodwai.com"
                className="k-chcard"
                style={{
                  display: "flex", flexDirection: "column", textDecoration: "none",
                  border: `1px solid ${C.line}`, background: C.panel, padding: "22px 22px 18px",
                  position: "relative", outlineOffset: 2,
                  transition: `border-color .3s ${CSS_EASE}, transform .3s ${CSS_EASE}, box-shadow .3s ${CSS_EASE}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 18px 38px -16px rgba(194,54,22,0.32)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.line;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() =>
                  track("challenge_clicked", {
                    slug: c.slug, difficulty: c.difficulty, category: c.category, minutes: c.minutes,
                  })
                }
              >
                {/* index ghost numeral */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute", top: 16, right: 18,
                    fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.5,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: C.mono, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase",
                      color: ds.fg, background: ds.bg, padding: "3px 8px",
                    }}
                  >
                    {c.difficulty}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <CatGlyph name={c.category} size={13} color={C.faint} />
                    <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase", color: C.faint }}>
                      {c.category}
                    </span>
                  </span>
                </div>

                <h3
                  style={{
                    ...TYPE.monoTitle, fontWeight: 600, fontSize: 17,
                    margin: "0 0 10px", color: C.text, lineHeight: 1.28,
                    paddingRight: 24,
                  }}
                >
                  {c.title}
                </h3>

                <p style={{ fontFamily: C.sans, fontSize: 14, lineHeight: 1.56, color: C.muted, margin: 0 }}>
                  {c.description.length > 110 ? c.description.slice(0, 110).trimEnd() + "..." : c.description}
                </p>

                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginTop: "auto", paddingTop: 18,
                  }}
                >
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, letterSpacing: 0.4, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" /><path d="M12 7 v5 l3 2" />
                    </svg>
                    ~{c.minutes} min
                  </span>
                  <span
                    className="k-chcard-go"
                    style={{
                      fontFamily: C.mono, fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase",
                      color: C.accent, display: "inline-flex", alignItems: "center", gap: 5,
                      transition: `transform .3s ${CSS_EASE}`,
                    }}
                  >
                    solve <span aria-hidden>&rarr;</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* ── show all / show fewer ── */}
        {inCat.length > 3 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <button
              type="button"
              onClick={onExpand}
              aria-expanded={showAll}
              style={{
                fontFamily: C.mono, fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase",
                cursor: "pointer", color: C.accent, background: "transparent",
                border: `1px solid ${C.accent}`, padding: "12px 26px",
                display: "inline-flex", alignItems: "center", gap: 10,
                transition: `color .25s ${CSS_EASE}, background .25s ${CSS_EASE}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = "#fbf7f0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.accent; }}
            >
              {showAll ? "show fewer" : `show all ${inCat.length}`}
              <span aria-hidden>{showAll ? "↑" : "↓"}</span>
            </button>
          </div>
        )}
      </div>

      {/* scoped: card focus ring + arrow nudge on hover (inline can't express :focus-visible / group hover) */}
      <style>{`
        .k-chcard:focus-visible { outline: 2px solid ${C.accent}; }
        .k-chcard:hover .k-chcard-go { transform: translateX(3px); }
      `}</style>
    </section>
  );
}
