import { site, type ContactChannel } from '../content/site';
import { SectionSeam } from './grunge/SectionSeam';
import { Reveal } from './grunge/Reveal';
import './Contacts.css';

/** Каналы в порядке вывода. Телефон и почта — опциональные. */
const CHANNELS: { key: keyof typeof site.contacts; label: string }[] = [
  { key: 'telegram', label: 'Telegram' },
  { key: 'vk', label: 'VK' },
];

/**
 * Контакты и подвал.
 *
 * ⚠️ Реальных Telegram/VK/телефона/почты для этого пакета не передали.
 * Поэтому каналы показаны неактивными элементами и рядом стоит одна
 * функциональная строка «Контакты скоро появятся». Ставить сюда
 * `t.me/username` и `href="#"` нельзя: это нерабочие ссылки, которые
 * выглядят рабочими. Как только значение появится в контенте — элемент
 * сам станет ссылкой.
 */
export function Contacts() {
  const { contacts, nav, brandHead, brandTail } = site;
  const optional = ([contacts.phone, contacts.email].filter(Boolean) as ContactChannel[]);
  const anyFilled = CHANNELS.some(({ key }) => contacts[key]) || optional.length > 0;

  return (
    <section className="section section--contacts cts" id="contacts">
      <SectionSeam id="section-edge-05" sheet="#101013" overlap={32} fiber={4} />

      <div className="shell">
        <div className="cts__top">
          <Reveal mode="rise">
            <h2 className="cts__head u-graf">{contacts.heading}</h2>
          </Reveal>

          <div className="cts__card">
            <p className="cts__card-head u-cond">{contacts.actionHeading}</p>
            <ul className="cts__list">
              {CHANNELS.map(({ key, label }) => {
                const channel = contacts[key] as ContactChannel | null;
                return (
                  <li key={key}>
                    {channel ? (
                      <a
                        className="cts__link"
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{label}</span>
                        <svg className="cts__ext" viewBox="0 0 16 16" aria-hidden="true">
                          <path
                            d="M5 11L11 5M11 5H6M11 5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                        </svg>
                      </a>
                    ) : (
                      <span className="cts__link cts__link--off" aria-disabled="true">
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {optional.length > 0 && (
              <ul className="cts__extra">
                {optional.map((c) => (
                  <li key={c.href}>
                    <a className="cts__extra-link" href={c.href}>{c.handle}</a>
                  </li>
                ))}
              </ul>
            )}

            {!anyFilled && <p className="cts__note">{contacts.unavailableMessage}</p>}
          </div>
        </div>

        <footer className="cts__foot">
          <a className="cts__brand" href="#top">
            {brandHead}
            <b>{brandTail}</b>
          </a>
          <nav className="cts__nav" aria-label="Разделы страницы">
            {nav.map((n) => (
              <a className="cts__nav-link" key={n.id} href={`#${n.id}`}>{n.label}</a>
            ))}
          </nav>
        </footer>
      </div>
    </section>
  );
}
