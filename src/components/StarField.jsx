import { useEffect, useRef } from 'react';
import { reducedMotion } from '../utils/assets';

// Orange stars that drift around the focused window and play with the pointer / finger:
//  · they get pushed away as it passes, and moving leaves a trail of sparks
//  · click / tap = a burst of sparks + a shockwave that scatters the stars nearby
//  · every few seconds a shooting star crosses the stage
const COLORS = ['#FFB52E', '#FF8C18', '#FFD36A', '#FF7A00'];
function sprite(color) { // one glowing 4-point star (with a pale core), drawn once and reused
  const s = 64, c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d'), m = s / 2;
  const star = (r, fill, blur) => { x.shadowColor = color; x.shadowBlur = blur; x.fillStyle = fill; x.beginPath(); const k = r * 0.2;
    x.moveTo(m, m - r); x.quadraticCurveTo(m + k, m - k, m + r, m); x.quadraticCurveTo(m + k, m + k, m, m + r); x.quadraticCurveTo(m - k, m + k, m - r, m); x.quadraticCurveTo(m - k, m - k, m, m - r); x.fill(); };
  star(26, color, 14); star(13, '#FFF3DD', 0); return c;
}
export default function StarField() {
  const cv = useRef();
  useEffect(() => {
    if (reducedMotion()) return;
    const el = cv.current, x = el.getContext('2d'), sp = COLORS.map(sprite), coarse = matchMedia('(pointer:coarse)').matches;
    let w = 1, h = 1, dpr = 1, raf = 0, last = performance.now(), mx = -999, my = -999, lx = -999, ly = -999, nextShoot = last + 3500;
    const N = coarse ? 24 : 52, R = coarse ? 120 : 170, stars = [], sparks = [], shoots = [];
    const mk = () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.14, vy: -0.03 - Math.random() * 0.14, s: 8 + Math.random() * 14, a: Math.random() * 6.28, f: 0.8 + Math.random() * 1.6, c: (Math.random() * sp.length) | 0, px: 0, py: 0 });
    const spark = (px, py) => sparks.length < 36 && sparks.push({ x: px, y: py, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 - 0.1, t: 0, s: 3 + Math.random() * 3, c: (Math.random() * sp.length) | 0, q: 0.4 }); // trail = a few tiny, faint sparks
    const fit = () => { const r = el.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); w = r.width || 1; h = r.height || 1; el.width = w * dpr; el.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); while (stars.length < N) stars.push(mk()); };
    const move = (e) => { const r = el.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (Math.hypot(mx - lx, my - ly) > 34 && mx > 0 && my > 0 && mx < w && my < h) { spark(mx, my); lx = mx; ly = my; } };
    const down = (e) => { const r = el.getBoundingClientRect(), bx = e.clientX - r.left, by = e.clientY - r.top; if (bx < 0 || by < 0 || bx > w || by > h) return;
      for (let i = 0; i < 14; i++) { const a = (i / 14) * 6.28 + Math.random() * 0.4, v = 1.2 + Math.random() * 2.2; sparks.length < 120 && sparks.push({ x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, s: 6 + Math.random() * 9, c: (Math.random() * sp.length) | 0 }); }
      for (const s of stars) { const dx = s.x - bx, dy = s.y - by, d = Math.hypot(dx, dy) || 1; if (d < R * 2) { const f = (1 - d / (R * 2)) * 7; s.px += (dx / d) * f; s.py += (dy / d) * f; } } }; // shockwave
    const leave = () => { mx = my = -999; };
    const frame = (t) => { raf = requestAnimationFrame(frame); const dt = Math.min(48, t - last) / 16.67; last = t; x.clearRect(0, 0, w, h);
      if (t > nextShoot) { nextShoot = t + 5000 + Math.random() * 5000; const a = 0.35 + Math.random() * 0.3; shoots.push({ x: Math.random() * w * 0.7, y: Math.random() * h * 0.35, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, t: 0 }); }
      for (const s of stars) {
        const dx = s.x - mx, dy = s.y - my, d = Math.hypot(dx, dy);
        if (d < R && d > 0.1) { const f = (1 - d / R) ** 2 * 1.8; s.px += (dx / d) * f; s.py += (dy / d) * f; } // pushed away from the pointer
        s.x += (s.vx + s.px) * dt; s.y += (s.vy + s.py) * dt; s.px *= 0.93; s.py *= 0.93;
        if (s.y < -16) { s.y = h + 16; s.x = Math.random() * w; } if (s.x < -16) s.x = w + 16; if (s.x > w + 16) s.x = -16; if (s.y > h + 18) s.y = -16;
        const tw = 0.55 + 0.45 * Math.sin(t / 1000 * s.f + s.a), z = s.s * (0.85 + 0.25 * tw), near = d < R ? 1 + (1 - d / R) * 0.7 : 1;
        x.globalAlpha = 0.6 + 0.4 * tw; x.save(); x.translate(s.x, s.y); x.rotate(Math.sin(t / 2400 + s.a) * 0.35); x.drawImage(sp[s.c], -z * near / 2, -z * near / 2, z * near, z * near); x.restore();
      }
      for (let i = shoots.length - 1; i >= 0; i--) { const k = shoots[i]; k.t += dt * 0.016; if (k.t >= 1) { shoots.splice(i, 1); continue; } k.x += k.vx * dt; k.y += k.vy * dt;
        const g = x.createLinearGradient(k.x, k.y, k.x - k.vx * 9, k.y - k.vy * 9); g.addColorStop(0, '#FFF3DD'); g.addColorStop(1, '#FF8C1800');
        x.globalAlpha = 1 - k.t; x.strokeStyle = g; x.lineWidth = 2.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(k.x, k.y); x.lineTo(k.x - k.vx * 9, k.y - k.vy * 9); x.stroke(); x.drawImage(sp[2], k.x - 9, k.y - 9, 18, 18); }
      for (let i = sparks.length - 1; i >= 0; i--) { const k = sparks[i]; k.t += dt * 0.022; if (k.t >= 1) { sparks.splice(i, 1); continue; } k.x += k.vx * dt; k.y += k.vy * dt; k.vx *= 0.985; k.vy *= 0.985;
        x.globalAlpha = (1 - k.t) * (k.q ?? 1); const z = k.s * (1 - k.t * 0.6); x.drawImage(sp[k.c], k.x - z / 2, k.y - z / 2, z, z); }
      x.globalAlpha = 1; };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el);
    addEventListener('pointermove', move, { passive: true }); addEventListener('pointerdown', down, { passive: true }); document.addEventListener('pointerleave', leave); addEventListener('blur', leave);
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }; vis(); document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', move); removeEventListener('pointerdown', down); document.removeEventListener('pointerleave', leave); removeEventListener('blur', leave); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas ref={cv} className="fw-stars" aria-hidden="true" />;
}
