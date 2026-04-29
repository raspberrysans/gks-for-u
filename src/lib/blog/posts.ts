import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  keywords?: string[];
  ogImage?: string;
  author?: string;
};

export type Post = PostFrontmatter & {
  readingTimeText: string;
  readingTimeMinutes: number;
  wordCount: number;
};

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: Post[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const stats = readingTime(content);
    const fm = data as PostFrontmatter;
    const slug = fm.slug || file.replace(/\.mdx$/, "");
    return {
      ...fm,
      slug,
      readingTimeText: stats.text,
      readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
    };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
