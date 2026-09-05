import { useEffect, useState } from 'react';
import { site } from '../content/site';
import { Logo } from './Logo';
import './Header.css';

/**
 * Шапка: логотип, навигация и быстрый контакт.
 *
 * Брифом отдельно просили продублировать быстрый контакт в шапке — поэтому
 * Telegram висит справа на всех экранах и не уезжает в бургер.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Шапка «сжимается» и получает фон, как только страница тронулась с места.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc закрывает мобильное меню.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className={`hdr ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <div className="hdr__bar">
        <a className="hdr__logo" href="#top" aria-label="В начало">
          <Logo size={30} />
        </a>

        {/* Пункты меню — наклеенные бумажки: у каждой свой угол и своя
            форма рваного края, поэтому ряд не читается ровной панелью. */}
        {/* Навигация и быстрый контакт с первого экрана убраны по правкам —
            вернутся отдельным блоком ниже по странице. Бургер оставлен:
            без него на телефоне вообще нет способа перейти в раздел. */}
        <button
          className="hdr__burger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="hdr-menu"
        >
          <span className="sr-only">{menuOpen ? 'Закрыть меню' : 'Открыть меню'}</span>
          <span className="hdr__burger-line" aria-hidden="true" />
          <span className="hdr__burger-line" aria-hidden="true" />
        </button>
      </div>

      {/* Мобильное меню: выезжает панелью, пункты крупные, как в зине. */}
      <div className="hdr__menu" id="hdr-menu" hidden={!menuOpen}>
        <nav aria-label="Мобильная навигация">
          {site.nav.map((item, i) => (
            <a
              className="hdr__menu-link u-display"
              href={`#${item.id}`}
              key={item.id}
              onClick={() => setMenuOpen(false)}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="hdr__menu-num u-label">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hdr__menu-contacts u-label">
          {Object.values(site.contacts).map((c) => (
            <a href={c.href} key={c.label} target="_blank" rel="noreferrer noopener">
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
