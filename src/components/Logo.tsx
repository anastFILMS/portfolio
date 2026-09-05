import { site } from '../content/site';
import './Logo.css';

type Props = { size?: number; className?: string };

/**
 * Логотип — чистая словесная марка.
 *
 * Прошлая версия начиналась с кольца с насечками: заказчица прочитала его
 * как прицел, и это правда ближе к оружию, чем к камере. Знак убран целиком —
 * «ANAST FILMS» ей нравится и без него.
 *
 * Осталась типографика: тяжёлое «ANAST» с распылённой копией под ним и
 * тонкий моношрифтовый хвост — приём из рефа URDA, где марка набрана
 * контрастной парой «жирный гротеск + мелкий моно».
 */
export function Logo({ size = 34, className = '' }: Props) {
  return (
    <span
      className={`logo ${className}`}
      style={{ '--logo-size': `${size}px` } as React.CSSProperties}
      aria-label={`${site.brand} ${site.brandSuffix}`}
    >
      <span className="logo__word" aria-hidden="true">
        {/* Распылённая копия со сдвигом — «непопадание в печать». */}
        <span className="logo__ghost">{site.brand}</span>
        <span className="logo__main">{site.brand}</span>
      </span>
      <span className="logo__rule" aria-hidden="true" />
      <span className="logo__suffix u-label" aria-hidden="true">{site.brandSuffix}</span>
    </span>
  );
}
