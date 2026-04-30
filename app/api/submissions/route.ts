import { createSupabaseServerClient } from "@/lib/supabase";
import type { TalentDatabase } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TALENT_TABLE = (process.env.SUPABASE_TALENT_TABLE ??
  "talent") as keyof TalentDatabase["public"]["Tables"];

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(TALENT_TABLE)
      .select("*")
      .eq("source_sheet", "Intake Form")
      .order("date_added", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ submissions: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
