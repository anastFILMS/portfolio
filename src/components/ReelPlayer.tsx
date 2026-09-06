import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../content/projects';
import { playerMessages } from '../content/skills';
import { asset } from '../lib/asset';
import { lenisControl } from '../hooks/useLenis';
import './ReelPlayer.css';

type Props = {
  project: Project | null;
  onClose: () => void;
};

/** Что видно в окне прямо сейчас. */
type State = 'missing' | 'loading' | 'ready' | 'error';

/**
 * Числовое соотношение сторон из строки вида «16 / 9».
 * Нужно, чтобы ограничить сцену И по высоте, и по ширине: при одном лишь
 * `aspect-ratio` вертикальный ролик упирался в ширину панели и вылезал
 * за нижний край экрана.
 */
function ratioOf(value: string): number {
  const [w, h] = value.split('/').map((n) => Number(n.trim()));
  return h > 0 ? w / h : 16 / 9;
}

/** Элементы, на которые может встать фокус внутри диалога. */
const FOCUSABLE =
  'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Просмотр мини-шоурила.
 *
 * Это отдельный полноценный плеер, а не второй режим превью. Здесь есть
 * native controls, звук, перемотка и полный экран; принудительных
 * `muted loop` нет. Вертикальный ролик помещается по высоте целиком —
 * `object-fit: contain`, без насильного кропа под 16:9.
 *
 * Модальность настоящая: Tab и Shift+Tab не выходят наружу, фон помечен
 * `inert`, страница и Lenis остановлены, после закрытия фокус возвращается
 * на кнопку, которая окно открыла.
 *
 * Рисуется порталом в body. Внутри `#page` окно оказывалось потомком того
 * самого узла, которому мы ставим `inert`, и отключало само себя: фокус не
 * вставал на «Закрыть», Tab уходил в body, клики не доходили.
 */
export function ReelPlayer({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const [attempt, setAttempt] = useState(0);
  const reelSrc = asset(project?.reel);
  const [state, setState] = useState<State>('missing');

  // onClose приходит новой функцией на каждый рендер родителя. Держим её в
  // ref, чтобы эффект открытия не переподписывался и не дёргал фокус.
  const closeRef2 = useRef(onClose);
  closeRef2.current = onClose;
  const close = useCallback(() => closeRef2.current(), []);

  const open = Boolean(project);

  useEffect(() => {
    if (!open) return;
    setAttempt(0);
    setState(reelSrc ? 'loading' : 'missing');
  }, [open, reelSrc]);

  useEffect(() => {
    if (!open) return;

    // Кто открыл окно — туда вернём фокус при закрытии.
    openerRef.current = document.activeElement as HTMLElement | null;

    const scrollY = window.scrollY;
    document.body.classList.add('is-locked');
    lenisControl.stop();

    // Фон недоступен ни мыши, ни клавиатуре, ни скринридеру.
    const page = document.getElementById('page');
    page?.setAttribute('inert', '');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      // Замыкаем кольцо: за последним снова первый, и наоборот.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(focusTimer);
      document.body.classList.remove('is-locked');
      page?.removeAttribute('inert');
      lenisControl.start();
      window.scrollTo(0, scrollY);
      openerRef.current?.focus?.();
    };
  }, [open, close]);

  if (!project) return null;

  const retry = () => {
    setState('loading');
    setAttempt((n) => n + 1);
  };

  return createPortal(
    <div
      className="rp"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="rp__panel" ref={panelRef}>
        <div className="rp__bar">
          <h3 className="rp__title u-cond" id={titleId}>{project.title}</h3>
          <button ref={closeRef} className="rp__close u-label" type="button" onClick={close}>
            {playerMessages.close}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </button>
        </div>

        <div
          className="rp__stage"
          style={
            {
              aspectRatio: project.reelAspectRatio,
              '--ar': ratioOf(project.reelAspectRatio),
            } as React.CSSProperties
          }
        >
          {reelSrc && state !== 'error' && (
            <video
              key={attempt}
              ref={videoRef}
              className="rp__video"
              src={reelSrc}
              poster={asset(project.poster)}
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={() => setState('ready')}
              onError={() => setState('error')}
            />
          )}

          {state === 'loading' && <p className="rp__note">{playerMessages.loading}</p>}

          {state === 'error' && (
            <div className="rp__note">
              <p>{playerMessages.error}</p>
              <button className="btn rp__retry" type="button" onClick={retry}>
                {playerMessages.retry}
              </button>
            </div>
          )}

          {/* Ролика нет — говорим об этом прямо, без неработающей кнопки
              воспроизведения и несуществующего источника. */}
          {state === 'missing' && <p className="rp__note">{playerMessages.missing}</p>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
