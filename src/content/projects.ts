/**
 * Раздел WORK — главный раздел сайта.
 *
 * ⚠️ ВСЁ НИЖЕ — ЗАГЛУШКИ. Названия, годы и форматы придуманы, чтобы задать
 * сетку и проверить механику. Перед публикацией заменить на реальные проекты.
 *
 * Как подключить настоящее медиа:
 *   1. Положить файлы в `public/media/projects/`
 *   2. Прописать пути в `loop` (превью 3–6 сек, без звука) и `reel` (нарезка)
 *   3. Заглушка исчезнет сама — верстку править не нужно
 *
 * Рекомендации по файлам:
 *   loop   — mp4/webm, 3–6 сек, беззвучный, ≤2 МБ, кадр 16:9 или 4:5
 *   poster — jpg/webp, первый кадр лупа, ≤250 КБ
 *   reel   — mp4, 20–60 сек, со звуком, ≤15 МБ
 */

export type Direction =
  | 'INTERVIEW'
  | 'FASHION'
  | 'EVENT'
  | 'REPORTAGE'
  | 'VERTICAL'
  | 'MULTICAM'
  | 'MOTION';

export type Project = {
  id: string;
  title: string;
  year: number;
  /** Формат/направление — печатается на карточке через « / ». */
  directions: Direction[];
  /** Пропорции карточки в сетке. Разные пропорции = живая, неровная сетка. */
  ratio: '16 / 9' | '4 / 5' | '3 / 4' | '1 / 1' | '9 / 16';
  /** Loop-превью при наведении. Пусто — карточка покажет заглушку. */
  loop?: string;
  poster?: string;
  /** Мини-шоурил, который открывается по клику. */
  reel?: string;
  /** Что снять/смонтировать под этот слот — видно только в заглушке. */
  hint?: string;
};

/** Подписи направлений для фильтра и карточек. */
export const DIRECTION_LABELS: Record<Direction, string> = {
  INTERVIEW: 'Интервью',
  FASHION: 'Fashion',
  EVENT: 'Мероприятия',
  REPORTAGE: 'Репортаж',
  VERTICAL: 'Вертикальный контент',
  MULTICAM: 'Многокамерная съёмка',
  MOTION: 'Motion graphics',
};

export const projects: Project[] = [
  {
    id: 'fashion-week',
    title: 'Неделя моды',
    year: 2026,
    directions: ['FASHION', 'EVENT'],
    ratio: '4 / 5',
    hint: 'Loop 4 сек · показ, бэкстейдж',
  },
  {
    id: 'big-interview',
    title: 'Большое интервью',
    year: 2025,
    directions: ['INTERVIEW', 'MULTICAM'],
    ratio: '16 / 9',
    hint: 'Loop 4 сек · две камеры, свет',
  },
  {
    id: 'city-forum',
    title: 'Городской форум',
    year: 2025,
    directions: ['EVENT', 'REPORTAGE'],
    ratio: '3 / 4',
    hint: 'Loop 5 сек · зал, сцена, зрители',
  },
  {
    id: 'music-showcase',
    title: 'Музыкальный шоукейс',
    year: 2025,
    directions: ['EVENT', 'MULTICAM'],
    ratio: '16 / 9',
    hint: 'Loop 5 сек · свет, сцена, толпа',
  },
  {
    id: 'brand-reels',
    title: 'Reels для бренда',
    year: 2025,
    directions: ['VERTICAL', 'FASHION'],
    ratio: '9 / 16',
    hint: 'Loop 4 сек · вертикаль 1080×1920',
  },
  {
    id: 'sport-report',
    title: 'Спортивный репортаж',
    year: 2024,
    directions: ['REPORTAGE', 'EVENT'],
    ratio: '4 / 5',
    hint: 'Loop 4 сек · динамика, движение',
  },
  {
    id: 'title-pack',
    title: 'Титры и графика',
    year: 2024,
    directions: ['MOTION'],
    ratio: '1 / 1',
    hint: 'Loop 5 сек · After Effects',
  },
  {
    id: 'backstage-doc',
    title: 'Бэкстейдж-док',
    year: 2024,
    directions: ['REPORTAGE', 'INTERVIEW'],
    ratio: '16 / 9',
    hint: 'Loop 5 сек · съёмочный процесс',
  },
];
