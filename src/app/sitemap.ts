import type { MetadataRoute } from "next";

const API_URL = process.env.API_URL || "http://localhost:8000";
const SITE_URL = "https://kodwai.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pitch`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/blog/sitemap`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const posts: { slug: string; published_at: string; updated_at: string }[] = await res.json();
      blogRoutes = posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // API unreachable
  }

  return [...staticRoutes, ...blogRoutes];
}
