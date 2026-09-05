/**
 * Общие данные сайта.
 *
 * ⚠️ ЗАПОЛНИТЬ ПЕРЕД ПУБЛИКАЦИЕЙ: имя и контакты сейчас заглушки.
 * Всё остальное (позиционирование, город, тексты кнопок) можно оставить.
 */

export const site = {
  /** Имя на первом экране и в логотипе. */
  name: 'АНАСТАСИЯ',
  /** Латиница для логотипа и марки — короткое, 4–6 букв. */
  brand: 'ANAST',
  brandSuffix: 'FILMS',

  /** Позиционирование из брифа — съёмка и монтаж 50/50. */
  role: 'Videographer & Editor',
  city: 'Москва',
  tagline: 'Videographer & Editor. Москва.',

  /** Три слова, с которыми должно ассоциироваться портфолио. */
  keywords: ['Атмосферные ролики', 'Крупные мероприятия', 'Динамичный монтаж'],

  /** ⚠️ ЗАГЛУШКИ — подставить реальные. */
  contacts: {
    telegram: { label: 'Telegram', handle: '@username', href: 'https://t.me/username' },
    vk: { label: 'VK', handle: 'vk.com/username', href: 'https://vk.com/username' },
    phone: { label: 'Телефон', handle: '+7 (900) 000-00-00', href: 'tel:+79000000000' },
    email: { label: 'Email', handle: 'hello@example.com', href: 'mailto:hello@example.com' },
  },

  nav: [
    { id: 'work', label: 'Работы' },
    { id: 'experience', label: 'Проекты' },
    { id: 'about', label: 'Обо мне' },
    { id: 'skills', label: 'Навыки' },
    { id: 'contacts', label: 'Контакты' },
  ],
} as const;

export type Contact = (typeof site.contacts)[keyof typeof site.contacts];
