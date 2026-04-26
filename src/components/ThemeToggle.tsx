"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("gks-theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title={theme === "dark" ? "switch to light" : "switch to dark"}
      className="inline-flex h-9 w-9 items-center justify-center border border-[color:var(--line-strong)] text-[color:var(--muted)] transition hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
    >
      {mounted ? (theme === "dark" ? <Sun /> : <Moon />) : <span className="h-4 w-4" />}
    </button>
  );
}

function Sun() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M7 0.8v1.6" />
        <path d="M7 11.6v1.6" />
        <path d="M0.8 7h1.6" />
        <path d="M11.6 7h1.6" />
        <path d="M2.4 2.4l1.2 1.2" />
        <path d="M10.4 10.4l1.2 1.2" />
        <path d="M11.6 2.4l-1.2 1.2" />
        <path d="M3.6 10.4l-1.2 1.2" />
      </g>
    </svg>
  );
}

function Moon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M11.6 8.4A4.6 4.6 0 0 1 5.6 2.4a.5.5 0 0 0-.7-.6 5.6 5.6 0 1 0 7.3 7.3.5.5 0 0 0-.6-.7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
