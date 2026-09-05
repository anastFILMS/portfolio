#!/usr/bin/env python3
"""
Подготовка камеры для первого экрана: вырезание фона + fish eye 0.5×.

Исходник — фото камеры на белом фоне. Скрипт убирает фон, применяет
бочкообразную дисторсию (как на сверхширокий объектив 0.5×) и сохраняет
PNG с прозрачностью в public/media/camera.png.

Дисторсия считается обратным отображением: для каждого пикселя результата
ищем, откуда его взять в исходнике. Прямое отображение оставляет дыры.

Запуск:  python3 scripts/fisheye.py путь/к/камере.jpg
"""
import sys, os
from PIL import Image

STRENGTH = 0.35   # сила бочки: 0 — плоско, 0.5 — заметный fish eye
OUT = "public/media/camera.png"


def cut_white(img, thr=238):
    """Убирает белый фон. Порог мягкий — у камеры есть светлые блики."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > thr and g > thr and b > thr:
                px[x, y] = (r, g, b, 0)
    return img


def barrel(img, strength=STRENGTH):
    """Бочкообразная дисторсия: центр выпирает, края заваливаются."""
    w, h = img.size
    src = img.load()
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dst = out.load()
    cx, cy = w / 2, h / 2
    norm = min(cx, cy)
    for y in range(h):
        for x in range(w):
            dx, dy = (x - cx) / norm, (y - cy) / norm
            r2 = dx * dx + dy * dy
            # Обратное отображение: сжимаем радиус, чтобы центр «раздулся».
            k = 1 / (1 + strength * r2)
            sx, sy = int(cx + dx * norm * k), int(cy + dy * norm * k)
            if 0 <= sx < w and 0 <= sy < h:
                dst[x, y] = src[sx, sy]
    return out


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    img = Image.open(sys.argv[1])
    img.thumbnail((1400, 1400), Image.LANCZOS)
    img = barrel(cut_white(img))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.save(OUT, optimize=True)
    print(f"{OUT}: {img.size[0]}x{img.size[1]}, {os.path.getsize(OUT) // 1024} КБ")


if __name__ == "__main__":
    main()
