import { useEffect, useRef, useState } from 'react';
import videos from '../content/videos.json';
import { asset } from '../lib/asset';

export function VideoGallery({ category, initialSlug, note }: { category: string; initialSlug?: string; note: string }) {
  const items = videos.filter(video => video.category === category);
  const [index, setIndex] = useState(() => Math.max(0, items.findIndex(video => video.slug === initialSlug)));
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const item = items[index];
  const select = (next: number) => { setIndex((next + items.length) % items.length); setError(false); setLoaded(false); setStarted(false); };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.matches('video, input, textarea')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex(value => (value + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length);
        setError(false); setLoaded(false); setStarted(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [items.length]);
  useEffect(() => { document.querySelector('.gallery-thumb[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [index]);
  if (!item) return <p id="dialog-description">Видео скоро появятся.</p>;
  return <div className="video-gallery" data-lenis-prevent>
    <p className="reel-description" id="dialog-description">{note}</p>
    <div className="gallery-stage"
      onTouchStart={event => { const t = event.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY }; }}
      onTouchEnd={event => { const start = touchStart.current; touchStart.current = null; if (!start) return; const t = event.changedTouches[0]; const dx = t.clientX - start.x; if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(t.clientY - start.y) * 1.5) select(index + (dx < 0 ? 1 : -1)); }}>
      {started ? <video key={item.slug} className="gallery-video" src={asset(`media/hd/${item.slug}.mp4`)} controls playsInline autoPlay preload="metadata" aria-label={item.title} onLoadedData={() => setLoaded(true)} onError={() => setError(true)} /> : <button type="button" className="gallery-poster" aria-label={`Смотреть видео: ${item.title}`} onClick={() => setStarted(true)}><img src={asset(`media/videos/${item.slug}.webp?v=${item.posterTime}`)} alt={item.title} decoding="async" /><span className="gallery-play" aria-hidden="true">▶</span><span className="gallery-watch">Смотреть видео</span></button>}
      {started && !loaded && !error && <span className="gallery-loading" role="status">Загрузка видео…</span>}
    </div>
    <a className="gallery-source" href={`https://drive.google.com/file/d/${item.id}/view`} target="_blank" rel="noopener noreferrer">Открыть на Google Диске ↗</a>
    {error && <p className="reel-error" role="alert">Не удалось загрузить видео. Откройте его по ссылке выше.</p>}
    <div className="gallery-navigation" onTouchStart={event => { const t = event.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY }; }} onTouchEnd={event => { const start = touchStart.current; touchStart.current = null; if (!start) return; const t = event.changedTouches[0]; const dx = t.clientX - start.x; if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(t.clientY - start.y) * 1.5) select(index + (dx < 0 ? 1 : -1)); }}> 
      {items.length > 1 && <button type="button" className="ed-button" aria-label="Предыдущее видео" onClick={() => select(index - 1)}>←</button>}
      <div className="gallery-current" aria-live="polite"><span>{index + 1} / {items.length}</span><h3>{item.title}</h3>{item.subtitle && <p className="gallery-subtitle">{item.subtitle}</p>}</div>
      {items.length > 1 && <button type="button" className="ed-button" aria-label="Следующее видео" onClick={() => select(index + 1)}>→</button>}
    </div>
    {items.length > 1 && <div className="gallery-thumbnails" role="group" aria-label="Выбрать видео">
      {items.map((video, i) => <button type="button" className="gallery-thumb" key={video.slug} aria-current={i === index ? 'true' : undefined} aria-label={`${i + 1}. ${video.title}`} onClick={() => select(i)}><img src={asset(`media/videos/${video.slug}.webp?v=${video.posterTime}`)} alt="" loading="lazy" /><span>{String(i + 1).padStart(2, '0')}</span></button>)}
    </div>}
  </div>;
}
