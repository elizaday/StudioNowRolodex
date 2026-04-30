import { createSupabaseServerClient } from "@/lib/supabase";
import type { ListsData, TalentDatabase, TalentRecordFull } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TALENT_TABLE = (process.env.SUPABASE_TALENT_TABLE ??
  "talent") as keyof TalentDatabase["public"]["Tables"];

const DEFAULT_LISTS: ListsData = {
  record_type: ["Person", "Company", "Vendor"],
  approval_status: ["Pending", "Approved", "Rejected"],
  active: ["Yes", "No"],
  primary_role: [],
  review_label: [
    "Unknown",
    "To Try",
    "Good",
    "Great",
    "Exceptional",
    "Not a Fit",
  ],
  review_label_map: ["Not a Fit", "Unknown", "To Try", "Good", "Great", "Exceptional"],
  review_score_map: [0, 1, 2, 3, 4, 5],
  rate_currency: ["USD"],
  rate_basis: ["Unknown", "Hour", "Half Day", "Day", "Project"],
  budget_tier: ["Unknown", "Low", "Mid", "High", "Premium"],
  worked_with_us: ["Unknown", "Yes", "No", "Indirectly"],
  verification_status: ["Needs Recheck", "Verified"],
  team_members: [],
  languages: [],
};

function uniqueSorted(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .flatMap((value) => String(value ?? "").split(/[,;/|]/))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(TALENT_TABLE)
      .select(
        [
          "record_type",
          "approval_status",
          "active",
          "primary_role",
          "review_label",
          "rate_currency",
          "rate_basis",
          "budget_tier",
          "worked_with_us",
          "verification_status",
          "added_by",
          "languages",
        ].join(","),
      )
      .limit(1000);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []) as TalentRecordFull[];
    const lists: ListsData = {
      ...DEFAULT_LISTS,
      record_type: uniqueSorted(rows.map((row) => row.record_type)).length
        ? uniqueSorted(rows.map((row) => row.record_type))
        : DEFAULT_LISTS.record_type,
      approval_status: uniqueSorted(rows.map((row) => row.approval_status)).length
        ? uniqueSorted(rows.map((row) => row.approval_status))
        : DEFAULT_LISTS.approval_status,
      active: uniqueSorted(rows.map((row) => row.active)).length
        ? uniqueSorted(rows.map((row) => row.active))
        : DEFAULT_LISTS.active,
      primary_role: uniqueSorted(rows.map((row) => row.primary_role)),
      review_label: uniqueSorted(rows.map((row) => row.review_label)).length
        ? uniqueSorted(rows.map((row) => row.review_label))
        : DEFAULT_LISTS.review_label,
      rate_currency: uniqueSorted(rows.map((row) => row.rate_currency)).length
        ? uniqueSorted(rows.map((row) => row.rate_currency))
        : DEFAULT_LISTS.rate_currency,
      rate_basis: uniqueSorted(rows.map((row) => row.rate_basis)).length
        ? uniqueSorted(rows.map((row) => row.rate_basis))
        : DEFAULT_LISTS.rate_basis,
      budget_tier: uniqueSorted(rows.map((row) => row.budget_tier)).length
        ? uniqueSorted(rows.map((row) => row.budget_tier))
        : DEFAULT_LISTS.budget_tier,
      worked_with_us: uniqueSorted(
        rows.map((row) => row.worked_with_us as string),
      ).length
        ? uniqueSorted(rows.map((row) => row.worked_with_us as string))
        : DEFAULT_LISTS.worked_with_us,
      verification_status: uniqueSorted(
        rows.map((row) => row.verification_status),
      ).length
        ? uniqueSorted(rows.map((row) => row.verification_status))
        : DEFAULT_LISTS.verification_status,
      team_members: uniqueSorted(rows.map((row) => row.added_by)),
      languages: uniqueSorted(rows.map((row) => row.languages)),
    };

    return Response.json({ lists });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
