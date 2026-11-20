import { useEffect, useState, useCallback } from 'react';
import Desktop from './components/Desktop';
import PortfolioWindow from './components/PortfolioWindow';
import { sections } from './data/navigationData';
import { site } from './data/siteData';
import { asset, reducedMotion } from './utils/assets';
import MusicDock from './components/MusicDock';
import { initSfx, play } from './utils/sfx';
import { preloadAll } from './utils/preload';
import Intro from './components/Intro';
import Opening from './components/Opening';
import RotateHint from './components/RotateHint';
import Boot from './components/Boot';
import PreviewReel, { PREVIEWS, seenPreview } from './components/PreviewReel';
import FocusedWindow from './components/FocusedWindow';
import { FOCUS, parseRoute, routeHash } from './data/focusData';
import { canFullscreen, enterFullscreen } from './utils/fullscreen';
import * as M from './utils/music';
// If the browser blocks autoplay, the intro waits for ONE click/tap ("click to enter") so the music can start by itself afterwards. Set to false to never wait.
const WAIT_FOR_CLICK_IF_MUSIC_BLOCKED = true;
// Phones: the first tap puts the site into fullscreen (and locks landscape where the browser allows it). The ⛶ button in the top bar toggles it. Set to false to only use the button.
const AUTO_FULLSCREEN_ON_PHONES = true;

const route = () => parseRoute(location.hash, sections); // { focus, id }: '#/rigging' → normal portfolio · '#/rigging/focused[/awards]' → role-focused version
const fromHash = () => route().id;

function Cursor() { // custom cursor on fine pointers only. Dot and ring move together instantly (no trailing).
  useEffect(() => { if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return; const d = document.getElementById('cur'), r = document.getElementById('ring');
    const m = (e) => { if (!d || !r) return; const t = `translate3d(${e.clientX}px,${e.clientY}px,0)`; d.style.transform = t; r.style.transform = t; r.classList.toggle('big', !!e.target.closest('button,a,input,[role=button]')); };
    addEventListener('pointermove', m, { passive: true }); document.body.classList.add('cc'); return () => { removeEventListener('pointermove', m); document.body.classList.remove('cc'); }; }, []);
  return <><i id="ring" className="ring" /><i id="cur" className="dot" /></>;
}

// Adds <html class="compact"> on phones/small screens (and "portrait" when held upright) so the CSS can switch to the phone layout.
const WIDE_ABOUT_MIN = 1000; // ✏️ tablets at least this many px wide (e.g. iPad in either orientation) use the desktop About layout; narrower ones keep the stacked one
function useLayoutClass() {
  // phone  = small screen  → full-screen "compact" layout (rail + pills)
  // tablet = touch device whose short side is ≥ 600px (iPad, Android tablets): gets the SAME compact layout as phones, in both orientations, with bigger spacing (html.tablet.compact);
  const [compact, setCompact] = useState(false);
  useEffect(() => { const root = document.documentElement, ph = matchMedia('(max-width:760px), (pointer:coarse) and (max-height:520px)'), touch = matchMedia('(pointer:coarse)');
    const f = () => { const portrait = innerHeight > innerWidth, tablet = !ph.matches && touch.matches && Math.min(innerWidth, innerHeight) >= 600, c = ph.matches || tablet;
      setCompact(c); root.classList.toggle('compact', c); root.classList.toggle('tablet', tablet); root.classList.toggle('wideabout', tablet && innerWidth >= WIDE_ABOUT_MIN); root.classList.toggle('portrait', c && portrait); };
    f(); ph.addEventListener('change', f); touch.addEventListener('change', f); addEventListener('resize', f); addEventListener('orientationchange', f);
    return () => { ph.removeEventListener('change', f); touch.removeEventListener('change', f); removeEventListener('resize', f); removeEventListener('orientationchange', f); }; }, []);
  return compact;
}

