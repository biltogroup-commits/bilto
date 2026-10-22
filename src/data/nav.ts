// Navigatie in header, mobiel menu en footer.
// Desktop-header toont bewust minder items dan het mobiele menu — zo staat
// het ook in het ontwerp: desktop krijgt "Contact" i.p.v.
// Werkwijze/FAQ, die laatste twee staan enkel in het uitklapbare mobiele menu.
export const desktopNav = [
  { label: 'Diensten', href: '/#diensten' },
  { label: 'Realisaties', href: '/#realisaties' },
  { label: 'Over ons', href: '/#over-ons' },
  { label: 'Contact', href: '/#contact' },
] as const;

export const mobileNav = [
  { label: 'Diensten', href: '/#diensten' },
  { label: 'Realisaties', href: '/#realisaties' },
  { label: 'Over ons', href: '/#over-ons' },
  { label: 'Werkwijze', href: '/#werkwijze' },
  { label: 'FAQ', href: '/#faq' },
] as const;

export const footerCompanyNav = [
  { label: 'Over ons', href: '/#over-ons' },
  { label: 'Realisaties', href: '/#realisaties' },
  { label: 'Werkwijze', href: '/#werkwijze' },
  { label: 'Contact', href: '/#contact' },
] as const;

// Juridische links — onderaan de footer naast ©, niet tussen de gewone
// bedrijfsnavigatie.
export const footerLegalNav = [
  { label: 'Privacybeleid', href: '/privacybeleid' },
  { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
] as const;
