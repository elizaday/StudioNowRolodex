"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function StudioWordmark({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center text-[22px] font-semibold leading-none text-white ${className}`}
      aria-label="StudioNow"
    >
      <span>StudioN</span>
      <span className="text-[#0b66d8]">o</span>
      <span>w</span>
      <span className="ml-0.5 text-[#0b66d8]">.</span>
    </Link>
  );
}

export function StudioShell({
  sectionLabel,
  rightLabel,
  children,
}: {
  sectionLabel: string;
  rightLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f3f1]">
      <header className="border-b border-white/10 bg-[#1b1b1b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <StudioWordmark />
            <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden />
            <span className="truncate text-sm font-medium text-white/55">
              {sectionLabel}
            </span>
          </div>
          {rightLabel ? (
            <span className="hidden text-sm font-medium text-white/45 md:block">
              {rightLabel}
            </span>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
