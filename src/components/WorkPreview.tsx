import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';
import type { Project } from '../content/projects';

type Props = {
  project: Project;
  /** Тап на телефоне не запускает loop — там виден только постер. */
  allowHoverPlay: boolean;
};

/**
 * Превью направления в разделе WORK.
 *
 * Это ТОЛЬКО обложка: постер плюс короткий беззвучный loop при наведении.
 * Полноценный просмотр со звуком и управлением живёт в отдельном плеере —
 * раньше оба режима обслуживал один компонент, и в модалке видео шло
 * принудительно muted, зациклено и без controls.
 *
 * Технических подписей вроде REC, таймкода и «Loop 4 сек» здесь нет:
 * на основной странице им не место.
 */
export function WorkPreview({ project, allowHoverPlay }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [posterFailed, setPosterFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const [loopFailed, setLoopFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const posterPath = project.poster ?? project.temporaryPoster;
  const posterSrc = asset(posterPath);
  const loopSrc = asset(project.previewLoop);

  const hasPoster = Boolean(posterSrc) && !posterFailed;
  // Loop подключаем только когда кадр рядом с экраном: пять роликов
  // не должны грузиться при открытии страницы.
  const hasLoop = Boolean(loopSrc) && allowHoverPlay && inView && !loopFailed;

  useEffect(() => { setPosterFailed(false); setLoopFailed(false); setPlaying(false); }, [posterSrc, loopSrc]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !loopSrc) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        // За пределами экрана loop остановлен.
        if (!entry.isIntersecting) videoRef.current?.pause();
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loopSrc]);

  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    // Отклонённый play() не должен ронять страницу.
    void el.play().catch(() => undefined);
  }, []);

  const stop = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    // Время сбрасываем только когда метаданные уже есть: иначе браузер
    // ругается на присваивание currentTime.
    if (el.readyState >= 1) el.currentTime = 0;
  }, []);

  useEffect(() => {
    if (!hasLoop) return;
    const card = wrapRef.current?.closest('[data-hover-media]');
    if (!card) return;
    // Кадр мог въехать в экран уже под курсором или с фокусом: тогда
    // события mouseenter/focusin уже прошли и loop бы не стартовал.
    if (card.matches(':hover, :focus-within')) play();
    card.addEventListener('mouseenter', play);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focusin', play);
    card.addEventListener('focusout', stop);
    return () => {
      card.removeEventListener('mouseenter', play);
      card.removeEventListener('mouseleave', stop);
      card.removeEventListener('focusin', play);
      card.removeEventListener('focusout', stop);
    };
  }, [hasLoop, play, stop]);

  const fit = project.poster ? 'cover' : project.temporaryPosterFit ?? 'cover';
  const position = project.poster ? '50% 50%' : project.temporaryPosterPosition ?? '50% 50%';

  return (
    <div className="wp" ref={wrapRef}>
      {hasPoster && (
        <img
          className="wp__img"
          src={posterSrc}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ objectFit: fit, objectPosition: position }}
          onError={() => setPosterFailed(true)}
        />
      )}

      {hasLoop && (
        <video
          ref={videoRef}
          className="wp__video"
          data-playing={playing}
          src={loopSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => { setLoopFailed(true); setPlaying(false); }}
        />
      )}

      {/* Кадра ещё нет — вместо него нейтральная бумажная композиция.
          Ложного «проигрывания» и выдуманных подписей тут не будет. */}
      {!hasPoster && project.temporaryCollage && (
        <span className="wp__collage" aria-hidden="true">
          {project.temporaryCollage.map((src) => <img key={src} src={asset(src)} alt="" loading="lazy" />)}
        </span>
      )}
      {!hasPoster && !project.temporaryCollage && <span className="wp__blank" aria-hidden="true" />}
    </div>
  );
}
