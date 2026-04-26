import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-[color:var(--bg)] text-[color:var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Mark />
            <span className="display text-base">gks for u</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm lowercase text-[color:var(--muted)] md:flex">
            <Link href="/eligibility" className="link-draw hover:text-[color:var(--ink)]">
              eligibility
            </Link>
            <Link href="/dashboard" className="link-draw hover:text-[color:var(--ink)]">
              dashboard
            </Link>
            <Link href="/apply" className="link-draw hover:text-[color:var(--ink)]">
              application
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/eligibility" className="btn btn-primary !h-9 !px-4">
              start free
            </Link>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-[color:var(--line)] py-8">
        <div className="mx-auto max-w-6xl px-6 text-xs lowercase text-[color:var(--muted)]">
          an independent helper tool. always confirm requirements at study.gks.go.kr.
        </div>
      </footer>
    </div>
  );
}

function Mark() {
  return (
    <span className="relative inline-flex h-7 w-7 items-center justify-center overflow-hidden bg-[color:var(--accent)]">
      <span className="display text-sm leading-none text-[#0a0a0a]">g</span>
    </span>
  );
}
