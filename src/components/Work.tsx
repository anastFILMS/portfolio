import { useState } from 'react';
import { projects, type Project } from '../content/projects';
import { useParallaxEnabled } from '../hooks/useParallax';
import { WorkCard } from './WorkCard';
import { ReelPlayer } from './ReelPlayer';
import { SectionSeam } from './grunge/SectionSeam';
import './Work.css';

/**
 * WORK — главный раздел: пять направлений съёмки и монтажа.
 *
 * Каждое направление — самостоятельная горизонтальная композиция, стороны
 * чередуются L/R/L/R/L. Панели фильтров здесь нет: для пяти разных рубрик
 * она избыточна и в последнем макете не показана.
 */
export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const motionEnabled = useParallaxEnabled();

  return (
    <section className="section section--work work" id="work">
      <SectionSeam id="section-edge-01" accent />

      <div className="shell">
        <header className="work__masthead">
          <h2 className="work__title u-cond"><span>WORK</span>
            <svg className="work__paint-drips" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
              <g fill="currentColor">
                <path d="M31 0h5l-1 57q-1 6-3 0ZM54 0h3l1 78q-2 6-3 0ZM82 0h5l-2 43q-2 7-3 0ZM132 0h4l-1 67q-2 5-2 0ZM165 0h3v34q-1 5-2 0ZM225 0h5l-2 78q-2 7-3 0ZM261 0h4l-1 52q-2 7-3 0ZM286 0h3l1 70q-2 7-3 0ZM355 0h4l-1 42q-2 7-2 0ZM377 0h3l1 64q-2 5-3 0Z" />
              </g>
            </svg>
          </h2>
          {/* «избранное» на маленькой бумажке, слегка правее и внахлёст
              на низ букв — как в макете. */}
          <span className="work__sub">избранное</span>
        </header>

        <div className="work__rows">
          {projects.map((project) => (
            <WorkCard
              key={project.id}
              project={project}
              onOpen={setOpen}
              motionEnabled={motionEnabled}
            />
          ))}
        </div>
      </div>

      <ReelPlayer project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
