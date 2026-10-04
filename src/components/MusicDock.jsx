import { useEffect, useRef, useState } from 'react';
// Spotify playlist under the name. Browsers block sound before any interaction, so playback starts on the visitor's FIRST click / tap / key press.
// While a portfolio window is open the player tucks away to the left (music keeps playing); the ♪ tab brings it back.
const PLAYLIST = '3PTcRYvYOaDho2WddqRW5P';
export default function MusicDock({ collapsed }) {
  const host = useRef(), ctl = useRef(), ready = useRef(false), want = useRef(false), [peek, setPeek] = useState(false);
  useEffect(() => {
    const make = (api) => { if (ctl.current || !host.current) return; const el = document.createElement('div'); host.current.appendChild(el);
      api.createController(el, { uri: `spotify:playlist:${PLAYLIST}`, width: '100%', height: 80, theme: '0' }, (c) => { ctl.current = c;
        c.addListener('ready', () => { ready.current = true; if (want.current) c.play(); }); }); };
    if (window.__spotifyApi) make(window.__spotifyApi);
    else { window.onSpotifyIframeApiReady = (api) => { window.__spotifyApi = api; make(api); };
      if (!document.getElementById('spotify-api')) { const s = document.createElement('script'); s.id = 'spotify-api'; s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true; document.body.appendChild(s); } }
    const go = () => { want.current = true; if (ready.current) ctl.current.play(); ['pointerdown', 'keydown', 'touchstart'].forEach((t) => removeEventListener(t, go, true)); };
    ['pointerdown', 'keydown', 'touchstart'].forEach((t) => addEventListener(t, go, { capture: true, passive: true }));
    return () => ['pointerdown', 'keydown', 'touchstart'].forEach((t) => removeEventListener(t, go, true));
  }, []);
  useEffect(() => { if (!collapsed) setPeek(false); }, [collapsed]);
  return (<aside className={'dock' + (collapsed && !peek ? ' mini' : '')} aria-label="Music player">
    <div ref={host} className="dock-host" />
    <button className="dock-tab" data-sfx="tick" aria-label={peek ? 'Hide music player' : 'Show music player'} aria-expanded={!(collapsed && !peek)} onClick={() => setPeek((p) => !p)}>♪</button></aside>);
}
