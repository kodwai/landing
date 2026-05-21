"use client";

import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ headings }: { headings: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      style={{
        position: "sticky",
        top: 100,
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
        paddingLeft: 24,
        borderLeft: "1px solid #e4e0d8",
      }}
    >
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: "#c23616",
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Table of Contents
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginBottom: 8 }}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(heading.id);
                }
              }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: activeId === heading.id ? "#c23616" : "#9a948a",
                textDecoration: "none",
                paddingLeft: heading.level === 3 ? 16 : 0,
                display: "block",
                lineHeight: 1.5,
                transition: "color 0.2s",
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
