"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const S = {
  bg: "#faf8f4",
  text: "#1a1a1a",
  accent: "#c23616",
  muted: "#9a948a",
  border: "#e4e0d8",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontMono: "'Space Mono', monospace",
};

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax;Secure`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function updateConsent(granted: boolean) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookie_consent");
    if (consent === "accepted") {
      updateConsent(true);
    } else if (consent === "declined") {
      updateConsent(false);
    } else {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie("cookie_consent", "accepted", 365);
    updateConsent(true);
    setVisible(false);
    // Let other components (e.g. the hero video) know the banner is closed.
    window.dispatchEvent(new Event("kodwai:consent-resolved"));
  };

  const handleDecline = () => {
    setCookie("cookie_consent", "declined", 180);
    updateConsent(false);
    setVisible(false);
    window.dispatchEvent(new Event("kodwai:consent-resolved"));
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop — visual only; clicking it must NOT dismiss the banner.
         The banner closes only via Accept or Decline. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(250, 248, 244, 0.7)",
          backdropFilter: "blur(3px)",
          zIndex: 9998,
          animation: "cookieFadeIn 0.4s ease",
        }}
      />

      {/* Banner */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          padding: "0 clamp(16px, 4vw, 48px) 32px",
          animation: "cookieSlideUp 0.5s ease",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
            background: S.bg,
            border: `1px solid ${S.border}`,
            padding: "32px 32px 28px",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: S.fontMono,
              fontSize: 10,
              color: S.accent,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Cookies
          </p>

          <p
            style={{
              fontFamily: S.fontDisplay,
              fontSize: 18,
              color: S.text,
              lineHeight: 1.6,
              marginBottom: 8,
            }}
          >
            We use analytics cookies to understand how you interact with kodwai
            and improve the experience.
          </p>

          <p
            style={{
              fontFamily: S.fontMono,
              fontSize: 11,
              color: S.muted,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            By continuing to browse, you help us build a better product.
          </p>

          {/* Accept button — prominent */}
          <button
            onClick={handleAccept}
            style={{
              width: "100%",
              padding: "16px 0",
              background: S.accent,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontFamily: S.fontMono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
              marginBottom: 12,
              boxShadow: "0 2px 8px rgba(194, 54, 22, 0.25)",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#d94420";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(194, 54, 22, 0.35)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = S.accent;
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(194, 54, 22, 0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(1px)";
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(194, 54, 22, 0.2)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(194, 54, 22, 0.35)";
            }}
          >
            Accept &amp; Continue →
          </button>

          {/* Manage preferences — subtle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              width: "100%",
              padding: "8px 0",
              background: "transparent",
              color: S.muted,
              border: "none",
              fontFamily: S.fontMono,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = S.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = S.muted;
            }}
          >
            Manage preferences
          </button>

          {/* Expandable settings */}
          {showSettings && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: `1px solid ${S.border}`,
              }}
            >
              {/* Essential */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: S.fontDisplay,
                      fontSize: 15,
                      color: S.text,
                      marginBottom: 4,
                    }}
                  >
                    Essential
                  </p>
                  <p
                    style={{
                      fontFamily: S.fontMono,
                      fontSize: 9,
                      color: S.muted,
                      letterSpacing: 1,
                    }}
                  >
                    Required for the site to function
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: S.fontMono,
                    fontSize: 9,
                    color: S.accent,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Always on
                </span>
              </div>

              {/* Analytics */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: S.fontDisplay,
                      fontSize: 15,
                      color: S.text,
                      marginBottom: 4,
                    }}
                  >
                    Analytics
                  </p>
                  <p
                    style={{
                      fontFamily: S.fontMono,
                      fontSize: 9,
                      color: S.muted,
                      letterSpacing: 1,
                    }}
                  >
                    Google Analytics · Traffic &amp; usage data
                  </p>
                </div>
              </div>

              <button
                onClick={handleDecline}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  background: "transparent",
                  color: S.muted,
                  border: `1px solid ${S.border}`,
                  fontFamily: S.fontMono,
                  fontSize: 9,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = S.text;
                  e.currentTarget.style.color = S.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = S.border;
                  e.currentTarget.style.color = S.muted;
                }}
              >
                Decline optional cookies
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cookieFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
