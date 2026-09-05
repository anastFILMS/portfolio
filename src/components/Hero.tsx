import { site } from '../content/site';
import { MediaSlot } from './grunge/MediaSlot';
import { Marquee } from './grunge/Marquee';
import { Scribble } from './grunge/Scribble';
import { SprayTag } from './grunge/SprayTag';
import { Tape } from './grunge/Tape';
import { tornClipPath } from '../lib/rough';
import { Reveal } from './grunge/Reveal';
import './Hero.css';

/**
 * Первый экран.
 *
 * Задача по брифу — сразу отдать характер: динамика, видео, гранж, движение.
 * Поэтому имя набрано «в размер экрана», поверх него идёт спрей-тег с ролью,
 * справа висит панель под шоурил, а по углам — служебная разметка камеры
 * (REC, таймкод, уголки кадра), которая напоминает, чья это профессия.
 *
 * Обе кнопки из брифа стоят выше линии сгиба: «Смотреть работы» и «Написать».
 */
export function Hero() {
  const letters = site.name.split('');

  return (
    <section className="hero" id="top">
      {/* Фон: пятно распыла + служебная сетка кадра. */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__spray" />
        <div className="hero__grid" />
      </div>

      {/* Разметка видоискателя по углам экрана. */}
      <div className="hero__hud" aria-hidden="true">
        <span className="hero__hud-rec u-mono"><i />REC</span>
        <span className="hero__hud-tc u-mono">4K · 25 FPS</span>
      </div>

      <div className="hero__inner shell">
        <div className="hero__lead">
          {/* Имя: каждая буква едет из-под своей маски, с лёгким разбегом. */}
          <h1 className="hero__name u-display">
            <span className="sr-only">{site.name}</span>
            <span
              className="hero__letters"
              aria-hidden="true"
              style={{ '--len': letters.length } as React.CSSProperties}
            >
              {letters.map((ch, i) => (
                <span
                  // Пробел во flex-раскладке схлопывается в ноль, поэтому
                  // отдаём ему собственную ширину отдельным классом.
                  className={`hero__letter ${ch === ' ' ? 'hero__letter--space' : ''}`}
                  key={i}
                  style={{ '--d': `${i * 0.035}s` } as React.CSSProperties}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          </h1>

          {/* Роль написана баллончиком поверх имени — реф 0422. */}
          <SprayTag className="hero__tag" seed={11}>
            videographer
          </SprayTag>

          <Reveal mode="glitch" delay={0.35}>
            <p className="hero__role u-mono">{site.tagline}</p>
          </Reveal>

          <Reveal mode="jerk" delay={0.45}>
            <div className="hero__cta">
              <a className="btn btn--solid" href="#work">
                Смотреть работы
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>
              </a>
              <a className="btn btn--ghost" href="#contacts">
                Написать
                <Scribble kind="circle" className="btn__scribble" color="var(--orange)" width={190} />
              </a>
            </div>
          </Reveal>

          {/* Три ключевых слова лежат на оторванной полосе бумаги — первое
              место на странице, где появляется бумага, и оно сразу задаёт
              коллажную логику всего сайта (рефы 0421, 0424, 0428).
              Здесь рвётся сам элемент, поэтому края вырезаются clip-path,
              а не накладываются сверху, как на стыках секций. */}
          <Reveal mode="jerk" delay={0.55}>
            <div className="hero__strip" style={{ clipPath: tornClipPath(5) }}>
              <ul className="hero__keys u-mono">
                {site.keywords.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Панель под общий шоурил. По брифу он необязателен в первой версии —
            слот стоит и ждёт файл, до тех пор показывает оформленную заглушку. */}
        <Reveal mode="tear" delay={0.25} className="hero__media">
          <Tape angle={-8} width={150} className="hero__media-tape" style={{ top: -14, left: '12%' }} />
          <Tape angle={6} width={120} className="hero__media-tape" style={{ bottom: -12, right: '9%' }} />
          <MediaSlot
            label="Общий showreel"
            hint="15–40 сек · лучшие кадры · 16:9"
            ratio="4 / 5"
            autoPlay
          />
          <span className="hero__media-note u-hand">сюда — шоурил</span>
        </Reveal>
      </div>

      <a className="hero__scroll u-mono" href="#work" aria-label="К работам">
        <span>Листай</span>
        <span className="hero__scroll-bar" aria-hidden="true" />
      </a>

      <Marquee
        className="hero__marquee"
        items={['Интервью', 'Fashion', 'Репортаж', 'Мероприятия', 'Вертикаль', 'Многокамерка', 'Motion']}
        duration={30}
      />
    </section>
  );
}
