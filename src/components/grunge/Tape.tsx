import './Tape.css';

type Props = {
  /** Поворот в градусах — скотч почти никогда не клеят ровно. */
  angle?: number;
  width?: number;
  tone?: 'light' | 'dark' | 'orange';
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Кусок скотча (реф — папка «текстурки и элементы», IMG_0438 / IMG_0454).
 * Полупрозрачная полоса с бликом и рваными краями: используется, чтобы
 * «приклеить» карточку, фото или подпись к странице.
 */
export function Tape({ angle = -7, width = 130, tone = 'light', className = '', style }: Props) {
  return (
    <span
      className={`tape tape--${tone} ${className}`}
      style={{ '--tape-angle': `${angle}deg`, '--tape-w': `${width}px`, ...style } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
