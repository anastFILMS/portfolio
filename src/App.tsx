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
import { usePageScroll } from './hooks/usePageScroll';
import { asset } from './lib/asset';
import { VideoGallery } from './components/VideoGallery';

const workItems = [
  { number: '01', title: 'FASHION', note: 'Стиль / движение', cover: 'fashion', fit: 'cover' },
  { number: '02', title: 'MOTION', note: 'Типографика / анимация', cover: 'motion', fit: 'cover' },
  { number: '03', title: 'PERFORMANCE', note: 'Сцена / энергия', cover: 'performance', fit: 'cover' },
  { number: '04', title: 'PROMO', note: 'Идея / впечатление', cover: 'promo', fit: 'cover' },
  { number: '05', title: 'REELS', note: 'Ритм / переходы', cover: 'reels', fit: 'cover' },
  { number: '06', title: 'REPORTAGE', note: 'События / эмоции', cover: 'reportage', fit: 'cover' },
];

const events = [
  { title: 'Московская неделя моды' },
  { title: 'Российский форум индустрии дизайна' },
  { title: '105-летие РГУ им. А. Н. Косыгина' },
  { title: 'Концерт Димы Билана' },
  { title: '«Росфантастика»', detail: 'В музее «Атом»' },
  { title: 'Посвящение в первокурсники' },
  { title: 'Выпускной Института дизайна' },
  { title: '«Погружение»' },
  { title: '«Таланты»' },
  { title: '«Битва институтов»' },
];

const skills = [
  ['CAMERA', 'Съёмка'],
  ['EDITING', 'Монтаж'],
  ['MULTICAMERA', 'Синхронизация'],
  ['MOTION', 'Графика'],
  ['SFX', 'Звуковые эффекты'],
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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: editorialEase },
  },
};

