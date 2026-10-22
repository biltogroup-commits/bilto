import type { APIRoute } from 'astro';

// Dagelijkse Vercel Cron (zie vercel.json): start een nieuwe build via de
// Deploy Hook, zodat scripts/fetch-instagram.mjs de nieuwste posts ophaalt.
// De Instagram-token (systeemgebruiker, vervalt nooit) hoeft niet verlengd
// te worden.
//
// Env vars (Vercel → Settings → Environment Variables, type Secret):
//   CRON_SECRET      willekeurige lange string; Vercel stuurt hem mee als Bearer
//   DEPLOY_HOOK_URL  Settings → Git → Deploy Hooks (branch master)
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) {
    console.log('[cron/instagram] MISLUKT: DEPLOY_HOOK_URL ontbreekt');
    return Response.json({ rebuild: 'MISLUKT: DEPLOY_HOOK_URL ontbreekt' }, { status: 500 });
  }

  const res = await fetch(hook, { method: 'POST' });
  const rebuild = res.ok ? 'gestart' : `MISLUKT: ${res.status}`;
  console.log('[cron/instagram]', rebuild);
  return Response.json({ rebuild }, { status: res.ok ? 200 : 500 });
};
