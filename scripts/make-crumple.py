#!/usr/bin/env python3
"""
Фактура мятой бумаги для фонов секций.

В присланных паках такой фактуры нет: `cloth.jpg` — мелкий равномерный шум
без складок, `spray.jpg` — пятна распыла. На макете же фон везде мятый,
со складками и заломами, и именно они держат всю графику.

Складки считаются здесь, а не рисуются:

1. Фрактальный шум собирается через БПФ: белый шум фильтруется по 1/f^beta.
   Спектральный способ выбран потому, что результат периодичен по обеим
   осям — фактуру можно замостить, и стыков плитки не видно.
2. Гребни: 1 - |шум| даёт резкие линии там, где шум переходит через ноль.
   Это и есть заломы; обычный шум дал бы мягкие пятна.
3. Освещение: карта высот дифференцируется, наклон поверхности скалярно
   умножается на направление света. Из-за этого залом получает светлую и
   тёмную сторону и читается объёмным, а не серым разводом.
4. Царапины: несколько длинных тонких штрихов поверх.

Результат — серая карта со средним 128: она кладётся на фон в режиме
overlay, где 128 не меняет ничего, светлее — подсвечивает, темнее — топит.

    python3 scripts/make-crumple.py
"""
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
OUT = 'public/textures/bg/crumple.png'
OUT_ERODE = 'public/textures/erode.png'
SEED = 20260907


def fractal_noise(size: int, beta: float, rng: np.random.Generator) -> np.ndarray:
    """Периодичный фрактальный шум: белый шум, отфильтрованный по 1/f^beta."""
    white = rng.normal(size=(size, size))
    spectrum = np.fft.fft2(white)

    fy = np.fft.fftfreq(size)[:, None]
    fx = np.fft.fftfreq(size)[None, :]
    radius = np.sqrt(fx ** 2 + fy ** 2)
    radius[0, 0] = 1.0  # постоянную составляющую не трогаем

    field = np.real(np.fft.ifft2(spectrum / radius ** beta))
    field -= field.mean()
    field /= np.abs(field).max()
    return field


def creases(size: int, count: int, rng: np.random.Generator) -> np.ndarray:
    """
    Заломы: сумма «острых» плоских волн по искажённым координатам.

    Один член — 1-|sin| вдоль своего направления: прямая линия гребня.
    Возведение в степень заостряет её до узкой складки, между складками
    остаётся плоская грань — как у смятого и разглаженного листа.

    Два приёма делают решётку неправильной:

    • координаты заранее искривляются низкочастотным шумом (domain warping),
      иначе гребни идут идеально прямыми и картинка читается стёганым одеялом;
    • у каждой волны своя маска из шума, поэтому её складки видны пятнами,
      а не тянутся через весь лист.

    Волновые векторы целочисленные, шум периодический, поэтому фактура
    мостится без стыка.
    """
    y, x = np.mgrid[0:size, 0:size].astype(float)
    warp = size * 0.09
    x = x + fractal_noise(size, 2.6, rng) * warp
    y = y + fractal_noise(size, 2.6, rng) * warp

    height = np.zeros((size, size))
    total = 0.0
    for _ in range(count):
        kx, ky = 0, 0
        while kx == 0 and ky == 0:
            kx = int(rng.integers(-5, 6))
            ky = int(rng.integers(-5, 6))
        phase = rng.uniform(0, 2 * math.pi)
        weight = rng.uniform(0.5, 1.0)
        wave = np.sin(2 * math.pi * (kx * x + ky * y) / size + phase)
        # Маска: складка проявляется не везде, а участками.
        mask = np.clip(fractal_noise(size, 2.8, rng) * 2.2 + 0.45, 0.0, 1.0)
        height += weight * mask * (1.0 - np.abs(wave)) ** 6
        total += weight
    return height / total


def main() -> None:
    rng = np.random.default_rng(SEED)

    # Складки плюс мягкая неравномерность самого листа.
    folds = creases(SIZE, 11, rng)
    swell = fractal_noise(SIZE, 2.4, rng)
    surface = folds * 1.0 + swell * 0.35

    # Освещение: наклон поверхности против направления света. Из-за этого
    # у залома появляется светлая и тёмная сторона, и он читается объёмным.
    gy, gx = np.gradient(surface)
    lx, ly = 0.66, -0.75
    light = gx * lx + gy * ly
    light /= np.abs(light).max() or 1.0
    # Корень из модуля вытягивает слабые складки, не задирая сильные.
    light = np.sign(light) * np.abs(light) ** 0.55

    grain = fractal_noise(SIZE, 0.7, rng)

    value = 128.0 + light * 104.0 + grain * 16.0
    img = Image.fromarray(np.clip(value, 0, 255).astype(np.uint8), mode='L')
    img = img.filter(ImageFilter.GaussianBlur(0.35))

    # Царапины: тонкие штрихи, местами светлее фона, местами темнее.
    draw = ImageDraw.Draw(img)
    scratch_rng = random.Random(SEED)
    for _ in range(30):
        x0 = scratch_rng.uniform(0, SIZE)
        y0 = scratch_rng.uniform(0, SIZE)
        angle = scratch_rng.uniform(0, math.pi)
        length = scratch_rng.uniform(SIZE * 0.1, SIZE * 0.5)
        shade = 128 + scratch_rng.choice((-1, 1)) * scratch_rng.randint(30, 68)
        draw.line(
            [(x0, y0), (x0 + math.cos(angle) * length, y0 + math.sin(angle) * length)],
            fill=int(shade),
            width=1,
        )
    img = img.filter(ImageFilter.GaussianBlur(0.3))

    img.save(OUT, optimize=True)
    print(f'{OUT}  {img.size[0]}×{img.size[1]}')

    make_erode(rng)


def make_erode(rng: np.random.Generator) -> None:
    """
    Маска износа для крупных надписей.

    Кладётся на текст как `mask-image`: белое оставляет краску, тёмное
    выедает. Нужна, чтобы буквы заголовка не выглядели свежим вектором —
    на макете у них рваные, местами пропавшие края, как у плохого прогона
    краски по фактурной бумаге.

    Пятна редкие и мелкие: если выесть много, надпись перестанет читаться.
    """
    field = fractal_noise(SIZE, 1.05, rng)
    # Тёмного немного, но оно должно быть: при почти сплошном белом маска
    # ничего не выедала и края букв оставались вектором.
    value = np.clip(168.0 + field * 190.0, 0, 255)
    img = Image.fromarray(value.astype(np.uint8), mode='L')

    draw = ImageDraw.Draw(img)
    rnd = random.Random(SEED + 1)
    for _ in range(140):
        x0 = rnd.uniform(0, SIZE)
        y0 = rnd.uniform(0, SIZE)
        angle = rnd.uniform(-0.5, 0.5) + (0 if rnd.random() < 0.5 else math.pi / 2)
        length = rnd.uniform(SIZE * 0.02, SIZE * 0.22)
        draw.line(
            [(x0, y0), (x0 + math.cos(angle) * length, y0 + math.sin(angle) * length)],
            fill=rnd.randint(0, 70),
            width=rnd.choice((1, 1, 2)),
        )
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    img.save(OUT_ERODE, optimize=True)
    print(f'{OUT_ERODE}  {img.size[0]}×{img.size[1]}')


if __name__ == '__main__':
    main()
