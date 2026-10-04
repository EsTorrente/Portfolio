import { useEffect, useRef } from 'react';
import { reducedMotion, isMobile } from '../utils/assets';
// Lightweight flowing-trail particles (2D canvas, analytic flow field). Reacts to mouse/touch; pauses when hidden.
export default function ParticleField({ dim = false }) {
  const ref = useRef(null);
  const dimRef = useRef(dim); dimRef.current = dim;
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d'), rm = reducedMotion(), mob = isMobile();
    const dpr = Math.min(window.devicePixelRatio || 1, mob ? 1 : 1.5);
    let W, H, raf, t = 0, running = true; const ptr = { x: -999, y: -999, on: false };
    const N = rm ? 0 : mob ? 220 : 650;
    const ps = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), l: Math.random() * 200 }));
    const size = () => { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; };
    const ang = (x, y) => Math.sin(x * 3.1 + t * 0.2) + Math.cos(y * 2.7 - t * 0.17) + Math.sin((x + y) * 5 + t * 0.1) * 0.5;
    // FPS guard: once the desktop is showing, measure the real frame rate. Three slow checks in a row (≈5 s) → stop the particles for good (html gets .lowfps).
    let last = performance.now(), frames = 0, strikes = 0, since = last, dead = false;
    const watch = (now) => { if (document.documentElement.dataset.phase !== 'done' || document.hidden) { since = now; frames = 0; return; } frames++;
      if (now - since < 1700) return; const fps = (frames * 1000) / (now - since); since = now; frames = 0; strikes = fps < 30 ? strikes + 1 : Math.max(0, strikes - 1);
      if (strikes >= 3) { dead = true; cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); cv.style.display = 'none'; document.documentElement.classList.add('lowfps'); } };
    const frame = () => {
      raf = requestAnimationFrame(frame); if (!running || dead) return; const now = performance.now(); watch(now); if (dead) return; last = now;
      if (dimRef.current && document.documentElement.classList.contains('compact')) return; // phone: a window covers the whole screen, so don't draw behind it
      t += 0.016;
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter'; const op = dimRef.current ? 0.25 : 1;
      for (const p of ps) {
        const a = ang(p.x, p.y) * 2; let vx = Math.cos(a) * 0.0012, vy = Math.sin(a) * 0.0012;
        if (ptr.on) { const dx = p.x * W - ptr.x * dpr, dy = p.y * H - ptr.y * dpr, d = Math.hypot(dx, dy) / dpr;
          if (d < 140) { const f = (1 - d / 140) * 0.006; vx += (dx / d) * f + (-dy / d) * f * 1.5; vy += (dy / d) * f + (dx / d) * f * 1.5; } } // repel + swirl
        const ox = p.x, oy = p.y; p.x += vx; p.y += vy; p.l--;
        if (p.l < 0 || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) { p.x = Math.random(); p.y = Math.random(); p.l = 120 + Math.random() * 200; continue; }
        ctx.strokeStyle = `rgba(255,${150 + (p.l % 70)},40,${0.35 * op})`; ctx.lineWidth = dpr;
        ctx.beginPath(); ctx.moveTo(ox * W, oy * H); ctx.lineTo(p.x * W, p.y * H); ctx.stroke();
      }
    };
    const mv = (e) => { const q = e.touches ? e.touches[0] : e; ptr.x = q.clientX; ptr.y = q.clientY; ptr.on = true; };
    const off = () => (ptr.on = false), vis = () => (running = !document.hidden);
    size(); if (!rm) frame();
    addEventListener('resize', size); addEventListener('pointermove', mv); addEventListener('touchmove', mv, { passive: true });
    addEventListener('touchend', off); document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', mv); removeEventListener('touchmove', mv); removeEventListener('touchend', off); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
