import { Suspense, lazy, useEffect, useRef } from 'react';
import { play } from '../utils/sfx';
const GAMES = { // title shown in the little window's title bar
  catman: { title: 'CAT-MAN.EXE', C: lazy(() => import('../games/CatMan')) },
  typecat: { title: 'TYPE-A-CAT.EXE', C: lazy(() => import('../games/TypeCat')) },
  maskmatch: { title: 'MASK-MATCH.EXE', C: lazy(() => import('../games/MaskMatch')) },
};
// Shared retro window for the three mini-games. Esc / ✕ / clicking outside closes it.
export default function Arcade({ game, onClose }) {
  const g = GAMES[game], box = useRef(), close = () => { play('close'); onClose(); };
  const closeRef = useRef(close); closeRef.current = close;
  useEffect(() => { const k = (e) => e.key === 'Escape' && closeRef.current(); addEventListener('keydown', k); const b = box.current; if (b && !b.contains(document.activeElement)) b.focus(); return () => removeEventListener('keydown', k); }, []); // focus only on open, so it never steals focus from a game's own input
  return (<div className="arc" role="dialog" aria-modal="true" aria-label={g.title} onPointerDown={(e) => e.target === e.currentTarget && close()}>
    <div className="arc-win" ref={box} tabIndex={-1}>
      <div className="arc-bar"><span>★ {g.title}</span><button onClick={close} aria-label="Close game" data-sfx="none">✕</button></div>
      <div className="arc-body"><Suspense fallback={<p className="arc-load">LOADING…</p>}><g.C /></Suspense></div></div></div>);
}
