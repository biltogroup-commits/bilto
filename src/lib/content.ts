// Content collections in hun vaste volgorde (`order` in de frontmatter).
// Header, Footer, Diensten en het offerteformulier tonen dezelfde lijst.
import { getCollection } from 'astro:content';

export async function getServices() {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}

export async function getRegions() {
  return (await getCollection('regions')).sort((a, b) => a.data.order - b.data.order);
}
