import { useEffect, useMemo, useRef, useState } from 'react';
import { catSprite, dataUrl } from './pixel';
import { play } from '../utils/sfx';
import Leaderboard from '../components/Leaderboard';
// TYPE-A-CAT — typing speed test (same idea as the classic: 60 s, mistakes, WPM, CPM; Backspace fixes a letter).
const TEXTS = [
  'The little cat sat by the window and watched the rain paint silver lines on the glass. Every few seconds her tail flicked, as if she were counting the drops.',
  'At midnight the old computer began to hum. A tiny deer-cat stretched, yawned, and pressed one soft paw on the keyboard to see what dreams were waiting inside.',
  'Cats do not chase mice because they are hungry. They chase them because a moving shadow is a question, and every curious cat believes in answering questions.',
  'In the dream world, drawings became places and ideas grew legs. The cat collected them all in a very old box and promised to keep every unfinished thing safe.',
  'Somewhere between a nap and an adventure there is a warm sunny spot on the floor. The wise cat knows it by heart and visits it exactly seven times a day.',
];
const TIME = 60, best = () => +localStorage.getItem('mar-typecat-best') || 0;
const typeCh = (g, text, ch) => { if (g.phase === 'done' || g.idx >= text.length) return g; const ok = ch === text[g.idx], st = [...g.st]; st[g.idx] = ok ? 'ok' : 'bad'; const idx = g.idx + 1; return { ...g, st, idx, mist: g.mist + (ok ? 0 : 1), phase: idx >= text.length ? 'done' : 'run' }; };
const back = (g) => { if (g.phase === 'done' || !g.idx) return g; const i = g.idx - 1, st = [...g.st], bad = st[i] === 'bad'; st[i] = ''; return { ...g, st, idx: i, mist: g.mist - (bad ? 1 : 0) }; };
const fresh = () => { const text = TEXTS[Math.floor(Math.random() * TEXTS.length)]; return { text, idx: 0, st: Array(text.length).fill(''), mist: 0, phase: 'idle', left: TIME }; };

export default function TypeCat() {
  const [g, setG] = useState(fresh), [lb, setLb] = useState(false), [pend, setPend] = useState(null), inp = useRef(), cat = useMemo(() => dataUrl(catSprite(0, 5)), []);
  useEffect(() => { inp.current?.focus(); }, [g.text]);
  useEffect(() => { const el = inp.current, bi = (e) => { e.preventDefault(); if (e.inputType === 'deleteContentBackward') setG(back); else if (e.data) { [...e.data].forEach((c) => setG((s) => typeCh(s, s.text, c))); play('hover'); } };
    const kd = (e) => { if (e.key === 'Backspace') { e.preventDefault(); setG(back); } else if (e.key === 'Tab') e.preventDefault(); };
    const grab = (e) => { if (document.activeElement !== el && !e.ctrlKey && !e.metaKey && e.key !== 'Escape') el.focus(); }; // typing anywhere in the window goes to the game
    el.addEventListener('beforeinput', bi); el.addEventListener('keydown', kd); addEventListener('keydown', grab, true); const t = setTimeout(() => el.focus(), 60);
    return () => { clearTimeout(t); el.removeEventListener('beforeinput', bi); el.removeEventListener('keydown', kd); removeEventListener('keydown', grab, true); }; }, []);
  useEffect(() => { if (g.phase !== 'run') return; const i = setInterval(() => setG((s) => (s.phase !== 'run' ? s : s.left <= 1 ? { ...s, left: 0, phase: 'done' } : { ...s, left: s.left - 1 })), 1000); return () => clearInterval(i); }, [g.phase === 'run']);
  const el = TIME - g.left, cpm = Math.max(0, g.idx - g.mist), wpm = el > 0 ? Math.round((cpm / 5) / (el / 60)) : 0;
  useEffect(() => { if (g.phase === 'done' && wpm > best()) localStorage.setItem('mar-typecat-best', wpm); if (g.phase === 'done') { play(g.idx >= g.text.length ? 'open' : 'close'); setPend(wpm > 0 ? wpm : null); } }, [g.phase]);
  const title = wpm < 20 ? 'SLEEPY KITTEN' : wpm < 40 ? 'CURIOUS CAT' : wpm < 60 ? 'SWIFT TABBY' : 'KEYBOARD PANTHER';
  return (<div className={'tc' + (lb ? ' lb-on' : '')} onClick={() => !lb && inp.current.focus()}>
    <div className="tc-stats"><span>TIME <b>{g.left}s</b></span><span>MISTAKES <b>{g.mist}</b></span><span>WPM <b>{wpm}</b></span><span>CPM <b>{cpm}</b></span><button className="lb-btn" onClick={(e) => { e.stopPropagation(); setLb(true); }} aria-label="Leaderboard" data-sfx="none">🏆</button></div>
    <div className="tc-box"><img key={g.idx} className="tc-cat" src={cat} alt="" draggable="false" />
      <p aria-label={g.text}>{[...g.text].map((c, i) => <span key={i} className={g.st[i] + (i === g.idx && g.phase !== 'done' ? ' cur' : '')}>{c}</span>)}</p>
      {g.phase === 'idle' && <small className="tc-hint">CLICK HERE AND START TYPING ▸</small>}
      <input ref={inp} className="tc-in" aria-label="Type the text here" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
      {g.phase === 'done' && <div className="arc-msg">{g.idx >= g.text.length ? 'PURRFECT!' : "TIME'S UP!"}<br />{title}<br />{wpm} WPM · {cpm} CPM · {g.mist} MISTAKES<br /><small>BEST {Math.max(best(), wpm)} WPM</small>
        <button className="px-btn" onClick={(e) => { e.stopPropagation(); setLb(true); }}>🏆 SAVE SCORE</button>
        <button className="px-btn" onClick={(e) => { e.stopPropagation(); setPend(null); setG(fresh()); }}>TRY AGAIN</button></div>}</div>
    {lb && <Leaderboard game="typecat" score={pend} onSaved={() => setPend(null)} onClose={() => { setLb(false); inp.current?.focus(); }} />}</div>);
}
