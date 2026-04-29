import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import PostCard from "@/components/blog/PostCard";
import JsonLd from "@/components/blog/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "GKS Scholarship Blog — Guides, Tracks & Application Tips",
  description:
    "Plain-English guides to the Global Korea Scholarship for undergraduate degrees: eligibility, every track explained, application timeline, and document checklists.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "GKS Scholarship Blog — Guides, Tracks & Application Tips",
    description:
      "Plain-English guides to the Global Korea Scholarship for undergraduate degrees.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "GKS Scholarship Blog",
    description:
      "Plain-English guides to the Global Korea Scholarship for undergraduate degrees.",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const itemList = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "gks for u — Blog",
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated || p.date,
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 md:py-20">
      <JsonLd data={itemList} />
      <nav className="mb-6 text-xs text-[color:var(--muted)]">
        <Link href="/" className="link-draw hover:text-[color:var(--ink)]">
          home
        </Link>{" "}
        / <span className="text-[color:var(--ink)]">blog</span>
      </nav>
      <header className="mb-12 md:mb-16">
        <div className="kicker text-[color:var(--accent-text)] mb-4">the blog</div>
        <h1 className="display text-4xl md:text-6xl text-[color:var(--ink)] mb-5 leading-[0.95]">
          everything you need to know about the global korea scholarship.
        </h1>
        <p className="max-w-2xl text-[color:var(--ink-soft)] leading-7">
          Practical, source-cited guides for international students applying to the GKS-U
          (undergraduate) scholarship. Eligibility, tracks, timelines, documents — all
          drawn directly from the official 2025 NIIED guideline.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
