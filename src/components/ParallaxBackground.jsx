import { useEffect, useRef, useState } from 'react';
import { asset, reducedMotion, isMobile, appleVideo } from '../utils/assets';
import ParticleField from './ParticleField';

// Layer order (back → front):  Background.webm  →  particles  →  Foreground.webm (alpha)
// All three drift slightly against the mouse, the nearer the layer the more it moves.
// Tweak the feel here: `amp` = travel as a fraction of screen width at the screen edge.
const LAYERS = { bg: { amp: 0.0035 }, pf: { amp: 0.006 }, fg: { amp: 0.011 } };

// Stops the browser from drawing its own hover buttons on top of the video (picture-in-picture, cast, download…).
const NOUI = { disablePictureInPicture: true, disableRemotePlayback: true, controlsList: 'nodownload noplaybackrate noremoteplayback', tabIndex: -1, 'x-webkit-airplay': 'deny' };
export default function ParallaxBackground({ dim = false }) {
  const bg = useRef(), pf = useRef(), fg = useRef();
  // Apple devices: ONE opaque pre-rendered video (backgroundApple.webm, optional backgroundApple.mp4), no parallax. If it can't load, falls back to the normal layers.
  const [apple, setApple] = useState(appleVideo);

  useEffect(() => {
    if (reducedMotion() || isMobile() || apple) return; // no parallax on touch / reduced motion / Apple video
    const els = { bg: bg.current, pf: pf.current, fg: fg.current };
    let tx = 0, ty = 0, x = 0, y = 0, raf;
    const mv = (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.06; y += (ty - y) * 0.06; // smooth follow
      const W = innerWidth;
      for (const k in LAYERS) {
        const a = LAYERS[k].amp * W, s = 1 + (LAYERS[k].amp * 2 + 0.006); // scale just enough to hide the edges
        if (els[k]) els[k].style.transform = `translate3d(${(-x * a).toFixed(2)}px,${(-y * a).toFixed(2)}px,0) scale(${s.toFixed(4)})`;
      }
    };
    addEventListener('pointermove', mv); loop();
    return () => { removeEventListener('pointermove', mv); cancelAnimationFrame(raf); };
  }, [apple]);

  // The loop IS the background, so it always plays (even with "reduce motion" on – only the parallax is switched off there).
  // React doesn't reliably set the `muted` attribute, and browsers refuse unmuted autoplay – so mute + play() by hand and retry on first input.
  useEffect(() => {
    const vs = [bg.current, fg.current].filter(Boolean);
    const go = () => vs.forEach((v) => { v.muted = true; v.defaultMuted = true; if (v.paused) v.play().catch(() => {}); });
    const again = (v) => () => { v.currentTime = 0; v.play().catch(() => {}); }; // safety net if `loop` is ignored
    const offs = vs.map((v) => { const f = again(v); v.addEventListener('ended', f); return () => v.removeEventListener('ended', f); });
    go(); vs.forEach((v) => v.addEventListener('canplay', go));
    const vis = () => !document.hidden && go();
    addEventListener('pointerdown', go); addEventListener('keydown', go); document.addEventListener('visibilitychange', vis);
    return () => { offs.forEach((f) => f()); vs.forEach((v) => v.removeEventListener('canplay', go)); removeEventListener('pointerdown', go); removeEventListener('keydown', go); document.removeEventListener('visibilitychange', vis); };
  }, [apple]);
  if (apple) return (<>
    <video ref={bg} className="layer layer-bg" autoPlay loop muted playsInline preload="auto" aria-hidden="true" {...NOUI}>
      <source src={asset('/assets/backgrounds/backgroundApple.webm')} type="video/webm" />
      <source src={asset('/assets/backgrounds/backgroundApple.mp4')} type="video/mp4" onError={() => setApple(false)} />
    </video>
    <div ref={pf} className="layer layer-pf"><ParticleField dim={dim} /></div>
  </>);
  return (<>
    <video ref={bg} className="layer layer-bg" src={asset('/assets/backgrounds/background.webm')} autoPlay loop muted playsInline preload="auto" aria-hidden="true" {...NOUI} />
    <div ref={pf} className="layer layer-pf"><ParticleField dim={dim} /></div>
    <video ref={fg} className="layer layer-fg" src={asset('/assets/backgrounds/foreground.webm')} autoPlay loop muted playsInline preload="auto" aria-hidden="true" {...NOUI} />
  </>);
}
