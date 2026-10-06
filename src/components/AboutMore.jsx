import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { asset } from '../utils/assets';
import { play } from '../utils/sfx';
const rich = (t) => t.split('**').map((s, j) => (j % 2 ? <strong key={j}>{s}</strong> : s)); // **bold**
function Bubble({ who, text, i, av }) { // each chat bubble pops in when it scrolls into view
  const ref = useRef();
  useEffect(() => { const el = ref.current, o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); o.disconnect(); } }, { threshold: 0.4 }); o.observe(el); return () => o.disconnect(); }, []);
  return (<li ref={ref} className={who === 'MAR' ? 'mar' : 'deer'}>
    <span className="av" aria-hidden="true">{av ? <img src={asset(av)} alt="" draggable="false" /> : who[0]}</span>
    <div className="bub"><b>{who}</b><p>{text}</p></div></li>);
}
// "Tell me more" pop-up of the About section. All text lives in src/data/siteData.js → about.more
export default function AboutMore({ more, onClose }) {
  const box = useRef();
  useEffect(() => { play('viewer'); box.current?.focus(); const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }; addEventListener('keydown', k, true); return () => removeEventListener('keydown', k, true); }, []);
  return createPortal(<div className="am" role="dialog" aria-modal="true" aria-label={more.title} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <article className="am-win" ref={box} tabIndex={-1}>
      <button className="am-x" onClick={onClose} aria-label="Close" data-sfx="tick">✕</button>
      <h2>{more.title}</h2>
      {more.blocks.map((b, i) => (typeof b === 'string' ? <p key={i}>{rich(b)}</p> : <p key={i} className="am-quote">{rich(b.quote)}</p>))}
      <h2 className="am-h2">{more.chatTitle}</h2><p className="am-lead">{rich(more.chatIntro)}</p>
      <ol className="chat" aria-label="A little chat between Deercat and Mar">{more.chat.map(([who, text], i) => <Bubble key={i} i={i} who={who} text={text} av={more.avatars?.[who]} />)}</ol>
      <h2 className="am-h2">{more.closingTitle}</h2>
      {more.closing.map((t, i) => <p key={i}>{rich(t)}</p>)}
      <button className="px-btn am-back" onClick={onClose} data-sfx="tick">{more.closeButton}</button>
    </article></div>, document.body);
}
