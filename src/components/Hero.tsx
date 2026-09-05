import { site } from '../content/site';
import { about } from '../content/about';
import { tornClipPath } from '../lib/rough';
import { MediaSlot } from './grunge/MediaSlot';
import { Marquee } from './grunge/Marquee';
import { Scribble } from './grunge/Scribble';
import { SprayTag } from './grunge/SprayTag';
import { Sticker } from './grunge/Sticker';
import { RansomText } from './grunge/RansomText';
import './Hero.css';

/**
 * Первый экран — плотный коллаж по мотивам главного рефа (0437).
 *
 * Логика та же, что у зина: ничего не стоит ровно и по сетке, элементы
 * налезают друг на друга, между ними — вырезанные из паков граффити,
 * спрей-символы и скотч. Имя набрано вырезками из «разных журналов»,
 * роль дописана маркером поверх чёрной плашки.
 *
 * Композиция разведена на два слоя: содержимое (имя, кнопки, медиа) и
 * декор. Декор абсолютный, не ловит курсор и скрыт от скринридеров,
 * поэтому плотность картинки не мешает ни навигации, ни чтению.
 */
export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__spray" />
        <div className="hero__paper" />
      </div>

      <div className="hero__hud" aria-hidden="true">
        <span className="hero__hud-rec u-mono"><i />REC</span>
        <span className="u-mono">4K · 25 FPS</span>
      </div>

      <div className="hero__stage shell">
        {/* Левая колонка идёт своим потоком: раньше высокий кадр справа
            растягивал строки общей сетки и между блоками зияли дыры. */}
        <div className="hero__col">
        {/* Имя вырезками — центр композиции, как «VERNON» в 0437. */}
        <h1 className="hero__name">
          <RansomText seed={12}>{site.name}</RansomText>
        </h1>

        {/* Чёрная плашка с маркерной надписью поверх — приём из 0437. */}
        <div className="hero__bar">
          <SprayTag className="hero__bar-tag" seed={11} size={110} drips>
            videographer
          </SprayTag>
          <span className="hero__bar-editor u-display">&amp; editor</span>
        </div>

        <p className="hero__role u-mono">{site.city} · съёмка и монтаж 50/50</p>

        <div className="hero__cta">
          <a className="btn btn--solid" href="#work">
            Смотреть работы
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>
          </a>
          <a className="btn btn--ghost" href="#contacts">Написать</a>
        </div>

        {/* Клочок бумаги с рукописной припиской — в 0437 такие блоки
            держат весь текст композиции. */}
        <div className="hero__note" style={{ clipPath: tornClipPath(41, 16, 9) }}>
          <p className="hero__note-hand u-hand">{about.note}</p>
          <ul className="hero__keys u-mono">
            {site.keywords.map((k) => <li key={k}>{k}</li>)}
          </ul>
        </div>

        </div>

        {/* Кадры стопкой — второй наезжает на первый. */}
        <div className="hero__media">
        <div className="hero__cell hero__cell--main">
          <MediaSlot label="Общий showreel" hint="15–40 сек · лучшие кадры" ratio="4 / 5" autoPlay />
        </div>

        {/* Второй кадр внахлёст — даёт слоистость, а не одиночную картинку. */}
        <div className="hero__cell hero__cell--small">
          <MediaSlot label="Кадр из проекта" hint="Стоп-кадр 3:2" ratio="3 / 2" />
        </div>
        </div>

        {/* ================= ДЕКОР ================= */}
        <div className="hero__deco" aria-hidden="true">
          {/* Граффити поверх кадров — «по бокам, на глазах» (рефы 0416, 0419, 0423). */}
          <Sticker src="tags/tag-1" w={240} rot={-9}  color="var(--orange)" style={{ top: '17%', right: '2%' }} />
          <Sticker src="tags/tag-5" w={150} rot={7}   color="var(--paper)" opacity={0.85} style={{ top: '58%', right: '26%' }} />
          <Sticker src="tags/tag-3" w={120} rot={-14} color="var(--orange)" opacity={0.9} style={{ bottom: '20%', left: '31%' }} />

          {/* Спрей-символы: звезда из 0435, корона из 0432, штрих-код из 0416. */}
          <Sticker src="marks/star"     w={92}  rot={-16} color="var(--orange)" mobile className="hero__star"  style={{ top: '5%', left: '40%' }} />
          <Sticker src="marks/crown"    w={76}  rot={9}   color="var(--paper)" mobile className="hero__crown" style={{ top: '2%', left: '11%' }} />
          <Sticker src="marks/barcode"  w={88}  rot={90}  color="var(--paper)" opacity={0.45} style={{ top: '30%', left: '-3%' }} />
          <Sticker src="marks/asterisk" w={54}  rot={0}   color="var(--orange)" mobile style={{ top: '35%', left: '92%' }} />
          <Sticker src="marks/slashes"  w={64}  rot={18}  color="var(--paper)" opacity={0.6} style={{ bottom: '31%', left: '2%' }} />
          <Sticker src="marks/excl"     w={42}  rot={-7}  color="var(--orange)" style={{ bottom: '14%', left: '24%' }} />
          <Sticker src="marks/qr"       w={54}  rot={-5}  color="var(--paper)" opacity={0.4} style={{ top: '20%', left: '46%' }} />
          <Sticker src="tags/tag-7"     w={110} rot={11}  color="var(--paper)" opacity={0.5} style={{ top: '62%', left: '41%' }} />

          {/* Скотч держит кадры — прямо как просили в описании папки текстур. */}
          <Sticker src="tape/tape-1" className="stk--photo" w={190} rot={-8} style={{ top: '20%', right: '27%' }} opacity={0.9} />
          <Sticker src="tape/tape-4" className="stk--photo" w={140} rot={6}  style={{ bottom: '30%', right: '5%' }} opacity={0.85} />
          <Sticker src="tape/tape-9" className="stk--photo" w={70} rot={-15} style={{ bottom: '34%', left: '62%' }} opacity={0.85} />

          {/* Маркерные росчерки, перечёркивающие композицию (0437). */}
          <Scribble kind="zigzag" className="hero__zig" color="var(--orange)" width={300} delay={0.5} />
          <Scribble kind="arrow"  className="hero__arr" color="var(--paper)" width={150} delay={0.7} />
        </div>
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
