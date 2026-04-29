import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { TalentDatabase } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TALENT_TABLE = (process.env.SUPABASE_TALENT_TABLE ??
  "talent") as keyof TalentDatabase["public"]["Tables"];

/** Whitelist of columns the UI can write. Never includes record_id or audit fields. */
const WRITABLE_FIELDS = new Set([
  "display_name",
  "primary_role",
  "secondary_roles",
  "record_type",
  "company_name",
  "contact_name",
  "email",
  "phone",
  "website_url",
  "portfolio_url",
  "social_url",
  "address",
  "location_city",
  "location_state_province",
  "location_country",
  "location_search",
  "languages",
  "specialty_tags",
  "rate_min",
  "rate_max",
  "rate_currency",
  "rate_basis",
  "budget_tier",
  "review_label",
  "review_score",
  "recommended_by",
  "source_or_referral",
  "worked_with_us",
  "summary",
  "notes",
  "gear_notes",
  "last_project",
  "last_worked_date",
  "last_verified_date",
  "verification_status",
  "active",
  "approval_status",
]);

const REVIEW_LABEL_TO_SCORE: Record<string, number> = {
  Exceptional: 5,
  Great: 4,
  Good: 3,
  "To Try": 2,
  Unknown: 1,
  "Not a Fit": 0,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(TALENT_TABLE)
      .select("*")
      .eq("record_id", id)
      .maybeSingle();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!data) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ talent: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;

  // Filter to whitelist. Coerce empty strings to null.
  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (!WRITABLE_FIELDS.has(key)) continue;
    update[key] = value === "" ? null : value;
  }

  // Derive location_search from parts if the user edited location but not the
  // combined field.
  if (
    ("location_city" in update ||
      "location_state_province" in update ||
      "location_country" in update) &&
    !("location_search" in body)
  ) {
    const parts = [
      update.location_city,
      update.location_state_province,
      update.location_country,
    ]
      .map((p) => (p == null ? "" : String(p)).trim())
      .filter(Boolean);
    update.location_search = parts.length > 0 ? parts.join(", ") : null;
  }

  // Keep review_score in sync with review_label.
  if ("review_label" in update && typeof update.review_label === "string") {
    update.review_score = REVIEW_LABEL_TO_SCORE[update.review_label] ?? 1;
  }

  if (Object.keys(update).length === 0) {
    return Response.json({ error: "No writable fields in payload" }, { status: 400 });
  }

  // Stamp verification as a soft audit trail.
  update.last_verified_date = new Date().toISOString().slice(0, 10);

  try {
    const supabase = createSupabaseServerClient();
    // Supabase's typegen over our custom TalentDatabase resolves the Update
    // payload type to `never` in some corners (likely because the key union
    // over two identically-shaped tables confuses inference). Our whitelist
    // guarantees the payload matches the column shape at runtime, so we cast
    // through `unknown` to bypass the spurious compile error.
    const { data, error } = await supabase
      .from(TALENT_TABLE)
      .update(update as unknown as never)
      .eq("record_id", id)
      .select("*")
      .maybeSingle();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!data) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, talent: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
