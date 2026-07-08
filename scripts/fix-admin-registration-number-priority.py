from pathlib import Path
import re
import sys

ADMIN = Path("src/app/admin/page.tsx")

if not ADMIN.exists():
    print("ERROR: src/app/admin/page.tsx tidak ditemukan")
    sys.exit(1)

text = ADMIN.read_text(encoding="utf-8")
original = text

helper = '''
function getRegistrationOfficialNumber(registration: HpdkiRegistrationRecord) {
  return registration.member_data_number || registration.registration_number;
}
'''

if "function getRegistrationOfficialNumber" not in text:
    # letakkan helper sebelum export default / function utama
    marker_options = [
        "export default function",
        "function Admin",
        "const Admin",
    ]

    insert_at = -1
    for marker in marker_options:
        pos = text.find(marker)
        if pos != -1:
            insert_at = pos
            break

    if insert_at == -1:
        # fallback: setelah import terakhir
        import_matches = list(re.finditer(r"^import .+;$", text, flags=re.MULTILINE))
        if import_matches:
            insert_at = import_matches[-1].end() + 1
        else:
            insert_at = 0

    text = text[:insert_at] + helper + "\n" + text[insert_at:]

# Search/filter: jangan hanya cari registration_number, tambahkan nomor resmi juga
text = text.replace(
    "item.registration_number,",
    "getRegistrationOfficialNumber(item),\n        item.registration_number,"
)

# Tampilan list pendaftaran: nomor di bawah nama
text = text.replace(
    "{item.registration_number}",
    "{getRegistrationOfficialNumber(item)}"
)

# Detail/modal pendaftaran
text = text.replace(
    "{selectedRegistration.registration_number}",
    "{getRegistrationOfficialNumber(selectedRegistration)}"
)

# Kalimat alert/detail yang masih pakai nomor lama
text = text.replace(
    "`${registration.registration_number}.`",
    "`${getRegistrationOfficialNumber(registration)}.`"
)

# Fallback kalau ada template literal lain
text = text.replace(
    "${registration.registration_number}",
    "${getRegistrationOfficialNumber(registration)}"
)

text = text.replace(
    "${selectedRegistration.registration_number}",
    "${getRegistrationOfficialNumber(selectedRegistration)}"
)

if text == original:
    print("Tidak ada perubahan. Struktur file mungkin berbeda dari asumsi patch.")
else:
    ADMIN.write_text(text, encoding="utf-8")
    print("OK: Admin dashboard sekarang mengutamakan member_data_number sebagai nomor resmi.")

print("")
print("Cek sisa penggunaan registration_number:")
print('  rg -n "registration_number|member_data_number|getRegistrationOfficialNumber" src/app/admin/page.tsx')
