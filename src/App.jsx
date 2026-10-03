import { useEffect, useState, useCallback } from 'react';
import Desktop from './components/Desktop';
import PortfolioWindow from './components/PortfolioWindow';
import { sections } from './data/navigationData';
import { site } from './data/siteData';
import { asset, reducedMotion } from './utils/assets';

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
  useEffect(() => { if (phase === 'intro') { const t = setTimeout(() => setPhase('reveal'), 3200); return () => clearTimeout(t); }
    if (phase === 'reveal') { const t = setTimeout(() => setPhase('done'), 1800); return () => clearTimeout(t); } }, [phase]);
  useEffect(() => { const h = () => { setOpen(fromHash()); if (!fromHash()) setOrigin(null); }; addEventListener('hashchange', h); return () => removeEventListener('hashchange', h); }, []);
  const openSec = useCallback((id, rect) => { if (rect) setOrigin(rect); location.hash = '/' + id; }, []);
  const closed = useCallback(() => { history.pushState('', document.title, location.pathname + location.search); setOpen(null); setOrigin(null); }, []);
  return (<>
    <Desktop openId={open} onOpen={openSec} ready={phase !== 'intro'} introDone={phase === 'done'} />
    {open && <PortfolioWindow key="win" id={open} origin={origin} onNav={(id) => { setOrigin(null); openSec(id); }} onClosed={closed} />}
    {phase !== 'done' && (<div className={'intro' + (phase === 'reveal' ? ' out' : '')} onClick={() => setPhase('reveal')} role="presentation">
      {site.logoVideo ? <video src={asset(site.logoVideo)} autoPlay muted playsInline /> : <img src={asset(site.logo)} alt={site.name} />}
      <p>INITIALIZING DREAM…</p><button className="skip">SKIP</button></div>)}
    <Cursor />
  </>);
}
