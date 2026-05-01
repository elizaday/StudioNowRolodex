type ToolCard = {
  title: string;
  description: string;
  href: string;
  label: string;
  status: "Live" | "Pilot";
  theme: string;
  icon: "search" | "film" | "shield" | "workflow" | "feedback";
};

const tools: ToolCard[] = [
  {
    title: "Rolodex",
    description: "Talent, partners, AI studios, and references.",
    href: "https://studionowrolodex.vercel.app/",
    label: "Open",
    status: "Live",
    theme: "bg-[#0b66d8]",
    icon: "search",
  },
  {
    title: "Script Creator",
    description: "Turn a brief into a first draft and refine it.",
    href: "https://studionow.netlify.app/",
    label: "Open",
    status: "Live",
    theme: "bg-[#1f7a46]",
    icon: "film",
  },
  {
    title: "AI Guidelines",
    description: "Likeness, voice, disclosure, and asset handling.",
    href: "#guidelines",
    label: "View",
    status: "Pilot",
    theme: "bg-[#6f52d9]",
    icon: "shield",
  },
  {
    title: "System Map",
    description: "How intake, search, drafting, and delivery connect.",
    href: "#workflow",
    label: "View",
    status: "Live",
    theme: "bg-[#d97706]",
    icon: "workflow",
  },
  {
    title: "Feedback Loop",
    description: "What to save after delivery so the tools improve.",
    href: "#feedback",
    label: "View",
    status: "Pilot",
    theme: "bg-[#c2417b]",
    icon: "feedback",
  },
];

const workflowSteps = [
  "Brief in",
  "Diagnose ask",
  "Search or draft",
  "Pressure-test",
  "Present",
  "Capture changes",
];

const aiRules = [
  "Use plain English.",
  "Separate hard rules from judgment calls.",
  "Escalate fuzzy cases early.",
];

const feedbackItems = [
  "Final script",
  "What changed",
  "Producer notes",
  "Client feedback",
];

function StudioWordmark() {
  return (
    <span className="inline-flex items-center text-[26px] font-semibold leading-none text-white">
      <span>StudioN</span>
      <span className="text-[#0b66d8]">o</span>
      <span>w</span>
      <span className="ml-0.5 text-[#0b66d8]">.</span>
    </span>
  );
}

function ToolIcon({ icon }: Pick<ToolCard, "icon">) {
  const common = "h-4.5 w-4.5";

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
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}

function Panel({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-lg border border-zinc-200 bg-[#fafaf9] p-4">
      <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
      <div className="mt-3 text-sm text-zinc-600">{children}</div>
    </section>
  );
}

export default function StudioNowTools() {
  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#181818]">
      <header className="border-b border-white/10 bg-[#1b1b1b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <StudioWordmark />
            <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden />
            <span className="hidden truncate text-sm font-medium text-white/55 sm:block">
              Producer Tools
            </span>
          </div>
          <span className="hidden text-sm font-medium text-white/45 md:block">
            Internal use only
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-5 lg:px-8 lg:py-6">
        <div className="rounded-lg border border-zinc-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="border-b border-zinc-200 px-5 py-4 lg:px-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-zinc-950">
                  StudioNow Tools
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Quick access for producers. Open the tool you need, check the operating notes, move on.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="rounded-md bg-zinc-100 px-2.5 py-1">10 producers</span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1">No login layer</span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1">Internal hub</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 px-5 py-5 lg:grid-cols-[1.5fr_0.95fr] lg:px-6 lg:py-6">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Launch
                </h2>
                <span className="text-xs text-zinc-400">Fast paths only</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {tools.map((tool) => (
                  <a
                    key={tool.title}
                    href={tool.href}
                    className="group flex min-h-[132px] flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${tool.theme}`}>
                          <ToolIcon icon={tool.icon} />
                        </div>
                        <StatusPill status={tool.status} />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-zinc-950">
                        {tool.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600">
                        {tool.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0b66d8]">
                      <span>{tool.label}</span>
                      <span aria-hidden className="transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <aside className="space-y-3">
              <Panel id="workflow" title="Workflow">
                <div className="grid grid-cols-2 gap-2">
                  {workflowSteps.map((step, index) => (
                    <div key={step} className="rounded-md border border-zinc-200 bg-white px-3 py-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        {index + 1}
                      </div>
                      <div className="mt-1 text-sm text-zinc-700">{step}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel id="guidelines" title="AI Guidelines">
                <ul className="space-y-2">
                  {aiRules.map((rule) => (
                    <li key={rule} className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
                      {rule}
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel id="feedback" title="Capture After Delivery">
                <div className="grid grid-cols-2 gap-2">
                  {feedbackItems.map((item) => (
                    <div key={item} className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
                      {item}
                    </div>
                  ))}
                </div>
              </Panel>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
