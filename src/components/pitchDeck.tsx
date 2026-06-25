"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import posthog from "posthog-js";

/* ===========================================
   DESIGN TOKENS — OptionE Design System
   =========================================== */
export const T = {
  bg: "#faf8f4",
  text: "#1a1a1a",
  accent: "#c23616",
  muted: "#9a948a",
  border: "#e4e0d8",
  dark: "#111",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontMono: "'Space Mono', monospace",
  fontLogo: "'Playfair Display', Georgia, serif",
};

/* ===========================================
   SLIDE DATA — Dual-track product & vision deck
   =========================================== */
export interface SlideData {
  id: string;
  type: string;
  dark?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}


/* ===========================================
   ANIMATED COMPONENTS
   =========================================== */
function ScoreBar({ name, score, delay, dark }: { name: string; score: number; delay: number; dark?: boolean }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="score-bar" data-score={score} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: T.fontMono, fontSize: 12, color: dark ? "#ccc" : T.text }}>{name}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: 5, background: dark ? "#333" : T.border, borderRadius: 3, overflow: "hidden" }}>
        <div className="score-bar-fill" style={{
          height: "100%", width: visible ? `${score}%` : `${score}%`,
          background: T.accent, borderRadius: 3,
          transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        }} />
      </div>
    </div>
  );
}

/* ===========================================
   DECORATIVE ELEMENTS
   =========================================== */
function RedLine() {
  return <div style={{ width: 48, height: 1, background: T.accent }} />;
}

function SlideNumber({ n, total, dark }: { n: number; total: number; dark?: boolean }) {
  return (
    <div style={{
      position: "absolute", bottom: 20, right: 28,
      fontFamily: T.fontMono, fontSize: 10, color: dark ? "#555" : T.muted, letterSpacing: 2,
    }}>
      {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}

function Logo({ dark }: { dark?: boolean }) {
  return (
    <div style={{
      position: "absolute", bottom: 20, left: 28,
      fontFamily: T.fontLogo, fontWeight: 550, fontSize: 14,
      letterSpacing: "0.75px", color: dark ? "#444" : `${T.muted}99`,
    }}>
      kodwai
    </div>
  );
}

/* ===========================================
   PRODUCT MOCKS — built in CSS/SVG, render frozen for PDF
   (the brand North Star: show the live product as proof)
   =========================================== */
const PANEL = {
  bg: "#111",
  bar: "#1b1b1b",
  line: "#2a2a2a",
  code: "#c9d1d9",
  muted: "#6e7681",
  faint: "#7a756c",
  bright: "#e8e6e1",
  green: "#5fd68a",
  amber: "#f6be50",
  del: "#f85149",
  add: "#3fb950",
};

const panelShell = {
  background: PANEL.bg,
  borderRadius: 8,
  border: `1px solid ${T.border}`,
  boxShadow: "0 24px 60px -24px rgba(26,26,26,.45)",
  overflow: "hidden" as const,
  fontFamily: T.fontMono,
};

function WindowChrome({ title }: { title: string }) {
  return (
    <div style={{ height: 34, background: PANEL.bar, borderBottom: `1px solid ${PANEL.line}`, display: "flex", alignItems: "center", padding: "0 12px", position: "relative" }}>
      <div style={{ display: "flex", gap: 7 }}>
        {["#ed6a5f", "#f6be50", "#61c555"].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.35)" }} />
        ))}
      </div>
      <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: T.fontMono, fontSize: 11, color: PANEL.faint }}>{title}</span>
    </div>
  );
}

