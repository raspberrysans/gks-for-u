import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <div className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-wider text-blue-600">gks-for-u</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Apply for the Global Korea Scholarship with confidence.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Free, guided help for international students applying to GKS Undergraduate. Check
          your eligibility in 2 minutes, fill the official 2026 forms with a step-by-step
          wizard, and see how strong your candidacy is before you submit.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/eligibility"
            className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start eligibility check
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Sign in
          </Link>
        </div>

        <section className="grid gap-6 pt-12 sm:grid-cols-3">
          <Feature title="Eligibility check" body="See if you qualify across 6 GKS tracks (Embassy, UIC, R-GKS, Associate, Overseas Korean, IRTS)." />
          <Feature title="Guided form-fill" body="Fill the official 2026 forms section by section. Auto-saved. Export to PDF or DOCX." />
          <Feature title="Candidate score" body="Transparent rubric score plus a competitiveness estimate vs typical accepted applicants." />
        </section>

        <p className="pt-12 text-xs text-zinc-500">
          Unofficial helper tool. Not affiliated with NIIED, the Korean Government, or any
          embassy/university. Always confirm requirements at study.gks.go.kr.
        </p>
      </div>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
    </div>
  );
}
