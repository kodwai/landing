"use client";

import { Serif, Accent, GhostLink } from "@/components/landing/system";
import { PublicShell, Section, Crumbs, P } from "@/components/landing/PublicShell";

export default function ChallengeNotFoundView() {
  return (
    <PublicShell section="challenges" campaign="challenge_not_found">
      <Section first style={{ minHeight: "50vh" }}>
        <Crumbs items={[{ label: "Home", href: "/" }, { label: "Challenges", href: "/challenges" }, { label: "Not found" }]} />
        <Serif as="h1" size="h2" style={{ marginBottom: 20 }}>Challenge <Accent>not found.</Accent></Serif>
        <P>This challenge does not exist or is not public. Every public challenge is listed on the challenges page.</P>
        <div style={{ marginTop: 24 }}>
          <GhostLink label="browse all challenges" href="/challenges" event="cta_clicked" eventProps={{ location: "challenge_not_found" }} />
        </div>
      </Section>
    </PublicShell>
  );
}
