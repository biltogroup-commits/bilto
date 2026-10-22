import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.bilto-group.be',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      // Geen noindex-pagina's in de sitemap: de bedankpagina, en de juridische
      // pagina's zolang ze nog lege stubs zijn (weghalen zodra ze echte tekst hebben).
      filter: (page) =>
        !['/offerte-bedankt/', '/privacybeleid/', '/algemene-voorwaarden/'].some((path) =>
          page.endsWith(path),
        ),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
