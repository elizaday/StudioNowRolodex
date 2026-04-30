"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-xs font-semibold uppercase text-teal-700 hover:underline">
            ← Back to search
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Review queue</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Submissions awaiting approval before they enter Talent_DB.
          </p>
        </div>
        <Link
          href="/add"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 transition-colors"
        >
          + Add talent
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {submissions === null && !error && (
        <div className="py-12 text-center text-sm text-zinc-500">Loading…</div>
      )}

      {submissions !== null && pending.length === 0 && reviewed.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-zinc-500">No submissions yet.</p>
          <Link href="/add" className="mt-3 inline-block text-sm font-semibold text-teal-700 hover:underline">
            Add the first one →
          </Link>
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
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
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
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
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
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
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
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
