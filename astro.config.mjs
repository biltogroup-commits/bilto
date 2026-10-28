import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.bilto-group.be',
  output: 'static',
  // Oude URL van de privacypagina (stond in de footer tot 2026-10-28).
  redirects: {
    '/privacybeleid': '/privacy',
  },
  adapter: vercel(),
  integrations: [
    sitemap({
      // Geen noindex-pagina's in de sitemap: de bedankpagina, de oude
      // privacy-URL (redirect) en de algemene voorwaarden zolang ze een lege stub zijn.
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
