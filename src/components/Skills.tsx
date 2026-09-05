import { craft, programs } from '../content/skills';
import { TornEdge } from './grunge/TornEdge';
import { Reveal } from './grunge/Reveal';
import { Marquee } from './grunge/Marquee';
import './Skills.css';

/**
 * Навыки.
 *
 * Брифом просили компактно и визуально, без ощущения резюме: программы идут
 * крупными плашками с марками (Pr / Ae / DR), практические навыки — плотной
 * сеткой тегов, разбитой на «площадку» и «пост».
 */
export function Skills() {
  const groups = [craft.shooting, craft.post];

  return (
    <section className="skills section section--paper" id="skills">
      {/* Сверху в бумагу надрывается тёмный блок «Обо мне». */}
      <TornEdge side="top" color="var(--ink)" seed={41} height={60} />

      <div className="shell">
        <Reveal mode="mask">
          <h2 className="skills__title u-display">Чем работаю</h2>
        </Reveal>

        {/* ---------- программы ---------- */}
        <div className="skills__programs">
          {programs.map((p, i) => (
            <Reveal mode="tear" delay={i * 0.08} key={p.mark} className="prog">
              {/* Марка программы — крупная плашка, как иконка в доке. */}
              <span className="prog__mark u-display" aria-hidden="true">{p.mark}</span>
              <span className="prog__body">
                <span className="prog__name">{p.name}</span>
                <span className="prog__role u-label">{p.role}</span>
              </span>
            </Reveal>
          ))}
        </div>

        {/* ---------- практические навыки ---------- */}
        <div className="skills__craft">
          {groups.map((g, gi) => (
            <div className="craft" key={g.label}>
              <Reveal mode="jerk" delay={gi * 0.1}>
                <h3 className="craft__label u-label">{g.label}</h3>
              </Reveal>
              <ul className="craft__list">
                {g.items.map((item, i) => (
                  <Reveal as="li" mode="jerk" delay={gi * 0.1 + i * 0.04} key={item} className="craft__item">
                    {item}
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Лента закрывает секцию и уводит в тёмные контакты, поэтому её
          верхний край тоже рваный — переход между блоками не должен быть
          прямой линией. */}
      <div className="skills__band">
        <TornEdge side="top" color="var(--paper)" seed={89} height={44} />
        <Marquee
          className="skills__marquee"
          items={['Съёмка', 'Монтаж', 'Цвет', 'Звук', 'Графика']}
          duration={22}
          tone="ink"
          reverse
        />
      </div>
    </section>
  );
}
