// Haalt de laatste Instagram-posts van Bilto op vóór `astro build` en zet
// ze lokaal: posters + video's in public/instagram/, de lijst in
// src/data/instagram.json. Bezoekers laden dus niets van Meta (geen cookies,
// geen toestemming nodig, geen trage externe scripts).
//
// Token: een systeemgebruiker-token uit het BILTO business-portfolio
// (Business Settings → System users, vervalt nooit) — via de Graph API
// (graph.facebook.com), het Instagram-account hangt aan de Facebook-pagina.
// De route via Instagram-login vereist een "Instagram Tester"-uitnodiging
// die Instagram sinds 2026 nergens meer laat accepteren.
//
// Faalt nooit de build: zonder token of bij een API-fout wordt een lege
// lijst geschreven en verbergt de Instagram-sectie zich.
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import sharp from 'sharp';

const API = process.env.INSTAGRAM_API_BASE ?? 'https://graph.facebook.com';
const TOKEN = process.env.INSTAGRAM_TOKEN;
// Optioneel: vaste Instagram-account-ID. Zonder wordt hij opgezocht via de
// Facebook-pagina's waar de token toegang toe heeft.
const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const MAX_POSTS = 6;
const MAX_VIDEO_BYTES = 40 * 1024 * 1024; // groter → enkel poster + link naar Instagram
const POSTER_WIDTH = 720; // kaart ~372 CSS-px breed → ruim 2× DPR

const root = process.cwd();
const mediaDir = path.join(root, 'public', 'instagram');
const dataFile = path.join(root, 'src', 'data', 'instagram.json');

async function writeFeed(feed) {
  await writeFile(dataFile, JSON.stringify(feed, null, 2) + '\n');
}

async function getJson(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    // Bewust enkel de foutmelding loggen — nooit de URL (daar zit de token in).
    throw new Error(`Instagram API ${res.status}: ${body.error?.message ?? 'onbekende fout'}`);
  }
  return body;
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  const size = Number(res.headers.get('content-length') ?? 0);
  if (size > MAX_VIDEO_BYTES) {
    await res.body.cancel();
    return false;
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
  return true;
}

async function savePoster(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`poster ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  await sharp(input).resize({ width: POSTER_WIDTH, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(file);
}

// Eerste regel van het onderschrift, zonder hashtags — voor alt-tekst en label.
function shortCaption(caption = '') {
  const firstLine = caption.split('\n').find((line) => line.trim()) ?? '';
  const clean = firstLine.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim();
  return clean.length > 110 ? clean.slice(0, 107).trimEnd() + '…' : clean;
}

async function main() {
  await rm(mediaDir, { recursive: true, force: true });
  await mkdir(mediaDir, { recursive: true });

  if (!TOKEN) {
    console.log('[instagram] Geen INSTAGRAM_TOKEN — sectie wordt verborgen.');
    await writeFeed({ username: null, posts: [] });
    return;
  }

  try {
    const auth = `access_token=${encodeURIComponent(TOKEN)}`;
    let igId = IG_USER_ID;
    if (!igId) {
      const pages = await getJson(`${API}/me/accounts?fields=instagram_business_account&${auth}`);
      igId = pages.data?.find((page) => page.instagram_business_account)?.instagram_business_account.id;
      if (!igId) throw new Error('geen Instagram-account gekoppeld aan de pagina’s van deze token');
    }
    const me = await getJson(`${API}/${igId}?fields=username&${auth}`);
    const media = await getJson(
      `${API}/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=25&${auth}`,
    );

    const posts = [];
    for (const item of media.data ?? []) {
      if (posts.length >= MAX_POSTS) break;
      const isVideo = item.media_type === 'VIDEO';
      // Bij video's met auteursrechtelijk beschermde muziek laat Instagram
      // media_url weg; thumbnail_url is er dan meestal nog wel.
      const posterUrl = isVideo ? item.thumbnail_url : item.media_url ?? item.thumbnail_url;
      if (!posterUrl) continue;

      try {
        const id = String(item.id).replace(/\D/g, '');
        await savePoster(posterUrl, path.join(mediaDir, `${id}.jpg`));
        let video = null;
        if (isVideo && item.media_url && (await download(item.media_url, path.join(mediaDir, `${id}.mp4`)))) {
          video = `/instagram/${id}.mp4`;
        }
        posts.push({
          id,
          type: isVideo ? 'video' : 'image',
          caption: shortCaption(item.caption),
          permalink: item.permalink,
          timestamp: item.timestamp,
          poster: `/instagram/${id}.jpg`,
          video,
        });
      } catch (err) {
        console.warn(`[instagram] Post overgeslagen (${err.message}).`);
      }
    }

    await writeFeed({ username: me.username ?? null, posts });
    console.log(`[instagram] ${posts.length} posts van @${me.username} opgehaald.`);
  } catch (err) {
    console.warn(`[instagram] Ophalen mislukt, sectie wordt verborgen: ${err.message}`);
    await writeFeed({ username: null, posts: [] });
  }
}

await main();
