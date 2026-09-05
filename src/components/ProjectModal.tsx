import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { Project } from '../content/projects';
import { MediaSlot } from './grunge/MediaSlot';
import './ProjectModal.css';

type Props = {
  project: Project | null;
  onClose: () => void;
};

/**
 * Раскрытый просмотр проекта — мини-шоурил по конкретному мероприятию.
 *
 * По брифу внутри намеренно нет описаний, списка задач, технических деталей
 * и роли: только название, год, формат и видео. Всё внимание на картинку.
 */
export function ProjectModal({ project, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(project);

  // Пока модалка открыта: блокируем скролл страницы, вешаем Esc и уводим
  // фокус на кнопку закрытия, чтобы с клавиатуры не проваливаться под оверлей.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-locked');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="pm"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title}, ${project.year}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'linear' }}
          onClick={onClose}
        >
          <motion.div
            className="pm__panel"
            // Открытие с рывком и лёгким поворотом — карточка «выдёргивается»
            // на передний план, а не всплывает плавно.
            initial={{ y: 60, rotate: -1.8, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 40, rotate: 1.2, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1.2, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button ref={closeRef} className="pm__close u-label" onClick={onClose}>
              Закрыть
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </button>

            <div className="pm__media">
              <MediaSlot
                video={project.reel}
                poster={project.poster}
                label={`Мини-шоурил: ${project.title}`}
                hint="Нарезка 20–60 сек · 16:9"
                ratio="16 / 9"
                autoPlay
              />
            </div>

            <div className="pm__meta">
              <h3 className="pm__title u-display">{project.title}</h3>
              <p className="pm__row u-label">
                <span className="pm__year">{project.year}</span>
                <span>{project.directions.join(' / ')}</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
