/**
 * Приводит путь к файлу из `public/` к рабочему виду с учётом базы сборки.
 *
 * Сайт живёт не в корне домена, а по адресу вида
 * `https://anastfilms.github.io/portfolio/`, поэтому «/media/x.mp4» ведёт
 * в никуда — нужен префикс «/portfolio/». Пути внутри CSS и импортов Vite
 * переписывает сам, но строки в контенте (`projects.ts`, `about.ts`) —
 * обычные строки времени выполнения, и до них сборщик не добирается.
 *
 * Поэтому в контенте пути пишутся как есть — «media/projects/x.mp4» или
 * «/media/projects/x.mp4», — а этот помощник подставляет базу.
 * Внешние ссылки (http://, https://, data:) остаются нетронутыми.
 */
export function asset(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '');
}