/* SLIDE 5 — the live observer dashboard, frozen mid-evaluation */
function ObserverWindow() {
  const diff = [
    { g: "41", m: " ", bg: "transparent", gc: PANEL.muted, mc: PANEL.muted, code: <span style={{ color: PANEL.code }}>const score = run(tests)</span> },
    { g: "42", m: "-", bg: "rgba(248,81,73,.13)", gc: "rgba(248,81,73,.55)", mc: PANEL.del, code: <span style={{ color: PANEL.code }}>return score</span> },
    { g: "42", m: "+", bg: "rgba(46,160,67,.14)", gc: "rgba(46,160,67,.55)", mc: PANEL.add, code: <span style={{ color: PANEL.code }}>return <span style={{ color: T.accent }}>clamp</span>(score, 0, 100)</span> },
  ];
  const feed = [
    { t: "00:00.4", dot: PANEL.green, halo: false, dur: "412ms", label: <span style={{ color: PANEL.code }}>clone repo</span> },
    { t: "00:01.1", dot: PANEL.green, halo: false, dur: "1.4s", label: <span style={{ color: PANEL.code }}>run test suite&nbsp;&nbsp;<span style={{ color: PANEL.green }}>4/4 ✓</span></span> },
    { t: "00:02.6", dot: PANEL.amber, halo: true, dur: "·", label: <span style={{ color: PANEL.code }}>analyze coverage…</span> },
  ];
  return (
    <div style={panelShell}>
      <WindowChrome title="session.log · candidate_4821" />
      <div style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 12, lineHeight: "20px" }}>
          <span style={{ color: PANEL.muted }}>transcript ▸ </span>
          <span style={{ color: PANEL.code }}>&quot;refactor the auth guard, keep the suite green&quot;</span>
        </div>
        <div style={{ marginTop: 10 }}>
          {diff.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 16px 1fr", fontSize: 12.5, lineHeight: "20px", background: r.bg }}>
              <span style={{ color: r.gc, textAlign: "right", paddingRight: 8 }}>{r.g}</span>
              <span style={{ color: r.mc, textAlign: "center" }}>{r.m}</span>
              <span>{r.code}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderTop: `1px solid ${PANEL.line}`, paddingTop: 12 }}>
          {feed.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "58px 16px 1fr auto", alignItems: "center", fontSize: 11.5, lineHeight: "22px" }}>
              <span style={{ color: PANEL.muted }}>{r.t}</span>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: r.dot, boxShadow: r.halo ? `0 0 0 3px ${PANEL.amber}22` : "none" }} />
              <span>{r.label}</span>
              <span style={{ color: PANEL.muted, fontVariantNumeric: "tabular-nums" }}>{r.dur}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, borderTop: `1px solid ${PANEL.line}`, paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            {([["ELAPSED", "04:18", PANEL.bright], ["TOKENS", "12.4k", PANEL.bright], ["COST", "$0.038", T.accent]] as const).map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 8, letterSpacing: 2, color: PANEL.muted }}>{l}</span>
                <span style={{ fontSize: 14, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, borderLeft: `1px solid ${PANEL.line}`, paddingLeft: 16 }}>
              <span style={{ fontSize: 13, color: PANEL.bright }}>AI 87 <span style={{ color: PANEL.muted }}>·</span> HUMAN +A</span>
              <span style={{ fontSize: 8, letterSpacing: 1, color: PANEL.muted }}>dual scorecard</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <svg width={50} height={50} viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke={PANEL.line} strokeWidth="2.6" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke={T.accent} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="87 100" transform="rotate(-90 18 18)" />
              <text x="18" y="19.5" textAnchor="middle" dominantBaseline="middle" fontFamily={T.fontDisplay} fontSize="12" fill="#faf8f4">87</text>
            </svg>
            <span style={{ fontSize: 9, letterSpacing: 2, color: "#faf8f4" }}>STRONG HIRE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SLIDE 6 — `$ kodwai pricing` computes its own zero-COGS margin */
function LedgerRow({ k, v, vColor, vBold, c, cColor, rec }: { k: string; v: string; vColor?: string; vBold?: boolean; c: string; cColor?: string; rec?: boolean }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "142px 88px 1fr", alignItems: "baseline",
      fontSize: 13.5, lineHeight: "30px",
      borderLeft: `2px solid ${rec ? T.accent : "transparent"}`,
      background: rec ? "rgba(194,54,22,.06)" : "transparent",
      paddingLeft: 12, marginLeft: -14, paddingRight: 2,
    }}>
      <span style={{ color: PANEL.code }}>{rec && <span style={{ color: PANEL.green }}>▸ </span>}{k}</span>
      <span style={{ color: vColor || PANEL.bright, fontWeight: vBold ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>{v}</span>
      <span style={{ color: cColor || PANEL.muted }}>{c}</span>
    </div>
  );
}

function SectionRule({ label, mt }: { label: string; mt?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: mt || 0, marginBottom: 3 }}>
      <span style={{ fontSize: 9, letterSpacing: 2, color: PANEL.faint }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: PANEL.line }} />
    </div>
  );
}

