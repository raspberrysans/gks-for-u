import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import JsonLd from "@/components/blog/JsonLd";
import BlogCTA from "@/components/blog/BlogCTA";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { default: MDXContent } = await import(`@/../content/blog/${slug}.mdx`);

  const url = `${SITE_URL}/blog/${post.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { "@type": "Organization", name: post.author || SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.keywords?.join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <nav className="mb-6 text-xs text-[color:var(--muted)]">
        <Link href="/" className="link-draw hover:text-[color:var(--ink)]">
          home
        </Link>{" "}
        /{" "}
        <Link href="/blog" className="link-draw hover:text-[color:var(--ink)]">
          blog
        </Link>{" "}
        / <span className="text-[color:var(--ink)]">{post.title}</span>
      </nav>
      <header className="mb-10">
        <div className="kicker text-[color:var(--accent-text)] mb-4">guide</div>
        <h1 className="display text-3xl md:text-5xl leading-[1.02] text-[color:var(--ink)] mb-5">
          {post.title}
        </h1>
        <p className="text-[color:var(--ink-soft)] leading-7 text-lg">{post.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[color:var(--muted)] font-mono">
          <span>
            published{" "}
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </span>
          {post.updated && post.updated !== post.date && (
            <span>
              updated{" "}
              <time dateTime={post.updated}>
                {new Date(post.updated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </span>
          )}
          <span>{post.readingTimeText}</span>
          <span>{post.wordCount.toLocaleString()} words</span>
        </div>
      </header>
      <article className="border-t border-[color:var(--line)] pt-8">
        <MDXContent />
        <BlogCTA />
        <hr className="my-10 border-[color:var(--line)]" />
        <p className="text-xs text-[color:var(--muted)] leading-6">
          Source: 2025 Global Korea Scholarship Application Guidelines for Undergraduate
          Degrees, National Institute for International Education (NIIED). Always verify
          the latest guidelines on{" "}
          <a
            href="https://www.studyinkorea.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--accent-text)] underline"
          >
            studyinkorea.go.kr
          </a>{" "}
          before submitting your application.
        </p>
      </article>
      <RelatedPosts currentSlug={post.slug} />
    </main>
  );
}

function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const others = getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);
  if (others.length === 0) return null;
  return (
    <section className="mt-16 border-t border-[color:var(--line)] pt-10">
      <h2 className="display text-xl mb-5 text-[color:var(--ink)]">keep reading</h2>
      <ul className="space-y-4">
        {others.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="block group border-l-2 border-[color:var(--line-strong)] hover:border-[color:var(--accent)] pl-4 transition"
            >
              <div className="font-semibold text-[color:var(--ink)] group-hover:text-[color:var(--accent-text)] transition">
                {p.title}
              </div>
              <div className="text-sm text-[color:var(--muted)] mt-1">
                {p.description}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
