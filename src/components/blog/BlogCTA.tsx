import Link from "next/link";

export default function BlogCTA({
  title = "find out if you qualify in two minutes",
  body = "the eligibility checker walks you through citizenship, age, gpa, language, and track-specific requirements — no signup needed.",
  href = "/eligibility",
  cta = "start eligibility check",
}: {
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <aside className="my-12 border border-[color:var(--line-strong)] bg-[color:var(--bg-card)] p-6 md:p-8">
      <div className="kicker text-[color:var(--accent-text)]">next step</div>
      <h3 className="display text-2xl md:text-3xl mt-2 mb-3 text-[color:var(--ink)]">
        {title}
      </h3>
      <p className="text-[color:var(--ink-soft)] leading-7 mb-5 max-w-prose">{body}</p>
      <Link href={href} className="btn btn-primary">
        {cta}
      </Link>
    </aside>
  );
}
