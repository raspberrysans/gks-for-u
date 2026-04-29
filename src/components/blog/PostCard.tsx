import Link from "next/link";
import type { Post } from "@/lib/blog/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border border-[color:var(--line)] bg-[color:var(--bg-card)] p-6 transition hover:border-[color:var(--accent)]"
    >
      <div className="flex items-center justify-between text-[color:var(--muted)] text-xs mb-3">
        <time dateTime={post.date} className="font-mono">
          {formatDate(post.date)}
        </time>
        <span className="font-mono">{post.readingTimeText}</span>
      </div>
      <h2 className="display text-2xl mb-3 text-[color:var(--ink)] leading-tight group-hover:text-[color:var(--accent-text)] transition-colors">
        {post.title}
      </h2>
      <p className="text-[color:var(--ink-soft)] text-sm leading-6">{post.description}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-[color:var(--accent-text)] text-sm">
        read article <span aria-hidden>→</span>
      </div>
    </Link>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
