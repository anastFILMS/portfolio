import { useEffect, useState } from 'react';
import { site } from '../content/site';
import { Marquee } from './grunge/Marquee';
import { Sticker } from './grunge/Sticker';
import { PaperScrap } from './grunge/PaperScrap';
import './Hero.css';

/**
 * Первый экран.
 *
 * Скрапбукинг по рефу URDA: надписи наклеены на рваные клочки бумаги под
 * разными углами и вылезают и за края бумаги, и за края экрана. Кадр-квадрат
 * убран — позже на его месте будет полноэкранное видео с прозрачностью,
 * поэтому композиция уже сейчас держится без него.
 *
 * Имя набрано присланным шрифтом Guano Apes, по-русски.
 *
 * ОТЛОЖЕНО, держим в уме:
 *  1. На месте убранного квадрата будет полноэкранное видео с прозрачностью —
 *     фон и надписи должны остаться читаемыми поверх него, поэтому клочки
 *     бумаги уже сейчас непрозрачные, а не полупрозрачные.
 *  2. Появление имени: при заходе на сайт «АНАСТАСИЯ Б. ВИДЕОГРАФ» пишется
 *     баллончиком. Реализуется маской по ходу штриха поверх готовой надписи,
 *     верстку менять не придётся.
 */
export function Hero() {
  const [shift, setShift] = useState(0);

  // «На человека параллаксом наезжают граффити» (реф 2825): при скролле
  // слой тегов идёт навстречу зрителю быстрее остального.
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

      <div className="hero__meta u-label" aria-hidden="true">
        <span>Videographer<br />&amp; Editor</span>
        <span className="hero__rec u-tech"><i />REC · 4K · 25 FPS</span>
        <span className="hero__meta-right">{site.city}<br />MMXXVI</span>
      </div>

      <div className="hero__core">
        <h1 className="hero__title">
          <span className="sr-only">Анастасия Б. — видеограф и монтажёр, {site.city}</span>

          {/* Имя на клочке бумаги. Буквы намеренно шире бумажки и упираются
              в края экрана — «надписи выходят за рамки». */}
          <PaperScrap className="hero__scrap hero__scrap--name" seed={17} rot={-2.6} depth={7}>
            <span className="hero__name" aria-hidden="true">Анастасия Б.</span>
          </PaperScrap>

          {/* Второй клочок под другим углом, со сдвигом вправо и выносом
              за правый край — слоистость скрапбукинга. */}
          <PaperScrap className="hero__scrap hero__scrap--role" seed={42} rot={3.6} depth={11} tone="orange">
            <span className="hero__role" aria-hidden="true">видеограф</span>
          </PaperScrap>
        </h1>
      </div>

      <div className="hero__bottom">
        <p className="hero__lead u-label">
          Снимаю и динамично монтирую.<br />
          Крупные мероприятия и медиапроекты.
        </p>
        <div className="hero__cta">
          <a className="btn btn--solid" href="#work">Смотреть работы</a>
          <a className="btn btn--ghost" href="#contacts">Написать</a>
        </div>
        <p className="hero__ratio u-label">Съёмка<br />/ монтаж<br />50 / 50</p>
      </div>

      <div
        className="hero__deco"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${shift * -70}px, 0) scale(${1 + shift * 0.25})`, opacity: 1 - shift * 0.55 }}
      >
        {/* Теги уходят за края экрана — так же, как надписи в рефе. */}
        <Sticker src="tags/big-1" w={420} rot={-9} color="var(--orange)" style={{ top: '9%', left: '-8%' }} />
        <Sticker src="tags/big-4" w={360} rot={7}  color="var(--paper)" opacity={0.9} style={{ bottom: '12%', right: '-7%' }} />
        <Sticker src="tags/big-6" w={210} rot={-14} color="var(--orange)" opacity={0.8} style={{ top: '62%', left: '5%' }} />

        <Sticker src="marks/star-spray" w={130} rot={-12} color="var(--orange)" mobile className="hero__star"  style={{ top: '7%', right: '14%' }} />
        <Sticker src="marks/crown"      w={92}  rot={7}   color="var(--paper)" mobile className="hero__crown" style={{ top: '3%', left: '28%' }} />
        <Sticker src="marks/asterisk"   w={62}  rot={0}   color="var(--orange)" style={{ bottom: '26%', left: '24%' }} />
        <Sticker src="marks/circle-x"   w={56}  rot={12}  color="var(--paper)" opacity={0.6} style={{ top: '28%', right: '8%' }} />
        <Sticker src="marks/barcode"    w={104} rot={0}   color="var(--paper)" opacity={0.5} style={{ bottom: '8%', left: '45%' }} />

        <Sticker src="tape/tape-5" className="stk--photo" w={190} rot={-9} opacity={0.9} style={{ top: '30%', left: '31%' }} />
        <Sticker src="tape/tape-2" className="stk--photo" w={150} rot={8}  opacity={0.85} style={{ bottom: '34%', right: '27%' }} />
      </div>

      <Marquee
        className="hero__marquee"
        items={['Интервью', 'Fashion', 'Репортаж', 'Мероприятия', 'Вертикаль', 'Многокамерка', 'Motion']}
        duration={28}
      />
    </section>
  );
}
