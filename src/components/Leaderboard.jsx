import { useEffect, useState } from 'react';
import { EMOJI, GAMES, getTag, loadBoard, saveTag, submitScore } from '../utils/leaderboard';
import { play } from '../utils/sfx';

// Panel that sits on top of a mini-game: pick your 3-emoji tag, post your score, see the top 10.
export default function Leaderboard({ game, score = null, onSaved, onClose }) {
  const G = GAMES[game], [tag, setTag] = useState(getTag), [board, setBoard] = useState(null), [mine, setMine] = useState(null), [busy, setBusy] = useState(false), [edit, setEdit] = useState(getTag().length < 3);
  useEffect(() => { let off = false; loadBoard(game).then((b) => !off && setBoard(b)); return () => { off = true; }; }, [game]);
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }; addEventListener('keydown', k, true); return () => removeEventListener('keydown', k, true); }, []);
  const pick = (e) => { if (tag.length < 3) { play('tick'); setTag([...tag, e]); } };
  const post = async () => { setBusy(true); saveTag(tag); const b = await submitScore(game, tag, score); setBoard(b); setMine(b.tag); setBusy(false); onSaved?.(); play('open'); };
  const posting = score != null && !mine;
  return (<div className="lb" role="dialog" aria-label={`${G.name} leaderboard`} onClick={(e) => e.stopPropagation()}>
    <header><b>🏆 {G.name}</b><button onClick={onClose} aria-label="Close leaderboard" data-sfx="none">✕</button></header>
    {posting && <section className="lb-post">
      <p>YOUR SCORE <strong>{score} {G.unit}</strong></p>
      {edit ? (<><div className="lb-slots" aria-label="Your emoji tag">{[0, 1, 2].map((i) => <span key={i} className={tag[i] ? 'on' : ''}>{tag[i] || '?'}</span>)}<button onClick={() => setTag(tag.slice(0, -1))} aria-label="Delete last emoji" disabled={!tag.length} data-sfx="none">⌫</button></div>
        <div className="lb-pick">{EMOJI.map((e) => <button key={e} onClick={() => pick(e)} disabled={tag.length >= 3} aria-label={e} data-sfx="none">{e}</button>)}</div></>)
        : (<p className="lb-as">POSTING AS <span>{tag.join(' ')}</span> <button className="lb-link" onClick={() => { setTag([]); setEdit(true); }}>change</button></p>)}
      <button className="px-btn" disabled={tag.length < 3 || busy} onClick={post}>{busy ? 'SAVING…' : 'POST SCORE'}</button></section>}
    <ol className="lb-list">{!board ? <li className="lb-empty">LOADING…</li> : board.rows.length ? board.rows.map((r, i) => (
      <li key={r.tag} className={r.tag === (mine || tag.join('')) && (mine || !posting) ? 'me' : ''}><i>{i + 1}</i><span>{r.tag}</span><b>{r.score} <small>{G.unit}</small></b></li>)) : <li className="lb-empty">NO SCORES YET — BE THE FIRST!</li>}</ol>
    <small className="lb-note">{board?.global ? 'SHARED BOARD · EVERYONE SEES THESE' : 'SAVED ON THIS DEVICE ONLY'}</small>
  </div>);
}
