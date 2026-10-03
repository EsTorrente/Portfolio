import { useEffect, useRef } from 'react';
import Media from './Media';
import { asset } from '../utils/assets';
// Full-screen dark gallery overlay. Esc closes, ←/→ navigates. Never crops.
export default function MediaViewer({ items, index, onClose, onIndex }) {
  const it = items[index], ref = useRef(); const prev = useRef();
  useEffect(() => { prev.current = document.activeElement; ref.current?.focus();
    const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } if (e.key === 'ArrowRight') onIndex((index + 1) % items.length); if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length); };
    addEventListener('keydown', k, true); return () => { removeEventListener('keydown', k, true); prev.current?.focus?.(); }; }, [index, items.length]);
  return (<div className="viewer" role="dialog" aria-modal="true" aria-label={it.title} ref={ref} tabIndex={-1} onClick={onClose}>
    <div className="viewer-stage" onClick={(e) => e.stopPropagation()}>
      {it.video ? <video src={asset(it.video)} poster={asset(it.image)} controls autoPlay loop playsInline /> : <Media src={it.image} alt={it.title} label={it.title} ratio={1.4} className="viewer-img" />}
      <div className="viewer-cap"><b>{it.title}</b>{it.description && <span>{it.description}</span>}</div>
    </div>
    <button className="vbtn vclose" aria-label="Close viewer" onClick={onClose}>✕</button>
    {items.length > 1 && <><button className="vbtn vprev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}>‹</button>
      <button className="vbtn vnext" aria-label="Next" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}>›</button></>}
  </div>);
}
