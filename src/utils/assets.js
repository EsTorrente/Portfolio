// Prefixes asset paths with the deploy base so it works on GitHub Pages sub-paths.
export const asset = (p) => (p ? (p.startsWith('http') ? p : import.meta.env.BASE_URL + p.replace(/^\//, '')) : null);
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
