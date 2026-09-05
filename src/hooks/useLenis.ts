import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Инерционный скролл на весь сайт.
 *
 * Без него параллакс в WORK выглядит рвано: колёсико даёт дискретные скачки,
 * а карточкам с разной скоростью нужен непрерывный поток. Lenis сглаживает
 * ввод, а рывки и резкость мы добавляем уже сами — в анимациях элементов.
 */
export function useLenis() {
  useEffect(() => {
    // Уважаем системную настройку: там инерция только мешает.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Якорные ссылки в шапке должны ехать через Lenis, иначе прыгают мгновенно.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.15 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
