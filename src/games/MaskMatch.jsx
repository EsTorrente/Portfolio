import { useEffect, useMemo, useRef, useState } from 'react';
import { catSprite, dataUrl, pawSprite } from './pixel';
import { play } from '../utils/sfx';
import Leaderboard from '../components/Leaderboard';
// MASK MATCH — memory game (flip two cards, find all 8 pairs of cat masks). Best moves are remembered.
const N = 8, deal = () => [...Array(N).keys(), ...Array(N).keys()].sort(() => Math.random() - 0.5).map((v) => ({ v, up: false, ok: false }));
const best = () => +localStorage.getItem('mar-mask-best') || 0;
export default function MaskMatch() {
  const [cards, setCards] = useState(deal), [moves, setMoves] = useState(0), [time, setTime] = useState(0), [run, setRun] = useState(false), lock = useRef(false), [lb, setLb] = useState(false), [pend, setPend] = useState(null);
  const faces = useMemo(() => Array.from({ length: N }, (_, i) => dataUrl(catSprite(i, 7))), []), back = useMemo(() => dataUrl(pawSprite(6)), []);
  const won = cards.every((c) => c.ok);
  useEffect(() => { if (!run || won) return; const i = setInterval(() => setTime((t) => t + 1), 1000); return () => clearInterval(i); }, [run, won]);
  useEffect(() => { if (!won) return; setRun(false); play('open'); if (!best() || moves < best()) localStorage.setItem('mar-mask-best', moves); setPend(moves); }, [won]);
  const flip = (i) => { const c = cards[i]; if (lock.current || c.up || c.ok) return; play('tick'); setRun(true);
    const next = cards.map((x, k) => (k === i ? { ...x, up: true } : x)), up = next.map((x, k) => (x.up && !x.ok ? k : -1)).filter((k) => k >= 0); setCards(next);
    if (up.length < 2) return; setMoves((m) => m + 1); const [a, b] = up;
    if (next[a].v === next[b].v) { play('viewer'); lock.current = true; setTimeout(() => { setCards((cs) => cs.map((x, k) => (k === a || k === b ? { ...x, ok: true } : x))); lock.current = false; }, 350); }
    else { lock.current = true; setTimeout(() => { setCards((cs) => cs.map((x, k) => (k === a || k === b ? { ...x, up: false } : x))); lock.current = false; }, 800); } };
  const again = () => { setCards(deal()); setMoves(0); setTime(0); setRun(false); setPend(null); lock.current = false; };
  return (<div className={'mm' + (lb ? ' lb-on' : '')}>
    <div className="arc-hud"><span>MOVES {moves}</span><span>TIME {time}s</span><span>BEST {best() || '-'}</span><button className="lb-btn" onClick={() => setLb(true)} aria-label="Leaderboard" data-sfx="none">🏆</button></div>
    <div className="mm-grid" role="group" aria-label="Memory cards">{cards.map((c, i) => (
      <button key={i} className={'mm-card' + (c.up || c.ok ? ' up' : '') + (c.ok ? ' ok' : '')} onClick={() => flip(i)} aria-label={c.up || c.ok ? `Cat mask ${c.v + 1}` : 'Hidden card'} data-sfx="none">
        <span className="in"><img className="bk" src={back} alt="" draggable="false" /><img className="fr" src={faces[c.v]} alt="" draggable="false" /></span></button>))}</div>
    {won && <div className="arc-msg">ALL MASKS FOUND!<br />{moves} MOVES · {time}s<button className="px-btn" onClick={() => setLb(true)}>🏆 SAVE SCORE</button><button className="px-btn" onClick={again}>PLAY AGAIN</button></div>}
    {lb && <Leaderboard game="maskmatch" score={pend} onSaved={() => setPend(null)} onClose={() => setLb(false)} />}</div>);
}
