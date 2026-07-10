export const HPDKI_MEMBER_NUMBER_PREFIX = "HPDKI-PAC-DRAMAGA";

export const HPDKI_MEMBER_DATA_TABLES = {
  registrations: "hpdki_registrations",
  members: "hpdki_members",
  memberEvaluations: "hpdki_member_evaluations",
  memberVisits: "hpdki_member_visits",
  cardSettings: "hpdki_card_settings",
} as const;

export const LOCKED_MEMBER_FIELDS = [
  "$id",
  "document_id",
  "member_number",
  "registration_number",
  "member_data_number",
  "member_year",
  "member_sequence",
  "approved_at",
  "created_at",
] as const;

export const ADMIN_EDITABLE_MEMBER_FIELDS = [
  "farmer_name",
  "phone",
  "farm_group_name",
  "village",
  "district",
  "regency",
  "province",
  "address",
  "livestock_type",
  "female_count",
  "male_count",
  "total_livestock_count",
  "cage_ownership",
  "farm_location",
  "membership_status",
  "inactive_reason",
  "admin_notes",
  "is_public",
  "updated_at",
] as const;

export const MEMBER_EVALUATION_FIELDS = [
  "member_id",
  "member_number",
  "evaluation_date",
  "female_count",
  "male_count",
  "total_livestock_count",
  "livestock_condition",
  "cage_condition",
  "feed_notes",
  "health_notes",
  "business_notes",
  "admin_notes",
  "created_by",
  "created_at",
  "updated_at",
] as const;

export const MEMBER_VISIT_FIELDS = [
  "member_id",
  "member_number",
  "visit_date",
  "visitor_name",
  "location",
  "purpose",
  "findings",
  "follow_up",
  "photo_url",
  "admin_notes",
  "created_by",
  "created_at",
  "updated_at",
] as const;

export type HpdkiMembershipStatus = "active" | "inactive";

export type HpdkiMemberEvaluationStatus =
  | "baik"
  | "perlu_pembinaan"
  | "perlu_kunjungan_lanjutan";

export type HpdkiMemberVisitPurpose =
  | "pendataan"
  | "evaluasi"
  | "pembinaan"
  | "verifikasi"
  | "lainnya";

export function isLockedMemberField(fieldName: string) {
  return (LOCKED_MEMBER_FIELDS as readonly string[]).includes(fieldName);
}

export function isAdminEditableMemberField(fieldName: string) {
  return (ADMIN_EDITABLE_MEMBER_FIELDS as readonly string[]).includes(fieldName);
}

export function extractMemberSequence(memberNumber: string | null | undefined) {
  if (!memberNumber) {
    return 0;
  }

  const parts = memberNumber.split("-");
  const lastPart = parts[parts.length - 1];
  const sequence = Number.parseInt(lastPart ?? "", 10);

  return Number.isNaN(sequence) ? 0 : sequence;
}

export function extractMemberYear(memberNumber: string | null | undefined) {
  if (!memberNumber) {
    return 0;
  }

  const match = memberNumber.match(/(20\d{2})/);
  if (!match) {
    return 0;
  }

  const year = Number.parseInt(match[1], 10);
  return Number.isNaN(year) ? 0 : year;
}

export function compareHpdkiMemberNumbers(
  firstMemberNumber: string | null | undefined,
  secondMemberNumber: string | null | undefined,
) {
  const firstYear = extractMemberYear(firstMemberNumber);
  const secondYear = extractMemberYear(secondMemberNumber);

  if (firstYear !== secondYear) {
    return firstYear - secondYear;
  }

  return (
    extractMemberSequence(firstMemberNumber) -
    extractMemberSequence(secondMemberNumber)
  );
}

export function normalizeHpdkiMemberNumberSequence(sequence: number) {
  return String(sequence).padStart(3, "0");
}

export function buildHpdkiMemberNumber(year: number, sequence: number) {
  return `${HPDKI_MEMBER_NUMBER_PREFIX}-${year}-${normalizeHpdkiMemberNumberSequence(
    sequence,
  )}`;
}

export function sanitizeMemberUpdatePayload<T extends Record<string, unknown>>(
  payload: T,
) {
  const sanitizedPayload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (isAdminEditableMemberField(key)) {
      sanitizedPayload[key] = value;
    }
  }

  return sanitizedPayload;
}
