"""Сваля снимките на продуктите (оригиналния източник) и ги записва като WebP в public/products/<slug>/.
Употреба: python3 scripts/import-images.py scripts/product-images.json"""
import io, json, os, sys, urllib.request
from PIL import Image

src = json.load(open(sys.argv[1]))
for slug, urls in src.items():
    out = os.path.join('public', 'products', slug)
    os.makedirs(out, exist_ok=True)
    for i, u in enumerate(urls, 1):
        dst = os.path.join(out, f'{i:02d}.webp')
        if os.path.exists(dst):
            continue
        req = urllib.request.Request(u + ';s=1600x1200', headers={'User-Agent': 'Mozilla/5.0'})
        im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert('RGB')
        im.thumbnail((1200, 1200))
        im.save(dst, 'WEBP', quality=82, method=6)
        print(dst, im.size)
