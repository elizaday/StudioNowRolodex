"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ListsData } from "@/lib/types";
import {
  FormSection,
  Field,
  TextInput,
  Select,
  Textarea,
} from "@/app/components/FormControls";

type FormValues = {
  record_type: string;
  primary_role: string;
  secondary_roles: string;
  display_name: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website_url: string;
  portfolio_url: string;
  social_url: string;
  location_city: string;
  location_state_province: string;
  location_country: string;
  languages: string;
  specialty_tags: string;
  rate_min: string;
  rate_max: string;
  rate_currency: string;
  rate_basis: string;
  budget_tier: string;
  review_label: string;
  worked_with_us: string;
  recommended_by: string;
  source_or_referral: string;
  summary: string;
  notes: string;
  added_by: string;
};

const BLANK: FormValues = {
  record_type: "Person",
  primary_role: "",
  secondary_roles: "",
  display_name: "",
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  website_url: "",
  portfolio_url: "",
  social_url: "",
  location_city: "",
  location_state_province: "",
  location_country: "",
  languages: "",
  specialty_tags: "",
  rate_min: "",
  rate_max: "",
  rate_currency: "",
  rate_basis: "Unknown",
  budget_tier: "Unknown",
  review_label: "Unknown",
  worked_with_us: "Unknown",
  recommended_by: "",
  source_or_referral: "",
  summary: "",
  notes: "",
  added_by: "",
};

type Status =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; id: string }
  | { type: "duplicate"; existingId: string; source: string }
  | { type: "error"; message: string };

