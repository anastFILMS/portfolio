import { site } from '../content/site';
import './Logo.css';

type Props = { size?: number; className?: string };

/**
 * Логотип — по мотивам рефа «текст/IMG_0427»: буквы сидят на отдельных
 * скошенных плашках, каждая под своим углом, под ними оранжевая копия со
 * смещением. Слева — знак объектива (кольцо + точка), он же используется
 * в favicon.
 *
 * Логотип собирается из `site.brand`, поэтому смена имени в контенте
 * автоматически перерисовывает знак — ничего дорисовывать не нужно.
 */
export function Logo({ size = 34, className = '' }: Props) {
  const letters = site.brand.split('');

  return (
    <span
      className={`logo ${className}`}
      style={{ '--logo-size': `${size}px` } as React.CSSProperties}
      aria-label={`${site.brand} ${site.brandSuffix}`}
    >
      <svg className="logo__lens" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="16" cy="16" r="3.5" fill="var(--orange)" />
        {/* Насечки на кольце — как шкала на объективе. */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="16" y1="1.5" x2="16" y2="4.5"
            stroke="currentColor" strokeWidth="2"
            transform={`rotate(${deg} 16 16)`}
          />
        ))}
      </svg>

      <span className="logo__word" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            className="logo__tile"
            key={i}
            // Углы чередуются: ни одна плашка не стоит ровно.
            style={{ '--tilt': `${[-4, 3, -2.5, 4.5, -3.5, 2][i % 6]}deg` } as React.CSSProperties}
          >
            <span className="logo__ghost">{ch}</span>
            <span className="logo__char">{ch}</span>
          </span>
        ))}
      </span>

      <span className="logo__suffix u-mono" aria-hidden="true">{site.brandSuffix}</span>
    </span>
  );
}
