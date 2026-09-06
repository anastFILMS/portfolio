import type { ReactNode } from 'react';
import type { Project } from '../content/projects';
import { MediaSlot } from './grunge/MediaSlot';
import { Scribble } from './grunge/Scribble';
import { shardClipPath } from '../lib/rough';

/**
 * Варианты раскладки блока.
 *
 * На постере-рефе кадры не вписаны в лист: каждый уходит за его край, и
 * стороны выноса чередуются. Текст стоит вплотную к сколу, местами
 * заезжая под иглы. Одинакового шаблона, зеркалимого по строкам, тут нет —
 * именно он читался сеткой.
 *
 * side — за какой край уходит кадр; media/text — ширины колонок;
 * pull — насколько текстовая колонка придвинута к сколу (отрицательное
 * значение = наезжает); lift — вертикальный сдвиг блока.
 */
const VARIANTS = [
  { side: 'left' as const, media: 56, text: 44, pull: -2, lift: 0, rot: -1.2, top: 4 },
  { side: 'right' as const, media: 52, text: 48, pull: -3, lift: -3, rot: 1.4, top: 1 },
  { side: 'left' as const, media: 50, text: 50, pull: -2, lift: -2, rot: -0.8, top: 6 },
];

/**
 * Внутри описания жирным выделены ключевые слова — как на постере, где
 * в абзаце подсвечены отдельные фразы. Разметка минимальная: `**фраза**`.
 */
function accents(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <b className="pw__hl" key={i}>
        {part.slice(2, -2)}
      </b>
    ) : (
      part
    ),
  );
}

type Props = {
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
  total: number;
};

/**
 * Блок проекта в разделе WORK.
 *
 * Белая подложка вырезана осколком с длинными иглами, кадр внутри — тем же
 * осколком, но поджатым внутрь. За счёт этого белое читается рваными
 * треугольниками по краю, а не ровной рамкой вокруг картинки.
 */
export function WorkCard({ project, onOpen, index, total }: Props) {
  const v = VARIANTS[index % VARIANTS.length];
  const seed = index * 97 + 13;
  const clip = shardClipPath(seed, v.side, { deep: 26, edge: 13 });

  return (
    <article
      className={`pw pw--${v.side}`}
      data-hover-media
      style={
        {
          '--media': `${v.media}%`,
          '--text': `${v.text}%`,
          '--pull': `${v.pull}%`,
          '--lift': `${v.lift}rem`,
          '--rot': `${v.rot}deg`,
          '--top': `${v.top}rem`,
        } as React.CSSProperties
      }
    >
      <button
        className="pw__frame"
        onClick={() => onOpen(project)}
        aria-label={`Открыть проект: ${project.title}, ${project.year}`}
        style={{ clipPath: clip }}
      >
        <span className="pw__shot" style={{ clipPath: clip }} data-tone={index % 3}>
          <MediaSlot
            video={project.loop}
            poster={project.poster}
            label="Loop-превью"
            hint={project.hint}
            /* Пропорции берём из данных: у вертикали и fashion они свои,
               и раньше все кадры принудительно шли 4:3. */
            ratio={project.ratio}
            playOnHover
          />
        </span>
        {/* Выходные данные прямо по кадру — на постере подписи лежат
            поверх картинки, а не только рядом с ней. */}
        <span className="pw__stamp u-tech" aria-hidden="true">
          {project.directions[0]} · {project.year}
        </span>
        <span className="pw__play u-label" aria-hidden="true">Смотреть</span>
      </button>

      <div className="pw__text">
        <p className="pw__kicker">
          {project.year}
          <sup>{String(index + 1).padStart(2, '0')}/{total}</sup>
        </p>
        <h3 className="pw__title u-head">
          {project.title}
          <Scribble
            kind={index % 2 ? 'circle' : 'underline'}
            className="pw__mark"
            delay={0.2}
            stretch
          />
        </h3>
        {project.note && <p className="pw__note">{accents(project.note)}</p>}
        <p className="pw__dirs u-tech">{project.directions.join(' · ')}</p>
      </div>
    </article>
  );
}
