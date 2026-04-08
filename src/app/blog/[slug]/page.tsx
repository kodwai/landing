import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

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
            fontFamily: "'Space Mono', monospace",
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
    <article style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Back link */}
      <Link
        href="/blog"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: "#9a948a",
          textDecoration: "none",
          letterSpacing: 2,
          textTransform: "uppercase",
          display: "inline-block",
          marginBottom: 32,
        }}
      >
        &larr; All posts
      </Link>

      {/* Meta */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {post.category && (
          <Link
            href={`/blog?category=${post.category.slug}`}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: "#c23616",
              letterSpacing: 2,
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            {post.category.name}
          </Link>
        )}
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a" }}>
          {formatDate(post.published_at)}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#9a948a" }}>
          by {post.author_name}
        </span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(32px, 5vw, 52px)",
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          color: "#1a1a1a",
          marginBottom: 24,
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
            color: "#9a948a",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          {post.excerpt}
        </p>
      )}

      {/* Accent line */}
      <div style={{ width: 48, height: 1, background: "#c23616", marginBottom: 32 }} />

      {/* Cover image */}
      {post.cover_image_url && (
        <div style={{ marginBottom: 40 }}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ width: "100%", height: "auto", border: "1px solid #e4e0d8" }}
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 18,
          lineHeight: 1.8,
          color: "#1a1a1a",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content_md}</ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div style={{ marginTop: 48, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: "#9a948a",
                border: "1px solid #e4e0d8",
                padding: "4px 12px",
                letterSpacing: 0.5,
                textDecoration: "none",
              }}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ width: 48, height: 1, background: "#c23616", margin: "56px auto" }} />

      {/* Back CTA */}
      <div style={{ textAlign: "center" }}>
        <Link
          href="/blog"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: "#9a948a",
            textDecoration: "none",
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "10px 24px",
            border: "1px solid #e4e0d8",
          }}
        >
          More posts
        </Link>
      </div>
    </article>
  );
}
