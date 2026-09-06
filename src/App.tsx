import { useLenis } from './hooks/useLenis';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Contacts } from './components/Contacts';

/**
 * Порядок секций: первый экран → WORK → На площадке → Обо мне →
 * Инструменты → Контакты.
 *
 * Переходы рисуют сами секции: каждая начинается компонентом SectionSeam
 * со своим профилем рваной бумаги.
 *
 * Глобального слоя зерна поверх страницы больше нет. Прежний Grain стоял
 * выше модалки по z-index и накладывал шум на видео, лица и текст.
 * Фактура теперь живёт на фонах секций, под содержимым.
 *
 * У обёртки есть id: плеер помечает её `inert`, пока открыт просмотр.
 */
export default function App() {
  useLenis();

  return (
    <div className="page" id="page">
      <a className="skip-link" href="#work">К работам</a>

      <main>
        <Hero />
        <Work />
        <Experience />
        <About />
        <Skills />
        <Contacts />
      </main>
    </div>
  );
}
