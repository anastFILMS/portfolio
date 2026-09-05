import { DIRECTION_LABELS, type Project } from '../content/projects';
import { MediaSlot } from './grunge/MediaSlot';

type Props = {
  project: Project;
  onOpen: (project: Project) => void;
  /** Порядковый номер в сетке — печатается как индекс архива. */
  index: number;
};

/**
 * Карточка проекта в сетке WORK.
 *
 * По брифу внутри только название, год и формат — ни описаний, ни списка
 * задач, ни роли. Всё остальное место отдано картинке.
 *
 * `data-hover-media` ловит MediaSlot: наведение на любую точку карточки
 * запускает loop-превью, а не только наведение на сам кадр.
 */
export function WorkCard({ project, onOpen, index }: Props) {
  const format = project.directions.join(' / ');

  return (
    <article className="card" data-hover-media>
      <button
        className="card__hit"
        onClick={() => onOpen(project)}
        aria-label={`Открыть проект: ${project.title}, ${project.year}, ${format}`}
      >
        <span className="card__media">
          <MediaSlot
            video={project.loop}
            poster={project.poster}
            // Название уже стоит подписью под карточкой — в заглушке пишем,
            // какой файл сюда встанет, а не дублируем заголовок.
            label="Loop-превью"
            hint={project.hint}
            ratio={project.ratio}
            playOnHover
          />
          {/* Индекс архива в углу — язык съёмочной картотеки. */}
          <span className="card__idx u-label" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          {/* Подсказка появляется только при наведении. */}
          <span className="card__play u-label" aria-hidden="true">Смотреть</span>
        </span>

        <span className="card__meta">
          <span className="card__title u-display">{project.title}</span>
          <span className="card__row u-label">
            <span className="card__year">{project.year}</span>
            <span className="card__format">{format}</span>
          </span>
        </span>
      </button>

      {/* Читаемые названия направлений — для поиска и скринридеров. */}
      <span className="sr-only">{project.directions.map((d) => DIRECTION_LABELS[d]).join(', ')}</span>
    </article>
  );
}
