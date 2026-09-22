import type { Metadata } from "next";

/* The short pitch deck is shared by direct link only. The page is a client
   component and cannot export metadata, so this server layout keeps it out of
   search indexes. robots.txt must keep allowing /pitch-short: crawlers can
   only obey a noindex on a page they are allowed to fetch. */
export const metadata: Metadata = {
  title: "kodwai pitch deck",
  robots: { index: false, follow: false },
};

export default function PitchShortLayout({ children }: { children: React.ReactNode }) {
  return children;
}
