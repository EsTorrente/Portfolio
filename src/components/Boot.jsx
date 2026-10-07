import { useEffect, useRef, useState } from 'react';
import { about } from '../data/siteData';
import { asset, reducedMotion } from '../utils/assets';
import { play } from '../utils/sfx';
import '../styles/boot.css';

// "Boot-up" scene that plays once after the loading screen: a little terminal introduces Mar, Deercat and Mar chat, then the desktop becomes usable.
// Skip at any moment: tap / click anywhere, any key, Esc or the SKIP button. Everything you may want to edit is in this block ✏️
const TIMES = { // when (ms after start) each part appears
  panel: 450, id: 600, found: 1300, name: 1850, role: 2450, skills: 3050, multi: 3450,
  chat: [4300, 5050, 5700, 6350], ready: 7000, end: 7900,
};
const CHAT = [['DEERCAT', '...That sounds complicated.'], ['MAR', "It's fine."], ['DEERCAT', 'Is it?'], ['MAR', '...Usually.']];
const TEXT = {
  id: 'IDENTIFYING USER...', found: 'USER FOUND.', name: 'MAR TORRENTE', role: 'ENGINEER IN DIGITAL ENTERTAINMENT DESIGN',
  skills: '3D ART · ANIMATION · RIGGING · PROGRAMMING · INTERACTIVE EXPERIENCES', multi: 'MULTIDISCIPLINARY USER DETECTED.', ready: 'WORLD READY.',
};

function Typed({ text, on, speed = 24 }) { // types the text letter by letter once `on` turns true (the full text is always in the DOM for screen readers)
  const [n, setN] = useState(0);
  useEffect(() => { if (!on) return; let i = 0; const t = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(t); }, speed); return () => clearInterval(t); }, [on]);
  return <><span aria-hidden="true">{text.slice(0, n)}</span><span className="sr">{text}</span></>;
}

export default function Boot({ onDone }) {
  const [t, setT] = useState(0), [out, setOut] = useState(false), done = useRef(false), calm = reducedMotion();
  const avatars = about.more?.avatars || {};
  const finish = () => { if (done.current) return; done.current = true; setOut(true); setTimeout(onDone, 380); };
  useEffect(() => { const t0 = performance.now(), i = setInterval(() => { const e = performance.now() - t0; setT(e); if (e >= TIMES.end) { clearInterval(i); finish(); } }, 80); return () => clearInterval(i); }, []);
  useEffect(() => { const k = () => finish(); addEventListener('keydown', k, true); return () => removeEventListener('keydown', k, true); }, []);
  const seen = (ms) => t >= ms, chatN = TIMES.chat.filter((ms) => t >= ms).length;
  const last = useRef(0); useEffect(() => { const n = [TIMES.id, TIMES.found, TIMES.name, TIMES.role, TIMES.multi, ...TIMES.chat].filter((ms) => t >= ms).length; if (n > last.current) { last.current = n; play('tick'); } }, [t]);
  useEffect(() => { if (seen(TIMES.ready)) play('open'); }, [t >= TIMES.ready]);
  return (<div className={'boot' + (out ? ' out' : '') + (seen(TIMES.panel) ? ' lit' : '') + (calm ? ' calm' : '')} role="dialog" aria-label="Welcome" onPointerDown={finish}>
    <div className="boot-screen">
      <i className="bc bc1" /><i className="bc bc2" /><i className="bc bc3" /><i className="bc bc4" />
      <p className="b-id"><Typed text={TEXT.id} on={seen(TIMES.id)} speed={30} /></p>
      <p className="b-found">{seen(TIMES.found) && <>&gt; <b><Typed text={TEXT.found} on speed={34} /></b></>}</p>
      <h1 className={'b-name' + (seen(TIMES.name) ? ' on' : '')} aria-label={TEXT.name}>{TEXT.name}</h1>
      <p className="b-role"><Typed text={TEXT.role} on={seen(TIMES.role)} speed={14} /></p>
      <div className={'b-rule' + (seen(TIMES.skills) ? ' on' : '')} />
      <p className={'b-skills' + (seen(TIMES.skills) ? ' on' : '')}>{TEXT.skills}</p>
      <div className={'b-rule' + (seen(TIMES.skills) ? ' on' : '')} />
      <p className="b-multi"><Typed text={TEXT.multi} on={seen(TIMES.multi)} speed={22} /></p>
      <ol className="b-chat" aria-label="Deercat and Mar">{CHAT.map(([who, line], i) => (
        <li key={i} className={(who === 'MAR' ? 'mar' : 'deer') + (i < chatN ? ' on' : '')}>
          <span className="av" aria-hidden="true">{who[0]}{avatars[who] && <img src={asset(avatars[who])} alt="" draggable="false" onError={(e) => (e.currentTarget.style.display = 'none')} />}</span>
          <span className="who">{who}</span><span className="say">{line}</span></li>))}</ol>
      <p className={'b-ready' + (seen(TIMES.ready) ? ' on' : '')}>&gt; {TEXT.ready}<i className="cur" /></p>
    </div>
    <button className="b-skip" onClick={(e) => { e.stopPropagation(); finish(); }} data-sfx="none">SKIP ›</button>
  </div>);
}
