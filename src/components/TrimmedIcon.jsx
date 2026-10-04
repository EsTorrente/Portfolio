import { useEffect, useState } from 'react';

// Crops the transparent margin off an icon so every program icon fills its square the same way,
// no matter how much empty space each .webp has around the artwork.
export default function TrimmedIcon({ src, alt = '' }) {
  const [url, setUrl] = useState(src), [bad, setBad] = useState(false);
  useEffect(() => {
    let dead = false; setUrl(src);
    const im = new Image();
    im.onload = () => {
      try {
        const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0);
        const d = x.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 12) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (x1 < 0 || (x0 === 0 && y0 === 0 && x1 === w - 1 && y1 === h - 1)) return;
        const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
        o.getContext('2d').drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
        if (!dead) setUrl(o.toDataURL('image/png'));
      } catch { /* canvas blocked → keep the original image */ }
    };
    im.onerror = () => !dead && setBad(true);
    im.src = src; return () => { dead = true; };
  }, [src]);
  return bad ? null : <img src={url} alt={alt} />;
}
