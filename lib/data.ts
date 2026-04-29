import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_PATH = path.join(DATA_DIR, "submissions.json");

export type Submission = {
  record_id: string;
  active?: string;
  approval_status?: string;
  submission_status?: "Pending" | "Approved" | "Rejected";
  submission_timestamp?: string;
  record_type?: string;
  primary_role?: string;
  secondary_roles?: string | null;
  company_name?: string | null;
  contact_name?: string | null;
  display_name?: string | null;
  email?: string | null;
  phone?: string | null;
  website_url?: string | null;
  portfolio_url?: string | null;
  social_url?: string | null;
  address?: string | null;
  location_city?: string | null;
  location_state_province?: string | null;
  location_country?: string | null;
  location_search?: string | null;
  languages?: string | null;
  specialty_tags?: string | null;
  rate_min?: number | null;
  rate_max?: number | null;
  rate_currency?: string | null;
  rate_basis?: string | null;
  budget_tier?: string | null;
  review_label?: string | null;
  review_score?: number | null;
  recommended_by?: string | null;
  source_or_referral?: string | null;
  worked_with_us?: string | null;
  summary?: string | null;
  notes?: string | null;
  source_sheet?: string | null;
  date_added?: string | null;
  added_by?: string | null;
  verification_status?: string | null;
  /** Set when an Approved submission is written to Supabase. Its new TAL-xxxx id. */
  promoted_record_id?: string | null;
};

export function readSubmissions(): Submission[] {
  if (!fs.existsSync(SUBMISSIONS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(SUBMISSIONS_PATH, "utf-8")) as Submission[];
  } catch {
    return [];
  }
}

export function writeSubmissions(subs: Submission[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(subs, null, 2));
}
