import { useEffect, useRef, useState } from 'react';
import { catSprite, dogSprite } from './pixel';
import { play } from '../utils/sfx';
// CAT-MAN — a Pac-Man-style maze (inspired by the classic mechanics): the cat eats fish bits, dogs chase, catnip stars make the dogs scared for a few seconds.
const MAP = ['#################', '#o.............o#', '#.###.#.#.#.###.#', '#...............#', '#.##.#######.##.#', '#....#.....#....#', '####.#.###.#.####', '#...............#', '#.###.#...#.###.#', '#.....#.#.#.....#', '#.##.#######.##.#', '#.....#...#.....#', '#.###.#.#.#.###.#', '#o......#......o#', '#################'];
const W = 17, H = 15, C = 24, DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]], CAT_SPEED = 5.2, DOG_SPEED = 4.3, SCARED_MS = 6500;
const DOGS = [{ c: '#d9531e', kind: 0 }, { c: '#8a5a3c', kind: 1 }, { c: '#c46a8a', kind: 2 }]; // chase / ambush / shy
const free = (x, y) => MAP[y]?.[x] !== undefined && MAP[y][x] !== '#';
const rnd = (a) => a[Math.floor(Math.random() * a.length)];

export default function CatMan() {
  const cv = useRef(), api = useRef({}), [hud, setHud] = useState({ score: 0, lives: 3, status: 'ready' });
  useEffect(() => {
    const ctx = cv.current.getContext('2d'); cv.current.width = W * C; cv.current.height = H * C; ctx.imageSmoothingEnabled = false;
    let pel, score, lives, status, cat, dogs, scared, freeze, raf, last = performance.now(), now = 0;
    const push = () => setHud({ score, lives, status });
    const ent = (x, y) => ({ x, y, fx: x, fy: y, dx: 0, dy: 0, p: 1, moving: false });
    const place = () => { cat = { ...ent(8, 3), wx: 0, wy: 0 }; dogs = DOGS.map((d, i) => ({ ...ent(7 + i, 8), ...d, wait: 1200 + i * 2600, bob: 0 })); };
    const init = () => { pel = new Set(); MAP.forEach((r, y) => [...r].forEach((c, x) => (c === '.' || c === 'o') && !(x === 8 && y === 3) && pel.add(x + ',' + y))); score = 0; lives = 3; scared = 0; status = 'ready'; place(); push(); };
    const eat = (x, y) => { const k = x + ',' + y; if (!pel.has(k)) return; pel.delete(k); const big = MAP[y][x] === 'o'; score += big ? 50 : 10; play('tick');
      if (big) { scared = now + SCARED_MS; dogs.forEach((g) => { if (g.moving) { /* turn around */ g.dx *= -1; g.dy *= -1; } }); }
      if (!pel.size) { status = 'win'; play('open'); } push(); };
    const catArrive = (e) => { e.fx = e.x; e.fy = e.y; eat(e.x, e.y);
      if ((e.wx || e.wy) && free(e.x + e.wx, e.y + e.wy)) { e.dx = e.wx; e.dy = e.wy; }
      if ((e.dx || e.dy) && free(e.x + e.dx, e.y + e.dy)) { e.x += e.dx; e.y += e.dy; e.moving = true; } else { e.moving = false; e.dx = e.dy = 0; } };
    const dogArrive = (g) => { g.fx = g.x; g.fy = g.y; if (g.wait > 0) { g.moving = false; return; }
      const all = DIRS.filter(([dx, dy]) => free(g.x + dx, g.y + dy)), opts = all.filter(([dx, dy]) => !(dx === -g.dx && dy === -g.dy)), list = opts.length ? opts : all; let pick;
      if (scared > now || Math.random() < 0.2) pick = rnd(list);
      else { let tx = cat.x, ty = cat.y; if (g.kind === 1) { tx += cat.dx * 3; ty += cat.dy * 3; } if (g.kind === 2 && Math.hypot(cat.x - g.x, cat.y - g.y) < 6) { tx = 1; ty = 13; }
        pick = list.reduce((b, d) => (Math.hypot(g.x + d[0] - tx, g.y + d[1] - ty) < Math.hypot(g.x + b[0] - tx, g.y + b[1] - ty) ? d : b)); }
      g.dx = pick[0]; g.dy = pick[1]; g.x += g.dx; g.y += g.dy; g.moving = true; };
    const move = (e, dt, speed, arrive) => { e.p += dt * speed; let n = 0; while (e.p >= 1 && n++ < 3) { e.p -= 1; arrive(e); if (!e.moving) { e.p = 1; break; } } };
    const pos = (e) => [e.fx + (e.x - e.fx) * Math.min(1, e.p), e.fy + (e.y - e.fy) * Math.min(1, e.p)];
    const lose = () => { lives--; play('close'); status = lives > 0 ? 'dead' : 'over'; freeze = now + 1100; push(); };
    const tick = (t) => { raf = requestAnimationFrame(tick); const dt = Math.min(0.05, (t - last) / 1000); last = t; now = t;
      if (status === 'play') { move(cat, dt, CAT_SPEED, catArrive);
        dogs.forEach((g) => { if (g.wait > 0) { g.wait -= dt * 1000; g.bob = Math.sin(t / 120) * 2; if (g.wait <= 0) { g.p = 1; g.moving = false; } return; } move(g, dt, scared > now ? DOG_SPEED * 0.65 : DOG_SPEED, dogArrive);
          const [cx, cy] = pos(cat), [gx, gy] = pos(g); if (Math.hypot(cx - gx, cy - gy) < 0.6 && status === 'play') {
            if (scared > now) { score += 200; play('viewer'); g.x = g.fx = 8; g.y = g.fy = 8; g.p = 1; g.moving = false; g.wait = 2500; g.dx = g.dy = 0; push(); } else lose(); } }); }
      else if (status === 'dead' && now > freeze) { place(); status = 'play'; push(); }
      draw(t); };
    const draw = (t) => { ctx.fillStyle = '#0d0705'; ctx.fillRect(0, 0, W * C, H * C);
      MAP.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '#') return; ctx.fillStyle = '#2a1409'; ctx.fillRect(x * C, y * C, C, C); ctx.fillStyle = '#ff8c18';
        if (free(x, y - 1)) ctx.fillRect(x * C, y * C, C, 3); if (free(x, y + 1)) ctx.fillRect(x * C, y * C + C - 3, C, 3); if (free(x - 1, y)) ctx.fillRect(x * C, y * C, 3, C); if (free(x + 1, y)) ctx.fillRect(x * C + C - 3, y * C, 3, C); }));
      pel.forEach((k) => { const [x, y] = k.split(',').map(Number); if (MAP[y][x] === 'o') { ctx.fillStyle = Math.floor(t / 280) % 2 ? '#ffd36a' : '#ff8c18'; ctx.fillRect(x * C + C / 2 - 2, y * C + 4, 4, C - 8); ctx.fillRect(x * C + 4, y * C + C / 2 - 2, C - 8, 4); ctx.fillRect(x * C + C / 2 - 5, y * C + C / 2 - 5, 10, 10); }
        else { ctx.fillStyle = '#f4e7d0'; ctx.fillRect(x * C + C / 2 - 2, y * C + C / 2 - 2, 4, 4); } });
      dogs.forEach((g) => { const [x, y] = pos(g), sc = scared > now, flash = sc && scared - now < 1800 && Math.floor(t / 200) % 2; ctx.drawImage(dogSprite(g.c, 2, sc && !flash), x * C + 1, y * C + 3 + (g.bob || 0), C - 2, C - 5); });
      const [x, y] = pos(cat), hop = status === 'dead' ? 0 : Math.sin(t / 90) * 0.8; if (status !== 'dead' || Math.floor(t / 120) % 2) ctx.drawImage(catSprite(0, 2), x * C + 1, y * C + 2 + hop, C - 2, C - 3); };
    api.current.dir = (dx, dy) => { if (status === 'win' || status === 'over') return; if (status === 'ready') { status = 'play'; push(); }
      cat.wx = dx; cat.wy = dy; if (cat.moving && dx === -cat.dx && dy === -cat.dy) { [cat.x, cat.fx] = [cat.fx, cat.x]; cat.p = 1 - cat.p; cat.dx = dx; cat.dy = dy; } };
    api.current.restart = init;
    const KEYS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    const key = (e) => { const d = KEYS[e.key] || KEYS[e.key.toLowerCase?.()]; if (d) { e.preventDefault(); api.current.dir(...d); } };
    addEventListener('keydown', key); init(); raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener('keydown', key); };
  }, []);
  const sw = useRef(null), dir = (dx, dy) => api.current.dir?.(dx, dy);
  const down = (e) => { sw.current = [e.clientX, e.clientY]; }, up = (e) => { const s = sw.current; sw.current = null; if (!s) return; const dx = e.clientX - s[0], dy = e.clientY - s[1];
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 18) Math.abs(dx) > Math.abs(dy) ? dir(Math.sign(dx), 0) : dir(0, Math.sign(dy)); };
  return (<div className="cm">
    <div className="arc-hud"><span>SCORE {String(hud.score).padStart(4, '0')}</span><span>{'♥'.repeat(Math.max(0, hud.lives))}</span></div>
    <div className="cm-board" onPointerDown={down} onPointerUp={up}><canvas ref={cv} className="cm-cv" role="img" aria-label="Cat-Man game board" />
      {hud.status === 'ready' && <div className="arc-msg">EAT ALL THE FISH BITS<br />DODGE THE DOGS · GRAB ✦ CATNIP<br /><small>ARROWS / WASD / SWIPE TO START</small></div>}
      {(hud.status === 'over' || hud.status === 'win') && <div className="arc-msg">{hud.status === 'win' ? 'PURRFECT! YOU WIN' : 'GAME OVER'}<br />SCORE {hud.score}<button className="px-btn" onClick={() => api.current.restart()}>PLAY AGAIN</button></div>}</div>
    <div className="dpad" aria-label="Cat-Man controls"><button style={{ gridColumn: 2, gridRow: 1 }} aria-label="Up" onClick={() => dir(0, -1)}>▲</button><button style={{ gridColumn: 1, gridRow: 2 }} aria-label="Left" onClick={() => dir(-1, 0)}>◀</button>
      <button style={{ gridColumn: 2, gridRow: 2 }} aria-label="Down" onClick={() => dir(0, 1)}>▼</button><button style={{ gridColumn: 3, gridRow: 2 }} aria-label="Right" onClick={() => dir(1, 0)}>▶</button></div></div>);
}
