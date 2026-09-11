import { useEffect, useState } from 'react';
import { useLenis, lenisControl } from './hooks/useLenis';
import { asset } from './lib/asset';

const workItems = [
  {
    number: '01',
    title: 'INTERVIEW',
    note: 'Люди / диалог',
    image: 'media/about/reserve-interview-studio.webp',
    position: '50% 55%',
  },
  {
    number: '02',
    title: 'FASHION',
    note: 'Стиль / движение',
    image: 'media/projects/illustrative-lens.webp',
    position: '52% 50%',
  },
  {
    number: '03',
    title: 'REPORTAGE',
    note: 'События / эмоции',
    image: 'media/about/about-shooting-bubbles.webp',
    position: '58% 50%',
  },
];

const events = [
  'Московская неделя моды',
  'Российский форум индустрии дизайна',
  '105-летие РГУ им. А. Н. Косыгина',
  '«Битва институтов»',
  '«Таланты»',
  '«Росфантастика»',
  '«Погружение»',
  'Выпускной Института дизайна',
  '«Мисс и мистер»',
];

const skills = [
  ['CAMERA', 'Съёмка'],
  ['EDITING', 'Монтаж'],
  ['MULTICAMERA', 'Синхронизация'],
  ['MOTION', 'Графика'],
  ['PRODUCTION', 'Организация'],
];

