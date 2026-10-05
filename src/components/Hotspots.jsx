import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { hotspots } from '../data/hotspots';
import { reducedMotion, isMobile } from '../utils/assets';
import { play } from '../utils/sfx';
const Arcade = lazy(() => import('./Arcade')); // games load only when first opened

// Glowing stars + click areas laid over the foreground art. The layer reproduces the same "cover" crop and parallax as foreground.webm, so it always lines up.
export default function Hotspots() {
  const wrap = useRef(), art = useRef(), [game, setGame] = useState(null), debug = location.search.includes('hotspots');
  useEffect(() => {
    const fit = () => { const W = innerWidth, H = innerHeight, s = Math.max(W / 1920, H / 1080), a = art.current; // object-fit: cover
      Object.assign(a.style, { width: 1920 * s + 'px', height: 1080 * s + 'px', left: (W - 1920 * s) / 2 + 'px', top: (H - 1080 * s) / 2 + 'px' }); };
    fit(); addEventListener('resize', fit);
    let tx = 0, ty = 0, x = 0, y = 0, raf; const still = reducedMotion() || isMobile(), amp = 0.011; // same numbers as the foreground layer in ParallaxBackground
    const mv = (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; };
    const loop = () => { raf = requestAnimationFrame(loop); x += (tx - x) * 0.06; y += (ty - y) * 0.06; const a = amp * innerWidth;
      wrap.current.style.transform = `translate3d(${(-x * a).toFixed(2)}px,${(-y * a).toFixed(2)}px,0) scale(${(1 + amp * 2 + 0.006).toFixed(4)})`; };
    if (!still) { addEventListener('pointermove', mv); loop(); }
    return () => { removeEventListener('resize', fit); removeEventListener('pointermove', mv); cancelAnimationFrame(raf); };
  }, []);
  return (<>
    <div ref={wrap} className="hs-wrap"><div ref={art} className={'hs-art' + (debug ? ' debug' : '')}>
      {hotspots.map((h) => (
        <button key={h.id} className={'hs hs-' + h.id} style={{ left: h.x + '%', top: h.y + '%', width: h.w + '%', height: h.h + '%' }} aria-label={h.aria} data-sfx="none"
          onMouseEnter={() => play('hover')} onClick={() => { play('open'); setGame(h); }}>
          <i className="hs-glow" />
          {h.sparks.map(([sx, sy, sz, d], i) => <span key={i} className="spark" style={{ left: sx + '%', top: sy + '%', '--z': sz + 'px', '--d': d + 's', '--t': 3.2 + ((i * 7) % 5) * 0.5 + 's' }}><b /></span>)}
          <em className="hs-tag" style={h.tag ? { left: h.tag[0] + '%', top: h.tag[1] + '%' } : undefined}>▶ {h.label}</em>
        </button>))}
    </div></div>
    {game && <Suspense fallback={null}><Arcade game={game.game} onClose={() => setGame(null)} /></Suspense>}
  </>);
}
