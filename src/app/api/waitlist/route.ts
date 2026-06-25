import { turso } from "@/lib/turso";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: Request) {
  const { email, distinct_id } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await turso.execute({
      sql: "INSERT INTO Waitlist (email, created_at) VALUES (?, datetime('now'))",
      args: [email.toLowerCase().trim()],
    });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: distinct_id || email,
      event: "waitlist_signed_up",
      properties: {
        email: email.toLowerCase().trim(),
        is_existing_signup: false,
      },
    });

    return Response.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("UNIQUE")) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: distinct_id || email,
        event: "waitlist_signed_up",
        properties: {
          email: email.toLowerCase().trim(),
          is_existing_signup: true,
        },
      });
      return Response.json({ ok: true, existing: true });
    }
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
