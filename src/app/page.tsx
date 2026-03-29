"use client";

import { useState } from "react";
import OptionA from "@/components/OptionA";
import OptionB from "@/components/OptionB";
import OptionC from "@/components/OptionC";
import OptionD from "@/components/OptionD";
import OptionE from "@/components/OptionE";
import OptionF from "@/components/OptionF";
import OptionG from "@/components/OptionG";
import OptionH from "@/components/OptionH";

const options = [
  { key: "A", color: "#00e5ff", desc: "Terminal Cinema" },
  { key: "B", color: "#f59e0b", desc: "Holographic Noir" },
  { key: "C", color: "#e8b931", desc: "Celestial" },
  { key: "D", color: "#d4845a", desc: "Forge" },
  { key: "E", color: "#c23616", desc: "Paper Cut" },
  { key: "F", color: "#ff2d78", desc: "Neon Arcade" },
  { key: "G", color: "#e60012", desc: "Swiss Poster" },
  { key: "H", color: "#7cb68e", desc: "Midnight Garden" },
] as const;

type OptionKey = (typeof options)[number]["key"];

const components: Record<OptionKey, React.ComponentType> = {
  A: OptionA, B: OptionB, C: OptionC, D: OptionD,
  E: OptionE, F: OptionF, G: OptionG, H: OptionH,
};

export default function Home() {
  const [active, setActive] = useState<OptionKey>("A");
  const ActiveComponent = components[active];

  return (
    <>
      <ActiveComponent />

      {/* ═══ TOGGLE ═══ */}
      <div style={{
        position: "fixed", bottom: 24, left: 24, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 4,
        background: "rgba(8, 8, 8, 0.95)", border: "1px solid #2a2a2a",
        borderRadius: 14, padding: 6, backdropFilter: "blur(24px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          padding: "4px 10px", fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8, color: "#444", letterSpacing: 2, textTransform: "uppercase",
          textAlign: "center",
        }}>
          Design Option
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {options.map(opt => (
            <button
              key={opt.key}
              onClick={() => { setActive(opt.key); window.scrollTo(0, 0); }}
              title={opt.desc}
              style={{
                padding: "8px 12px", borderRadius: 6, border: "none",
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                transition: "all 0.2s",
                background: active === opt.key ? opt.color : "transparent",
                color: active === opt.key ? "#050505" : "#555",
              }}
            >
              {opt.key}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
