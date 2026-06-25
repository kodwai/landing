"use client";

/* ══════════════════════════════════════════════════════════════════════════
   05 · CLIMB : leaderboard + badges + shareable profile (cream)
   The reward loop: a ranking you are not embarrassed by, and proof you can show.
   Signature motion: rows stagger up; a row highlights to rust on hover; the
   badges grid staggers in; the rank-1 medal gets a subtle one-shot shimmer.
   All decorative motion is gated behind prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  C, TYPE, APP_URL, CSS_EASE, Band, Inner, Marker, Serif, Accent, ShareIcon,
  scoreColor, useResponsiveCols, track,
} from "../system";
import { LEADERBOARD, BADGES } from "../data";

/* ── Agent label, machine voice (uppercase mono) ── */
function agentLabel(agent: string) {
  return agent.replace(/-/g, " ").toUpperCase();
}

/* ── A single leaderboard row. Hover lifts it to a rust-tinted, rust-edged
   highlight; keyboard focus does the same so it is reachable without a mouse. ── */
function Row({
  rank, name, handle, agent, score, last,
}: {
  rank: number; name: string; handle: string; agent: string; score: number; last: boolean;
}) {
  const [hot, setHot] = useState(false);
  const medal = rank <= 3;
  const sc = scoreColor(score);
  return (
    <div
      className="k-item k-climb-row"
      tabIndex={0}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "46px minmax(0,1fr) auto auto",
        gap: "clamp(12px, 2.4vw, 20px)",
        alignItems: "center",
        padding: "15px clamp(16px, 3vw, 24px)",
        borderBottom: last ? "none" : `1px solid ${C.line}`,
        borderLeft: `2px solid ${hot ? C.accent : "transparent"}`,
        background: hot ? C.accentSoft : "transparent",
        outline: "none",
        transition: `background .28s ${CSS_EASE}, border-color .28s ${CSS_EASE}`,
        cursor: "default",
      }}
    >
      {/* rank: medal for top 3, mono numeral otherwise */}
      <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {medal ? (
          <span
            className={rank === 1 ? "k-climb-medal1" : undefined}
            style={{ position: "relative", display: "inline-flex", width: 30, height: 30 }}
          >
            <Image
              src={`/badges/rank-${rank}.png`}
              alt={`Rank ${rank} medal`}
              width={30}
              height={30}
              style={{ width: 30, height: 30, objectFit: "contain" }}
            />
          </span>
        ) : (
          <span style={{ fontFamily: C.mono, fontSize: 13, color: C.faint, letterSpacing: 0.5 }}>
            {String(rank).padStart(2, "0")}
          </span>
        )}
      </span>

      {/* name (grotesk) + handle (mono) */}
      <span style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
        <span style={{
          fontFamily: C.sans, fontSize: "clamp(15px, 2vw, 16.5px)", fontWeight: 600, color: C.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{name}</span>
        <span style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, whiteSpace: "nowrap" }}>{handle}</span>
      </span>

      {/* agent (mono uppercase) */}
      <span className="k-climb-agent" style={{
        fontFamily: C.mono, fontSize: 10.5, color: hot ? C.accentDeep : C.muted,
        letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap",
        transition: `color .28s ${CSS_EASE}`,
      }}>{agentLabel(agent)}</span>

      {/* score (mono, scoreColor) */}
      <span style={{ fontFamily: C.mono, fontSize: "clamp(17px, 2.4vw, 20px)", fontWeight: 700, color: sc, textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
        {score}<span style={{ color: C.faint, fontSize: 12, fontWeight: 400 }}> /100</span>
      </span>
    </div>
  );
}

/* ── Original inline-SVG "shareable profile card" mockup. Visualises what lands
   at kodwai.com/developers/you: monogram avatar, rank, score ring, mini badge
   row. Resolution-independent, fully themed, no raster asset needed. ── */
