import { useEffect, useRef, useState } from 'react';
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
  const sectionRef = useRef<HTMLElement>(null);

  /* WORK is a real stack of paper planes now. The section writes pixel
     offsets straight to CSS variables instead of re-rendering five videos
     on every scroll tick. Movement stays deliberately small: it should read
     as material depth, not as floating UI. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const properties = [
      '--work-base-y',
      '--work-rift-x',
      '--work-rift-y',
      '--work-rift-echo-x',
      '--work-rift-echo-y',
      '--work-detail-x',
      '--work-detail-y',
    ];
    const reset = () => properties.forEach((property) => section.style.setProperty(property, '0px'));

    if (!motionEnabled) {
      reset();
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < -viewport || rect.top > viewport * 2) return;

      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      const phase = (progress - 0.5) * 2;
      const px = (range: number) => `${(phase * range).toFixed(2)}px`;

      section.style.setProperty('--work-base-y', px(18));
      section.style.setProperty('--work-rift-x', px(7));
      section.style.setProperty('--work-rift-y', px(42));
      section.style.setProperty('--work-rift-echo-x', px(-4.5));
      section.style.setProperty('--work-rift-echo-y', px(31));
      section.style.setProperty('--work-detail-x', px(-5));
      section.style.setProperty('--work-detail-y', px(64));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reset();
    };
  }, [motionEnabled]);

  return (
    <section
      className="section section--work work work--rift"
      id="work"
      ref={sectionRef}
      data-paper-motion={motionEnabled ? 'on' : 'off'}
    >
      <SectionSeam id="section-edge-01" accent />

      {/* Separate raster planes replace the old flattened background. The
          second rift is only used on taller/narrower desktop canvases, where
          two uncropped fragments cover the route without stretching pixels. */}
      <div className="work__material" aria-hidden="true">
        <i className="work__layer work__layer--base" />
        <i className="work__layer work__layer--rift" />
        <i className="work__layer work__layer--rift-echo" />
      </div>

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
