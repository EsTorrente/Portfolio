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
import * as M from './utils/music';
// If the browser blocks autoplay, the intro waits for ONE click/tap ("click to enter") so the music can start by itself afterwards. Set to false to never wait.
const WAIT_FOR_CLICK_IF_MUSIC_BLOCKED = true;

const fromHash = () => { const id = location.hash.replace(/^#\/?/, ''); return sections.some((s) => s.id === id) ? id : null; };

function Cursor() { // custom cursor on fine pointers only
  useEffect(() => { if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return; const d = document.getElementById('cur'), r = document.getElementById('ring'); let x = 0, y = 0, rx = 0, ry = 0, raf;
    const m = (e) => { x = e.clientX; y = e.clientY; d.style.transform = `translate(${x}px,${y}px)`; r.classList.toggle('big', !!e.target.closest('button,a,input,[role=button]')); };
    const loop = () => { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; r.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop); };
    addEventListener('pointermove', m); loop(); document.body.classList.add('cc'); return () => { removeEventListener('pointermove', m); cancelAnimationFrame(raf); document.body.classList.remove('cc'); }; }, []);
  return <><i id="ring" className="ring" /><i id="cur" className="dot" /></>;
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
  useEffect(() => initSfx(), []);
  const openSec = useCallback((id, rect) => { if (rect) play('open'),  setOrigin(rect); location.hash = '/' + id; }, []);
  const closed = useCallback(() => { history.pushState('', document.title, location.pathname + location.search); setOpen(null); setOrigin(null); }, []);
  return (<>
    <Desktop openId={open} onOpen={openSec} ready={phase !== 'intro'} introDone={phase === 'done'} />
    {open && <PortfolioWindow key="win" id={open} origin={origin} onNav={(id) => { setOrigin(null); openSec(id); }} onClosed={closed} />}
    {phase !== 'done' && <Intro out={phase === 'reveal'} loaded={loaded} pct={pct} needClick={needClick && (minTime || gamePlayed)} onEnter={() => setPhase('reveal')} onPlay={() => setGamePlayed(true)} />}
    <MusicDock collapsed={!!open} />
    <Cursor />
  </>);
}