function ProfileCard() {
  const ringRef = useRef<SVGCircleElement>(null);
  const R = 26;
  const CIRC = 2 * Math.PI * R;
  const SCORE = 96;

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const target = CIRC * (1 - SCORE / 100);
    el.style.strokeDasharray = String(CIRC);
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.style.strokeDashoffset = String(target); return; }
    el.style.strokeDashoffset = String(CIRC);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      let raf = 0; const start = performance.now(); const dur = 1300;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.style.strokeDashoffset = String(CIRC - (CIRC - target) * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      io.unobserve(el);
      return () => cancelAnimationFrame(raf);
    }), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [CIRC]);

  return (
    <div
      className="k-reveal"
      style={{
        border: `1px solid ${C.lineBright}`,
        background: C.panel,
        padding: "clamp(20px, 2.6vw, 26px)",
        position: "relative",
        boxShadow: "0 22px 50px -34px rgba(40,22,10,0.4)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* dotted corner mark, machine-voice url */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, letterSpacing: 1.4, textTransform: "uppercase" }}>
          public profile
        </span>
        <span aria-hidden style={{ display: "inline-flex", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === 0 ? C.accent : C.lineBright }} />
          ))}
        </span>
      </div>

      {/* identity row: monogram + name/handle + rank chip */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <span style={{
          width: 46, height: 46, flexShrink: 0, overflow: "hidden", display: "inline-block", lineHeight: 0, background: C.paper2,
        }}>
          <Image src="/avatars/avatar-7.png" alt="Jamie Brooks" width={46} height={46} style={{ width: 46, height: 46, objectFit: "cover", display: "block" }} />
        </span>
        <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <span style={{ fontFamily: C.sans, fontSize: 17, fontWeight: 600, color: C.text }}>Jamie Brooks</span>
          <span style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint }}>@jamie · claude-code</span>
        </span>
        <span style={{
          marginLeft: "auto", fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: C.accentDeep,
          border: `1px solid ${C.accent}`, background: C.accentSoft, padding: "5px 9px", letterSpacing: 0.5, whiteSpace: "nowrap",
        }}>RANK 1</span>
      </div>

      {/* score ring + axis split */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, paddingTop: 18, borderTop: `1px solid ${C.line}` }}>
        <span style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
          <svg width={64} height={64} viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }} aria-hidden>
            <circle cx={32} cy={32} r={R} fill="none" stroke={C.line} strokeWidth={5} />
            <circle ref={ringRef} cx={32} cy={32} r={R} fill="none" stroke={scoreColor(SCORE)} strokeWidth={5} strokeLinecap="round" />
          </svg>
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono, fontWeight: 700, fontSize: 18, color: C.text }}>{SCORE}</span>
        </span>
        <span style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1, minWidth: 0 }}>
          {[
            { k: "Direction", v: "48 / 50" },
            { k: "Outcome", v: "34 / 35" },
            { k: "Lift", v: "14 / 15" },
          ].map((a) => (
            <span key={a.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 0.4 }}>{a.k}</span>
              <span style={{ fontFamily: C.mono, fontSize: 11.5, fontWeight: 600, color: C.text, fontVariantNumeric: "tabular-nums" }}>{a.v}</span>
            </span>
          ))}
        </span>
      </div>

      {/* mini badge row, drawn as SVG so the card stays self-contained */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 20, marginBottom: 20, paddingTop: 18, borderTop: `1px solid ${C.line}`, flexWrap: "wrap" }}>
        <span style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, letterSpacing: 1, textTransform: "uppercase", marginRight: 2 }}>earned</span>
        {(["first-blood", "five-down", "top-10", "speed-demon", "perfect-score"] as const).map((slug, i) => (
          <span key={i} style={{
            width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${C.lineBright}`, background: C.bg,
          }}>
            <Image src={`/badges/${slug}.png`} alt="" width={18} height={18} style={{ width: 18, height: 18, objectFit: "contain" }} />
          </span>
        ))}
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, marginLeft: 2 }}>+9</span>
      </div>

      {/* share footer: real brand-colored X + LinkedIn share chips, pinned to the
          bottom of the flex column so the card matches the leaderboard height */}
      <div style={{
        paddingTop: 18, borderTop: `1px solid ${C.line}`,
        display: "flex", alignItems: "center", gap: "clamp(8px, 1.6vw, 12px)", flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, letterSpacing: 1, textTransform: "uppercase", marginRight: 2 }}>
          share
        </span>
        <ShareChip kind="x" />
        <ShareChip kind="linkedin" />
      </div>
    </div>
  );
}

/* ── Real, tappable brand share chips. Bordered chip + brand-colored real glyph
   (X in near-black, LinkedIn in #0A66C2) + label. Sharing happens in the app,
   so each chip links to APP_URL. ── */
function ShareChip({ kind }: { kind: "x" | "linkedin" }) {
  const [h, setH] = useState(false);
  const brand = kind === "x" ? "#000000" : "#0A66C2";
  const label = kind === "x" ? "X" : "LinkedIn";
  return (
    <a
      href={APP_URL}
      onClick={() => track("cta_clicked", { label: `climb_share_${kind}` })}
      aria-label={kind === "x" ? "Share your profile on X" : "Share your profile on LinkedIn"}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        height: 34, padding: "0 14px", background: brand, color: "#ffffff",
        textDecoration: "none", whiteSpace: "nowrap", cursor: "pointer",
        opacity: h ? 0.88 : 1, transform: h ? "translateY(-1px)" : "none",
        transition: `opacity .2s ${CSS_EASE}, transform .2s ${CSS_EASE}`,
      }}
    >
      <svg viewBox="0 0 24 24" width={kind === "x" ? 13 : 14} height={kind === "x" ? 13 : 14}
        fill="#ffffff" aria-hidden style={{ flexShrink: 0 }}>
        {kind === "x"
          ? <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          : <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />}
      </svg>
      <span style={{
        fontFamily: C.mono, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, color: "#ffffff",
      }}>{label}</span>
    </a>
  );
}

export default function Climb() {
  const badgeCols = useResponsiveCols(7, 5, 3);

  return (
    <Band tone="cream" id="climb">
      <style>{`
        .k-climb-row:focus-visible { box-shadow: inset 0 0 0 1px ${C.accent}; }
        @media (max-width: 620px) {
          .k-climb-agent { display: none; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .k-climb-medal1::after {
            content: ""; position: absolute; inset: -3px; pointer-events: none;
            background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.85) 50%, transparent 65%);
            mix-blend-mode: screen; transform: translateX(-130%);
            animation: k-climb-shimmer 4.6s ${CSS_EASE} 1.2s infinite;
          }
          @keyframes k-climb-shimmer {
            0% { transform: translateX(-130%); }
            18%, 100% { transform: translateX(130%); }
          }
        }
        .k-climb-badge { transition: border-color .25s ${CSS_EASE}, background .25s ${CSS_EASE}, transform .25s ${CSS_EASE}; }
        .k-climb-badge:hover { border-color: ${C.accent}; background: ${C.bg}; transform: translateY(-3px); }
      `}</style>

      <Inner>
        <Marker index="06" label="climb" />

        {/* editorial two-column header (serif left, prose right) */}
        <div
          className="k-reveal k-climb-head"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
            gap: "clamp(28px, 5vw, 64px)",
            alignItems: "end",
            marginBottom: "clamp(36px, 5vw, 52px)",
          }}
        >
          <Serif as="h2" size="h2">
            Rank, <Accent>earn</Accent>, and prove it.
          </Serif>
          <p style={{ ...TYPE.body, color: C.muted, margin: 0, maxWidth: "40ch" }}>
            Every scored run moves you up the global leaderboard and builds a public profile you can send to anyone.
          </p>
        </div>

        {/* leaderboard panel (left) + shareable profile card (right) */}
        <div
          className="k-climb-split"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
            gap: "clamp(20px, 3vw, 32px)",
            alignItems: "stretch",
          }}
        >
          <div className="k-reveal" style={{ border: `1px solid ${C.line}`, background: C.panel }}>
            {/* header row */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
              padding: "14px clamp(16px, 3vw, 24px)", borderBottom: `1px solid ${C.line}`, background: C.paper2,
            }}>
              <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.text, letterSpacing: 0.4 }}>
                global leaderboard
              </span>
              <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.6, textTransform: "lowercase" }}>
                difficulty-weighted
              </span>
            </div>

            {LEADERBOARD.map((r, i) => (
              <Row
                key={r.rank}
                rank={r.rank}
                name={r.name}
                handle={r.handle}
                agent={r.agent}
                score={r.score}
                last={i === LEADERBOARD.length - 1}
              />
            ))}

            {/* your-spot teaser footer */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
              padding: "13px clamp(16px, 3vw, 24px)", borderTop: `1px solid ${C.line}`, background: C.paper2,
            }}>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: 0.4 }}>
                your spot: <span style={{ color: C.accent }}>unranked</span> · run one to claim it
              </span>
              <a
                href={APP_URL}
                onClick={() => track("cta_clicked", { label: "climb_join_leaderboard" })}
                style={{ fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.6, textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.text; }}
              >
                <span>join</span><span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <ProfileCard />
        </div>

        {/* badges */}
        <div style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
          <div
            className="k-reveal"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: "clamp(20px, 3vw, 28px)" }}
          >
            <Serif as="h3" size="h3">Badges that <Accent>stack up</Accent>.</Serif>
            <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.faint, letterSpacing: 0.8, textTransform: "uppercase" }}>
              shareable to x &amp; linkedin
            </span>
          </div>

          <div
            data-stagger
            style={{ display: "grid", gridTemplateColumns: `repeat(${badgeCols}, minmax(0, 1fr))`, gap: 12 }}
          >
            {BADGES.map((b) => (
              <div
                key={b.slug}
                className="k-item k-climb-badge"
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 13,
                  border: `1px solid ${C.lineBright}`, background: C.panel, padding: "20px 8px 16px", minWidth: 0,
                }}
              >
                <Image
                  src={`/badges/${b.slug}.png`}
                  alt={b.name}
                  width={48}
                  height={48}
                  style={{ width: 48, height: 48, objectFit: "contain" }}
                />
                <span style={{
                  fontFamily: C.mono, fontSize: 11, color: C.text, letterSpacing: 0.2, lineHeight: 1.3,
                  maxWidth: "100%", overflowWrap: "anywhere", minHeight: "2.6em", display: "flex", alignItems: "center",
                }}>{b.name}</span>
                <div style={{ display: "flex", gap: 14 }}>
                  <ShareIcon kind="x" url={APP_URL} />
                  <ShareIcon kind="linkedin" url={APP_URL} />
                </div>
              </div>
            ))}
          </div>

          <p className="k-reveal" style={{ ...TYPE.body, fontSize: 15, lineHeight: 1.6, color: C.muted, margin: "clamp(24px, 3vw, 30px) 0 0", maxWidth: "64ch" }}>
            Milestones, streaks, skill and agent badges land automatically as you submit. Your profile at{" "}
            <span style={{ fontFamily: C.mono, fontSize: 13.5, color: C.accent }}>kodwai.com/developers/you</span>{" "}
            shows your score, your rank, the badges you have earned, and the agents you drive. Built to send to anyone, including a hiring manager instead of a take-home.
          </p>
        </div>
      </Inner>

      {/* responsive collapse: stack profile card under the leaderboard */}
      <style>{`
        @media (max-width: 880px) {
          .k-climb-split { grid-template-columns: 1fr !important; }
          .k-climb-head { grid-template-columns: 1fr !important; align-items: start !important; gap: 16px !important; }
        }
      `}</style>
    </Band>
  );
}