export default function AddPage() {
  const [lists, setLists] = useState<ListsData | null>(null);
  const [form, setForm] = useState<FormValues>(BLANK);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  useEffect(() => {
    fetch("/api/lists")
      .then((r) => r.json())
      .then((d) => setLists(d.lists));
  }, []);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status.type !== "idle") setStatus({ type: "idle" });
  }

  async function handleSubmit(e: React.FormEvent, force = false) {
    e.preventDefault();
    setStatus({ type: "submitting" });

    const payload: Record<string, unknown> = { ...form, _force: force };
    payload.rate_min = form.rate_min ? Number(form.rate_min) : null;
    payload.rate_max = form.rate_max ? Number(form.rate_max) : null;
    for (const k of Object.keys(payload)) {
      if (payload[k] === "") payload[k] = null;
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 409 && data.duplicate) {
        setStatus({ type: "duplicate", existingId: data.duplicate.record_id, source: data.duplicate.source });
        return;
      }
      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "Submission failed" });
        return;
      }
      setStatus({ type: "success", id: data.submission.record_id });
      setForm(BLANK);
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Network error" });
    }
  }

  if (!lists) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-xs font-semibold uppercase text-teal-700 hover:underline">
            ← Back to search
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Add to rolodex</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Submissions go to the review queue — nothing goes live until approved.
          </p>
        </div>
      </div>

      {/* Status banners */}
      {status.type === "success" && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          ✓ Saved as <strong>{status.id}</strong>.{" "}
          <Link href="/review" className="font-semibold underline">View review queue →</Link>
        </div>
      )}
      {status.type === "duplicate" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Possible duplicate:</strong> this email matches <code className="rounded bg-amber-100 px-1">{status.existingId}</code> in {status.source}.{" "}
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
            className="ml-1 font-semibold underline"
          >
            Submit anyway
          </button>
        </div>
      )}
      {status.type === "error" && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Basics */}
        <FormSection title="Role">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Record type *">
              <Select
                value={form.record_type}
                onChange={(v) => update("record_type", v)}
                options={lists.record_type}
              />
            </Field>
            <Field label="Primary role *">
              <Select
                value={form.primary_role}
                onChange={(v) => update("primary_role", v)}
                options={["", ...lists.primary_role]}
                placeholder="Select a role"
              />
            </Field>
          </div>
          <Field label="Secondary roles" hint="Comma-separated, e.g. Editor, Colorist">
            <TextInput value={form.secondary_roles} onChange={(v) => update("secondary_roles", v)} placeholder="Editor, Colorist" />
          </Field>
        </FormSection>

        {/* Section: Identity */}
        <FormSection title="Identity">
          <Field label="Display name *" hint="Shown on the search card. Use 'First Last' for people, company name for companies.">
            <TextInput value={form.display_name} onChange={(v) => update("display_name", v)} />
          </Field>
          {form.record_type !== "Person" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name">
                <TextInput value={form.company_name} onChange={(v) => update("company_name", v)} />
              </Field>
              <Field label="Contact name">
                <TextInput value={form.contact_name} onChange={(v) => update("contact_name", v)} />
              </Field>
            </div>
          )}
        </FormSection>

        {/* Section: Contact */}
        <FormSection title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <TextInput type="email" value={form.email} onChange={(v) => update("email", v)} />
            </Field>
            <Field label="Phone">
              <TextInput value={form.phone} onChange={(v) => update("phone", v)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Portfolio URL">
              <TextInput value={form.portfolio_url} onChange={(v) => update("portfolio_url", v)} placeholder="https://" />
            </Field>
            <Field label="Website URL">
              <TextInput value={form.website_url} onChange={(v) => update("website_url", v)} placeholder="https://" />
            </Field>
          </div>
          <Field label="Social URL">
            <TextInput value={form.social_url} onChange={(v) => update("social_url", v)} placeholder="Instagram, LinkedIn, etc." />
          </Field>
        </FormSection>

        {/* Section: Location */}
        <FormSection title="Location">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City">
              <TextInput value={form.location_city} onChange={(v) => update("location_city", v)} />
            </Field>
            <Field label="State / Province">
              <TextInput value={form.location_state_province} onChange={(v) => update("location_state_province", v)} />
            </Field>
            <Field label="Country">
              <TextInput value={form.location_country} onChange={(v) => update("location_country", v)} placeholder="USA" />
            </Field>
          </div>
          <Field label="Languages" hint="Comma-separated, e.g. english, spanish">
            <TextInput value={form.languages} onChange={(v) => update("languages", v)} placeholder="english" />
          </Field>
        </FormSection>

        {/* Section: Craft & Rate */}
        <FormSection title="Craft &amp; rate">
          <Field label="Specialty tags" hint="Comma-separated skills, gear, or niches — e.g. drone, food styling, RED camera">
            <TextInput value={form.specialty_tags} onChange={(v) => update("specialty_tags", v)} placeholder="drone, food styling" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Rate min">
              <TextInput type="number" value={form.rate_min} onChange={(v) => update("rate_min", v)} />
            </Field>
            <Field label="Rate max">
              <TextInput type="number" value={form.rate_max} onChange={(v) => update("rate_max", v)} />
            </Field>
            <Field label="Currency">
              <Select value={form.rate_currency} onChange={(v) => update("rate_currency", v)} options={["", ...lists.rate_currency]} />
            </Field>
            <Field label="Basis">
              <Select value={form.rate_basis} onChange={(v) => update("rate_basis", v)} options={lists.rate_basis} />
            </Field>
          </div>
          <Field label="Budget tier">
            <Select value={form.budget_tier} onChange={(v) => update("budget_tier", v)} options={lists.budget_tier} />
          </Field>
        </FormSection>

        {/* Section: StudioNow context */}
        <FormSection title="StudioNow context">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Review">
              <Select value={form.review_label} onChange={(v) => update("review_label", v)} options={lists.review_label} />
            </Field>
            <Field label="Worked with us">
              <Select value={form.worked_with_us} onChange={(v) => update("worked_with_us", v)} options={lists.worked_with_us} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recommended by">
              <TextInput value={form.recommended_by} onChange={(v) => update("recommended_by", v)} />
            </Field>
            <Field label="Source / referral">
              <TextInput value={form.source_or_referral} onChange={(v) => update("source_or_referral", v)} />
            </Field>
          </div>
          <Field label="Added by">
            <Select value={form.added_by} onChange={(v) => update("added_by", v)} options={["", ...lists.team_members]} placeholder="— select —" />
          </Field>
        </FormSection>

        {/* Section: Notes */}
        <FormSection title="Notes">
          <Field label="One-line summary" hint="Shown on the search card. E.g. 'DP | Atlanta | Great with run-and-gun'">
            <TextInput value={form.summary} onChange={(v) => update("summary", v)} />
          </Field>
          <Field label="Internal notes">
            <Textarea value={form.notes} onChange={(v) => update("notes", v)} rows={4} />
          </Field>
        </FormSection>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={status.type === "submitting"}
            className="rounded-lg bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {status.type === "submitting" ? "Submitting…" : "Submit for review"}
          </button>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
