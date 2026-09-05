import { useMemo, useState } from 'react';
import { DIRECTION_LABELS, projects, type Direction, type Project } from '../content/projects';
import { useParallaxEnabled, useScrollProgress } from '../hooks/useParallax';
import { WorkCard } from './WorkCard';
import { ProjectModal } from './ProjectModal';
import { Reveal } from './grunge/Reveal';
import { Scribble } from './grunge/Scribble';
import './Work.css';

/**
 * Раздел WORK — главный на сайте.
 *
 * Механика взята с wodniack.dev: колонки сетки едут с разной скоростью
 * относительно скролла, за счёт чего появляется глубина и многослойность.
 * Скорости заданы вручную (SPEEDS) — крайние колонки отстают, центральная
 * обгоняет, поэтому сетка «дышит», а не просто ползёт вверх.
 *
 * На узких экранах и при prefers-reduced-motion параллакс выключается:
 * там он только мешает смотреть работы.
 */

export function Work() {
  const [filter, setFilter] = useState<Direction | 'ALL'>('ALL');
  const [open, setOpen] = useState<Project | null>(null);
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const parallax = useParallaxEnabled();

  const visible = useMemo(
    () => (filter === 'ALL' ? projects : projects.filter((p) => p.directions.includes(filter))),
    [filter],
  );

  /** Все направления, реально встречающиеся в проектах. */
  const directions = useMemo(() => {
    const set = new Set<Direction>();
    projects.forEach((p) => p.directions.forEach((d) => set.add(d)));
    return [...set];
  }, []);

  return (
    <section className="work section section--ink" id="work">
      <div className="shell">
        <header className="work__head">
          {/* Каракуля лежит ПОД заголовком и не может находиться внутри
              Reveal mode="mask": маска работает через overflow: hidden и
              срезала всё, что выходит за базовую линию текста. */}
          <div className="work__title-wrap">
            <Reveal mode="mask">
              <h2 className="work__title u-head">Work</h2>
            </Reveal>
            <Scribble kind="underline" className="work__title-line" delay={0.35} stretch />
          </div>
          <Reveal mode="jerk" delay={0.15}>
            <p className="work__sub u-label">
              {visible.length} {plural(visible.length, 'проект', 'проекта', 'проектов')} · наведи, чтобы
              посмотреть превью
            </p>
          </Reveal>
        </header>

        <Reveal mode="jerk" delay={0.2}>
          <div className="work__filter" role="group" aria-label="Фильтр по направлениям">
            <FilterChip active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
              Все
            </FilterChip>
            {directions.map((d) => (
              <FilterChip key={d} active={filter === d} onClick={() => setFilter(d)}>
                {DIRECTION_LABELS[d]}
              </FilterChip>
            ))}
          </div>
        </Reveal>

        {/* Шахматный порядок «материал — информация — материал»: строки
            чередуются сторонами, а не выстраиваются сеткой. Параллакс
            сдвигает соседние строки навстречу друг другу. */}
        <div className="work__rows" ref={ref}>
          {visible.map((project, i) => (
            <div
              className="work__row"
              key={project.id}
              style={
                parallax
                  ? ({ transform: `translate3d(0, ${(progress - 0.5) * (i % 2 ? 60 : -60)}px, 0)` } as React.CSSProperties)
                  : undefined
              }
            >
              <WorkCard project={project} index={i} onOpen={setOpen} />
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="work__empty u-label">В этом направлении пока нет опубликованных работ.</p>
        )}
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className={`chip u-label ${active ? 'is-active' : ''}`} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

/** Русские окончания для счётчика проектов. */
function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
