import { useEffect, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import { duck, release } from '../utils/music';
import { play as sfx } from '../utils/sfx';
import '../styles/preview.css';

// ✏️ Where the preview videos live (public/assets/previews/…)
export const PREVIEWS = {
  rigging:   { src: '/assets/previews/RiggingPreview.webm',   label: 'Rigging',   noun: 'rigs' },
  animation: { src: '/assets/previews/AnimationPreview.webm', label: 'Animation', noun: 'animations' },
  // ✏️ Projects preview is switched OFF for now. When ProjectsPreview.webm is ready, delete the // at the start of the line below.
  // projects:  { src: '/assets/previews/ProjectsPreview.webm',  label: 'Projects',  noun: 'projects' },
};
// ✏️ 'session' = shows once per section each visit · 'forever' = only the very first time ever (this browser) · 'never' = off
export const PREVIEW_MODE = 'session';

const KEY = (id) => 'mar-preview-' + id;
const store = () => (PREVIEW_MODE === 'forever' ? localStorage : sessionStorage);
export const seenPreview = (id) => { try { return PREVIEW_MODE === 'never' || !!store().getItem(KEY(id)); } catch { return false; } };
export const markPreview = (id) => { try { store().setItem(KEY(id), '1'); } catch {} };

const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const Spark = ({ c }) => <svg className={'pr-spark ' + c} viewBox="0 0 30 30" aria-hidden><path d="M4 15h7M19 15h7M15 4v7M15 19v7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" transform="rotate(45 15 15) scale(.8) translate(3.7 3.7)" /></svg>;

export default function PreviewReel({ id, onClose }) {
  const p = PREVIEWS[id], v = useRef(null), box = useRef(null), tok = useRef({}).current;
  const [playing, setPlaying] = useState(false), [ended, setEnded] = useState(false), [muted, setMuted] = useState(false), [t, setT] = useState(0), [dur, setDur] = useState(0);
  const close = () => { sfx('close'); release(tok); onClose(); };
  useEffect(() => { markPreview(id); const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(); } };
    addEventListener('keydown', k, true); return () => { removeEventListener('keydown', k, true); release(tok); }; }, []); // eslint-disable-line
  const start = () => { const el = v.current; if (!el) return; el.muted = false; setMuted(false);
    el.play().catch(() => { el.muted = true; setMuted(true); el.play().catch(() => {}); }); }; // sound first; if the browser refuses, play muted
  const toggle = () => { const el = v.current; if (ended) { el.currentTime = 0; setEnded(false); } el.paused || el.ended ? start() : el.pause(); };
  const seek = (e) => { const el = v.current, r = e.currentTarget.getBoundingClientRect(); if (!el.duration) return; el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * el.duration; setEnded(false); };
  const mute = () => { const el = v.current; el.muted = !el.muted; setMuted(el.muted); };
  const full = () => { const el = v.current, b = box.current; (b.requestFullscreen || b.webkitRequestFullscreen)?.call(b) ?? el.webkitEnterFullscreen?.(); };
  const canFull = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.createElement('video').webkitEnterFullscreen);
  return (
    <div className="pr" role="dialog" aria-modal="true" aria-label={p.label + ' preview'} onPointerDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="pr-card">
        <button className="pr-x" onClick={close} aria-label="Close preview"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" /></svg></button>
        <header className="pr-head">
          <h2><span className="pr-ico" aria-hidden><svg viewBox="0 0 24 24"><path d="M9 6.5v11l9-5.5z" fill="currentColor" /></svg></span><span className="pr-title">A little preview...<i /></span><Spark c="s1" /><Spark c="s2" /></h2>
          <p>A quick look at what you'll find in the <b>{p.label}</b> tab.</p>
        </header>
        <div className="pr-vid" ref={box}>
          <video ref={v} src={asset(p.src)} playsInline preload="auto" autoPlay onClick={toggle}
            onCanPlay={() => { const el = v.current; if (el && el.paused && !el.dataset.s) { el.dataset.s = 1; start(); } }}
            onPlay={() => { setPlaying(true); setEnded(false); duck(tok); }} onPause={() => { setPlaying(false); release(tok); }}
            onLoadedMetadata={(e) => setDur(e.target.duration)} onTimeUpdate={(e) => setT(e.target.currentTime)}
            onEnded={() => { setPlaying(false); setEnded(true); release(tok); sfx('ready'); }} onError={() => { release(tok); onClose(); }} />
          {!playing && <button className="pr-big" onClick={toggle} aria-label={ended ? 'Replay' : 'Play'}>{ended ? <svg viewBox="0 0 24 24"><path d="M12 5a7 7 0 1 1-6.6 4.7M5 4v5.5h5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg> : <svg viewBox="0 0 24 24"><path d="M9 6.5v11l9-5.5z" fill="currentColor" /></svg>}</button>}
          <div className="pr-ctl">
            <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg> : <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>}</button>
            <span className="pr-time">{fmt(t)} / {fmt(dur)}</span>
            <div className="pr-seek" onPointerDown={seek}><b style={{ width: (dur ? (t / dur) * 100 : 0) + '%' }} /></div>
            <button onClick={mute} aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? <svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9.5l5 5M20.5 9.5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" /></svg> : <svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" /><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>}</button>
            {canFull && <button className="pr-fs" onClick={full} aria-label="Fullscreen"><svg viewBox="0 0 24 24"><path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg></button>}
          </div>
        </div>
        <footer className={'pr-foot' + (ended ? ' on' : '')} onClick={ended ? close : undefined}>
          <i className="pr-d l" /><span>Click on the {p.noun} to see more!</span><i className="pr-d r" />
          <svg className="pr-cur" viewBox="0 0 24 24" aria-hidden><path d="M6 3l12 8.5-5.2 1.1 3 5.6-2.4 1.3-3-5.6L6.8 17z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </footer>
      </div>
    </div>);
}
