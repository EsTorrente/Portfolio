import { useEffect, useRef } from 'react';
import { reducedMotion } from '../utils/assets';

// Little orange stars that drift around the focused window and react to the mouse / finger: they get pushed away from the pointer, and moving it leaves a few sparks.
const COLORS = ['#FFB52E', '#FF8C18', '#FFD36A', '#FF7A00'];
function sprite(color) { // one soft 4-point star, drawn once and reused
  const s = 48, c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d'), m = s / 2;
  x.shadowColor = color; x.shadowBlur = 7; x.fillStyle = color; x.beginPath();
  x.moveTo(m, 5); x.quadraticCurveTo(m + 3, m - 3, s - 5, m); x.quadraticCurveTo(m + 3, m + 3, m, s - 5); x.quadraticCurveTo(m - 3, m + 3, 5, m); x.quadraticCurveTo(m - 3, m - 3, m, 5); x.fill(); return c;
}
export default function StarField() {
  const cv = useRef();
  useEffect(() => {
    if (reducedMotion()) return;
    const el = cv.current, x = el.getContext('2d'), sp = COLORS.map(sprite), coarse = matchMedia('(pointer:coarse)').matches;
    let w = 1, h = 1, dpr = 1, raf = 0, last = performance.now(), mx = -999, my = -999, lx = -999, ly = -999;
    const N = coarse ? 16 : 34, R = coarse ? 110 : 150, stars = [], sparks = [];
    const mk = () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.12, vy: -0.03 - Math.random() * 0.12, s: 5 + Math.random() * 9, a: Math.random() * 6.28, f: 0.8 + Math.random() * 1.6, c: (Math.random() * sp.length) | 0, px: 0, py: 0 });
    const fit = () => { const r = el.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); w = r.width || 1; h = r.height || 1; el.width = w * dpr; el.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); while (stars.length < N) stars.push(mk()); };
    const move = (e) => { const r = el.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (Math.hypot(mx - lx, my - ly) > 14 && mx > 0 && my > 0 && mx < w && my < h && sparks.length < 28) { sparks.push({ x: mx, y: my, vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7 - 0.2, t: 0, s: 4 + Math.random() * 5, c: (Math.random() * sp.length) | 0 }); lx = mx; ly = my; } };
    const leave = () => { mx = my = -999; };
    const frame = (t) => { raf = requestAnimationFrame(frame); const dt = Math.min(48, t - last) / 16.67; last = t; x.clearRect(0, 0, w, h);
      for (const s of stars) {
        const dx = s.x - mx, dy = s.y - my, d = Math.hypot(dx, dy);
        if (d < R && d > 0.1) { const f = (1 - d / R) ** 2 * 1.5; s.px += (dx / d) * f; s.py += (dy / d) * f; } // pushed away from the pointer
        s.x += (s.vx + s.px) * dt; s.y += (s.vy + s.py) * dt; s.px *= 0.93; s.py *= 0.93;
        if (s.y < -12) { s.y = h + 12; s.x = Math.random() * w; } if (s.x < -12) s.x = w + 12; if (s.x > w + 12) s.x = -12; if (s.y > h + 14) s.y = -12;
        const tw = 0.55 + 0.45 * Math.sin(t / 1000 * s.f + s.a), z = s.s * (0.85 + 0.25 * tw), near = d < R ? 1 + (1 - d / R) * 0.5 : 1;
        x.globalAlpha = 0.35 + 0.55 * tw; x.save(); x.translate(s.x, s.y); x.rotate(Math.sin(t / 2400 + s.a) * 0.35); x.drawImage(sp[s.c], -z * near / 2, -z * near / 2, z * near, z * near); x.restore();
      }
      for (let i = sparks.length - 1; i >= 0; i--) { const k = sparks[i]; k.t += dt * 0.022; if (k.t >= 1) { sparks.splice(i, 1); continue; } k.x += k.vx * dt; k.y += k.vy * dt;
        x.globalAlpha = 1 - k.t; const z = k.s * (1 - k.t * 0.6); x.drawImage(sp[k.c], k.x - z / 2, k.y - z / 2, z, z); }
      x.globalAlpha = 1; };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el);
    addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', leave); addEventListener('blur', leave);
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }; vis(); document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); removeEventListener('blur', leave); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas ref={cv} className="fw-stars" aria-hidden="true" />;
}
