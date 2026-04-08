import Link from "next/link";

const API_URL = process.env.API_URL || "http://localhost:8000";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  author_name: string;
  category: BlogCategory | null;
  tags: BlogTag[];
  published_at: string | null;
}

interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1") || 1;
  const limit = 12;

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (params.category) qs.set("category", params.category);
  if (params.tag) qs.set("tag", params.tag);

  let data: BlogListResponse = { posts: [], total: 0, page: 1, limit: 12 };
  let categories: BlogCategory[] = [];
  let tags: BlogTag[] = [];

  try {
    const [postsRes, catsRes, tagsRes] = await Promise.all([
      fetch(`${API_URL}/api/blog?${qs}`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/api/blog/categories`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/api/blog/tags`, { next: { revalidate: 300 } }),
    ]);
    if (postsRes.ok) data = await postsRes.json();
    if (catsRes.ok) categories = await catsRes.json();
    if (tagsRes.ok) tags = await tagsRes.json();
  } catch {
    // API unreachable — show empty state
  }

  const totalPages = Math.ceil(data.total / limit);

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateStr;
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 56px)",
            letterSpacing: "-1px",
            color: "#1a1a1a",
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          Blog
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: "#9a948a", letterSpacing: 0.5 }}>
          Insights on AI-agent coding, developer tools, and the future of technical interviews.
        </p>
      </div>

      {/* Filters */}
      {(categories.length > 0 || tags.length > 0) && (
        <div style={{ marginBottom: 40, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link
            href="/blog"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              padding: "6px 14px",
              border: !params.category && !params.tag ? "1px solid #c23616" : "1px solid #e4e0d8",
              color: !params.category && !params.tag ? "#c23616" : "#9a948a",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                padding: "6px 14px",
                border: params.category === cat.slug ? "1px solid #c23616" : "1px solid #e4e0d8",
                color: params.category === cat.slug ? "#c23616" : "#9a948a",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              {cat.name}
            </Link>
          ))}
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                padding: "6px 14px",
                border: params.tag === tag.slug ? "1px solid #c23616" : "1px solid #e4e0d8",
                color: params.tag === tag.slug ? "#c23616" : "#9a948a",
                textDecoration: "none",
                letterSpacing: 1,
              }}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {data.posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: "#9a948a" }}>
            No posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 32,
            marginBottom: 48,
          }}
        >
          {data.posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                style={{
                  border: "1px solid #e4e0d8",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                {post.cover_image_url && (
                  <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    {post.category && (
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: "#c23616",
                          letterSpacing: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        {post.category.name}
                      </span>
                    )}
                    {post.published_at && (
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: "#9a948a",
                          letterSpacing: 1,
                        }}
                      >
                        {formatDate(post.published_at)}
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontWeight: 400,
                      fontSize: 24,
                      lineHeight: 1.2,
                      letterSpacing: "-0.5px",
                      color: "#1a1a1a",
                      marginBottom: 10,
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 15,
                      color: "#9a948a",
                      lineHeight: 1.6,
                      marginBottom: 16,
                    }}
                  >
                    {post.excerpt}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: "#9a948a",
                          border: "1px solid #e4e0d8",
                          padding: "2px 8px",
                          letterSpacing: 0.5,
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a", marginTop: 12, letterSpacing: 0.5 }}>
                    {post.author_name}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
          {page > 1 && (
            <Link
              href={`/blog?page=${page - 1}${params.category ? `&category=${params.category}` : ""}${params.tag ? `&tag=${params.tag}` : ""}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#9a948a",
                textDecoration: "none",
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "8px 20px",
                border: "1px solid #e4e0d8",
              }}
            >
              Previous
            </Link>
          )}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#9a948a" }}>
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/blog?page=${page + 1}${params.category ? `&category=${params.category}` : ""}${params.tag ? `&tag=${params.tag}` : ""}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#9a948a",
                textDecoration: "none",
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "8px 20px",
                border: "1px solid #e4e0d8",
              }}
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
