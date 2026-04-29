import type { ReactNode } from "react";

export type FAQItem = { q: string; a: ReactNode };

export default function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <section className="my-10">
      <h2 id="faq" className="display text-2xl md:text-3xl mt-12 mb-6 scroll-mt-24">
        frequently asked questions
      </h2>
      <div className="divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
        {items.map((item, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
              <span className="font-semibold text-[color:var(--ink)] text-[1rem]">
                {item.q}
              </span>
              <span className="mt-1 shrink-0 text-[color:var(--accent-text)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-3 text-[color:var(--ink-soft)] leading-7 [&>p]:my-2">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
