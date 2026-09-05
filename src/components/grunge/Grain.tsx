import './Grain.css';

/**
 * Постоянный слой поверх всего сайта: плёночное зерно + VHS-строчки + виньетка.
 * Держит «неидеальность» картинки во всех секциях сразу, чтобы не городить
 * текстуру в каждом блоке отдельно.
 */
export function Grain() {
  return (
    <div className="grain" aria-hidden="true">
      <div className="grain__noise" />
      <div className="grain__scan" />
      <div className="grain__vignette" />
    </div>
  );
}
