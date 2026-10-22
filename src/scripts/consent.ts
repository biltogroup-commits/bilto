// Cookie-toestemming: onthoudt de keuze in localStorage (zelf strikt
// noodzakelijk, plaatst geen cookie) en laadt externe inhoud pas na een
// "ja". Draait op elke pagina via CookieBanner.astro.
//
// Een nieuwe categorie toevoegen (bv. `analytics` zodra er GA4 of iets
// gelijkaardigs komt): voeg hem toe aan Categories + DEFAULTS, geef hem
// een toggle in CookieBanner.astro (data-consent-toggle="analytics"), en
// laad het script pas in een listener op 'bilto:consent' wanneer
// detail.analytics true is. Verhoog VERSION als bezoekers opnieuw moeten
// kiezen omdat er een nieuwe categorie bij is.

const KEY = 'bilto-consent';
const VERSION = 1;

type Categories = { media: boolean };
export type Consent = Categories & { v: number; ts: number };

const DEFAULTS: Categories = { media: false };

export function readConsent(): Consent | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return parsed && parsed.v === VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: Partial<Categories>): Consent {
  const consent: Consent = { ...DEFAULTS, ...choice, v: VERSION, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    // Privémodus of geblokkeerde opslag: keuze geldt dan enkel voor deze pagina.
  }
  applyConsent(consent);
  document.dispatchEvent(new CustomEvent<Consent>('bilto:consent', { detail: consent }));
  return consent;
}

// Elk [data-consent-media]-blok bevat een placeholder en de iframe-gegevens
// in data-attributen. De iframe bestaat pas in de DOM na toestemming, dus
// zonder "ja" (of zonder JS) wordt er niets van Google geladen.
export function applyConsent(consent: Consent | null) {
  document.querySelectorAll<HTMLElement>('[data-consent-media]').forEach((el) => {
    const placeholder = el.querySelector<HTMLElement>('[data-consent-placeholder]');
    const existing = el.querySelector('iframe');

    if (consent?.media) {
      if (existing) return;
      const iframe = document.createElement('iframe');
      iframe.src = el.dataset.src ?? '';
      iframe.title = el.dataset.title ?? '';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.className = 'absolute inset-0 h-full w-full';
      el.append(iframe);
      if (placeholder) placeholder.hidden = true;
    } else {
      existing?.remove();
      if (placeholder) placeholder.hidden = false;
    }
  });
}
