import { useState } from 'react';
import { asset } from '../utils/assets';
// Shows an image un-cropped (object-fit: contain). If the file is missing, shows a styled placeholder.
export default function Media({ src, alt = '', label, ratio = 1.5, className = '', quiet = false, ...rest }) {
  const [bad, setBad] = useState(!src);
  if (bad && quiet) return null;
  if (bad) return (<div className={'ph ' + className} style={{ aspectRatio: ratio }} role="img" aria-label={alt} data-replace={src}>
    <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3l3.5 12.5L37 20l-13.5 4.5L20 37l-3.5-12.5L3 20l13.5-4.5z" fill="currentColor"/></svg>
    <small>{label || alt}</small><em>{src}</em></div>);
  return <img className={className} src={asset(src)} alt={alt} loading="lazy" decoding="async" onError={() => setBad(true)} {...rest} />;
}
