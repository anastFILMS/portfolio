import { useState, type CSSProperties } from 'react';
import { projects, type Project } from '../content/projects';
import { useParallaxEnabled } from '../hooks/useParallax';
import { asset } from '../lib/asset';
import { ReelPlayer } from './ReelPlayer';
import { WorkPreview } from './WorkPreview';
import './Work.css';

const slots = ['feature', 'portrait', 'lower-left', 'lower-right', 'strip'] as const;

export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const motionEnabled = useParallaxEnabled();

  return (
    <section className="section section--work work work--editorial" id="work">
      <div className="work__grain" aria-hidden="true" />
      <div className="work__glow work__glow--a" aria-hidden="true" />
      <div className="work__glow work__glow--b" aria-hidden="true" />

      <div className="shell work__spread">
        <aside className="work__intro">
          <span className="work__index u-label">02</span>
          <h2 className="work__heading">WORK</h2>
          <p className="work__lead">Живые моменты. Реальные люди.<br />Истории, которые остаются.</p>
          <p className="work__desc">Съёмка, репортаж, интервью, мультикам и монтаж — как единая визуальная история.</p>
          <span className="work__handnote">Больше, чем видео</span>
          <div className="work__legend u-label" aria-hidden="true">
            <span>FASHION</span><span>EVENTS</span><span>REPORTAGE</span><span>INTERVIEW</span>
          </div>
        </aside>

        <div className="work__gallery">
          {projects.map((project, index) => {
            const slot = slots[index] ?? 'strip';
            const paperId = Number(project.number);
            const vars = {
              '--paper-mask': `url("${asset(`design/paper-v3/work-${paperId}-mask.svg`)}")`,
              '--paper-outer': `url("${asset(`design/paper-v3/work-${paperId}-outer.svg`)}")`,
            } as CSSProperties;

            return (
              <article
                className={`work-project work-project--${slot}`}
                key={project.id}
                data-hover-media
                style={vars}
              >
                <button
                  className="work-project__media"
                  type="button"
                  onClick={() => setOpen(project)}
                  aria-label={`Смотреть: ${project.title}`}
                >
                  <span className="work-project__paper">
                    <span className="work-project__picture" data-fit={project.temporaryPosterFit ?? 'cover'}>
                      <WorkPreview project={project} allowHoverPlay={motionEnabled} />
                    </span>
                    <img
                      className="work-project__fiber"
                      src={asset(`design/paper-v3/work-${paperId}-frame.svg`)}
                      alt=""
                      aria-hidden="true"
                    />
                  </span>
                </button>

                <div className="work-project__copy">
                  <span className="work-project__num u-label">{project.number}</span>
                  <span className="work-project__tag u-label">{project.categoryLabel}</span>
                  <h3>{project.title}</h3>
                  <button
                    className="work-project__open"
                    type="button"
                    onClick={() => setOpen(project)}
                    aria-label={`Открыть ${project.title}`}
                  >
                    <span aria-hidden="true">→</span>
                  </button>
                </div>

                <span className="work-project__tape" aria-hidden="true" />
                <span className="work-project__scribble" aria-hidden="true">
                  {index === 0 ? 'moment / movement / frame' : index === 1 ? 'people / sound / light' : index === 2 ? 'observe / catch / keep' : index === 3 ? 'voice / face / story' : 'short / bold / alive'}
                </span>
              </article>
            );
          })}
        </div>

        <div className="work__pager u-label" aria-hidden="true">
          <span>01</span><span className="is-active">02</span><span>03</span><span>04</span>
        </div>

        <div className="work__footer-note u-label" aria-hidden="true">FILM / PEOPLE / POSSIBILITY</div>
      </div>

      <ReelPlayer project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
