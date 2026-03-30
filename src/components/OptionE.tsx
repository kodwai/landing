"use client";

import { useState, useEffect, useRef } from "react";
import LogoStrip from "./LogoStrip";

const E = {
  bg: "#faf8f4",
  text: "#1a1a1a",
  accent: "#c23616",
  muted: "#9a948a",
  border: "#e4e0d8",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontMono: "'Space Mono', monospace",
};

/* ─── Terminal ─── */
const lines = [
  { t: "p", s: "$ kodwai start --challenge rate-limiter --time 60m" },
  { t: "s", s: "⚡ Interview session initialized" },
  { t: "s", s: "🔗 Claude Code agent connected (claude-opus-4-6)" },
  { t: "s", s: "👤 Candidate: sarah.chen@email.com" },
  { t: "s", s: "📋 Build a distributed rate limiter handling 10M req/s" },
  { t: "s", s: "⏱  60:00 remaining" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Init a new TypeScript project with pnpm, add redis and vitest"' },
  { t: "a", s: "Setting up the project..." },
  { t: "s", s: "  $ pnpm init" },
  { t: "s", s: "  $ pnpm add ioredis" },
  { t: "s", s: "  $ pnpm add -D vitest typescript @types/node tsx" },
  { t: "s", s: "📁 Created: tsconfig.json" },
  { t: "s", s: "📁 Created: vitest.config.ts" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Create a SlidingWindowCounter class in src/counter.ts' },
  { t: "p", s: '  that tracks request counts per client IP using Redis sorted sets.' },
  { t: "p", s: '  Each entry should be timestamped, window size configurable."' },
  { t: "a", s: "I'll use Redis ZADD with timestamps as scores. On each" },
  { t: "a", s: "request we add the current timestamp, remove entries" },
  { t: "a", s: "outside the window with ZREMRANGEBYSCORE, then ZCARD" },
  { t: "a", s: "to get the count. This gives us O(log n) per operation." },
  { t: "s", s: "📁 Created: src/counter.ts (SlidingWindowCounter — 67 lines)" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Now create src/limiter.ts — a RateLimiter class that' },
  { t: "p", s: '  uses SlidingWindowCounter. It should accept maxRequests and' },
  { t: "p", s: '  windowMs in the constructor. Add an isAllowed(clientId) method' },
  { t: "p", s: '  that returns { allowed: boolean, remaining: number, retryAfter?: number }"' },
  { t: "a", s: "Building the limiter on top of the counter..." },
  { t: "s", s: "📁 Created: src/limiter.ts (RateLimiter — 43 lines)" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Write tests in tests/limiter.test.ts. Cover:' },
  { t: "p", s: '  - allows requests under limit' },
  { t: "p", s: '  - blocks when limit exceeded' },
  { t: "p", s: '  - window expiry resets the count' },
  { t: "p", s: '  - retryAfter returns correct ms' },
  { t: "p", s: '  - concurrent requests from different IPs are independent"' },
  { t: "a", s: "Writing 5 test cases with a mock Redis instance..." },
  { t: "s", s: "📁 Created: tests/limiter.test.ts (5 tests)" },
  { t: "s", s: "  $ pnpm vitest run" },
  { t: "s", s: "  ✓ allows requests under the limit (3ms)" },
  { t: "s", s: "  ✓ blocks when limit is exceeded (2ms)" },
  { t: "s", s: "  ✓ resets count after window expires (1004ms)" },
  { t: "s", s: "  ✓ returns correct retryAfter value (2ms)" },
  { t: "s", s: "  ✓ isolates counts per client IP (3ms)" },
  { t: "s", s: "✅ 5/5 tests passing" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Add an Express middleware in src/middleware.ts that' },
  { t: "p", s: '  applies the rate limiter. Extract client IP from x-forwarded-for' },
  { t: "p", s: '  or req.ip. Return 429 with Retry-After header when blocked.' },
  { t: "p", s: '  Add proper types for the middleware options."' },
  { t: "a", s: "Creating the middleware with proper header handling..." },
  { t: "s", s: "  $ pnpm add express && pnpm add -D @types/express" },
  { t: "s", s: "📁 Created: src/middleware.ts (rateLimitMiddleware — 38 lines)" },
  { t: "s", s: "📁 Created: src/types.ts (RateLimitOptions interface)" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "The middleware needs to handle Redis connection failures' },
  { t: "p", s: '  gracefully. If Redis is down, fail open — allow the request but' },
  { t: "p", s: '  log a warning. Add a test for this case."' },
  { t: "a", s: "Good catch on the failure mode. Adding try/catch with" },
  { t: "a", s: "fail-open logic and a new test with a disconnected client..." },
  { t: "s", s: "🔧 Modified: src/middleware.ts (added try/catch, +12 lines)" },
  { t: "s", s: "📁 Created: tests/middleware.test.ts" },
  { t: "s", s: "  $ pnpm vitest run" },
  { t: "s", s: "✅ 8/8 tests passing" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Create src/cluster.ts for distributing across multiple' },
  { t: "p", s: '  nodes. Use consistent hashing to route client IPs to Redis shards.' },
  { t: "p", s: '  Use the hashring package. Add a test with 3 simulated shards."' },
  { t: "a", s: "Implementing consistent hashing with hashring..." },
  { t: "s", s: "  $ pnpm add hashring" },
  { t: "s", s: "📁 Created: src/cluster.ts (ClusteredRateLimiter — 52 lines)" },
  { t: "s", s: "📁 Created: tests/cluster.test.ts" },
  { t: "s", s: "  $ pnpm vitest run" },
  { t: "s", s: "  ✓ distributes keys across shards evenly (8ms)" },
  { t: "s", s: "  ✓ handles shard failure with fallback (4ms)" },
  { t: "s", s: "  ✓ maintains consistency after node addition (6ms)" },
  { t: "s", s: "✅ 11/11 tests passing" },
  { t: "b", s: "" },
  { t: "p", s: '$ claude "Finally wire it all up in src/index.ts — export everything' },
  { t: "p", s: '  cleanly and add a README.md with usage examples"' },
  { t: "a", s: "Creating the barrel export and documentation..." },
  { t: "s", s: "📁 Created: src/index.ts (barrel exports)" },
  { t: "s", s: "📁 Created: README.md" },
  { t: "s", s: "  $ pnpm vitest run --coverage" },
  { t: "s", s: "  Coverage: 96.4% statements, 91.2% branches" },
  { t: "s", s: "✅ 11/11 tests passing — build clean" },
  { t: "b", s: "" },
  { t: "s", s: "⏱  Session complete — 43:17 elapsed" },
  { t: "s", s: "📝 Generating AI evaluation..." },
  { t: "b", s: "" },
  { t: "x", s: "═══════════════════════════════════════════════" },
  { t: "x", s: "  🎯 AI Collaboration Score: 94 / 100" },
  { t: "x", s: "═══════════════════════════════════════════════" },
  { t: "x", s: "  Problem decomposition   ████████░░  87%" },
  { t: "x", s: "  AI agent direction      █████████░  92%" },
  { t: "x", s: "  Verification & testing  ██████████  98%" },
  { t: "x", s: "  Code quality            █████████░  93%" },
  { t: "x", s: "  Communication clarity   ████████░░  89%" },
  { t: "x", s: "═══════════════════════════════════════════════" },
  { t: "x", s: "  📋 Transcript: 9 prompts → 14 files → 11 tests" },
  { t: "x", s: "  🔗 Replay: kodwai.com/session/a8f3k2" },
];

function Terminal() {
  const [vl, setVl] = useState(0);
  const [ci, setCi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vl >= lines.length) { const t = setTimeout(() => { setVl(0); setCi(0); }, 4000); return () => clearTimeout(t); }
    const l = lines[vl];
    if (l.t === "b") { const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, 200); return () => clearTimeout(t); }
    if (ci < l.s.length) { const t = setTimeout(() => setCi(c => c + 1), l.t === "p" ? 28 : l.t === "a" ? 16 : 10); return () => clearTimeout(t); }
    const t = setTimeout(() => { setVl(v => v + 1); setCi(0); }, l.t === "p" ? 500 : l.t === "x" ? 300 : 150);
    return () => clearTimeout(t);
  }, [vl, ci]);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vl, ci]);

  return (
    <div style={{
      background: "#111", border: "1px solid #222", borderRadius: 12,
      overflow: "hidden", position: "relative", fontFamily: E.fontMono,
      boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "14px 18px",
        background: "#1a1a1a", borderBottom: "1px solid #2a2a2a",
      }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28ca42" }} />
        <span style={{ fontSize: 11, color: "#555", marginLeft: 8, fontFamily: E.fontMono }}>
          kodwai — live interview session
        </span>
      </div>
      <div ref={ref} style={{ padding: 24, fontSize: 13.5, lineHeight: 1.85, height: 480, overflowY: "auto", textAlign: "left" }}>
        {lines.slice(0, vl + 1).map((l, i) => {
          if (l.t === "b") return <div key={i} style={{ height: 12 }} />;
          const cur = i === vl;
          const lineColor = l.t === "p" ? "#ff6b4a" : l.t === "a" ? "#4ade80" : l.t === "x" ? "#fbbf24" : "#777";
          return (
            <div key={i} style={{ color: lineColor, whiteSpace: "pre", textAlign: "left" }}>
              {cur ? l.s.slice(0, ci) : l.s}
              {cur && ci < l.s.length && (
                <span style={{
                  display: "inline-block", width: 8, height: 16,
                  background: "#ff6b4a", marginLeft: 1, verticalAlign: "text-bottom",
                  animation: "blink 1s step-end infinite",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Helpers ─── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".animate-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Counter() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let f: number; const s = performance.now();
    const tick = (now: number) => { const p = Math.min((now - s) / 2000, 1); setN(Math.floor((1 - Math.pow(1 - p, 3)) * 847)); if (p < 1) f = requestAnimationFrame(tick); };
    f = requestAnimationFrame(tick); return () => cancelAnimationFrame(f);
  }, []);
  return <span style={{ fontFamily: E.fontMono, color: E.accent, fontWeight: 600 }}>{n.toLocaleString()}+</span>;
}

function WaitlistForm({ id, large }: { id: string; large?: boolean }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (ok) return <div style={{ fontFamily: E.fontMono, fontSize: 13, color: "#2d6a4f", padding: "16px 0" }}>✓ You&apos;re on the list. Check your inbox.</div>;
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      if (!email) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
        if (res.ok) setOk(true);
        else { const data = await res.json(); setError(data.error || "Something went wrong"); }
      } catch { setError("Something went wrong"); }
      finally { setLoading(false); }
    }} style={{
      display: "flex", gap: 0, width: "100%", maxWidth: large ? 520 : 460,
      borderBottom: `2px solid ${E.text}`, transition: "border-color 0.3s",
    }}
      onFocus={(e) => { (e.currentTarget as HTMLFormElement).style.borderBottomColor = E.accent; }}
      onBlur={(e) => { (e.currentTarget as HTMLFormElement).style.borderBottomColor = E.text; }}
    >
      <input id={id} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
        style={{ flex: 1, background: "transparent", border: "none", color: E.text, fontFamily: E.fontMono, fontSize: 14, padding: large ? "18px 0" : "16px 0", outline: "none" }}
      />
      <button type="submit" disabled={loading} style={{
        background: "transparent", color: E.accent, fontFamily: E.fontMono, fontWeight: 700,
        fontSize: 12, padding: large ? "18px 0 18px 28px" : "16px 0 16px 24px",
        border: "none", cursor: loading ? "wait" : "pointer", transition: "color 0.3s",
        textTransform: "uppercase", letterSpacing: 2, whiteSpace: "nowrap", opacity: loading ? 0.5 : 1,
      }}
        onMouseEnter={e => { e.currentTarget.style.color = E.text; }}
        onMouseLeave={e => { e.currentTarget.style.color = E.accent; }}
      >{loading ? "Joining..." : "Join Waitlist"}</button>
      {error && <p style={{ fontFamily: E.fontMono, fontSize: 11, color: E.accent, marginTop: 4 }}>{error}</p>}
    </form>
  );
}

function RedLine() {
  return <div style={{ width: 48, height: 1, background: E.accent, margin: "0 auto" }} />;
}

/* ══════════════════════════ OPTION E ══════════════════════════ */

export default function OptionE() {
  useReveal();

  return (
    <div style={{ background: E.bg, color: E.text, fontFamily: E.fontDisplay, position: "relative", zIndex: 2, overflowX: "hidden" }}>

      {/* Subtle mesh bg */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "url(/images/mesh-accent.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.06, mixBlendMode: "multiply", pointerEvents: "none", zIndex: 0,
      }} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px clamp(12px, 4vw, 48px)", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(20px)", background: `${E.bg}ee`, borderBottom: `1px solid ${E.border}`,
      }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 550, fontSize: 24, letterSpacing: "0.75px", color: "#353431" }}>kodwai</span>
        <button onClick={() => {
          const el = document.getElementById("waitlist-e");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }} style={{
          background: "transparent", color: E.text, fontFamily: E.fontMono,
          fontSize: 10, padding: "8px 20px", border: `1px solid ${E.text}`,
          textDecoration: "none", textTransform: "uppercase", letterSpacing: 3, transition: "all 0.3s", cursor: "pointer",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = E.text; e.currentTarget.style.color = E.bg; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = E.text; }}
        >Waitlist</button>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "140px clamp(16px, 4vw, 48px) 80px", textAlign: "center", position: "relative",
      }}>
        <div style={{ maxWidth: 1000, width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 40, animation: "fade-in-up 0.6s ease forwards" }}>
            <span style={{ fontFamily: E.fontMono, fontSize: 11, color: E.muted, letterSpacing: 3, textTransform: "uppercase" }}>
              <Counter /> on the waitlist
            </span>
          </div>

          <h1 style={{
            fontFamily: E.fontDisplay, fontWeight: 400,
            fontSize: "clamp(42px, 7vw, 86px)", lineHeight: 1.08,
            letterSpacing: "-2px", marginBottom: 32,
            animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0,
          }}>
            The interview platform
            <br />
            that sees how engineers
            <br />
            <span style={{ color: E.accent, fontStyle: "italic", letterSpacing: "-3px" }}>actually work.</span>
          </h1>

          <p style={{
            fontFamily: E.fontDisplay, fontSize: "clamp(17px, 2.2vw, 21px)",
            lineHeight: 1.7, color: E.muted, maxWidth: 900, margin: "0 auto 44px",
            animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0,
          }}>
            The first platform where candidates use{" "}
            <span style={{ color: E.accent, fontWeight: 600 }}>Claude Code</span> — a real AI coding agent, not a chatbot.
            Full session capture. AI-powered scoring.
          </p>

          <div id="waitlist-e" style={{ display: "flex", justifyContent: "center", animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0 }}>
            <WaitlistForm id="hero-e" large />
          </div>
          <p style={{ fontFamily: E.fontMono, fontSize: 10, color: E.muted, marginTop: 16, letterSpacing: 2, textTransform: "uppercase", animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0 }}>
            Free early access · No card required
          </p>
        </div>

        {/* Terminal */}
        <div style={{ marginTop: 64, width: "100%", maxWidth: 1100, animation: "fade-in-up 1s ease 0.5s forwards", opacity: 0 }}>
          <Terminal />
        </div>
      </section>

      <RedLine />

      {/* ═══ LOGO STRIP ═══ */}
      <section style={{ padding: "72px clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: E.fontMono, fontSize: 12, color: E.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 40 }}>
            Built for teams at
          </p>
          <LogoStrip filter="brightness(0)" opacity={0.3} hoverOpacity={0.6} height={32} gap={56} mobileHeight={18} mobileGap={32} />
        </div>
      </section>

      <RedLine />

      {/* ═══ PROBLEM ═══ */}
      <section style={{ padding: "120px clamp(16px, 4vw, 48px)", position: "relative" }}>
        <div className="animate-in" style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontFamily: E.fontMono, fontSize: 10, color: E.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>
            The Problem
          </p>
          <h2 style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 28 }}>
            You&apos;re testing skills
            <br /><span style={{ color: E.accent, fontStyle: "italic" }}>that don&apos;t matter anymore.</span>
          </h2>
          <p style={{ fontFamily: E.fontDisplay, fontSize: 19, color: E.muted, lineHeight: 1.75, maxWidth: 640 }}>
            Whiteboard algorithms. Toy problems. No AI allowed. These interviews measure memorization, not engineering.
            The best engineers ship with agents — your interview should test that.
          </p>
        </div>
      </section>

      <RedLine />

      {/* ═══ VALUE PROPS ═══ */}
      <section style={{ padding: "120px clamp(16px, 4vw, 48px)", maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 56 }}>
          {[
            { title: "Real agents, not chatbots", desc: "Candidates use Claude Code — a full autonomous agent with file system, terminal, and multi-file project access. Not a prompt box." },
            { title: "Signal, not noise", desc: "Every keystroke, architectural decision, and agent interaction is captured and scored. You see exactly how engineers think." },
            { title: "Built for the AI era", desc: "The old whiteboard is dead. kodwai tests the skill that actually matters: wielding AI agents to ship production code." },
          ].map((card, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{ paddingLeft: 28, borderLeft: `2px solid ${E.accent}` }}>
              <h3 style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: 30, letterSpacing: "-0.5px", marginBottom: 16 }}>{card.title}</h3>
              <p style={{ fontFamily: E.fontDisplay, fontSize: 16, color: E.muted, lineHeight: 1.8 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <RedLine />

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "120px clamp(16px, 4vw, 48px)", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="animate-in" style={{ marginBottom: 64 }}>
            <p style={{ fontFamily: E.fontMono, fontSize: 10, color: E.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>How It Works</p>
            <h2 style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-1.5px" }}>
              Three steps. <span style={{ color: E.accent, fontStyle: "italic" }}>Total clarity.</span>
            </h2>
          </div>
          {[
            { n: "01", title: "Deploy a challenge", desc: "Pick from our library or create custom system-design and coding challenges calibrated to your stack." },
            { n: "02", title: "Candidate solves with AI", desc: "They get a full Claude Code environment. Real agent, real tools, real constraints. 60 minutes." },
            { n: "03", title: "Review the signal", desc: "AI-generated scorecard with granular breakdowns: decomposition, agent mastery, code quality, verification." },
          ].map((step, i) => (
            <div key={i} className={`animate-in animate-in-delay-${i + 1}`} style={{ display: "flex", gap: 28, padding: "36px 0", borderTop: `1px solid ${E.border}` }}>
              <span style={{ fontFamily: E.fontMono, fontSize: 13, color: E.accent, letterSpacing: 1, flexShrink: 0, paddingTop: 4 }}>{step.n}</span>
              <div>
                <h3 style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: 26, letterSpacing: "-0.3px", marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontFamily: E.fontDisplay, fontSize: 16, color: E.muted, lineHeight: 1.8 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RedLine />

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "120px clamp(16px, 4vw, 48px)", maxWidth: 1100, margin: "0 auto" }}>
        <div className="animate-in" style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: E.fontMono, fontSize: 10, color: E.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28 }}>Comparison</p>
          <h2 style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-1.5px" }}>
            The <span style={{ color: E.accent, fontStyle: "italic" }}>data sheet.</span>
          </h2>
        </div>
        <div className="animate-in hide-scrollbar" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 500, borderCollapse: "collapse", fontFamily: E.fontMono, fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "16px 20px", borderBottom: `2px solid ${E.text}`, borderTop: `2px solid ${E.text}`, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: E.muted }}>Feature</th>
                <th style={{ textAlign: "center", padding: "16px 20px", borderBottom: `2px solid ${E.text}`, borderTop: `2px solid ${E.text}`, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: E.muted }}>Traditional</th>
                <th style={{ textAlign: "center", padding: "16px 20px", borderBottom: `2px solid ${E.text}`, borderTop: `2px solid ${E.text}`, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", background: E.text, color: E.bg }}>kodwai</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["AI agents in interview", "✗", "✓"],
                ["Real-world environment", "✗", "✓"],
                ["Automated scoring", "Partial", "Full"],
                ["Agent interaction analysis", "✗", "✓"],
                ["Time to evaluate", "5–7 days", "60 min"],
                ["Candidate experience", "Stressful", "Authentic"],
                ["Signal-to-noise ratio", "Low", "Very High"],
              ].map(([feature, trad, kodwai], i) => (
                <tr key={i}>
                  <td style={{ padding: "14px 20px", borderBottom: `1px solid ${E.border}`, fontWeight: 600, color: E.text }}>{feature}</td>
                  <td style={{ padding: "14px 20px", borderBottom: `1px solid ${E.border}`, textAlign: "center", color: E.muted }}>{trad}</td>
                  <td style={{ padding: "14px 20px", borderBottom: `1px solid ${E.border}`, textAlign: "center", fontWeight: 700, color: E.accent }}>{kodwai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <RedLine />

      {/* ═══ QUOTE ═══ */}
      <section style={{ padding: "120px clamp(16px, 4vw, 48px)" }}>
        <div className="animate-in" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ paddingLeft: 28, borderLeft: `2px solid ${E.accent}` }}>
            <p style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: "clamp(22px, 3.5vw, 36px)", fontStyle: "italic", lineHeight: 1.55, marginBottom: 24, letterSpacing: "-0.5px" }}>
              &ldquo;We stopped asking candidates to reverse linked lists. Now we see how they <span style={{ color: E.accent }}>actually build</span>{" "}with AI.&rdquo;
            </p>
            <p style={{ fontFamily: E.fontMono, fontSize: 12, color: E.muted, letterSpacing: 1 }}>— VP Engineering, Series B startup</p>
          </div>
        </div>
      </section>

      <RedLine />

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "80px clamp(16px, 4vw, 48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div className="animate-in stats-grid" style={{ display: "grid", gap: 48, textAlign: "center" }}>
          {[
            { stat: "94%", label: "Hiring signal accuracy" },
            { stat: "3.2×", label: "Faster than traditional loops" },
            { stat: "847+", label: "Engineers on the waitlist" },
          ].map((x, i) => (
            <div key={i}>
              <div style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: "clamp(52px, 8vw, 72px)", letterSpacing: "-3px", color: E.text, marginBottom: 12 }}>{x.stat}</div>
              <p style={{ fontFamily: E.fontMono, fontSize: 14, color: E.muted, lineHeight: 1.5 }}>{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      <RedLine />

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{ padding: "140px clamp(16px, 4vw, 48px)", textAlign: "center", position: "relative" }}>
        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: E.fontDisplay, fontWeight: 400, fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 28 }}>
            Stop <span style={{ color: E.accent, fontStyle: "italic" }}>guessing.</span>
          </h2>
          <p style={{ fontFamily: E.fontDisplay, fontSize: 18, color: E.muted, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 44px" }}>
            Join the waitlist. Be first to interview engineers the way they actually work.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}><WaitlistForm id="bottom-e" large /></div>
        </div>
      </section>

      <RedLine />

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "44px clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 550, fontSize: 20, letterSpacing: "0.75px", color: "#353431" }}>kodwai</span>
            <span style={{ fontFamily: E.fontMono, fontSize: 10, color: E.muted, letterSpacing: 1 }}>For teams that take AI seriously.</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{ fontFamily: E.fontMono, fontSize: 11, color: E.muted, textDecoration: "none" }}>X</a>
            <a href="mailto:hello@kodwai.com" style={{ fontFamily: E.fontMono, fontSize: 11, color: E.muted, textDecoration: "none" }}>Email</a>
            <span style={{ fontFamily: E.fontMono, fontSize: 10, color: E.muted, opacity: 0.4 }}>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
