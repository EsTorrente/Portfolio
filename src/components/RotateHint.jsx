import { useEffect, useState } from 'react';
// Phones held upright: ask the visitor to turn the phone sideways (the whole site is designed for landscape). Can be dismissed.
export default function RotateHint() {
  const q = '(pointer:coarse) and (max-width:760px) and (orientation:portrait)';
  const [portrait, setPortrait] = useState(() => matchMedia(q).matches), [skip, setSkip] = useState(false);
  useEffect(() => { const m = matchMedia(q), f = () => setPortrait(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  if (!portrait || skip) return null;
  return (<div className="rotate" role="alertdialog" aria-labelledby="rot-t">
    <svg className="rotate-phone" viewBox="0 0 64 64" aria-hidden="true"><rect x="19" y="6" width="26" height="52" rx="6" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="32" cy="51" r="2" fill="currentColor" /><path d="M10 20a26 26 0 0 1 8-9M54 44a26 26 0 0 1-8 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
    <h2 id="rot-t">Turn your phone sideways</h2><p>This little world is made for landscape mode.<br />Rotate your phone (and unlock rotation if needed) for the best experience.</p>
    <button onClick={() => setSkip(true)} data-sfx="tick">CONTINUE ANYWAY</button></div>);
}
