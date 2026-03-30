import { turso } from "@/lib/turso";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await turso.execute({
      sql: "INSERT INTO Waitlist (email, created_at) VALUES (?, datetime('now'))",
      args: [email.toLowerCase().trim()],
    });
    return Response.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("UNIQUE")) {
      return Response.json({ ok: true, existing: true });
    }
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
