import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Ссылка на живой экземпляр Lenis.
 *
 * Нужна плееру: пока открыт просмотр, инерционный скролл должен стоять,
 * иначе колесо над модалкой продолжает тащить страницу под ней.
 */
let instance: Lenis | null = null;

export const lenisControl = {
  stop: () => instance?.stop(),
  start: () => instance?.start(),
};

/**
 * Инерционный скролл на весь сайт.
 *
 * Без него параллакс в WORK выглядит рвано: колёсико даёт дискретные скачки,
 * а кадрам с разной скоростью нужен непрерывный поток.
 */
export function useLenis() {
  useEffect(() => {
    // Уважаем системную настройку — и следим за её изменением, а не только
    // за значением на момент загрузки.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
      instance = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!lenis) return;
      cancelAnimationFrame(raf);
      raf = 0;
      lenis.destroy();
      lenis = null;
      instance = null;
    };

    const sync = () => (mq.matches ? stop() : start());
    sync();
    mq.addEventListener('change', sync);

    // Якорные ссылки в подвале должны ехать через Lenis, иначе прыгают
    // мгновенно. Прежний сдвиг −72 px компенсировал фиксированную шапку,
    // которой больше нет: якорь вставал на 72 px выше заголовка секции.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = id === '#top' ? document.body : document.querySelector(id);
      if (!target) return;
      if (!lenis) return; // reduced motion: пусть браузер прыгает сам
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -16, duration: 1.15 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      mq.removeEventListener('change', sync);
      stop();
    };
  }, []);
}
