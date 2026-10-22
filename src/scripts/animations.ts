// Homepage-animaties (iteratie 2 + nieuwe effecten): fade-in bij scroll,
// parallax, tellers, de getekende lijn in Werkwijze, de voor/na-slider, de
// transparante/inkrimpende header en de filterbare Realisaties-galerij.
// Alleen ingeladen op de homepage (zie index.astro) — andere pagina's
// krijgen deze JS niet.
//
// Alles hier respecteert prefers-reduced-motion: als dat aan staat, doet dit
// bestand niets (de CSS in global.css zorgt dan dat [data-reveal] gewoon
// zichtbaar is, en de SVG-lijn staat al helemaal getekend).
import { animate, inView, scroll, type AnimationPlaybackControlsWithThen } from 'motion';

// `animate()` heeft zoveel overloads (string/number/object/element) dat
// TypeScript bij een simpele { opacity, transform }-keyframe soms de
// verkeerde overload kiest. Dit is een puur type-probleem — Motion's eigen
// runtime accepteert deze aanroepen prima — dus vangen we het hier één keer
// op in plaats van "as any" door heel het bestand te strooien.
type AnyAnimate = (target: unknown, keyframes: unknown, options?: unknown) => AnimationPlaybackControlsWithThen;
const animateAny = animate as unknown as AnyAnimate;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// De vorige opzet liet Motion's animate()/inView per groep of per los
// element een WAAPI-animatie starten, met een aparte drempelwaarde per
// pad en een handmatige stijl-reset achteraf. Te veel bewegende delen: een
// groep die hoger was dan het scherm haalde zijn eigen 20%-drempel pas
// terwijl de inhoud al zichtbaar stond, en de WAAPI-stijlen botsten soms
// met Tailwind's eigen hover-transitions. Nu is het één simpele regel: een
// IntersectionObserver zet enkel een klasse, en een gewone CSS-transition
// (zie global.css) doet de rest — de stagger komt uit :nth-child, niet uit
// JS. Geen losse animatie-engine meer nodig voor iets dat CSS al kan.
function initReveal() {
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        el.classList.add('is-revealed');
        // Zodra de transitie klaar is, ruimen we data-reveal + de klasse op.
        // Zonder dat zou onze transition-property-override op dit element
        // blijven staan en de kaart-hover (Tailwind's transition-all
        // duration-200) permanent vertragen naar onze 600ms.
        el.addEventListener(
          'transitionend',
          () => {
            el.classList.remove('is-revealed');
            el.removeAttribute('data-reveal');
          },
          { once: true },
        );
      });
    },
    // Drempel op 0 + de root 25% van de viewporthoogte naar onder laten
    // uitsteken: de animatie start zodra een element nog ruim onder de
    // zichtbare pagina begint, zodat hij allang klaar is tegen de tijd dat
    // je er echt naartoe scrolt.
    { threshold: 0, rootMargin: '0px 0px 25% 0px' },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => observer.observe(el));
}

function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const raw = el.textContent?.trim() ?? '';
    // Enkel echte getallen tellen op — placeholders als "[XX]" blijven
    // gewoon staan (zie content-eerlijkheidsregel: geen verzonnen cijfers).
    const match = raw.match(/^(\d[\d.,]*)(%?)$/);
    if (!match || prefersReducedMotion) return;

    const suffix = match[2];
    const target = parseInt(match[1].replace(/[.,]/g, ''), 10);
    if (!Number.isFinite(target)) return;

    el.textContent = '0' + suffix;
    inView(
      el,
      () => {
        animateAny(0, target, {
          duration: 1.1,
          ease: 'ease-out',
          onUpdate: (latest: number) => {
            el.textContent = Math.round(latest).toLocaleString('nl-BE') + suffix;
          },
        });
      },
      { amount: 0.6 },
    );
  });
}

