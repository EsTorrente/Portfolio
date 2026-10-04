import { useEffect, useState } from 'react';

// Makes every program icon look the same size.
// 1) trims the transparent margin, 2) measures how much of the icon is actually painted (its "visual weight"),
// 3) scales it so every icon covers about the same painted area on a fixed square canvas.
// A square tile (Maya) therefore ends up smaller than a spiky/round logo (Blender) of the same visual weight.
// Tweak WEIGHT to make ALL icons bigger/smaller together (0.55 – 0.75), CAP is the max fraction of the box any icon may fill.
const S = 192, WEIGHT = 0.62, CAP = 0.94;

export default function TrimmedIcon({ src, alt = '' }) {
  const [url, setUrl] = useState(src), [bad, setBad] = useState(false);
  useEffect(() => {
    let dead = false; setUrl(src);
    const im = new Image();
    im.onload = () => {
      try {
        const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
        const d = x.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = -1, y1 = -1, area = 0;
        for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) { const a = d[(y * w + i) * 4 + 3]; if (a > 12) { area += a / 255; if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
        if (x1 < 0) return;
        const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
        let k = (WEIGHT * S) / Math.sqrt(area);              // scale that gives the target painted area
        k = Math.min(k, (CAP * S) / Math.max(bw, bh));       // …but never overflow the square
        const o = document.createElement('canvas'); o.width = o.height = S;
        const ctx = o.getContext('2d'); ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(c, x0, y0, bw, bh, (S - bw * k) / 2, (S - bh * k) / 2, bw * k, bh * k);
        if (!dead) setUrl(o.toDataURL('image/png'));
      } catch { /* canvas blocked → keep the original image */ }
    };
    im.onerror = () => !dead && setBad(true);
    im.src = src; return () => { dead = true; };
  }, [src]);
  return bad ? null : <img src={url} alt={alt} />;
}
