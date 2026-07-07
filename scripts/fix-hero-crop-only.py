from pathlib import Path
import re
import sys

PAGE = Path("src/app/page.tsx")

if not PAGE.exists():
    print("ERROR: src/app/page.tsx tidak ditemukan")
    sys.exit(1)

text = PAGE.read_text(encoding="utf-8")
original = text

hero_start = text.find("Temukan Kambing")
if hero_start == -1:
    print("ERROR: Tidak menemukan section hero (Temukan Kambing)")
    sys.exit(1)

# Ambil area hero saja agar perubahan tidak menyentuh kolom tips
window_size = 7000
hero_chunk = text[hero_start:hero_start + window_size]
hero_original = hero_chunk

# 1) Paksa hero memakai image generated yang sudah dipakai
#    Kalau file ini memang sudah ada di public/images, maka aman.
hero_chunk = re.sub(
    r'(["\'`])\/images\/[^"\'`]+\.(png|jpg|jpeg|webp|avif)\1',
    r'\1/images/ayt-home-logo-generated.png\1',
    hero_chunk,
    count=1
)

# 2) Perbaiki crop hero:
#    - tetap object-cover
#    - fokus lebih ke kanan-atas agar kandang dan logo terlihat
#    - hapus object-position lama jika ada
hero_chunk = re.sub(
    r'object-cover(?:\s+object-\[[^\]]+\])?',
    'object-cover object-[72%_18%]',
    hero_chunk,
    count=1
)

# 3) Kalau ada wrapper image hero dengan aspect ratio terlalu sempit,
#    coba jaga agar tetap landscape lebar
hero_chunk = hero_chunk.replace("aspect-[4/5]", "aspect-[4/3]")
hero_chunk = hero_chunk.replace("aspect-[1/1]", "aspect-[4/3]")
hero_chunk = hero_chunk.replace("aspect-square", "aspect-[4/3]")

if hero_chunk == hero_original:
    print("WARNING: Tidak ada perubahan yang diterapkan pada block hero.")
else:
    text = text[:hero_start] + hero_chunk + text[hero_start + window_size:]
    PAGE.write_text(text, encoding="utf-8")
    print("OK: Hero section di src/app/page.tsx berhasil diperbaiki.")

print("")
print("Silakan cek hasil dengan:")
print("  npm run dev")
print("")
print("Kalau crop masih kurang pas, nanti kita tweak angka:")
print('  object-[72%_18%]')
print("Angka pertama = geser kiri/kanan, angka kedua = geser atas/bawah.")
