import * as D from '../data/portfolioData';
import { site, about } from '../data/siteData';
import { sections } from '../data/navigationData';
import { asset, appleVideo } from './assets';
import * as M from './music';
import { PREVIEWS } from '../components/PreviewReel';
import { FOCUS, parseRoute } from '../data/focusData';
// Two-stage loading, so the loading screen stays short:
//   1) CRITICAL (blocks the intro): ONLY backgrounds, UI art, logo + section icons and the section PREVIEW videos (components/PreviewReel.jsx).
//   2) BACKGROUND (starts right after the intro, while the visitor watches a preview): thumbnails (the opened section first), then the other songs. Project videos load when they are opened.
// URLs are collected automatically from your data files (portfolioData / siteData) — new entries are picked up with no changes here.
// Missing files are skipped silently. Anything still loading after TIMEOUT_MS keeps loading in the background.
const TIMEOUT_MS = 60000, BG_DELAY_MS = 300, IMG = /\.(webp|png|jpe?g|gif|avif|svg)(\?|$)/i, VID = /\.(webm|mp4)(\?|$)/i;
const R = parseRoute(location.hash, sections), FOC = R.focus ? FOCUS[R.focus] : null; // a focused link (#/rigging/focused …) preloads ONLY what that page uses; the normal link preloads the normal portfolio
const touch = matchMedia('(pointer:coarse)').matches, BG = appleVideo() ? ['/assets/backgrounds/backgroundApple.webm'] : ['/assets/backgrounds/background.webm', '/assets/backgrounds/foreground.webm'];
const COMMON = ['/assets/intro/color-logo.webp', '/assets/backgrounds/background.jpg', '/assets/ui/front-left.webp', '/assets/audio/PlayerIcon.webp', ...BG];
const STATIC = FOC
  ? [...COMMON, '/assets/ui/FocusedWindow.webp', '/assets/ui/FocusedLayerTop.webp', ...(touch ? ['/assets/ui/main-window.webp'] : []), ...(FOC.nav.includes('awards') ? ['/assets/ui/award-card.webp'] : []), ...(FOC.nav.includes('about') ? ['/assets/ui/about-layout.webp'] : [])] // (phones use the normal window frame, bigger screens the focused art)
  : [...COMMON, '/assets/ui/main-window.webp', '/assets/ui/small-window.webp', '/assets/ui/award-card.webp', '/assets/ui/about-layout.webp', '/assets/ui/back-right.webp'];
function walk(o, out, seen = new Set()) { if (typeof o === 'string') { if ((o.startsWith('/assets/') || o.startsWith('http')) && (IMG.test(o) || VID.test(o))) out.add(o); return; }
  if (!o || typeof o !== 'object' || seen.has(o)) return; seen.add(o); for (const v of Object.values(o)) walk(v, out, seen); }

const imgTask = (url, rep) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => { rep(1); res(); }; i.src = asset(url); });
const streamTask = async (url, rep) => { try { const r = await fetch(asset(url)); if (!r.ok || /html/.test(r.headers.get('content-type') || '')) return rep(1);
  const len = +r.headers.get('content-length') || 0, rd = r.body.getReader(); let got = 0; for (;;) { const { done, value } = await rd.read(); if (done) break; got += value.length; if (len) rep(Math.min(0.99, got / len)); } } catch {} rep(1); };
const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); };
const calm = async () => { while (document.querySelector('.viewer')) await new Promise((r) => setTimeout(r, 700)); }; // background stage waits while a viewer/pop-up is open

export async function preloadAll(onProgress) {
  const save = navigator.connection?.saveData, phone = matchMedia('(pointer:coarse)').matches; // data saver: images only · phones: images + background videos only (the big project videos stream when opened)
  const all = new Set(), DATA = { rigging: D.rigging, animation: D.animation, modelling: D.modelling, illustration: D.illustration, awards: D.awards, projects: D.projects, opinions: D.opinions, about };
  if (FOC) FOC.nav.forEach((id) => walk(DATA[id], all)); else { walk(D, all); walk(about, all); } // focused: only the sections in its navigation
  // ---- stage 1: critical ----
  const crit = new Set(STATIC); crit.add(site.logo); (FOC ? FOC.nav : sections.map((s) => s.id)).forEach((id) => crit.add(`/assets/icons/${id}.webp`));
  if (!save && !FOC) Object.values(PREVIEWS).forEach((p) => crit.add(p.src)); // the first-visit preview reels (a missing file is skipped silently). Thumbnails + project videos are NOT waited for any more.
  const hot = R.focus || R.id || 'rigging', hotSet = new Set(); (Array.isArray(D[hot]) ? D[hot] : D.rigging).forEach((it) => typeof it.image === 'string' && hotSet.add(it.image)); // thumbnails of the section being opened load first
  await M.init(); const songs = M.getState().tracks.map((t) => t.url); // song 1 streams by itself through the player's <audio>; the others load in stage 2
  const imgs = [...crit].filter((u) => !VID.test(u)), vids = save ? [] : [...crit].filter((u) => VID.test(u) && (!phone || /backgrounds|previews/.test(u))).sort((a, b) => /backgrounds/.test(b) - /backgrounds/.test(a));
  const total = imgs.length + vids.length || 1, frac = new Map(); let t = 0;
  const rep = (u) => (f) => { frac.set(u, f); const n = performance.now(); if (n - t > 90 || f === 1) { t = n; onProgress?.([...frac.values()].reduce((a, b) => a + b, 0) / total); } };
  const run = Promise.all([pool(imgs, 10, (u) => imgTask(u, rep(u))), pool(vids, 3, (u) => streamTask(u, rep(u)))]);
  await Promise.race([run, new Promise((r) => setTimeout(r, TIMEOUT_MS))]); onProgress?.(1);
  // ---- stage 2: everything else, quietly, after the intro ----
  setTimeout(async () => {
    const noop = () => {}, sec = /thumb|\/animation\/|\/modelling\/|\/awards\/|\/projects\//, score = (u) => (hotSet.has(u) ? 2 : sec.test(u) ? 1 : 0);
    const restImgs = [...all].filter((u) => !crit.has(u) && !VID.test(u)).sort((a, b) => score(b) - score(a)); // thumbnails: the opened section first, then the other sections
    const rest = save || phone ? [] : songs.slice(1, 3); // project videos are no longer prefetched: they stream when opened
    try { await pool(restImgs, 5, async (u) => { await calm(); await imgTask(u, noop); }); await pool(rest, 2, async (u) => { await calm(); await streamTask(u, noop); }); } catch {}
  }, BG_DELAY_MS);
}
