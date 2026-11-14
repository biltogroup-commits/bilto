// Tekst en cijfers van de "Over ons"-sectie.
export const overOns = {
  eyebrow: 'Over ons',
  heading: 'Een aannemer die zelf op de werf staat',
  paragraphs: [
    'Bilto is een aannemer uit Lokeren voor renovatie, dak- en gevelwerken, pleisterwerk, kabelwerken en asbestverwijdering in Oost- en West-Vlaanderen.',
    'We werken zonder tussenpersoon: wie je aan de telefoon krijgt, is wie op de werf staat. Je hebt één aanspreekpunt en één planning, van de offerte tot de oplevering.',
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
