/**
 * Общие данные сайта.
 *
 * ⚠️ Контакты не заполнены. Реальные Telegram/VK/телефон/почта для этого
 * пакета не переданы, поэтому здесь `null`, а не фальшивые `@username` и
 * `hello@example.com`: неактивный элемент честнее нерабочей ссылки.
 * Как только появится значение — элемент сам станет ссылкой.
 */

export type ContactChannel = {
  label: string;
  /** Что показать пользователю: @ник, номер, адрес. */
  handle: string;
  href: string;
};

export const site = {
  /** Полное имя: «Anastasia B.» из метаданных убрано. */
  name: 'Anastasia Brichko',
  nameRu: 'Анастасия Бричко',
  /** Марка — совпадает с названием репозитория. */
  brand: 'anastFILMS',
  brandHead: 'anast',
  brandTail: 'FILMS',

  role: 'Видеограф и монтажёр',
  city: 'Москва',
  description:
    'Видеограф и монтажёр из Москвы. Съёмка крупных мероприятий и медиапроектов, динамичный монтаж.',

  /** Леттеринг на первом экране. */
  hero: {
    firstName: 'ANASTASIA',
    lastName: 'BRICHKO',
    lead: ['Снимаю и динамично монтирую.', 'Крупные мероприятия и медиапроекты.'],
    ribbon: ['Съёмка', 'Монтаж'],
  },

  contacts: {
    heading: 'Снимем что-нибудь?',
    actionHeading: 'Напиши мне',
    /** Функциональная строка на время, пока каналы не заполнены. */
    unavailableMessage: 'Контакты скоро появятся',
    telegram: null as ContactChannel | null,
    vk: null as ContactChannel | null,
    /** Телефон и почта — опциональные: показываем только с реальными значениями. */
    phone: null as ContactChannel | null,
    email: null as ContactChannel | null,
  },

  nav: [
    { id: 'work', label: 'Работы' },
    { id: 'experience', label: 'Опыт' },
    { id: 'about', label: 'Обо мне' },
    { id: 'skills', label: 'Инструменты' },
    { id: 'contacts', label: 'Контакты' },
  ],
};
