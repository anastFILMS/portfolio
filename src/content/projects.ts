/**
 * WORK — пять направлений съёмки и монтажа.
 *
 * Это НЕ пять мероприятий с датами: это пять рубрик, за каждой из которых
 * стоит своя подборка. Поэтому здесь нет годов, описаний проектов и
 * названий клиентов — предыдущий набор из восьми выдуманных работ убран.
 *
 * ⚠️ Реальных мини-шоурилов пока нет. `status` показывает, что подключено:
 *   placeholder — ролика нет, кнопка откроет сообщение «Шоурил скоро появится.»
 *   ready       — ролик есть и его можно смотреть
 *
 * Как подключить настоящее медиа:
 *   1. Положить файлы в `public/media/projects/`
 *   2. Прописать `poster`, `previewLoop`, `reel` и поставить status: 'ready'
 *   3. Убрать `temporaryPoster` — он только для проверки вёрстки
 *
 * Ориентиры по файлам:
 *   previewLoop — mp4/webm, 3–6 сек, без звука, ≈до 2 МБ, 720p достаточно
 *   poster      — webp/jpeg, ≈1200 px по ширине, 150–350 КБ
 *   reel        — mp4 H.264/AAC, 20–60 сек, ≈8–20 МБ
 */

export type Direction =
  | 'FASHION'
  | 'EVENT'
  | 'REPORTAGE'
  | 'INTERVIEW'
  | 'MULTICAM'
  | 'VERTICAL'
  | 'MOTION';

export type MediaStatus = 'placeholder' | 'ready';

export type Project = {
  /** Стабильный id: к нему привязаны форма, номер, сторона и движение. */
  id: string;
  /** Номер направления, выводится один раз. */
  number: string;
  title: string;
  /** Готовая подпись категории — печатается как есть. */
  categoryLabel: string;
  directions: Direction[];
  /** С какой стороны кадр: слева или справа от текста. */
  side: 'left' | 'right';
  /** Какая из пяти фиксированных масок используется. */
  maskId: 'work-01' | 'work-02' | 'work-03' | 'work-04' | 'work-05';
  /**
   * Пропорции ВНЕШНЕГО контейнера превью. Не путать с `reelAspectRatio`:
   * вертикальный ролик не обязан раздувать ряд на десктопе.
   */
  coverAspectRatio: string;
  /** Фактические пропорции ролика — их использует плеер. */
  reelAspectRatio: string;
  rotateDeg: number;
  mediaWidthPercent: number;
  textWidthPercent: number;

  status: MediaStatus;
  poster?: string;
  previewLoop?: string;
  reel?: string;

  /**
   * Временная обложка на период вёрстки. Это не подтверждённая работа:
   * реальные постеры ещё не переданы.
   */
  temporaryPoster?: string;
  temporaryPosterFit?: 'cover' | 'contain';
  temporaryPosterPosition?: string;
  temporaryCollage?: string[];
};

export const projects: Project[] = [
  {
    id: 'fashion',
    number: '01',
    title: 'В движении',
    categoryLabel: 'FASHION',
    directions: ['FASHION'],
    side: 'left',
    maskId: 'work-01',
    coverAspectRatio: '1.95 / 1',
    reelAspectRatio: '16 / 9',
    rotateDeg: -1.4,
    mediaWidthPercent: 58,
    textWidthPercent: 31,
    status: 'placeholder',
    temporaryPoster: 'media/projects/illustrative-lens.webp',
    temporaryPosterFit: 'cover',
    temporaryPosterPosition: '50% 50%',
  },
  {
    id: 'events',
    number: '02',
    title: 'Громче',
    categoryLabel: 'Мероприятия',
    directions: ['EVENT'],
    side: 'right',
    maskId: 'work-02',
    coverAspectRatio: '2.2 / 1',
    reelAspectRatio: '16 / 9',
    rotateDeg: 1.2,
    mediaWidthPercent: 58,
    textWidthPercent: 31,
    status: 'placeholder',
    temporaryPoster: 'media/projects/illustrative-concert.webp',
    temporaryPosterFit: 'cover',
    temporaryPosterPosition: '50% 65%',
  },
  {
    id: 'reportage',
    number: '03',
    title: 'За кадром',
    categoryLabel: 'Репортаж',
    directions: ['REPORTAGE'],
    side: 'left',
    maskId: 'work-03',
    coverAspectRatio: '1.9 / 1',
    reelAspectRatio: '16 / 9',
    rotateDeg: -0.8,
    mediaWidthPercent: 55,
    textWidthPercent: 31,
    status: 'placeholder',
    temporaryPoster: 'media/about/about-shooting-bubbles.webp',
    temporaryPosterFit: 'cover',
    temporaryPosterPosition: '35% 50%',
  },
  {
    id: 'interview',
    number: '04',
    title: 'Лицом к лицу',
    categoryLabel: 'Интервью / Мультикам',
    directions: ['INTERVIEW', 'MULTICAM'],
    side: 'right',
    maskId: 'work-04',
    coverAspectRatio: '2.1 / 1',
    reelAspectRatio: '16 / 9',
    rotateDeg: 1.0,
    mediaWidthPercent: 59,
    textWidthPercent: 31,
    status: 'placeholder',
    temporaryPoster: 'media/about/reserve-interview-studio.webp',
    temporaryPosterFit: 'cover',
    temporaryPosterPosition: '50% 60%',
  },
  {
    id: 'vertical-motion',
    number: '05',
    title: 'Коротко и ярко',
    categoryLabel: 'Вертикаль / Motion',
    directions: ['VERTICAL', 'MOTION'],
    side: 'left',
    maskId: 'work-05',
    coverAspectRatio: '2.2 / 1',
    /* Вертикальный ролик: плеер покажет его целиком по высоте,
       но внешний кадр в сетке остаётся горизонтальным. */
    reelAspectRatio: '9 / 16',
    rotateDeg: -1.1,
    mediaWidthPercent: 54,
    textWidthPercent: 31,
    status: 'placeholder',
    temporaryCollage: ['media/about/reserve-shooting-brick.webp', 'media/about/about-shooting-bubbles.webp', 'media/about/reserve-interview-studio.webp'],
  },
];
