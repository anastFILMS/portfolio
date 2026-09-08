import { useId, useState } from 'react';
import { experience, VISIBLE_COUNT } from '../content/experience';
import { SectionSeam } from './grunge/SectionSeam';
import { Reveal } from './grunge/Reveal';
import './Experience.css';

/**
 * «На площадке».
 *
 * Компактный блок, а не длинная лента резюме. Режим выбирается по данным:
 * есть подтверждённые мероприятия — показываем первые шесть и раскрываем
 * остальные; нет — показываем форматы съёмки и монтажа.
 *
 * Кнопка раскрытия появляется только когда есть что раскрывать: рисовать
 * её при пустом списке — обещать несуществующее содержимое.
 */
export function Experience() {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  const { events, fallbackFormats, fallbackLabel, title } = experience;
  const hasEvents = events.length > 0;
  const hidden = hasEvents ? Math.max(0, events.length - VISIBLE_COUNT) : 0;
  const shown = hasEvents && !expanded ? events.slice(0, VISIBLE_COUNT) : events;

  return (
    <section className="section section--experience exp" id="experience">
      <SectionSeam id="section-edge-02" />

      <div className="shell exp__shell">
        <Reveal>
          <h2 className="exp__title u-cond">
            {title}
            <span className="exp__rule" aria-hidden="true" />
          </h2>
        </Reveal>

        <div className="exp__body">
          <p className="exp__lead">{hasEvents ? 'Съёмки и проекты' : fallbackLabel}</p>

          {hasEvents ? (
            <ul className="exp__list" id={listId}>
              {shown.map((e) => (
                <li className="exp__item" key={`${e.title}-${e.year}`}>
                  <span className="exp__name">{e.title}</span>
                  <span className="exp__meta u-label">
                    {e.role}
                    {e.scale && <span className="exp__scale"> · {e.scale}</span>}
                  </span>
                  <span className="exp__year u-label">{e.year}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="exp__formats" id={listId}>
              {fallbackFormats.map((f) => (
                <li className="exp__format" key={f}>{f}</li>
              ))}
            </ul>
          )}

          {hidden > 0 && (
            <button
              className="exp__btn"
              type="button"
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Свернуть' : 'Показать больше'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
