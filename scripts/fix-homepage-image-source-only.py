from pathlib import Path
import re
import sys

PAGE = Path("src/app/page.tsx")

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

def first_image_in_block(block: str):
    m = IMG_RE.search(block)
    return m.group(2) if m else None

# Ambil gambar yang sudah bersih dari card pertama.
# Kalau tidak ketemu, fallback ke card kedua.
safe_titles = [
    "Tips Memilih Kambing dan Domba yang Sehat",
    "Hal Penting Saat Memilih Bakalan Penggemukan",
]

safe_image = None
safe_from_title = None

for title in safe_titles:
    s, e, block = extract_object_by_title(text, title)
    if block:
        img = first_image_in_block(block)
        if img:
            safe_image = img
            safe_from_title = title
            break

if not safe_image:
    print("ERROR: Tidak menemukan image source yang aman dari card artikel.")
    print("Jalankan:")
    print('  sed -n "220,280p" src/app/page.tsx')
    sys.exit(1)

print(f"Safe image dipakai dari: {safe_from_title}")
print(f"Safe image path: {safe_image}")

# Ganti image card 'Menjaga Kandang...' agar tidak pakai gambar logo salah/double logo
target_title = "Menjaga Kandang Tetap Bersih dan Nyaman"
s, e, block = extract_object_by_title(text, target_title)

if not block:
    print(f"ERROR: Tidak menemukan block card: {target_title}")
    sys.exit(1)

new_block, n = IMG_RE.subn(lambda m: f'{m.group(1)}{safe_image}{m.group(1)}', block, count=1)

if n == 0:
    print("ERROR: Tidak menemukan image path di block Menjaga Kandang.")
    sys.exit(1)

text = text[:s] + new_block + text[e:]

# Ganti hero image yang memakai asset kandang/logo salah
broken_images = [
    "/images/hero-ayt-agro-farm.jpg",
    "/images/hero-farm.jpg",
    "/images/gallery-kandang.jpg",
]

for img in broken_images:
    text = text.replace(img, safe_image)

if text == original:
    print("Tidak ada perubahan pada page.tsx")
else:
    PAGE.write_text(text, encoding="utf-8")
    print("OK: src/app/page.tsx sudah diperbaiki source image-nya.")

print("")
print("Cek perubahan:")
print('  rg -n "/images/|Temukan Kambing|Menjaga Kandang|Hal Penting|Tips Memilih" src/app/page.tsx')
