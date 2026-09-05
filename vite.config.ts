import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Сайт публикуется на GitHub Pages по адресу
 * https://anastfilms.github.io/portfolio/ — то есть НЕ в корне домена.
 * Поэтому base обязан совпадать с именем репозитория, иначе стили, шрифты
 * и медиа будут запрашиваться из корня и вернут 404.
 *
 * При переезде на свой домен или переименовании репозитория базу можно
 * переопределить, не трогая код:
 *   VITE_BASE=/ npm run build          — свой домен, сайт в корне
 *   VITE_BASE=/новое-имя/ npm run build
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/portfolio/',
  build: { outDir: 'dist', assetsInlineLimit: 2048 },
})
