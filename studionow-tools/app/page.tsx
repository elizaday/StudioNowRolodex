type ToolCard = {
  title: string;
  description: string;
  href: string;
  label: string;
  status: "Live" | "Pilot" | "Coming soon";
  theme: string;
  icon: "search" | "film" | "shield" | "workflow" | "feedback";
};

const tools: ToolCard[] = [
  {
    title: "Rolodex",
    description:
      "Search talent, AI studios, references, production partners, and creative resources in one place.",
    href: "https://studionowrolodex-bwikjx1b4-elizadaynight-8270s-projects.vercel.app",
    label: "Open Rolodex",
    status: "Live",
    theme: "from-[#0b66d8] to-[#48a2ff]",
    icon: "search",
  },
  {
    title: "Script Creator",
    description:
      "Turn a brief into a stronger first draft, then pressure-test the story, structure, and voice.",
    href: "https://studionow.netlify.app/",
    label: "Open Script Creator",
    status: "Live",
    theme: "from-[#1f7a46] to-[#60be7b]",
    icon: "film",
  },
  {
    title: "AI Guidelines",
    description:
      "Plain-English guidance for likeness, voice, synthetic media, client-supplied assets, and disclosure.",
    href: "#guidelines",
    label: "View guidance",
    status: "Pilot",
    theme: "from-[#8a5cf6] to-[#b28cff]",
    icon: "shield",
  },
  {
    title: "System Map",
    description:
      "A simple shared view of how intake, search, drafting, refinement, delivery, and learning connect.",
    href: "#system",
    label: "View system",
    status: "Live",
    theme: "from-[#ff8f3d] to-[#ffbd80]",
    icon: "workflow",
  },
  {
    title: "Feedback Loop",
    description:
      "Capture final scripts, producer notes, client feedback, and examples worth training into the next round.",
    href: "#feedback",
    label: "Add feedback",
    status: "Pilot",
    theme: "from-[#d94c7f] to-[#f48cb0]",
    icon: "feedback",
  },
];

const systemSteps = [
  "Brief comes in",
  "Diagnose the ask",
  "Search or draft",
  "Pressure-test",
  "Present the work",
  "Capture what changed",
];

function StudioWordmark() {
  return (
    <span className="inline-flex items-center text-[28px] font-semibold leading-none text-white">
      <span>StudioN</span>
      <span className="text-[#0b66d8]">o</span>
      <span>w</span>
      <span className="ml-0.5 text-[#0b66d8]">.</span>
    </span>
  );
}

