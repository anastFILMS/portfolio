import { useState } from 'react';
import { events, VISIBLE_COUNT } from '../content/experience';
import { TornEdge } from './grunge/TornEdge';
import { Reveal } from './grunge/Reveal';
import { Scribble } from './grunge/Scribble';
import './Experience.css';

/**
 * Опыт / проекты / мероприятия.
 *
 * По брифу сразу видно только самое значимое, остальное прячется за кнопкой,
 * чтобы страница не растягивалась. Порядок в контенте = порядок значимости.
 */
export function Experience() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? events : events.slice(0, VISIBLE_COUNT);
  const hidden = events.length - VISIBLE_COUNT;

  return (
    <section className="exp section section--paper" id="experience">
      {/* Сверху в бумагу надрывается тёмная секция WORK. */}
      <TornEdge side="top" color="var(--ink)" seed={13} height={62} />

      <div className="shell">
        <header className="exp__head">
          <Reveal mode="mask">
            <h2 className="exp__title u-display">
              Где я <span className="exp__title-accent">снимала</span>
            </h2>
          </Reveal>
          <Reveal mode="jerk" delay={0.12}>
            <p className="exp__sub u-label">Крупные мероприятия и медиапроекты</p>
          </Reveal>
          <Scribble kind="arrow" className="exp__arrow" color="var(--orange)" width={150} delay={0.3} />
        </header>

        <ol className="exp__list">
          {shown.map((e, i) => (
            <Reveal
              as="li"
              mode="jerk"
              // Задержка накапливается только внутри первой партии: раскрытые
              // строки должны появляться сразу, а не отсчитывать лесенку заново.
              delay={i < VISIBLE_COUNT ? i * 0.05 : 0}
              key={`${e.title}-${e.year}`}
              className="exp__item"
            >
              <span className="exp__num u-label">{String(i + 1).padStart(2, '0')}</span>
              <span className="exp__body">
                <span className="exp__name u-display">{e.title}</span>
                {e.scale && <span className="exp__scale u-label">{e.scale}</span>}
              </span>
              <span className="exp__role u-label">{e.role}</span>
              <span className="exp__year u-label">{e.year}</span>
            </Reveal>
          ))}
        </ol>

        {hidden > 0 && (
          <div className="exp__more">
            <button className="exp__btn u-display" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
              {expanded ? 'Свернуть' : `Показать больше — ещё ${hidden}`}
              <span className="exp__btn-mark" aria-hidden="true">{expanded ? '−' : '+'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
