import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TableOfContents from "./TableOfContents";

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
  content_md: string;
  cover_image_url: string | null;
  author_name: string;
  author_avatar_url: string | null;
  category: BlogCategory | null;
  tags: BlogTag[];
  status: string;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found | kodwai" };

  return {
    title: `${post.seo_title || post.title} | kodwai Blog`,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
    },
  };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  // Extract headings for Table of Contents
  const headings = post
    ? (post.content_md.match(/^#{2,3}\s+.+$/gm) || []).map((line) => {
        const level = line.startsWith("### ") ? 3 : 2;
        const text = line.replace(/^#{2,3}\s+/, "");
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return { id, text, level };
      })
    : [];

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "120px 0" }}>
        <h1
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 36,
            color: "#1a1a1a",
            marginBottom: 16,
          }}
        >
          Post not found
        </h1>
        <Link
          href="/blog"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            color: "#c23616",
            textDecoration: "none",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* Breadcrumb */}
      <nav
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          color: "#9a948a",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Link href="/" style={{ color: "#9a948a", textDecoration: "none" }}>Home</Link>
        <span style={{ color: "#e4e0d8" }}>&rsaquo;</span>
        <Link href="/blog" style={{ color: "#9a948a", textDecoration: "none" }}>Blog</Link>
        <span style={{ color: "#e4e0d8" }}>&rsaquo;</span>
        <span style={{ color: "#1a1a1a" }}>{post.title.length > 50 ? post.title.slice(0, 50) + "..." : post.title}</span>
      </nav>

      {/* Hero: Cover Image with Dark Gradient Overlay + Title */}
      <div
        style={{
          position: "relative",
          marginBottom: 48,
          borderRadius: 0,
          overflow: "hidden",
          minHeight: post.cover_image_url ? 520 : "auto",
          background: post.cover_image_url ? "#111" : "transparent",
        }}
      >
        {post.cover_image_url && (
          <>
            {/* Background image */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Gradient overlays */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)",
              }}
            />
          </>
        )}

        {/* Content over image */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: post.cover_image_url ? "clamp(40px, 6vw, 80px) clamp(24px, 4vw, 48px)" : "0 0 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            minHeight: post.cover_image_url ? 520 : "auto",
            maxWidth: 860,
          }}
        >
          {/* Category badge */}
          {post.category && (
            <Link
              href={`/blog?category=${post.category.slug}`}
              style={{
                display: "inline-block",
                width: "fit-content",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 9,
                color: "#fff",
                background: "#c23616",
                padding: "5px 16px",
                borderRadius: 0,
                letterSpacing: 2,
                textTransform: "uppercase",
                textDecoration: "none",
                marginBottom: 20,
              }}
            >
              {post.category.name}
            </Link>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              color: post.cover_image_url ? "#fff" : "#1a1a1a",
              marginBottom: 20,
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 20,
                color: post.cover_image_url ? "rgba(255,255,255,0.8)" : "#9a948a",
                lineHeight: 1.6,
                marginBottom: 28,
                maxWidth: 680,
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author + Date + Read time */}
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: post.cover_image_url ? "rgba(255,255,255,0.2)" : "#e4e0d8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 12,
                  color: post.cover_image_url ? "#fff" : "#9a948a",
                }}
              >
                {post.author_name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: post.cover_image_url ? "#fff" : "#1a1a1a" }}>
                {post.author_name}
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: post.cover_image_url ? "rgba(255,255,255,0.7)" : "#9a948a" }}>
              {formatDate(post.published_at)}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: post.cover_image_url ? "rgba(255,255,255,0.7)" : "#9a948a" }}>
              {estimateReadTime(post.content_md)}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#e4e0d8", marginBottom: 48 }} />

      {/* Content + TOC Sidebar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: headings.length > 0 ? "1fr 240px" : "1fr",
          gap: 48,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Main Content */}
        <div>
          <div
            className="prose prose-lg max-w-none"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 18,
              lineHeight: 1.8,
              color: "#1a1a1a",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return <h2 id={id} style={{ scrollMarginTop: 100 }} {...props}>{children}</h2>;
                },
                h3: ({ children, ...props }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return <h3 id={id} style={{ scrollMarginTop: 100 }} {...props}>{children}</h3>;
                },
              }}
            >
              {post.content_md}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ marginTop: 48, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 10,
                    color: "#9a948a",
                    border: "1px solid #e4e0d8",
                    padding: "6px 16px",
                    borderRadius: 0,
                    letterSpacing: 0.5,
                    textDecoration: "none",
                  }}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* TOC Sidebar */}
        {headings.length > 0 && (
          <aside>
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          maxWidth: 760,
          margin: "56px auto 0",
          paddingTop: 48,
          borderTop: "1px solid #e4e0d8",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 24,
            color: "#1a1a1a",
            marginBottom: 8,
          }}
        >
          Enjoyed this post?
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            color: "#9a948a",
            marginBottom: 24,
          }}
        >
          Check out more articles on AI-agent coding and developer tools.
        </p>
        <Link
          href="/blog"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#9a948a",
            textDecoration: "none",
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "12px 28px",
            border: "1px solid #e4e0d8",
            borderRadius: 0,
          }}
        >
          All Posts
        </Link>
      </div>
    </article>
  );
}
