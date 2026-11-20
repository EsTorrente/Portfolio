import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import StarField from './StarField';
import { about, site } from '../data/siteData';
import { asset } from '../utils/assets';
import { play } from '../utils/sfx';
import '../styles/opening.css';

// DESKTOP OPENING:  black console line → white flash → personal intro over the star field → scroll = a camera glides to a floating window that shows the REAL desktop,
// dollies through it, and hands control to the normal interactive desktop.   (CSS 3D perspective; no extra WebGL context / library.)
// The real <Desktop> is always rendered inside .ow-desk (never copied); when the opening ends the wrappers simply turn into `display: contents`, so nothing remounts.
// ✏️ To replace the stars with a fullscreen showreel later: in the JSX below swap <StarField … /> (inside .op-bg) for <video className="op-reel" src=… autoPlay muted loop playsInline />.
const MSG = "> Got an issue to fix or a vision to fulfil? I've got just what you need.";
const ART = 2531 / 1702, IX = 0.0537, IY = 0.1692, IW = 0.8803, IH = 0.7356; // WindowBeginning.webp: aspect ratio + the transparent screen area (fractions of the image)
const STARS_STAY_ON_WINDOW = false; // false: the star field fades away together with the hero text on the first scroll · true: it stays behind the window until you dive in
const PERSPECTIVE = 1400; // px, must match .ow in opening.css
const smooth = (t) => (t = Math.min(1, Math.max(0, t))) * t * (3 - 2 * t), lerp = (a, b, t) => a + (b - a) * t, clamp = (v) => Math.min(1, Math.max(0, v));
const C = about.contact, tel = (C.phone || '').replace(/[^\d+]/g, '');
const IconIn = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 3A2.5 2.5 0 1 0 4.5 8 2.5 2.5 0 0 0 4.5 3zM2.5 9.5h4V21h-4zM9 9.5h3.8v1.6h.1c.6-1 1.9-1.9 3.8-1.9 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z" /></svg>;
const IconMail = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 2L12 12.5 19.5 7z" /></svg>;
const IconCheck = () => <svg className="chk" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 16.6 4.9 12.3l-1.9 1.9 6.2 6.2L21 8.6l-1.9-1.9z" /></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3h3l1.4 4.2-2 1.3a11 11 0 0 0 5.5 5.5l1.3-2L20 13.4v3A2.6 2.6 0 0 1 17.4 19 14.4 14.4 0 0 1 3 4.6 2.6 2.6 0 0 1 6.6 3z" /></svg>;

// "MAR TORRENTE": every letter is pushed away from the cursor and springs back (a tiny spring simulation, only runs while the pointer is near / letters are still moving).
function ScatterText({ text }) {
  const root = useRef();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current, nodes = [...el.querySelectorAll('.op-ch:not(.sp)')], st = nodes.map(() => ({ x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 }));
    let raf = 0, ptr = null, last = 0, fs = 100;
    const frame = (now) => { const f = Math.min(3, (now - (last || now)) / 16.7); last = now; let moving = false;
      nodes.forEach((n, i) => { const s = st[i]; let tx = 0, ty = 0, tr = 0, g = 0;
        if (ptr) { const r = n.getBoundingClientRect(), dx = r.left + r.width / 2 - s.x - ptr.x, dy = r.top + r.height / 2 - s.y - ptr.y, d = Math.hypot(dx, dy) || 1, R = fs * 1.7;
          if (d < R) { const k = 1 - d / R, e = k * k * (3 - 2 * k); g = e; tx = (dx / d) * e * fs * 0.17; ty = (dy / d) * e * fs * 0.11; tr = (dx / R) * 6 * e; } }
        s.vx += (tx - s.x) * 0.045 * f; s.vy += (ty - s.y) * 0.045 * f; s.vr += (tr - s.r) * 0.045 * f; const dm = Math.pow(0.8, f); s.vx *= dm; s.vy *= dm; s.vr *= dm; s.x += s.vx * f; s.y += s.vy * f; s.r += s.vr * f;
        if (Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.r) > 0.06) moving = true;
        n.style.transform = `translate3d(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px,0) rotate(${s.r.toFixed(2)}deg)`; n.style.setProperty('--g', g.toFixed(3)); });
      raf = ptr || moving ? requestAnimationFrame(frame) : 0; if (!raf) last = 0; };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const mv = (e) => { fs = parseFloat(getComputedStyle(el).fontSize) || 100; ptr = { x: e.clientX, y: e.clientY }; kick(); }, lv = () => { ptr = null; kick(); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', lv); nodes.forEach((n) => { n.style.transform = ''; }); };
  }, []);
  return <h1 className="op-name" ref={root} aria-label={text}>{[...text].map((c, i) => <span key={i} className={'op-ch' + (c === ' ' ? ' sp' : '')} aria-hidden="true">{c === ' ' ? '\u00A0' : c}</span>)}</h1>;
}

