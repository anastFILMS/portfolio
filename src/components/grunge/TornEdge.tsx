import { useMemo } from 'react';
import { tornEdgePath } from '../../lib/rough';
import './TornEdge.css';

type Props = {
  /** У какого края секции сидит разрыв. */
  side: 'top' | 'bottom';
  /**
   * Цвет СОСЕДНЕЙ секции — той, что «надрывается» в текущую.
   * Разрыв рисуется внутри секции и заливает полосу цветом соседа, поэтому
   * стык читается как оторванный край бумаги, а не как прямая линия.
   */
  color: string;
  /** Разные seed = разные разрывы, ни один край не повторяется. */
  seed?: number;
  height?: number;
  className?: string;
};

/**
 * Край разорванной бумаги на стыке секций (рефы 0424, 0421, 0428).
 *
 * Разрыв рисуется ВНУТРИ секции, у её края. Раньше он выносился наружу через
 * translateY, но секции с параллаксом и бегущими строками обязаны иметь
 * overflow: hidden — и он срезал разрыв целиком, оставляя ровный стык.
 *
 * Слоёв два: тёмная «изнанка» бумаги со сдвигом и основная заливка поверх —
 * так край читается объёмным, а не просто зубчатым.
 */
export function TornEdge({ side, color, seed = 7, height = 58, className = '' }: Props) {
  // 'top' заливает полосу вверх от линии разрыва, 'bottom' — вниз.
  const fillDir = side === 'top' ? 'bottom' : 'top';
  const d = useMemo(() => tornEdgePath(fillDir, seed, 34, height), [fillDir, seed, height]);
  const dShadow = useMemo(() => tornEdgePath(fillDir, seed + 991, 34, height), [fillDir, seed, height]);

  return (
    <svg
      className={`torn torn--${side} ${className}`}
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      style={{ height }}
      aria-hidden="true"
      focusable="false"
    >
      <path d={dShadow} fill="rgba(20,23,40,0.28)" transform={`translate(0, ${side === 'top' ? 5 : -5})`} />
      <path d={d} fill={color} />
    </svg>
  );
}
