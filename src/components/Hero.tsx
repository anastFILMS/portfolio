import { useEffect, useState } from 'react';
import { site } from '../content/site';
import { MediaSlot } from './grunge/MediaSlot';
import { Marquee } from './grunge/Marquee';
import { Sticker } from './grunge/Sticker';
import './Hero.css';

/**
 * Первый экран.
 *
 * Структура снята с рефов из «ОСНОВНОЙ РЕФ»: имя крупно ПО ЦЕНТРУ (2832, 0421),
 * под ним во всю высоту — кадр с человеком, поверх кадра лежит имя и граффити
 * (2827, где вордстайл идёт поверх фотографии). Служебные подписи моношрифтом
 * разнесены по углам, как в 2825.
 *
 * Фон не однотонный: тёмная бумага с волокном, пятна распыла и полутоновая
 * растровка — этого отдельно просили в правках.
 */
export function Hero() {
  const [shift, setShift] = useState(0);

  // «Человек ступает на экран, на него параллаксом наезжают граффити» (реф 2825):
  // при скролле слой граффити идёт навстречу зрителю быстрее кадра.
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

      {/* Верхняя служебная строка — приём из 2825. */}
      <div className="hero__meta hero__meta--top u-label" aria-hidden="true">
        <span>Videographer<br />&amp; Editor</span>
        <span className="hero__rec u-tech"><i />REC · 4K · 25 FPS</span>
        <span className="hero__meta-right">{site.city}<br />MMXXVI</span>
      </div>

      <div className="hero__core">
        {/* Кадр стоит ПОД именем: человек «выходит» из-за букв, как в 2827. */}
        <div className="hero__photo">
          <MediaSlot label="Кадр / showreel" hint="Вертикаль 3:4 · ч/б" ratio="3 / 4" autoPlay />
        </div>

        <h1 className="hero__title">
          <span className="sr-only">{site.name} — {site.tagline}</span>
          {/* Имя целиком в одну строку — заказчица просила не разбивать. */}
          <span className="hero__word" aria-hidden="true">Anastasia B.</span>
          {/* Слово внахлёст поверх имени — формула из 2807. Маркерный шрифт
              вместо распылённого: распылённый забивал имя своей массой. */}
          <span className="hero__graf" aria-hidden="true">видеограф</span>
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

      {/* Слой граффити: наезжает на зрителя при скролле. */}
      <div
        className="hero__deco"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${shift * -60}px, 0) scale(${1 + shift * 0.22})`, opacity: 1 - shift * 0.5 }}
      >
        <Sticker src="tags/big-1" w={330} rot={-8} color="var(--orange)" style={{ top: '14%', left: '-3%' }} />
        <Sticker src="tags/big-4" w={280} rot={6}  color="var(--paper)" opacity={0.9} style={{ bottom: '16%', right: '-2%' }} />
        <Sticker src="tags/big-6" w={190} rot={-14} color="var(--orange)" opacity={0.85} style={{ top: '58%', left: '6%' }} />

        <Sticker src="marks/star-spray" w={120} rot={-12} color="var(--orange)" mobile className="hero__star"  style={{ top: '8%', right: '16%' }} />
        <Sticker src="marks/crown"      w={86}  rot={7}   color="var(--paper)" mobile className="hero__crown" style={{ top: '4%', left: '31%' }} />
        <Sticker src="marks/asterisk"   w={58}  rot={0}   color="var(--orange)" style={{ bottom: '30%', left: '27%' }} />
        <Sticker src="marks/circle-x"   w={54}  rot={12}  color="var(--paper)" opacity={0.6} style={{ top: '30%', right: '9%' }} />
        <Sticker src="marks/barcode"    w={96}  rot={0}   color="var(--paper)" opacity={0.5} style={{ bottom: '9%', left: '43%' }} />

        {/* Клочки рваной бумаги — фактура, а не силуэт. */}
        <Sticker src="torn/torn-3" className="stk--photo" w={230} rot={-6} opacity={0.5} style={{ top: '24%', right: '22%' }} />
        <Sticker src="torn/torn-6" className="stk--photo" w={170} rot={9}  opacity={0.42} style={{ bottom: '22%', left: '14%' }} />
        <Sticker src="tape/tape-5" className="stk--photo" w={170} rot={-9} opacity={0.85} style={{ top: '19%', left: '38%' }} />
      </div>

      <Marquee
        className="hero__marquee"
        items={['Интервью', 'Fashion', 'Репортаж', 'Мероприятия', 'Вертикаль', 'Многокамерка', 'Motion']}
        duration={28}
      />
    </section>
  );
}