export default function App() {
  const [open, setOpen] = useState(fromHash()), [focus, setFocus] = useState(route().focus), [origin, setOrigin] = useState(null);
  const [boot, setBoot] = useState(false); // the little "boot-up" terminal scene that plays once, right after the loading screen (components/Boot.jsx)
  const [phase, setPhase] = useState(reducedMotion() || (fromHash() && !route().focus) ? 'done' : 'intro'); // intro → reveal → done (a focused link still shows the loading screen, but never the boot story)
  // NEW desktop opening (console → flash → intro → scroll into the real desktop). Only on a desktop-class screen, for the plain portfolio link (no #/section, no focused version, no reduced motion).
  // Phones, tablets, focused links and deep links keep the loading screen below, exactly as before.
  const [opening, setOpening] = useState(() => !reducedMotion() && !route().id && !route().focus && matchMedia('(pointer:fine) and (min-width:761px)').matches);
  const [reenter, setReenter] = useState(false); // true while the opening is replaying from the desktop (scroll up on the desktop → fly back out of the window)
  const [gamePlayed, setGamePlayed] = useState(false), [pct, setPct] = useState(0), [loaded, setLoaded] = useState(false), [minTime, setMinTime] = useState(false), [music, setMusic] = useState(M.getState());
  useEffect(() => { preloadAll(setPct).then(() => setLoaded(true)); return M.subscribe(setMusic); }, []); // everything loads behind the intro logo
  useEffect(() => { if (phase === 'intro') { const t = setTimeout(() => setMinTime(true), 3200); return () => clearTimeout(t); }
    if (phase === 'reveal') { if (!focus) setBoot(true); const t = setTimeout(() => setPhase('done'), 1800); return () => clearTimeout(t); } }, [phase]);
  // wait for a click if the browser blocked the music, or if the visitor is mid-snake-game (so it never yanks the screen away)
  const needClick = gamePlayed || (WAIT_FOR_CLICK_IF_MUSIC_BLOCKED && music.tracks.length > 0 && !music.playing && !music.muted);
  useEffect(() => { if (phase === 'intro' && minTime && loaded && !needClick && !opening) setPhase('reveal'); }, [phase, minTime, loaded, needClick, opening]);
  useEffect(() => { const h = () => { const r = route(); setOpen(r.id); setFocus(r.focus); if (!r.id) setOrigin(null); }; addEventListener('hashchange', h); return () => removeEventListener('hashchange', h); }, []);
  // Scroll UP on the plain desktop (no window / pop-up / game open) → the opening plays backwards: out of the window and back to the intro. Desktop-class screens only.
  useEffect(() => { if (opening || phase !== 'done' || open || focus || boot || reducedMotion() || !matchMedia('(pointer:fine) and (min-width:761px)').matches) return;
    let acc = 0, t = 0; const w = (e) => { if (e.deltaY >= 0) { acc = 0; return; } if (e.target.closest?.('[role="dialog"],.arc,.viewer,.pv')) return; const n = performance.now(); if (n - t > 500) acc = 0; t = n; acc += e.deltaY; if (acc < -160) { acc = 0; setReenter(true); setOpening(true); } };
    addEventListener('wheel', w, { passive: true }); return () => removeEventListener('wheel', w); }, [opening, phase, open, focus, boot]);
  const [preview, setPreview] = useState(null); // first time a section (rigging / animation / projects) is opened → short reel popup (components/PreviewReel.jsx)
  useEffect(() => { if (!open || !PREVIEWS[open] || boot || phase !== 'done' || seenPreview(open)) return; const t = setTimeout(() => setPreview(open), 500); return () => clearTimeout(t); }, [open, boot, phase]);
  useEffect(() => { if (!open) setPreview(null); }, [open]);
  const compact = useLayoutClass(), [wide, setWide] = useState(false); // wide = iPad-sized landscape tablet → gets the desktop layout
  useEffect(() => { const f = () => requestAnimationFrame(() => setWide(document.documentElement.classList.contains('wideabout'))); f(); addEventListener('resize', f); addEventListener('orientationchange', f); return () => { removeEventListener('resize', f); removeEventListener('orientationchange', f); }; }, [compact]);
  const stage = !!focus && (!compact || wide); // focused desktop layout (FocusedWindow) vs. the compact window (phones / portrait tablets)
  useEffect(() => { document.documentElement.classList.toggle('focused', stage); return () => document.documentElement.classList.remove('focused'); }, [stage]);
  useEffect(() => { const t = document.title; if (focus) document.title = `${site.name} · ${FOCUS[focus].role}`; return () => { document.title = t; }; }, [focus]);
  useEffect(() => { if (!AUTO_FULLSCREEN_ON_PHONES || !compact || document.documentElement.classList.contains('tablet') || !canFullscreen() || !matchMedia('(pointer:coarse)').matches) return;
    const go = () => { enterFullscreen(); off(); }, off = () => removeEventListener('pointerup', go, true); addEventListener('pointerup', go, true); return off; }, [compact]);
  useEffect(() => { document.documentElement.dataset.phase = phase; }, [phase]); // the FPS guard waits for 'done'
  // Ghost-tap shield: if a tap STARTS while the loading screen is up but the screen is already gone when the finger lifts (the first touch starts the music, which ends the
  // loading screen), swallow that tap's click, otherwise it lands on whatever is underneath (e.g. the SKIP button of the boot scene or a desktop icon).
  useEffect(() => { let armed = 0; const ph = () => document.documentElement.dataset.phase;
    const down = () => { armed = ph() === 'intro' ? performance.now() : 0; };
    const click = (e) => { if (armed && ph() !== 'intro' && performance.now() - armed < 1500) { e.stopImmediatePropagation(); e.preventDefault(); } armed = 0; };
    addEventListener('pointerdown', down, true); addEventListener('click', click, true); return () => { removeEventListener('pointerdown', down, true); removeEventListener('click', click, true); }; }, []);
  useEffect(() => initSfx(), []);
  const openSec = useCallback((id, rect) => { if (rect) play('open'), setOrigin(rect); location.hash = routeHash(focus, id); }, [focus]);
  const closed = useCallback(() => { history.pushState('', document.title, location.pathname + location.search); setOpen(null); setOrigin(null); }, []);
  return (<>
    <Opening active={opening} reenter={reenter} loaded={loaded} onDone={() => { setOpening(false); setReenter(false); setPhase('done'); }}>
      <Desktop openId={open} onOpen={openSec} ready={phase !== 'intro' || opening} introDone={phase === 'done'} />
    </Opening>
    {open && !focus && <PortfolioWindow key="win" id={open} origin={origin} onNav={(id) => { setOrigin(null); openSec(id); }} onClosed={closed} />}
    {open && focus && phase !== 'intro' && (stage ? <FocusedWindow key="fwin" id={open} focusId={focus} onNav={(id) => openSec(id)} /> : <PortfolioWindow key="win" id={open} focus={focus} onNav={(id) => { setOrigin(null); openSec(id); }} onClosed={closed} />)}
    {phase !== 'done' && !opening && <Intro out={phase === 'reveal'} loaded={loaded} pct={pct} needClick={needClick && (minTime || gamePlayed)} onEnter={() => setPhase('reveal')} onPlay={() => setGamePlayed(true)} focusRole={focus ? FOCUS[focus].role : null} />}
    {preview && open === preview && <PreviewReel key={preview} id={preview} onClose={() => setPreview(null)} />}
    {boot && <Boot onDone={() => setBoot(false)} />}
    {!opening && phase === 'done' && !open && !focus && !boot && !reducedMotion() && matchMedia('(pointer:fine) and (min-width:761px)').matches && (
      <button className="op-back-desk" onClick={() => { setReenter('auto'); setOpening(true); }} aria-label="Go back to the intro screen"><i /><span>BACK TO INTRO</span></button>)}
    <MusicDock open={!!open || opening} compact={compact} />
    <RotateHint />
    <Cursor />
  </>);
}
