// Prefixes asset paths with the deploy base so it works on GitHub Pages sub-paths.
export const asset = (p) => (p ? (p.startsWith('http') ? p : import.meta.env.BASE_URL + p.replace(/^\//, '')) : null);
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
// ✏️ Animation cards whose first seconds are black: card thumbnail = the video frame at this second (instead of the .webp). Change the numbers to pick another frame.
export const THUMB_AT = { 'animation-03': 13 }; // seconds (0:13). Animations 01 + 02 now use their own .webp thumbnails (public/assets/animation/animation-01.webp and animation-02.webp). To go back to a video frame for one of them, add e.g. 'animation-01': 70 here.

// Program icons: public/assets/icons/<Name>.webp  →  Unity · Blender · Maya · MotionBuilder · Harmony · AfterEffects
const SW = { UNITY: 'Unity', BLENDER: 'Blender', MAYA: 'Maya', MOTIONBUILDER: 'MotionBuilder', HARMONY: 'Harmony', AFTEREFFECTS: 'AfterEffects' };
export const softwareIcon = (name) => { const k = SW[String(name || '').toUpperCase().replace(/[^A-Z]/g, '')]; return k ? asset(`/assets/icons/${k}.webp`) : null; };
