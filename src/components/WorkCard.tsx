import { useEffect, useRef, useState } from 'react';
import type { Project } from '../content/projects';
import { asset } from '../lib/asset';
import { WorkPreview } from './WorkPreview';

type Props = {
  project: Project;
  onOpen: (project: Project) => void;
  /** Параллакс и hover-loop: на телефоне и при reduced motion выключены. */
  motionEnabled: boolean;
};

/** Shared accessible controls and media; direction classes own the composition. */
export function WorkCard({ project, onOpen, motionEnabled }: Props) {
  const rowRef = useRef<HTMLElement>(null);
  const [shift, setShift] = useState(0);

  // Прогресс считаем ЛОКАЛЬНО для этой работы. Раньше один прогресс всей
  // гигантской секции двигал сразу все блоки, и они шли синхронно.
  useEffect(() => {
    if (!motionEnabled) { setShift(0); return; }
    const el = rowRef.current;
    if (!el) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (vh - r.top) / (vh + r.height); // 0 внизу экрана → 1 вверху
      setShift((Math.min(1, Math.max(0, p)) - 0.5) * 24); // ±12 px
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [motionEnabled]);

  // Each stable direction uses a baked media mask and its own fibrous border.
  const paperId = Number(project.number);
  const open = () => onOpen(project);

  return (
    <article
      className={`wk wk--${project.side} wk--${project.id}`}
      ref={rowRef}
      data-hover-media
      style={
        {
          '--media': `${project.mediaWidthPercent}%`,
          '--text': `${project.textWidthPercent}%`,
          '--rot': `${project.rotateDeg}deg`,
          '--cover': project.coverAspectRatio,
          '--paper-mask': `url("${asset(`design/paper-v3/work-${paperId}-mask.svg`)}")`,
          '--paper-outer': `url("${asset(`design/paper-v3/work-${paperId}-outer.svg`)}")`,
        } as React.CSSProperties
      }
    >
      {/* Внешняя обёртка не режется маской — иначе clip-path съедал бы
          контур фокуса. Фокус виден на ней, форма живёт внутри. */}
      <button
        className="wk__shot"
        type="button"
        onClick={open}
        aria-label={`Смотреть: ${project.title}`}
        style={{ transform: motionEnabled ? `translate3d(0, ${shift.toFixed(1)}px, 0)` : undefined }}
      >
        <span
          className="wk__paper"
        >
          <span
            className="wk__inner"
            data-fit={project.temporaryPosterFit ?? 'cover'}
          >
            <WorkPreview project={project} allowHoverPlay={motionEnabled} />
          </span>
          <img className="wk__fiber" src={asset(`design/paper-v3/work-${paperId}-frame.svg`)} alt="" aria-hidden="true" />
          <span className="wk__tape" aria-hidden="true" />
        </span>
      </button>

      <div className="wk__text">
        <p className="wk__num u-cond">{project.number}</p>
        <h3 className="wk__title u-cond">{project.title}</h3>
        <p className="wk__cat u-label">{project.categoryLabel}</p>
        {/* Кнопка видна всегда, а не только при наведении. */}
        <button className="btn wk__btn" type="button" onClick={open}>
          Смотреть
        </button>
      </div>
    </article>
  );
}
