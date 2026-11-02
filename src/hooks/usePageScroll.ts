import { useEffect } from 'react';

if (typeof window !== 'undefined') window.history.scrollRestoration = 'manual';

/** Native scrolling avoids a permanent animation loop and wheel interception. */
export function usePageScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === 'reload') {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }

    const targetFor = (hash: string) => {
      if (!hash || hash === '#top') return document.body;
      try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { return null; }
    };
    const scrollTo = (hash: string, smooth = false) => {
      const target = targetFor(hash);
      if (!target) return;
      const top = target === document.body ? 0 : target.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
    };

    let cancelled = false;
    const initialHash = window.location.hash;
    const initialFrame = requestAnimationFrame(() => scrollTo(initialHash));
    void document.fonts.ready.then(() => {
      if (!cancelled && window.location.hash === initialHash) scrollTo(initialHash);
    });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash === '#' || !targetFor(hash)) return;
      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
      scrollTo(hash, true);
    };
    const onHistoryChange = () => scrollTo(window.location.hash);
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onHistoryChange);
    return () => {
      cancelled = true;
      cancelAnimationFrame(initialFrame);
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onHistoryChange);
    };
  }, []);
}
