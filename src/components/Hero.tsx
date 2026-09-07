import { useEffect, useRef, useState } from 'react';
import { site } from '../content/site';
import { asset } from '../lib/asset';
import { Sticker } from './grunge/Sticker';
import { tornMaskImage } from '../lib/rough';
import './Hero.css';

/**
 * Первый экран.
 *
 * Состав по макету: камера, два слова леттеринга на рваной бумаге, два
 * бессодержательных граффити позади и блок действия слева внизу. Внизу —
 * тонкая рваная лента «Съёмка / Монтаж».
 *
 * Имя и фамилия — отдельные PNG, а не живой текст: наборный шрифт тащит
 * межстрочные интервалы и боковые свесы глифов, из-за чего рамка элемента
 * не совпадает с реальными краями краски. Это исходная база, а не точные
 * слои макета: буквы прототипа нарисованы иначе. Слои `title-first` и
 * `title-last` независимы — картинку можно заменить, не перекладывая экран.
 *
 * Что снято по последней правке: рейтинг из звёзд, barcode, метки-стикеры,
 * третий крупный тег, приписка в правом нижнем углу и бегущая строка
 * направлений. Освободившееся место остаётся пустым.
 */
export function Hero() {
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Параллакс выключен и на телефоне: там имя ходило поверх кнопок.
    const wide = window.matchMedia('(min-width: 768px)');

    let attached = false;
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        setScroll(Math.min(1, window.scrollY / window.innerHeight));
      });
    };
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      setScroll(0);
      setPointer({ x: 0, y: 0 });
    };
    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointermove', onMove, { passive: true });
    };

    // Настройку слушаем, а не читаем один раз при загрузке.
    const sync = () => (mq.matches || !wide.matches ? detach() : attach());
    sync();
    mq.addEventListener('change', sync);
    wide.addEventListener('change', sync);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      mq.removeEventListener('change', sync);
      wide.removeEventListener('change', sync);
      detach();
    };
  }, []);

  /* Амплитуды из пакета: указатель ±12/±8 px, уход вверх до 36 px.
     Камера — родительский якорь в CSS и отдельный transform здесь, чтобы
     не смешивать translate(-50%), отрицательные отступы и анимацию
     на одном узле. */
  const camStyle = {
    transform:
      `translate3d(${pointer.x * 12}px, ${pointer.y * 8 - scroll * 36}px, 0)` +
      ` rotate(${-2.4 + pointer.x * 0.8}deg)`,
  };
  /* Слова двигаются слабее камеры — до ±5 px. */
  const wordStyle = (depth: number) => ({
    transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth * 0.6 - scroll * depth * 2}px, 0)`,
  });

  return (
    <section className="section--hero hero" id="top">
      <h1 className="sr-only">
        {site.name} — {site.role.toLowerCase()}, {site.city}
      </h1>

      {/* Два крупных бессодержательных граффити позади основных элементов. */}
      <div className="hero__deco" aria-hidden="true" style={{ opacity: 1 - scroll * 0.6 }}>
        <Sticker src="tags/big-4" w={620} rot={8} color="var(--orange)" style={{ top: '2%', right: '-4%' }} />
        <Sticker src="tags/big-1" w={520} rot={-9} color="var(--paint-soft)" opacity={0.42}
                 style={{ top: '12%', left: '-11%' }} />
      </div>

      {/* Арт-композиция: бумага — камера — бумага. На телефоне она едет
          отдельным контейнером, а текст и кнопки идут после неё потоком. */}
      <div className="hero__art">
        <div className="hero__slip hero__slip--first" style={wordStyle(5)} aria-hidden="true">
          <span className="hero__paper" style={{ maskImage: tornMaskImage(21, 24, 8), WebkitMaskImage: tornMaskImage(21, 24, 8) }} />
          <img className="hero__word" src={asset('media/titles/anastasia.png')} alt="" />
          <Sticker src="tape/tape-1" className="stk--photo hero__tape" w={120} rot={-16} opacity={0.9}
                   style={{ top: '-22%', left: '-7%' }} />
        </div>

        <img
          className="hero__cam"
          src={asset('media/camera.webp')}
          alt=""
          aria-hidden="true"
          style={camStyle}
        />

        <div className="hero__slip hero__slip--last" style={wordStyle(5)} aria-hidden="true">
          <span className="hero__paper hero__paper--orange" style={{ maskImage: tornMaskImage(58, 24, 10), WebkitMaskImage: tornMaskImage(58, 24, 10) }} />
          <img className="hero__word" src={asset('media/titles/brichko.png')} alt="" />
          <Sticker src="tape/tape-5" className="stk--photo hero__tape" w={112} rot={14} opacity={0.85}
                   style={{ bottom: '4%', right: '3%' }} />
        </div>
      </div>

      <div className="hero__corner">
        <p className="hero__lead">
          {site.hero.lead[0]}<br />
          {site.hero.lead[1]}
        </p>
        {/* Кнопки строго друг под другом. */}
        <div className="hero__cta">
          <a className="btn" href="#work">Смотреть работы</a>
          <a className="btn btn--ghost" href="#contacts">Написать</a>
        </div>
      </div>

      {/* Тонкая рваная лента перехода. Статичная: мигать и перетягивать
          внимание она не должна. */}
      <div className="hero__ribbon" aria-hidden="true">
        {site.hero.ribbon.map((word, i) => (
          <span className="hero__ribbon-word" key={word}>
            {i > 0 && <span className="hero__ribbon-sep">/</span>}
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
