import OptionE, { type Challenge } from "@/components/OptionE";
import { turso } from "@/lib/turso";

// Refresh the challenge catalog from Turso every 5 minutes.
export const revalidate = 300;

async function getChallenges(): Promise<Challenge[]> {
  try {
    const res = await turso.execute(
      "select slug, title, description, difficulty, category, time_limit_minutes from challenges where is_public = 1 order by is_featured desc, submission_count desc, title"
    );
    return res.rows.map((r) => ({
      slug: String(r.slug),
      title: String(r.title),
      description: String(r.description ?? ""),
      difficulty: String(r.difficulty ?? "medium"),
      category: String(r.category ?? "backend"),
      minutes: Number(r.time_limit_minutes ?? 60),
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const challenges = await getChallenges();
  return <OptionE challenges={challenges} />;
}
