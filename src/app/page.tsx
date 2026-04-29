import Link from "next/link";
import Reveal from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="relative bg-[color:var(--bg)] text-[color:var(--ink)]">
      <Nav />
      <Hero />
      <LogosStrip />
      <Problem />
      <PullQuote />
      <HowItWorks />
      <BeforeAfter />
      <StudyPlanShowcase />
      <Pricing />
      <Roadmap />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}

/* ------------------------------ NAV ------------------------------ */

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="display text-base">gks for u</span>
        </Link>
        <nav className="hidden items-center gap-9 text-sm text-[color:var(--muted)] md:flex">
          <a href="#problem" className="link-draw lowercase hover:text-[color:var(--ink)]">
            the problem
          </a>
          <a href="#how" className="link-draw lowercase hover:text-[color:var(--ink)]">
            how it works
          </a>
          <a href="#pricing" className="link-draw lowercase hover:text-[color:var(--ink)]">
            pricing
          </a>
          <a href="#faq" className="link-draw lowercase hover:text-[color:var(--ink)]">
            faq
          </a>
          <Link href="/blog" className="link-draw lowercase hover:text-[color:var(--ink)]">
            blog
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="hidden h-9 items-center justify-center px-3 text-sm lowercase text-[color:var(--muted)] hover:text-[color:var(--ink)] sm:inline-flex"
          >
            sign in
          </Link>
          <Link href="/eligibility" className="btn btn-primary !h-9 !px-4">
            start free
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------ HERO ----------------------------- */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-28 sm:pt-28">
        <div className="rise mx-auto max-w-4xl">
          <p className="kicker flex items-center gap-3 text-[color:var(--accent-text)]">
            <span className="inline-block h-px w-8 bg-[color:var(--accent)]" />
            for the gks 2026 undergraduate cycle
          </p>

          <h1 className="display mt-6 text-[3.2rem] sm:text-[5.6rem] lg:text-[7rem]">
            fifteen thousand apply.
            <br />
            <span className="text-[color:var(--accent-text)]">three hundred</span>{" "}
            <span className="text-[color:var(--accent-text)]">and sixty seven</span> get in.
            <br />
            most never make it past the paperwork.
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] sm:text-xl">
            gks for u is the first ai companion built end to end for the global korea
            scholarship. find out if you qualify in two minutes, write essays the rubric
            actually rewards, and submit your application with the quiet confidence of
            someone who knows the rules.
          </p>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/eligibility"
              className="group inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--accent)] pl-6 pr-2 text-sm font-medium lowercase text-[#0a0a0a] transition hover:bg-[color:var(--accent-deep)]"
            >
              check my eligibility
              <span className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a] text-[color:var(--accent)] transition group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </Link>
            <Link
              href="#how"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-strong)] px-6 text-sm font-medium lowercase text-[color:var(--ink)] transition hover:border-[color:var(--ink)] hover:bg-[color:var(--bg-soft)]"
            >
              see how it works
            </Link>
          </div>

          <p className="mt-5 text-sm lowercase text-[color:var(--muted)]">
            no credit card. six questions. instant verdict against all nine gks
            disqualifiers.
          </p>
        </div>

        <Reveal as="div" className="mt-24" delay={120}>
          <StatRow />
        </Reveal>
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[color:var(--bg)]" />
      <div className="grain absolute inset-0" />
      <div className="drift absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[color:var(--accent)] opacity-[0.18] blur-3xl" />
      <div
        className="drift absolute right-[-120px] top-40 h-[360px] w-[360px] rounded-full bg-[color:var(--accent)] opacity-[0.12] blur-3xl"
        style={{ animationDelay: "1.5s" }}
      />
    </div>
  );
}

