import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
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

const editorialEase = [0.22, 1, 0.36, 1] as const;

const revealUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: editorialEase },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      delay: Math.min(index, 5) * 0.065,
      ease: editorialEase,
    },
  }),
};

const heroSequence: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.09 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: editorialEase },
  },
};

const heroWord: Variants = {
  hidden: { y: '112%' },
  visible: {
    y: '0%',
    transition: { duration: 0.7, ease: editorialEase },
  },
};

export default function App() {
  useLenis();
  const shouldReduceMotion = useReducedMotion();
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [activeWork, setActiveWork] = useState<string | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLButtonElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const aboutPhotoRef = useRef<HTMLElement>(null);
  const skillsPhotoRef = useRef<HTMLElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerSpringX = useSpring(pointerX, { stiffness: 120, damping: 22, mass: 0.45 });
  const pointerSpringY = useSpring(pointerY, { stiffness: 120, damping: 22, mass: 0.45 });

  const { scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], [0, 38]);
  const heroImageScale = useTransform(heroProgress, [0, 1], [1.012, 1.045]);

  const { scrollYProgress: featuredProgress } = useScroll({
    target: featuredRef,
    offset: ['start end', 'end start'],
  });
  const featuredClip = useTransform(
    featuredProgress,
    [0, 0.42],
    ['inset(10% 0% 10% 0%)', 'inset(0% 0% 0% 0%)'],
  );
  const featuredImageY = useTransform(featuredProgress, [0, 1], [-12, 12]);

  const { scrollYProgress: workProgress } = useScroll({
    target: workRef,
    offset: ['start end', 'end start'],
  });
  const directionX = useTransform(workProgress, [0, 1], [-18, 18]);

  const { scrollYProgress: experienceProgress } = useScroll({
    target: experienceRef,
    offset: ['start end', 'end start'],
  });
  const experienceX1 = useTransform(experienceProgress, [0, 1], [-44, 26]);
  const experienceX2 = useTransform(experienceProgress, [0, 1], [32, -32]);
  const experienceX3 = useTransform(experienceProgress, [0, 1], [-26, 18]);

  const { scrollYProgress: aboutPhotoProgress } = useScroll({
    target: aboutPhotoRef,
    offset: ['start end', 'end start'],
  });
  const aboutPhotoY = useTransform(aboutPhotoProgress, [0, 1], [-12, 12]);

  const { scrollYProgress: skillsPhotoProgress } = useScroll({
    target: skillsPhotoRef,
    offset: ['start end', 'end start'],
  });
  const skillsPhotoY = useTransform(skillsPhotoProgress, [0, 1], [-12, 12]);

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

  const moveHero = (event: ReactPointerEvent<HTMLElement>) => {
    if (shouldReduceMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(horizontal * 20);
    pointerY.set(vertical * 12);
  };

  const resetHero = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="editorial-page" id="top">
        <motion.div
          className="motion-progress"
          aria-hidden="true"
          style={{ scaleX: shouldReduceMotion ? 0 : pageProgress }}
        />

        <a className="skip-link" href="#work">К работам</a>

        <main>
          <section
            className="ed-section hero"
            aria-labelledby="hero-title"
            ref={heroRef}
            onPointerMove={moveHero}
            onPointerLeave={resetHero}
          >
            <div className="hero-media" aria-hidden="true">
              <motion.div
                className="hero-pointer-layer"
                style={shouldReduceMotion ? undefined : { x: pointerSpringX, y: pointerSpringY }}
              >
                <motion.img
                  src={asset('media/about/about-shooting-bubbles.webp')}
                  alt=""
                  fetchPriority="high"
                  style={shouldReduceMotion ? undefined : { y: heroImageY, scale: heroImageScale }}
                />
              </motion.div>
              <span className="hero-media-shade" />
            </div>

            <motion.header
              className="site-header ed-shell"
              initial={shouldReduceMotion ? false : 'hidden'}
              animate="visible"
              variants={heroItem}
            >
              <a className="brand" href="#top" aria-label="anastFILMS — наверх">
                <span>anast</span><b>FILMS</b>
              </a>
              <nav aria-label="Основная навигация">
                <a href="#work">WORK</a>
                <a href="#experience">EXPERIENCE</a>
                <a href="#about">ABOUT</a>
                <a href="#contacts">CONTACT</a>
              </nav>
            </motion.header>

            <motion.div
              className="hero-copy ed-shell"
              initial={shouldReduceMotion ? false : 'hidden'}
              animate="visible"
              variants={heroSequence}
            >
              <motion.p className="side-note side-note--top" variants={heroItem}>STORIES<br />IN<br />MOTION</motion.p>
              <h1 id="hero-title" aria-label="Anastasia B.">
                <span className="hero-word-mask"><motion.span variants={heroWord}>ANASTASIA</motion.span></span>{' '}
                <span className="hero-word-mask hero-word-mask--last"><motion.span variants={heroWord}>B.</motion.span></span>
              </h1>
              <motion.p className="hero-role" variants={heroItem}>VIDEOGRAPHER&nbsp;&nbsp;/&nbsp;&nbsp;VIDEO EDITOR</motion.p>
              <motion.div className="hero-actions" variants={heroItem}>
                <a className="ed-button ed-button--solid" href="#work">Смотреть работы <span>→</span></a>
                <a className="ed-button" href="#contacts">Написать <span>→</span></a>
              </motion.div>
              <motion.p className="side-note side-note--bottom" variants={heroItem}>PEOPLE<br />PLACES<br />IDEAS<br />IN MOTION</motion.p>
            </motion.div>
          </section>

          <section className="ed-section work" id="work" aria-labelledby="work-title" ref={workRef}>
            <div className="ed-shell">
              <motion.div
                className="section-heading"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                variants={revealUp}
              >
                <h2 id="work-title">SELECTED WORK</h2>
                <p>Съёмка и монтаж историй о людях, событиях и движении.</p>
              </motion.div>

              <motion.button
                className="featured-work"
                type="button"
                ref={featuredRef}
                onClick={() => setActiveWork('SHOWREEL 2026')}
                aria-label="Открыть Showreel 2026"
                style={shouldReduceMotion ? undefined : { clipPath: featuredClip }}
              >
                <motion.span
                  className="featured-image-layer"
                  style={shouldReduceMotion ? undefined : { y: featuredImageY }}
                >
                  <img src={asset('media/about/reserve-event-hall.webp')} alt="Камера на съёмке официального мероприятия" />
                </motion.span>
                <span className="featured-overlay" />
                <motion.span className="play-mark" aria-hidden="true" whileHover={{ scale: 1.08 }}>▶</motion.span>
                <span className="featured-label">SHOWREEL&nbsp;&nbsp;2026</span>
                <span className="featured-tags">EVENTS<br />INTERVIEWS<br />FASHION<br />REPORTAGE</span>
              </motion.button>

              <div className="work-grid">
                {workItems.map((item, index) => (
                  <motion.button
                    className="work-tile"
                    type="button"
                    key={item.title}
                    custom={index}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={revealItem}
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
                  </motion.button>
                ))}
              </div>

              <motion.p
                className="direction-line"
                aria-label="Направления работы"
                style={shouldReduceMotion ? undefined : { x: directionX }}
              >
                INTERVIEW <span>/</span> FASHION <span>/</span> REPORTAGE <span>/</span> VERTICAL <span>/</span> MULTICAMERA <span>/</span> MOTION <span>/</span> EVENTS
              </motion.p>
            </div>
          </section>

          <section className="ed-section experience" id="experience" aria-labelledby="experience-title" ref={experienceRef}>
            <div className="experience-echo" aria-hidden="true">
              <motion.span style={shouldReduceMotion ? undefined : { x: experienceX1 }}>EXPERIENCE</motion.span>
              <motion.span style={shouldReduceMotion ? undefined : { x: experienceX2 }}>EXPERIENCE</motion.span>
              <motion.span style={shouldReduceMotion ? undefined : { x: experienceX3 }}>EXPERIENCE</motion.span>
            </div>
            <div className="ed-shell experience-inner">
              <motion.h2
                id="experience-title"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.45 }}
                variants={revealUp}
              >EXPERIENCE</motion.h2>
              <motion.div className="event-table" aria-live="polite" layout>
                <AnimatePresence>
                  {visibleEvents.map((event, index) => (
                    <motion.div
                      className="event-row"
                      key={event}
                      custom={index % 4}
                      initial={shouldReduceMotion ? false : 'hidden'}
                      whileInView="visible"
                      exit={{ opacity: 0, y: -14, transition: { duration: 0.2 } }}
                      viewport={{ once: true, amount: 0.25 }}
                      variants={revealItem}
                      layout="position"
                    >
                      <span className="event-number">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{event}</h3>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              {events.length > 4 && (
                <motion.button
                  className="ed-button event-more"
                  type="button"
                  aria-expanded={showAllEvents}
                  onClick={() => setShowAllEvents((value) => !value)}
                  layout
                >
                  {showAllEvents ? 'Скрыть' : 'Смотреть ещё'} <motion.span animate={{ rotate: showAllEvents ? 180 : 0 }}>↓</motion.span>
                </motion.button>
              )}
            </div>
          </section>

          <section className="ed-section about" id="about" aria-labelledby="about-title">
            <div className="ed-shell">
              <motion.div
                className="section-heading section-heading--about"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                variants={revealUp}
              >
                <h2 id="about-title">ABOUT ME</h2>
                <p>A CREATIVE<br />MIND BEHIND<br />THE CAMERA</p>
              </motion.div>

              <div className="about-layout">
                <motion.div
                  className="about-note"
                  aria-hidden="true"
                  initial={shouldReduceMotion ? false : { opacity: 0, rotate: -11, x: -18 }}
                  whileInView={{ opacity: 1, rotate: -7, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.42, ease: editorialEase }}
                >
                  живые<br />истории<br />важны
                  <motion.span
                    className="about-note-stroke"
                    initial={shouldReduceMotion ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.18, ease: editorialEase }}
                  />
                </motion.div>
                <motion.figure
                  className="about-photo"
                  ref={aboutPhotoRef}
                  initial={shouldReduceMotion ? false : { clipPath: 'inset(0% 100% 0% 0%)' }}
                  whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.68, ease: editorialEase }}
                >
                  <motion.span
                    className="photo-parallax-layer"
                    style={shouldReduceMotion ? undefined : { y: aboutPhotoY }}
                  >
                    <img src={asset('media/about/about-speaking.webp')} alt="Анастасия Бричко на сцене с микрофоном" />
                  </motion.span>
                </motion.figure>
                <motion.div
                  className="about-copy"
                  initial={shouldReduceMotion ? false : 'hidden'}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.22 }}
                  variants={heroSequence}
                >
                  <motion.p className="about-lead" variants={heroItem}>
                    Привет, я Анастасия —<br />видеограф и монтажёр<br />из{' '}
                    <span className="about-city">Москвы.<motion.i
                      aria-hidden="true"
                      initial={shouldReduceMotion ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.48, delay: 0.24, ease: editorialEase }}
                    /></span>
                  </motion.p>
                  <motion.div className="about-columns" variants={heroItem}>
                    <p>Снимаю мероприятия, интервью и медиапроекты. В кадре ищу живые эмоции, детали и честную динамику.</p>
                    <p>Веду работу от съёмки до финального монтажа. Работаю с многокамерным, вертикальным контентом и motion-графикой.</p>
                  </motion.div>
                  <motion.p className="signature" variants={heroItem}>Anastasia B.</motion.p>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="ed-section skills" id="skills" aria-labelledby="skills-title">
            <div className="ed-shell skills-layout">
              <motion.div
                className="skills-title-block"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                variants={revealUp}
              >
                <h2 id="skills-title">SKILLS</h2>
                <p>PREMIERE PRO<br />AFTER EFFECTS<br />DAVINCI RESOLVE</p>
              </motion.div>
              <motion.figure
                className="skills-photo"
                ref={skillsPhotoRef}
                initial={shouldReduceMotion ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.62, ease: editorialEase }}
              >
                <motion.span
                  className="photo-parallax-layer"
                  style={shouldReduceMotion ? undefined : { y: skillsPhotoY }}
                >
                  <img src={asset('media/about/reserve-shooting-brick.webp')} alt="Съёмка с камерой" />
                </motion.span>
              </motion.figure>
              <div className="skills-list">
                {skills.map(([name, action], index) => (
                  <motion.div
                    className="skill-row"
                    key={name}
                    custom={index}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={revealItem}
                  >
                    <strong>{name}</strong>
                    <span>{action}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <motion.footer className="ed-section contacts" id="contacts" aria-labelledby="contacts-title">
            <motion.span
              className="contacts-reveal-curtain"
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { y: 0 }}
              whileInView={{ y: '-101%' }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.72, ease: editorialEase }}
            />
            <motion.div
              className="ed-shell contacts-inner"
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={heroSequence}
            >
              <motion.p className="contacts-kicker" variants={heroItem}>IDEAS<br />PEOPLE<br />PROJECTS<br />LET'S TALK</motion.p>
              <h2 id="contacts-title" aria-label="Let's work">
                <span className="contact-word-mask"><motion.span variants={heroWord}>LET'S</motion.span></span>{' '}
                <span className="contact-word-mask"><motion.span variants={heroWord}>WORK</motion.span></span>
              </h2>
              <motion.p className="contacts-note" variants={heroItem}>Контакты скоро появятся</motion.p>
              <motion.div className="contact-links" aria-label="Контакты пока не опубликованы" variants={heroItem}>
                <span>TELEGRAM</span>
                <span>VK</span>
                <span>EMAIL</span>
              </motion.div>
              <motion.a className="footer-brand" href="#top" variants={heroItem}><span>anast</span><b>FILMS</b></motion.a>
              <motion.p className="copyright" variants={heroItem}>© 2026 ANASTASIA B.<br />ALL RIGHTS RESERVED</motion.p>
            </motion.div>
          </motion.footer>
        </main>

        <AnimatePresence>
          {activeWork && (
            <motion.div
              className="work-modal"
              role="presentation"
              key="work-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onMouseDown={() => setActiveWork(null)}
            >
              <motion.section
                className="work-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                initial={{ opacity: 0, y: 28, clipPath: 'inset(8% 0% 0% 0%)' }}
                animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, y: 18, clipPath: 'inset(0% 0% 8% 0%)' }}
                transition={{ duration: 0.34, ease: editorialEase }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <button className="dialog-close" type="button" onClick={() => setActiveWork(null)} aria-label="Закрыть">×</button>
                <p>ANASTFILMS / WORK</p>
                <h2 id="dialog-title">{activeWork}</h2>
                <p className="dialog-message">Шоурил скоро появится.</p>
                <button className="ed-button ed-button--solid" type="button" onClick={() => setActiveWork(null)}>Понятно</button>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
