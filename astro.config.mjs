import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { execFileSync } from 'node:child_process';

// Echte lastmod voor de sitemap: datum van de laatste commit die de inhoud
// van die pagina raakte (niet de builddatum). Zonder git-geschiedenis
// (bv. een ondiepe clone) blijft lastmod gewoon weg.
function lastCommitDate(paths) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], { encoding: 'utf8' }).trim();
    return date || undefined;
  } catch {
    return undefined;
  }
}

function contentSources(pathname) {
  if (pathname === '/') {
    return ['src/pages/index.astro', 'src/data', 'src/components/sections', 'src/content/services'];
  }
  const regio = pathname.match(/^\/regio\/([^/]+)\/$/);
  if (regio) return [`src/content/regions/${regio[1]}.md`, 'src/pages/regio/[slug].astro'];
  const dienst = pathname.match(/^\/([^/]+)\/$/);
  if (dienst) return [`src/content/services/${dienst[1]}.md`, 'src/pages/[slug].astro'];
  return [];
}

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
      // Enkel inhoudspagina's in de sitemap: geen bedankpagina, geen oude
      // privacy-URL (redirect) en geen juridische pagina's.
      filter: (page) =>
        !['/offerte-bedankt/', '/privacybeleid/', '/privacy/', '/algemene-voorwaarden/'].some((path) =>
          page.endsWith(path),
        ),
      serialize: (item) => {
        const sources = contentSources(new URL(item.url).pathname);
        const lastmod = sources.length ? lastCommitDate(sources) : undefined;
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
