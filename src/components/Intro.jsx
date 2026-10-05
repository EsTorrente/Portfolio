import { useEffect, useRef, useState } from 'react';
import { site } from '../data/siteData';
import { STORY, STORY_STEP_SECONDS } from '../data/introStory';
import { asset } from '../utils/assets';
import { play } from '../utils/sfx';

const BG = '/assets/ui/LoadingBG.webp'; // ✏️ loading-screen background
const N = 15, C = 20; // board is N×N cells
const KEYS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };

// Tiny snake for the loading screen: arrow keys / WASD, swipe on the board, or the on-screen pad on touch devices. Walls wrap around; only biting yourself ends the game.
function Snake({ onPlay }) {
  const cv = useRef(), api = useRef({}), [score, setScore] = useState(0), [best, setBest] = useState(0), [state, setState] = useState('ready');
  useEffect(() => {
    const el = cv.current, x = el.getContext('2d'); el.width = el.height = N * C;
    let snake, dir, next, food, timer, sc = 0, status = 'ready', bestSc = 0, played = false;
    const rnd = () => Math.floor(Math.random() * N);
    const spawn = () => { do { food = { x: rnd(), y: rnd() }; } while (snake.some((s) => s.x === food.x && s.y === food.y)); };
    const reset = () => { snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]; dir = next = { x: 1, y: 0 }; sc = 0; setScore(0); spawn(); };
    const draw = (t = 0) => {
      x.fillStyle = '#0d0705'; x.fillRect(0, 0, N * C, N * C); x.fillStyle = '#ff8c1822';
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) x.fillRect(i * C + C / 2 - 1, j * C + C / 2 - 1, 2, 2);
      const p = 1 + Math.sin(t / 220) * 0.12, fx = food.x * C + C / 2, fy = food.y * C + C / 2, r = (C / 2 - 2) * p; // food: a little spark
      x.fillStyle = '#FFD36A'; x.shadowColor = '#FF7A00'; x.shadowBlur = 10; x.beginPath(); x.moveTo(fx, fy - r); x.lineTo(fx + r * 0.45, fy); x.lineTo(fx, fy + r); x.lineTo(fx - r * 0.45, fy); x.closePath(); x.fill(); x.shadowBlur = 0;
      snake.forEach((s, i) => { x.fillStyle = i ? `hsl(${28 + Math.min(i, 12)}, 100%, ${56 - Math.min(i, 14)}%)` : '#FFB52E'; x.beginPath(); x.roundRect(s.x * C + 1.5, s.y * C + 1.5, C - 3, C - 3, i ? 5 : 7); x.fill(); });
      const h = snake[0]; x.fillStyle = '#120B08'; // eyes look where it's heading
      [-1, 1].forEach((k) => { x.beginPath(); x.arc(h.x * C + C / 2 + dir.x * 3 + -dir.y * k * 4, h.y * C + C / 2 + dir.y * 3 + dir.x * k * 4, 1.8, 0, 7); x.fill(); });
    };
    const tick = () => {
      dir = next; const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
      if (snake.some((s, i) => i < snake.length - 1 && s.x === h.x && s.y === h.y)) { status = 'over'; setState('over'); bestSc = Math.max(bestSc, sc); setBest(bestSc); draw(); return; }
      snake.unshift(h); if (h.x === food.x && h.y === food.y) { sc++; setScore(sc); spawn(); } else snake.pop();
      draw(performance.now()); timer = setTimeout(tick, Math.max(70, 135 - sc * 3));
    };
    const turn = (dx, dy) => {
      if (status === 'over') { reset(); status = 'run'; setState('run'); clearTimeout(timer); next = dx === -1 ? { x: 0, y: -1 } : { x: dx, y: dy }; timer = setTimeout(tick, 100); return; }
      if (status === 'ready') { status = 'run'; setState('run'); if (!played) { played = true; onPlay?.(); } timer = setTimeout(tick, 100); }
      if (snake.length > 1 && dx === -dir.x && dy === -dir.y) return; next = { x: dx, y: dy };
    };
    api.current.turn = turn; reset(); draw();
    const key = (e) => { const d = KEYS[e.key]; if (!d) return; e.preventDefault(); turn(d[0], d[1]); };
    addEventListener('keydown', key); const idle = setInterval(() => status !== 'run' && draw(performance.now()), 120); // keeps the spark pulsing before you start
    return () => { clearTimeout(timer); clearInterval(idle); removeEventListener('keydown', key); };
  }, []);
  const sw = useRef(null), t = (dx, dy) => api.current.turn?.(dx, dy);
  const down = (e) => { sw.current = { x: e.clientX, y: e.clientY }; };
  const up = (e) => { const s = sw.current; sw.current = null; if (!s) return; const dx = e.clientX - s.x, dy = e.clientY - s.y; if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return; Math.abs(dx) > Math.abs(dy) ? t(Math.sign(dx), 0) : t(0, Math.sign(dy)); };
  return (<div className="snake">
    <div className="snake-board" onPointerDown={down} onPointerUp={up}><canvas ref={cv} role="img" aria-label="Snake game" />
      {state !== 'run' && <div className="snake-msg">{state === 'over' ? <>OOPS · SCORE {score}<br />ARROW KEY / SWIPE TO RETRY</> : <>ARROW KEYS · WASD · SWIPE<br />TO START</>}</div>}</div>
    <div className="snake-score" aria-live="off">SCORE {score} · BEST {best}</div>
    <div className="dpad" aria-label="Snake controls">
      <button data-sfx="none" style={{ gridColumn: 2, gridRow: 1 }} aria-label="Up" onClick={() => t(0, -1)}>▲</button><button data-sfx="none" style={{ gridColumn: 1, gridRow: 2 }} aria-label="Left" onClick={() => t(-1, 0)}>◀</button>
      <button data-sfx="none" style={{ gridColumn: 2, gridRow: 2 }} aria-label="Down" onClick={() => t(0, 1)}>▼</button><button data-sfx="none" style={{ gridColumn: 3, gridRow: 2 }} aria-label="Right" onClick={() => t(1, 0)}>▶</button></div></div>);
}

