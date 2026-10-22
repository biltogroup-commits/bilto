// Verzending van een offerteaanvraag — los van de HTTP-afhandeling in
// src/pages/api/offerte.ts, zodat het kanaal (Resend, CRM, ...) hier kan
// wisselen zonder de route of de bedankpagina aan te raken.

export interface OfferteAanvraag {
  naam: string;
  telefoon: string;
  type: string;
  bericht: string;
}

/**
 * Bezorgt de aanvraag bij Bilto. Geeft `true` terug alleen als ze echt
 * aangekomen is — de bedankpagina belooft enkel een terugbelactie als dat zo is.
 */
export async function verstuurAanvraag(aanvraag: OfferteAanvraag): Promise<boolean> {
  // TODO: koppelen aan Resend zodra ontvanger + verzenddomein vastliggen
  // (zie gedeelde basis integraties/email-resend.md). Tot dan komt er niets
  // aan, dus melden we eerlijk dat het niet verstuurd is.
  console.log('Offerteaanvraag NIET verstuurd (geen kanaal):', aanvraag);
  return false;
}
