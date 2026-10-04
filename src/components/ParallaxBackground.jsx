import { useEffect, useRef } from 'react';
import { asset, reducedMotion, isMobile } from '../utils/assets';
import ParticleField from './ParticleField';

// Layer order (back → front):  Background.webm  →  particles  →  Foreground.webm (alpha)
// All three drift slightly against the mouse, the nearer the layer the more it moves.
// Tweak the feel here: `amp` = travel as a fraction of screen width at the screen edge.
const LAYERS = { bg: { amp: 0.0035 }, pf: { amp: 0.006 }, fg: { amp: 0.011 } };

export default function ParallaxBackground({ dim = false }) {
  const bg = useRef(), pf = useRef(), fg = useRef();

  useEffect(() => {
    if (reducedMotion() || isMobile()) return; // no parallax on touch / reduced motion
    const els = { bg: bg.current, pf: pf.current, fg: fg.current };
    let tx = 0, ty = 0, x = 0, y = 0, raf;
    const mv = (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.06; y += (ty - y) * 0.06; // smooth follow
      const W = innerWidth;
      for (const k in LAYERS) {
        const a = LAYERS[k].amp * W, s = 1 + (LAYERS[k].amp * 2 + 0.006); // scale just enough to hide the edges
        els[k].style.transform = `translate3d(${(-x * a).toFixed(2)}px,${(-y * a).toFixed(2)}px,0) scale(${s.toFixed(4)})`;
      }
    };
    addEventListener('pointermove', mv); loop();
    return () => { removeEventListener('pointermove', mv); cancelAnimationFrame(raf); };
  }, []);

  // The loop IS the background, so it always plays (even with "reduce motion" on – only the parallax is switched off there).
  // React doesn't reliably set the `muted` attribute, and browsers refuse unmuted autoplay – so mute + play() by hand and retry on first input.
  useEffect(() => {
    const vs = [bg.current, fg.current];
    const go = () => vs.forEach((v) => { v.muted = true; v.defaultMuted = true; if (v.paused) v.play().catch(() => {}); });
    const again = (v) => () => { v.currentTime = 0; v.play().catch(() => {}); }; // safety net if `loop` is ignored
    const offs = vs.map((v) => { const f = again(v); v.addEventListener('ended', f); return () => v.removeEventListener('ended', f); });
    go(); vs.forEach((v) => v.addEventListener('canplay', go));
    const vis = () => !document.hidden && go();
    addEventListener('pointerdown', go); addEventListener('keydown', go); document.addEventListener('visibilitychange', vis);
    return () => { offs.forEach((f) => f()); vs.forEach((v) => v.removeEventListener('canplay', go)); removeEventListener('pointerdown', go); removeEventListener('keydown', go); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return (<>
    <video ref={bg} className="layer layer-bg" src={asset('/assets/backgrounds/background.webm')} autoPlay loop muted playsInline preload="auto" aria-hidden="true" />
    <div ref={pf} className="layer layer-pf"><ParticleField dim={dim} /></div>
    <video ref={fg} className="layer layer-fg" src={asset('/assets/backgrounds/foreground.webm')} autoPlay loop muted playsInline preload="auto" aria-hidden="true" />
  </>);
}