function initParallax() {
  if (prefersReducedMotion) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const section = el.closest<HTMLElement>('section');
    if (!section) return;

    // De hero staat al vanaf scrollY 0 volledig in beeld — die begint dus
    // nooit "van onder in te schuiven" zoals een sectie verderop op de
    // pagina. Met dezelfde offset als de rest kreeg de achtergrond bij het
    // laden al een halve verschuiving mee, wat als een sprong voelde zodra
    // je begon te scrollen. Voor de hero lopen we de progressie daarom van
    // "boven in beeld" (laadstand, 0%) naar "helemaal voorbij gescrold".
    const isHero = section.id === 'top';
    const offset = isHero ? ['start start', 'end start'] : ['start end', 'end start'];
    const range = isHero ? ['translateY(0%)', 'translateY(6%)'] : ['translateY(-6%)', 'translateY(6%)'];

    // Max ±6% = 12% totale verschuiving, ruim onder de 15%-grens uit de
    // opdracht. De laag zelf is in de markup groter dan zijn kader
    // (-top-/-bottom-offset) zodat er nooit een rand zichtbaar wordt.
    scroll(animateAny(el, { transform: range }, { ease: 'linear' }), {
      target: section,
      // ScrollOffset is een gesloten unie van tientallen letterlijke
      // strings — voor een simpele if/else tussen twee vaste sets is dat
      // niet de moeite waard om exact te typeren.
      offset: offset as unknown as ['start end', 'end start'],
    });
  });
}

function initWerkwijzeLine() {
  if (prefersReducedMotion) return;
  const line = document.querySelector<SVGLineElement>('[data-werkwijze-line]');
  const section = document.querySelector<HTMLElement>('#werkwijze');
  if (!line || !section) return;

  scroll(animateAny(line, { strokeDashoffset: [100, 0] }, { ease: 'linear' }), {
    target: section,
    offset: ['start 75%', 'end 65%'],
  });
}

function initBeforeAfter() {
  const root = document.querySelector<HTMLElement>('[data-ba]');
  if (!root) return;
  const beforeLayer = root.querySelector<HTMLElement>('[data-ba-before]');
  const divider = root.querySelector<HTMLElement>('[data-ba-divider]');
  const handle = root.querySelector<HTMLElement>('[data-ba-handle]');
  if (!beforeLayer || !divider || !handle) return;

  let current = 50;

  function setPercent(pct: number) {
    current = Math.min(98, Math.max(2, pct));
    const value = `${current}%`;
    // clip-path (niet width) zodat de placeholder-tekst niet meeschaalt
    // en gewoon op zijn plek blijft staan terwijl je sleept.
    beforeLayer!.style.clipPath = `inset(0 ${100 - current}% 0 0)`;
    divider!.style.left = value;
    handle!.style.left = value;
    handle!.setAttribute('aria-valuenow', String(Math.round(current)));
  }

  function percentFromClientX(clientX: number) {
    const rect = root!.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onPointerMove(e: PointerEvent) {
    setPercent(percentFromClientX(e.clientX));
  }

  function onPointerUp(e: PointerEvent) {
    root!.releasePointerCapture(e.pointerId);
    root!.removeEventListener('pointermove', onPointerMove);
  }

  root.addEventListener('pointerdown', (e) => {
    root.setPointerCapture(e.pointerId);
    setPercent(percentFromClientX(e.clientX));
    root.addEventListener('pointermove', onPointerMove);
  });
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);

  handle.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPercent(current - 2);
    else if (e.key === 'ArrowRight') setPercent(current + 2);
    else if (e.key === 'Home') setPercent(2);
    else if (e.key === 'End') setPercent(98);
    else return;
    e.preventDefault();
  });
}

