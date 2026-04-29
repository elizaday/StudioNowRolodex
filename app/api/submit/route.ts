import { NextRequest } from "next/server";
import { readSubmissions, writeSubmissions } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { TalentDatabase } from "@/lib/types";

export const runtime = "nodejs";

const TALENT_TABLE = (process.env.SUPABASE_TALENT_TABLE ??
  "talent") as keyof TalentDatabase["public"]["Tables"];

/** Check for duplicate email in Supabase Talent_DB and in local Submissions. */
async function findDuplicate(email: string | null | undefined) {
  if (!email?.trim()) return null;
  const e = email.toLowerCase().trim();

  // Check local submissions first (fast)
  const subs = readSubmissions();
  const subDup = subs.find((s) => (s.email ?? "").toLowerCase() === e);
  if (subDup) return { source: "Submissions_Raw", record_id: subDup.record_id };

  // Check Supabase
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from(TALENT_TABLE)
      .select("display_name")
      .ilike("email", e)
      .limit(1);
    if (data && data.length > 0) {
      return { source: "Talent_DB", record_id: `match: ${(data[0] as { display_name?: string }).display_name ?? e}` };
    }
  } catch {
    // Non-fatal — skip dup check if Supabase unavailable
  }

  return null;
}

function nextSubmissionId(subs: ReturnType<typeof readSubmissions>): string {
  const max = Math.max(
    0,
    ...subs.map((s) => {
      const m = /^SUB-(\d+)$/.exec(s.record_id ?? "");
      return m ? Number(m[1]) : 0;
    }),
  );
  return `SUB-${String(max + 1).padStart(4, "0")}`;
}

export async function POST(req: NextRequest) {
  const raw = (await req.json()) as Record<string, unknown>;
  const { _force, ...body } = raw;

  // Validate required fields
  if (!body.record_type || !body.primary_role) {
    return Response.json({ error: "record_type and primary_role are required." }, { status: 400 });
  }
  if (!body.display_name && !body.company_name && !body.contact_name) {
    return Response.json(
      { error: "At least one of display_name, company_name, or contact_name is required." },
      { status: 400 },
    );
  }

  // Duplicate check
  if (!_force) {
    const dup = await findDuplicate(body.email as string | null);
    if (dup) return Response.json({ duplicate: dup }, { status: 409 });
  }

  // Build location_search from parts
  const locationParts = [body.location_city, body.location_state_province, body.location_country]
    .map((p) => String(p ?? "").trim())
    .filter(Boolean);
  const location_search = locationParts.join(", ") || null;

  const subs = readSubmissions();
  const record_id = nextSubmissionId(subs);

  const reviewLabelMap: Record<string, number> = {
    Exceptional: 5, Great: 4, Good: 3, "To Try": 2, Unknown: 1, "Not a Fit": 0,
  };
  const review_label = (body.review_label as string) ?? "Unknown";

  const submission = {
    record_id,
    active: "Yes",
    approval_status: "Pending",
    submission_status: "Pending" as const,
    submission_timestamp: new Date().toISOString(),
    record_type: body.record_type as string,
    primary_role: body.primary_role as string,
    secondary_roles: (body.secondary_roles as string) || null,
    company_name: (body.company_name as string) || null,
    contact_name: (body.contact_name as string) || null,
    display_name: ((body.display_name || body.contact_name || body.company_name) as string) || null,
    email: (body.email as string) || null,
    phone: (body.phone as string) || null,
    website_url: (body.website_url as string) || null,
    portfolio_url: (body.portfolio_url as string) || null,
    social_url: (body.social_url as string) || null,
    location_city: (body.location_city as string) || null,
    location_state_province: (body.location_state_province as string) || null,
    location_country: (body.location_country as string) || null,
    location_search,
    languages: (body.languages as string) || null,
    specialty_tags: (body.specialty_tags as string) || null,
    rate_min: typeof body.rate_min === "number" ? body.rate_min : null,
    rate_max: typeof body.rate_max === "number" ? body.rate_max : null,
    rate_currency: (body.rate_currency as string) || null,
    rate_basis: (body.rate_basis as string) || "Unknown",
    budget_tier: (body.budget_tier as string) || "Unknown",
    review_label,
    review_score: reviewLabelMap[review_label] ?? 1,
    recommended_by: (body.recommended_by as string) || null,
    source_or_referral: (body.source_or_referral as string) || "Intake Form",
    worked_with_us: (body.worked_with_us as string) || "Unknown",
    summary: (body.summary as string) || null,
    notes: (body.notes as string) || null,
    source_sheet: "Intake Form",
    date_added: new Date().toISOString().slice(0, 10),
    added_by: (body.added_by as string) || "Web Intake",
    verification_status: "Needs Recheck",
  };

  subs.push(submission);
  writeSubmissions(subs);

  return Response.json({ ok: true, submission }, { status: 201 });
}
