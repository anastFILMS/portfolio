import { useMemo, type ReactNode } from 'react';
import { tornClipPath } from '../../lib/rough';
import './PaperScrap.css';

type Props = {
  children: ReactNode;
  /** Форма краёв считается от seed — стабильна между рендерами. */
  seed?: number;
  /** Наклон: в скрапбукинге ничего не наклеено ровно. */
  rot?: number;
  /** Насколько глубоко рвутся края, в процентах высоты. */
  depth?: number;
  tone?: 'paper' | 'ink' | 'orange';
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Клочок бумаги, на который «наклеена» надпись.
 *
 * Края вырезаются процедурно, а не маской из скана: скан рваной бумаги —
 * произвольная клякса, и длинная надпись с неё сваливалась, а куски текста
 * оставались на тёмном фоне и переставали читаться. Процедурный контур
 * всегда покрывает весь прямоугольник, но края при этом рваные.
 *
 * Бумажка чуть больше содержимого, поэтому надпись может выходить за её
 * края там, где это задумано (рефы 2825, 0437).
 */
export function PaperScrap({
  children,
  seed = 3,
  rot = -2,
  depth = 9,
  tone = 'paper',
  className = '',
  style,
}: Props) {
  const clip = useMemo(() => tornClipPath(seed, 26, depth), [seed, depth]);

  return (
    <span
      className={`scrap scrap--${tone} ${className}`}
      style={{ '--scrap-rot': `${rot}deg`, ...style } as React.CSSProperties}
    >
      <span className="scrap__sheet" aria-hidden="true" style={{ clipPath: clip }} />
      <span className="scrap__body">{children}</span>
    </span>
  );
}