function StatRow() {
  const stats = [
    { v: "69", l: "eligible countries" },
    { v: "367", l: "seats per year" },
    { v: "5 to 13%", l: "acceptance rate" },
    { v: "104,000+", l: "scholars funded" },
  ];
  return (
    <div className="grid grid-cols-2 divide-x divide-[color:var(--line)] border-y border-[color:var(--line)] sm:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.l} as="div" delay={i * 90}>
          <div className="px-4 py-8 text-center sm:px-6">
            <div className="display text-4xl text-[color:var(--ink)] sm:text-5xl">
              {s.v}
            </div>
            <div className="kicker mt-3 text-[color:var(--muted)]">{s.l}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------------- LOGOS / TRUST STRIP ---------------------- */

function LogosStrip() {
  const items = [
    "kaist",
    "seoul national",
    "yonsei",
    "korea university",
    "postech",
    "hanyang",
    "sungkyunkwan",
    "ewha womans",
    "unist",
    "kyung hee",
  ];
  const row = [...items, ...items];
  return (
    <section className="border-b border-[color:var(--line)] bg-[color:var(--bg-soft)] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="kicker text-center text-[color:var(--muted)]">
          built around the 68 gks partner universities
        </p>
        <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="marquee flex w-max gap-12 whitespace-nowrap text-base text-[color:var(--muted)] sm:text-xl">
            {row.map((name, i) => (
              <span key={i} className="display text-[color:var(--muted)]">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- PROBLEM ---------------------------- */

function Problem() {
  return (
    <section
      id="problem"
      className="relative border-b border-[color:var(--line)] py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>why most applicants drop out</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              the application is harder than the scholarship itself.
            </h2>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              gks rewards smart, motivated students from sixty nine developing countries.
              the process, however, punishes anyone who is not already an insider. we
              built gks for u to change that.
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden border border-[color:var(--line-strong)] bg-[color:var(--line-strong)] md:grid-cols-3">
          <Reveal>
            <ProblemCard
              n="01"
              title="a thirty three page pdf in english. nine ways to be silently disqualified."
              body="age cutoffs, citizenship rules, prior degrees, gpa scored across five different scales. a 79.5 percent gpa cannot be rounded up to 80 percent and that one decimal is the difference between a yes and a quiet no. most applicants never even learn which line they failed on."
            />
          </Reveal>
          <Reveal delay={120}>
            <ProblemCard
              n="02"
              title="one wrong click on track or university and the year is over."
              body="embassy track requires at least one type b regional university in your three choices. university track is one school, one department, one chance. apply to both tracks in the same year and you are auto disqualified. the rules are buried in a guideline almost nobody reads to the end."
            />
          </Reveal>
          <Reveal delay={240}>
            <ProblemCard
              n="03"
              title="ten plus documents, multi month chains, zero tooling."
              body="apostilles. notarizations. final degree certificates that take seven to eight months to arrive. a study plan that decides your fate, written without any feedback. today the only help is a two thousand dollar consultant or a facebook group of strangers."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex h-full flex-col bg-[color:var(--bg)] p-8 transition hover:bg-[color:var(--bg-soft)] sm:p-10">
      <div className="display text-2xl text-[color:var(--accent-text)]">{n}</div>
      <h3 className="display mt-6 text-2xl">{title}</h3>
      <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--muted)]">
        {body}
      </p>
    </div>
  );
}

/* --------------------------- PULL QUOTE -------------------------- */

function PullQuote() {
  return (
    <section className="relative border-b border-[color:var(--line)] bg-[color:var(--bg-soft)] py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="display text-3xl text-[color:var(--ink)] sm:text-5xl">
            <span className="text-[color:var(--accent-text)]">&ldquo;</span>
            this process is expensive both in cost and patience. there will be moments
            when you feel lost, frustrated, or doubt yourself.
            <span className="text-[color:var(--accent-text)]">&rdquo;</span>
          </p>
          <p className="kicker mt-8 text-[color:var(--muted)]">a past gks applicant</p>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------- HOW IT WORKS ------------------------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      kicker: "eligibility",
      title: "two minutes from doubt to a clear answer.",
      body: "six questions about your age, citizenship, degree and grades. we check every disqualifier in the official guideline and convert your gpa across the four point, four point three, four point five, five point and one hundred point scales niied accepts.",
      cta: { href: "/eligibility", label: "try the eligibility check" },
    },
    {
      n: "02",
      kicker: "strategy",
      title: "the right track. the right universities. the first time.",
      body: "a personalized recommendation across the sixty eight partner universities, weighted by country quota, field strength and the type a and type b mix you actually need. no more reading forum threads at two in the morning.",
      cta: { href: "/dashboard", label: "open my dashboard" },
    },
    {
      n: "03",
      kicker: "essays",
      title: "feedback the rubric was written for.",
      body: "claude reads your personal statement and study plan against the five criteria the review committee scores you on, motivation, academic preparation, post graduation plan, character, and clarity. line by line suggestions, unlimited revisions, your voice intact.",
      cta: { href: "/apply", label: "start my application" },
    },
  ];
  return (
    <section id="how" className="border-b border-[color:var(--line)] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-3xl">
            <SectionLabel>how it works</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              from{" "}
              <span className="italic text-[color:var(--accent-text)]">
                am i even allowed to apply
              </span>{" "}
              to <span className="italic text-[color:var(--accent-text)]">submitted</span>
              , in one calm place.
            </h2>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              we turned the thirty three page guideline into a guided experience. ai does
              the heavy lifting. you stay in control of every word.
            </p>
          </div>
        </Reveal>

        <div className="mt-20 space-y-px overflow-hidden border border-[color:var(--line-strong)] bg-[color:var(--line-strong)]">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <StepRow {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepRow({
  n,
  kicker,
  title,
  body,
  cta,
}: {
  n: string;
  kicker: string;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="grid gap-6 bg-[color:var(--bg)] p-8 transition hover:bg-[color:var(--bg-soft)] sm:p-12 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <div className="display text-6xl text-[color:var(--accent-text)]">{n}</div>
        <div className="kicker mt-4 text-[color:var(--muted)]">{kicker}</div>
      </div>
      <div className="lg:col-span-6">
        <h3 className="display text-2xl sm:text-3xl">{title}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--muted)]">
          {body}
        </p>
      </div>
      <div className="flex items-end lg:col-span-3 lg:justify-end">
        <Link
          href={cta.href}
          className="group inline-flex items-center gap-2 text-sm lowercase text-[color:var(--ink)]"
        >
          <span className="link-draw">{cta.label}</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--line-strong)] transition group-hover:translate-x-0.5 group-hover:border-[color:var(--accent)] group-hover:text-[color:var(--accent-text)]">
            <Arrow small />
          </span>
        </Link>
      </div>
    </div>
  );
}

/* --------------------------- BEFORE/AFTER ------------------------ */

function BeforeAfter() {
  const before = [
    "read a thirty three page english pdf cover to cover.",
    "convert your gpa by hand and hope you got it right.",
    "pay three hundred dollars for a single round of essay feedback.",
    "browse sixty eight universities and guess which ones fit.",
    "wait three months on essays and eight months on certificates.",
  ];
  const after = [
    "six questions, an instant eligibility verdict.",
    "automatic gpa conversion across all five scales.",
    "unlimited essay feedback against the real gks rubric.",
    "a personalized university shortlist for your profile.",
    "auto fill the official 2026 pdf and docx in one click.",
  ];
  return (
    <section className="border-b border-[color:var(--line)] bg-[color:var(--bg-soft)] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>why this needed ai</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              the same applicant. two very different years.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full border border-[color:var(--line-strong)] bg-[color:var(--bg-card)] p-8 sm:p-10">
              <div className="kicker text-[color:var(--muted)]">without gks for u</div>
              <ul className="mt-8 space-y-5">
                {before.map((b) => (
                  <li
                    key={b}
                    className="flex gap-4 text-[15px] leading-relaxed text-[color:var(--muted)]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--line-strong)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative h-full overflow-hidden bg-[color:var(--ink)] p-8 text-[color:var(--bg)] sm:p-10">
              <div
                aria-hidden
                className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[color:var(--accent)] opacity-30 blur-3xl"
              />
              <div className="kicker text-[color:var(--accent)]">with gks for u</div>
              <ul className="mt-8 space-y-5">
                {after.map((a) => (
                  <li key={a} className="flex gap-4 text-[15px] leading-relaxed">
                    <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[color:var(--accent)] text-[11px] text-[#0a0a0a]">
                      ✓
                    </span>
                    <span className="text-[color:var(--bg)]/85">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- STUDY PLAN SHOWCASE --------------------- */

function StudyPlanShowcase() {
  return (
    <section className="border-b border-[color:var(--line)] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          <Reveal as="div" className="lg:col-span-5">
            <SectionLabel>the study plan secret</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              the document korean professors read first, and almost nobody prepares for.
            </h2>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              most applicants pour weeks into the personal statement and overlook the
              study plan. we score yours line by line on the same five criteria the
              review committee uses, and rewrite weak sentences with you, not for you.
            </p>
            <ul className="mt-8 space-y-3 text-[15px] lowercase text-[color:var(--ink-soft)]">
              {[
                "motivation. why korea, why now, why this field.",
                "academic preparation. courses, research, real evidence.",
                "post graduation plan. realistic and country aligned.",
                "character. leadership, resilience, contribution.",
                "clarity. structure, english level, length discipline.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--accent)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="div" className="lg:col-span-7" delay={150}>
            <FeedbackMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeedbackMockup() {
  return (
    <figure className="relative">
      <div
        aria-hidden
        className="drift absolute -right-10 -top-10 hidden h-40 w-40 rounded-full bg-[color:var(--accent)] opacity-25 blur-2xl sm:block"
      />
      <div
        className="relative overflow-hidden border border-[color:var(--line-strong)] bg-[color:var(--bg-card)]"
        style={{ boxShadow: "var(--shadow)" }}
      >
        <div className="flex items-center justify-between border-b border-[color:var(--line)] bg-[color:var(--bg-soft)] px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--line-strong)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--line-strong)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
          </div>
          <p className="kicker text-[color:var(--muted)]">study plan, paragraph two</p>
          <span className="kicker text-[color:var(--accent-text)]">live</span>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div>
            <p className="kicker text-[color:var(--muted)]">original</p>
            <p className="mt-2 text-lg leading-relaxed lowercase text-[color:var(--muted)] line-through decoration-[color:var(--line-strong)]">
              i want to study in korea because korea is a great country.
            </p>
          </div>
          <div>
            <p className="kicker text-[color:var(--accent-text)]">ai suggestion</p>
            <p className="mt-2 text-xl leading-relaxed lowercase text-[color:var(--ink)]">
              i want to research solid state battery chemistry at kaist because korea
              leads global lithium ion innovation, and my undergraduate thesis on
              electrolyte stability connects directly to professor kim&rsquo;s lab.
            </p>
          </div>

          <div className="bg-[color:var(--bg-soft)] p-5">
            <div className="flex items-center justify-between">
              <p className="kicker text-[color:var(--muted)]">rubric score</p>
              <p className="display text-2xl text-[color:var(--accent-text)]">
                8.4 <span className="text-[color:var(--muted)]">/ 10</span>
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden bg-[color:var(--line)]">
              <div
                className="h-full bg-[color:var(--accent)]"
                style={{ width: "84%" }}
              />
            </div>
            <p className="mt-3 text-sm lowercase text-[color:var(--muted)]">
              strong motivation and academic preparation. tighten your post graduation
              plan next.
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ---------------------------- PRICING ---------------------------- */

function Pricing() {
  return (
    <section
      id="pricing"
      className="border-b border-[color:var(--line)] bg-[color:var(--bg-soft)] py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel center>pricing</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              less than one hour with a consultant. the whole way through.
            </h2>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              education consultants charge two thousand to fifteen thousand dollars. we
              charge less than a coffee a week. the eligibility check is, and will
              always be, free.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <Plan
              name="free"
              price="$0"
              tagline="find out if gks is for you."
              features={[
                "eligibility check across nine disqualifiers",
                "gpa conversion across five scales",
                "track recommendation, embassy or university",
              ]}
              cta={{ href: "/eligibility", label: "start free" }}
            />
          </Reveal>
          <Reveal delay={100}>
            <Plan
              name="pro"
              price="$9.99"
              priceSuffix="/ month"
              highlight
              tagline="the full application, end to end."
              features={[
                "unlimited essay and study plan feedback",
                "auto fill the official 2026 pdf and docx",
                "personalized university matching across sixty eight schools",
                "document and deadline tracker",
              ]}
              cta={{ href: "/dashboard", label: "go pro" }}
            />
          </Reveal>
          <Reveal delay={200}>
            <Plan
              name="premium"
              price="$19.99"
              priceSuffix="/ month"
              tagline="for applicants who want every edge."
              features={[
                "everything in pro",
                "co writing sessions for your study plan",
                "competitiveness benchmarking against accepted profiles",
                "priority feedback turnaround",
              ]}
              cta={{ href: "/dashboard", label: "go premium" }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Plan({
  name,
  price,
  priceSuffix,
  tagline,
  features,
  cta,
  highlight,
}: {
  name: string;
  price: string;
  priceSuffix?: string;
  tagline: string;
  features: string[];
  cta: { href: string; label: string };
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "relative flex h-full flex-col border bg-[color:var(--bg-card)] p-8 transition " +
        (highlight
          ? "border-[color:var(--accent)]"
          : "border-[color:var(--line-strong)]")
      }
      style={highlight ? { boxShadow: "var(--shadow)" } : undefined}
    >
      {highlight && (
        <span className="absolute -top-3 left-6 bg-[color:var(--accent)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#0a0a0a]">
          most popular
        </span>
      )}
      <div className="kicker text-[color:var(--muted)]">{name}</div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="display text-5xl">{price}</span>
        {priceSuffix && (
          <span className="text-sm lowercase text-[color:var(--muted)]">{priceSuffix}</span>
        )}
      </div>
      <p className="mt-2 text-sm lowercase text-[color:var(--muted)]">{tagline}</p>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center bg-[color:var(--accent-soft)] text-[11px] text-[color:var(--accent-text)]">
              ✓
            </span>
            <span className="lowercase text-[color:var(--ink-soft)]">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={
          "mt-8 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium lowercase transition " +
          (highlight
            ? "bg-[color:var(--accent)] text-[#0a0a0a] hover:bg-[color:var(--accent-deep)]"
            : "border border-[color:var(--line-strong)] text-[color:var(--ink)] hover:border-[color:var(--ink)] hover:bg-[color:var(--bg-soft)]")
        }
      >
        {cta.label}
      </Link>
    </div>
  );
}

/* ---------------------------- ROADMAP ---------------------------- */

function Roadmap() {
  const items = [
    { tag: "now", title: "gks, korea", body: "our first scholarship engine, live for the 2026 cycle." },
    { tag: "next", title: "mext, japan", body: "same playbook, applied to the japanese government scholarship." },
    { tag: "soon", title: "csc, china", body: "china scholarship council, four hundred thousand applicants and counting." },
    { tag: "later", title: "chevening and daad", body: "united kingdom and germany. same structural problem, same engine." },
  ];
  return (
    <section className="border-b border-[color:var(--line)] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>where we are going</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              one engine for every government scholarship on earth.
            </h2>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              every major scholarship has the same shape. complex pdf, hard rules, long
              document chains, no tooling. swap the rules and the prompts, and the rest
              of gks for u comes with us.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90}>
              <div className="h-full border border-[color:var(--line-strong)] bg-[color:var(--bg-soft)] p-6 transition hover:bg-[color:var(--bg-card)]">
                <div className="kicker text-[color:var(--accent-text)]">{it.tag}</div>
                <div className="display mt-4 text-xl">{it.title}</div>
                <p className="mt-2 text-sm leading-relaxed lowercase text-[color:var(--muted)]">
                  {it.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ------------------------------ */

function Faq() {
  const items = [
    {
      q: "is this the same as kgsp?",
      a: "yes. kgsp was renamed to gks, the global korea scholarship, in 2010. both names still circulate online. we support the current 2026 cycle and all six tracks.",
    },
    {
      q: "is gks for u official, or affiliated with niied?",
      a: "no. we are an independent helper tool built by people who care about widening access to korean higher education. always confirm requirements at study.gks.go.kr before you submit.",
    },
    {
      q: "can i really get unlimited ai feedback?",
      a: "yes. pro and premium plans include unlimited essay and study plan feedback against the actual gks rubric. no hidden quotas, no nickel and diming.",
    },
    {
      q: "what if i am not eligible?",
      a: "you will know in two minutes, for free, before you spend a single day on essays or document chains. we will also tell you which line of the guideline you failed on, and whether it is fixable next year.",
    },
    {
      q: "which countries are eligible?",
      a: "gks undergraduate is open to citizens of sixty nine designated developing countries. run the eligibility check and we will tell you on the very first question.",
    },
  ];
  return (
    <section
      id="faq"
      className="border-b border-[color:var(--line)] bg-[color:var(--bg-soft)] py-28"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="text-center">
            <SectionLabel center>questions, answered</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              everything first time applicants ask.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
          {items.map((it, i) => (
            <Reveal key={it.q} delay={i * 60}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                  <span className="display text-xl">{it.q}</span>
                  <span className="mt-1 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[color:var(--line-strong)] text-[color:var(--muted)] transition group-open:rotate-45 group-open:border-[color:var(--accent)] group-open:text-[color:var(--accent-text)]">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl pr-10 text-[15px] leading-relaxed lowercase text-[color:var(--muted)]">
                  {it.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- FINAL CTA --------------------------- */

function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28">
      <div
        aria-hidden
        className="drift absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[color:var(--accent)] opacity-20 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="display text-5xl sm:text-8xl">
            your korea is{" "}
            <span className="caret italic text-[color:var(--accent-text)]">waiting</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg lowercase text-[color:var(--muted)]">
            two minutes from now, you will know if gks 2026 is for you. no account, no
            email, no payment.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/eligibility"
              className="group inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--accent)] pl-6 pr-2 text-sm font-medium lowercase text-[#0a0a0a] transition hover:bg-[color:var(--accent-deep)]"
            >
              check my eligibility
              <span className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a] text-[color:var(--accent)] transition group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </Link>
            <Link
              href="/apply"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-strong)] px-6 text-sm font-medium lowercase text-[color:var(--ink)] transition hover:border-[color:var(--ink)] hover:bg-[color:var(--bg-soft)]"
            >
              start my application
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- FOOTER ---------------------------- */

function Footer() {
  return (
    <footer className="border-t border-[color:var(--line)] py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm lowercase text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Mark />
          <span className="display text-base text-[color:var(--ink)]">gks for u</span>
          <span>. built with care for global students.</span>
        </div>
        <p className="max-w-md text-xs leading-relaxed">
          an independent helper tool. not affiliated with niied, the korean government,
          or any embassy or university. always confirm requirements at study.gks.go.kr.
        </p>
      </div>
    </footer>
  );
}

/* --------------------------- PRIMITIVES -------------------------- */

function SectionLabel({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p
      className={
        "kicker flex items-center gap-3 text-[color:var(--accent-text)] " +
        (center ? "justify-center" : "")
      }
    >
      <span className="inline-block h-px w-8 bg-[color:var(--accent)]" />
      {children}
    </p>
  );
}

function Mark() {
  return (
    <span className="relative inline-flex h-7 w-7 items-center justify-center overflow-hidden bg-[color:var(--accent)]">
      <span className="display text-sm leading-none text-[#0a0a0a]">g</span>
    </span>
  );
}

function Arrow({ small }: { small?: boolean }) {
  const size = small ? 12 : 14;
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
