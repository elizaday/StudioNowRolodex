"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { StudioShell } from "@/app/components/StudioShell";
import type { ListsData, TalentRecordFull } from "@/lib/types";
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
  address: string;
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
  gear_notes: string;
  verification_status: string;
  active: string;
};

const EMPTY: FormValues = {
  record_type: "", primary_role: "", secondary_roles: "",
  display_name: "", company_name: "", contact_name: "",
  email: "", phone: "", website_url: "", portfolio_url: "", social_url: "",
  address: "", location_city: "", location_state_province: "", location_country: "",
  languages: "", specialty_tags: "",
  rate_min: "", rate_max: "", rate_currency: "", rate_basis: "",
  budget_tier: "", review_label: "", worked_with_us: "",
  recommended_by: "", source_or_referral: "",
  summary: "", notes: "", gear_notes: "",
  verification_status: "", active: "",
};

/** Convert a possibly-null/mixed DB value to a string form-control value. */
function toStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  return String(v);
}

function recordToForm(r: TalentRecordFull): FormValues {
  return {
    record_type: toStr(r.record_type),
    primary_role: toStr(r.primary_role),
    secondary_roles: toStr(r.secondary_roles),
    display_name: toStr(r.display_name),
    company_name: toStr(r.company_name),
    contact_name: toStr(r.contact_name),
    email: toStr(r.email),
    phone: toStr(r.phone),
    website_url: toStr(r.website_url),
    portfolio_url: toStr(r.portfolio_url),
    social_url: toStr(r.social_url),
    address: toStr(r.address),
    location_city: toStr(r.location_city),
    location_state_province: toStr(r.location_state_province),
    location_country: toStr(r.location_country),
    languages: toStr(r.languages),
    specialty_tags: toStr(r.specialty_tags),
    rate_min: toStr(r.rate_min),
    rate_max: toStr(r.rate_max),
    rate_currency: toStr(r.rate_currency),
    rate_basis: toStr(r.rate_basis),
    budget_tier: toStr(r.budget_tier),
    review_label: toStr(r.review_label),
    worked_with_us: toStr(r.worked_with_us),
    recommended_by: toStr(r.recommended_by),
    source_or_referral: toStr(r.source_or_referral),
    summary: toStr(r.summary),
    notes: toStr(r.notes),
    gear_notes: toStr(r.gear_notes),
    verification_status: toStr(r.verification_status),
    active: toStr(r.active),
  };
}

