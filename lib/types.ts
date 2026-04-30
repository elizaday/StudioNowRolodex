export type TalentRecord = {
  record_id: string | null;
  display_name: string | null;
  primary_role: string | null;
  secondary_roles: string | string[] | null;
  location_search: string | null;
  location_city: string | null;
  location_state_province: string | null;
  location_country: string | null;
  budget_tier: string | null;
  review_label: string | null;
  worked_with_us: string | boolean | null;
  email: string | null;
  phone: string | null;
  portfolio_url: string | null;
  website_url: string | null;
  specialty_tags: string | null;
  summary: string | null;
  notes: string | null;
};

/** Full talent row — superset of search-card fields, used by the edit page. */
export type TalentRecordFull = TalentRecord & {
  active: string | null;
  approval_status: string | null;
  record_type: string | null;
  company_name: string | null;
  contact_name: string | null;
  social_url: string | null;
  address: string | null;
  languages: string | null;
  rate_min: number | null;
  rate_max: number | null;
  rate_currency: string | null;
  rate_basis: string | null;
  review_score: number | null;
  recommended_by: string | null;
  source_or_referral: string | null;
  last_worked_date: string | null;
  last_project: string | null;
  gear_notes: string | null;
  notes: string | null;
  source_sheet: string | null;
  date_added: string | null;
  added_by: string | null;
  last_verified_date: string | null;
  verification_status: string | null;
};

export type ParsedFilters = {
  roles: string[];
  locations: string[];
  budgetTiers: string[];
  minReviewScore: number | null;
  workedWithUs: "Yes" | "No" | null;
  keywords: string[];
};

export type TalentDatabase = {
  public: {
    Tables: {
      talent: {
        Row: TalentRecordFull;
        Insert: Partial<TalentRecordFull>;
        Update: Partial<TalentRecordFull>;
      };
      StudioNowRolo: {
        Row: TalentRecordFull;
        Insert: Partial<TalentRecordFull>;
        Update: Partial<TalentRecordFull>;
      };
    };
  };
};

export type ListsData = {
  record_type: string[];
  approval_status: string[];
  active: string[];
  primary_role: string[];
  review_label: string[];
  review_label_map: string[];
  review_score_map: number[];
  rate_currency: string[];
  rate_basis: string[];
  budget_tier: string[];
  worked_with_us: string[];
  verification_status: string[];
  team_members: string[];
  languages: string[];
};

export type ListsFile = {
  lists: ListsData;
  review_label_to_score: Record<string, number>;
};
