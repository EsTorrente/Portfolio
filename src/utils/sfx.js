import { asset } from './assets';
// Sound effects. Drop your own files in public/assets/audio/ named: hover, click, tick, open, close, viewer, ready  (.wav, .mp3 or .ogg).
// Any file that is missing falls back to a soft built-in synthesized sound, so it works with zero files.
const KEY = 'mar-sfx', NAMES = ['hover', 'click', 'tick', 'open', 'close', 'viewer', 'ready'];
let ctx, master, muted = false, last = 0; const buffers = {}, subs = new Set();
try { muted = localStorage.getItem(KEY) === 'off'; } catch {}
export const isMuted = () => muted;
export const setMuted = (m) => { muted = m; try { localStorage.setItem(KEY, m ? 'off' : 'on'); } catch {} subs.forEach((f) => f(m)); };
export const onMuteChange = (f) => { subs.add(f); return () => subs.delete(f); };

const ac = () => { if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination); NAMES.forEach(load); }
  if (ctx.state === 'suspended') ctx.resume(); return ctx; };
async function load(name) { for (const ext of ['wav', 'mp3', 'ogg']) { try { const r = await fetch(asset(`/assets/audio/${name}.${ext}`)); if (!r.ok || /html/.test(r.headers.get('content-type') || '')) continue;
  buffers[name] = await ctx.decodeAudioData(await r.arrayBuffer()); return; } catch {} } }

const tone = (c, { f = 440, f2, t = 0, d = 0.15, type = 'sine', v = 0.2 }) => { const o = c.createOscillator(), g = c.createGain(), s = c.currentTime + t;
  o.type = type; o.frequency.setValueAtTime(f, s); if (f2) o.frequency.exponentialRampToValueAtTime(f2, s + d);
  g.gain.setValueAtTime(0.0001, s); g.gain.linearRampToValueAtTime(v, s + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, s + d);
  o.connect(g); g.connect(master); o.start(s); o.stop(s + d + 0.03); };
const swoosh = (c, { d = 0.4, v = 0.07, f1 = 300, f2 = 2400 }) => { const n = c.sampleRate * d, b = c.createBuffer(1, n, c.sampleRate), a = b.getChannelData(0);
  for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
  fl.type = 'bandpass'; fl.Q.value = 1.2; fl.frequency.setValueAtTime(f1, t); fl.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + d * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  s.buffer = b; s.connect(fl); fl.connect(g); g.connect(master); s.start(t); };
const synth = {
  hover: (c) => tone(c, { f: 920, d: 0.05, v: 0.025, type: 'triangle' }),
  click: (c) => { tone(c, { f: 540, f2: 300, d: 0.09, v: 0.15, type: 'triangle' }); tone(c, { f: 1080, d: 0.05, v: 0.035 }); },
  tick: (c) => tone(c, { f: 680, f2: 880, d: 0.07, v: 0.08, type: 'square' }),
  open: (c) => { swoosh(c, {}); [392, 523, 659].forEach((f, i) => tone(c, { f, t: 0.1 + i * 0.07, d: 0.4, v: 0.09, type: 'triangle' })); },
  close: (c) => { swoosh(c, { d: 0.3, v: 0.05, f1: 2000, f2: 250 }); [659, 440].forEach((f, i) => tone(c, { f, t: i * 0.07, d: 0.25, v: 0.08, type: 'triangle' })); },
  ready: (c) => { [523, 659, 784, 1047].forEach((f, i) => tone(c, { f, t: i * 0.09, d: 0.38, v: 0.11, type: 'triangle' })); tone(c, { f: 2093, t: 0.3, d: 0.5, v: 0.03 }); }, // loading finished: bright rising chime
  // boot-screen sounds: one per step
  bootId: (c) => tone(c, { f: 330, f2: 300, d: 0.09, v: 0.05, type: 'square' }),
  bootFound: (c) => { tone(c, { f: 523, d: 0.1, v: 0.09, type: 'triangle' }); tone(c, { f: 784, t: 0.09, d: 0.2, v: 0.09, type: 'triangle' }); },
  bootName: (c) => { swoosh(c, { d: 0.55, v: 0.06, f1: 120, f2: 1600 }); tone(c, { f: 110, f2: 440, d: 0.5, v: 0.05, type: 'sawtooth' }); tone(c, { f: 1319, t: 0.38, d: 0.35, v: 0.05, type: 'sine' }); },
  bootRole: (c) => [1200, 1000, 1400].forEach((f, i) => tone(c, { f, t: i * 0.055, d: 0.035, v: 0.03, type: 'square' })),
  bootMulti: (c) => { tone(c, { f: 440, f2: 880, d: 0.16, v: 0.08, type: 'triangle' }); tone(c, { f: 660, f2: 1320, t: 0.12, d: 0.2, v: 0.07, type: 'triangle' }); },
  chatDeer: (c) => { tone(c, { f: 320, f2: 210, d: 0.12, v: 0.12, type: 'sine' }); tone(c, { f: 640, t: 0.02, d: 0.06, v: 0.03, type: 'triangle' }); },
  chatMar: (c) => { tone(c, { f: 520, f2: 720, d: 0.1, v: 0.1, type: 'triangle' }); tone(c, { f: 1040, t: 0.04, d: 0.07, v: 0.03, type: 'sine' }); },
  bootReady: (c) => { [523, 659, 784, 1047].forEach((f, i) => tone(c, { f, t: i * 0.1, d: 0.5, v: 0.09, type: 'triangle' })); tone(c, { f: 2093, t: 0.4, d: 0.7, v: 0.03 }); },
  viewer: (c) => { tone(c, { f: 300, f2: 620, d: 0.18, v: 0.1 }); tone(c, { f: 920, t: 0.1, d: 0.2, v: 0.04 }); },
};
export function play(name) { if (muted) return; const c = ac(); if (!c) return; const b = buffers[name];
  if (b) { const s = c.createBufferSource(); s.buffer = b; s.connect(master); s.start(); } else synth[name]?.(c); }

// One delegated listener set: hover tick on buttons/links, click sound on buttons/links (data-sfx="none" silences, data-sfx="tick" etc. overrides).
export function initSfx() { let el = null;
  const unlock = () => ac();
  const over = (e) => { if (!matchMedia('(hover:hover)').matches) return; const b = e.target.closest?.('button,a'); if (b !== el) { el = b; const n = performance.now(); if (b && n - last > 70) { last = n; play('hover'); } } };
  const click = (e) => { const b = e.target.closest?.('button,a'); if (!b) return; const s = b.dataset.sfx; if (s !== 'none') play(s || 'click'); };
  addEventListener('pointerdown', unlock, true); addEventListener('keydown', unlock, true); addEventListener('pointerover', over, true); addEventListener('click', click, true);
  return () => { removeEventListener('pointerdown', unlock, true); removeEventListener('keydown', unlock, true); removeEventListener('pointerover', over, true); removeEventListener('click', click, true); }; }
