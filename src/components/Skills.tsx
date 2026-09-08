import { skills } from '../content/skills';
import { SectionSeam } from './grunge/SectionSeam';
import { Reveal } from './grunge/Reveal';
import './Skills.css';

/**
 * «Инструменты».
 *
 * Короткая полоса: заголовок, три компактных бумажных ярлыка и одна строка
 * направлений. Прежние крупные карточки, две группы навыков и нижняя
 * бегущая строка убраны — в макете это небольшая секция.
 *
 * У DaVinci Resolve марки нет намеренно: официального знака в пакете нет,
 * а рисовать похожий нельзя. Там остаётся название.
 */
export function Skills() {
  return (
    <section className="section section--skills sk" id="skills">
      <SectionSeam id="section-edge-04" accent />

      <div className="shell sk__shell">
        <Reveal mode="rise">
          <h2 className="sk__title u-cond">
            {skills.heading}
            <span className="sk__rule" aria-hidden="true" />
          </h2>
        </Reveal>

        <div className="sk__side">
          <ul className="sk__programs">
            {skills.programs.map((p) => (
              <li className="sk__prog" key={p.name}>
                {p.mark && <span className="sk__mark" aria-hidden="true">{p.mark}</span>}
                <span className="sk__name">{p.name}</span>
              </li>
            ))}
          </ul>

          <p className="sk__items u-label">
            {skills.items.map((item, i) => (
              <span key={item}>
                {i > 0 && <span className="sk__sep" aria-hidden="true"> / </span>}
                {item}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
