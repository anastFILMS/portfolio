import { useState } from 'react';
import { projects, type Project } from '../content/projects';
import { useParallaxEnabled } from '../hooks/useParallax';
import { WorkCard } from './WorkCard';
import { ReelPlayer } from './ReelPlayer';
import { SectionSeam } from './grunge/SectionSeam';
import './Work.css';

/** Five directions tied together by one continuous torn orange rift.
 * Every direction has its own silhouette, while DOM order remains the
 * natural reading and keyboard order. */
export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const motionEnabled = useParallaxEnabled();

  return (
    <section className="section section--work work work--rift" id="work">
      <SectionSeam id="section-edge-01" accent />

      {/* One visual route through the whole section. The pale outer mask is
          the fibrous torn edge; the inner layer is the orange paper. */}
      <div className="work__rift" aria-hidden="true"><span /></div>

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
