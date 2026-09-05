import { useLenis } from './hooks/useLenis';
import { Grain } from './components/grunge/Grain';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Contacts } from './components/Contacts';

/**
 * Порядок блоков задан брифом:
 * первый экран → WORK → опыт → обо мне → навыки → контакты.
 *
 * Переходы между секциями рисуют сами секции (TornEdge на своих краях),
 * поэтому здесь остаётся только последовательность.
 */
export default function App() {
  useLenis();

  return (
    <>
      <a className="skip-link" href="#work">К работам</a>

      <Grain />
      <Header />

      <main>
        <Hero />
        <Work />
        <Experience />
        <About />
        <Skills />
        <Contacts />
      </main>
    </>
  );
}
