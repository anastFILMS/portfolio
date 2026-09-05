import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';
import { Marquee } from './grunge/Marquee';
import { Sticker } from './grunge/Sticker';
import './Hero.css';

/**
 * Титульный экран. Раскладка снята с рефа URDA.
 *
 * Имя и фамилия — запечённые PNG, а не живой текст: шрифт тащит межстрочные
 * интервалы и боковые свесы глифов, из-за чего рамка элемента не совпадает
 * с реальными краями краски и слово невозможно поставить точно. Запекание
 * даёт картинку, обрезанную ровно по буквам (см. scripts/bake-titles.py).
 *
 * Камера вырезана из фото и прогнана через бочкообразную дисторсию под
 * 0.5× fish eye (scripts/prepare-camera.py). Она вылетает между словами и
 * ходит параллаксом за мышью и скроллом.
 *
 * Логотип и навигация с титульника убраны — вернутся отдельным блоком ниже.
 */
export function Hero() {
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        setScroll(Math.min(1, window.scrollY / window.innerHeight));
      });
    };
    // Мышь двигает камеру сильнее фона — за счёт разной амплитуды
    // появляется ощущение глубины, а не плоской картинки.
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const camStyle = {
    transform:
      `translate3d(${pointer.x * 26}px, ${pointer.y * 18 - scroll * 90}px, 0)` +
      ` rotate(${-3 + pointer.x * 1.6}deg) scale(${1 + scroll * 0.12})`,
  };
  const wordStyle = (depth: number) => ({
    transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth * 0.6 - scroll * depth * 3}px, 0)`,
  });

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__spray" />
        <div className="hero__grain" />
        <div className="hero__scan" />
      </div>

      <h1 className="sr-only">Anastasia Brichko — видеограф и монтажёр, Москва</h1>

      {/* Слова и камера — три слоя с разной амплитудой параллакса. */}
      <img
        className="hero__word hero__word--first"
        src={asset('media/titles/anastasia.png')}
        alt=""
        aria-hidden="true"
        style={wordStyle(9)}
      />

      <img
        className="hero__cam"
        src={asset('media/camera.webp')}
        alt=""
        aria-hidden="true"
        style={camStyle}
      />

      <img
        className="hero__word hero__word--last"
        src={asset('media/titles/brichko.png')}
        alt=""
        aria-hidden="true"
        style={wordStyle(15)}
      />

      {/* Нижний левый угол — там, где в рефе стоит фотография. */}
      <div className="hero__corner">
        <span className="hero__stars" aria-hidden="true">★★★★★</span>
        <p className="hero__lead u-label">
          Снимаю и динамично монтирую.<br />
          Крупные мероприятия и медиапроекты.
        </p>
        <div className="hero__cta">
          <a className="btn btn--solid" href="#work">Смотреть работы</a>
          <a className="btn btn--ghost" href="#contacts">Написать</a>
        </div>
      </div>

      {/* Мелкий блок в правом нижнем — как «FROM THE GROUND UP» в рефе. */}
      <p className="hero__note u-label" aria-hidden="true">
        Съёмка и монтаж в одних руках.<br />
        Москва и выезды.
      </p>

      <div className="hero__deco" aria-hidden="true" style={{ opacity: 1 - scroll * 0.6 }}>
        <Sticker src="tags/big-4" w={420} rot={8}  color="var(--orange)" style={{ top: '4%', right: '-8%' }} />
        <Sticker src="tags/big-6" w={230} rot={-13} color="var(--paper)" opacity={0.5} style={{ bottom: '6%', left: '38%' }} />
        <Sticker src="marks/star-spray" w={120} rot={-12} color="var(--orange)" mobile className="hero__star" style={{ top: '52%', left: '3%' }} />
        <Sticker src="marks/asterisk"   w={58}  rot={0}   color="var(--orange)" style={{ top: '16%', left: '46%' }} />
        <Sticker src="marks/circle-x"   w={46}  rot={12}  color="var(--paper)" opacity={0.55} style={{ bottom: '30%', right: '17%' }} />
        <Sticker src="marks/barcode"    w={98}  rot={0}   color="var(--paper)" opacity={0.45} style={{ top: '7%', left: '4%' }} />
      </div>

      <Marquee
        className="hero__marquee"
        items={['Интервью', 'Fashion', 'Репортаж', 'Мероприятия', 'Вертикаль', 'Многокамерка', 'Motion']}
        duration={28}
      />
    </section>
  );
}
