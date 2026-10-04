// Fullscreen helpers (Android Chrome / iPad / desktop). iPhone Safari has no fullscreen API for pages – there the site is fullscreen when added to the Home Screen (see manifest).
const el = () => document.documentElement;
export const canFullscreen = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
export const isFullscreen = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
export async function enterFullscreen() {
  try { const e = el(); await (e.requestFullscreen ? e.requestFullscreen({ navigationUI: 'hide' }) : e.webkitRequestFullscreen?.());
    try { await screen.orientation?.lock?.('landscape'); } catch {} } catch {}
}
export async function exitFullscreen() { try { screen.orientation?.unlock?.(); await (document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen?.()); } catch {} }
export const toggleFullscreen = () => (isFullscreen() ? exitFullscreen() : enterFullscreen());
export const onFullscreenChange = (f) => { const h = () => f(isFullscreen()); document.addEventListener('fullscreenchange', h); document.addEventListener('webkitfullscreenchange', h); return () => { document.removeEventListener('fullscreenchange', h); document.removeEventListener('webkitfullscreenchange', h); }; };
