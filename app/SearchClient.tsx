"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { filterTalent, parseTalentSearch, resolvedLocation } from "@/lib/search";
import type { ParsedFilters, TalentRecord } from "@/lib/types";

function formatSecondaryRoles(value: TalentRecord["secondary_roles"]): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value ?? "";
}

function workedWithUsYes(value: TalentRecord["worked_with_us"]): boolean {
  if (value === true) return true;
  const s = String(value ?? "").trim().toLowerCase();
  return s === "yes" || s === "true";
}

/** Initials for the monogram. "Elizabeth Strickler" → "ES". Falls back to "?" */
function initials(name: string | null): string {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Stable hash → palette index, so the same person always gets the same color. */
function avatarColor(seed: string): string {
  const palettes = [
    "bg-teal-100 text-teal-800",
    "bg-sky-100 text-sky-800",
    "bg-indigo-100 text-indigo-800",
    "bg-amber-100 text-amber-800",
    "bg-rose-100 text-rose-800",
    "bg-emerald-100 text-emerald-800",
    "bg-violet-100 text-violet-800",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return palettes[Math.abs(h) % palettes.length];
}

const REVIEW_CHIP: Record<string, string> = {
  Exceptional: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  Great: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200",
  Good: "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200",
  "To Try": "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  "Not a Fit": "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200",
};

/** Split specialty_tags (comma/slash/pipe-separated) into a clean array. */
function splitTags(value: string | null | undefined): string[] {
  if (!value) return [];
  return String(value)
    .split(/[,;/|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * If the summary starts with the role or the location, trim that redundant
 * prefix so the summary line actually adds new information.
 */
function trimmedSummary(
  summary: string | null,
  roleLine: string,
): string | null {
  if (!summary) return null;
  const s = summary.trim();
  // Strip leading "Role | City, State" or "Role |" prefixes that mirror the subtitle.
  const withoutPrefix = s.replace(
    /^(director of photography|[a-z][^|]{2,40})\s*\|\s*[a-z][^|]{2,40}(\s*\|\s*)?/i,
    "",
  );
  const cleaned = withoutPrefix.trim();
  if (!cleaned) return null;
  // If after trimming it equals the subtitle, drop it entirely.
  if (cleaned.toLowerCase() === roleLine.toLowerCase()) return null;
  return cleaned;
}

function parsedFilterItems(filters: ParsedFilters) {
  return [
    ...filters.roles.map((value) => ({ label: "Role", value })),
    ...filters.locations.map((value) => ({ label: "Location", value })),
    ...filters.budgetTiers.map((value) => ({ label: "Budget", value })),
    ...(filters.minReviewScore == null
      ? []
      : [{ label: "Review", value: `${filters.minReviewScore}+` }]),
    ...(filters.workedWithUs == null
      ? []
      : [{ label: "Worked with us", value: filters.workedWithUs }]),
    ...filters.keywords.map((value) => ({ label: "Keyword", value })),
  ];
}

export default function SearchClient() {
  const [talent, setTalent] = useState<TalentRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTalent() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/talent", {
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          talent?: TalentRecord[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load talent.");
        }

        setTalent(payload.talent ?? []);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }
        setError(
          loadError instanceof Error ? loadError.message : "Unable to load talent.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadTalent();

    return () => controller.abort();
  }, []);

  const parsedFilters = useMemo(
    () => parseTalentSearch(query, talent),
    [query, talent],
  );

  const results = useMemo(
    () => filterTalent(talent, parsedFilters),
    [talent, parsedFilters],
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const parsedItems = parsedFilterItems(parsedFilters);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10">
      <header className="mb-10 flex items-center justify-between border-b border-zinc-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            StudioNow
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950 sm:text-4xl">
            Talent search
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/add"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 transition-colors"
          >
            + Add talent
          </a>
          <a
            href="/review"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 transition-colors"
          >
            Review queue
          </a>
        </div>
      </header>

      <form onSubmit={submitSearch} className="mb-5">
        <label
          htmlFor="talent-search"
          className="mb-3 block text-sm font-medium text-zinc-700"
        >
          Search in plain English
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            id="talent-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: affordable DP in Vancouver who worked with us"
            rows={3}
            className="min-h-28 flex-1 resize-none rounded-lg border border-zinc-300 bg-white px-4 py-4 text-xl leading-8 text-zinc-950 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
          <div className="flex gap-3 sm:w-36 sm:flex-col">
            <button
              type="submit"
              className="h-12 flex-1 rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:flex-none"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="h-12 flex-1 rounded-lg border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 sm:flex-none"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      <section className="mb-8 border-y border-zinc-200 py-4">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="text-sm font-semibold text-zinc-950">
            Parsed filters
          </h2>
          <p className="text-sm text-zinc-500">
            {hasQuery
              ? "Live interpretation of the search text."
              : "Type a search to see filters here."}
          </p>
        </div>

        {parsedItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {parsedItems.map((item) => (
              <span
                key={`${item.label}-${item.value}`}
                className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm text-teal-950"
              >
                <span className="font-semibold">{item.label}:</span>{" "}
                {item.value}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600">
            No parsed filters yet. Results will show all loaded talent.
          </p>
        )}
      </section>

      <section className="flex-1">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Results
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {loading
                ? "Loading talent from Supabase..."
                : `${results.length} of ${talent.length} talent records`}
            </p>
          </div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Sorted A–Z by last name
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && talent.length === 0 && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Connected to Supabase, but the API returned 0 rows. Check table read
            access or add a server-only service role key.
          </div>
        )}

        {!loading && !error && talent.length > 0 && results.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-5 py-8 text-center text-sm text-zinc-600">
            No matches yet. Try broadening the role, budget, or location.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((record, index) => (
            <ResultCard
              key={`${record.display_name ?? "talent"}-${index}`}
              record={record}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ResultCard({ record }: { record: TalentRecord }) {
  const secondaryRoles = formatSecondaryRoles(record.secondary_roles);
  const location = resolvedLocation(record);
  const roleLine = [record.primary_role, secondaryRoles]
    .filter(Boolean)
    .join(" · ");
  const summary = trimmedSummary(
    record.summary,
    [record.primary_role, secondaryRoles, location].filter(Boolean).join(" · "),
  );
  const worked = workedWithUsYes(record.worked_with_us);
  const reviewChip =
    record.review_label && record.review_label !== "Unknown"
      ? REVIEW_CHIP[record.review_label] ?? null
      : null;
  const tags = splitTags(record.specialty_tags);
  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - visibleTags.length;
  const primaryLink = record.portfolio_url ?? record.website_url ?? null;
  const primaryLinkLabel = record.portfolio_url ? "Portfolio" : "Website";

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
      {/* Subtle edit affordance — pencil glyph, top-right */}
      {record.record_id && (
        <a
          href={`/edit/${record.record_id}`}
          aria-label={`Edit ${record.display_name ?? "record"}`}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-700 focus:opacity-100 group-hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.379-8.379-2.828-2.828Z" />
          </svg>
        </a>
      )}

      {/* Header: avatar + identity */}
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold tracking-wide ${avatarColor(
            record.display_name ?? "?",
          )}`}
          aria-hidden
        >
          {initials(record.display_name)}
        </div>
        <div className="min-w-0 flex-1 pr-8">
          <h3 className="truncate text-[15px] font-semibold leading-tight text-zinc-950">
            {record.display_name || "Unnamed talent"}
          </h3>
          {roleLine && (
            <p className="mt-1 truncate text-[13px] text-zinc-600">
              {roleLine}
            </p>
          )}
          {location && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-zinc-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3 w-3 shrink-0"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933a.75.75 0 0 0 .62 0C13.4 17.635 16 13.986 16 10a6 6 0 1 0-12 0c0 3.986 2.6 7.635 5.69 8.933ZM10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{location}</span>
            </p>
          )}
        </div>
      </div>

      {/* Status row: review + worked */}
      {(reviewChip || worked) && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {reviewChip && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${reviewChip}`}
            >
              {record.review_label}
            </span>
          )}
          {worked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Worked with us
            </span>
          )}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <p className="mt-3 line-clamp-3 text-[13px] leading-5 text-zinc-600">
          {summary}
        </p>
      )}

      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200"
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="rounded-md px-2 py-0.5 text-[11px] font-medium text-zinc-400">
              +{extraTagCount}
            </span>
          )}
        </div>
      )}

      {/* Footer: primary link pinned to bottom */}
      <div className="mt-auto flex items-center justify-between pt-4">
        {primaryLink ? (
          <a
            href={primaryLink}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] font-semibold text-teal-700 hover:text-teal-900 hover:underline"
          >
            {primaryLinkLabel} ↗
          </a>
        ) : record.email ? (
          <a
            href={`mailto:${record.email}`}
            className="truncate text-[12px] text-zinc-500 hover:text-zinc-800 hover:underline"
          >
            {record.email}
          </a>
        ) : (
          <span className="text-[12px] text-zinc-300">—</span>
        )}
        {record.record_id && (
          <span className="text-[11px] uppercase tracking-wide text-zinc-300">
            {record.record_id}
          </span>
        )}
      </div>
    </article>
  );
}
