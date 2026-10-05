// Tiny 8-bit toolkit: every sprite is drawn from text rows (no image files needed). Replace later with your own art if you like.
const cache = new Map();
export function sprite(rows, pal, scale = 1) { const key = rows.join('|') + JSON.stringify(pal) + scale; if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = rows[0].length * scale; c.height = rows.length * scale; const x = c.getContext('2d');
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i * scale, j * scale, scale, scale); } })); cache.set(key, c); return c; }
export const dataUrl = (c) => c.toDataURL();
// Cats in the style of the classic pixel-cat faces: dark outline, pink inner ears, happy closed eyes, rosy cheeks, tiny nose, whiskers.
// O=outline A=fur I=inner ear E=closed eye B=blush N=nose M=mouth W=whisker  P/Q = left/right ear + head-top patches (same as fur unless the cat has markings)
const FACE = ['..OO........OO..', '.OPIO......OIQO.', '.OPIIO....OIIQO.', '.OPPPPOOOOQQQQO.', '.OPPPAAAAAAQQQO.', '.OAAAAAAAAAAAAO.', '.OAAEEAAAAEEAAO.', '.OAEAAEAAEAAEAO.', '.OBBAAAAAAAABBO.', '.OAAAAANNAAAAAO.', '.OAAAAMAAMAAAAO.', '.OAAAAAAAAAAAAO.', '..OAAAAAAAAAAO..', '...OOOOOOOOOO...'];
export const CAT = FACE.map((r, j) => (j >= 7 && j <= 9 ? 'WW' + r.slice(1, -1) + 'WW' : '.' + r + '.')); // 18 x 14
export const CATS = [ // 8 cat "masks" for the memory game (first one is the hero cat)
  { n: 'orange', O: '#8a4210', A: '#ff9a30', P: '#f07c10', Q: '#f07c10', I: '#ffb3b8', E: '#3a1a08', B: '#ff8f8f', N: '#e0587a', M: '#c8446a', W: '#ffd9a8' },
  { n: 'black', O: '#0f0b0a', A: '#34302f', I: '#ff8fa3', E: '#9a9aa6', B: '#a8505e', N: '#ff8fa3', M: '#ff8fa3', W: '#8a8a94' },
  { n: 'white', O: '#a89a8e', A: '#ffffff', I: '#ffb3c0', E: '#4a3a34', B: '#ffb0b8', N: '#ff8fa3', M: '#ff8fa3', W: '#bdb3aa' },
  { n: 'grey', O: '#4e4a56', A: '#a8a4b0', P: '#8d8996', Q: '#8d8996', I: '#ffb3c0', E: '#3a3440', B: '#e89aa8', N: '#ff8fa3', M: '#ff8fa3', W: '#d6d3dc' },
  { n: 'siamese', O: '#3a2214', A: '#f4e1c0', P: '#6b4228', Q: '#6b4228', I: '#caa088', E: '#2a1a12', B: '#e8b090', N: '#5a3422', M: '#5a3422', W: '#8a6a50' },
  { n: 'calico', O: '#8a5a3a', A: '#fff6e6', P: '#f0902a', Q: '#4a3a36', I: '#ffb3c0', E: '#4a3a34', B: '#ffb0a0', N: '#ff8fa3', M: '#ff8fa3', W: '#e0a060' },
  { n: 'sakura', O: '#b0446a', A: '#ffc2d1', P: '#ff9ab8', Q: '#ff9ab8', I: '#fff0f4', E: '#8a2a4a', B: '#ff7aa0', N: '#d04a78', M: '#d04a78', W: '#ff9ab8' },
  { n: 'star', O: '#a8680a', A: '#ffd84a', P: '#ffb52e', Q: '#ffb52e', I: '#fff3c0', E: '#6a3a00', B: '#ff9a4a', N: '#c8602a', M: '#c8602a', W: '#fff0a0' }];
export const catSprite = (i, scale) => { const c = CATS[i]; return sprite(CAT, { P: c.A, Q: c.A, ...c }, scale); };
// Cute little monster (replaces the dogs): horns, big googly eyes, tiny fangs, wobbly bottom.
// D=body X=horns W=eye white P=pupil M=mouth T=fang
export const MONSTER = ['.X.......X.', '.XX.....XX.', '..DDDDDDD..', '.DDDDDDDDD.', 'DDWWDDDWWDD', 'DDWPDDDWPDD', 'DDTMMMMMTDD', 'DDDDDDDDDDD', 'DDDDDDDDDDD', 'D.D.DDD.D.D'];
export const monsterSprite = (D, scale, scared = false) => sprite(MONSTER, scared ? { D: '#6f8cff', X: '#c9d4ff', W: '#fff3dd', P: '#2a3a8a', M: '#1a2a6a', T: '#fff3dd' } : { D, X: '#ffe9c4', W: '#ffffff', P: '#120b08', M: '#2a0f1a', T: '#ffffff' }, scale);
export const PAW = ['..P..P..', '.PPP.PPP', '.PPP.PPP', '..P..P..', '...PPP..', '..PPPPP.', '..PPPPP.', '...P.P..'];
export const pawSprite = (scale) => sprite(PAW, { P: '#ff8c18' }, scale);
