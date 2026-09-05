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
 * Блок проекта — копия строения с присланного постера.
 *
 * Кадр уходит за край экрана и вырезан двумя контурами: белая подложка
 * снизу и кадр поверх неё с чуть другой формой. Из-за расхождения по краю
 * остаётся белая рваная кромка — на постере она у всех картинок и держит
 * весь его вид.
 *
 * Текст рядом устроен как на рефе: мелкое слово над крупным заголовком,
 * надстрочные номера у обоих, плотный абзац с выделенными словами.
 */
export function WorkCard({ project, onOpen, index }: Props) {
  const flipped = index % 2 === 1;
  const bleed = flipped ? 'right' : 'left';
  const seed = index * 41 + 7;

  return (
    <article className={`pw ${flipped ? 'pw--flip' : ''}`} data-hover-media>
      <button
        className="pw__frame"
        onClick={() => onOpen(project)}
        aria-label={`Открыть проект: ${project.title}, ${project.year}`}
        style={{ clipPath: spikeClipPath(seed, bleed, 11, 11) }}
      >
        {/* Второй контур с другим seed — отсюда неровная белая кромка. */}
        <span className="pw__shot" style={{ clipPath: spikeClipPath(seed + 500, bleed, 11, 10) }}>
          <MediaSlot
            video={project.loop}
            poster={project.poster}
            label="Loop-превью"
            hint={project.hint}
            ratio="4 / 3"
            playOnHover
          />
        </span>
        <span className="pw__tag u-tech" aria-hidden="true">{project.directions[0]}</span>
        <span className="pw__play u-label" aria-hidden="true">Смотреть</span>
      </button>

      <div className="pw__text">
        <p className="pw__kicker">
          {project.year}
          <sup>{String(index + 1).padStart(2, '0')}</sup>
        </p>
        <h3 className="pw__title u-head">
          {project.title}
          <sup>{project.directions.length}</sup>
          <Sticker
            src={flipped ? 'marks/asterisk' : 'marks/star'}
            w={38}
            rot={flipped ? 12 : -11}
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
