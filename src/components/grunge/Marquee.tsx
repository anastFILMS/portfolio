import './Marquee.css';

type Props = {
  items: string[];
  /** Секунд на полный проход — больше значит медленнее. */
  duration?: number;
  reverse?: boolean;
  tone?: 'orange' | 'ink' | 'paper';
  className?: string;
};

/**
 * Бегущая строка-разделитель (реф 0414: «/ COLLECTION / COLLECTION /»).
 * Лента дублируется дважды и едет на -50% — стык получается бесшовным.
 */
export function Marquee({ items, duration = 26, reverse = false, tone = 'orange', className = '' }: Props) {
  const line = [...items, ...items];
  return (
    <div className={`marquee marquee--${tone} ${className}`} aria-hidden="true">
      <div
        className="marquee__track"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {line.map((item, i) => (
              <span className="marquee__item u-display" key={`${copy}-${i}`}>
                {item}
                <i className="marquee__sep">✳</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
