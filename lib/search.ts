import type { ParsedFilters, TalentRecord } from "./types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "any",
  "are",
  "affordable",
  "best",
  "before",
  "budget",
  "can",
  "cheap",
  "cost",
  "expensive",
  "for",
  "find",
  "good",
  "great",
  "have",
  "haven",
  "high",
  "in",
  "known",
  "low",
  "me",
  "mid",
  "near",
  "need",
  "new",
  "not",
  "of",
  "or",
  "our",
  "premium",
  "rated",
  "show",
  "solid",
  "the",
  "tier",
  "to",
  "top",
  "us",
  "used",
  "with",
  "who",
  "worked",
]);

const ROLE_ALIASES: Record<string, string[]> = {
  cinematographer: ["director of photography", "dp", "cinematographer"],
  dp: ["director of photography", "dp", "cinematographer"],
  dop: ["director of photography", "dp", "cinematographer"],
  editor: ["editor", "post producer"],
  photographer: ["photographer", "photo"],
  photog: ["photographer", "photo"],
  producer: ["producer"],
  director: ["director"],
  "camera op": ["camera operator"],
  "camera operator": ["camera operator"],
  makeup: ["hair and makeup", "hair & makeup", "makeup"],
  "makeup artist": ["hair and makeup", "hair & makeup", "makeup"],
};

const REVIEW_SCORE_BY_LABEL: Record<string, number> = {
  exceptional: 5,
  great: 4,
  good: 3,
  solid: 3,
  "to try": 2,
  unknown: 1,
  "not a fit": 0,
};

function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function asList(value: string | string[] | null): string[] {
  if (Array.isArray(value)) return value;
  return String(value ?? "")
    .split(/[,;/|]|\sand\s/gi)
    .map((item) => item.trim())
    .filter(Boolean);
}

function includesTerm(haystack: string, needle: string): boolean {
  const normalizedNeedle = normalize(needle);
  return !!normalizedNeedle && haystack.includes(normalizedNeedle);
}

function collectRoles(records: TalentRecord[]): string[] {
  return unique(
    records.flatMap((record) => [
      record.primary_role ?? "",
      ...asList(record.secondary_roles),
    ]),
  ).sort((a, b) => b.length - a.length);
}

