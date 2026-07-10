import {
  ADMIN_EDITABLE_MEMBER_FIELDS,
  LOCKED_MEMBER_FIELDS,
  isAdminEditableMemberField,
  isLockedMemberField,
  sanitizeMemberUpdatePayload,
} from "@/lib/hpdki/member-data-structure";

export type HpdkiMemberUpdatePayload = Record<string, unknown>;

export function buildSafeHpdkiMemberUpdatePayload(
  payload: HpdkiMemberUpdatePayload,
) {
  return sanitizeMemberUpdatePayload(payload);
}

export function getRejectedHpdkiMemberUpdateFields(
  payload: HpdkiMemberUpdatePayload,
) {
  return Object.keys(payload).filter((fieldName) => {
    return !isAdminEditableMemberField(fieldName);
  });
}

export function getLockedHpdkiMemberUpdateFields(
  payload: HpdkiMemberUpdatePayload,
) {
  return Object.keys(payload).filter((fieldName) => {
    return isLockedMemberField(fieldName);
  });
}

export function assertSafeHpdkiMemberUpdatePayload(
  payload: HpdkiMemberUpdatePayload,
) {
  const lockedFields = getLockedHpdkiMemberUpdateFields(payload);

  if (lockedFields.length > 0) {
    throw new Error(
      `Field anggota tidak boleh diubah: ${lockedFields.join(", ")}`,
    );
  }

  return buildSafeHpdkiMemberUpdatePayload(payload);
}

export const HPDKI_MEMBER_UPDATE_FIELD_RULES = {
  lockedFields: LOCKED_MEMBER_FIELDS,
  editableFields: ADMIN_EDITABLE_MEMBER_FIELDS,
} as const;
