import { useMemo } from 'react';
import { seeded } from '../../lib/rough';

type Props = {
  /** Разные seed — разный рисунок потёков. */
  seed: number;
  /** Сколько капель. */
  count?: number;
  /** Цвет краски. */
  color?: string;
  className?: string;
};

/**
 * Потёки краски под крупной надписью.
 *
 * Каждая капля — сужающаяся книзу струйка с набухшей каплей на конце.
 * Полоса постоянной ширины со скруглением читалась бы булавкой с бусиной,
 * поэтому струйка сужается, а капля шире её нижнего края.
 *
 * Слой декоративный: не ловит указатель и не читается скринридером.
 */
export function PaintDrips({ seed, count = 9, color = 'var(--orange)', className = '' }: Props) {
  const drips = useMemo(() => {
    const rnd = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      // Капли расставлены по ширине неравномерно: ровный шаг читается узором.
      const x = ((i + 0.5) / count) * 100 + (rnd() - 0.5) * (60 / count);
      const len = 45 + rnd() * 55;          // корень прячется за буквой,
                                            // видна только стёкшая часть
      const top = 4 + rnd() * 4;            // ширина у корня
      const bottom = top * (0.4 + rnd() * 0.3);
      const blob = bottom * (1.3 + rnd() * 0.8);
      return { x, len, top, bottom, blob };
    });
  }, [seed, count]);

  return (
    <svg
      className={`drips ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {drips.map((d, i) => (
        <g key={i} fill={color}>
          <path
            d={
              `M${(d.x - d.top / 2).toFixed(2)},0` +
              `L${(d.x - d.bottom / 2).toFixed(2)},${d.len.toFixed(2)}` +
              `L${(d.x + d.bottom / 2).toFixed(2)},${d.len.toFixed(2)}` +
              `L${(d.x + d.top / 2).toFixed(2)},0Z`
            }
          />
          <ellipse cx={d.x} cy={d.len} rx={d.blob / 2} ry={d.blob * 0.9} />
        </g>
      ))}
    </svg>
  );
}
