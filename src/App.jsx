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
import RotateHint from './components/RotateHint';
import { canFullscreen, enterFullscreen } from './utils/fullscreen';
import * as M from './utils/music';
// If the browser blocks autoplay, the intro waits for ONE click/tap ("click to enter") so the music can start by itself afterwards. Set to false to never wait.
const WAIT_FOR_CLICK_IF_MUSIC_BLOCKED = true;
// Phones: the first tap puts the site into fullscreen (and locks landscape where the browser allows it). The ⛶ button in the top bar toggles it. Set to false to only use the button.
const AUTO_FULLSCREEN_ON_PHONES = true;

const fromHash = () => { const id = location.hash.replace(/^#\/?/, ''); return sections.some((s) => s.id === id) ? id : null; };

function Cursor() { // custom cursor on fine pointers only. Dot and ring move together instantly (no trailing).
  useEffect(() => { if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return; const d = document.getElementById('cur'), r = document.getElementById('ring');
    const m = (e) => { const t = `translate3d(${e.clientX}px,${e.clientY}px,0)`; d.style.transform = t; r.style.transform = t; r.classList.toggle('big', !!e.target.closest('button,a,input,[role=button]')); };
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
  const [open, setOpen] = useState(fromHash()), [origin, setOrigin] = useState(null);
  const [phase, setPhase] = useState(fromHash() || reducedMotion() ? 'done' : 'intro'); // intro → reveal → done
  const [gamePlayed, setGamePlayed] = useState(false), [pct, setPct] = useState(0), [loaded, setLoaded] = useState(false), [minTime, setMinTime] = useState(false), [music, setMusic] = useState(M.getState());
  useEffect(() => { preloadAll(setPct).then(() => setLoaded(true)); return M.subscribe(setMusic); }, []); // everything loads behind the intro logo
  useEffect(() => { if (phase === 'intro') { const t = setTimeout(() => setMinTime(true), 3200); return () => clearTimeout(t); }
    if (phase === 'reveal') { const t = setTimeout(() => setPhase('done'), 1800); return () => clearTimeout(t); } }, [phase]);
  // wait for a click if the browser blocked the music, or if the visitor is mid-snake-game (so it never yanks the screen away)
  const needClick = gamePlayed || (WAIT_FOR_CLICK_IF_MUSIC_BLOCKED && music.tracks.length > 0 && !music.playing && !music.muted);
  useEffect(() => { if (phase === 'intro' && minTime && loaded && !needClick) setPhase('reveal'); }, [phase, minTime, loaded, needClick]);
  useEffect(() => { const h = () => { setOpen(fromHash()); if (!fromHash()) setOrigin(null); }; addEventListener('hashchange', h); return () => removeEventListener('hashchange', h); }, []);
  const compact = useLayoutClass();
  useEffect(() => { if (!AUTO_FULLSCREEN_ON_PHONES || !compact || document.documentElement.classList.contains('tablet') || !canFullscreen() || !matchMedia('(pointer:coarse)').matches) return;
    const go = () => { enterFullscreen(); off(); }, off = () => removeEventListener('pointerup', go, true); addEventListener('pointerup', go, true); return off; }, [compact]);
  useEffect(() => { document.documentElement.dataset.phase = phase; }, [phase]); // the FPS guard waits for 'done'
  useEffect(() => initSfx(), []);
  const openSec = useCallback((id, rect) => { if (rect) play('open'),  setOrigin(rect); location.hash = '/' + id; }, []);
  const closed = useCallback(() => { history.pushState('', document.title, location.pathname + location.search); setOpen(null); setOrigin(null); }, []);
  return (<>
    <Desktop openId={open} onOpen={openSec} ready={phase !== 'intro'} introDone={phase === 'done'} />
    {open && <PortfolioWindow key="win" id={open} origin={origin} onNav={(id) => { setOrigin(null); openSec(id); }} onClosed={closed} />}
    {phase !== 'done' && <Intro out={phase === 'reveal'} loaded={loaded} pct={pct} needClick={needClick && (minTime || gamePlayed)} onEnter={() => setPhase('reveal')} onPlay={() => setGamePlayed(true)} />}
    <MusicDock open={!!open} compact={compact} />
    <RotateHint />
    <Cursor />
  </>);
}
