import { useEffect, useRef, useState } from 'react';
import Media from './Media';
import { asset } from '../utils/assets';

// Project pop-up: video player + video list on the left, full write-up on the right. Esc closes, ←/→ switch project.
// Content comes from `item.details` / `item.videos` in data/portfolioData.js.

function Slate({ n, title }) { // shown when a video file doesn't exist yet
  return (<div className="pv-slate" role="img" aria-label={`Video ${n}: ${title} (coming soon)`}>
    <b>▶</b><span>VIDEO {String(n).padStart(2, '0')}</span><strong>{title}</strong><em>coming soon</em></div>);
}

function Player({ item, cur }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [cur, item.id]);
  const v = item.videos?.[cur];
  if (!v) return <Media src={item.image} alt={item.title} label={item.title} ratio={1.6} className="pv-hero" />;
  if (bad) return <Slate n={cur + 1} title={v.title} />;
  return <video key={v.src} className="pv-video" src={asset(v.src)} poster={asset(item.image)} controls autoPlay loop muted playsInline onError={() => setBad(true)} />;
}

function Blocks({ blocks }) {
  return blocks.map((b, i) => (<section key={i} className="pv-block">
    {b.h && <h4>{b.h}</h4>}
    {b.p && <p>{b.p}</p>}
    {b.ul && <ul>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>}
    {b.after && <p>{b.after}</p>}
    {b.rgb && <div className="pv-rgb">{b.rgb.map(([c, l, col]) => <span key={c}><i style={{ background: col }} />{c} <b>→</b> {l}</span>)}</div>}
    {b.after2 && <p>{b.after2}</p>}
  </section>));
}

export default function ProjectViewer({ items, index, onClose, onIndex }) {
  const it = items[index], d = it.details || {}, ref = useRef(), prev = useRef(), body = useRef();
  const [cur, setCur] = useState(0);
  useEffect(() => { setCur(0); body.current?.scrollTo(0, 0); }, [index]);
  useEffect(() => {
    prev.current = document.activeElement; ref.current?.focus();
    const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'ArrowRight' && items.length > 1) onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft' && items.length > 1) onIndex((index - 1 + items.length) % items.length); };
    addEventListener('keydown', k, true); return () => { removeEventListener('keydown', k, true); prev.current?.focus?.(); };
  }, [index, items.length]);
  const vids = it.videos || [];
  return (<div className="viewer pv" role="dialog" aria-modal="true" aria-label={it.title} ref={ref} tabIndex={-1} onClick={onClose}>
    <div className="pv-panel" onClick={(e) => e.stopPropagation()}>
      <div className="pv-media">
        <div className="pv-stage"><Player item={it} cur={cur} /></div>
        {vids.length > 0 && (<ol className="pv-list" aria-label="Videos">{vids.map((v, i) => (
          <li key={v.src}><button className={i === cur ? 'on' : ''} onClick={() => setCur(i)} aria-current={i === cur}><span>{String(i + 1).padStart(2, '0')}</span>{v.title}</button></li>))}</ol>)}
      </div>
      <div className="pv-text" ref={body}>
        <header><small>{it.subtitle}</small><h3>{it.title}</h3></header>
        {(d.intro || [it.description]).map((p, i) => <p key={i} className="pv-intro">{p}</p>)}
        {d.blocks && <Blocks blocks={d.blocks} />}
        {d.note && <p className="pv-note"><b>Note</b> {d.note}</p>}
        {it.tags && <div className="tags">{it.tags.map((t) => <span key={t}>{t}</span>)}</div>}
      </div>
    </div>
    <button className="vbtn vclose" aria-label="Close" onClick={onClose}>✕</button>
    {items.length > 1 && <><button className="vbtn vprev" aria-label="Previous project" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}>‹</button>
      <button className="vbtn vnext" aria-label="Next project" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}>›</button></>}
  </div>);
}
