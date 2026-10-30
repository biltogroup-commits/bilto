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

  // Ingekort tot een redelijke lengte; regeleinden uit naam/telefoon weg,
  // want die komen in het onderwerp van de mail.
  const veld = (key: string, max: number) => String(data.get(key) ?? '').trim().slice(0, max);
  const naam = veld('naam', 100).replace(/[\r\n]+/g, ' ');
  const telefoon = veld('telefoon', 40).replace(/[\r\n]+/g, ' ');
  const type = veld('type', 60);
  const bericht = veld('bericht', 3000);

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
