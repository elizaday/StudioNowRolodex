import { createSupabaseServerClient } from "@/lib/supabase";
import type { TalentDatabase } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TALENT_TABLE = (process.env.SUPABASE_TALENT_TABLE ??
  "talent") as keyof TalentDatabase["public"]["Tables"];

const TALENT_FIELDS = [
  "record_id",
  "display_name",
  "primary_role",
  "secondary_roles",
  "location_search",
  "location_city",
  "location_state_province",
  "location_country",
  "budget_tier",
  "review_label",
  "worked_with_us",
  "email",
  "phone",
  "portfolio_url",
  "website_url",
  "specialty_tags",
  "summary",
  "notes",
].join(",");

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(TALENT_TABLE)
      .select(TALENT_FIELDS)
      .order("display_name", { ascending: true })
      .limit(1000);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ talent: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
