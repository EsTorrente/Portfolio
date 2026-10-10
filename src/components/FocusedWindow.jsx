import { useEffect, useRef, useState } from 'react';
import { sections } from '../data/navigationData';
import { FOCUS } from '../data/focusData';
import { site } from '../data/siteData';
import { asset } from '../utils/assets';
import Section from '../sections';
import SwIcon from './SwIcon';
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
    <div className="fi-id"><img src={asset(site.logo)} alt="" draggable="false" /><div><b>{site.name}</b><span>{F.role}</span></div></div>
    <details className="fi-bring"><summary>What I bring</summary><ul>{F.bring.map((t) => <li key={t}>{t}</li>)}</ul></details>
    <a className="fi-note" href={generalistUrl()} aria-label="Open my generalist portfolio"><span>My generalist portfolio:</span><b>See here ↗</b></a>
  </aside>);
}

// Desktop / wide tablets: header banner + left navigation + "what I bring" + sticky note drawn over FocusedWindow.webp / FocusedLayerTop.webp (a 16:9 stage that scales with the screen).
export default function FocusedWindow({ id, focusId, onNav }) {
  const F = FOCUS[focusId], cur = sec(id), prim = sec(focusId), [filter, setFilter] = useState('ALL'), [shown, setShown] = useState(false), sc = useRef();
  useEffect(() => { const r = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(r); }, []);
  useEffect(() => { setFilter('ALL'); }, [id]);
  useEffect(() => { const n = sc.current; if (n) try { n.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch { n.scrollTop = 0; } }, [id, filter]);
  const heading = id === focusId && (id === 'rigging' || id === 'animation') ? `${cur.title} PROJECTS` : cur.title;
  return (<div className="fw" role="dialog" aria-label={`${site.name} · ${F.role}`}>
    <div className={'fw-stage' + (shown ? ' shown' : '')}>
      <img className="fw-art" src={asset('/assets/ui/FocusedWindow.webp')} alt="" draggable="false" />
      <img className="fw-art" src={asset('/assets/ui/FocusedLayerTop.webp')} alt="" draggable="false" />
      <header className="fw-top"><img src={asset('/assets/intro/color-logo.webp')} alt="" draggable="false" /><span>{site.name}</span><span className="clock"><DockButton /><FsButton /><SfxToggle /><Clock /></span></header>
      <nav className="fw-nav" aria-label="Sections">
        {F.nav.map((k) => { const s = sec(k); return <button key={k} data-sfx="tick" className={k === id ? 'on' : ''} aria-current={k === id ? 'page' : undefined} onClick={() => (k === id ? setFilter('ALL') : onNav(k))}><Ico id={k} />{s.label}</button>; })}
      </nav>
      <section className="fw-banner" aria-label={`${site.name} · ${F.role}`}><Ico id={focusId} /><div><h2>{prim.title}</h2><i aria-hidden="true" />{prim.sub.map((l, i) => <p key={i}>{l}</p>)}</div></section>
      <div className="fw-head"><h3><Ico id={id} /><span>{heading}</span></h3>
        {cur.filters && <div className="fw-pills" role="group" aria-label={`${cur.label} categories`}>{cur.filters.map((f) => <button key={f} data-sfx="tick" className={f === filter ? 'on' : ''} aria-pressed={f === filter} onClick={() => setFilter(f)}><SwIcon name={f} />{f}</button>)}</div>}</div>
      <div className="fw-scroll" ref={sc}><div className="content"><Section id={id} filter={cur.filters?.includes(filter) ? filter : 'ALL'} /></div></div>
      <aside className="fw-bring" aria-label="What I bring"><h3>What I bring</h3><ul>{F.bring.map((t) => <li key={t}>{t}</li>)}</ul></aside>
      <a className="fw-note" href={generalistUrl()} data-sfx="tick" aria-label="Open my generalist portfolio"><span>My generalist portfolio:</span><b>See here</b></a>
    </div>
  </div>);
}
