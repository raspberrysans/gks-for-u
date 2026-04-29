import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

const headingId = (children: ReactNode): string | undefined => {
  if (typeof children !== "string") return undefined;
  return children
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1
        id={headingId(children)}
        className="display text-4xl md:text-5xl mt-2 mb-6 text-[color:var(--ink)]"
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        id={headingId(children)}
        className="display text-2xl md:text-3xl mt-12 mb-4 text-[color:var(--ink)] scroll-mt-24"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={headingId(children)}
        className="display text-xl md:text-2xl mt-8 mb-3 text-[color:var(--ink)] scroll-mt-24"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        id={headingId(children)}
        className="font-semibold text-base mt-6 mb-2 text-[color:var(--ink)]"
      >
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="my-4 leading-7 text-[color:var(--ink-soft)] text-[0.98rem]">
        {children}
      </p>
    ),
    a: ({ href = "#", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return (
          <Link
            href={href}
            className="text-[color:var(--accent-text)] underline underline-offset-4 decoration-[color:var(--accent)]/40 hover:decoration-[color:var(--accent)] transition"
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--accent-text)] underline underline-offset-4 decoration-[color:var(--accent)]/40 hover:decoration-[color:var(--accent)] transition"
          {...rest}
        >
          {children}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc space-y-2 text-[color:var(--ink-soft)] marker:text-[color:var(--accent)]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2 text-[color:var(--ink-soft)] marker:text-[color:var(--muted)]">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-[color:var(--accent)] bg-[color:var(--bg-soft)] px-5 py-3 italic text-[color:var(--ink-soft)]">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.85em] bg-[color:var(--bg-soft)] border border-[color:var(--line)] px-1.5 py-0.5">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto bg-[color:var(--bg-soft)] border border-[color:var(--line)] p-4 font-mono text-xs leading-6">
        {children}
      </pre>
    ),
    hr: () => <hr className="my-10 border-t border-[color:var(--line-strong)]" />,
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto border border-[color:var(--line-strong)]">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-[color:var(--bg-soft)] text-left">{children}</thead>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-[color:var(--line)] last:border-b-0">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 font-semibold text-[color:var(--ink)] kicker text-[0.7rem]">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 align-top text-[color:var(--ink-soft)]">{children}</td>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-[color:var(--ink)]">{children}</strong>
    ),
    ...components,
  };
}
