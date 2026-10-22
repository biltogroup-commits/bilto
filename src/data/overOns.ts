// Tekst en cijfers van de "Over ons"-sectie.
export const overOns = {
  eyebrow: 'Over ons',
  heading: 'Een stiel die van vader op zoon gaat',
  paragraphs: [
    'Bilto is een familiebedrijf uit Lokeren. Malik Vitayev leidt de zaak, zijn vader is werfleider — het vak is van vader op zoon doorgegeven.',
    'We werken zonder tussenpersoon: wie je aan de telefoon krijgt, is wie op de werf staat.',
  ],
  // Tijdelijke cijfers — vervangen door de definitieve waarden.
  counters: [
    { value: '8', suffix: 'jaar ervaring' },
    { value: '80', suffix: 'afgewerkte projecten' },
    { value: '95%', suffix: 'klanten komt terug' },
  ],
  image: {
    // Tijdelijke illustratie; het label blijft bewust generiek (geen namen).
    // Vervangen door een teamfoto zodra die er is. Formaat 3:4.
    label: 'Het team van Bilto op de werf',
    ratio: '3:4' as const,
    src: '/images/team-bilto-werf.jpg' as string | undefined,
  },
};
