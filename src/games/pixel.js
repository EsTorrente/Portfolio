// Tiny 8-bit toolkit: every sprite is drawn from text rows (no image files needed). Replace later with your own art if you like.
const cache = new Map();
export function sprite(rows, pal, scale = 1) { const key = rows.join('|') + JSON.stringify(pal) + scale; if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = rows[0].length * scale; c.height = rows.length * scale; const x = c.getContext('2d');
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i * scale, j * scale, scale, scale); } })); cache.set(key, c); return c; }
export const dataUrl = (c) => c.toDataURL();
// A=fur P=pattern E=eyes I=inner ear N=nose M=muzzle
export const CAT = ['A........A', 'AI......IA', 'AAAAAAAAAA', 'APAAPPAAPA', 'AAEAAAAEAA', 'AAEAAAAEAA', 'AAAAAAAAAA', 'AAMMNNMMAA', '.AMMMMMMA.', '.AAAAAAAA.', '..AAAAAA..'];
export const CATS = [ // 8 cat "masks" for the memory game (first one is the hero cat)
  { n: 'orange', A: '#ff8c18', P: '#b24a00', E: '#120b08', I: '#ffd36a', M: '#ffe9c4', N: '#ff7a8a' },
  { n: 'black', A: '#2a1a12', P: '#3d2a1e', E: '#ffd36a', I: '#6b3b2a', M: '#5a4030', N: '#ff7a8a' },
  { n: 'white', A: '#f4e7d0', P: '#f4e7d0', E: '#3a2314', I: '#ffb7c5', M: '#fff3dd', N: '#ff7a8a' },
  { n: 'grey', A: '#8d8a96', P: '#5d5a66', E: '#ffd36a', I: '#c9a0b0', M: '#cfcdd6', N: '#ff7a8a' },
  { n: 'siamese', A: '#f4e7d0', P: '#6b4a35', E: '#4aa3ff', I: '#6b4a35', M: '#6b4a35', N: '#2a1a12' },
  { n: 'calico', A: '#fff3dd', P: '#ff8c18', E: '#2a1a12', I: '#ffb7c5', M: '#fff3dd', N: '#ff7a8a' },
  { n: 'sakura', A: '#ffb7c5', P: '#ff7aa0', E: '#3a2314', I: '#fff3dd', M: '#ffe3ea', N: '#c8446a' },
  { n: 'star', A: '#ffd36a', P: '#ffb52e', E: '#ff4d4d', I: '#ff8c18', M: '#fff3dd', N: '#b24a00' }];
export const catSprite = (i, scale) => sprite(CAT, CATS[i], scale);
export const DOG = ['DD......DD', 'DDD....DDD', 'DDDDDDDDDD', 'DDEDDDDEDD', 'DDEDDDDEDD', 'DDDDDDDDDD', 'DDDDSSDDDD', 'DDDSSSSDDD', '.DDDNNDDD.', '..DDDDDD..'];
export const dogSprite = (D, scale, scared = false) => sprite(DOG, scared ? { D: '#6f8cff', E: '#fff3dd', S: '#c9d4ff', N: '#fff3dd' } : { D, E: '#120b08', S: '#ffe9c4', N: '#120b08' }, scale);
export const PAW = ['..P..P..', '.PPP.PPP', '.PPP.PPP', '..P..P..', '...PPP..', '..PPPPP.', '..PPPPP.', '...P.P..'];
export const pawSprite = (scale) => sprite(PAW, { P: '#ff8c18' }, scale);
