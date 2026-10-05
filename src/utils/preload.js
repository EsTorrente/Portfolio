import * as D from '../data/portfolioData';
import { site, about } from '../data/siteData';
import { sections } from '../data/navigationData';
import { asset } from './assets';
import * as M from './music';
// Two-stage loading, so the loading screen stays short:
//   1) CRITICAL (blocks the intro): backgrounds, UI, logo + section icons, every card thumbnail, and Eridan's first video.
//   2) BACKGROUND (starts shortly after the desktop appears, never blocks anything): all remaining images, then the rest of the videos
//      (first video of each project before the second ones), then the other songs. It pauses while a pop-up/viewer is open so it never competes with what the visitor is watching.
// URLs are collected automatically from your data files (portfolioData / siteData) — new entries are picked up with no changes here.
// Missing files are skipped silently. Anything still loading after TIMEOUT_MS keeps loading in the background.
const TIMEOUT_MS = 60000, BG_DELAY_MS = 2500, IMG = /\.(webp|png|jpe?g|gif|avif|svg)(\?|$)/i, VID = /\.(webm|mp4)(\?|$)/i;
const EAGER_VIDEO_OF = 'blender-01'; // ✏️ project whose FIRST video loads during the loading screen (Eridan). Everything else loads afterwards.
const STATIC = ['/assets/intro/color-logo.webp', '/assets/backgrounds/background.jpg', '/assets/ui/main-window.webp', '/assets/ui/small-window.webp', '/assets/ui/award-card.webp', '/assets/ui/about-layout.webp',
  '/assets/ui/back-right.webp', '/assets/ui/front-left.webp', '/assets/audio/PlayerIcon.webp', '/assets/backgrounds/background.webm', '/assets/backgrounds/foreground.webm'];
function walk(o, out, seen = new Set()) { if (typeof o === 'string') { if ((o.startsWith('/assets/') || o.startsWith('http')) && (IMG.test(o) || VID.test(o))) out.add(o); return; }
  if (!o || typeof o !== 'object' || seen.has(o)) return; seen.add(o); for (const v of Object.values(o)) walk(v, out, seen); }

const imgTask = (url, rep) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => { rep(1); res(); }; i.src = asset(url); });
const streamTask = async (url, rep) => { try { const r = await fetch(asset(url)); if (!r.ok || /html/.test(r.headers.get('content-type') || '')) return rep(1);
  const len = +r.headers.get('content-length') || 0, rd = r.body.getReader(); let got = 0; for (;;) { const { done, value } = await rd.read(); if (done) break; got += value.length; if (len) rep(Math.min(0.99, got / len)); } } catch {} rep(1); };
const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); };
const calm = async () => { while (document.querySelector('.viewer')) await new Promise((r) => setTimeout(r, 700)); }; // background stage waits while a viewer/pop-up is open

export async function preloadAll(onProgress) {
  const save = navigator.connection?.saveData, phone = matchMedia('(pointer:coarse)').matches; // data saver: images only · phones: images + background videos only (the big project videos stream when opened)
  const all = new Set(); walk(D, all); walk(about, all);
  // ---- stage 1: critical ----
  const crit = new Set(STATIC); crit.add(site.logo); sections.forEach((s) => crit.add(`/assets/icons/${s.id}.webp`));
  [D.rigging, D.animation, D.modelling, D.awards, D.projects].forEach((list) => list.forEach((it) => { if (typeof it.image === 'string' && (it.image.startsWith('/assets/') || it.image.startsWith('http'))) crit.add(it.image); })); // every card thumbnail
  const eager = D.rigging.find((r) => r.id === EAGER_VIDEO_OF)?.videos?.[0]?.src; if (eager && !save && !phone) crit.add(eager);
  await M.init(); const songs = M.getState().tracks.map((t) => t.url); // song 1 streams by itself through the player's <audio>; the others load in stage 2
  const imgs = [...crit].filter((u) => !VID.test(u)), vids = save ? [] : [...crit].filter((u) => VID.test(u) && (!phone || /backgrounds/.test(u))).sort((a, b) => /backgrounds/.test(b) - /backgrounds/.test(a));
  const total = imgs.length + vids.length || 1, frac = new Map(); let t = 0;
  const rep = (u) => (f) => { frac.set(u, f); const n = performance.now(); if (n - t > 90 || f === 1) { t = n; onProgress?.([...frac.values()].reduce((a, b) => a + b, 0) / total); } };
  const run = Promise.all([pool(imgs, 8, (u) => imgTask(u, rep(u))), pool(vids, 3, (u) => streamTask(u, rep(u)))]);
  await Promise.race([run, new Promise((r) => setTimeout(r, TIMEOUT_MS))]); onProgress?.(1);
  // ---- stage 2: everything else, quietly, after the intro ----
  setTimeout(async () => {
    const num = (u) => +(/-(\d+)\.\w+$/.exec(u)?.[1] || 0), noop = () => {};
    const restImgs = [...all].filter((u) => !crit.has(u) && !VID.test(u)); // (crit images are already cached; never fetched twice)
    const restVids = save ? [] : [...all].filter((u) => !crit.has(u) && VID.test(u) && !phone).sort((a, b) => num(a) - num(b)); // video 01 of every project before video 02, etc.
    const rest = [...restVids, ...(save || phone ? [] : songs.slice(1))];
    try { await pool(restImgs, 3, async (u) => { await calm(); await imgTask(u, noop); }); await pool(rest, 2, async (u) => { await calm(); await streamTask(u, noop); }); } catch {}
  }, BG_DELAY_MS);
}
