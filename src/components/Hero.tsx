import { useEffect, useState } from 'react';
import { MediaSlot } from './grunge/MediaSlot';
import { Marquee } from './grunge/Marquee';
import { Sticker } from './grunge/Sticker';
import './Hero.css';

/**
 * Первый экран — раскладка снята с рефа URDA.
 *
 * Имя разнесено по краям: ANASTASIA слева, BRICHKO справа, между ними
 * вылетает камера — на месте ноги из рефа. Камера снята «на 0.5× fish eye»,
 * то есть объектив идёт на зрителя, а края кадра завалены.
 *
 * Всё лишнее убрано по правкам: верхняя навигация, мелкие подписи по углам,
 * «съёмка / монтаж 50 / 50» и бумажные подложки под надписями. Навигация
 * вернётся ниже по странице отдельным блоком.
 */
export function Hero() {
  const [shift, setShift] = useState(0);

  // Граффити наезжает на зрителя при скролле (реф 2825).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setShift(Math.min(1, window.scrollY / window.innerHeight));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__spray" />
        <div className="hero__grain" />
        <div className="hero__scan" />
      </div>

      <div className="hero__core">
        <h1 className="hero__title">
          <span className="sr-only">Anastasia Brichko — видеограф и монтажёр</span>
          <span className="hero__name hero__name--first" aria-hidden="true">Anastasia</span>
          <span className="hero__name hero__name--last" aria-hidden="true">Brichko</span>
        </h1>

        {/* Камера на месте ноги из рефа: вылетает на зрителя между словами.
            Файл кладётся в public/media/camera.png уже обработанным —
            см. scripts/fisheye.py, там пересчёт под 0.5× fish eye. */}
        <div className="hero__cam">
          <MediaSlot
            label="Камера"
            hint="PNG без фона · fish eye 0.5×"
            ratio="1 / 1"
            poster="media/camera.png"
          />
        </div>
      </div>

      {/* Нижний левый угол — там, где в рефе стоит фотография. */}
      <div className="hero__corner">
        <p className="hero__lead u-label">
          Снимаю и динамично монтирую.<br />
          Крупные мероприятия и медиапроекты.
        </p>
        <div className="hero__cta">
          <a className="btn btn--solid" href="#work">Смотреть работы</a>
          <a className="btn btn--ghost" href="#contacts">Написать</a>
        </div>
      </div>

      <div
        className="hero__deco"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${shift * -70}px, 0) scale(${1 + shift * 0.25})`, opacity: 1 - shift * 0.55 }}
      >
        <Sticker src="tags/big-4" w={380} rot={7}  color="var(--orange)" style={{ bottom: '18%', right: '-6%' }} />
        <Sticker src="tags/big-6" w={200} rot={-14} color="var(--paper)" opacity={0.55} style={{ top: '12%', right: '12%' }} />
        <Sticker src="marks/star-spray" w={120} rot={-12} color="var(--orange)" mobile className="hero__star" style={{ bottom: '30%', left: '6%' }} />
        <Sticker src="marks/asterisk"   w={54}  rot={0}   color="var(--orange)" style={{ top: '22%', left: '13%' }} />
        <Sticker src="marks/circle-x"   w={48}  rot={12}  color="var(--paper)" opacity={0.5} style={{ bottom: '14%', right: '26%' }} />
      </div>

      <Marquee
        className="hero__marquee"
        items={['Интервью', 'Fashion', 'Репортаж', 'Мероприятия', 'Вертикаль', 'Многокамерка', 'Motion']}
        duration={28}
      />
    </section>
  );
}
