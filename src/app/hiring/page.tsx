import type { Metadata } from "next";
import HiringPage from "@/components/landing/HiringPage";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

const TITLE = "kodwai for hiring · Interview the way engineers really work";
const SOCIAL_DESCRIPTION =
  "Measure how candidates actually work with AI agents on a realistic ticket. Transparent scores, full session replay, shared review for your team.";

/* This page sets its own openGraph and twitter blocks, which replace the root
   ones wholesale, so the image is listed explicitly (otherwise og:image and
   twitter:image disappear and twitter shows the homepage title). */
export const metadata: Metadata = {
  title: TITLE,
  description:
    "Run real-world coding challenges as private interviews. Measure how candidates work with AI agents: the prompts, the recovery, the verification, the result. Transparent scores, full session replay, shared review.",
  alternates: { canonical: "/hiring" },
  openGraph: {
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    type: "website",
    url: "/hiring",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function Hiring() {
  return <HiringPage />;
}
