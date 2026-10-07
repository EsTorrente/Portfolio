import { useEffect, useRef, useState } from 'react';
import { about } from '../data/siteData';
import { asset, reducedMotion } from '../utils/assets';
import { play } from '../utils/sfx';
import '../styles/boot.css';

// "Boot-up" scene that plays once after the loading screen: a little terminal introduces Mar, Deercat and Mar chat, then the desktop becomes usable.
// It waits for the visitor: a tap / key while it's still typing shows everything at once; after that a tap / key / the ENTER button closes it. The SKIP button and Esc close it immediately. ✏️ Edit the text and timing below.
const TIMES = { // when (ms after start) each part appears
  panel: 450, id: 600, found: 1300, name: 1850, role: 2450, skills: 3050, multi: 3450,
  chat: [4300, 5050, 5700, 6350], ready: 7000, end: 7500, // `end` = when the scene counts as complete (it then waits for the visitor)
};
const CHAT = [['DEERCAT', '...That sounds complicated.'], ['MAR', "It's fine."], ['DEERCAT', 'Is it?'], ['MAR', '...Usually.']];
const TEXT = {
  id: 'IDENTIFYING USER...', found: 'USER FOUND.', name: 'MAR TORRENTE', role: 'DIGITAL ENTERTAINMENT DESIGN ENGINEER',
  skills: '3D ART · ANIMATION · RIGGING · PROGRAMMING · INTERACTIVE EXPERIENCES', multi: 'MULTIDISCIPLINARY USER DETECTED.', ready: 'WORLD READY.',
};

function Typed({ text, on, speed = 24, instant = false }) { // types the text letter by letter once `on` turns true (the full text is always in the DOM for screen readers)
  const [n, setN] = useState(0);
  useEffect(() => { if (!on) return; let i = 0; const t = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(t); }, speed); return () => clearInterval(t); }, [on]);
  return <><span aria-hidden="true">{instant ? text : text.slice(0, n)}</span><span className="sr">{text}</span></>;
}

export default function Boot({ onDone }) {
  const [t, setT] = useState(0), [out, setOut] = useState(false), [ff, setFf] = useState(false), done = useRef(false), calm = reducedMotion(), complete = ff || t >= TIMES.end;
  const avatars = about.more?.avatars || {};
  const finish = () => { if (done.current) return; done.current = true; setOut(true); setTimeout(onDone, 380); };
  useEffect(() => { const t0 = performance.now(), i = setInterval(() => { const e = performance.now() - t0; setT(e); if (e >= TIMES.end) clearInterval(i); }, 80); return () => clearInterval(i); }, []); // stops at the end and waits
  const advance = () => { if (complete) finish(); else { setFf(true); setT(TIMES.end + 1); } }; // 1st tap: show everything · 2nd tap: enter
  const adv = useRef(); adv.current = advance;
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') finish(); else if (!e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); adv.current(); } }; addEventListener('keydown', k, true); return () => removeEventListener('keydown', k, true); }, []);
  const seen = (ms) => t >= ms, chatN = TIMES.chat.filter((ms) => t >= ms).length;
  // a different little sound for each step (defined in utils/sfx.js). If everything is revealed at once (visitor tapped to fast-forward) only the last one plays.
  const played = useRef(new Set());
  useEffect(() => { const ev = [[TIMES.id, 'bootId'], [TIMES.found, 'bootFound'], [TIMES.name, 'bootName'], [TIMES.role, 'bootRole'], [TIMES.multi, 'bootMulti'], [TIMES.chat[0], 'chatDeer'], [TIMES.chat[1], 'chatMar'], [TIMES.chat[2], 'chatDeer'], [TIMES.chat[3], 'chatMar'], [TIMES.ready, 'bootReady']];
    const fresh = ev.filter(([ms]) => t >= ms && !played.current.has(ms)); fresh.forEach(([ms]) => played.current.add(ms)); if (fresh.length) play(fresh[fresh.length - 1][1]); }, [t]);
  return (<div className={'boot' + (out ? ' out' : '') + (seen(TIMES.panel) ? ' lit' : '') + (calm ? ' calm' : '')} role="dialog" aria-label="Welcome" onPointerDown={advance}>
    <div className="boot-screen">
      <i className="bc bc1" /><i className="bc bc2" /><i className="bc bc3" /><i className="bc bc4" />
      <p className="b-id"><Typed text={TEXT.id} on={seen(TIMES.id)} speed={30} instant={ff} /></p>
      <p className="b-found">{seen(TIMES.found) && <>&gt; <b><Typed text={TEXT.found} on speed={34} instant={ff} /></b></>}</p>
      <h1 className={'b-name' + (seen(TIMES.name) ? ' on' : '')} aria-label={TEXT.name}>{TEXT.name}</h1>
      <p className="b-role"><Typed text={TEXT.role} on={seen(TIMES.role)} speed={14} instant={ff} /></p>
      <div className={'b-rule' + (seen(TIMES.skills) ? ' on' : '')} />
      <p className={'b-skills' + (seen(TIMES.skills) ? ' on' : '')}>{TEXT.skills}</p>
      <div className={'b-rule' + (seen(TIMES.skills) ? ' on' : '')} />
      <p className="b-multi"><Typed text={TEXT.multi} on={seen(TIMES.multi)} speed={22} instant={ff} /></p>
      <ol className="b-chat" aria-label="Deercat and Mar">{CHAT.map(([who, line], i) => (
        <li key={i} className={(who === 'MAR' ? 'mar' : 'deer') + (i < chatN ? ' on' : '')}>
          <span className="av" aria-hidden="true">{who[0]}{avatars[who] && <img src={asset(avatars[who])} alt="" draggable="false" onError={(e) => (e.currentTarget.style.display = 'none')} />}</span>
          <span className="who">{who}</span><span className="say">{line}</span></li>))}</ol>
      <p className={'b-ready' + (seen(TIMES.ready) ? ' on' : '')}>&gt; {TEXT.ready}<i className="cur" /></p>
      <p className={'b-hint' + (complete ? ' on' : '')}>TAP ANYWHERE OR PRESS ANY KEY TO ENTER</p>
    </div>
    <button className="b-skip" onClick={(e) => { e.stopPropagation(); finish(); }} data-sfx="none">{complete ? 'ENTER ›' : 'SKIP ›'}</button>
  </div>);
}
