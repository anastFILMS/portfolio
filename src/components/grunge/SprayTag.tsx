import { useId } from 'react';
import { dripPath } from '../../lib/rough';

type Props = {
  children: string;
  color?: string;
  /** Высота шрифта внутри SVG-координат. */
  size?: number;
  seed?: number;
  /** Дорисовать потёки краски под тегом (реф 0419, 0422). */
  drips?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Слово, «написанное» баллончиком: рукописный шрифт + шумовое смещение краёв,
 * мягкое свечение распыла и потёки краски.
 *
 * Это SVG-текст, а не картинка, поэтому кириллица работает и слово можно
 * менять в контенте, не перерисовывая ассет.
 */
export function SprayTag({
  children,
  color = 'var(--orange)',
  size = 120,
  seed = 3,
  drips = true,
  className = '',
  style,
}: Props) {
  const uid = useId().replace(/:/g, '');
  const w = Math.max(320, children.length * size * 0.56);
  // Ширина, которую реально занимает надпись. У коротких слов она заметно
  // меньше viewBox, и потёки, разложенные по всей ширине, повисали в пустоте
  // справа от тега — поэтому раскладываем их только под самими буквами.
  const inkWidth = children.length * size * 0.5;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${size * 1.6}`}
      style={{ overflow: 'visible', pointerEvents: 'none', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Рваный край краски: шум смещает контур букв. */}
        <filter id={`spray-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045 0.09" numOctaves="4" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Облако распыла вокруг штриха. */}
        <filter id={`mist-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={size * 0.055} />
        </filter>
      </defs>

      <g fontFamily="var(--font-hand)" fontWeight={700} fontSize={size} fill={color}>
        <text x="4" y={size} filter={`url(#mist-${uid})`} opacity="0.42">{children}</text>
        <text x="0" y={size * 0.97} filter={`url(#spray-${uid})`}>{children}</text>
      </g>

      {drips && (
        <g transform={`translate(0, ${size * 0.98}) scale(${inkWidth / 1000}, 1)`} opacity="0.85">
          <path d={dripPath(seed + 17, 4)} fill={color} filter={`url(#spray-${uid})`} />
        </g>
      )}
    </svg>
  );
}
