import { useEffect, useState } from 'react';
import { asset } from '../utils/assets';
const HIDE = { position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }; // keeps lazy-loading working while the loader is shown
// Un-cropped image with a loader. If the image is missing but a `video` is given, shows that video's first frame (thumbnail). Otherwise a styled placeholder.
export default function Media({ src, video, at = 0.6, alt = '', label, ratio = 1.5, className = '', quiet = false, ...rest }) {
  const [bad, setBad] = useState(!src), [vbad, setVbad] = useState(!video), [ok, setOk] = useState(false);
  useEffect(() => { setBad(!src); setOk(false); }, [src]);
  if (bad && video && !vbad) return <video className={className + ' vthumb'} src={asset(video) + '#t=' + at} muted playsInline preload="metadata" aria-label={alt} onError={() => setVbad(true)} />;
  if (bad && quiet) return null;
  if (bad) return (<div className={'ph ' + className} style={{ aspectRatio: ratio }} role="img" aria-label={alt} data-replace={src}>
    <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3l3.5 12.5L37 20l-13.5 4.5L20 37l-3.5-12.5L3 20l13.5-4.5z" fill="currentColor" /></svg>
    <small>{label || alt}</small><em>{src}</em></div>);
  return (<>
    {!ok && <div className={'ph ldr ' + className} style={{ aspectRatio: ratio }} role="status" aria-label="Loading"><i className="spin" /></div>}
    <img className={className} src={asset(src)} alt={alt} loading="lazy" decoding="async" style={ok ? undefined : HIDE}
      ref={(el) => { if (el && !ok && el.complete && el.naturalWidth) setOk(true); }} onLoad={() => setOk(true)} onError={() => setBad(true)} {...rest} /></>);
}
