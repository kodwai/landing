import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "kodwai — Technical Interviews for the AI Era",
  description:
    "The first interview platform where candidates use a real AI coding agent, not a chatbot. Full session capture. AI-powered scoring. See how engineers actually work with AI.",
  keywords: [
    "AI interview",
    "technical interview",
    "Claude Code",
    "AI coding agent",
    "interview platform",
    "engineering hiring",
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
    title: "kodwai — Technical Interviews for the AI Era",
    description:
      "The first interview platform where candidates use a real AI coding agent. Full session capture. AI-powered scoring.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kodwai — Technical Interviews for the AI Era",
    description:
      "The first interview platform where candidates use a real AI coding agent. Full session capture. AI-powered scoring.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col noise-overlay">{children}</body>
    </html>
  );
}
