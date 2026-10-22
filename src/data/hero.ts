// Tekst en beeld van de hero-sectie.
export const hero = {
  eyebrow: 'Lokeren · Oost-Vlaanderen',
  headingLine1: 'Aannemer gezocht in Oost-Vlaanderen?',
  headingLine2: 'Bilto bouwt betrouwbaar.',
  subhead:
    'Sterke verbindingen, solide constructies — jouw partner in bouw, renovatie en kabelwerken in Lokeren en omstreken.',
  primaryCta: { label: 'Gratis offerte', href: '#contact' },
  secondaryCta: { label: 'Bekijk realisaties', href: '#realisaties' },
  // Drone-opnames van een nieuwbouw-woning (horizontaal voor desktop,
  // verticaal voor mobiel). Posters = eerste frame van elke clip, zodat er
  // geen sprong is wanneer de video start.
  video: {
    desktop: { src: '/hero.mp4', poster: '/hero-poster.jpg' },
    mobile: { src: '/hero_mobile.mp4', poster: '/hero-mobile-poster.jpg' },
  },
};
