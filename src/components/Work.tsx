import { useState } from 'react';
import { projects, type Project } from '../content/projects';
import { useParallaxEnabled } from '../hooks/useParallax';
import { WorkCard } from './WorkCard';
import { ReelPlayer } from './ReelPlayer';
import { SectionSeam } from './grunge/SectionSeam';
import './Work.css';

/** Five directions tied together by one continuous physical paper collage.
 * The background owns the rift and material depth; every direction stays
 * live HTML/media with a natural reading and keyboard order. */
export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const motionEnabled = useParallaxEnabled();

  return (
    <section className="section section--work work work--rift" id="work">
      <SectionSeam id="section-edge-01" accent />

      {/* A text-free material plate: crumpled navy paper, exposed orange
          underlayer, torn fibres and pasted seams. It replaces the flat CSS
          stripe while all meaningful content stays selectable and live. */}
      <div className="work__rift" aria-hidden="true" />

      {/* Loose fragments sit between the material plate and the projects.
          Their only job is to make the photographs feel physically pasted
          into one scrapbook spread rather than arranged as clean cards. */}
      <div className="work__scraps" aria-hidden="true">
        <i className="work__scrap work__scrap--1" />
        <i className="work__scrap work__scrap--2" />
        <i className="work__scrap work__scrap--3" />
        <i className="work__scrap work__scrap--4" />
        <i className="work__scrap work__scrap--5" />
        <i className="work__scrap work__scrap--6" />
        <i className="work__scrap work__scrap--7" />
      </div>

      <div className="shell">
        <header className="work__masthead">
          <h2 className="work__title u-cond"><span>WORK</span></h2>
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
