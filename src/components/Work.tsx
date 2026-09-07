import { useState } from 'react';
import { projects, type Project } from '../content/projects';
import { useParallaxEnabled } from '../hooks/useParallax';
import { WorkCard } from './WorkCard';
import { ReelPlayer } from './ReelPlayer';
import { SectionSeam } from './grunge/SectionSeam';
import { PaintDrips } from './grunge/PaintDrips';
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
      <SectionSeam id="section-edge-01" sheet="#101013" overlap={54} accent />

      <div className="shell">
        <header className="work__masthead">
          <h2 className="work__title u-cond">
            WORK
            {/* Краска стекает с букв — на макете это главная примета
                заголовка раздела. */}
            <PaintDrips seed={41} count={11} className="work__drips" />
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
