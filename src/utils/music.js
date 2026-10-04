import { asset } from './assets';
// Background-music engine (one <audio> element shared by the whole site).
// Files: public/assets/audio/song-01 … song-04 (.mp3 / .m4a / .ogg / .wav). Missing songs are skipped.
// duck(token) / release(token): fades the music out and pauses it while a video plays, then resumes and fades back in.
const FILES = ['song-01', 'song-02', 'song-03', 'song-04'], EXTS = ['mp3', 'm4a', 'ogg', 'wav'];
export const FADE_OUT_MS = 1800, FADE_IN_MS = 2200;
const audio = typeof Audio !== 'undefined' ? new Audio() : null; if (audio) audio.preload = 'auto';
let initP = null, muted = false, tracks = [], idx = 0, want = false, wasPlaying = false, raf = 0, started = false; const ducks = new Set(), subs = new Set();

try { muted = localStorage.getItem('mar-music') === 'off'; } catch {}
let vol = 0.3; try { const v = parseFloat(localStorage.getItem('mar-music-vol')); if (v >= 0 && v <= 1) vol = v; } catch {} // default volume 30%, remembered between visits
let fading = false; if (audio) { audio.muted = muted; try { audio.volume = vol; } catch {} }
export const setVolume = (v) => { vol = Math.max(0, Math.min(1, v)); try { localStorage.setItem('mar-music-vol', String(vol)); } catch {}
  if (muted && vol > 0) setMuted(false); if (audio && !fading && !ducks.size) { try { audio.volume = vol; } catch {} } emit(); };
export const setMuted = (m) => { muted = m; if (audio) audio.muted = m; try { localStorage.setItem('mar-music', m ? 'off' : 'on'); } catch {} emit(); };
export const getState = () => ({ volume: vol, muted, tracks, idx, playing: !!audio && !audio.paused, time: audio?.currentTime || 0, dur: audio?.duration || 0 });
const emit = () => { const s = getState(); subs.forEach((f) => f(s)); };
export const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };

const fade = (to, ms, done) => { cancelAnimationFrame(raf); fading = true; const tgt = typeof to === 'function' ? to : () => to, from = audio.volume, t0 = performance.now();
  const step = (t) => { const k = Math.min(1, (t - t0) / ms), e = k * k * (3 - 2 * k); // smoothstep
    try { audio.volume = from + (tgt() - from) * e; } catch {} if (k < 1) raf = requestAnimationFrame(step); else { fading = false; done?.(); } };
  raf = requestAnimationFrame(step); };

const load = (i, autoplay) => { if (!tracks.length) return; idx = (i + tracks.length) % tracks.length; audio.src = asset(tracks[idx].url); audio.load(); emit(); if (autoplay) go(); };
const go = () => { if (ducks.size) { wasPlaying = true; return; } audio.play().then(emit).catch(() => {}); };

export const init = () => (initP ||= _init());
async function _init() { if (!audio) return; want = true; // try to autoplay right away (allowed when muted, or when the browser trusts the site; otherwise the first click/tap/key starts it)
  for (const f of FILES) for (const ext of EXTS) { const url = `/assets/audio/${f}.${ext}`;
    try { const r = await fetch(asset(url), { method: 'HEAD' }); if (r.ok && !/html/.test(r.headers.get('content-type') || '')) { tracks.push({ file: f, url }); break; } } catch {} }
  if (!tracks.length) { emit(); return; } load(0, want); }

export const play = () => { want = true; if (!tracks.length) return; if (!audio.src) load(idx); if (!ducks.size) { cancelAnimationFrame(raf); fading = false; try { audio.volume = vol; } catch {} } go(); };
export const pause = () => { want = false; wasPlaying = false; audio?.pause(); emit(); };
export const toggle = () => (audio?.paused || (ducks.size && wasPlaying) ? play() : pause());
export const next = () => load(idx + 1, !audio.paused || want || wasPlaying);
export const prev = () => (audio.currentTime > 3 ? (audio.currentTime = 0) : load(idx - 1, !audio.paused || want || wasPlaying));
export const seek = (t) => { if (audio) { audio.currentTime = t; emit(); } };

export function duck(token) { if (!audio || ducks.has(token)) return; ducks.add(token);
  if (ducks.size === 1) { wasPlaying = !audio.paused; if (wasPlaying) fade(0, FADE_OUT_MS, () => { if (ducks.size) { audio.pause(); emit(); } }); } }
export function release(token) { if (!audio || !ducks.delete(token) || ducks.size) return;
  if (wasPlaying) { wasPlaying = false; audio.play().then(emit).catch(() => {}); fade(() => vol, FADE_IN_MS); } else if (!audio.paused) fade(() => vol, FADE_IN_MS); }

if (audio) { ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange'].forEach((e) => audio.addEventListener(e, emit));
  audio.addEventListener('ended', () => (tracks.length > 1 ? load(idx + 1, true) : (audio.currentTime = 0, go()))); }
