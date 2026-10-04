import { useEffect, useRef, useState } from 'react';
// Click / tap = zoom in at that point (click again = reset). Wheel or pinch = zoom. Drag = pan. Buttons + − ⟲ and keys + − 0 also work.
// `resetKey` changes → zoom resets (use the image src). `fill` = stretch to the parent instead of hugging the image.
const MAX = 6;
export default function Zoom({ children, resetKey, fill = false }) {
  const box = useRef(), pts = useRef(new Map()), drag = useRef(null), pinch = useRef(null), [v, setV] = useState({ s: 1, x: 0, y: 0 });
  useEffect(() => setV({ s: 1, x: 0, y: 0 }), [resetKey]);
  const clamp = (s, x, y) => { const r = box.current.getBoundingClientRect(), mx = ((s - 1) * r.width) / 2, my = ((s - 1) * r.height) / 2;
    return { s, x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y)) }; };
  const zoomAt = (s2, cx, cy, from = v) => { s2 = Math.max(1, Math.min(MAX, s2)); if (s2 === 1) return { s: 1, x: 0, y: 0 };
    const r = box.current.getBoundingClientRect(), px = cx - (r.left + r.width / 2), py = cy - (r.top + r.height / 2), k = s2 / from.s;
    return clamp(s2, px - (px - from.x) * k, py - (py - from.y) * k); };
  const down = (e) => { box.current.setPointerCapture?.(e.pointerId); pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = { x: e.clientX, y: e.clientY, moved: false, v }; if (pts.current.size === 2) { const [a, b] = [...pts.current.values()]; pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), v }; drag.current.moved = true; } };
  const move = (e) => { if (!pts.current.has(e.pointerId)) return; pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2 && pinch.current) { const [a, b] = [...pts.current.values()], d = Math.hypot(a.x - b.x, a.y - b.y); setV(zoomAt(pinch.current.v.s * (d / pinch.current.d), (a.x + b.x) / 2, (a.y + b.y) / 2, pinch.current.v)); return; }
    const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 5) d.moved = true; if (d.moved && d.v.s > 1 && pts.current.size === 1) setV(clamp(d.v.s, d.v.x + dx, d.v.y + dy)); };
  const up = (e) => { const d = drag.current; pts.current.delete(e.pointerId); if (pts.current.size < 2) pinch.current = null;
    if (d && !d.moved && pts.current.size === 0 && e.type === 'pointerup') setV(v.s > 1 ? { s: 1, x: 0, y: 0 } : zoomAt(2.5, e.clientX, e.clientY)); if (!pts.current.size) drag.current = null; };
  useEffect(() => { const el = box.current, w = (e) => { e.preventDefault(); setV((c) => zoomAt(c.s * Math.exp(-e.deltaY * 0.0022), e.clientX, e.clientY, c)); };
    el.addEventListener('wheel', w, { passive: false }); return () => el.removeEventListener('wheel', w); }, []);
  const step = (f) => { const r = box.current.getBoundingClientRect(); setV((c) => zoomAt(c.s * f, r.left + r.width / 2, r.top + r.height / 2, c)); };
  const key = (e) => { if (e.key === '+' || e.key === '=') step(1.4); else if (e.key === '-') step(1 / 1.4); else if (e.key === '0') setV({ s: 1, x: 0, y: 0 }); else return; e.preventDefault(); e.stopPropagation(); };
  return (<div className={'zoom' + (fill ? ' fill' : '') + (v.s > 1 ? ' on' : '')}>
    <div ref={box} className="zoom-view" tabIndex={0} onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Image. Click to zoom, drag to pan; plus, minus and zero keys also work.">
      <div className="zoom-in" style={{ transform: `translate(${v.x}px,${v.y}px) scale(${v.s})` }}>{children}</div></div>
    <div className="zoom-ui" role="group" aria-label="Zoom controls">
      <button data-sfx="tick" aria-label="Zoom out" disabled={v.s <= 1} onClick={() => step(1 / 1.4)}>−</button>
      <button data-sfx="tick" aria-label="Reset zoom" disabled={v.s <= 1} onClick={() => setV({ s: 1, x: 0, y: 0 })}>{Math.round(v.s * 100)}%</button>
      <button data-sfx="tick" aria-label="Zoom in" disabled={v.s >= MAX} onClick={() => step(1.4)}>+</button></div></div>);
}
