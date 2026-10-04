import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { sections } from '../data/navigationData';
import { asset } from '../utils/assets';
import Section from '../sections';
import { reducedMotion } from '../utils/assets';
import { play } from '../utils/sfx';

const Ico = ({ id }) => <img src={asset(`/assets/icons/${id}.webp`)} alt="" />;
// Window grows from the clicked icon (FLIP: icon rect → window rect), overshoots slightly, then reveals content.
export default function PortfolioWindow({ id, origin, onNav, onClosed }) {
  const sec = sections.find((s) => s.id === id), el = useRef(), [filter, setFilter] = useState('ALL'), [shown, setShown] = useState(false), [closing, setClosing] = useState(false);
  const flip = (reverse, done) => { const w = el.current, r = w.getBoundingClientRect(); if (!origin || reducedMotion()) return done();
    const dx = origin.left + origin.width / 2 - (r.left + r.width / 2), dy = origin.top + origin.height / 2 - (r.top + r.height / 2);
    const from = `translate(${dx}px,${dy}px) scale(${origin.width / r.width},${origin.height / r.height})`;
    const a = w.animate(reverse ? [{ transform: 'none', opacity: 1 }, { transform: from, opacity: 0 }] : [{ transform: from, opacity: 0 }, { opacity: 1, offset: 0.25 }, { transform: 'none', opacity: 1 }],
      { duration: reverse ? 520 : 820, easing: reverse ? 'cubic-bezier(.6,0,.9,.4)' : 'cubic-bezier(.2,1.15,.3,1)', fill: 'both' }); a.onfinish = done; };
  useLayoutEffect(() => { flip(false, () => setShown(true)); }, []);
  useEffect(() => { setFilter('ALL'); el.current?.querySelector('.wbody')?.scrollTo(0, 0); }, [id]);
  const close = () => { if (closing) return; play('close'); setClosing(true); setShown(false); flip(true, onClosed); };
  useEffect(() => { const k = (e) => e.key === 'Escape' && close(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); });
  useEffect(() => { el.current.querySelector('.wclose').focus(); }, []);
  const ptr = (e) => { const w = el.current, r = w.getBoundingClientRect(); w.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); w.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3)); };
  return (<div className={'wrap' + (closing ? ' closing' : '')}>
    <img className="deco deco-br" src={asset('/assets/ui/back-right.webp')} alt="" draggable="false" />
    <div className={'win' + (shown ? ' shown' : '')} ref={el} role="dialog" aria-modal="true" aria-label={sec.title} onPointerMove={ptr}
    style={{ backgroundImage: `url(${asset('/assets/ui/main-window.webp')})` }}>
    <div className="wtab"><Ico id={id} /><b>{sec.label.toUpperCase()}</b></div>
    <div className="wctl"><button aria-label="Minimise (closes)" onClick={close}>–</button><button aria-label="Maximise" tabIndex={-1}>▢</button><button className="wclose" aria-label="Close window and return to desktop" onClick={close}>✕</button></div>
    <div className="wbody">
      <header className="whead"><Ico id={id} /><div><h2>{sec.title}</h2>{sec.sub.map((l, i) => <p key={i}>{l}</p>)}</div></header>
      <div className="wmain">
        <nav className="side" aria-label="Sections">
          {sections.map((s) => { const here = s.id === id, open = here && shown; return (<div className="grp" key={s.id}>
            <button className={here ? 'on' : ''} onClick={() => (here ? setFilter('ALL') : onNav(s.id))} aria-current={here ? 'page' : undefined} aria-expanded={s.filters ? open : undefined}><Ico id={s.id} />{s.label.toUpperCase()}{s.filters && <i className="chev" />}</button>
            {s.filters && <div className={'sub' + (open ? ' open' : '')} aria-hidden={!open}><div className="subin" role="group" aria-label={`${s.label} categories`}>
              {s.filters.map((f, k) => <button key={f} style={{ '--k': k }} tabIndex={open ? 0 : -1} data-sfx="tick" className={f === filter ? 'on' : ''} onClick={() => setFilter(f)} aria-pressed={f === filter}>{f}</button>)}</div></div>}
          </div>); })}
        </nav>
        <div className="content"><Section id={id} filter={filter} /></div>
      </div>
      <button className="esc" onClick={close}>‹ ESC / CLOSE</button>
    </div></div>
    <img className="deco deco-fl" src={asset('/assets/ui/front-left.webp')} alt="" draggable="false" />
  </div>);
}
