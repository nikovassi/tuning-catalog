"""Генерира public/og-image.png (1200x630). Пуснете отново след смяна на името: python3 scripts/og-image.py "Име"."""
import math, sys
from PIL import Image, ImageDraw, ImageFont

name = sys.argv[1] if len(sys.argv) > 1 else 'Tuning Catalog'
W, H = 1200, 630
img = Image.new('RGB', (W, H), (11, 12, 14))
d = ImageDraw.Draw(img)
for x in range(0, W, 48): d.line([(x, 0), (x, H)], fill=(22, 24, 27))
for y in range(0, H, 48): d.line([(0, y), (W, y)], fill=(22, 24, 27))
cx, cy = 930, 315
for r, w, c in [(250, 2, (70, 74, 80)), (215, 3, (150, 155, 162)), (140, 1, (80, 84, 90)), (60, 3, (200, 204, 210))]:
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=c, width=w)
for k in range(5):
    a = math.radians(k * 72 - 90)
    d.line([(cx + 64 * math.cos(a), cy + 64 * math.sin(a)), (cx + 205 * math.cos(a), cy + 205 * math.sin(a))], fill=(170, 174, 180), width=6)
d.arc([cx - 180, cy - 180, cx + 180, cy + 180], 200, 250, fill=(249, 115, 22), width=30)
bold = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
reg = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
d.ellipse([80, 120, 92, 132], fill=(249, 115, 22))
d.text((106, 113), 'ТУНИНГ ПРОДУКТИ И АКСЕСОАРИ', font=ImageFont.truetype(bold, 22), fill=(158, 163, 171))
d.text((78, 200), name, font=ImageFont.truetype(bold, 84), fill=(236, 237, 239))
d.text((80, 320), 'Прецизен тунинг.', font=ImageFont.truetype(reg, 44), fill=(236, 237, 239))
d.text((80, 375), 'Подреден каталог.', font=ImageFont.truetype(reg, 44), fill=(120, 125, 133))
img.save('public/og-image.png', optimize=True)