export default function App() {
  usePageScroll();
  const shouldReduceMotion = useReducedMotion();
  const [isCompactViewport, setIsCompactViewport] = useState(() => window.matchMedia('(max-width: 680px)').matches);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [activeWork, setActiveWork] = useState<string | null>(null);

  const shouldDisableMotion = Boolean(shouldReduceMotion || isCompactViewport);

  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const skillsPhotoRef = useRef<HTMLElement>(null);
  const workTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  const { scrollYProgress: skillsPhotoProgress } = useScroll({
    target: skillsPhotoRef,
    offset: ['start end', 'end start'],
  });
  const skillsPhotoY = useTransform(skillsPhotoProgress, [0, 1], [-12, 12]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 680px)');
    const sync = () => setIsCompactViewport(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!activeWork) return;
    const trigger = workTriggerRef.current;
    const pageMain = document.querySelector('main');
    const mainWasInert = pageMain?.hasAttribute('inert') ?? false;
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveWork(null);
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], video[controls], iframe, [tabindex]:not([tabindex="-1"])'),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add('is-locked');
    pageMain?.setAttribute('inert', '');
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.classList.remove('is-locked');
      if (!mainWasInert) pageMain?.removeAttribute('inert');
      document.removeEventListener('keydown', onKeyDown);
      requestAnimationFrame(() => trigger?.focus());
    };
  }, [activeWork]);


  const moveHero = (event: ReactPointerEvent<HTMLElement>) => {
    if (shouldDisableMotion || event.pointerType !== 'mouse') return;
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

  const openWork = (title: string, trigger: HTMLButtonElement) => {
    workTriggerRef.current = trigger;
    setActiveWork(title);
  };

  const toggleEvents = () => setShowAllEvents((value) => !value);

  return (
    <MotionConfig reducedMotion={shouldDisableMotion ? 'always' : 'user'}>
      <div className="editorial-page" id="top">
        <motion.div
          className="motion-progress"
          aria-hidden="true"
          style={{ scaleX: shouldDisableMotion ? 0 : pageProgress }}
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
                style={shouldDisableMotion ? undefined : { x: pointerSpringX, y: pointerSpringY }}
              >
                <motion.img
                  src={asset('media/about/hero-camera-portrait.webp')}
                  alt=""
                  fetchPriority="high"
                  decoding="async"
                  style={shouldDisableMotion ? undefined : { y: heroImageY, scale: heroImageScale }}
                />
              </motion.div>
              <span className="hero-media-shade" />
            </div>

            <motion.header
              className="site-header ed-shell"
              initial={shouldDisableMotion ? false : 'hidden'}
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
              initial={shouldDisableMotion ? false : 'hidden'}
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
                initial={shouldDisableMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                variants={revealUp}
              >
                <h2 id="work-title">SELECTED WORK</h2>
                <p>Съёмка и монтаж историй о людях, событиях и движении.</p>
              </motion.div>

              <div className="work-grid">
                {workItems.map((item, index) => (
                  <motion.button
                    className="work-tile"
                    type="button"
                    key={item.title}
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.65, ease: editorialEase }}
                    onClick={(event) => openWork(item.title, event.currentTarget)}
                    aria-label={`Открыть подборку ${item.title}`}
                  >
                    <span className="work-photo">
                      <img src={asset(`media/covers/${item.cover}.webp`)} data-fit={item.fit} alt="" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                      <span className="work-photo-shade" />
                    </span>
                    <span className="work-caption">
                      <b>{item.title}</b>
                      <small>{item.note}</small>
                      <span className="work-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
                    </span>
                  </motion.button>
                ))}
              </div>

              <p className="full-works"><a className="ed-button" href="https://drive.google.com/drive/folders/1hl57Gqj79NJ3D88tBdiQsRzizuuK_IUd?usp=sharing" target="_blank" rel="noopener noreferrer">Полные версии работ ↗</a></p>

              <motion.p
                className="direction-line"
                aria-label="Направления работы"
                style={shouldDisableMotion ? undefined : { x: directionX }}
              >
                FASHION <span>/</span> MOTION <span>/</span> PERFORMANCE <span>/</span> PROMO <span>/</span> REELS <span>/</span> REPORTAGE
              </motion.p>
            </div>
          </section>

          <section className="ed-section experience" id="experience" aria-labelledby="experience-title" ref={experienceRef}>
            <div className="experience-echo" aria-hidden="true">
              <motion.span style={shouldDisableMotion ? undefined : { x: experienceX1 }}>EXPERIENCE</motion.span>
              <motion.span style={shouldDisableMotion ? undefined : { x: experienceX2 }}>EXPERIENCE</motion.span>
              <motion.span style={shouldDisableMotion ? undefined : { x: experienceX3 }}>EXPERIENCE</motion.span>
            </div>
            <div className="ed-shell experience-inner">
              <motion.h2
                id="experience-title"
                initial={shouldDisableMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.45 }}
                variants={revealUp}
              >EXPERIENCE</motion.h2>
              <div className="event-tables" id="event-table">
                <div className="event-table">
                  {events.slice(0, 4).map((event, index) => (
                    <div className="event-row" key={event.title}>
                      <span className="event-number">{String(index + 1).padStart(2, '0')}</span>
                      <div className="event-name"><h3>{event.title}</h3>{event.detail && <p>{event.detail}</p>}</div>
                    </div>
                  ))}
                </div>
                <AnimatePresence initial={false}>
                  {showAllEvents && <motion.div className="event-extra" key="extra-events"
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    transition={{ duration: shouldDisableMotion ? 0 : 0.5, ease: editorialEase }}>
                    <motion.div className="event-table"
                      initial={{ opacity: 0, y: shouldDisableMotion ? 0 : 10, filter: shouldDisableMotion ? 'none' : 'blur(7px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 0, filter: shouldDisableMotion ? 'none' : 'blur(5px)' }}
                      transition={{ duration: shouldDisableMotion ? 0 : 0.4, ease: editorialEase }}>
                      {events.slice(4).map((event, index) => (
                        <div className="event-row" key={event.title}>
                          <span className="event-number">{String(index + 5).padStart(2, '0')}</span>
                          <div className="event-name"><h3>{event.title}</h3>{event.detail && <p>{event.detail}</p>}</div>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>}
                </AnimatePresence>
              </div>
              {events.length > 4 && (
                <motion.button
                  className="ed-button event-more"
                  type="button"
                  aria-expanded={showAllEvents}
                  aria-controls="event-table"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={toggleEvents}
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
                initial={shouldDisableMotion ? false : 'hidden'}
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
                  initial={shouldDisableMotion ? false : { opacity: 0, rotate: -11, x: -18 }}
                  whileInView={{ opacity: 1, rotate: -7, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.42, ease: editorialEase }}
                >
                  живые<br />истории<br />важны
                  <motion.span
                    className="about-note-stroke"
                    initial={shouldDisableMotion ? false : { scaleX: 0, rotate: -7 }}
                    whileInView={{ scaleX: 1, rotate: -7 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.18, ease: editorialEase }}
                  />
                </motion.div>
                <motion.figure
                  className="about-photo about-photo--scrapbook"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.85, ease: editorialEase }}
                >
                  <img src={asset('media/about/about-scrapbook.webp')} alt="Анастасия Бричко — портрет с белым краем рваной бумаги" loading="lazy" decoding="async" />
                </motion.figure>
                <motion.div
                  className="about-copy"
                  initial={shouldDisableMotion ? false : 'hidden'}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.22 }}
                  variants={heroSequence}
                >
                  <motion.p className="about-lead" variants={heroItem}>
                    Привет, я Анастасия —<br />видеограф и монтажёр<br />из{' '}
                    <span className="about-city">Москвы.<motion.i
                      aria-hidden="true"
                      initial={shouldDisableMotion ? false : { scaleX: 0, rotate: -2 }}
                      whileInView={{ scaleX: 1, rotate: -2 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.48, delay: 0.24, ease: editorialEase }}
                    /></span>
                  </motion.p>
                  <motion.div className="about-columns" variants={heroItem}>
                    <p>Снимаю мероприятия, интервью и медиапроекты. В кадре ищу живые эмоции, детали и честную динамику.</p>
                    <p>Веду работу от съёмки до финального монтажа. Работаю с многокамерным, вертикальным контентом и motion-графикой.</p>
                  </motion.div>
                  <motion.div className="signature-motion" variants={heroItem}>
                    <p className="signature">Anastasia B.</p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="ed-section skills" id="skills" aria-labelledby="skills-title">
            <div className="ed-shell skills-layout">
              <motion.div
                className="skills-title-block"
                initial={shouldDisableMotion ? false : 'hidden'}
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
                initial={shouldDisableMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.62, ease: editorialEase }}
              >
                <motion.span
                  className="photo-parallax-layer"
                  style={shouldDisableMotion ? undefined : { y: skillsPhotoY }}
                >
                  <img src={asset('media/about/reserve-shooting-brick.webp')} alt="Съёмка с камерой" loading="lazy" decoding="async" />
                </motion.span>
              </motion.figure>
              <div className="skills-list">
                {skills.map(([name, action], index) => (
                  <motion.div
                    className="skill-row"
                    key={name}
                    custom={index}
                    initial={shouldDisableMotion ? false : 'hidden'}
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
            <motion.div
              className="ed-shell contacts-inner"
              initial={shouldDisableMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={heroSequence}
            >
              <motion.p className="contacts-kicker" variants={heroItem}>IDEAS<br />PEOPLE<br />PROJECTS<br />LET'S TALK</motion.p>
              <h2 id="contacts-title" aria-label="Let's work">
                <span className="contact-word-mask"><motion.span variants={heroWord}>LET'S</motion.span></span>{' '}
                <span className="contact-word-mask"><motion.span variants={heroWord}>WORK</motion.span></span>
              </h2>
              <motion.p className="contacts-note" variants={heroItem}>Напиши мне о проекте</motion.p>
              <motion.div className="contact-links" aria-label="Способы связи" variants={heroItem}>
                <a href="https://t.me/linkhll" target="_blank" rel="noopener noreferrer">TELEGRAM<span>@linkhll</span></a>
                <a href="https://vk.ru/linkhll" target="_blank" rel="noopener noreferrer">VK<span>linkhll</span></a>
                <a href="mailto:anaaasteish@mail.ru">EMAIL<span>anaaasteish@mail.ru</span></a>
              </motion.div>
              <motion.a className="footer-brand" href="#top" variants={heroItem}><span>anast</span><b>FILMS</b></motion.a>
              <motion.a className="back-to-top ed-button" href="#top" variants={heroItem}>НАВЕРХ ↑</motion.a>
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
                className="work-dialog work-dialog--gallery"
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                tabIndex={-1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.34, ease: editorialEase }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <button ref={closeButtonRef} className="dialog-close" type="button" onClick={() => setActiveWork(null)} aria-label="Закрыть">×</button>
                <p>ANASTFILMS / WORK</p>
                <h2 id="dialog-title">{activeWork}</h2>
                <VideoGallery key={activeWork} category={activeWork} note={workItems.find(i => i.title === activeWork)?.note ?? ''} />
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
