import { site } from '../content/site';
import { SprayTag } from './grunge/SprayTag';
import { Reveal } from './grunge/Reveal';
import { Logo } from './Logo';
import './Contacts.css';

/**
 * Финальный блок с контактами.
 *
 * По брифу это обязательная точка выхода: Telegram, VK, телефон и почта
 * должны быть заметными и доступными. Поэтому каждый способ связи —
 * отдельная крупная строка во всю ширину, а не мелкая иконка в подвале.
 */
export function Contacts() {
  const list = Object.values(site.contacts);

  return (
    <section className="cts section section--ink" id="contacts">
      <div className="shell">
        <header className="cts__head">
          <Reveal mode="mask">
            <h2 className="cts__title u-display">Напиши</h2>
          </Reveal>
          <SprayTag className="cts__tag" seed={29} size={90}>
            мне
          </SprayTag>
          <Reveal mode="jerk" delay={0.15}>
            <p className="cts__sub u-label">Съёмка · монтаж · {site.city} и выезды</p>
          </Reveal>
        </header>

        <ul className="cts__list">
          {list.map((c, i) => (
            <Reveal as="li" mode="jerk" delay={i * 0.06} key={c.label} className="cts__item">
              <a
                className="cts__link"
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer noopener' : undefined}
              >
                <span className="cts__label u-label">{c.label}</span>
                <span className="cts__handle u-display">{c.handle}</span>
                <svg className="cts__arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 18L18 6M8 6h10v10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>

      <footer className="cts__footer">
        <div className="shell cts__footer-inner">
          <Logo size={26} />
          <p className="u-label">
            {site.role} · {site.city}
          </p>
          <p className="u-label cts__year">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </section>
  );
}
