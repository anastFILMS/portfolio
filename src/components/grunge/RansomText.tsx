import { useMemo } from 'react';
import { seeded, tornClipPath } from '../../lib/rough';
import './RansomText.css';

type Props = {
  children: string;
  /** Разные seed — разная «нарезка» одного и того же слова. */
  seed?: number;
  className?: string;
};

/** Варианты «вырезанных из разных журналов» букв. */
const FONTS = ['var(--font-display)', 'var(--font-body)', 'var(--font-mono)'] as const;
const TONES = ['paper', 'ink', 'orange', 'paper', 'paper', 'ink'] as const;

/**
 * Заголовок в стиле ransom note — как «VERNON» в главном рефе (0437):
 * каждая буква вырезана отдельно, своим шрифтом, кеглем и наклоном,
 * на своём клочке бумаги с рваными краями.
 *
 * Параметры букв считаются от seed, а не берутся случайно при рендере:
 * иначе заголовок «дёргался» бы при каждой перерисовке React.
 */
export function RansomText({ children, seed = 1, className = '' }: Props) {
  const letters = useMemo(() => {
    const rnd = seeded(seed);
    return children.split('').map((ch, i) => {
      const isSpace = ch === ' ';
      return {
        ch,
        isSpace,
        font: FONTS[Math.floor(rnd() * FONTS.length)],
        tone: TONES[Math.floor(rnd() * TONES.length)],
        // Кегль гуляет — строка получается «пляшущей», как из вырезок.
        scale: 0.82 + rnd() * 0.36,
        rot: (rnd() - 0.5) * 9,
        // Вертикальный сдвиг: буквы не стоят на общей базовой линии.
        dy: (rnd() - 0.5) * 0.1,
        clip: tornClipPath(seed * 31 + i, 9, 11),
        weight: rnd() > 0.5 ? 700 : 400,
        key: i,
      };
    });
  }, [children, seed]);

  return (
    <span className={`ransom ${className}`}>
      {/* Читаемая строка для скринридеров и поиска — вырезки её не заменяют. */}
      <span className="sr-only">{children}</span>
      <span className="ransom__row" aria-hidden="true">
        {letters.map((l) =>
          l.isSpace ? (
            <span className="ransom__space" key={l.key} />
          ) : (
            <span
              className={`ransom__cut ransom__cut--${l.tone}`}
              key={l.key}
              style={
                {
                  fontFamily: l.font,
                  fontWeight: l.weight,
                  fontSize: `${l.scale}em`,
                  transform: `rotate(${l.rot}deg) translateY(${l.dy}em)`,
                  clipPath: l.clip,
                  animationDelay: `${l.key * 0.045}s`,
                } as React.CSSProperties
              }
            >
              {l.ch}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
