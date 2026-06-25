import type { Metadata } from "next";
import HiringPage from "@/components/landing/HiringPage";

export const metadata: Metadata = {
  title: "kodwai for hiring · Interview the way engineers really work",
  description:
    "Run real-world coding challenges as private interviews. Measure how candidates work with AI agents: the prompts, the recovery, the verification, the result. Transparent scores, full session replay, shared review.",
  openGraph: {
    title: "kodwai for hiring · Interview the way engineers really work",
    description:
      "Measure how candidates actually work with AI agents on a realistic ticket. Transparent scores, full session replay, shared review for your team.",
    type: "website",
  },
};

export default function Hiring() {
  return <HiringPage />;
}
