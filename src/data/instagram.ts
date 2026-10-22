// Instagram-feed, gegenereerd door scripts/fetch-instagram.mjs vóór de build
// (niet in git). Ontbreekt het bestand — bv. bij `npm run dev` zonder eerst
// `npm run instagram` — dan is de lijst leeg en verbergt de sectie zich.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export interface InstagramPost {
  id: string;
  type: 'video' | 'image';
  caption: string;
  permalink: string;
  timestamp: string;
  poster: string;
  video: string | null;
}

export interface InstagramFeed {
  username: string | null;
  posts: InstagramPost[];
}

const file = path.join(process.cwd(), 'src', 'data', 'instagram.json');

export const instagramFeed: InstagramFeed = existsSync(file)
  ? JSON.parse(readFileSync(file, 'utf-8'))
  : { username: null, posts: [] };

// Vaste profiellink, ook als de API (nog) niets teruggeeft.
export const instagramProfile = {
  handle: 'bilto.be.renovaties',
  href: 'https://www.instagram.com/bilto.be.renovaties/',
} as const;
