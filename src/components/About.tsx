import { about } from '../content/about';
import { asset } from '../lib/asset';
import { SectionSeam } from './grunge/SectionSeam';
import { Reveal } from './grunge/Reveal';
import { Tape } from './grunge/Tape';
import './About.css';

/**
 * «Обо мне».
 *
 * На десктопе жёстко: коллаж только слева, сведения только справа. Общей
 * фотоленты на всю ширину с текстом снизу здесь быть не должно.
 *
 * Текст короткий и точный. Прежние четыре абзаца, стаж «5 лет», проценты
 * «съёмка/монтаж 50/50» и приписка на полях убраны — это были придуманные
 * сведения. Дописывать вместо них новые нельзя.
 */
export function About() {
  return (
    <section className="section section--about about" id="about">
      <SectionSeam id="section-edge-03" sheet="#101013" overlap={36} fiber={4} />

      <div className="shell about__shell">
        {/* Коллаж: высоту задаёт контейнер, чтобы абсолютные фото не
            наехали на текст под ними на телефоне. */}
        <div className="about__collage">
          {about.photos.map((photo, i) => (
            <figure className={`ph ph--${photo.role}`} key={photo.src}>
              <img
                className="ph__img"
                src={asset(photo.src)}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: photo.objectPosition }}
              />
              {/* Скотч по углу — не поперёк лица. */}
              <Tape angle={i % 2 ? 8 : -9} width={96} className="ph__tape" />
            </figure>
          ))}
        </div>

        <div className="about__text">
          <Reveal mode="rise">
            <h2 className="about__head u-graf">{about.heading}</h2>
          </Reveal>
          <Reveal mode="rise" delay={0.06}>
            <p className="about__name">{about.name}</p>
            <p className="about__role">{about.role}</p>
            <p className="about__body">{about.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
