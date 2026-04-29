import { NextRequest } from "next/server";
import { readSubmissions, writeSubmissions, type Submission } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { TalentDatabase } from "@/lib/types";

export const runtime = "nodejs";

const TALENT_TABLE = (process.env.SUPABASE_TALENT_TABLE ??
  "talent") as keyof TalentDatabase["public"]["Tables"];

/** Find the next TAL-xxxx id by scanning existing Supabase record_ids. */
async function nextTalentId(
  supabase: ReturnType<typeof createSupabaseServerClient>,
): Promise<string> {
  const { data } = await supabase
    .from(TALENT_TABLE)
    .select("record_id")
    .ilike("record_id", "TAL-%");

  const max = Math.max(
    0,
    ...(data ?? []).map((r) => {
      const m = /^TAL-(\d+)$/.exec((r as { record_id?: string }).record_id ?? "");
      return m ? Number(m[1]) : 0;
    }),
  );
  return `TAL-${String(max + 1).padStart(4, "0")}`;
}

/** Map a Submission into a Supabase insert payload. Drops SUB-specific fields. */
function submissionToTalent(sub: Submission, newId: string) {
  return {
    record_id: newId,
    active: sub.active ?? "Yes",
    approval_status: "Approved",
    record_type: sub.record_type ?? null,
    primary_role: sub.primary_role ?? null,
    secondary_roles: sub.secondary_roles ?? null,
    display_name: sub.display_name ?? null,
    company_name: sub.company_name ?? null,
    contact_name: sub.contact_name ?? null,
    email: sub.email ?? null,
    phone: sub.phone ?? null,
    website_url: sub.website_url ?? null,
    portfolio_url: sub.portfolio_url ?? null,
    social_url: sub.social_url ?? null,
    address: sub.address ?? null,
    location_city: sub.location_city ?? null,
    location_state_province: sub.location_state_province ?? null,
    location_country: sub.location_country ?? null,
    location_search: sub.location_search ?? null,
    languages: sub.languages ?? null,
    specialty_tags: sub.specialty_tags ?? null,
    rate_min: sub.rate_min ?? null,
    rate_max: sub.rate_max ?? null,
    rate_currency: sub.rate_currency ?? null,
    rate_basis: sub.rate_basis ?? null,
    budget_tier: sub.budget_tier ?? null,
    review_label: sub.review_label ?? null,
    review_score: sub.review_score ?? null,
    recommended_by: sub.recommended_by ?? null,
    source_or_referral: sub.source_or_referral ?? null,
    worked_with_us: sub.worked_with_us ?? null,
    summary: sub.summary ?? null,
    notes: sub.notes ?? null,
    source_sheet: sub.source_sheet ?? "Intake Form",
    date_added: sub.date_added ?? new Date().toISOString().slice(0, 10),
    added_by: sub.added_by ?? null,
    verification_status: sub.verification_status ?? "Needs Recheck",
    last_verified_date: new Date().toISOString().slice(0, 10),
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { submission_status?: string };

  const subs = readSubmissions();
  const idx = subs.findIndex((s) => s.record_id === id);
  if (idx === -1) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const newStatus = body.submission_status;
  if (!newStatus) {
    return Response.json({ error: "submission_status required" }, { status: 400 });
  }

  subs[idx].submission_status = newStatus as "Pending" | "Approved" | "Rejected";

  // Rejected: just mark and return.
  if (newStatus === "Rejected") {
    subs[idx].approval_status = "Rejected";
    writeSubmissions(subs);
    return Response.json({ ok: true, submission: subs[idx] });
  }

  // Approved: promote to Supabase (idempotent — skip if already promoted).
  if (newStatus === "Approved") {
    subs[idx].approval_status = "Approved";

    if (subs[idx].promoted_record_id) {
      writeSubmissions(subs);
      return Response.json({
        ok: true,
        submission: subs[idx],
        note: "Already promoted",
      });
    }

    try {
      const supabase = createSupabaseServerClient();
      const newId = await nextTalentId(supabase);
      const payload = submissionToTalent(subs[idx], newId);

      const { error } = await supabase
        .from(TALENT_TABLE)
        .insert(payload as unknown as never);

      if (error) {
        return Response.json(
          { error: `Supabase insert failed: ${error.message}` },
          { status: 500 },
        );
      }

      subs[idx].promoted_record_id = newId;
      writeSubmissions(subs);
      return Response.json({
        ok: true,
        submission: subs[idx],
        promoted_record_id: newId,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return Response.json({ error: message }, { status: 500 });
    }
  }

  // Pending or other: just save the status change.
  writeSubmissions(subs);
  return Response.json({ ok: true, submission: subs[idx] });
}
