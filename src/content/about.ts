/**
 * Блок «Обо мне».
 *
 * Текст точный и короткий. Прежние четыре абзаца, стаж «5 лет», проценты
 * «50/50» и приписка на полях убраны: это были придуманные сведения,
 * которых никто не подтверждал.
 */

export type AboutPhoto = {
  src: string;
  alt: string;
  /** Роль в коллаже — раскладку задаёт CSS по этому имени. */
  role: 'left-back' | 'center-main' | 'front-small';
  objectPosition: string;
};

export const about = {
  heading: 'Обо мне',
  name: 'Анастасия Бричко',
  role: 'Видеограф и монтажёр. Москва.',
  body: 'Снимаю крупные мероприятия и медиапроекты. Занимаюсь съёмкой и динамичным монтажом.',

  /** Три конкретные фотографии из пакета — коллаж слева. */
  photos: [
    {
      src: 'media/about/about-shooting-bubbles.webp',
      alt: 'Анастасия снимает мероприятие на камеру среди мыльных пузырей.',
      role: 'left-back',
      objectPosition: '35% 50%',
    },
    {
      src: 'media/about/about-speaking.webp',
      alt: 'Анастасия с микрофоном на выступлении.',
      role: 'center-main',
      objectPosition: '55% 42%',
    },
    {
      src: 'media/about/about-headphones.webp',
      alt: 'Анастасия в наушниках.',
      role: 'front-small',
      objectPosition: '50% 45%',
    },
  ] as AboutPhoto[],
};
