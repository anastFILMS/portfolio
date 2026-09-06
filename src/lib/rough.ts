/**
 * Процедурные рваные края для бумажек первого экрана.
 *
 * Форма считается от seed: она стабильна между рендерами и сборками, но у
 * каждой бумажки своя. Формы кадров WORK и профили межсекционных стыков
 * сюда НЕ относятся — там фиксированная геометрия из пакета ТЗ,
 * см. lib/workShapes.ts и lib/seamPaths.ts.
 */

/** Детерминированный PRNG (mulberry32) — один seed даёт одну и ту же форму. */
export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Рваные края для CSS `clip-path`: не накладывает форму поверх элемента,
 * а вырезает её из самого элемента.
 *
 * Нужно там, где рвётся сам объект (полоска бумаги, наклейка), а не стык
 * двух секций: наложить сверху заливку того же цвета — значит не увидеть
 * ничего. Возвращает готовое значение `polygon(...)`.
 *
 * @param seed  форма краёв
 * @param teeth сколько точек на каждой стороне
 * @param depth глубина рванины в процентах высоты
 */
export function tornClipPath(seed: number, teeth = 22, depth = 7): string {
  const rnd = seeded(seed);
  const top: string[] = [];
  const bottom: string[] = [];

  for (let i = 0; i <= teeth; i++) {
    const x = (i / teeth) * 100;
    top.push(`${x.toFixed(1)}% ${(rnd() * depth).toFixed(1)}%`);
    // Нижний край собираем сразу в обратном порядке — polygon обходит контур.
    bottom.unshift(`${x.toFixed(1)}% ${(100 - rnd() * depth).toFixed(1)}%`);
  }

  return `polygon(${[...top, ...bottom].join(', ')})`;
}
