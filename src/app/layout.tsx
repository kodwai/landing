import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import { SITE_URL } from "@/lib/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// metadataBase resolves every relative metadata URL (og:image, canonicals)
// against the canonical www host. Canonicals are set per page, never here:
// children inherit layout metadata, so a root canonical would mark every page
// as a duplicate of the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "kodwai · AI-Agent Coding Challenges for Developers",
  // The short form from the kodwai-context fact sheet, verbatim (under 160 chars).
  description:
    "Real coding challenges you solve with your own AI agent. kodwai scores how well you direct it: Direction, Outcome, Lift.",
  keywords: [
    "AI coding challenge",
    "developer platform",
    "Claude Code",
    "Codex",
    "AI coding agent",
    "coding leaderboard",
    "developer challenges",
  ],
  icons: {
    icon: [
      { url: "/icon", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "kodwai · AI-Agent Coding Challenges for Developers",
    description:
      "Solve coding challenges with your preferred AI agent: Claude Code, Cursor, Codex, and more. Compete on leaderboards and build your profile.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kodwai · AI-Agent Coding Challenges for Developers",
    description:
      "Solve coding challenges with your preferred AI agent: Claude Code, Cursor, Codex, and more. Compete on leaderboards and build your profile.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col noise-overlay">
        <GoogleAnalytics />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
