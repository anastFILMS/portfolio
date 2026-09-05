import type { Project } from '../content/projects';
import { MediaSlot } from './grunge/MediaSlot';
import { Sticker } from './grunge/Sticker';
import { spikeClipPath } from '../lib/rough';

type Props = {
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
};

/**
 * Строка проекта в разделе WORK — раскладка снята с присланного постера.
 *
 * Кадр уходит за край экрана и вырезан взрывным рваным контуром; сторона
 * выноса остаётся прямой, её режет край. Текст стоит вплотную с внутренней
 * стороны: номер, двухчастный заголовок, мета и одна строка описания.
 *
 * Стороны чередуются: чётные строки — кадр слева, нечётные — справа.
 */
export function WorkCard({ project, onOpen, index }: Props) {
  const flipped = index % 2 === 1;
  const bleed = flipped ? 'right' : 'left';

  return (
    <article className={`row ${flipped ? 'row--flip' : ''}`} data-hover-media>
      <button
        className="row__media"
        onClick={() => onOpen(project)}
        aria-label={`Открыть проект: ${project.title}, ${project.year}`}
        style={{ clipPath: spikeClipPath(index * 41 + 7, bleed) }}
      >
        <MediaSlot
          video={project.loop}
          poster={project.poster}
          label="Loop-превью"
          hint={project.hint}
          ratio="16 / 10"
          playOnHover
        />
        <span className="row__play u-label" aria-hidden="true">Смотреть</span>
      </button>

      <div className="row__info">
        <span className="row__num u-tech" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {project.year}
        </span>

        {/* Заголовок в две части, как на рефе: мелкое слово над крупным. */}
        <h3 className="row__title">
          <span className="row__kicker u-label">{project.directions[0]}</span>
          <span className="row__name u-head">{project.title}</span>
          <Sticker
            src={flipped ? 'marks/asterisk' : 'marks/star'}
            w={40}
            rot={flipped ? 10 : -9}
            color="var(--orange)"
            className="row__mark"
          />
        </h3>

        {project.note && <p className="row__note">{project.note}</p>}

        <p className="row__meta u-label">{project.directions.join(' / ')}</p>
      </div>
    </article>
  );
}
