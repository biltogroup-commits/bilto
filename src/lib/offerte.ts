// Verzending van een offerteaanvraag — los van de HTTP-afhandeling in
// src/pages/api/offerte.ts, zodat het kanaal hier kan wisselen zonder de
// route of de bedankpagina aan te raken.
//
// Kanaal: Resend (EU), domein bilto-group.be. Env var (Vercel, Production):
//   RESEND_API_KEY  aangemaakt via Vercel → Integrations → Resend
import { getEntry } from 'astro:content';
import { company } from '../data/company';

export interface OfferteAanvraag {
  naam: string;
  telefoon: string;
  type: string;
  bericht: string;
}

const AFZENDER = 'Bilto website <noreply@bilto-group.be>';
const ONTVANGER = company.email;

/** Naam van de gekozen dienst (het formulier stuurt het id van de collectie). */
async function dienstNaam(type: string): Promise<string> {
  if (!type) return '-';
  const dienst = await getEntry('services', type);
  return dienst?.data.title ?? type;
}

/**
 * Bezorgt de aanvraag bij Bilto. Geeft `true` terug alleen als Resend de
 * mail aanvaard heeft — de bedankpagina belooft enkel dan een terugbelactie.
 */
export async function verstuurAanvraag(aanvraag: OfferteAanvraag): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[offerte] NIET verstuurd: RESEND_API_KEY ontbreekt');
    return false;
  }

  const dienst = await dienstNaam(aanvraag.type);
  const tekst = [
    `Naam: ${aanvraag.naam}`,
    `Telefoon: ${aanvraag.telefoon}`,
    `Dienst: ${dienst}`,
    '',
    'Bericht:',
    aanvraag.bericht || '-',
    '',
    '— Verstuurd via het offerteformulier op www.bilto-group.be',
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: AFZENDER,
        to: ONTVANGER,
        subject: `Offerteaanvraag: ${aanvraag.naam} (${dienst})`,
        text: tekst,
      }),
    });
    if (!res.ok) {
      console.error('[offerte] NIET verstuurd: Resend', res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('[offerte] NIET verstuurd:', error);
    return false;
  }
}
