import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Media from './Media';
import Zoom from './Zoom';
import { asset } from '../utils/assets';
import { play } from '../utils/sfx';
// Full-screen dark gallery overlay. Esc closes, ←/→ navigates. Never crops.
function MediaViewerInner({ items, index, onClose, onIndex }) {
  const it = items[index], ref = useRef(); const prev = useRef();
  useEffect(() => { play('viewer'); }, []);
  useEffect(() => { prev.current = document.activeElement; ref.current?.focus();
    const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } if (e.key === 'ArrowRight') onIndex((index + 1) % items.length); if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length); };
    addEventListener('keydown', k, true); return () => { removeEventListener('keydown', k, true); prev.current?.focus?.(); }; }, [index, items.length]);
  return (<div className="viewer" role="dialog" aria-modal="true" aria-label={it.title} ref={ref} tabIndex={-1} onClick={onClose}>
    <div className="viewer-stage" onClick={(e) => e.stopPropagation()}>
      {it.video ? <video src={asset(it.video)} poster={asset(it.image)} controls autoPlay loop playsInline /> : <Zoom resetKey={it.image}><Media src={it.image} alt={it.title} label={it.title} ratio={1.4} className="viewer-img" /></Zoom>}
      <div className="viewer-cap"><b>{it.title}</b>{it.description && <span>{it.description}</span>}</div>
    </div>
    <button className="vbtn vclose" aria-label="Close viewer" onClick={onClose}>✕</button>
    {items.length > 1 && <><button className="vbtn vprev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}>‹</button>
      <button className="vbtn vnext" aria-label="Next" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}>›</button></>}
  </div>);
}

// Portal into <body> so the overlay covers the whole screen on desktop (the window it opens from is tilted + filtered, which would otherwise trap a "fixed" element inside it).
export default function MediaViewer(props) { return createPortal(<MediaViewerInner {...props} />, document.body); }
