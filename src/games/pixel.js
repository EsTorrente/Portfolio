// Tiny 8-bit toolkit: every sprite is drawn from text rows (no image files needed). Replace later with your own art if you like.
const cache = new Map();
export function sprite(rows, pal, scale = 1) { const key = rows.join('|') + JSON.stringify(pal) + scale; if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = rows[0].length * scale; c.height = rows.length * scale; const x = c.getContext('2d');
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i * scale, j * scale, scale, scale); } })); cache.set(key, c); return c; }
export const dataUrl = (c) => c.toDataURL();
// Hero cat, drawn after the deer-cat logo: no muzzle, HUGE shiny eyes, tiny nose, blushing cheeks.
// A=fur P=forehead stripes E=eyes H=eye shine I=inner ear N=nose B=blush
export const CAT = ['A...........A', 'AA.........AA', 'AIA.......AIA', 'AIIAAAAAAAIIA', 'AAAAPAPAPAAAA', 'AAEEEAAAEEEAA', 'AEHHEEAEHHEEA', 'AEHEEEAEHEEEA', 'AEEEEHAEEEEHA', 'AAEEEAAAEEEAA', 'ABBAAANAAABBA', '.AAAAAAAAAAA.', '..AAAAAAAAA..'];
export const CATS = [ // 8 cat "masks" for the memory game (first one is the hero cat)
  { n: 'orange', A: '#ff8c18', P: '#c85a00', E: '#2a1208', I: '#ffd36a', N: '#c8446a', B: '#ff6f5a' },
  { n: 'black', A: '#2a1a12', P: '#4a3326', E: '#ffd36a', I: '#8a4a3a', N: '#ff7a8a', B: '#7a3b2b' },
  { n: 'white', A: '#f4e7d0', P: '#e2cfae', E: '#3a2314', I: '#ffb7c5', N: '#ff7a8a', B: '#ffb0b0' },
  { n: 'grey', A: '#8d8a96', P: '#6d6a78', E: '#ffd36a', I: '#d9a8b8', N: '#ff7a8a', B: '#d98aa0' },
  { n: 'siamese', A: '#f4e7d0', P: '#6b4a35', E: '#4aa3ff', I: '#6b4a35', N: '#2a1a12', B: '#e8b8a0' },
  { n: 'calico', A: '#fff3dd', P: '#ff8c18', E: '#2a1a12', I: '#ffb7c5', N: '#ff7a8a', B: '#ffb0a0' },
  { n: 'sakura', A: '#ffb7c5', P: '#ff7aa0', E: '#3a2314', I: '#fff3dd', N: '#c8446a', B: '#ff5a85' },
  { n: 'star', A: '#ffd36a', P: '#ffb52e', E: '#ff4d4d', I: '#ff8c18', N: '#b24a00', B: '#ff9a4a' }];
export const catSprite = (i, scale) => sprite(CAT, { H: '#ffffff', ...CATS[i] }, scale);
// Cute little monster (replaces the dogs): horns, big googly eyes, tiny fangs, wobbly bottom.
// D=body X=horns W=eye white P=pupil M=mouth T=fang
export const MONSTER = ['.X.......X.', '.XX.....XX.', '..DDDDDDD..', '.DDDDDDDDD.', 'DDWWDDDWWDD', 'DDWPDDDWPDD', 'DDTMMMMMTDD', 'DDDDDDDDDDD', 'DDDDDDDDDDD', 'D.D.DDD.D.D'];
export const monsterSprite = (D, scale, scared = false) => sprite(MONSTER, scared ? { D: '#6f8cff', X: '#c9d4ff', W: '#fff3dd', P: '#2a3a8a', M: '#1a2a6a', T: '#fff3dd' } : { D, X: '#ffe9c4', W: '#ffffff', P: '#120b08', M: '#2a0f1a', T: '#ffffff' }, scale);
export const PAW = ['..P..P..', '.PPP.PPP', '.PPP.PPP', '..P..P..', '...PPP..', '..PPPPP.', '..PPPPP.', '...P.P..'];
export const pawSprite = (scale) => sprite(PAW, { P: '#ff8c18' }, scale);
