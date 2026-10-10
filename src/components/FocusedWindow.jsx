import { useEffect, useRef, useState } from 'react';
import { sections } from '../data/navigationData';
import { FOCUS } from '../data/focusData';
import { site } from '../data/siteData';
import { asset } from '../utils/assets';
import Section from '../sections';
import SwIcon from './SwIcon';
import StarField from './StarField';
import { DockButton } from './MusicDock';
import { Clock, SfxToggle, FsButton } from './Desktop';
import '../styles/focused.css';

const Ico = ({ id }) => <img src={asset(`/assets/icons/${id}.webp`)} alt="" draggable="false" />;
// The REAL generalist portfolio = this same page without the #hash (a normal link → full page load → the usual intro + boot scene). Works from any shared focused URL.
export const generalistUrl = () => location.pathname + location.search;
const sec = (id) => sections.find((s) => s.id === id);

// Phones / portrait tablets: the same info as the desktop header, rearranged (identity · collapsible "what I bring" · generalist link). Shown at the top of the section content.
export function FocusIntro({ focusId }) {
  const F = FOCUS[focusId];
  return (<aside className="fi">
    <div className="fi-id"><img src={asset(site.logo)} alt="" draggable="false" /><div><b className="mar-logo">{site.name}</b><span>{F.role}</span></div></div>
    <details className="fi-bring"><summary>What I bring</summary><ul>{F.bring.map((t) => <li key={t}>{t}</li>)}</ul></details>
    <a className="fi-note" href={generalistUrl()} aria-label="Open my generalist portfolio"><span>My generalist portfolio:</span><b>See here ↗</b></a>
  </aside>);
}

// Desktop / wide tablets: header banner + left navigation + "what I bring" + sticky note drawn over FocusedWindow.webp / FocusedLayerTop.webp (a 16:9 stage that scales with the screen).
export default function FocusedWindow({ id, focusId, onNav }) {
  const F = FOCUS[focusId], cur = sec(id), [filter, setFilter] = useState('ALL'), [shown, setShown] = useState(false), sc = useRef(), stage = useRef(), [pop, setPop] = useState(null), [more, setMore] = useState(false); // more = there is content below the visible part → show the "MORE" button
  useEffect(() => { const r = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(r); }, []);
  useEffect(() => { setFilter('ALL'); }, [id]);
  useEffect(() => { const n = sc.current; if (n) try { n.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch { n.scrollTop = 0; } }, [id, filter]);
  useEffect(() => { const n = sc.current; if (!n) return; const f = () => setMore(n.scrollHeight - n.clientHeight - n.scrollTop > 8); f(); n.addEventListener('scroll', f, { passive: true });
    const ro = new ResizeObserver(f); ro.observe(n); if (n.firstElementChild) ro.observe(n.firstElementChild); return () => { n.removeEventListener('scroll', f); ro.disconnect(); }; }, [id, filter]);
  // soft parallax: the laptop/desk art in the corner drifts a little against the pointer (CSS reads --px / --py, each -0.5…0.5)
  useEffect(() => { if (!matchMedia('(hover:hover)').matches) return; const h = (e) => { const s = stage.current; if (!s) return; s.style.setProperty('--px', (e.clientX / innerWidth - 0.5).toFixed(3)); s.style.setProperty('--py', (e.clientY / innerHeight - 0.5).toFixed(3)); };
    addEventListener('pointermove', h, { passive: true }); return () => removeEventListener('pointermove', h); }, []);
  return (<div className="fw" role="dialog" aria-label={`${site.name} · ${F.role}`}>
    <div className={'fw-stage' + (shown ? ' shown' : '') + (cur.filters ? ' haspills' : '')} ref={stage}>
      <img className="fw-art fw-win" src={asset('/assets/ui/FocusedWindow.webp')} alt="" draggable="false" />
      <img className="fw-art fw-toplayer" src={asset('/assets/ui/FocusedLayerTop.webp')} alt="" draggable="false" />
      <StarField />
      <img className="deco fw-pc" src={asset('/assets/ui/front-left.webp')} alt="" draggable="false" />
      <header className="fw-top"><span className="clock"><DockButton /><FsButton /><SfxToggle /><Clock /></span></header>
      <nav className="fw-nav" aria-label="Sections">
        {F.nav.map((k) => { const s = sec(k); return <button key={k} data-sfx="tick" className={(k === id ? 'on' : '') + (pop === k ? ' pop' : '')} aria-current={k === id ? 'page' : undefined} onClick={() => { setPop(k); setTimeout(() => setPop(null), 520); k === id ? setFilter('ALL') : onNav(k); }}><Ico id={k} />{s.label}</button>; })}
      </nav>
      <section className="fw-banner" aria-label={`${site.name} · ${F.role}`}><Ico id={focusId} /><div><h2 className="mar-logo">{site.name}</h2><p>{F.tagline}</p></div><img className="fw-logo" src={asset('/assets/intro/color-logo.webp')} alt="" draggable="false" /></section>
      {cur.filters && <div className="fw-head"><div className="fw-pills" role="group" aria-label={`${cur.label} categories`}>{cur.filters.map((f) => <button key={f} data-sfx="tick" className={f === filter ? 'on' : ''} aria-pressed={f === filter} onClick={() => setFilter(f)}><SwIcon name={f} />{f}</button>)}</div></div>}
      <div className="fw-scroll" ref={sc}><div className="content"><Section id={id} filter={cur.filters?.includes(filter) ? filter : 'ALL'} /></div></div>
      <div className={'fw-fade' + (more ? ' on' : '')} aria-hidden="true" />
      <button className={'fw-more' + (more ? ' on' : '')} data-sfx="tick" tabIndex={more ? 0 : -1} aria-label="Scroll down for more" onClick={() => sc.current?.scrollBy({ top: sc.current.clientHeight * 0.8, behavior: 'smooth' })}>▼ <span>MORE</span></button>
      <aside className="fw-bring" aria-label="What I bring"><h3>What I bring</h3><ul>{F.bring.map((t) => <li key={t}>{t}</li>)}</ul></aside>
      <a className="fw-note" href={generalistUrl()} data-sfx="tick" aria-label="Open my generalist portfolio"><span>My generalist portfolio:</span><b>Go there</b></a>
    </div>
  </div>);
}
