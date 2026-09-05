import { DIRECTION_LABELS, type Project } from '../content/projects';
import { MediaSlot } from './grunge/MediaSlot';
import { Sticker } from './grunge/Sticker';
import { rippedClipPath } from '../lib/rough';

type Props = {
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
};

/**
 * Строка проекта в разделе WORK.
 *
 * Раскладка по рефу: материал и информация идут в шахматном порядке —
 * чётные строки картинкой слева, нечётные справа. Сетка карточек не
 * подходила: заказчица просила именно чередование.
 *
 * Кадр вырезан рваным краем по всему периметру — на рефе картинки
 * выглядят выдранными из бумаги.
 */
export function WorkCard({ project, onOpen, index }: Props) {
  const format = project.directions.map((d) => DIRECTION_LABELS[d]).join(' · ');
  const flipped = index % 2 === 1;

  return (
    <article className={`row ${flipped ? 'row--flip' : ''}`} data-hover-media>
      <button
        className="row__media"
        onClick={() => onOpen(project)}
        aria-label={`Открыть проект: ${project.title}, ${project.year}, ${format}`}
        style={{ clipPath: rippedClipPath(index * 37 + 5) }}
      >
        <MediaSlot
          video={project.loop}
          poster={project.poster}
          label="Loop-превью"
          hint={project.hint}
          ratio="16 / 9"
          playOnHover
        />
        <span className="row__play u-label" aria-hidden="true">Смотреть</span>
      </button>

      <div className="row__info">
        <span className="row__num u-tech" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="row__title u-head">{project.title}</h3>
        <p className="row__meta u-label">
          <span className="row__year">{project.year}</span>
          <span>{project.directions.join(' / ')}</span>
        </p>
        <p className="row__format u-label">{format}</p>

        {/* Мелкое граффити у текста — как подписи на рефе. */}
        <Sticker
          src={flipped ? 'marks/asterisk' : 'marks/star'}
          w={44}
          rot={flipped ? 9 : -8}
          color="var(--orange)"
          className="row__mark"
        />
      </div>
    </article>
  );
}
