import { useEffect, useRef, useState } from 'react';
import { asset } from '../../lib/asset';
import './MediaSlot.css';

type Props = {
  /** Путь к видео в public/. Пока файла нет — оставь пустым/undefined. */
  video?: string;
  /** Путь к постеру/фото. Показывается до наведения и как fallback. */
  poster?: string;
  /** Что сюда встанет — текст рисуется прямо в заглушке. */
  label: string;
  /** Подсказка автору: формат/хронометраж. Видна только в заглушке. */
  hint?: string;
  /** Пропорции кадра. */
  ratio?: string;
  /** Видео стартует при наведении на родителя (карточки WORK). */
  playOnHover?: boolean;
  /** Видео крутится само (первый экран). */
  autoPlay?: boolean;
  className?: string;
};

/**
 * Слот под медиа с «честной» заглушкой.
 *
 * Пока Настя не отдала файлы, слот рисует оформленный плейсхолдер в стилистике
 * видоискателя (реф 0437): рамка кадра, счётчик REC, перфорация плёнки и
 * подпись, что именно сюда встанет. Как только в `public/media/` появляется
 * файл и путь прописан в контенте — заглушка сама заменяется на видео/фото,
 * верстку трогать не нужно.
 */
export function MediaSlot({
  video,
  poster,
  label,
  hint,
  ratio = '16 / 9',
  playOnHover = false,
  autoPlay = false,
  className = '',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterFailed, setPosterFailed] = useState(false);

  // Пути из контента приводим к базе сборки — см. lib/asset.ts.
  const videoSrc = asset(video);
  const posterSrc = asset(poster);

  const hasVideo = Boolean(videoSrc);
  const hasPoster = Boolean(posterSrc) && !posterFailed;
  const isEmpty = !hasVideo && !hasPoster;

  // Наведение обрабатывает родитель (карточка), чтобы зона реакции совпадала
  // со всей карточкой, а не только с площадью кадра.
  useEffect(() => {
    if (!playOnHover || !hasVideo) return;
    const el = videoRef.current;
    const card = el?.closest('[data-hover-media]');
    if (!el || !card) return;

    const play = () => { void el.play().catch(() => { /* автоплей заблокирован — не страшно */ }); };
    const stop = () => { el.pause(); el.currentTime = 0; };

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
  }, [playOnHover, hasVideo]);

  return (
    <div className={`slot ${className}`} style={{ aspectRatio: ratio }}>
      {hasVideo && (
        <video
          ref={videoRef}
          className="slot__video"
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay={autoPlay}
          aria-label={label}
        />
      )}

      {!hasVideo && hasPoster && (
        <img className="slot__img" src={posterSrc} alt={label} loading="lazy" onError={() => setPosterFailed(true)} />
      )}

      {isEmpty && <SlotPlaceholder label={label} hint={hint} />}

      {/* Рамка видоискателя поверх любого состояния — держит стилистику. */}
      <span className="slot__frame" aria-hidden="true" />
    </div>
  );
}

/** Оформленная заглушка: видоискатель + перфорация плёнки + подпись. */
function SlotPlaceholder({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="slot__ph">
      <span className="slot__sprockets slot__sprockets--l" aria-hidden="true" />
      <span className="slot__sprockets slot__sprockets--r" aria-hidden="true" />

      <div className="slot__rec u-tech">
        <span className="slot__dot" />REC
      </div>
      <div className="slot__tc u-tech">00:00:00:00</div>

      <div className="slot__ph-body">
        <p className="slot__ph-label u-display">{label}</p>
        {hint && <p className="slot__ph-hint u-label">{hint}</p>}
      </div>
    </div>
  );
}
