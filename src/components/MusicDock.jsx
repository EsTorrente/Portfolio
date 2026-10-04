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
export default function MusicDock({ collapsed }) {
  const [s, setS] = useState(M.getState()), [peek, setPeek] = useState(false);
  useEffect(() => { const un = M.subscribe(setS); M.init();
    const go = () => { if (!M.getState().playing) M.play(); EV.forEach((t) => removeEventListener(t, go, true)); };
    EV.forEach((t) => addEventListener(t, go, { capture: true, passive: true }));
    return () => { un(); EV.forEach((t) => removeEventListener(t, go, true)); }; }, []);
  useEffect(() => { if (!collapsed) setPeek(false); }, [collapsed]);
  const has = s.tracks.length > 0, info = INFO[parseInt((s.tracks[s.idx]?.file || '').slice(-2), 10) - 1] || {}, pct = s.dur ? (s.time / s.dur) * 100 : 0;
  return (<aside className={'dock' + (collapsed && !peek ? ' mini' : '')} aria-label="Music player">
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
    <button className="dock-tab" data-sfx="tick" aria-label={peek ? 'Hide music player' : 'Show music player'} aria-expanded={!(collapsed && !peek)} onClick={() => setPeek((p) => !p)}>♪</button></aside>);
}
