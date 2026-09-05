import { about } from '../content/about';
import { MediaSlot } from './grunge/MediaSlot';
import { Tape } from './grunge/Tape';
import { Reveal } from './grunge/Reveal';
import { Scribble } from './grunge/Scribble';
import { TornEdge } from './grunge/TornEdge';
import './About.css';

/**
 * Блок «Обо мне».
 *
 * Фотографии собраны коллажем (реф «использование граффити с материалами
 * /IMG_0429»): два кадра под разными углами, приклеенные скотчем внахлёст,
 * с дуотон-обработкой в цвета сайта — чтобы любые исходники встали в палитру.
 *
 * Текст живой и от первого лица; {years} подставляется из контента, чтобы
 * стаж правился в одном месте.
 */
export function About() {
  const paragraphs = about.paragraphs.map((p) => p.replace('{years}', String(about.years)));
  // Дуотон и полутоновая сетка нужны только настоящим фотографиям: на пустом
  // слоте они гасят оформление заглушки до нечитаемой серой плашки.
  const portraitClass = about.photo.portrait.src ? 'is-toned' : '';
  const backstageClass = about.photo.backstage.src ? 'is-toned' : '';

  return (
    <section className="about section section--ink" id="about">
      {/* Сверху надрывается бумажный блок с опытом. */}
      <TornEdge side="top" color="var(--paper)" seed={64} height={58} />

      <div className="shell about__inner">
        {/* ---------- коллаж ---------- */}
        <Reveal mode="tear" className="about__media">
          <div className={`about__photo about__photo--main ${portraitClass}`}>
            <Tape angle={-9} width={140} style={{ top: -16, left: '18%' }} />
            <MediaSlot
              poster={about.photo.portrait.src || undefined}
              label={about.photo.portrait.label}
              hint={about.photo.portrait.hint}
              ratio="4 / 5"
            />
          </div>

          <div className={`about__photo about__photo--back ${backstageClass}`}>
            <Tape angle={7} width={110} tone="orange" style={{ top: -12, right: '14%' }} />
            <MediaSlot
              poster={about.photo.backstage.src || undefined}
              label={about.photo.backstage.label}
              hint={about.photo.backstage.hint}
              ratio="3 / 2"
            />
          </div>

          <span className="about__note u-hand">{about.note}</span>
          <Scribble kind="zigzag" className="about__zigzag" color="var(--orange)" width={210} delay={0.4} />
        </Reveal>

        {/* ---------- текст ---------- */}
        <div className="about__text">
          <Reveal mode="mask">
            <h2 className="about__title u-display">Обо мне</h2>
          </Reveal>

          <Reveal mode="jerk" delay={0.1}>
            <p className="about__lead u-display">{about.lead}</p>
          </Reveal>

          {paragraphs.map((p, i) => (
            <Reveal mode="jerk" delay={0.12 + i * 0.06} key={i}>
              <p className="about__p">{p}</p>
            </Reveal>
          ))}

          <Reveal mode="jerk" delay={0.4}>
            <dl className="about__facts">
              {about.facts.map((f) => (
                <div className="about__fact" key={f.k}>
                  <dt className="u-mono">{f.k}</dt>
                  <dd className="u-display">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