/** Derive a clean location string, falling back to city/state/country parts. */
export function resolvedLocation(record: TalentRecord): string {
  const raw = record.location_search;
  if (raw && raw !== "#NAME?") return raw;
  return [
    record.location_city,
    record.location_state_province,
    record.location_country,
  ]
    .map((p) => (p ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

function collectLocations(records: TalentRecord[]): string[] {
  return unique(
    records.flatMap((record) => {
      const full = resolvedLocation(record);
      return [full, ...full.split(",").map((part) => part.trim())];
    }),
  )
    .filter((location) => normalize(location).length >= 2)
    .sort((a, b) => b.length - a.length);
}

function parseBudgetTiers(query: string): string[] {
  const tiers = new Set<string>();

  if (/\b(cheap|affordable|budget|low cost|low-cost)\b/.test(query)) {
    tiers.add("Low");
    tiers.add("Mid");
  }
  if (/\blow\b/.test(query)) tiers.add("Low");
  if (/\b(mid|middle|mid range|mid-range)\b/.test(query)) tiers.add("Mid");
  if (
    /\b(high|premium|expensive|top tier|top-tier|high end|high-end)\b/.test(
      query,
    )
  ) {
    tiers.add("High");
    tiers.add("Premium");
  }

  return Array.from(tiers);
}

function parseMinReviewScore(query: string): number | null {
  if (/\b(exceptional|a list|a-list)\b/.test(query)) return 5;
  if (/\b(best|top rated|top-rated|great|top)\b/.test(query)) return 4;
  if (/\b(good|solid)\b/.test(query)) return 3;
  return null;
}

function parseWorkedWithUs(query: string): ParsedFilters["workedWithUs"] {
  if (
    /\b(new to us|not worked|haven t worked|haven't worked|never used)\b/.test(
      query,
    )
  ) {
    return "No";
  }
  if (
    /\b(worked with us|worked with|used before|known talent|our talent)\b/.test(
      query,
    )
  ) {
    return "Yes";
  }
  return null;
}

function parseRoles(query: string, records: TalentRecord[]): string[] {
  const queryText = normalize(query);
  const roles = new Set<string>();

  for (const role of collectRoles(records)) {
    if (includesTerm(queryText, role)) roles.add(role);
  }

  for (const [alias, targets] of Object.entries(ROLE_ALIASES)) {
    if (!includesTerm(queryText, alias)) continue;
    for (const target of targets) roles.add(target);
  }

  return Array.from(roles);
}

function parseLocations(query: string, records: TalentRecord[]): string[] {
  const queryText = normalize(query);
  return collectLocations(records).filter((location) =>
    includesTerm(queryText, location),
  );
}

function parseKeywords(
  query: string,
  filters: Omit<ParsedFilters, "keywords">,
): string[] {
  const filterTerms = [
    ...filters.roles,
    ...filters.locations,
    ...filters.budgetTiers,
    filters.workedWithUs ?? "",
  ].map(normalize);

  return unique(
    normalize(query)
      .split(" ")
      .filter((word) => word.length > 2)
      .filter((word) => !STOP_WORDS.has(word))
      .filter((word) => !filterTerms.some((term) => term.includes(word))),
  );
}

export function parseTalentSearch(
  query: string,
  records: TalentRecord[],
): ParsedFilters {
  const normalizedQuery = normalize(query);
  const withoutKeywords = {
    roles: parseRoles(normalizedQuery, records),
    locations: parseLocations(normalizedQuery, records),
    budgetTiers: parseBudgetTiers(normalizedQuery),
    minReviewScore: parseMinReviewScore(normalizedQuery),
    workedWithUs: parseWorkedWithUs(normalizedQuery),
  };

  return {
    ...withoutKeywords,
    keywords: parseKeywords(normalizedQuery, withoutKeywords),
  };
}

function reviewScore(label: string | null): number {
  return REVIEW_SCORE_BY_LABEL[normalize(label)] ?? 1;
}

function workedValue(
  value: TalentRecord["worked_with_us"],
): "Yes" | "No" | null {
  const normalized = normalize(value);
  if (value === true || normalized === "yes" || normalized === "true") {
    return "Yes";
  }
  if (value === false || normalized === "no" || normalized === "false") {
    return "No";
  }
  return null;
}

function roleMatches(record: TalentRecord, roles: string[]): boolean {
  if (roles.length === 0) return true;
  const roleText = normalize(
    [record.primary_role, ...asList(record.secondary_roles)].join(" "),
  );
  return roles.some((role) => roleText.includes(normalize(role)));
}

function locationMatches(record: TalentRecord, locations: string[]): boolean {
  if (locations.length === 0) return true;
  const locationText = normalize(resolvedLocation(record));
  return locations.some((location) => locationText.includes(normalize(location)));
}

function budgetMatches(record: TalentRecord, budgetTiers: string[]): boolean {
  if (budgetTiers.length === 0) return true;
  return budgetTiers.some(
    (tier) => normalize(record.budget_tier) === normalize(tier),
  );
}

function reviewMatches(record: TalentRecord, minReviewScore: number | null): boolean {
  if (minReviewScore == null) return true;
  return reviewScore(record.review_label) >= minReviewScore;
}

function workedMatches(
  record: TalentRecord,
  workedWithUs: ParsedFilters["workedWithUs"],
): boolean {
  if (!workedWithUs) return true;
  return workedValue(record.worked_with_us) === workedWithUs;
}

function keywordMatches(record: TalentRecord, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const haystack = normalize(
    [
      record.display_name,
      record.primary_role,
      ...asList(record.secondary_roles),
      record.location_search,
      record.budget_tier,
      record.review_label,
      record.summary,
      record.notes,
    ].join(" "),
  );
  return keywords.every((keyword) => haystack.includes(normalize(keyword)));
}

/**
 * Sort key: last token of display_name, lowercased. For single-word names
 * (companies, mononyms), falls back to the full name. Stable for sort.
 */
function lastNameKey(record: TalentRecord): string {
  const name = String(record.display_name ?? "").trim();
  if (!name) return "\uffff"; // push blanks to the end
  const tokens = name.split(/\s+/);
  return (tokens.length > 1 ? tokens[tokens.length - 1] : name).toLowerCase();
}

export function filterTalent(
  records: TalentRecord[],
  filters: ParsedFilters,
): TalentRecord[] {
  return records
    .filter(
      (record) =>
        roleMatches(record, filters.roles) &&
        locationMatches(record, filters.locations) &&
        budgetMatches(record, filters.budgetTiers) &&
        reviewMatches(record, filters.minReviewScore) &&
        workedMatches(record, filters.workedWithUs) &&
        keywordMatches(record, filters.keywords),
    )
    .sort((a, b) => {
      // Alphabetical by last name. Tiebreak on full display_name for stability.
      const delta = lastNameKey(a).localeCompare(lastNameKey(b));
      if (delta !== 0) return delta;
      return String(a.display_name ?? "").localeCompare(
        String(b.display_name ?? ""),
      );
    });
}
