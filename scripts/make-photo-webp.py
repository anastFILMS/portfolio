#!/usr/bin/env python3
"""
Web-копии фотографий для сайта.

Оригиналы (2048 px, до 5 МБ каждый) лежат в assets-source/photos/ и в сборку
не идут: страница показывает их максимум в половину своей ширины, а вес
тянул бы загрузку. Здесь из них делаются WebP до 1600 px по длинной стороне.

Оригиналы не трогаются. Запускать после замены исходников:
    python3 scripts/make-photo-webp.py
"""
import glob
import os

from PIL import Image

SRC = 'assets-source/photos'
OUT = 'public/media/about'
MAX_SIDE = 1600
QUALITY = 82


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    for path in sorted(glob.glob(f'{SRC}/*')):
        if path.lower().endswith('.md'):
            continue
        im = Image.open(path).convert('RGB')
        w, h = im.size
        k = MAX_SIDE / max(w, h)
        if k < 1:
            im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
        name = os.path.splitext(os.path.basename(path))[0] + '.webp'
        dst = os.path.join(OUT, name)
        im.save(dst, 'WEBP', quality=QUALITY, method=6)
        print(f'{name:38} {im.size[0]}×{im.size[1]}  {os.path.getsize(dst) // 1024} КБ')


if __name__ == '__main__':
    main()
