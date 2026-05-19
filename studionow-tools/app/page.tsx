type ToolCard = {
  title: string;
  description: string;
  href: string;
  label: string;
  status: "Live" | "Pilot" | "Curator";
  theme: string;
  icon: "search" | "film" | "shield" | "workflow" | "feedback" | "agent" | "star";
};

const tools: ToolCard[] = [
  {
    title: "StudioNow Rolodex",
    description: "Talent, partners, AI studios, and references.",
    href: "https://studionowrolodex.vercel.app/",
    label: "Open",
    status: "Live",
    theme: "bg-[#0b66d8]",
    icon: "search",
  },
  {
    title: "Agentic StudioNow Script Creator",
    description:
      "Nine-stage agent workflow: diagnose, mine, visual intake, blueprint, draft, runtime gate, critic, format. Pilot phase.",
    href: "https://studionow-agentic-script-creator.vercel.app/",
    label: "Open",
    status: "Pilot",
    theme: "bg-[#6f52d9]",
    icon: "agent",
  },
  {
    title: "Trainer (Promote to Gold)",
    description:
      "Curator only. Submit brief + final-script pairs as gold examples the Agentic Script Creator learns from.",
    href: "https://studionow-trainer.vercel.app/",
    label: "Open",
    status: "Curator",
    theme: "bg-[#b88200]",
    icon: "star",
  },
  {
    title: "Legacy Script Creator",
    description:
      "Original production-grade script generator. One-shot Claude pass over the brief and attachments. Still maintained.",
    href: "https://studionow.netlify.app/",
    label: "Open",
    status: "Live",
    theme: "bg-[#1f7a46]",
    icon: "film",
  },
];

type DocLink = {
  title: string;
  description: string;
  href: string;
};

const backendDocs: DocLink[] = [
  {
    title: "Workflow Guide",
    description:
      "Plain-English walkthrough of all nine agents (Diagnoser, Miner, Visual Intake, Strategist, Producer, Writer, Runtime Editor, Critic, Formatter), what each one decides, the files behind it, and how to triage failures.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/WORKFLOW-GUIDE.md",
  },
  {
    title: "Operating Guide",
    description:
      "Day-to-day playbook: monitoring queries, gold-promotion process, prompt-update discipline, escalation path. Mike's main reference.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/OPERATING-GUIDE.md",
  },
  {
    title: "Handoff Document",
    description:
      "What's been transferred, what works today, the gaps, costs, roles to fill, and open decisions. Start here for context.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/HANDOFF.md",
  },
  {
    title: "Architecture",
    description:
      "Why the workflow is staged, what each boundary is, why the deterministic runtime gate exists.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/ARCHITECTURE.md",
  },
  {
    title: "Agent Contracts",
    description:
      "One-line summary of each agent's responsibility and the JSON shape it must return. Reference when changing prompts.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/AGENT-CONTRACTS.md",
  },
  {
    title: "Deployment",
    description:
      "Infrastructure setup: Vercel for UI/API, Supabase for state, Railway for the worker. Env vars and what each one does.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/DEPLOYMENT.md",
  },
  {
    title: "Pilot Readiness",
    description:
      "What's verified, what gaps remain before wider rollout, and the rules of the pilot.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/PILOT-READINESS.md",
  },
  {
    title: "Source Code (GitHub)",
    description:
      "The full agentic repo. Code: packages/studionow-agents/src/agents/ (one file per agent). House-style references: references/.",
    href: "https://github.com/elizaday/studionow-agentic-script-creator",
  },
];

const workflowSteps = [
  "Brief in",
  "Diagnose ask",
  "Mine ammunition",
  "Strategy + blueprint",
  "Draft + runtime check",
  "Critic + final",
];

const aiRules = [
  "Use plain English.",
  "Separate hard rules from judgment calls.",
  "Escalate fuzzy cases early.",
];

const transitionPlan = [
  "Create StudioNow GitHub, Vercel, and Supabase org accounts.",
  "Add at least two StudioNow owners using company email addresses.",
  "Transfer the GitHub repository.",
  "Transfer the Vercel project.",
  "Transfer the Supabase project.",
  "Rotate API keys and update environment variables.",
  "Transfer domain and DNS ownership if needed.",
  "Document everything, confirm access, then remove consultant access last.",
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

  if (icon === "agent") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden>
        <circle cx="6" cy="6" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
        <circle cx="12" cy="12" r="2.2" />
        <circle cx="6" cy="18" r="2.2" />
        <circle cx="18" cy="18" r="2.2" />
        <path d="M7.5 7.5 10.5 10.5M16.5 7.5 13.5 10.5M10.5 13.5 7.5 16.5M13.5 13.5 16.5 16.5" />
      </svg>
    );
  }

  if (icon === "star") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden strokeLinejoin="round">
        <path d="M12 3.5 14.5 9l6 .6-4.5 4 1.3 6L12 16.8 6.7 19.6 8 13.6 3.5 9.6l6-.6L12 3.5Z" />
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
    Curator: "bg-[#fff8e1] text-[#7d5600] ring-[#e6c97f]",
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
                  Quick access for producers and curators. Open the tool you need or read the backend docs to understand how the agentic system works.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="rounded-md bg-zinc-100 px-2.5 py-1">Pilot</span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1">Shared URL access</span>
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
                <span className="text-xs text-zinc-400">Open in new tab</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {tools.map((tool) => (
                  <a
                    key={tool.title}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[148px] flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
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

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Backend Documentation
                  </h2>
                  <span className="text-xs text-zinc-400">For Matt, Mike, and engineering</span>
                </div>
                <p className="mb-3 text-sm leading-6 text-zinc-600">
                  How the Agentic Script Creator actually works. Start with the Workflow Guide for the stage-by-stage explanation of the nine agents.
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {backendDocs.map((doc) => (
                    <a
                      key={doc.title}
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border border-zinc-200 bg-white p-3 transition hover:border-[#0b66d8] hover:shadow-[0_4px_12px_rgba(11,102,216,0.06)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-zinc-950">{doc.title}</h3>
                        <span className="text-xs text-[#0b66d8] opacity-0 transition group-hover:opacity-100">
                          Read →
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-zinc-600">{doc.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-3">
              <Panel id="workflow" title="Agentic workflow at a glance">
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
                <p className="mt-3 text-xs text-zinc-500">
                  Full breakdown in the{" "}
                  <a
                    href="https://github.com/elizaday/studionow-agentic-script-creator/blob/main/docs/WORKFLOW-GUIDE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#0b66d8] hover:underline"
                  >
                    Workflow Guide
                  </a>
                  .
                </p>
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

              <Panel id="transition-plan" title="Transition Plan">
                <ol className="space-y-2">
                  {transitionPlan.map((item, index) => (
                    <li
                      key={item}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-700"
                    >
                      <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </Panel>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
