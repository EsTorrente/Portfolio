import { useEffect, useState } from 'react';
import { sections } from '../data/navigationData';
import { site } from '../data/siteData';
import { asset } from '../utils/assets';
import ParallaxBackground from './ParallaxBackground';
import { isMuted, setMuted, onMuteChange, play } from '../utils/sfx';
import { DockButton } from './MusicDock';
import { canFullscreen, isFullscreen, toggleFullscreen, onFullscreenChange } from '../utils/fullscreen';

function Clock() { const f = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); const [t, s] = useState(f);
  useEffect(() => { const i = setInterval(() => s(f()), 20000); return () => clearInterval(i); }, []); return <span>{t}</span>; }

function SfxToggle() { const [m, setM] = useState(isMuted()); useEffect(() => onMuteChange(setM), []);
  return <button className="sfxbtn" data-sfx="none" aria-pressed={!m} aria-label={m ? 'Turn sound effects on' : 'Turn sound effects off'} onClick={() => { setMuted(!m); if (m) play('click'); }}>SFX {m ? 'OFF' : 'ON'}</button>; }

function FsButton() { const [on, setOn] = useState(isFullscreen()); useEffect(() => onFullscreenChange(setOn), []);
  if (!canFullscreen()) return null;
  return <button className="tb-btn fs-btn" data-sfx="tick" aria-pressed={on} aria-label={on ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={toggleFullscreen}>
    <svg viewBox="0 0 24 24" aria-hidden="true">{on ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}</svg></button>; }

function TypeBox({ lines, run }) { // typewriter in the small window
  const full = lines.join('\n'); const [n, setN] = useState(0);
  useEffect(() => { if (!run) return; if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(full.length);
    const i = setInterval(() => setN((v) => (v >= full.length ? (clearInterval(i), v) : v + 1)), 45); return () => clearInterval(i); }, [run]);
  return <pre aria-label={lines.join(' ')}>{full.slice(0, n)}<i className="caret" /></pre>;
}

export default function Desktop({ openId, onOpen, ready, introDone }) {
  const [hover, setHover] = useState(null);
  return (<main className={'desktop' + (openId ? ' has-open' : '') + (ready ? ' ready' : '')} style={{ backgroundImage: `url(${asset('/assets/backgrounds/background.jpg')})` }}>
    <ParallaxBackground dim={!!openId} /><div className="vignette" />
    <header className="topbar"><img src={asset('/assets/intro/color-logo.webp')} alt="" /><span>{site.name}</span><span className="clock"><DockButton /><FsButton /><SfxToggle /><Clock /></span></header>
    <nav className="icons" aria-label="Portfolio sections">
      {sections.map((s, i) => (<button key={s.id} className={'icon' + (openId === s.id ? ' active' : '') + (hover === s.id ? ' hov' : '')} data-id={s.id}
        style={{ '--i': i, '--cx': (i % 4) - 1.5, '--r': ((i * 37) % 5) - 2 + 'deg' }} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}
        onClick={(e) => onOpen(s.id, e.currentTarget.querySelector('img').getBoundingClientRect())} aria-label={`Open ${s.label}`}>
        <img src={asset(`/assets/icons/${s.id}.webp`)} alt="" draggable="false" /><span>{s.label}</span></button>))}
    </nav>
    <aside className="smallwin" aria-label="Welcome" style={{ backgroundImage: `url(${asset('/assets/ui/small-window.webp')})` }}><TypeBox lines={site.welcome} run={introDone} /></aside>
    <footer className="foot"><span>{site.tagline}</span></footer>
  </main>);
}
