"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────── TERMINAL TYPING ANIMATION ─────────────────────── */

const terminalLines = [
  { type: "prompt", text: "$ kodwai start --challenge system-design" },
  { type: "system", text: "⚡ Session started — Claude Code agent connected" },
  { type: "system", text: "📋 Challenge: Design a rate limiter for 10M req/s" },
  { type: "blank", text: "" },
  { type: "prompt", text: "$ claude \"analyze the requirements and propose architecture\"" },
  { type: "agent", text: "I'll design a distributed rate limiter using a sliding window" },
  { type: "agent", text: "approach with Redis clusters. Let me scaffold the service..." },
  { type: "blank", text: "" },
  { type: "system", text: "📁 Created: src/rate-limiter/sliding-window.ts" },
  { type: "system", text: "📁 Created: src/rate-limiter/redis-cluster.ts" },
  { type: "system", text: "✅ Tests passing — 12/12 assertions" },
  { type: "blank", text: "" },
  { type: "score", text: "🎯 AI Collaboration Score: 94/100" },
  { type: "score", text: "   Problem decomposition ████████░░ 87%" },
  { type: "score", text: "   AI agent control      █████████░ 92%" },
  { type: "score", text: "   Verification habits   ██████████ 98%" },
];

function TerminalAnimation() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleLines >= terminalLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(0);
        setCurrentCharIndex(0);
      }, 4000);
      return () => clearTimeout(timeout);
    }

    const currentLine = terminalLines[visibleLines];
    if (currentLine.type === "blank") {
      const timeout = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCurrentCharIndex(0);
      }, 200);
      return () => clearTimeout(timeout);
    }

    if (currentCharIndex < currentLine.text.length) {
      const speed =
        currentLine.type === "prompt" ? 30 : currentLine.type === "agent" ? 18 : 12;
      const timeout = setTimeout(() => {
        setCurrentCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }

    const pause =
      currentLine.type === "prompt" ? 500 : currentLine.type === "score" ? 300 : 150;
    const timeout = setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setCurrentCharIndex(0);
    }, pause);
    return () => clearTimeout(timeout);
  }, [visibleLines, currentCharIndex]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [visibleLines, currentCharIndex]);

  const getLineColor = (type: string) => {
    switch (type) {
      case "prompt": return "var(--accent-cyan)";
      case "agent": return "var(--accent-green)";
      case "system": return "var(--text-secondary)";
      case "score": return "var(--accent-amber)";
      default: return "var(--text-primary)";
    }
  };

  return (
    <div className="terminal-window" style={{ maxWidth: 680 }}>
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#ffbd2e" }} />
        <div className="terminal-dot" style={{ background: "#28ca42" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>
          kodwai — live interview session
        </span>
      </div>
      <div className="terminal-body" ref={bodyRef} style={{ height: 340, overflowY: "auto" }}>
        {terminalLines.slice(0, visibleLines + 1).map((line, i) => {
          if (line.type === "blank") return <div key={i} style={{ height: 12 }} />;
          const isCurrentLine = i === visibleLines;
          const displayText = isCurrentLine ? line.text.slice(0, currentCharIndex) : line.text;
          return (
            <div key={i} style={{ color: getLineColor(line.type), fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre" }}>
              {displayText}
              {isCurrentLine && currentCharIndex < line.text.length && (
                <span style={{ display: "inline-block", width: 8, height: 16, background: "var(--accent-cyan)", marginLeft: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────── HELPERS ─────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".animate-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function WaitlistCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 2000, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * 847));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-cyan)", fontWeight: 600 }}>{count.toLocaleString()}+</span>;
}

function WaitlistForm({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email) setSubmitted(true); };
  if (submitted) return <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--accent-green)", padding: "16px 0" }}>✓ You&apos;re in. We&apos;ll be in touch soon.</div>;
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, width: "100%", maxWidth: 480 }} className="flex-col sm:flex-row">
      <input id={id} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="email-input" style={{ flex: 1 }} />
      <button type="submit" className="glow-button" style={{ whiteSpace: "nowrap" }}>Get Early Access</button>
    </form>
  );
}

function CompanyMarquee() {
  const companies = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Stripe", "Figma", "Vercel", "Netflix", "Shopify", "Datadog", "Coinbase"];
  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "24px 0" }}>
      <div className="marquee-track">
        {[...companies, ...companies].map((name, i) => (
          <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", padding: "0 32px", textTransform: "uppercase", letterSpacing: 3, whiteSpace: "nowrap" }}>{name}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── OPTION A ─────────────────────── */

export default function OptionA() {
  useScrollReveal();

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(20px)", background: "rgba(5, 5, 5, 0.8)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 12px var(--accent-cyan)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px", color: "var(--text-primary)" }}>kodwai</span>
        </div>
        <a href="#waitlist-a" className="glow-button" style={{ padding: "10px 24px", fontSize: 12 }}>Join Waitlist</a>
      </nav>

      {/* HERO */}
      <section className="grid-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "140px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", maxWidth: 800, position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid var(--border-subtle)", background: "var(--bg-secondary)", marginBottom: 32, animation: "fade-in-up 0.6s ease forwards" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 8px var(--accent-green)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", letterSpacing: 0.5 }}><WaitlistCounter /> engineers on the waitlist</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px, 7vw, 80px)", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 28, animation: "fade-in-up 0.8s ease 0.1s forwards", opacity: 0 }}>
            Technical Interviews<br /><span className="gradient-text">for the AI Era</span>
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 40px", animation: "fade-in-up 0.8s ease 0.2s forwards", opacity: 0 }}>
            The first platform where candidates use a <span style={{ color: "var(--accent-cyan)" }}>real AI coding agent</span> — not a chatbot. Full session capture. AI-powered scoring. See how engineers <em>actually</em> work.
          </p>
          <div id="waitlist-a" style={{ display: "flex", justifyContent: "center", animation: "fade-in-up 0.8s ease 0.3s forwards", opacity: 0 }}>
            <WaitlistForm id="hero-email-a" />
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginTop: 16, animation: "fade-in-up 0.8s ease 0.4s forwards", opacity: 0 }}>No spam. Unsubscribe anytime. Early users get priority access.</p>
        </div>
        <div style={{ marginTop: 64, width: "100%", maxWidth: 680, animation: "fade-in-up 1s ease 0.5s forwards", opacity: 0 }}>
          <TerminalAnimation />
        </div>
      </section>

      {/* TRUSTED BY */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-secondary)", textAlign: "center", padding: "16px 0" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4, paddingTop: 12 }}>Built for teams hiring at</p>
        <CompanyMarquee />
      </section>

      {/* PROBLEM */}
      <section style={{ padding: "120px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div className="animate-in" style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-amber)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>The Problem</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 24 }}>
            Every company allows AI in interviews.<br /><span style={{ color: "var(--text-muted)" }}>No platform supports it.</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>Existing platforms offer glorified chat windows. Your candidates are using Claude Code, Cursor, and Copilot every day — but interview tools are stuck in 2019.</p>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section style={{ padding: "0 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {[
            { icon: "⚡", title: "Real AI Agent, Not a Chatbot", desc: "Candidates use Claude Code with full terminal, file system, and agentic capabilities. Not a chat window with autocomplete." },
            { icon: "◉", title: "Full Session Capture", desc: "Every prompt, every edit, every terminal command. Complete transcript of how the candidate thinks and collaborates with AI." },
            { icon: "△", title: "AI-Powered Scoring", desc: "Automated evaluation of problem decomposition, AI control, verification habits, and communication patterns." },
          ].map((card, i) => (
            <div key={i} className={`feature-card animate-in animate-in-delay-${i + 1}`}>
              <div style={{ fontSize: 28, marginBottom: 20, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>{card.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 12, letterSpacing: "-0.3px" }}>{card.title}</h3>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "120px 24px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="animate-in" style={{ textAlign: "center", marginBottom: 80 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-cyan)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>How It Works</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1px" }}>Three steps. Zero friction.</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              { num: "01", title: "Set up the challenge", desc: "Define the problem, configure AI access level, set time limits. From system design to debugging — any format works." },
              { num: "02", title: "Candidate codes with AI", desc: "The candidate works with a real Claude Code agent in a live session. The interviewer observes in real time. No restrictions, no toy environments." },
              { num: "03", title: "Review & score", desc: "Get an AI-generated evaluation with full session replay. See every decision, every prompt, every verification step. Scoring you can actually trust." },
            ].map((step, i) => (
              <div key={i} className={`feature-card animate-in animate-in-delay-${i + 1}`} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "start", position: "relative" }}>
                <span className="step-number" style={{ position: "static", opacity: 0.1 }}>{step.num}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 8, letterSpacing: "-0.3px" }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding: "120px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div className="animate-in" style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-red)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Not Another Chat Widget</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1px" }}>See the difference.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <div className="comparison-card animate-in animate-in-delay-1">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Other Platforms</p>
            {["Basic chat assistant", "No file system access", "Single-file editor", "No terminal", "Manual scoring only", "Can't see AI usage patterns"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>
                <span style={{ color: "var(--accent-red)", fontSize: 14 }}>✕</span>{item}
              </div>
            ))}
          </div>
          <div className="comparison-card highlight animate-in animate-in-delay-2">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-cyan)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>kodwai</p>
            {["Full Claude Code agent", "Complete file system & multi-file projects", "Real IDE experience", "Full terminal access", "AI-powered automated scoring", "Complete AI collaboration transcript"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(0,229,255,0.1)", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-primary)" }}>
                <span style={{ color: "var(--accent-cyan)", fontSize: 14 }}>✓</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section style={{ padding: "100px 24px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", textAlign: "center" }}>
        <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 600, lineHeight: 1.5, fontStyle: "italic", color: "var(--text-primary)", marginBottom: 24 }}>&ldquo;We let candidates use AI in interviews but had no way to evaluate how they used it. We were flying blind.&rdquo;</p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>— Engineering Manager at a Series B startup</p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "100px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div className="animate-in" style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1px", marginBottom: 20 }}>The market is moving. <span style={{ color: "var(--text-muted)" }}>Fast.</span></h2>
        </div>
        <div className="animate-in animate-in-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, textAlign: "center" }}>
          {[
            { stat: "87%", label: "of FAANG companies now allow AI in interviews" },
            { stat: "3x", label: "faster hiring decisions with AI-scored sessions" },
            { stat: "0", label: "platforms support real AI coding agents — until now" },
          ].map((item, i) => (
            <div key={i} style={{ padding: 24 }}>
              <div className="gradient-text" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 52, letterSpacing: "-2px", marginBottom: 8 }}>{item.stat}</div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: "120px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="animate-in" style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20 }}>Be first to interview<br /><span className="gradient-text">the AI-native way.</span></h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.6 }}>Early access users get priority onboarding, direct input on features, and lifetime pricing.</p>
          <div style={{ display: "flex", justifyContent: "center" }}><WaitlistForm id="bottom-email-a" /></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>kodwai</span>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", maxWidth: 400 }}>Built for engineering teams that take AI seriously.</p>
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            <a href="https://x.com/kodwai" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>X / Twitter</a>
            <a href="mailto:hello@kodwai.com" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-cyan)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>hello@kodwai.com</a>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 24, opacity: 0.5 }}>&copy; {new Date().getFullYear()} kodwai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
