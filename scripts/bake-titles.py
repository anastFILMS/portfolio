#!/usr/bin/env python3
"""
Запекание надписей титульника в PNG.

Живой текст в шрифте тащит за собой межстрочные интервалы и боковые
свесы глифов: реальные границы слова не совпадают с рамкой элемента, и
позиционировать надпись по макету неудобно. Запечённый PNG обрезан ровно
по краске, поэтому кладётся куда угодно с точностью до пикселя.

Заодно на надпись накладывается плёночное зерно — по краям буквы получают
неровность, которой у чистого шрифта нет.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, random

FONT = "/root/.claude/uploads/460ea7c9-eaa0-51cd-9b30-c874aca3ef85/cddc3976-Splatink.ttf"
OUT = "public/media/titles"
SIZE = 460          # кегль отрисовки; на экране слово всё равно масштабируется
WORDS = {"anastasia": ("Anastasia", (233, 225, 210)),
         "brichko":   ("Brichko",   (245, 79, 27))}


def add_drips(img, color, rnd, count=9):
    """
    Потёки краски от нижнего края букв.

    Точки старта ищем по самому нижнему непрозрачному пикселю в колонке —
    так потёк всегда начинается от реальной кромки глифа, а не от рамки
    картинки. Ширина берётся от кегля, длина случайная, на конце капля.
    """
    w, h = img.size
    alpha = img.split()[3]
    px = alpha.load()

    # Нижняя кромка краски в каждой колонке.
    bottoms = {}
    for x in range(0, w, 3):
        for y in range(h - 1, -1, -1):
            if px[x, y] > 140:
                bottoms[x] = y
                break
    if not bottoms:
        return img

    # Запас снизу под сами потёки.
    pad = int(h * 0.55)
    out = Image.new("RGBA", (w, h + pad), (0, 0, 0, 0))
    out.paste(img, (0, 0))
    d = ImageDraw.Draw(out)

    cols = sorted(bottoms)
    picked = rnd.sample(cols, min(count, len(cols)))
    for x in picked:
        y0 = bottoms[x]
        length = int(h * rnd.uniform(0.12, 0.5))
        # Потёк толстый у буквы и сужается книзу — рисуем цепочкой кругов
        # с убывающим радиусом, иначе он читается булавкой, а не краской.
        top_w = h * rnd.uniform(0.045, 0.075)
        tip_w = top_w * rnd.uniform(0.3, 0.45)
        steps = max(8, length // 3)
        for i in range(steps + 1):
            t = i / steps
            r = (top_w * (1 - t) + tip_w * t) / 2
            cy = y0 - top_w * 0.4 + length * t
            d.ellipse([x - r, cy - r, x + r, cy + r], fill=color + (255,))
        # Капля на конце: краска стекает и собирается в шарик.
        r = tip_w * rnd.uniform(0.85, 1.35)
        cy = y0 + length
        d.ellipse([x - r, cy - r, x + r, cy + r], fill=color + (255,))
    return out


def bake(text, color, path, seed):
    font = ImageFont.truetype(FONT, SIZE)
    pad = SIZE // 3
    tmp = Image.new("RGBA", (SIZE * len(text) + pad * 2, SIZE * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp)
    d.text((pad, pad), text, font=font, fill=color + (255,))
    tmp = tmp.crop(tmp.split()[3].getbbox())
    tmp = add_drips(tmp, color, random.Random(seed * 3 + 1))

    # Неровный край: шум чуть подъедает альфу, буквы перестают быть стерильными.
    rnd = random.Random(seed)
    noise = Image.effect_noise(tmp.size, 42).filter(ImageFilter.GaussianBlur(0.6))
    alpha = tmp.split()[3]
    eaten = Image.eval(noise, lambda v: 255 if v > 96 else 210)
    tmp.putalpha(Image.composite(alpha, Image.eval(alpha, lambda v: int(v * 0.82)), eaten))

    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp.save(path, optimize=True)
    print(f"  {os.path.basename(path)}: {tmp.size[0]}x{tmp.size[1]}, {os.path.getsize(path)//1024} КБ")


if __name__ == "__main__":
    for i, (slug, (text, color)) in enumerate(WORDS.items()):
        bake(text, color, f"{OUT}/{slug}.png", 11 + i * 7)