// Enkel relevant voor de homepage-hero: de header start transparant over de
// Hero-afbeelding en wordt solide + iets lager zodra je voorbij de hero
// begint te scrollen. Op andere pagina's rendert Header.astro de
// "transparent"-prop niet, dus [data-header-transparent] bestaat daar
// niet en doet deze functie meteen niets.
function initHeaderScroll() {
  const header = document.querySelector<HTMLElement>('header[data-header-transparent]');
  if (!header) return;

  // Iets voorbij de bovenrand: zo blijft de balk niet al bij de kleinste
  // scroll-jitter (bv. mobiele adresbalk die in-/uitschuift) heen en weer
  // wisselen tussen beide staten.
  const threshold = 40;

  function update() {
    header!.classList.toggle('header-scrolled', window.scrollY > threshold);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}

// Filterknoppen boven de Realisaties-grid. Geen aparte animatie-engine
// nodig: een klasse aan/uit + de CSS-transition in global.css
// ([data-gallery-grid] > *) doet het overgangseffect. Na de transition
// zetten we verborgen items pas op display:none, anders laat de grid een
// lege plek staan zolang het item nog zichtbaar aan het wegfaden is —
// en bij het terugzetten halen we display:none er eerst af en wachten we
// een frame, anders is er niets om vanaf te animeren.
function initGalleryFilter() {
  const grid = document.querySelector<HTMLElement>('[data-gallery-grid]');
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const countEl = document.querySelector<HTMLElement>('[data-gallery-count]');
  const emptyEl = document.querySelector<HTMLElement>('[data-gallery-empty]');
  if (!grid || !buttons.length) return;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-category]'));
  const total = items.length;

  function setItemVisible(item: HTMLElement, visible: boolean) {
    if (visible) {
      item.style.display = '';
      requestAnimationFrame(() => item.classList.remove('gallery-item-hidden'));
    } else {
      item.classList.add('gallery-item-hidden');
      item.addEventListener(
        'transitionend',
        () => {
          if (item.classList.contains('gallery-item-hidden')) item.style.display = 'none';
        },
        { once: true },
      );
    }
  }

  function applyFilter(value: string) {
    let visible = 0;
    items.forEach((item) => {
      const matches = value === 'alles' || item.dataset.category === value;
      if (matches) visible += 1;
      setItemVisible(item, matches);
    });

    if (countEl) countEl.textContent = `${visible} van ${total} projecten`;
    if (emptyEl) emptyEl.classList.toggle('hidden', visible !== 0);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      // De stijl volgt uit aria-pressed: (Tailwind-variant in Realisaties.astro).
      buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn === button)));
      applyFilter(button.dataset.filter ?? 'alles');
    });
  });
}

// De Hero-video heeft altijd het HTML-attribuut autoplay (zo speelt hij ook
// zonder JS gewoon af), maar bij prefers-reduced-motion pauzeren we hem
// hier meteen weer — dat kán niet met CSS alleen, autoplay is geen
// stijlbare eigenschap. Blijft op het geposterde eerste frame staan.
function initHeroVideo() {
  if (!prefersReducedMotion) return;
  document.querySelectorAll<HTMLVideoElement>('video[data-hero-video]').forEach((video) => {
    video.pause();
  });
}

// Beveiliging tegen dubbele opstart: als Vite/Astro's dev-HMR dit script
// opnieuw uitvoert zonder de pagina volledig te herladen (gebeurt bij het
// bewerken van bestanden terwijl de pagina open staat), zou je zonder deze
// guard een tweede set observers bovenop de eerste krijgen — dan animeert
// dezelfde content meermaals en lijkt hij te "verdwijnen" tussen de
// concurrerende animaties in. In productie (één schone paginalaad) doet
// deze guard niets.
declare global {
  interface Window {
    __biltoAnimationsInit?: boolean;
  }
}

if (!window.__biltoAnimationsInit) {
  window.__biltoAnimationsInit = true;
  initReveal();
  initCounters();
  initParallax();
  initWerkwijzeLine();
  initBeforeAfter();
  initHeaderScroll();
  initGalleryFilter();
  initHeroVideo();
}
