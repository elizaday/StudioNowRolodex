"use client";

import { useMemo, useState } from "react";

type ToolStatus = "Live" | "Production" | "In build";

type Tool = {
  id: "rolodex" | "producer" | "trainer";
  name: string;
  label: string;
  status: ToolStatus;
  href?: string;
};

const tools: Tool[] = [
  {
    id: "rolodex",
    name: "Rolodex",
    label: "Approved talent",
    status: "Live",
    href: "https://studionowrolodex.vercel.app/",
  },
  {
    id: "producer",
    name: "StudioNow Producer",
    label: "Write scripts",
    status: "Production",
    href: "https://studionow-producer-production.up.railway.app/",
  },
  {
    id: "trainer",
    name: "Trainer",
    label: "Gold examples",
    status: "In build",
  },
];

const trainerSteps = [
  "Paste brief",
  "Paste final script",
  "Add tags",
  "Confirm gold checks",
  "Open PR",
  "Merge after CI",
];

function StudioWordmark() {
  return (
    <span className="inline-flex items-center text-[24px] font-semibold leading-none text-white">
      <span>StudioN</span>
      <span className="text-[#0b66d8]">o</span>
      <span>w</span>
      <span className="ml-0.5 text-[#0b66d8]">.</span>
    </span>
  );
}

function StatusDot({ status }: { status: ToolStatus }) {
  const color =
    status === "Production"
      ? "bg-emerald-500"
      : status === "Live"
        ? "bg-[#0b66d8]"
        : "bg-[#b88200]";

  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500">
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden />
      {status}
    </span>
  );
}

function TrainerPlaceholder() {
  return (
    <div className="flex h-full min-h-[520px] flex-col bg-[#f6f6f4]">
      <div className="border-b border-white/10 bg-[#1b1b1b]">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-4 px-8">
          <StudioWordmark />
          <span className="h-7 w-px bg-white/20" aria-hidden />
          <span className="text-sm font-semibold text-white/55">Trainer</span>
          <span className="ml-auto hidden text-sm font-semibold text-white/45 sm:block">
            Gold corpus
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1260px] flex-1 px-8 py-9">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-[0_14px_44px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#b88200]">In build</p>
              <h2 className="mt-3 text-4xl font-semibold text-zinc-950">
                Trainer
              </h2>
            </div>
            <StatusDot status="In build" />
          </div>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            Curators will turn approved brief and final-script pairs into gold
            examples for the Producer.
          </p>
          <div className="mt-8 grid gap-2 sm:grid-cols-3">
            {trainerSteps.map((step) => (
              <div
                key={step}
                className="flex min-h-16 items-center rounded-lg border border-zinc-200 bg-[#fbfbfa] px-4 text-sm font-medium text-zinc-800"
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioNowDashboard() {
  const [activeId, setActiveId] = useState<Tool["id"]>("rolodex");
  const activeTool = useMemo(
    () => tools.find((tool) => tool.id === activeId) ?? tools[0],
    [activeId],
  );

  return (
    <main className="h-screen overflow-hidden bg-[#f5f5f3] text-[#181818]">
      <header className="h-16 border-b border-white/10 bg-[#1b1b1b]">
        <div className="mx-auto flex h-full max-w-[1680px] items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <StudioWordmark />
            <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden />
            <span className="truncate text-sm font-medium text-white/60">
              StudioNow Dashboard
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-[1680px] flex-col gap-3 px-5 py-4 lg:px-8">
        <section className="grid shrink-0 gap-2 sm:grid-cols-3" aria-label="Tools">
          {tools.map((tool) => {
            const isActive = tool.id === activeId;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveId(tool.id)}
                className={`flex h-[76px] items-center justify-between rounded-lg border px-5 text-left transition ${
                  isActive
                    ? "border-zinc-950 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                    : "border-zinc-200 bg-white/65 hover:border-zinc-300 hover:bg-white"
                }`}
              >
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-zinc-950">
                    {tool.name}
                  </h2>
                  <p className="mt-1 truncate text-sm font-medium text-zinc-500">
                    {tool.label}
                  </p>
                </div>
                <StatusDot status={tool.status} />
              </button>
            );
          })}
        </section>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
          <div className="flex h-12 items-center justify-between border-b border-zinc-200 bg-[#fbfbfa] px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <p className="truncate text-sm font-semibold text-zinc-800">
                {activeTool.name}
              </p>
            </div>
            {activeTool.href ? (
              <a
                href={activeTool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                Open in new tab
              </a>
            ) : null}
          </div>

          {activeTool.href ? (
            <iframe
              key={activeTool.id}
              title={activeTool.name}
              src={activeTool.href}
              className="min-h-0 flex-1 border-0 bg-white"
              allow="clipboard-read; clipboard-write; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <TrainerPlaceholder />
          )}
        </section>
      </div>
    </main>
  );
}
