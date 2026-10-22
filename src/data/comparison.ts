// Vergelijkingstabel in de sectie "Waarom Bilto".
export const comparison = {
  heading: 'Waar het verschil zit',
  columnLeft: 'Bilto',
  columnRight: 'Gemiddelde aannemer',
  rows: [
    {
      bilto: 'Eén aannemer voor je hele project',
      other: 'drie losse ploegen die je zelf coördineert',
    },
    {
      bilto: 'Kabelwerken in eigen beheer',
      other: 'kabelwerk uitbesteed aan een derde',
    },
    {
      bilto: 'Asbest wordt door ons verwijderd',
      other: 'aparte firma inhuren voor asbest',
    },
    {
      bilto: 'Familiebedrijf dat zelf uitvoert',
      other: 'tussenpersoon die je project doorverkoopt',
    },
    {
      bilto: 'Direct contact met de zaakvoerder',
      other: 'een callcenter of wisselende contactpersoon',
    },
    {
      bilto: 'Vaste offerteprijs per post',
      other: 'meerwerk dat onderweg opduikt',
    },
  ],
} as const;
