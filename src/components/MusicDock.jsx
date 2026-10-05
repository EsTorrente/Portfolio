import { useEffect, useState } from 'react';
import { asset } from '../utils/assets';
import * as M from '../utils/music';
// ✏️ EDIT ME: names shown in the player (same order as song-01, song-02, …). `cover` is optional (e.g. '/assets/audio/song-01.webp'); default is your logo.
const INFO = [
  { title: 'Dawn Chorus', artist: 'Cosmo Sheldrake' }, { title: 'But Once a Child', artist: 'Cosmo Sheldrake' },
  { title: 'Greenfields, Golden Sands', artist: 'Yusuf / Cat Stevens' }, { title: 'Quisiera Despertar', artist: 'Gustavo Pena - El príncipe' },
];
const COVER = '/assets/audio/PlayerIcon.webp', FALLBACK = '/assets/intro/color-logo.webp'; // FALLBACK only shows if PlayerIcon.webp is missing
const EV = ['pointerdown', 'pointerup', 'keydown', 'touchend', 'click'];
const fmt = (s) => (isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');
const Ico = { play: 'M8 5v14l11-7z', pause: 'M6 5h4v14H6zM14 5h4v14h-4z', prev: 'M6 6h2v12H6zM20 6v12L9.5 12z', next: 'M16 6h2v12h-2zM4 6l10.5 6L4 18z' };
const I = ({ d }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="currentColor" /></svg>;

// Looks like the compact Spotify embed (cover · title/artist · controls · thin progress bar) but plays your own files.
// Starts on the visitor's first click/tap/key (browsers block sound before that). Tucks away while a window is open; ♪ brings it back.
// Shared open/closed state so the ♪ button in the top bar (phones) and the tab beside the player (desktop) control the same thing.
let dockOpen = false; const dockSubs = new Set(); const setDock = (v) => { dockOpen = typeof v === 'function' ? v(dockOpen) : v; dockSubs.forEach((f) => f(dockOpen)); };
export const useDockOpen = () => { const [v, set] = useState(dockOpen); useEffect(() => { dockSubs.add(set); return () => dockSubs.delete(set); }, []); return [v, setDock]; };
// Top-bar ♪ button (phones). Shows a small equaliser while music plays.
export function DockButton() {
  const [open, setOpen] = useDockOpen(), [s, setS] = useState(M.getState()); useEffect(() => M.subscribe(setS), []);
  return (<button className={'tb-btn dock-btn' + (open ? ' on' : '') + (s.playing && !s.muted ? ' playing' : '')} data-sfx="tick" aria-expanded={open} aria-label={open ? 'Hide music player' : 'Show music player'} onClick={() => setOpen((o) => !o)}>
    {open ? '✕' : <><span className="eq" aria-hidden="true"><i /><i /><i /></span>♪</>}</button>);
}
// open = a portfolio window is open · compact = phone layout.
// Desktop: the ♪/✕ tab beside the player always shows or hides it (on the home screen the choice is remembered between visits, so it can never sit on top of an icon).
// While a window is open the player tucks away by itself and the same tab brings it back temporarily.
// Phone: hidden until you tap ♪ in the top bar; tap ✕, tap outside, or open a section and it goes away (so it never covers buttons).
export default function MusicDock({ open = false, compact = false }) {
  const [s, setS] = useState(M.getState()), [peek, setPeek] = useDockOpen(), collapsed = open || compact;
  const [pinned, setPinned] = useState(() => { try { return localStorage.getItem('mar-dock') !== 'off'; } catch { return true; } }); // desktop home screen: visitor can hide the player for good (remembered)
  const togglePin = () => setPinned((p) => { try { localStorage.setItem('mar-dock', p ? 'off' : 'on'); } catch {} return !p; });
  const mini = collapsed ? !peek : !pinned; // mini = slid off-screen, only the ♪ tab shows
  useEffect(() => { const un = M.subscribe(setS); M.init();
    const go = () => { if (!M.getState().playing) M.play(); EV.forEach((t) => removeEventListener(t, go, true)); };
    EV.forEach((t) => addEventListener(t, go, { capture: true, passive: true }));
    return () => { un(); EV.forEach((t) => removeEventListener(t, go, true)); }; }, []);
  useEffect(() => { if (!collapsed || (compact && open)) setPeek(false); }, [collapsed, compact, open]);
  useEffect(() => { if (!peek || !collapsed) return; // tap outside / Esc closes the popover
    const out = (e) => { if (!e.target.closest?.('.dock, .dock-btn')) setPeek(false); }, esc = (e) => e.key === 'Escape' && setPeek(false);
    addEventListener('pointerdown', out, true); addEventListener('keydown', esc);
    return () => { removeEventListener('pointerdown', out, true); removeEventListener('keydown', esc); }; }, [peek, collapsed]);
  const has = s.tracks.length > 0, info = INFO[parseInt((s.tracks[s.idx]?.file || '').slice(-2), 10) - 1] || {}, pct = s.dur ? (s.time / s.dur) * 100 : 0;
  return (<aside className={'dock' + (mini ? ' mini' : '') + ' tabbed' + (compact && open ? ' gone' : '')} aria-label="Music player" aria-hidden={compact && !peek ? true : undefined}>
    <div className="mp">
      <img className="mp-cover" src={asset(info.cover || COVER)} alt="" draggable="false" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = asset(FALLBACK); }} />
      <div className="mp-meta"><b>{has ? info.title || s.tracks[s.idx].file : 'No songs yet'}</b><span>{has ? info.artist : 'add song-01.mp3 to assets/audio'}</span></div>
      <div className="mp-ctl">
        <button data-sfx="tick" disabled={!has} onClick={M.prev} aria-label="Previous song"><I d={Ico.prev} /></button>
        <button className="mp-play" data-sfx="none" disabled={!has} onClick={M.toggle} aria-label={s.playing ? 'Pause' : 'Play'}><I d={s.playing ? Ico.pause : Ico.play} /></button>
        <button data-sfx="tick" disabled={!has} onClick={M.next} aria-label="Next song"><I d={Ico.next} /></button></div>
      <button className="mp-mute" data-sfx="tick" disabled={!has} onClick={() => M.setMuted(!s.muted)} aria-pressed={s.muted} aria-label={s.muted ? 'Unmute music' : 'Mute music'} title={s.muted ? 'Unmute music' : 'Mute music'}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />{s.muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />}</svg></button>
      <div className="mp-bar"><i style={{ width: pct + '%' }} />
        <input type="range" min="0" max={s.dur || 0} step="0.1" value={Math.min(s.time, s.dur || 0)} disabled={!has || !s.dur} onChange={(e) => M.seek(+e.target.value)} aria-label="Seek" aria-valuetext={`${fmt(s.time)} of ${fmt(s.dur)}`} />
        <span className="mp-time">{fmt(s.time)} / {fmt(s.dur)}</span></div>
    </div>
    <div className="mp-vol"><div className="mp-vol-pill">
      <button data-sfx="tick" onClick={() => M.setMuted(!s.muted)} aria-label={s.muted ? 'Unmute music' : 'Mute music'} tabIndex={-1}>{s.muted || s.volume === 0 ? '🔇\uFE0E' : '🔊\uFE0E'}</button>
      <input type="range" min="0" max="1" step="0.01" value={s.muted ? 0 : s.volume} style={{ '--v': (s.muted ? 0 : s.volume) * 100 + '%' }} onChange={(e) => M.setVolume(+e.target.value)} aria-label="Music volume" aria-valuetext={`${Math.round((s.muted ? 0 : s.volume) * 100)}%`} /></div></div>
    <button className="dock-tab" data-sfx="tick" aria-label={mini ? 'Show music player' : 'Hide music player'} aria-expanded={!mini} onClick={() => (collapsed ? setPeek((p) => !p) : togglePin())}>{mini ? '♪' : '✕'}</button></aside>);
}
