import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TableOfContents from "./TableOfContents";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL, jsonLdScript, toIsoUtc } from "@/lib/site";

const API_URL = process.env.API_URL || "http://localhost:8000";

// Posts are cached and refreshed at most once a minute (ISR).
export const revalidate = 60;

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

// Sibling API routes that share the /api/blog/{slug} shape but are not posts.
const RESERVED_SLUGS = new Set(["sitemap", "rss", "categories", "tags"]);

/* Null only when the API says the post does not exist (404). Any other
   failure throws, so an API outage never serves a real post as a soft 404:
   ISR keeps the last good page, and an uncached page returns a 5xx. */
async function getPost(slug: string): Promise<BlogPost | null> {
  if (RESERVED_SLUGS.has(slug)) return null;
  const res = await fetch(`${API_URL}/api/blog/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Blog API returned ${res.status} for "${slug}"`);
  const post = (await res.json()) as BlogPost;
  if (!post || typeof post.slug !== "string" || typeof post.content_md !== "string") return null;
  return post;
}

/* Prerender known posts so their metadata lands in <head> for every crawler.
   Unknown slugs still render on demand (dynamicParams defaults to true). */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog/sitemap`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const posts: { slug: string }[] = await res.json();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return {
    title: `${post.seo_title || post.title} | kodwai Blog`,
    description: post.seo_description || post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: toIsoUtc(post.published_at),
      modifiedTime: toIsoUtc(post.updated_at),
      authors: [post.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
    },
  };
}

/* Heading ids. One slugger drives both the rendered heading ids (rehype pass
   over the parsed tree, so inline code, links, and emphasis in a heading are
   read as plain text) and the table of contents, so anchors always match.
   Repeated headings get -1, -2 suffixes. */
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
}

function hastText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const slug = createSlugger();
    const visit = (node: HastNode) => {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        node.properties = { ...node.properties, id: slug(hastText(node)) };
        return;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

/* Plain text of a markdown heading line: drop images, keep link text, strip
   emphasis and code markers. Mirrors what the rendered heading shows. */
function markdownHeadingText(line: string): string {
  return line
    .replace(/^#{2,3}\s+/, "")
    .replace(/\s+#+\s*$/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

function extractHeadings(markdown: string) {
  const slug = createSlugger();
  const headings: { id: string; text: string; level: number }[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence || !/^#{2,3}\s+\S/.test(line)) continue;
    const text = markdownHeadingText(line);
    headings.push({ id: slug(text), text, level: line.startsWith("### ") ? 3 : 2 });
  }
  return headings;
}

/* BlogPosting + BreadcrumbList. A team byline is credited to the
   organization; a named byline is a Person. */
function postJsonLd(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const isTeam = /\bteam\b|kodwai/i.test(post.author_name);
  const organization = {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon`,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: post.title,
        description: post.seo_description || post.excerpt,
        image: post.cover_image_url || `${url}/opengraph-image`,
        datePublished: toIsoUtc(post.published_at) ?? toIsoUtc(post.created_at),
        dateModified: toIsoUtc(post.updated_at) ?? toIsoUtc(post.published_at),
        author: isTeam ? organization : { "@type": "Person", name: post.author_name },
        publisher: organization,
        articleSection: post.category?.name,
        keywords: post.tags.map((t) => t.name).join(", ") || undefined,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
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
  if (!post) notFound();

  // Table of contents, using the same slugger as the rendered heading ids
  const headings = extractHeadings(post.content_md);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(postJsonLd(post)) }} />

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
        className="k-post-grid"
        style={{
          display: "grid",
          gridTemplateColumns: headings.length > 0 ? "minmax(0, 1fr) 240px" : "minmax(0, 1fr)",
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
              rehypePlugins={[rehypeHeadingIds]}
              components={{
                // Pass only the id (set by rehypeHeadingIds) and children. Spreading
                // all props would leak react-markdown's `node` onto the DOM.
                h2: ({ id, children }) => <h2 id={id} style={{ scrollMarginTop: 100 }}>{children}</h2>,
                h3: ({ id, children }) => <h3 id={id} style={{ scrollMarginTop: 100 }}>{children}</h3>,
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
          <aside className="k-post-toc">
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
