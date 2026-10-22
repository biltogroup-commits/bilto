import type { APIRoute } from 'astro';
import { verstuurAanvraag } from '../../lib/offerte';

// On-demand route (serverless op Vercel) — de rest van de site blijft statisch.
export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const data = await request.formData();

  // Honeypot: onzichtbaar veld voor mensen, aantrekkelijk voor bots.
  const honeypot = String(data.get('website') ?? '');
  if (honeypot.trim() !== '') {
    return Response.redirect(new URL('/offerte-bedankt', url), 303);
  }

  const naam = String(data.get('naam') ?? '').trim();
  const telefoon = String(data.get('telefoon') ?? '').trim();
  const type = String(data.get('type') ?? '').trim();
  const bericht = String(data.get('bericht') ?? '').trim();

  if (!naam || !telefoon) {
    // Normaal al tegengehouden door de "required"-velden in de browser;
    // dit is enkel een vangnet voor directe/JS-loze edge cases.
    return Response.redirect(new URL('/#contact', url), 303);
  }

  const verstuurd = await verstuurAanvraag({ naam, telefoon, type, bericht });

  const redirectUrl = new URL('/offerte-bedankt', url);
  redirectUrl.searchParams.set('naam', naam);
  if (verstuurd) redirectUrl.searchParams.set('status', 'verstuurd');
  return Response.redirect(redirectUrl, 303);
};
