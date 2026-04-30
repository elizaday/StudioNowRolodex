"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/app/components/StudioShell";
import type { TalentRecordFull } from "@/lib/types";

export default function ReviewPage() {
  const [submissions, setSubmissions] = useState<TalentRecordFull[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setSubmissions(data.submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pending =
    submissions?.filter((s) => s.approval_status === "Pending") ?? [];
  const reviewed =
    submissions?.filter(
      (s) => s.approval_status && s.approval_status !== "Pending",
    ) ?? [];

  return (
    <StudioShell sectionLabel="Talent Search" rightLabel="Review Queue">
      <section className="mx-auto max-w-6xl rounded-lg border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div>
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0b66d8] hover:text-[#084b9e]">
              Back to search
            </Link>
            <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Review queue</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-500">
              Submissions waiting for approval before they enter the live rolodex.
            </p>
          </div>
          <Link
            href="/add"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-950"
          >
            + Add talent
          </Link>
        </div>

        <div className="px-6 py-6 lg:px-8 lg:py-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              {error}
            </div>
          )}

          {submissions === null && !error && (
            <div className="py-12 text-center text-sm text-zinc-500">Loading...</div>
          )}

          {submissions !== null && pending.length === 0 && reviewed.length === 0 && (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-[#fafaf9] py-16 text-center">
              <p className="text-zinc-500">No submissions yet.</p>
              <Link href="/add" className="mt-3 inline-block text-sm font-semibold text-[#0b66d8] hover:underline">
                Add the first one
              </Link>
            </div>
          )}

          {pending.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Pending ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((s) => (
                  <SubmissionCard key={s.record_id} sub={s} onRefresh={load} />
                ))}
              </div>
            </section>
          )}

          {reviewed.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Already reviewed ({reviewed.length})
              </h2>
              <div className="space-y-3">
                {reviewed.map((s) => (
                  <SubmissionCard key={s.record_id} sub={s} onRefresh={load} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </StudioShell>
  );
}

function SubmissionCard({ sub, onRefresh }: { sub: TalentRecordFull; onRefresh: () => void }) {
  const [saving, setSaving] = useState(false);
  const location = [sub.location_city, sub.location_state_province, sub.location_country]
    .filter(Boolean)
    .join(", ");

  async function updateStatus(newStatus: "Approved" | "Rejected") {
    setSaving(true);
    try {
      const res = await fetch(`/api/submissions/${sub.record_id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ approval_status: newStatus }),
      });
      if (res.ok) onRefresh();
    } finally {
      setSaving(false);
    }
  }

  const statusStyles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-800 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Rejected: "bg-red-50 text-red-800 border-red-200",
  };
  const statusStyle = statusStyles[sub.approval_status ?? "Pending"] ?? statusStyles.Pending;

  return (
    <div className="rounded-lg border border-zinc-200 bg-[#fafaf9] p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-950">
              {sub.display_name ?? sub.company_name ?? sub.record_id}
            </h3>
            <span className={`rounded border px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
              {sub.approval_status ?? "Pending"}
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
              {sub.record_id}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-600">
            {[sub.primary_role, sub.record_type, location].filter(Boolean).join(" · ")}
          </p>
          {sub.summary && (
            <p className="mt-2 text-sm text-zinc-700">{sub.summary}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
            {sub.email && <span>✉ {sub.email}</span>}
            {sub.phone && <span>☎ {sub.phone}</span>}
            {sub.review_label && <span>Review: {sub.review_label}</span>}
            {sub.budget_tier && <span>Budget: {sub.budget_tier}</span>}
            {sub.recommended_by && <span>Rec by: {sub.recommended_by}</span>}
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Submitted {sub.date_added
              ? new Date(sub.date_added).toLocaleString()
              : "unknown"}{sub.added_by ? ` by ${sub.added_by}` : ""}
          </p>
        </div>

        {sub.approval_status === "Pending" && (
          <div className="flex shrink-0 gap-2 sm:flex-col">
            <button
              onClick={() => updateStatus("Approved")}
              disabled={saving}
              className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus("Rejected")}
              disabled={saving}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
