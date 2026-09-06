/**
 * Процедурная гранж-графика.
 *
 * Все рваные края, каракули и спрей-теги рисуются кодом, а не картинками:
 * форма считается от seed, поэтому она стабильна между рендерами и сборками,
 * но каждый элемент на странице получается своей, «нарисованной от руки».
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
 * Край разорванной бумаги. Возвращает `d` для path в viewBox 0 0 1000 H.
 *
 * @param side  'top' — рвань сверху (фигура заливает низ), 'bottom' — наоборот
 * @param seed  форма края
 * @param teeth сколько «зубцов» разрыва
 */
export function tornEdgePath(
  side: 'top' | 'bottom',
  seed: number,
  teeth = 34,
  height = 60,
): string {
  const rnd = seeded(seed);
  const W = 1000;
  const step = W / teeth;
  const pts: [number, number][] = [];

  for (let i = 0; i <= teeth; i++) {
    const x = i * step + (i === 0 || i === teeth ? 0 : (rnd() - 0.5) * step * 0.7);
    // Волокна бумаги: крупная волна + мелкие рывки поверх неё.
    const wave = Math.sin((i / teeth) * Math.PI * 2.4 + seed) * height * 0.16;
    const jag = (rnd() - 0.5) * height * 0.72;
    const spike = rnd() > 0.86 ? (rnd() - 0.5) * height * 0.9 : 0;
    const y = height * 0.5 + wave + jag + spike;
    pts.push([x, Math.max(2, Math.min(height - 2, y))]);
  }

  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');

  return side === 'top'
    ? `${line}L${W},${height}L0,${height}Z`   // заливаем всё, что ниже разрыва
    : `${line}L${W},0L0,0Z`;                  // заливаем всё, что выше
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

/**
 * Взрывной рваный край для кадров WORK.
 *
 * На рефе картинка уходит за край страницы: сторона, которой она вылезает,
 * остаётся прямой (её режет край экрана), а три остальные — крупные острые
 * зубцы, будто лист выдрали. Прежний вариант рвал все стороны мелкой
 * рябью и рядом с рефом читался аккуратной рамкой.
 *
 * @param bleed сторона, уходящая за край: она не рвётся
 * @param depth глубина зубцов в процентах
 */
export function spikeClipPath(
  seed: number,
  bleed: 'left' | 'right' | 'none',
  teeth = 13,
  depth = 16,
): string {
  const rnd = seeded(seed);
  // На рефе край не «зубчатый», а взорванный: короткая база и редкие длинные
  // тонкие иглы. Прошлый вариант давал равномерную рябь и читался рамкой.
  // Значение — отступ от края бокса. База сидит на глубине depth, а игла
  // дотягивается почти до края и торчит НАРУЖУ от базы. Раньше было
  // наоборот: база у края, иглы вглубь — они выгрызали куски кадра.
  const spike = () => {
    const r = rnd();
    if (r > 0.80) return depth * 0.04;       // редкая длинная игла наружу
    if (r > 0.52) return depth * 0.5;        // средний выступ
    return depth * 0.95;                     // база
  };
  const pts: string[] = [];
  const at = (x: number, y: number) => pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);

  // Обход строго по кругу: иначе контур пересекает сам себя и середина
  // кадра выедается.
  for (let i = 0; i <= teeth; i++) at((i / teeth) * 100, spike());
  if (bleed === 'left') {
    for (let i = 1; i < teeth; i++) at(100 - spike(), (i / teeth) * 100);
    for (let i = teeth; i >= 0; i--) at((i / teeth) * 100, 100 - spike());
  } else if (bleed === 'right') {
    for (let i = teeth; i >= 0; i--) at((i / teeth) * 100, 100 - spike());
    for (let i = teeth - 1; i >= 1; i--) at(spike(), (i / teeth) * 100);
  } else {
    // Ничего не вылезает за край — рвутся все четыре стороны.
    for (let i = 1; i < teeth; i++) at(100 - spike(), (i / teeth) * 100);
    for (let i = teeth; i >= 0; i--) at((i / teeth) * 100, 100 - spike());
    for (let i = teeth - 1; i >= 1; i--) at(spike(), (i / teeth) * 100);
  }

  return `polygon(${pts.join(', ')})`;
}

/** Пятно/капля краски — для дрипов под спрей-тегом. */
export function dripPath(seed: number, count = 5): string {
  const rnd = seeded(seed);
  let d = '';
  for (let i = 0; i < count; i++) {
    const x = 60 + rnd() * 880;
    const len = 18 + rnd() * 90;
    const w = 3 + rnd() * 7;
    // «Слеза»: узкий след и утолщение на конце.
    d += `M${x},0 q${-w / 2},${len * 0.55} 0,${len} q${w / 2},${-len * 0.45} ${w},${-len} Z`;
  }
  return d;
}

/** Набор рукописных каракулей (маркер). Пути нарисованы в viewBox 0 0 200 100. */
export const SCRIBBLES = {
  /** Небрежная обводка овалом — как в рефе 0424 вокруг мелких подписей. */
  circle:
    'M164,44c-3-19-40-31-70-30C61,15,26,28,22,48c-4,19,29,36,66,37c34,1,72-11,76-29c3-16-24-30-58-33',
  /** Подчёркивание в два прохода. */
  underline:
    'M8,62c44-9,96-13,150-11 M14,74c50-10,104-13,158-9',
  /** Стрелка от руки. */
  arrow:
    'M10,70c40-30,86-46,150-48 M132,10c12,3,22,7,30,12 M148,42c8-10,12-20,14-30',
  /** Зигзаг-«пульс» (реф 0437). */
  zigzag:
    'M4,60l26-34l22,48l26-56l24,60l26-42l22,34l26-30',
  /** Крест-«×» двумя мазками. */
  cross:
    'M24,20c38,22,80,44,124,62 M150,18c-40,24-82,46-124,66',
  /** Звезда, нарисованная одной линией (реф 0435). */
  star:
    'M100,8l22,58l60,2l-48,38l18,58l-52-36l-52,36l18-58l-48-38l60-2Z',
} as const;

export type ScribbleKind = keyof typeof SCRIBBLES;