function ToolIcon({ icon }: Pick<ToolCard, "icon">) {
  const common = "h-5 w-5";

  if (icon === "search") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 5 5" />
      </svg>
    );
  }

  if (icon === "film") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M8 6V4M16 6V4M8 20v-2M16 20v-2M3 10h18M3 14h18" />
      </svg>
    );
  }

  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <path d="M12 3 5 6v5c0 5.2 3.2 8.8 7 10 3.8-1.2 7-4.8 7-10V6l-7-3Z" />
        <path d="m9.5 12 1.7 1.7 3.6-3.9" />
      </svg>
    );
  }

  if (icon === "workflow") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <rect x="3" y="4" width="7" height="5" rx="1.5" />
        <rect x="14" y="4" width="7" height="5" rx="1.5" />
        <rect x="8.5" y="15" width="7" height="5" rx="1.5" />
        <path d="M6.5 9.5v2.5a2 2 0 0 0 2 2H12M17.5 9.5v2.5a2 2 0 0 1-2 2H12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
      <path d="M7 16h10" />
      <path d="M7 12h6" />
      <path d="M7 8h10" />
      <path d="M5 4h14a2 2 0 0 1 2 2v12l-4-2.5H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function StatusPill({ status }: { status: ToolCard["status"] }) {
  const styles: Record<ToolCard["status"], string> = {
    Live: "bg-[#eaf4ff] text-[#0b66d8] ring-[#cfe2ff]",
    Pilot: "bg-[#fff4e6] text-[#b75b0b] ring-[#ffd7ae]",
    "Coming soon": "bg-zinc-100 text-zinc-600 ring-zinc-200",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function StudioNowTools() {
  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#181818]">
      <header className="border-b border-white/10 bg-[#1b1b1b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <StudioWordmark />
            <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden />
            <span className="hidden truncate text-sm font-medium text-white/55 sm:block">
              Creative Tools
            </span>
          </div>
          <span className="hidden text-sm font-medium text-white/45 md:block">
            Internal workspace
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <div
          className="overflow-hidden rounded-lg border border-zinc-200 bg-[#101010] shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(16,16,16,0.88), rgba(16,16,16,0.52)), url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="max-w-4xl px-6 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
              StudioNow Operations Layer
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              One clean front door for the tools that move production work forward.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              Open the Rolodex, launch Script Creator, review the AI guardrails,
              and keep the feedback loop alive without sending people hunting
              through scattered bookmarks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://studionowrolodex-bwikjx1b4-elizadaynight-8270s-projects.vercel.app"
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-white/90"
              >
                Open Rolodex
              </a>
              <a
                href="https://studionow.netlify.app/"
                className="rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Open Script Creator
              </a>
            </div>
          </div>
        </div>

        <section className="mt-6 border-t border-zinc-200 pt-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0b66d8]">
                Workspace
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-zinc-950">
                Tools your team can actually use
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-500">
              The live tools stay up top. The operating notes sit right below them
              so the workflow and the software stay connected.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <a
                key={tool.title}
                href={tool.href}
                className="group flex min-h-[250px] flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${tool.theme} text-white`}>
                      <ToolIcon icon={tool.icon} />
                    </div>
                    <StatusPill status={tool.status} />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-zinc-950">
                    {tool.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#0b66d8]">
                  <span>{tool.label}</span>
                  <span aria-hidden className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          id="system"
          className="mt-8 rounded-lg border border-zinc-200 bg-white px-6 py-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0b66d8]">
            System Map
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-zinc-950">
                A simple path from intake to learning
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                This keeps the team aligned on where the Rolodex helps, where the
                Script Creator helps, and what should get captured after the work
                is done.
              </p>
            </div>
            <p className="max-w-md text-sm leading-7 text-zinc-500">
              The goal is not more process. It is fewer dead ends, cleaner
              handoffs, and a stronger starting point every time.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {systemSteps.map((step, index) => (
              <div key={step} className="rounded-lg border border-zinc-200 bg-[#fafaf9] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Step {index + 1}
                </div>
                <div className="mt-3 text-lg font-medium text-zinc-950">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="guidelines"
          className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.95fr]"
        >
          <div className="rounded-lg border border-zinc-200 bg-white px-6 py-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0b66d8]">
              AI Guidelines
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-zinc-950">
              Keep the guardrails easy to find
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Put the policy where people already work: likeness, voice,
              synthetic media, disclosure expectations, and how to handle
              client-supplied assets should all live one click away from the tools.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-zinc-600">
              <li>Use plain English, not legalese.</li>
              <li>Separate hard rules from judgment calls.</li>
              <li>Show who to ask when a case is fuzzy.</li>
            </ul>
          </div>

          <div
            className="overflow-hidden rounded-lg border border-zinc-200 bg-cover bg-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(11,102,216,0.2), rgba(17,17,17,0.3)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80')",
            }}
          >
            <div className="flex min-h-[300px] flex-col justify-end bg-gradient-to-t from-black/60 via-black/15 to-transparent p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Shared understanding
              </p>
              <p className="mt-3 max-w-sm text-lg font-medium leading-8 text-white">
                Good systems are easier to trust when the rules sit beside the work.
              </p>
            </div>
          </div>
        </section>

        <section
          id="feedback"
          className="mt-8 rounded-lg border border-zinc-200 bg-[#111111] px-6 py-8 text-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Feedback Loop
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold">
                Keep the system useful after handoff
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                After a project, save the final script, what changed from the
                first draft, producer notes, client feedback, and any examples
                worth keeping. That is how the system gets smarter without getting bloated.
              </p>
            </div>
            <a
              href="mailto:"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-white/90"
            >
              Decide the feedback path
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
