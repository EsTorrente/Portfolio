import { useEffect, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import { duck, release } from '../utils/music';
import { play as sfx } from '../utils/sfx';
import '../styles/preview.css';

// ✏️ Where the preview videos live (public/assets/previews/…)
export const PREVIEWS = {
  rigging:   { src: '/assets/previews/RiggingPreview.webm',   label: 'Rigging',    noun: 'rig' },
  animation: { src: '/assets/previews/AnimationPreview.webm', label: 'Animation',  noun: 'animation' },
  // ✏️ Projects preview is switched OFF for now. When ProjectsPreview.webm is ready, delete the // at the start of the line below.
  // projects:  { src: '/assets/previews/ProjectsPreview.webm',  label: 'Projects',   noun: 'project' },
};
// ✏️ 'session' = shows once per section each visit · 'forever' = only the very first time ever (this browser) · 'never' = off
export const PREVIEW_MODE = 'session';

const KEY = (id) => 'mar-preview-' + id;
const store = () => (PREVIEW_MODE === 'forever' ? localStorage : sessionStorage);
export const seenPreview = (id) => { try { return PREVIEW_MODE === 'never' || !!store().getItem(KEY(id)); } catch { return false; } };
export const markPreview = (id) => { try { store().setItem(KEY(id), '1'); } catch {} };

export default function PreviewReel({ id, onClose }) {
  const p = PREVIEWS[id], v = useRef(null), [ended, setEnded] = useState(false), [muted, setMuted] = useState(false), [t, setT] = useState(0);
  const tok = useRef({}).current;
  const close = () => { sfx('close'); release(tok); onClose(); };
  useEffect(() => { markPreview(id); const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(); } };
    addEventListener('keydown', k, true); return () => { removeEventListener('keydown', k, true); release(tok); }; }, []); // eslint-disable-line
  const start = () => { const el = v.current; if (!el) return; el.muted = false; setMuted(false);
    el.play().then(() => duck(tok)).catch(() => { el.muted = true; setMuted(true); el.play().then(() => duck(tok)).catch(() => {}); }); };
  const replay = () => { const el = v.current; setEnded(false); el.currentTime = 0; start(); };
  const toggleMute = () => { const el = v.current; el.muted = !el.muted; setMuted(el.muted); };
  return (
    <div className="pr" role="dialog" aria-modal="true" aria-label={p.label + ' preview'} onPointerDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="pr-card">
        <div className="pr-head"><span className="pr-badge">✦ QUICK PREVIEW</span><span className="pr-sub">Just a little taste of {p.label.toLowerCase()}</span>
          <button className="pr-x" onClick={close} aria-label="Close preview">✕</button></div>
        <div className="pr-stage">
          <video ref={v} src={asset(p.src)} playsInline preload="auto" autoPlay onCanPlay={() => { if (v.current?.paused && !ended && !v.current.dataset.s) { v.current.dataset.s = 1; start(); } }}
            onTimeUpdate={(e) => setT(e.target.duration ? e.target.currentTime / e.target.duration : 0)}
            onEnded={() => { release(tok); setEnded(true); sfx('ready'); }} onError={() => { release(tok); onClose(); }} />
          {!ended && <button className="pr-mute" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? '🔇 TAP FOR SOUND' : '🔊'}</button>}
          {ended && <div className="pr-end"><p>Click on the {p.noun}s inside to see more about them <span aria-hidden>↓</span></p>
            <div className="pr-btns"><button className="pr-go" onClick={close}>EXPLORE ›</button><button className="pr-re" onClick={replay}>↺ REPLAY</button></div></div>}
        </div>
        <i className="pr-bar"><b style={{ width: (ended ? 1 : t) * 100 + '%' }} /></i>
      </div>
    </div>);
}
