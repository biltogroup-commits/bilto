// Realisaties-sectie. Drie items (dakrenovatie, gevelisolatie, crepi-afwerking)
// tonen werffoto's van Bilto; de andere zijn tijdelijke illustraties. Vervang
// ze per item zodra er een projectfoto is; het bestand hoeft niet dezelfde
// naam te hebben, enkel `image.src` moet ernaar wijzen.
//
// Geen `place`-veld: een plaatsnaam naast een foto is een concrete
// locatieclaim. De kaart toont in plaats daarvan de categorie (dezelfde
// classificatie als de filterknoppen).
export const galleryFilters = [
  { label: 'Alles', value: 'alles' },
  { label: 'Dakwerken', value: 'dakwerken' },
  { label: 'Gevelwerken', value: 'gevelwerken' },
  { label: 'Kabelwerken', value: 'kabelwerken' },
  { label: 'Renovatie', value: 'renovatie' },
  { label: 'Pleisterwerken', value: 'pleisterwerken' },
] as const;

export const galleryItems = [
  {
    title: 'Dakrenovatie',
    category: 'dakwerken',
    image: { label: 'Dakrenovatie', ratio: '4:3' as const, src: '/images/realisaties/dakrenovatie-lokeren.jpg' },
  },
  {
    title: 'Gevelisolatie met crepi',
    category: 'gevelwerken',
    image: { label: 'Gevelisolatie met crepi', ratio: '4:3' as const, src: '/images/realisaties/gevelisolatie-gent.jpg' },
  },
  {
    title: 'Kabeltracé nutsvoorzieningen',
    category: 'kabelwerken',
    image: { label: 'Kabeltracé nutsvoorzieningen', ratio: '4:3' as const, src: '/images/realisaties/kabeltrace-nutsvoorzieningen.jpg' },
  },
  {
    title: 'Volledige woningrenovatie',
    category: 'renovatie',
    image: { label: 'Volledige woningrenovatie', ratio: '4:3' as const, src: '/images/realisaties/volledige-woningrenovatie.jpg' },
  },
  {
    title: 'Pleisterwerk binnenafwerking',
    category: 'pleisterwerken',
    image: { label: 'Pleisterwerk binnenafwerking', ratio: '4:3' as const, src: '/images/realisaties/pleisterwerk-aalst.jpg' },
  },
  {
    title: 'Dakreiniging en herstelling',
    category: 'dakwerken',
    image: { label: 'Dakreiniging en herstelling', ratio: '4:3' as const, src: '/images/realisaties/dakreiniging-herstelling.jpg' },
  },
  {
    title: 'Crepi-afwerking nieuwbouw',
    category: 'gevelwerken',
    image: { label: 'Crepi-afwerking nieuwbouw', ratio: '4:3' as const, src: '/images/realisaties/crepi-waasland.jpg' },
  },
  {
    title: 'Kabelwerken bij verkaveling',
    category: 'kabelwerken',
    image: { label: 'Kabelwerken bij verkaveling', ratio: '4:3' as const, src: '/images/realisaties/kabelwerken-verkaveling.jpg' },
  },
  {
    title: 'Verbouwing tot open leefruimte',
    category: 'renovatie',
    image: { label: 'Verbouwing tot open leefruimte', ratio: '4:3' as const, src: '/images/realisaties/open-leefruimte.jpg' },
  },
] as const;

// Voor/na-vergelijking — vervanging van de dakbedekking. Tijdelijke
// illustratie (hetzelfde pand, gelijk uitgelijnd op het dak na); vervangen
// door voor/na-foto's van één werf zodra die er zijn.
export const beforeAfter = {
  title: 'Voor & na — vervanging van de dakbedekking',
  hint: 'Sleep de lijn om te vergelijken',
  before: { label: 'VOOR', src: '/images/realisaties/dakrenovatie-voor.jpg' },
  after: { label: 'NA', src: '/images/realisaties/dakrenovatie-na.jpg' },
};
