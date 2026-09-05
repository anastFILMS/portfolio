#!/usr/bin/env python3
"""
Подготовка камеры для титульника: вырезание фона + fish eye 0.5×.

Фон снимается заливкой от краёв, а не порогом по яркости: на корпусе есть
белые надписи («α», «Cinema Line», REC) и светлые блики — глобальный порог
выел бы их вместе с фоном.

Дисторсия считается обратным отображением: для каждого пикселя результата
ищем источник в оригинале. Прямое отображение оставляет дыры.
"""
from PIL import Image, ImageFilter
from collections import deque
import sys, os

STRENGTH = 0.14   # сила бочки; 0.38 раздувало центр так, что камера не читалась целиком
TOL = 26          # допуск заливки по яркости


def cut_background(img):
    """Заливка от краёв: убираем только фон, связный с рамкой кадра."""
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    q = deque()

    def light(x, y):
        r, g, b, _ = px[x, y]
        return r > 255 - TOL and g > 255 - TOL and b > 255 - TOL

    for x in range(w):
        for y in (0, h - 1):
            if light(x, y) and not seen[y * w + x]:
                seen[y * w + x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if light(x, y) and not seen[y * w + x]:
                seen[y * w + x] = 1; q.append((x, y))

    while q:
        x, y = q.popleft()
        px[x, y] = (255, 255, 255, 0)
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and light(nx, ny):
                seen[ny * w + nx] = 1
                q.append((nx, ny))
    return img


def trim(img):
    box = img.split()[3].getbbox()
    return img.crop(box) if box else img


def barrel(img, strength=STRENGTH):
    """Бочка: центр выпирает, края заваливаются — как на 0.5×."""
    w, h = img.size
    src = img.load()
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dst = out.load()
    cx, cy = w / 2, h / 2
    norm = min(cx, cy)
    for y in range(h):
        dy = (y - cy) / norm
        for x in range(w):
            dx = (x - cx) / norm
            k = 1 / (1 + strength * (dx * dx + dy * dy))
            sx, sy = int(cx + dx * norm * k), int(cy + dy * norm * k)
            if 0 <= sx < w and 0 <= sy < h:
                dst[x, y] = src[sx, sy]
    return out


def main():
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "public/media/camera.webp"
    img = Image.open(src)
    img.thumbnail((1500, 1500), Image.LANCZOS)
    img = trim(cut_background(img))
    # Поле вокруг: бочка тянет пиксели к центру, без запаса края обрежутся.
    pad = Image.new("RGBA", (int(img.width * 1.35), int(img.height * 1.35)), (0, 0, 0, 0))
    pad.paste(img, ((pad.width - img.width) // 2, (pad.height - img.height) // 2))
    img = trim(barrel(pad))
    img = img.filter(ImageFilter.SMOOTH)
    img.thumbnail((1200, 1200), Image.LANCZOS)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    # WebP с альфой: PNG-фото с прозрачностью весит мегабайты, для титульника
    # это неприемлемо, а WebP держат все актуальные браузеры.
    img.save(out, quality=86, method=6)
    print(f"{out}: {img.size[0]}x{img.size[1]}, {os.path.getsize(out) // 1024} КБ")


if __name__ == "__main__":
    main()
