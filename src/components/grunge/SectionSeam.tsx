import { useId } from 'react';
import { SEAM_PATHS, type SeamId } from '../../lib/seamPaths';
import './SectionSeam.css';

type Props = {
  /** Какой из пяти профилей кромки. Каждый стык на сайте свой. */
  id: SeamId;
  /**
   * Цвет самого листа — верхний тон градиента этой секции. Лист должен
   * продолжать фон секции, иначе под кромкой видна ступенька.
   */
  sheet: string;
  /** Насколько лист наезжает на предыдущую секцию, px. */
  overlap?: number;
  /** Сдвиг светлого волокна из-под кромки, px в системе профиля. */
  fiber?: number;
  /** Маленький кусочек оранжевой подложки — не на каждом стыке. */
  accent?: boolean;
};

/**
 * Бумажный стык секций.
 *
 * Каждая следующая секция — новый лист, слегка наезжающий на предыдущий.
 * Слоёв четыре: иногда кусочек оранжевой подложки, светлое волокно среза,
 * локальная тень и сам тёмный лист. Профиль у всех ОДИН, просто сдвинут по
 * вертикали — так это читается срезом бумаги, а не тремя разными полосами.
 *
 * Сам профиль — ломаная, и ровные грани выдавали в ней вектор. Поэтому он
 * прогоняется через `feTurbulence` + `feDisplacementMap`: шум расталкивает
 * точки края, и получается волокнистый обрыв. Seed привязан к профилю,
 * форма между рендерами не меняется.
 *
 * Слой декоративный: не ловит указатель и не читается скринридером.
 */
export function SectionSeam({ id, sheet, overlap = 56, fiber = 6, accent = false }: Props) {
  const d = SEAM_PATHS[id];
  // Фрагментные id должны быть уникальны на страницу: одинаковые ломают
  // ссылку filter="url(#…)" у второго и следующих стыков.
  const fid = `seam-${useId().replace(/:/g, '')}`;
  // Лист выступает вверх на overlap, а ниже кромки идёт сплошная заливка,
  // которая продолжает фон секции. Запас 24 px закрывает стык без щели.
  const height = overlap + 24;
  const seed = 3 + Number(id.slice(-2)) * 7;

  return (
    <svg
      className="seam"
      style={{ height, top: -overlap }}
      viewBox="0 0 1000 160"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <filter id={fid} x="-10%" y="-40%" width="120%" height="180%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.05" numOctaves="5" seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <g filter={`url(#${fid})`}>
        {accent && (
          <path d={d} fill="var(--orange)" transform={`translate(0 ${-fiber * 3.2})`} opacity="0.92" />
        )}
        {/* Светлое волокно среза — полоска из-под листа. */}
        <path d={d} fill="var(--paper)" transform={`translate(0 ${-fiber})`} />
        {/* Локальная тень под кромкой: лист должен читаться поднятым. */}
        <path d={d} fill="rgb(0 0 0 / 42%)" transform={`translate(0 ${fiber * 0.9})`} />
        <path d={d} fill={sheet} />
      </g>
    </svg>
  );
}
