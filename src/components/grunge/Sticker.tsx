import { asset } from '../../lib/asset';
import './Sticker.css';

type Props = {
  /** Путь внутри public/textures без расширения, например 'marks/star'. */
  src: string;
  /** Ширина в px или любой CSS-размер. */
  w?: number | string;
  /** Поворот в градусах — ни один элемент не стоит ровно. */
  rot?: number;
  /** Цвет заливки. Элемент красится маской, поэтому цвет любой из палитры. */
  color?: string;
  opacity?: number;
  /** Режим наложения: 'multiply' вжимает элемент в бумагу, 'screen' — в тёмное. */
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay';
  /**
   * Оставить элемент на узком экране. По умолчанию декор на телефоне
   * скрывается: там он налезает на текст и кнопки. Помечать только те
   * элементы, что попадают в свободное поле.
   */
  mobile?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Вырезанный элемент из паков заказчицы: граффити-тег, спрей-символ, скотч.
 *
 * Файлы лежат чёрными с прозрачностью, а на страницу выводятся через
 * `mask-image` — так один PNG красится в любой цвет палитры, и не нужно
 * держать копию элемента на каждый оттенок.
 *
 * Все наклейки декоративные: не ловят курсор и не читаются скринридером.
 */
export function Sticker({
  src,
  w = 120,
  rot = 0,
  color = 'var(--orange)',
  opacity = 1,
  blend = 'normal',
  mobile = false,
  className = '',
  style,
}: Props) {
  const url = `url("${asset(`textures/${src}.png`)}")`;
  return (
    <span
      className={`stk ${mobile ? 'stk--mob' : ''} ${className}`}
      aria-hidden="true"
      style={
        {
          '--stk-src': url,
          '--stk-color': color,
          width: typeof w === 'number' ? `${w}px` : w,
          transform: `rotate(${rot}deg)`,
          opacity,
          mixBlendMode: blend,
          ...style,
        } as React.CSSProperties
      }
    />
  );
}
