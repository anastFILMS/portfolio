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


def bake(text, color, path, seed):
    font = ImageFont.truetype(FONT, SIZE)
    pad = SIZE // 3
    tmp = Image.new("RGBA", (SIZE * len(text) + pad * 2, SIZE * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp)
    d.text((pad, pad), text, font=font, fill=color + (255,))
    tmp = tmp.crop(tmp.split()[3].getbbox())

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
