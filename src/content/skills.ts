/**
 * Блок «Навыки».
 *
 * По брифу блок должен быть компактным и визуальным, без ощущения резюме:
 * программы отдельно (с иконками), практические навыки — плотной сеткой тегов.
 */

export type Program = {
  name: string;
  /** Короткая марка, как в Adobe: Pr / Ae / DR. */
  mark: string;
  role: string;
};

export const programs: Program[] = [
  { name: 'Adobe Premiere Pro', mark: 'Pr', role: 'Монтаж' },
  { name: 'Adobe After Effects', mark: 'Ae', role: 'Графика · титры' },
  { name: 'DaVinci Resolve', mark: 'DR', role: 'Цвет' },
];

/** Практические навыки — сгруппированы «камера» / «пост». */
export const craft = {
  shooting: {
    label: 'На площадке',
    items: ['Работа с камерой', 'Многокамерная съёмка', 'Работа со светом', 'Запись звука'],
  },
  post: {
    label: 'На посте',
    items: ['Видеомонтаж', 'Цветокоррекция', 'Sound design', 'Motion graphics'],
  },
} as const;
