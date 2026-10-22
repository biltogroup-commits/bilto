// Alle bedrijfsgegevens op één plek. Wijzig hier — niet in de componenten.
const address = 'Mosten 7A, 9160 Lokeren';
const country = 'België';

export const company = {
  name: 'Bilto',
  // Zoals in de KBO (naam BILTO, rechtsvorm BV) — gecontroleerd 2026-10-08.
  legalName: 'BILTO BV',
  slogan: 'Sterke verbindingen, solide constructies',
  city: 'Lokeren',
  region: 'Oost-Vlaanderen',
  country,
  phone: '0492 47 46 42',
  phoneHref: 'tel:+32492474642',
  email: 'info@bilto.be',
  emailHref: 'mailto:info@bilto.be',
  street: 'Mosten 7A',
  postalCode: '9160',
  address,
  // Officiële Google Maps URLs-vorm (geen API-key nodig) — opent de app op
  // mobiel, de website op desktop. Afgeleid van `address`, dus bij een
  // adreswijziging volstaat het om straat/postcode/address aan te passen.
  mapsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${country}`)}`,
  vat: 'BTW BE 1011.433.945',
  responseTime: 'Antwoord binnen 24 uur',
} as const;

export const values = [
  'Ordelijk georganiseerd',
  'Stipt op tijd',
  'Klantvriendelijk',
  'Correct & betrouwbaar',
] as const;