export default function App() {
  useLenis();
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [activeWork, setActiveWork] = useState<string | null>(null);

  useEffect(() => {
    if (!activeWork) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveWork(null);
    };
    document.body.classList.add('is-locked');
    lenisControl.stop();
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('is-locked');
      lenisControl.start();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeWork]);

  const visibleEvents = showAllEvents ? events : events.slice(0, 4);

  return (
    <div className="editorial-page" id="top">
      <a className="skip-link" href="#work">К работам</a>

      <main>
        <section className="ed-section hero" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <img
              src={asset('media/about/about-shooting-bubbles.webp')}
              alt=""
              fetchPriority="high"
            />
            <span className="hero-media-shade" />
          </div>

          <header className="site-header ed-shell">
            <a className="brand" href="#top" aria-label="anastFILMS — наверх">
              <span>anast</span><b>FILMS</b>
            </a>
            <nav aria-label="Основная навигация">
              <a href="#work">WORK</a>
              <a href="#experience">EXPERIENCE</a>
              <a href="#about">ABOUT</a>
              <a href="#contacts">CONTACT</a>
            </nav>
          </header>

          <div className="hero-copy ed-shell">
            <p className="side-note side-note--top">STORIES<br />IN<br />MOTION</p>
            <h1 id="hero-title" aria-label="Anastasia B.">
              ANASTASIA <span>B.</span>
            </h1>
            <p className="hero-role">VIDEOGRAPHER&nbsp;&nbsp;/&nbsp;&nbsp;VIDEO EDITOR</p>
            <div className="hero-actions">
              <a className="ed-button ed-button--solid" href="#work">Смотреть работы <span>→</span></a>
              <a className="ed-button" href="#contacts">Написать <span>→</span></a>
            </div>
            <p className="side-note side-note--bottom">PEOPLE<br />PLACES<br />IDEAS<br />IN MOTION</p>
          </div>
        </section>

        <section className="ed-section work" id="work" aria-labelledby="work-title">
          <div className="ed-shell">
            <div className="section-heading">
              <h2 id="work-title">SELECTED WORK</h2>
              <p>Съёмка и монтаж историй о людях, событиях и движении.</p>
            </div>

            <button
              className="featured-work"
              type="button"
              onClick={() => setActiveWork('SHOWREEL 2026')}
              aria-label="Открыть Showreel 2026"
            >
              <img src={asset('media/about/reserve-event-hall.webp')} alt="Камера на съёмке официального мероприятия" />
              <span className="featured-overlay" />
              <span className="play-mark" aria-hidden="true">▶</span>
              <span className="featured-label">SHOWREEL&nbsp;&nbsp;2026</span>
              <span className="featured-tags">EVENTS<br />INTERVIEWS<br />FASHION<br />REPORTAGE</span>
            </button>

            <div className="work-grid">
              {workItems.map((item) => (
                <button
                  className="work-tile"
                  type="button"
                  key={item.title}
                  onClick={() => setActiveWork(item.title)}
                  aria-label={`Открыть подборку ${item.title}`}
                >
                  <span className="work-photo">
                    <img src={asset(item.image)} alt="" style={{ objectPosition: item.position }} />
                    <span className="work-photo-shade" />
                  </span>
                  <span className="work-caption">
                    <b>{item.title}</b>
                    <small>{item.note}</small>
                    <i>{item.number}</i>
                  </span>
                </button>
              ))}
            </div>

            <p className="direction-line" aria-label="Направления работы">
              INTERVIEW <span>/</span> FASHION <span>/</span> REPORTAGE <span>/</span> VERTICAL <span>/</span> MULTICAMERA <span>/</span> MOTION <span>/</span> EVENTS
            </p>
          </div>
        </section>

        <section className="ed-section experience" id="experience" aria-labelledby="experience-title">
          <div className="experience-echo" aria-hidden="true">EXPERIENCE<br />EXPERIENCE<br />EXPERIENCE</div>
          <div className="ed-shell experience-inner">
            <h2 id="experience-title">EXPERIENCE</h2>
            <div className="event-table" aria-live="polite">
              {visibleEvents.map((event, index) => (
                <div className="event-row" key={event}>
                  <span className="event-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{event}</h3>
                </div>
              ))}
            </div>
            {events.length > 4 && (
              <button
                className="ed-button event-more"
                type="button"
                aria-expanded={showAllEvents}
                onClick={() => setShowAllEvents((value) => !value)}
              >
                {showAllEvents ? 'Скрыть' : 'Смотреть ещё'} <span>{showAllEvents ? '↑' : '↓'}</span>
              </button>
            )}
          </div>
        </section>

        <section className="ed-section about" id="about" aria-labelledby="about-title">
          <div className="ed-shell">
            <div className="section-heading section-heading--about">
              <h2 id="about-title">ABOUT ME</h2>
              <p>A CREATIVE<br />MIND BEHIND<br />THE CAMERA</p>
            </div>

            <div className="about-layout">
              <div className="about-note" aria-hidden="true">живые<br />истории<br />важны</div>
              <figure className="about-photo">
                <img src={asset('media/about/about-speaking.webp')} alt="Анастасия Бричко на сцене с микрофоном" />
              </figure>
              <div className="about-copy">
                <p className="about-lead">Привет, я Анастасия —<br />видеограф и монтажёр<br />из <span>Москвы.</span></p>
                <div className="about-columns">
                  <p>Снимаю мероприятия, интервью и медиапроекты. В кадре ищу живые эмоции, детали и честную динамику.</p>
                  <p>Веду работу от съёмки до финального монтажа. Работаю с многокамерным, вертикальным контентом и motion-графикой.</p>
                </div>
                <p className="signature">Anastasia B.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ed-section skills" id="skills" aria-labelledby="skills-title">
          <div className="ed-shell skills-layout">
            <div className="skills-title-block">
              <h2 id="skills-title">SKILLS</h2>
              <p>PREMIERE PRO<br />AFTER EFFECTS<br />DAVINCI RESOLVE</p>
            </div>
            <figure className="skills-photo">
              <img src={asset('media/about/reserve-shooting-brick.webp')} alt="Съёмка с камерой" />
            </figure>
            <div className="skills-list">
              {skills.map(([name, action]) => (
                <div className="skill-row" key={name}>
                  <strong>{name}</strong>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="ed-section contacts" id="contacts" aria-labelledby="contacts-title">
          <div className="ed-shell contacts-inner">
            <p className="contacts-kicker">IDEAS<br />PEOPLE<br />PROJECTS<br />LET'S TALK</p>
            <h2 id="contacts-title">LET'S WORK</h2>
            <p className="contacts-note">Контакты скоро появятся</p>
            <div className="contact-links" aria-label="Контакты пока не опубликованы">
              <span>TELEGRAM</span>
              <span>VK</span>
              <span>EMAIL</span>
            </div>
            <a className="footer-brand" href="#top"><span>anast</span><b>FILMS</b></a>
            <p className="copyright">© 2026 ANASTASIA B.<br />ALL RIGHTS RESERVED</p>
          </div>
        </footer>
      </main>

      {activeWork && (
        <div className="work-modal" role="presentation" onMouseDown={() => setActiveWork(null)}>
          <section
            className="work-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="dialog-close" type="button" onClick={() => setActiveWork(null)} aria-label="Закрыть">×</button>
            <p>ANASTFILMS / WORK</p>
            <h2 id="dialog-title">{activeWork}</h2>
            <p className="dialog-message">Шоурил скоро появится.</p>
            <button className="ed-button ed-button--solid" type="button" onClick={() => setActiveWork(null)}>Понятно</button>
          </section>
        </div>
      )}
    </div>
  );
}
