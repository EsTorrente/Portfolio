import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { sections } from '../data/navigationData';
import { asset } from '../utils/assets';
import Section from '../sections';
import { reducedMotion } from '../utils/assets';
import { play } from '../utils/sfx';
import SwIcon from './SwIcon';
import { useDockOpen } from './MusicDock';
import { FocusIntro } from './FocusedWindow';
import { FOCUS } from '../data/focusData';
import { SfxToggle, FsButton } from './Desktop';

const Ico = ({ id }) => <img src={asset(`/assets/icons/${id}.webp`)} alt="" />;
// Window grows from the clicked icon (FLIP: icon rect → window rect), overshoots slightly, then reveals content.
export default function PortfolioWindow({ id, origin, onNav, onClosed, focus }) { // focus = 'rigging' | 'animation' | 'modelling' | 'illustration' | 'projects' (role-focused version) or undefined (the normal portfolio)
  const list = focus ? FOCUS[focus].nav.map((k) => sections.find((s) => s.id === k)) : sections;
  const [dockOpen, setDockOpen] = useDockOpen(), sec = sections.find((s) => s.id === id), el = useRef(), [filter, setFilter] = useState('ALL'), [shown, setShown] = useState(false), [closing, setClosing] = useState(false), [more, setMore] = useState(false); // more = content below → floating ▼ button (focused version)
  const flip = (reverse, done) => { const w = el.current, r = w.getBoundingClientRect(); if (!origin || reducedMotion()) return done();
    const dx = origin.left + origin.width / 2 - (r.left + r.width / 2), dy = origin.top + origin.height / 2 - (r.top + r.height / 2);
    const from = `translate(${dx}px,${dy}px) scale(${origin.width / r.width},${origin.height / r.height})`;
    const a = w.animate(reverse ? [{ transform: 'none', opacity: 1 }, { transform: from, opacity: 0 }] : [{ transform: from, opacity: 0 }, { opacity: 1, offset: 0.25 }, { transform: 'none', opacity: 1 }],
      { duration: reverse ? 520 : 820, easing: reverse ? 'cubic-bezier(.6,0,.9,.4)' : 'cubic-bezier(.2,1.15,.3,1)', fill: 'both' }); a.onfinish = done; };
  useLayoutEffect(() => { flip(false, () => setShown(true)); }, []);
  const toTop = () => { const w = el.current; if (!w) return; // desktop scrolls .wbody, phones/tablets scroll .wmain → reset every possible scroller (instantly, even if CSS says smooth)
    ['.wbody', '.wmain', '.content'].forEach((q) => { const n = w.querySelector(q); if (!n) return; try { n.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch { n.scrollTop = 0; } }); };
  useEffect(() => { setFilter('ALL'); }, [id]);
  useEffect(() => { toTop(); const r = requestAnimationFrame(toTop); return () => cancelAnimationFrame(r); }, [id, filter]); // new section OR new category → back to the top
  const close = () => { if (closing || focus) return; play('close'); setClosing(true); setShown(false); flip(true, onClosed); };
  useEffect(() => { const k = (e) => e.key === 'Escape' && close(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); });
  useEffect(() => { el.current.querySelector(focus ? '.wsnd' : '.wclose').focus({ preventScroll: true }); }, []);
  useEffect(() => { if (!focus) return; const n = el.current?.querySelector('.wmain'); if (!n) return; const f = () => setMore(n.scrollHeight - n.clientHeight - n.scrollTop > 24); f(); n.addEventListener('scroll', f, { passive: true });
    const ro = new ResizeObserver(f); ro.observe(n); if (n.firstElementChild) ro.observe(n.firstElementChild); return () => { n.removeEventListener('scroll', f); ro.disconnect(); }; }, [focus, id, filter, shown]);
  const ptr = (e) => { const w = el.current; if (!w) return; const r = w.getBoundingClientRect(); w.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); w.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3)); };
  return (<div className={'wrap' + (closing ? ' closing' : '')}>
    <img className="deco deco-br" src={asset('/assets/ui/back-right.webp')} alt="" draggable="false" />
    <div className={'win' + (shown ? ' shown' : '') + (focus ? ' focus' : '')} ref={el} role="dialog" aria-modal="true" aria-label={sec.title} onPointerMove={ptr}
    style={{ backgroundImage: `url(${asset('/assets/ui/main-window.webp')})` }}>
    <div className="wtab"><Ico id={id} /><b>{sec.label.toUpperCase()}</b></div>
    <div className="wctl">{!focus && <button aria-label="Minimise (closes)" onClick={close}>–</button>}{!focus && <button aria-label="Maximise" tabIndex={-1}>▢</button>}<button className="wsnd dock-btn" data-sfx="tick" aria-label={dockOpen ? 'Hide music player' : 'Music and volume'} aria-expanded={dockOpen} onClick={() => setDockOpen((o) => !o)}>{dockOpen ? '✕' : '♪'}</button>{focus && <><SfxToggle /><FsButton /></>}{!focus && <button className="wclose" aria-label="Close window and return to desktop" onClick={close}>✕</button>}</div>
    <div className="wbody">
      <nav className="rail" aria-label="Sections">
        {!focus && <button className="rail-back" onClick={close} aria-label="Back to menu" title="Back to menu">‹</button>}
        {list.map((s) => (<button key={s.id} className={s.id === id ? 'on' : ''} data-sfx="tick" onClick={() => (s.id === id ? setFilter('ALL') : onNav(s.id))} aria-label={s.label} title={s.label} aria-current={s.id === id ? 'page' : undefined}><Ico id={s.id} /></button>))}
      </nav>
      {!focus && sec.filters && <div className="pills" role="group" aria-label={`${sec.label} categories`}>{sec.filters.map((f) => <button key={f} data-sfx="tick" className={f === filter ? 'on' : ''} onClick={() => setFilter(f)} aria-pressed={f === filter}><SwIcon name={f} />{f}</button>)}</div>}
      {!focus && <header className="whead"><Ico id={id} /><div><h2>{sec.title}</h2>{sec.sub.map((l, i) => <p key={i}>{l}</p>)}</div></header>}
      <div className="wmain">
        <nav className="side" aria-label="Sections">
          {list.map((s) => { const here = s.id === id, open = here && shown; return (<div className="grp" key={s.id}>
            <button className={here ? 'on' : ''} onClick={() => (here ? setFilter('ALL') : onNav(s.id))} aria-current={here ? 'page' : undefined} aria-expanded={s.filters ? open : undefined}><Ico id={s.id} />{s.label.toUpperCase()}{s.filters && <i className="chev" />}</button>
            {s.filters && <div className={'sub' + (open ? ' open' : '')} aria-hidden={!open}><div className="subin" role="group" aria-label={`${s.label} categories`}>
              {s.filters.map((f, k) => <button key={f} style={{ '--k': k }} tabIndex={open ? 0 : -1} data-sfx="tick" className={f === filter ? 'on' : ''} onClick={() => setFilter(f)} aria-pressed={f === filter}><SwIcon name={f} />{f}</button>)}</div></div>}
          </div>); })}
        </nav>
        <div className="content">{focus && <><header className="whead"><Ico id={id} /><div><h2>{sec.title}</h2>{sec.sub.map((l, i) => <p key={i}>{l}</p>)}</div></header>{sec.filters && <div className="pills" role="group" aria-label={`${sec.label} categories`}>{sec.filters.map((f) => <button key={f} data-sfx="tick" className={f === filter ? 'on' : ''} onClick={() => setFilter(f)} aria-pressed={f === filter}><SwIcon name={f} />{f}</button>)}</div>}</>}{focus && <FocusIntro focusId={focus} />}<Section id={id} filter={sec.filters?.includes(filter) ? filter : 'ALL'} /></div>
      </div>
      {focus && <button className={'scroll-dn' + (more ? ' on' : '')} tabIndex={more ? 0 : -1} aria-label="Scroll down for more" onClick={() => el.current.querySelector('.wmain')?.scrollBy({ top: el.current.querySelector('.wmain').clientHeight * 0.8, behavior: 'smooth' })}>▼</button>}
      {!focus && <button className="esc" onClick={close}>‹ ESC / CLOSE</button>}
      {!focus && <button className="back-menu" onClick={close}>‹ Back to menu</button>}
    </div></div>
    <img className="deco deco-fl" src={asset('/assets/ui/front-left.webp')} alt="" draggable="false" />
  </div>);
}
