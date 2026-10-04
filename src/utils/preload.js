import * as D from '../data/portfolioData';
import { site, about } from '../data/siteData';
import { sections } from '../data/navigationData';
import { asset } from './assets';
import * as M from './music';
// Preloads every image, video and song while the intro logo is on screen, so everything is already cached when the desktop appears.
// URLs are collected automatically from your data files (portfolioData / siteData) — new entries are picked up with no changes here.
// Missing files are skipped silently. Anything still loading after TIMEOUT_MS keeps loading in the background.
const TIMEOUT_MS = 60000, IMG = /\.(webp|png|jpe?g|gif|avif|svg)(\?|$)/i, VID = /\.(webm|mp4)(\?|$)/i;
const STATIC = ['/assets/intro/color-logo.webp', '/assets/backgrounds/background.jpg', '/assets/ui/main-window.webp', '/assets/ui/small-window.webp', '/assets/ui/award-card.webp', '/assets/ui/about-layout.webp',
  '/assets/ui/back-right.webp', '/assets/ui/front-left.webp', '/assets/audio/PlayerIcon.webp', '/assets/backgrounds/background.webm', '/assets/backgrounds/foreground.webm'];
function walk(o, out, seen = new Set()) { if (typeof o === 'string') { if ((o.startsWith('/assets/') || o.startsWith('http')) && (IMG.test(o) || VID.test(o))) out.add(o); return; }
  if (!o || typeof o !== 'object' || seen.has(o)) return; seen.add(o); for (const v of Object.values(o)) walk(v, out, seen); }

const imgTask = (url, rep) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => { rep(1); res(); }; i.src = asset(url); });
const streamTask = async (url, rep) => { try { const r = await fetch(asset(url)); if (!r.ok || /html/.test(r.headers.get('content-type') || '')) return rep(1);
  const len = +r.headers.get('content-length') || 0, rd = r.body.getReader(); let got = 0; for (;;) { const { done, value } = await rd.read(); if (done) break; got += value.length; if (len) rep(Math.min(0.99, got / len)); } } catch {} rep(1); };
const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); };

export async function preloadAll(onProgress) {
  const urls = new Set(STATIC.map((u) => u)); urls.add(site.logo); sections.forEach((s) => urls.add(`/assets/icons/${s.id}.webp`)); walk(D, urls); walk(about, urls);
  await M.init(); const songs = M.getState().tracks.map((t) => t.url);
  const save = navigator.connection?.saveData, phone = matchMedia('(pointer:coarse)').matches; // data saver: images only · phones: images + background videos only (the big project videos stream when opened)
  const imgs = [...urls].filter((u) => !VID.test(u)), vids = save ? [] : [...urls].filter((u) => VID.test(u) && (!phone || /backgrounds/.test(u))).sort((a, b) => /backgrounds/.test(b) - /backgrounds/.test(a));
  const total = imgs.length + vids.length + (save || phone ? 0 : songs.length) || 1, frac = new Map(); let t = 0;
  const rep = (u) => (f) => { frac.set(u, f); const n = performance.now(); if (n - t > 90 || f === 1) { t = n; onProgress?.([...frac.values()].reduce((a, b) => a + b, 0) / total); } };
  const run = Promise.all([pool(imgs, 8, (u) => imgTask(u, rep(u))), pool([...vids, ...(save || phone ? [] : songs)], 3, (u) => streamTask(u, rep(u)))]);
  await Promise.race([run, new Promise((r) => setTimeout(r, TIMEOUT_MS))]); onProgress?.(1);
}
