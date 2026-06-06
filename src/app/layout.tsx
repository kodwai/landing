import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "kodwai · AI-Agent Coding Challenges for Developers",
  description:
    "Solve real-world coding challenges on your own machine with your preferred AI agent: Claude Code, Cursor, Codex, and more. Compete on leaderboards, build your profile, and prove your AI collaboration skills.",
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
