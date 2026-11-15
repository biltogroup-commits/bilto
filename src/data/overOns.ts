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
  // 3D-animatie (Blender, bron in 3d/ — niet in git): een woning krijgt een
  // nieuw dak en een nieuwe gevel. Illustratie, geen foto van een werf.
  // Achtergrond = exact --color-sand, zodat het beeld in de sectie opgaat.
  // posterEnd = laatste beeld (zonder JS en bij reduced motion),
  // posterStart = eerste beeld (tot de video start). Formaat 3:4.
  visual: {
    label: 'Illustratie: een woning krijgt een nieuw dak en een nieuwe gevel',
    video: '/over-ons/renovatie.mp4',
    posterStart: '/over-ons/renovatie-start.jpg',
    posterEnd: '/over-ons/renovatie-eind.jpg',
  },
};