function LedgerTerminal() {
  return (
    <div style={panelShell}>
      <WindowChrome title="~/kodwai · pricing" />
      <div style={{ padding: "18px 24px 22px" }}>
        <div style={{ fontSize: 14, lineHeight: "26px", marginBottom: 10 }}>
          <span style={{ color: PANEL.muted }}>$</span> <span style={{ color: PANEL.code }}>kodwai pricing --tiers --econ</span>
        </div>
        <SectionRule label="DEVELOPER" />
        <LedgerRow k="developer" v="free" vColor={PANEL.green} c="// forever" />
        <LedgerRow k="developer.pro" v="future" vColor={PANEL.amber} c="// company-tagged banks" />
        <SectionRule label="BUSINESS" mt={12} />
        <LedgerRow k="starter" v="$60/mo" c="5 seats · 50 sessions" />
        <LedgerRow k="growth" v="$200/mo" c="✓ recommended" cColor={PANEL.green} rec />
        <LedgerRow k="enterprise" v="custom" c="→ $15-25K ACV" />
        <div style={{ height: 1, background: PANEL.line, margin: "12px 0" }} />
        <div style={{ fontSize: 13, color: PANEL.muted, marginBottom: 3 }}>&gt; computing unit economics …</div>
        <LedgerRow k="cogs_llm" v="$0.00" vColor={T.accent} vBold c="◀ customers bring their own key" cColor={T.accent} />
        <div style={{ border: `1px solid ${PANEL.line}`, borderRadius: 6, padding: "12px 14px", marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
            <span style={{ fontSize: 9, letterSpacing: 2, color: PANEL.muted }}>GROSS MARGIN</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.accent, fontVariantNumeric: "tabular-nums" }}>~85-90%</span>
          </div>
          <div style={{ height: 6, background: PANEL.line, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "88%", background: T.accent, borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 9 }}>
            <span style={{ fontSize: 11, color: PANEL.green }}>✓ modeled</span>
            <span style={{ fontSize: 10, color: PANEL.muted }}>$0 inference cost to Kodwai</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================
   SLIDE RENDERER
   =========================================== */
export function SlideContent({ slide, index, total }: { slide: SlideData; index: number; total: number }) {
  const c = slide.content;
  const dark = slide.dark;
  const fg = dark ? "#f0f0f0" : T.text;
  const mutedColor = dark ? "#888" : T.muted;
  const borderColor = dark ? "#333" : T.border;

  const showChrome = slide.type !== "title" && slide.type !== "cta";

  switch (slide.type) {

    case "title":
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 32 }}>
              {c.overline}
            </p>
            <h1 className="reveal" style={{
              fontFamily: T.fontLogo, fontWeight: 550,
              fontSize: "clamp(56px, 10vw, 110px)", letterSpacing: "2px",
              color: T.text, marginBottom: 20,
            }}>
              {c.title}
            </h1>
            <p className="reveal" style={{
              fontFamily: T.fontDisplay, fontSize: "clamp(18px, 2.5vw, 26px)",
              color: T.muted, fontStyle: "italic", maxWidth: 600, lineHeight: 1.4, marginBottom: 40,
            }}>
              {c.subtitle}
            </p>
            <RedLine />
            <div className="reveal" style={{ display: "flex", gap: 48, marginTop: 40 }}>
              {c.stats.map((s: { value: string; label: string }, i: number) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 400, color: T.accent, letterSpacing: "-1px" }}>{s.value}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "bigquote":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <div className="reveal" style={{ maxWidth: 900, paddingLeft: 32, borderLeft: `3px solid ${T.accent}`, textAlign: "left" }}>
              <p style={{
                fontFamily: T.fontDisplay, fontWeight: 400,
                fontSize: "clamp(26px, 4vw, 42px)", fontStyle: "italic",
                lineHeight: 1.4, color: fg, whiteSpace: "pre-line", letterSpacing: "-0.5px",
              }}>
                {c.quote}
              </p>
            </div>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, letterSpacing: 2, marginTop: 32 }}>
              {c.attribution}
            </p>
          </div>
        </>
      );

    case "platforms":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 28, color: fg }}>
              Developer-first. <span style={{ color: T.accent, fontStyle: "italic" }}>Business-funded.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[c.left, c.right].map((col: { tag: string; desc: string; points: string[] }, i: number) => (
                <div key={i} className="reveal" style={{
                  padding: "24px 28px", borderRadius: 8,
                  border: i === 0 ? `1px solid ${borderColor}` : `2px solid ${T.accent}`,
                  background: i === 0 ? `${T.text}04` : "transparent",
                }}>
                  <p style={{ fontFamily: T.fontMono, fontSize: 10, color: i === 0 ? mutedColor : T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                    {col.tag}
                  </p>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 15, color: fg, lineHeight: 1.6, marginBottom: 16 }}>
                    {col.desc}
                  </p>
                  {col.points.map((p: string, j: number) => (
                    <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ color: T.accent, fontSize: 11, fontFamily: T.fontMono, marginTop: 3 }}>{i === 0 ? "→" : "◆"}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="reveal" style={{ marginTop: 20, padding: "14px 18px", background: `${T.accent}10`, borderRadius: 6, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1, flexShrink: 0 }}>FLYWHEEL</span>
              <span style={{ fontFamily: T.fontDisplay, fontSize: 14, color: fg, lineHeight: 1.5 }}>{c.note}</span>
            </div>
          </div>
        </>
      );

    case "problem-numbers":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
              {c.overline}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {c.items.map((item: { value: string; label: string; sub: string }, i: number) => (
                <div key={i} className="reveal" style={{ padding: "28px 24px", border: `1px solid ${borderColor}`, borderRadius: 8, position: "relative" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 48, fontWeight: 400, color: T.accent, letterSpacing: "-2px", marginBottom: 8 }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 16, color: fg, lineHeight: 1.4, marginBottom: 10 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, lineHeight: 1.6 }}>
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "before-after":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
              {c.overline}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 0, alignItems: "start" }}>
              {/* Before */}
              <div className="reveal" style={{ padding: "24px 28px", background: `${T.text}06`, borderRadius: 8 }}>
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                  {c.before.label}
                </p>
                {c.before.items.map((item: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 12, color: `${T.muted}88`, flexShrink: 0, marginTop: 2 }}>✗</span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 15, color: T.muted, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* Arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <span style={{ fontFamily: T.fontMono, fontSize: 20, color: T.accent }}>→</span>
              </div>
              {/* After */}
              <div className="reveal" style={{ padding: "24px 28px", border: `2px solid ${T.accent}`, borderRadius: 8 }}>
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                  {c.after.label}
                </p>
                {c.after.items.map((item: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accent, flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 15, color: T.text, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );

    case "hero-statement":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 900 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{
              fontFamily: c.logo === "kodwai" ? T.fontLogo : T.fontDisplay,
              fontWeight: c.logo === "kodwai" ? 550 : 400,
              fontSize: c.logo === "kodwai" ? "clamp(48px, 8vw, 72px)" : "clamp(30px, 4.5vw, 48px)",
              letterSpacing: c.logo === "kodwai" ? "1px" : "-1.5px",
              color: fg, marginBottom: 24,
            }}>
              {c.logo}
            </h2>
            <p className="reveal" style={{
              fontFamily: T.fontDisplay, fontSize: 17, color: mutedColor,
              lineHeight: 1.75, maxWidth: 680, marginBottom: c.proof.length ? 32 : 0,
            }}>
              {c.tagline}
            </p>
            {c.proof.length > 0 && (
              <div className="reveal" style={{ display: "grid", gap: 12, marginTop: 8 }}>
                {c.proof.map((p: { icon: string; text: string }, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 16px", background: `${T.text}06`, borderRadius: 6 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: 12, color: fg }}>{p.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );

    case "bigstat":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>
              {c.overline}
            </p>
            <div className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: "clamp(80px, 14vw, 160px)", fontWeight: 400, color: T.accent, letterSpacing: "-4px", lineHeight: 1 }}>
              {c.stat}
            </div>
            <div className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: "clamp(24px, 3vw, 36px)", color: fg, fontStyle: "italic", marginTop: 8 }}>
              {c.label}
            </div>
            <div className="reveal" style={{ width: 48, height: 1, background: T.accent, margin: "28px 0" }} />
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 13, color: mutedColor, maxWidth: 500 }}>
              {c.subtitle}
            </p>
          </div>
        </>
      );

    case "roi-grid":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1100 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 28, color: fg }}>
              Free developers. <span style={{ color: T.accent, fontStyle: "italic" }}>Paid companies.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {c.cards.map((card: { metric: string; label: string; detail: string; comparison: string }, i: number) => (
                <div key={i} className="reveal" style={{
                  padding: "24px", border: `1px solid ${borderColor}`, borderRadius: 8,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 400, color: T.accent, letterSpacing: "-1px" }}>
                      {card.metric}
                    </span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 16, color: fg }}>{card.label}</span>
                  </div>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 13, color: mutedColor, lineHeight: 1.6, marginBottom: 10 }}>
                    {card.detail}
                  </p>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 1 }}>
                    {card.comparison}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "flow":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 32, color: fg }}>
              Three steps. One hour. <span style={{ color: T.accent, fontStyle: "italic" }}>Complete signal.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {c.steps.map((step: { number: string; title: string; desc: string; time: string }, i: number) => (
                <div key={i} className="reveal" style={{ padding: "28px 24px", borderTop: `3px solid ${T.accent}`, background: `${T.text}04`, borderRadius: "0 0 8px 8px" }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: 32, color: `${T.accent}22`, fontWeight: 700, marginBottom: 12 }}>{step.number}</div>
                  <h3 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 24, letterSpacing: "-0.3px", marginBottom: 10, color: fg }}>{step.title}</h3>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: 14, color: mutedColor, lineHeight: 1.7, marginBottom: 16 }}>{step.desc}</p>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 2, textTransform: "uppercase" }}>{step.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "scorecard":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 32, whiteSpace: "pre-line", color: fg }}>
              Not a pass/fail. <span style={{ color: T.accent, fontStyle: "italic" }}>A complete picture.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 36, alignItems: "start" }}>
              <div className="reveal">
                {c.dimensions.map((d: { name: string; score: number }, i: number) => (
                  <ScoreBar key={i} name={d.name} score={d.score} delay={i * 0.12} dark={dark} />
                ))}
              </div>
              <div className="reveal" style={{ padding: "28px 24px", background: dark ? "#1a1a1a" : `${T.text}06`, borderRadius: 8, border: `1px solid ${borderColor}`, textAlign: "center" }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                  Overall Score
                </div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 64, fontWeight: 400, color: T.accent, letterSpacing: "-3px", lineHeight: 1 }}>
                  {c.overall}
                </div>
                <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, marginTop: 8 }}>/100</div>
                <div style={{ width: 32, height: 1, background: borderColor, margin: "16px auto" }} />
                <div style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, lineHeight: 1.8 }}>
                  {c.meta}
                </div>
              </div>
            </div>
          </div>
        </>
      );

    case "market":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 36, color: fg }}>
              A massive market with an <span style={{ color: T.accent, fontStyle: "italic" }}>empty quadrant.</span>
            </h2>
            {/* Concentric circles visualization */}
            <div className="reveal" style={{ display: "flex", gap: 48, alignItems: "center" }}>
              <div style={{ position: "relative", width: 280, height: 280, flexShrink: 0 }}>
                {[
                  { label: "TAM", sz: 270, border: 1, color: T.border, bg: "transparent", labelPos: "top" },
                  { label: "SAM", sz: 180, border: 1, color: T.border, bg: "transparent", labelPos: "top" },
                  { label: "SOM", sz: 90, border: 3, color: T.accent, bg: `${T.accent}12`, labelPos: "center" },
                ].map((ring, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    width: ring.sz, height: ring.sz,
                    borderRadius: "50%",
                    border: `${ring.border}px solid ${ring.color}`,
                    background: ring.bg,
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}>
                    <span style={{
                      position: "absolute",
                      top: ring.labelPos === "center" ? "50%" : 10,
                      left: "50%",
                      transform: ring.labelPos === "center" ? "translate(-50%, -50%)" : "translateX(-50%)",
                      fontFamily: T.fontMono, fontSize: 10,
                      color: i === 2 ? T.accent : T.muted,
                      letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {ring.label}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                {c.tiers.map((tier: { label: string; value: string; desc: string }, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 2 ? `1px solid ${borderColor}` : "none", alignItems: "baseline" }}>
                    <span style={{ fontFamily: T.fontMono, fontSize: 10, color: i === 2 ? T.accent : T.muted, letterSpacing: 2, width: 36 }}>{tier.label}</span>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 28, color: i === 2 ? T.accent : fg, letterSpacing: "-1px" }}>{tier.value}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor }}>{tier.desc}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, padding: "12px 16px", background: `${T.accent}10`, borderRadius: 6 }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1 }}>GROWTH</span>
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 16, color: fg }}>{c.growth}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      );

    case "competitive":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1100 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 28, color: fg }}>
              The white space is <span style={{ color: T.accent, fontStyle: "italic" }}>real.</span>
            </h2>
            <div className="reveal hide-scrollbar" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.fontMono, fontSize: 12 }}>
                <thead>
                  <tr>
                    {["", "Own-terminal agent", "Free dev community", "Agent-skill native"].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 0 ? "left" : "center", padding: "10px 14px",
                        borderBottom: `2px solid ${fg}`, borderTop: `2px solid ${fg}`,
                        fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: mutedColor,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.competitors.map((comp: { name: string; note: string; ownTerminal: boolean; community: boolean; agentNative: boolean }, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, fontWeight: 600, color: fg }}>
                        {comp.name} <span style={{ fontWeight: 400, color: mutedColor, fontSize: 10 }}>{comp.note}</span>
                      </td>
                      {[comp.ownTerminal, comp.community, comp.agentNative].map((v, j) => (
                        <td key={j} style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, textAlign: "center", color: v ? fg : `${mutedColor}66` }}>
                          {v ? "✓" : "✗"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: T.accent }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#fff" }}>kodwai</td>
                    {[c.kodwai.ownTerminal, c.kodwai.community, c.kodwai.agentNative].map((v: boolean, j: number) => (
                      <td key={j} style={{ padding: "10px 14px", textAlign: "center", color: "#fff", fontWeight: 700 }}>{v ? "✓" : "✗"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 14, color: mutedColor, lineHeight: 1.6, marginTop: 20, fontStyle: "italic" }}>
              {c.insight}
            </p>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: `${mutedColor}aa`, letterSpacing: 0.5, marginTop: 12 }}>
              {c.footnote}
            </p>
          </div>
        </>
      );

    case "business":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1050 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 32, color: fg }}>
              Recurring revenue. <span style={{ color: T.accent, fontStyle: "italic" }}>Zero LLM cost.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
              {c.columns.map((col: { title: string; items: { label: string; value: string; desc: string }[] }, ci: number) => (
                <div key={ci} className="reveal">
                  <p style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{col.title}</p>
                  {col.items.map((item, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderTop: `1px solid ${borderColor}`, alignItems: "baseline" }}>
                      <span style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, width: 90, flexShrink: 0, letterSpacing: 1 }}>{item.label}</span>
                      <span style={{ fontFamily: T.fontDisplay, fontSize: 22, color: ci === 1 && i === 2 ? T.accent : fg, letterSpacing: "-0.5px", minWidth: 80 }}>{item.value}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "validation":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 950 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 32, color: fg }}>
              The signals are <span style={{ color: T.accent, fontStyle: "italic" }}>loud.</span>
            </h2>
            <div className="reveal">
              {c.signals.map((s: { event: string; date: string; detail: string }, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 20, padding: "16px 0", borderTop: `1px solid ${borderColor}` }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent, letterSpacing: 1 }}>{s.date}</span>
                  <div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 17, color: fg, marginBottom: 4 }}>{s.event}</div>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "traction":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 32 }}>
              {c.overline}
            </p>
            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 40 }}>
              {c.stats.map((s: { value: string; label: string }, i: number) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 44, fontWeight: 400, color: T.accent, letterSpacing: "-2px" }}>{s.value}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="reveal">
              <p style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Roadmap</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {c.milestones.map((m: { label: string; text: string }, i: number) => (
                  <div key={i} style={{ padding: "16px", borderTop: `2px solid ${i === 0 ? T.accent : borderColor}`, background: i === 0 ? `${T.accent}12` : "transparent" }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11, color: i === 0 ? T.accent : mutedColor, fontWeight: 700, marginBottom: 6 }}>{m.label}</div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 13, color: fg, lineHeight: 1.5 }}>{m.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );

    /* ── WHAT'S BUILT SLIDE ── */
    case "built":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1100 }}>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              {c.overline}
            </p>
            <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 24, color: fg }}>
              Full platform. <span style={{ color: T.accent, fontStyle: "italic" }}>Shipping today.</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {c.components.map((comp: { name: string; tech: string; features: string[] }, i: number) => (
                <div key={i} className="reveal" style={{
                  padding: "20px", borderTop: `3px solid ${T.accent}`,
                  background: dark ? "#1a1a1a" : `${T.text}04`, borderRadius: "0 0 6px 6px",
                }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 22, color: fg, marginBottom: 4 }}>{comp.name}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 1, marginBottom: 16 }}>{comp.tech}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {comp.features.map((f: string, j: number) => (
                      <li key={j} style={{ fontFamily: T.fontMono, fontSize: 10, color: mutedColor, lineHeight: 1.6, paddingLeft: 14, position: "relative", marginBottom: 6 }}>
                        <span style={{ position: "absolute", left: 0, color: T.accent, fontSize: 8, top: 3 }}>&#9654;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    /* ── TEAM SLIDE ── */
    case "team":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
                {c.overline}
              </p>
              <h2 className="reveal" style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: fg }}>
                Built by people who <span style={{ color: T.accent, fontStyle: "italic" }}>live this problem.</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              {c.members.map((m: { name: string; role: string; bio: string; logos: { src: string; alt: string; h: number }[] }, i: number) => (
                <div key={i} className="reveal" style={{ padding: "28px", border: `1px solid ${borderColor}`, borderRadius: 8, textAlign: "center" }}>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto 14px", border: `2px solid ${borderColor}` }}>
                    <img src={i === 0 ? "/logos/team/hakan.png" : "/logos/team/dogukan.png"} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 20, color: fg, marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 1, marginBottom: 14 }}>{m.role}</div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 13, color: mutedColor, lineHeight: 1.6, marginBottom: 20 }}>{m.bio}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${borderColor}` }}>
                    {m.logos.map((logo: { src: string; alt: string; h: number }, j: number) => (
                      <img key={j} src={logo.src} alt={logo.alt} style={{ height: logo.h, width: "auto", opacity: 0.55, filter: "grayscale(100%)" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="reveal" style={{ fontFamily: T.fontMono, fontSize: 11, color: mutedColor, marginTop: 20, textAlign: "center" }}>
              {c.hiring}
            </p>
          </div>
        </>
      );

    case "cta":
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flex: 1 }}>
            <h2 className="reveal" style={{
              fontFamily: T.fontDisplay, fontWeight: 400,
              fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 1.1,
              letterSpacing: "-2px", marginBottom: 24, whiteSpace: "pre-line", color: fg,
            }}>
              Where developers prove it,{"\n"}and companies <span style={{ color: T.accent, fontStyle: "italic" }}>hire</span> it.
            </h2>
            <p className="reveal" style={{ fontFamily: T.fontDisplay, fontSize: 18, color: mutedColor, lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
              {c.subtitle}
            </p>
            <RedLine />
            <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 32 }}>
              <span style={{ fontFamily: T.fontMono, fontSize: 16, color: fg, fontWeight: 700, letterSpacing: 1 }}>{c.contact}</span>
              <span style={{ fontFamily: T.fontMono, fontSize: 12, color: mutedColor }}>{c.url}</span>
            </div>
            <div className="reveal" style={{ marginTop: 40 }}>
              <span style={{ fontFamily: T.fontLogo, fontWeight: 550, fontSize: 28, letterSpacing: "0.75px", color: dark ? "#555" : "#353431" }}>kodwai</span>
            </div>
          </div>
        </>
      );

    /* ── SLIDE 5: THE OBSERVED CANDIDATE (editorial split + live observer window) ── */
    case "hiring-observer":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ width: "100%", maxWidth: 980, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div className="reveal">
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", margin: 0 }}>
                  The Hiring Product · Live Observer
                </p>
                <div style={{ width: 48, height: 1, background: T.accent, marginTop: 12 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, paddingTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: PANEL.green }} />
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.muted, letterSpacing: 1 }}>kodwai · observer&nbsp;&nbsp;live</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 376px) 1fr", gap: 76, alignItems: "center" }}>
              <div className="reveal">
                <h2 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 46, lineHeight: 1.0, letterSpacing: "-1px", color: T.text, margin: 0 }}>
                  Hiring, measured.
                </h2>
                <p style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 29, lineHeight: 1.26, color: T.text, marginTop: 18 }}>
                  You stop grading the <span style={{ fontStyle: "italic", color: T.accent }}>answer</span>. You start watching the work.
                </p>
                <p style={{ fontFamily: T.fontDisplay, fontSize: 16.5, lineHeight: 1.7, color: T.muted, marginTop: 22, maxWidth: 340 }}>
                  Invite a candidate by link. They solve on their own machine with a real agent, and you watch the real process live, not just the final answer.
                </p>
                <div style={{ marginTop: 26, display: "grid", gap: 11 }}>
                  {[
                    ["01", "Solve on their own machine with a real agent"],
                    ["02", "Watch every prompt, commit, and test, live"],
                    ["03", "Observer dashboard: diffs, tool feed, timer, cost"],
                    ["04", "Dual scored, AI + human · AES-256, HMAC events"],
                  ].map(([n, t]) => (
                    <div key={n} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                      <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent, fontWeight: 700 }}>{n}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.text, lineHeight: 1.4 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="reveal"><ObserverWindow /></div>
            </div>
          </div>
        </>
      );

    /* ── SLIDE 6: THE MARGIN LEDGER (editorial split + self-computing pricing CLI) ── */
    case "business-ledger":
      return (
        <>
          {showChrome && <Logo dark={dark} />}
          {showChrome && <SlideNumber n={index + 1} total={total} dark={dark} />}
          <div style={{ width: "100%", maxWidth: 980, margin: "0 auto" }}>
            <div className="reveal" style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: 3, textTransform: "uppercase", margin: 0 }}>
                Business Model
              </p>
              <div style={{ width: 48, height: 1, background: T.accent, marginTop: 12 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 344px) 1fr", gap: 72, alignItems: "center" }}>
              <div className="reveal">
                <h2 style={{ fontFamily: T.fontDisplay, fontWeight: 400, fontSize: 40, lineHeight: 1.12, letterSpacing: "-1px", color: T.text, margin: 0 }}>
                  Free for developers. <span style={{ fontStyle: "italic", color: T.accent }}>Recurring</span> for companies.
                </h2>
                <p style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontSize: 15, lineHeight: 1.6, color: "#6b655c", marginTop: 22, maxWidth: 320 }}>
                  The candidate brings the API key, so the inference bill is theirs, not ours. That zero cost of goods is the whole margin story.
                </p>
                <div style={{ marginTop: 28 }}>
                  <div style={{ width: 48, height: 1, background: T.accent }} />
                  <p style={{ fontFamily: T.fontMono, fontSize: 10, letterSpacing: 2, color: T.muted, marginTop: 12 }}>$0 LLM COST · ~85-90% MARGIN · MODELED</p>
                </div>
              </div>
              <div className="reveal"><LedgerTerminal /></div>
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
}

/* ===========================================
   PITCH DECK — Main Component
   =========================================== */
export default function PitchDeckShell({ slides }: { slides: SlideData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const isScrolling = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            const idx = slideRefs.current.indexOf(e.target as HTMLElement);
            if (idx !== -1) {
              setCurrentSlide(idx);
              posthog.capture("pitch_deck_slide_viewed", { slide_id: slides[idx]?.id, slide_index: idx });
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    slideRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [slides]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("reveal-visible"); }); },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, slides.length - 1));
    const el = slideRefs.current[clamped];
    if (el) {
      isScrolling.current = true;
      el.scrollIntoView({ behavior: "smooth" });
      setCurrentSlide(clamped);
      setTimeout(() => { isScrolling.current = false; }, 800);
    }
  }, [slides.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goTo(currentSlide + 1); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); goTo(currentSlide - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, goTo]);

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.fontDisplay, position: "relative", overflowX: "hidden" }}>

      {/* Mesh bg */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "url(/images/mesh-accent.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.06, mixBlendMode: "multiply", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Progress */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: 2,
        width: `${progress}%`, background: T.accent, zIndex: 200,
        transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }} />

      {/* Nav dots */}
      <nav className="nav-dots" style={{
        position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)",
        zIndex: 100, display: "flex", flexDirection: "column", gap: 8,
      }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{
            width: currentSlide === i ? 8 : 5, height: currentSlide === i ? 8 : 5,
            borderRadius: "50%", background: currentSlide === i ? T.accent : T.border,
            border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0,
          }} />
        ))}
      </nav>

      {/* Keyboard hint */}
      <div className="keyboard-hint" style={{
        position: "fixed", bottom: 20, left: 28,
        fontFamily: T.fontMono, fontSize: 9, color: `${T.muted}66`, letterSpacing: 1, zIndex: 100,
      }}>
        ← → to navigate
      </div>

      {/* slides */}
      {slides.map((slide, i) => (
        <section
          key={slide.id}
          ref={(el) => { slideRefs.current[i] = el; }}
          className="pitch-slide"
          style={{
            minHeight: "100vh",
            padding: "clamp(48px, 6vh, 72px) clamp(28px, 6vw, 80px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            scrollSnapAlign: "start",
            background: slide.dark ? T.dark : "transparent",
            color: slide.dark ? "#f0f0f0" : T.text,
            zIndex: 1,
          }}
        >
          <SlideContent slide={slide} index={i} total={slides.length} />
        </section>
      ))}

      <style>{`
        html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

        .reveal {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible { opacity: 1; transform: translateY(0); }
        .reveal:nth-child(1) { transition-delay: 0.05s; }
        .reveal:nth-child(2) { transition-delay: 0.12s; }
        .reveal:nth-child(3) { transition-delay: 0.2s; }
        .reveal:nth-child(4) { transition-delay: 0.28s; }
        .reveal:nth-child(5) { transition-delay: 0.36s; }

        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }

        @media (max-width: 768px) {
          .nav-dots, .keyboard-hint { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal { transition: opacity 0.3s ease; transform: none; }
          html { scroll-snap-type: none; scroll-behavior: auto; }
        }
        @media print {
          html { scroll-snap-type: none !important; }
          .nav-dots, .keyboard-hint { display: none !important; }
          .pitch-slide { page-break-after: always; min-height: auto !important; padding: 40px 48px !important; }
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