type Status =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "saved" }
  | { type: "error"; message: string };

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lists, setLists] = useState<ListsData | null>(null);
  const [original, setOriginal] = useState<FormValues | null>(null);
  const [form, setForm] = useState<FormValues>(EMPTY);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/lists")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Lists failed to load");
        return data;
      })
      .then((d) => setLists(d.lists))
      .catch((err: unknown) =>
        setLoadError(err instanceof Error ? err.message : "Lists failed to load"),
      );
    fetch(`/api/talent/${id}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Load failed");
        return data.talent as TalentRecordFull;
      })
      .then((rec) => {
        const f = recordToForm(rec);
        setOriginal(f);
        setForm(f);
      })
      .catch((err: unknown) =>
        setLoadError(err instanceof Error ? err.message : "Load failed"),
      );
  }, [id]);

  function update<K extends keyof FormValues>(k: K, v: FormValues[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (status.type !== "idle") setStatus({ type: "idle" });
  }

  /** Only send changed fields in the PATCH payload. */
  const changedFields = useMemo(() => {
    if (!original) return {};
    const diff: Record<string, unknown> = {};
    (Object.keys(form) as (keyof FormValues)[]).forEach((k) => {
      if (form[k] !== original[k]) diff[k] = form[k];
    });
    return diff;
  }, [form, original]);

  const changedCount = Object.keys(changedFields).length;

  async function save() {
    if (changedCount === 0) return;
    setStatus({ type: "saving" });

    const payload: Record<string, unknown> = { ...changedFields };
    if ("rate_min" in payload) {
      payload.rate_min = payload.rate_min ? Number(payload.rate_min) : null;
    }
    if ("rate_max" in payload) {
      payload.rate_max = payload.rate_max ? Number(payload.rate_max) : null;
    }

    try {
      const res = await fetch(`/api/talent/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "Save failed" });
        return;
      }
      // Reset "original" so the diff resets to empty.
      setOriginal(form);
      setStatus({ type: "saved" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  if (loadError) {
    return (
      <StudioShell sectionLabel="Talent Search" rightLabel="Edit Record">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Couldn&apos;t load {id}: {loadError}
          </div>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-[#0b66d8] hover:underline">
            Back to search
          </Link>
        </div>
      </StudioShell>
    );
  }

  if (!lists || !original) {
    return (
      <StudioShell sectionLabel="Talent Search" rightLabel="Edit Record">
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
          Loading...
        </div>
      </StudioShell>
    );
  }

  return (
    <StudioShell sectionLabel="Talent Search" rightLabel="Edit Record">
      <section className="mx-auto max-w-5xl rounded-lg border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="border-b border-zinc-200 px-6 py-6 lg:px-8">
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0b66d8] hover:text-[#084b9e]">
            Back to search
          </Link>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-950">
            Edit {original.display_name || id}
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-500">
            Record <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm text-zinc-700">{id}</code>. Changes save directly to the live rolodex.
          </p>
        </div>

        <div className="px-6 py-6 lg:px-8 lg:py-8">
          {status.type === "saved" && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              Saved.
            </div>
          )}
          {status.type === "error" && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              {status.message}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="space-y-6"
          >
        {/* Role & identity */}
        <FormSection title="Role">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Record type">
              <Select value={form.record_type} onChange={(v) => update("record_type", v)} options={lists.record_type} />
            </Field>
            <Field label="Primary role">
              <Select value={form.primary_role} onChange={(v) => update("primary_role", v)} options={["", ...lists.primary_role]} placeholder="— select —" />
            </Field>
          </div>
          <Field label="Secondary roles" hint="Free text, comma-separated.">
            <TextInput value={form.secondary_roles} onChange={(v) => update("secondary_roles", v)} />
          </Field>
        </FormSection>

        <FormSection title="Identity">
          <Field label="Display name">
            <TextInput value={form.display_name} onChange={(v) => update("display_name", v)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name">
              <TextInput value={form.company_name} onChange={(v) => update("company_name", v)} />
            </Field>
            <Field label="Contact name">
              <TextInput value={form.contact_name} onChange={(v) => update("contact_name", v)} />
            </Field>
          </div>
        </FormSection>

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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Social URL">
              <TextInput value={form.social_url} onChange={(v) => update("social_url", v)} />
            </Field>
            <Field label="Address">
              <TextInput value={form.address} onChange={(v) => update("address", v)} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Location">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City">
              <TextInput value={form.location_city} onChange={(v) => update("location_city", v)} />
            </Field>
            <Field label="State / Province">
              <TextInput value={form.location_state_province} onChange={(v) => update("location_state_province", v)} />
            </Field>
            <Field label="Country">
              <TextInput value={form.location_country} onChange={(v) => update("location_country", v)} />
            </Field>
          </div>
          <Field label="Languages" hint="Comma-separated, e.g. english, spanish">
            <TextInput value={form.languages} onChange={(v) => update("languages", v)} />
          </Field>
        </FormSection>

        <FormSection title="Craft &amp; rate">
          <Field label="Specialty tags">
            <TextInput value={form.specialty_tags} onChange={(v) => update("specialty_tags", v)} />
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
          <Field label="Gear notes">
            <Textarea value={form.gear_notes} onChange={(v) => update("gear_notes", v)} />
          </Field>
        </FormSection>

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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Verification">
              <Select value={form.verification_status} onChange={(v) => update("verification_status", v)} options={["", ...lists.verification_status]} />
            </Field>
            <Field label="Active">
              <Select value={form.active} onChange={(v) => update("active", v)} options={["", ...lists.active]} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Notes">
          <Field label="One-line summary">
            <TextInput value={form.summary} onChange={(v) => update("summary", v)} />
          </Field>
          <Field label="Internal notes">
            <Textarea value={form.notes} onChange={(v) => update("notes", v)} rows={4} />
          </Field>
        </FormSection>

        {/* Changes diff + save */}
            <div className="sticky bottom-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-zinc-600">
                  {changedCount === 0 ? (
                    <span>No changes yet.</span>
                  ) : (
                    <span>
                      <strong className="text-zinc-900">{changedCount}</strong>{" "}
                      field{changedCount === 1 ? "" : "s"} changed:{" "}
                      <span className="text-zinc-500">
                        {Object.keys(changedFields).join(", ")}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(original)}
                    disabled={changedCount === 0 || status.type === "saving"}
                    className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
                  >
                    Revert
                  </button>
                  <button
                    type="submit"
                    disabled={changedCount === 0 || status.type === "saving"}
                    className="rounded-lg bg-[#111111] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
                  >
                    {status.type === "saving" ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </StudioShell>
  );
}