// Tiny burst of sparks shown once when loading finishes (CSS-animated; positions are random per burst).
const SPARKS = 22;
function Burst() {
  const sparks = useRef(Array.from({ length: SPARKS }, (_, i) => { const a = (i / SPARKS) * Math.PI * 2 + Math.random() * 0.5, r = 70 + Math.random() * 110;
    return { '--dx': `${Math.cos(a) * r * 1.6}px`, '--dy': `${Math.sin(a) * r - 30}px`, '--s': 0.6 + Math.random() * 0.9, '--t': `${0.9 + Math.random() * 0.6}s`, '--hue': 28 + Math.random() * 24 }; }));
  return <div className="burst" aria-hidden="true">{sparks.current.map((st, i) => <i key={i} style={st} />)}</div>;
}

// Loading screen: logo, a little story (new page every few seconds), progress bar, and an optional snake game.
export default function Intro({ out, loaded, pct, needClick, onEnter, onPlay }) {
  const [game, setGame] = useState(false), [page, setPage] = useState(0), [bg, setBg] = useState(false), [burst, setBurst] = useState(false);
  useEffect(() => { const i = new Image(); i.onload = () => setBg(true); i.src = asset(BG); }, []); // background fades in once it has loaded (no pop-in)
  useEffect(() => { const t0 = performance.now(), i = setInterval(() => setPage(Math.min(STORY.length - 1, Math.floor((performance.now() - t0) / (STORY_STEP_SECONDS * 1000)))), 500); return () => clearInterval(i); }, []);
  useEffect(() => { if (!loaded) return; play('ready'); setBurst(true); const t = setTimeout(() => setBurst(false), 1800); return () => clearTimeout(t); }, [loaded]); // loading finished: chime + sparks, so a player mid-snake notices
  const status = !loaded ? `LOADING ASSETS… ${Math.round(pct * 100)}%` : needClick ? 'READY · CLICK ANYWHERE TO ENTER ♪' : 'INITIALIZING DREAM…';
  return (<div className={'intro' + (out ? ' out' : '') + (game ? ' game' : '')} onClick={onEnter} role="presentation">
    <div className={'intro-bg' + (bg ? ' on' : '')} style={{ backgroundImage: `url(${asset(BG)})` }} aria-hidden="true" />
    {site.logoVideo ? <video src={asset(site.logoVideo)} autoPlay muted playsInline /> : <img src={asset(site.logo)} alt={site.name} />}
    <div className="story" key={page} aria-live="polite">{STORY[page].map((l, i) => <p key={i} style={{ '--l': i }}>{l}</p>)}</div>
    <div className={'intro-status' + (loaded ? ' done' : '')}>{burst && <Burst />}<p className="stat" role="status">{status}</p><div className="intro-bar" aria-hidden="true"><i style={{ transform: `scaleX(${loaded ? 1 : pct})` }} /></div></div>
    <div className="snake-wrap" onClick={(e) => e.stopPropagation()}>
      {game ? <Snake onPlay={onPlay} /> : <button className="snake-open" data-sfx="tick" onClick={() => setGame(true)}>◆ PLAY SNAKE WHILE YOU WAIT</button>}</div>
    <button className="skip">SKIP</button></div>);
}
