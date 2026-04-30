import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { TalentDatabase } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TALENT_TABLE = (process.env.SUPABASE_TALENT_TABLE ??
  "talent") as keyof TalentDatabase["public"]["Tables"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { approval_status?: string };
  const newStatus = body.approval_status;
  if (!newStatus) {
    return Response.json({ error: "approval_status required" }, { status: 400 });
  }

  const update: Record<string, unknown> = {
    approval_status: newStatus,
    active:
      newStatus === "Approved"
        ? "Yes"
        : newStatus === "Rejected"
          ? "No"
          : "No",
    last_verified_date: new Date().toISOString().slice(0, 10),
  };

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(TALENT_TABLE)
      .update(update as unknown as never)
      .eq("record_id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ ok: true, submission: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
