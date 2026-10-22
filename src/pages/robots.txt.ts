import type { APIRoute } from 'astro';
import { launched } from '../data/site';

// Vóór lancering bewust géén `Disallow: /`: Google moet de pagina's kunnen
// crawlen om de noindex-tag te zien. Een geblokkeerde URL kan anders toch
// (zonder inhoud) in de zoekresultaten verschijnen via externe links.
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /'];
  if (launched) lines.push('', `Sitemap: ${new URL('sitemap-index.xml', site)}`);
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
