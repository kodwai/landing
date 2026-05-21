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

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function estimateReadTime(excerpt: string): string {
  const words = excerpt.split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 40) + 2);
  return `${minutes} min read`;
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
    // API unreachable
  }

  const totalPages = Math.ceil(data.total / limit);
  const [featuredPost, ...restPosts] = data.posts;

  return (
    <div>
      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: "#c23616",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Insights & Updates
        </p>
        <h1
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(40px, 6vw, 64px)",
            letterSpacing: "-2px",
            color: "#1a1a1a",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          kodwai Blog
        </h1>
        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#9a948a",
            lineHeight: 1.6,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Deep dives into AI-agent coding, developer tools, and the future of technical interviews.
        </p>
      </div>

      {/* Category Tabs */}
      {(categories.length > 0 || tags.length > 0) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 48,
            paddingBottom: 24,
            borderBottom: "1px solid #e4e0d8",
          }}
        >
          <Link
            href="/blog"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              padding: "8px 20px",
              borderRadius: 24,
              border: !params.category && !params.tag ? "1px solid #c23616" : "1px solid #e4e0d8",
              background: !params.category && !params.tag ? "#c23616" : "transparent",
              color: !params.category && !params.tag ? "#fff" : "#9a948a",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              transition: "all 0.2s",
            }}
          >
            All Posts
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                padding: "8px 20px",
                borderRadius: 24,
                border: params.category === cat.slug ? "1px solid #c23616" : "1px solid #e4e0d8",
                background: params.category === cat.slug ? "#c23616" : "transparent",
                color: params.category === cat.slug ? "#fff" : "#9a948a",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                transition: "all 0.2s",
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
                padding: "8px 20px",
                borderRadius: 24,
                border: params.tag === tag.slug ? "1px solid #c23616" : "1px solid #e4e0d8",
                background: params.tag === tag.slug ? "#c23616" : "transparent",
                color: params.tag === tag.slug ? "#fff" : "#9a948a",
                textDecoration: "none",
                letterSpacing: 1,
                transition: "all 0.2s",
              }}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {data.posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <p
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 24,
              color: "#9a948a",
              marginBottom: 12,
            }}
          >
            No posts yet
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#9a948a" }}>
            Check back soon for insights on AI-agent coding.
          </p>
        </div>
      ) : (
        <>
          {/* Featured Post (first post, full width) */}
          {featuredPost && (
            <Link
              href={`/blog/${featuredPost.slug}`}
              style={{ textDecoration: "none", color: "inherit", display: "block", marginBottom: 48 }}
            >
              <article
                style={{
                  display: "grid",
                  gridTemplateColumns: featuredPost.cover_image_url ? "1fr 1fr" : "1fr",
                  gap: 0,
                  border: "1px solid #e4e0d8",
                  overflow: "hidden",
                  minHeight: 360,
                }}
              >
                {featuredPost.cover_image_url && (
                  <div style={{ overflow: "hidden", minHeight: 360 }}>
                    <img
                      src={featuredPost.cover_image_url}
                      alt={featuredPost.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                )}
                <div
                  style={{
                    padding: "clamp(24px, 4vw, 48px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
                    {featuredPost.category && (
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: "#fff",
                          background: "#c23616",
                          padding: "4px 12px",
                          borderRadius: 12,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        {featuredPost.category.name}
                      </span>
                    )}
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a" }}>
                      {formatDate(featuredPost.published_at)}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontWeight: 400,
                      fontSize: "clamp(26px, 3vw, 36px)",
                      lineHeight: 1.15,
                      letterSpacing: "-1px",
                      color: "#1a1a1a",
                      marginBottom: 16,
                    }}
                  >
                    {featuredPost.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 16,
                      color: "#9a948a",
                      lineHeight: 1.6,
                      marginBottom: 20,
                    }}
                  >
                    {featuredPost.excerpt}
                  </p>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a", letterSpacing: 0.5 }}>
                      {featuredPost.author_name}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#e4e0d8" }}>|</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a", letterSpacing: 0.5 }}>
                      {estimateReadTime(featuredPost.excerpt)}
                    </span>
                  </div>
                  {featuredPost.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag.id}
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 9,
                            color: "#9a948a",
                            border: "1px solid #e4e0d8",
                            padding: "3px 10px",
                            borderRadius: 12,
                            letterSpacing: 0.5,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          )}

          {/* Grid Posts (3 columns) */}
          {restPosts.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
                marginBottom: 48,
              }}
            >
              {restPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <article
                    style={{
                      border: "1px solid #e4e0d8",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {post.cover_image_url && (
                      <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                    )}
                    <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                        {post.category && (
                          <span
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: 9,
                              color: "#fff",
                              background: "#c23616",
                              padding: "3px 10px",
                              borderRadius: 12,
                              letterSpacing: 2,
                              textTransform: "uppercase",
                            }}
                          >
                            {post.category.name}
                          </span>
                        )}
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#9a948a" }}>
                          {formatDate(post.published_at)}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Instrument Serif', Georgia, serif",
                          fontWeight: 400,
                          fontSize: 22,
                          lineHeight: 1.2,
                          letterSpacing: "-0.5px",
                          color: "#1a1a1a",
                          marginBottom: 10,
                        }}
                      >
                        {post.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Instrument Serif', Georgia, serif",
                          fontSize: 15,
                          color: "#9a948a",
                          lineHeight: 1.6,
                          flex: 1,
                        }}
                      >
                        {post.excerpt.length > 140 ? post.excerpt.slice(0, 140) + "..." : post.excerpt}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 16,
                          paddingTop: 16,
                          borderTop: "1px solid #e4e0d8",
                        }}
                      >
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a" }}>
                          {post.author_name}
                        </span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a" }}>
                          {estimateReadTime(post.excerpt)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center", paddingTop: 24, borderTop: "1px solid #e4e0d8" }}>
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
                padding: "10px 24px",
                border: "1px solid #e4e0d8",
                borderRadius: 24,
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
                padding: "10px 24px",
                border: "1px solid #e4e0d8",
                borderRadius: 24,
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