// Email / phone: click copies the value and shows "Copied!" on the button itself (LinkedIn stays a normal link).
function CopyChip({ value, Icon, label, kind }) {
  const [ok, setOk] = useState(false), t = useRef();
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); } catch { const ta = document.createElement('textarea'); ta.value = value; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch {} ta.remove(); }
    play('click'); setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 1800); };
  useEffect(() => () => clearTimeout(t.current), []);
  return (<>
    <button type="button" className={ok ? 'copied' : ''} onClick={copy} aria-label={`Copy ${kind}: ${value}`}>
      <span className="op-ic"><Icon /><IconCheck /></span><span className="op-lbl"><span className="t">{label}</span><span className="ok" aria-hidden="true">Copied!</span></span></button>
    <span className="op-sr" role="status">{ok ? `${kind} copied to clipboard` : ''}</span>
  </>);
}

export default function Opening({ active, reenter, loaded, onDone, children }) {
  const [step, setStep] = useState('console'), [typed, setTyped] = useState(0), [flash, setFlash] = useState(false), [hintTxt, setHintTxt] = useState('SCROLL'), [bgUrl, setBgUrl] = useState(null);
  const win = useRef(), clip = useRef(), desk = useRef(), hero = useRef(), bg = useRef(), hint = useRef(), back = useRef(), art = useRef(), loadedRef = useRef(loaded), ctl = useRef({});
  loadedRef.current = loaded;
  useEffect(() => { // the display font loads first (logo + fonts + particles come before everything else)
    if (!active) return; const f = new FontFace('Zaslia', `url(${asset('/assets/fonts/zaslia_regular.otf')})`); f.load().then(() => document.fonts.add(f)).catch(() => {}); }, [active]);

  useEffect(() => { // public/assets/ui/LoadingBG.<ext>: used behind the window; the first extension that exists wins
    if (!active || bgUrl) return; let dead = false; const ex = ['webp', 'jpg', 'png', 'jpeg', 'avif'];
    const tryNext = (i) => { if (i >= ex.length || dead) return; const u = asset(`/assets/ui/LoadingBG.${ex[i]}`), im = new Image(); im.onload = () => !dead && setBgUrl(u); im.onerror = () => tryNext(i + 1); im.src = u; };
    tryNext(0); return () => { dead = true; }; }, [active]);

  // 1) console typing → 2) flash → 3) hero
  useEffect(() => {
    if (!active || step !== 'console') return; let i = 0, hold, iv; const t0 = setTimeout(() => { iv = setInterval(() => { setTyped(++i); if (i >= MSG.length) { clearInterval(iv); hold = setTimeout(go, 950); } }, 32); }, 350);
    const go = () => { clearInterval(iv); clearTimeout(hold); clearTimeout(t0); removeEventListener('pointerdown', go); removeEventListener('keydown', go); setTyped(MSG.length); setFlash(true); setTimeout(() => setStep('hero'), 650); }; // click / key skips the typing
    addEventListener('pointerdown', go); addEventListener('keydown', go);
    return () => { clearInterval(iv); clearTimeout(hold); clearTimeout(t0); removeEventListener('pointerdown', go); removeEventListener('keydown', go); };
  }, [active, step]);

  // 4) SCROLL CHOREOGRAPHY
  //   stage 0  hero (name, contact, tools)
  //   scroll ↓ the hero + background drift up and fade to black, the window springs up from below and bounces into the middle  (stage 1)
  //   scroll ↓ again: the camera dives through the window into the real desktop (fast, accelerating)  →  onDone()
  //   scroll ↑ reverses every step. From the desktop, App.jsx can restart the opening with reenter=true: it starts INSIDE the window and flies back out.
  useLayoutEffect(() => {
    if (!active || step !== 'hero') return;
    const re = !!reenter, auto = reenter === 'auto', calm = matchMedia('(prefers-reduced-motion: reduce)').matches; // reenter === 'auto' (the BACK TO INTRO button) flies out by itself · true (scroll up) waits for the wheel
    const S = { T1: re ? 1 : 0, s: re ? 1 : 0, v: 0, dT: re && !auto ? 1 : 0, d: re ? 1 : 0, armed: !re || auto, want: false, hx: 0, hy: 0, dv: 0, lockB: 0, back: 0, lock: 0, tx: 0, ty: 0, mx: 0, my: 0, last: performance.now(), done: false }, G = {};
    let raf, txt = 'SCROLL';
    const fit = () => { const vw = innerWidth, vh = innerHeight, Wb = Math.min(vh * 0.66 * ART, vw * 0.6), Hb = Wb / ART, ox = IX + IW / 2, oy = IY + IH / 2, IWp = Wb * IW;
      Object.assign(win.current.style, { width: Wb + 'px', height: Hb + 'px', left: vw / 2 - Wb * ox + 'px', top: vh / 2 - Hb * oy + 'px', transformOrigin: `${ox * 100}% ${oy * 100}%` }); // the screen area's centre sits at the viewport centre → the dolly is exact
      Object.assign(clip.current.style, { left: IX * 100 + '%', top: IY * 100 + '%', width: IW * 100 + '%', height: IH * 100 + '%' });
      desk.current.style.setProperty('--ds', (IWp / vw).toFixed(5)); // the real desktop (100vw × 100vh) shrunk to fit the screen area
      G.vw = vw; G.vh = vh; G.zEnd = PERSPECTIVE * (1 - IWp / vw); }; // at zEnd the screen area is exactly viewport-wide, i.e. the desktop is back at 1:1
    const add = (dy) => { if (S.done) return; const now = performance.now();
      if (dy > 0) { S.back = 0;
        if (S.T1 === 0) { if (dy > 3) { S.T1 = 1; S.lock = now + 1100; } }                                   // 1st scroll: the window bounces up (the lock swallows trackpad inertia)
        else if (dy > 3 && now > S.lock && S.dT < 1 && !S.want) { if (loadedRef.current) S.dT = 1; else { S.dT = 0.12; S.want = true; } } // 2nd scroll: ONE continuous dive into the desktop (the scroll is only the trigger)
      } else if (dy < -3) {
        if (S.dT > 0) { S.want = false; S.dT = 0; S.lockB = now + 900; }                                     // scroll up (even in the middle of the dive): glide back out of the window
        else if (S.T1 === 1 && now > S.lock && now > S.lockB && S.d < 0.03) { S.back -= dy; if (S.back > 140) { S.T1 = 0; S.lock = now + 1100; S.back = 0; } } // …and one more scroll up: back to the hero
      } };
    const wheel = (e) => add(e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY);
    const key = (e) => { const k = e.key; if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.target.closest?.('a,button,[tabindex]'))) { e.preventDefault(); add(220); } else if (k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); add(-220); } else if (k === 'End') ctl.current.skip(); else if (k === 'Home') { S.T1 = 0; S.dT = 0; } };
    let ty0 = 0; const ts = (e) => { ty0 = e.touches[0].clientY; }, tm = (e) => { const y = e.touches[0].clientY; add((ty0 - y) * 2.2); ty0 = y; };
    const pm = (e) => { S.tx = (e.clientX / innerWidth) * 2 - 1; S.ty = (e.clientY / innerHeight) * 2 - 1; };
    const on = (m) => { m('wheel', wheel, { passive: true }); m('keydown', key); m('touchstart', ts, { passive: true }); m('touchmove', tm, { passive: true }); m('pointermove', pm, { passive: true }); m('resize', fit); };
    ctl.current.skip = () => { S.T1 = 1; S.lock = 0; if (loadedRef.current) S.dT = 1; else { S.dT = 0.3; S.want = true; } }; ctl.current.next = () => add(400); ctl.current.back = () => add(-220);
    const render = (now, dt) => {
      const f = Math.min(3, dt / 16.7);
      S.v += (S.T1 - S.s) * 0.012 * f; S.v *= Math.pow(0.85, f); S.s += S.v * f;                // soft spring (~0.9 s, tiny overshoot). Lower 0.012 = slower · lower 0.85 = bouncier
      if (S.dT < 1) S.armed = true; if (S.want && loadedRef.current) { S.want = false; S.dT = 1; }
      S.dv += (S.dT - S.d) * 0.016 * f; S.dv *= Math.pow(0.734, f); S.d += S.dv * f; if (S.d < 0) { S.d = 0; S.dv = 0; } if (S.d > 1) { S.d = 1; S.dv = 0; } // the dive is a critically-damped spring (smooth, no overshoot, ~0.8 s). Raise 0.016 = faster
      S.mx += (S.tx - S.mx) * 0.06; S.my += (S.ty - S.my) * 0.06; S.hx += (S.tx - S.hx) * 0.035; S.hy += (S.ty - S.hy) * 0.035; // hx/hy: slower, for the floaty hero
      const s = S.s, sc = Math.min(1, Math.max(0, s)), b = Math.min(1, Math.max(0, S.d)), vh = G.vh;
      const x = lerp(G.vw * 0.06, 0, sc), y = (1 - s) * vh * 0.95 + Math.sin(now / 900) * 6 * (1 - b) * sc, z = lerp(-950, 0, sc) + b * G.zEnd;
      const rY = lerp(-14, 0, sc) + S.mx * 4 * (1 - b) * sc, rX = lerp(8, 0, sc) - S.my * 3 * (1 - b) * sc, rZ = -Math.sin(b * Math.PI) * 1.6;
      win.current.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) rotateZ(${rZ.toFixed(2)}deg)`;
      win.current.style.opacity = smooth(s / 0.4).toFixed(3);
      const h = 1 - smooth(s / 0.5); if (hero.current) { hero.current.style.opacity = h.toFixed(3); hero.current.style.transform = `translate3d(0,${(-s * vh * 0.5).toFixed(1)}px,0)`; hero.current.style.visibility = h < 0.02 ? 'hidden' : 'visible';
        if (h >= 0.02 && !calm) [...hero.current.children].forEach((n, i) => { const d = [[10, 7], [22, 14], [14, 9], [8, 5], [5, 3]][i] || [6, 4]; // soft parallax: each hero layer drifts against the cursor by a different amount + a slow idle float
          n.style.translate = `${(-S.hx * d[0] + Math.sin(now / 1700 + i * 0.9) * 3).toFixed(2)}px ${(-S.hy * d[1] + Math.cos(now / 2100 + i * 1.3) * 4).toFixed(2)}px`; }); }
      const fade = 1 - smooth((b - 0.3) / 0.55); if (bg.current) { bg.current.style.opacity = (STARS_STAY_ON_WINDOW ? fade : 1 - smooth(s / 0.5)).toFixed(3); bg.current.style.transform = `translate3d(${(-S.hx * 12).toFixed(1)}px,${(-sc * vh * 0.03 - S.hy * 8).toFixed(1)}px,0)`; }
      if (art.current) { art.current.style.opacity = (smooth((s - 0.05) / 0.6) * fade).toFixed(3); art.current.style.transform = `translate3d(${(-S.hx * 10).toFixed(1)}px,${(-S.hy * 7).toFixed(1)}px,0) scale(1.06)`; } // LoadingBG fades in behind the window as the hero leaves // stars stay behind the window; they only fade while you dive in
      if (hint.current) { const o = (s < 0.5 ? 1 - smooth(s / 0.12) : smooth((s - 0.8) / 0.2)) * (1 - smooth(S.d / 0.08)); hint.current.style.opacity = o.toFixed(3);
        if (back.current) { const o2 = smooth((s - 0.85) / 0.15) * (1 - smooth(S.d / 0.08)); back.current.style.opacity = o2.toFixed(3); back.current.style.pointerEvents = o2 > 0.5 ? 'auto' : 'none'; }
        const t = S.want && !loadedRef.current ? 'LOADING THE DESKTOP…' : S.T1 === 1 ? 'SCROLL TO ENTER' : 'SCROLL'; if (t !== txt) { txt = t; setHintTxt(t); } }
      if (S.dT >= 1 && S.d >= 0.995 && S.armed && !S.done) { S.done = true; cancelAnimationFrame(raf); ['.ow-win', '.ow-clip', '.ow-desk'].forEach((q) => { const n = document.querySelector(q); if (n) n.style.cssText = ''; }); onDone(); } };
    const tick = (now) => { const dt = Math.min(64, now - S.last); S.last = now; render(now, dt); if (!S.done) raf = requestAnimationFrame(tick); };
    on(addEventListener); fit(); render(performance.now(), 16.7); // first frame is drawn before the browser paints (no flash when re-entering from the desktop)
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); on(removeEventListener); };
  }, [active, step]);

  return (<div className={'ow' + (active ? ' on' : '')}>
    {active && <div className="op-art" ref={art} aria-hidden="true" style={{ opacity: 0, backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }} />}
    {active && <div className="op-bg" ref={bg} aria-hidden="true"><StarField count={16} size={0.7} alpha={0.55} shooting={false} /></div>}
    <div className="ow-win" ref={win} style={active ? { opacity: 0 } : undefined}>
      <div className="ow-clip" ref={clip}><div className="ow-desk" ref={desk}>{children}</div></div>
      {active && <img className="ow-frame" src={asset('/assets/ui/WindowBeginning.webp')} alt="" draggable="false" />}
    </div>
    {active && step === 'console' && <div className="op-console" role="status"><p>{MSG.slice(0, typed)}<i className="op-caret" /></p></div>}
    {active && step === 'hero' && (<>
      <section className="op-hero" ref={hero} aria-label={`${site.name} — introduction`}>
        <img className="op-logo" src={asset('/assets/intro/color-logo.webp')} alt="" draggable="false" />
        <ScatterText text={site.name} />
        <p className="op-role">Digital Entertainment Design Engineer <span>✦</span> 3D/2D Generalist</p>
        <nav className="op-contact" aria-label="Contact">
          <a href={C.linkedin} target="_blank" rel="noreferrer"><IconIn />LinkedIn</a>
          <CopyChip value={C.email} Icon={IconMail} label={C.email} kind="email address" />
          <CopyChip value={C.phone} Icon={IconPhone} label={C.phone} kind="phone number" />
        </nav>
        <div className="op-tools" aria-label="Software I use"><small>TOOLS</small>{about.software.slice(0, 10).map((s) => <span key={s.name} className="op-tool" data-name={s.name} tabIndex={0}><img src={asset(s.icon)} alt={s.name} draggable="false" onError={(e) => { e.currentTarget.parentNode.style.display = 'none'; }} /></span>)}</div>
      </section>
      <button className="op-scroll" ref={hint} onClick={() => ctl.current.next?.()} aria-label="Scroll down to enter the portfolio"><span>{hintTxt}</span><i /></button>
      <button className="op-back" ref={back} onClick={() => ctl.current.back?.()} aria-label="Scroll up to go back to the intro" style={{ opacity: 0, pointerEvents: 'none' }}><i /><span>BACK TO INTRO</span></button>
      <button className="op-skip" onClick={() => ctl.current.skip?.()}>SKIP INTRO ›</button>
    </>)}
    {active && <div className={'op-flash' + (flash && !reenter ? ' go' : '')} aria-hidden="true" />}
  </div>);
}
