import type { ReactNode } from "react";

type Variant = "info" | "warn" | "tip";

const styles: Record<Variant, { border: string; bg: string; label: string }> = {
  info: {
    border: "border-[color:var(--accent)]",
    bg: "bg-[color:var(--accent-soft)]",
    label: "good to know",
  },
  warn: {
    border: "border-[color:var(--warn)]",
    bg: "bg-[color:var(--warn-soft)]",
    label: "watch out",
  },
  tip: {
    border: "border-[color:var(--accent)]",
    bg: "bg-[color:var(--accent-soft)]",
    label: "pro tip",
  },
};

export default function Callout({
  children,
  variant = "info",
  title,
}: {
  children: ReactNode;
  variant?: Variant;
  title?: string;
}) {
  const s = styles[variant];
  return (
    <aside className={`my-6 border-l-2 ${s.border} ${s.bg} px-5 py-4`}>
      <div className="kicker text-[0.65rem] mb-1 text-[color:var(--ink)]">
        {title || s.label}
      </div>
      <div className="text-[0.95rem] leading-7 text-[color:var(--ink-soft)] [&>p]:my-1.5">
        {children}
      </div>
    </aside>
  );
}
