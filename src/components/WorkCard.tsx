import type { Project } from '../content/projects';
import { MediaSlot } from './grunge/MediaSlot';
import { Sticker } from './grunge/Sticker';
import { spikeClipPath } from '../lib/rough';

/**
 * Варианты раскладки блока.
 *
 * На постере-рефе три работы устроены по-разному: разный размер, разная
 * сторона выноса, разное положение текстовой колонки. Прошлая версия
 * использовала один шаблон, зеркалимый через строку, и от этого читалась
 * регулярной сеткой, а не постером.
 */
const VARIANTS = [
  // Крупный кадр слева, текст справа — как первый блок рефа.
  { side: 'left'  as const, media: 54, text: 42, pull: -2, lift: 0 },
  // Кадр справа, текст уходит к левому краю листа — второй блок.
  { side: 'right' as const, media: 46, text: 46, pull: 4, lift: -6 },
  // Узкий высокий кадр слева, текст с отступом — третий блок.
  { side: 'left'  as const, media: 44, text: 44, pull: 6, lift: -3 },
];

type Props = {
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
  total: number;
};

/**
 * Блок проекта в разделе WORK.
 *
 * Кадр уходит за край листа и вырезан взорванным контуром. Белая кромка
 * рисуется ТЕМ ЖЕ контуром, что и кадр: подложка снаружи, кадр внутри с
 * отступом. Раньше это были два независимых контура, и кромка местами
 * распадалась на отдельные треугольники.
 */
export function WorkCard({ project, onOpen, index, total }: Props) {
  const v = VARIANTS[index % VARIANTS.length];
  const clip = spikeClipPath(index * 97 + 13, v.side === 'left' ? 'left' : 'right', 19, 7);

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
        } as React.CSSProperties
      }
    >
      <button
        className="pw__frame"
        onClick={() => onOpen(project)}
        aria-label={`Открыть проект: ${project.title}, ${project.year}`}
        style={{ clipPath: clip }}
      >
        <span className="pw__shot" style={{ clipPath: clip }}>
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
        <span className="pw__play u-label" aria-hidden="true">Смотреть</span>
      </button>

      <div className="pw__text">
        <p className="pw__kicker">
          {project.year}
          {/* Номер работы в списке. Раньше здесь стояло количество
              направлений — посетителю это ничего не говорило. */}
          <sup>{String(index + 1).padStart(2, '0')}/{total}</sup>
        </p>
        <h3 className="pw__title u-head">
          {project.title}
          <Sticker
            src={index % 2 ? 'marks/asterisk' : 'marks/star'}
            w={36}
            rot={index % 2 ? 12 : -11}
            color="var(--orange)"
            className="pw__mark"
          />
        </h3>
        {project.note && <p className="pw__note">{project.note}</p>}
        <p className="pw__dirs u-tech">{project.directions.join(' · ')}</p>
      </div>
    </article>
  );
}
