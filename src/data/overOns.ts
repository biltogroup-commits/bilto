// Tekst en cijfers van de "Over ons"-sectie.
export const overOns = {
  eyebrow: 'Over ons',
  heading: 'Van plaatsbezoek tot oplevering',
  paragraphs: [
    'Bilto is een bouwbedrijf uit Lokeren, actief in Oost- en West-Vlaanderen. We doen renovaties, dak- en gevelwerken, pleisterwerk, kabelwerken en asbestverwijdering.',
    'We komen eerst kijken en maken dan een gratis offerte. Tijdens de werken weet je wat er gebeurt en wanneer, en na afloop overlopen we het resultaat samen met jou.',
  ],
  // Cijfers van de klant (2026-11-14).
  counters: [
    { value: '4', suffix: 'jaar ervaring' },
    { value: '100+', suffix: 'afgewerkte projecten' },
    { value: '95%', suffix: 'klanten komt terug' },
  ],
  image: {
    // Tijdelijke illustratie met een generiek label. Vervangen door een
    // teamfoto zodra die er is. Formaat 3:4.
    label: 'Het team van Bilto op de werf',
    ratio: '3:4' as const,
    src: '/images/team-bilto-werf.jpg' as string | undefined,
  },
};
