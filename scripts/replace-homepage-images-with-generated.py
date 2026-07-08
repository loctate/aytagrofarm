from pathlib import Path
import re
import sys

PAGE = Path("src/app/page.tsx")
NEW_IMAGE = "/images/ayt-home-logo-generated.png"

if not PAGE.exists():
    print("ERROR: src/app/page.tsx tidak ditemukan")
    sys.exit(1)

text = PAGE.read_text(encoding="utf-8")
original = text

IMG_RE = re.compile(r'(["\'`])(/images/[^"\'`]+\.(?:png|jpg|jpeg|webp|avif))\1')

def extract_object_by_title(source: str, title: str):
    idx = source.find(title)
    if idx == -1:
        return None, None, None

    start = source.rfind("{", 0, idx)
    end = source.find("}", idx)

    if start == -1 or end == -1:
        return None, None, None

    return start, end + 1, source[start:end + 1]

def replace_first_image_in_title_block(source: str, title: str, new_image: str):
    start, end, block = extract_object_by_title(source, title)
    if not block:
        return source, False

    new_block, count = IMG_RE.subn(lambda m: f'{m.group(1)}{new_image}{m.group(1)}', block, count=1)
    if count == 0:
        return source, False

    source = source[:start] + new_block + source[end:]
    return source, True

# 1) ganti semua path hero lama / path hasil sementara sebelumnya ke image generated baru
old_candidates = [
    "/images/hero-ayt-agro-farm.jpg",
    "/images/hero-farm.jpg",
    "/images/gallery-kandang.jpg",
]

for old in old_candidates:
    text = text.replace(old, NEW_IMAGE)

# 2) ganti card artikel 1
text, ok1 = replace_first_image_in_title_block(
    text,
    "Tips Memilih Kambing dan Domba yang Sehat",
    NEW_IMAGE
)

# 3) ganti card artikel 3
text, ok3 = replace_first_image_in_title_block(
    text,
    "Menjaga Kandang Tetap Bersih dan Nyaman",
    NEW_IMAGE
)

if text == original:
    print("Tidak ada perubahan pada src/app/page.tsx")
else:
    PAGE.write_text(text, encoding="utf-8")
    print("OK: src/app/page.tsx berhasil diupdate")

print("")
print("Status update:")
print(f"- Card artikel 1: {'OK' if ok1 else 'TIDAK DITEMUKAN'}")
print(f"- Card artikel 3: {'OK' if ok3 else 'TIDAK DITEMUKAN'}")
print("")
print("Silakan cek dengan:")
print("  npm run dev")
