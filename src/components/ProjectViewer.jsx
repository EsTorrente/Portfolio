import { Component, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Media from './Media';
import Zoom from './Zoom';
import { asset, THUMB_AT } from '../utils/assets';
import { duck, release } from '../utils/music';
import { play } from '../utils/sfx';

// Project pop-up: video player + video list on the left, full write-up on the right. Esc closes, ←/→ switch project.
// Content comes from `item.details` / `item.videos` in data/portfolioData.js.

function Slate({ n, title }) { // shown when a video file doesn't exist yet
  return (<div className="pv-slate" role="img" aria-label={`Video ${n}: ${title} (coming soon)`}>
    <b>▶</b><span>VIDEO {String(n).padStart(2, '0')}</span><strong>{title}</strong><em>coming soon</em></div>);
}

// What the left side can show, in priority order: a YouTube embed, a list of videos, or an image gallery.
const mediaOf = (it) => it.youtube ? [{ kind: 'yt', title: it.title, id: it.youtube }]
  : it.videos?.length ? it.videos.map((v) => ({ kind: 'video', ...v }))
  : it.images?.length > 1 ? it.images.map((src, i) => ({ kind: 'image', title: it.imageTitles?.[i] || `Image ${String(i + 1).padStart(2, '0')}`, src }))
  : [{ kind: 'image', title: it.title, src: it.images?.[0] || it.image, fallback: it.fallback }];

function Player({ item, media, cur: want }) {
  const cur = want < media.length ? want : 0; // never index past the list
  const [bad, setBad] = useState(false), [ready, setReady] = useState(false), [fs, setFs] = useState(false), box = useRef(), vid = useRef();
  useEffect(() => { setBad(false); setReady(false); }, [cur, item.id]);
  useEffect(() => { const f = () => setFs(!!box.current && (document.fullscreenElement === box.current || document.webkitFullscreenElement === box.current));
    document.addEventListener('fullscreenchange', f); document.addEventListener('webkitfullscreenchange', f);
    return () => { document.removeEventListener('fullscreenchange', f); document.removeEventListener('webkitfullscreenchange', f); }; }, []);
  const m = media[cur], tok = useRef({});
  useEffect(() => () => release(tok.current), [cur, item.id]); // video changed / popup closed → music comes back
  useEffect(() => { // browsers (esp. Safari) refuse autoplay for videos that have an audio track unless muted → if blocked, retry muted so it always starts
    const v = vid.current; if (!v) return; const go = () => v.play()?.catch(() => { v.muted = true; v.play()?.catch(() => {}); }); go(); v.addEventListener('loadeddata', go, { once: true }); return () => v.removeEventListener('loadeddata', go); }, [m.src, bad]);
  if (m.kind === 'yt') return <iframe className="pv-video" src={`https://www.youtube-nocookie.com/embed/${m.id}?rel=0`} title={`${item.title} — YouTube`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />;
  if (m.kind === 'image') return <Zoom fill resetKey={m.src}><Media key={m.src} src={m.src} fallback={m.fallback} alt={m.title} label={item.title} ratio={1.4} className="pv-hero" /></Zoom>;
  if (bad) return <Slate n={cur + 1} title={m.title} />;
  const toggleFs = () => { const el = box.current;
    if (document.fullscreenElement || document.webkitFullscreenElement) return (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    const req = el.requestFullscreen || el.webkitRequestFullscreen; if (req) req.call(el); else vid.current?.webkitEnterFullscreen?.(); }; // iPhone only fullscreens the <video> itself
  return (<div className="pv-player" ref={box}>
    <video ref={vid} key={m.src} className="pv-video" src={asset(m.src)} poster={THUMB_AT[item.id] != null ? undefined : asset(item.image)} controls controlsList="nofullscreen" autoPlay muted={m.sound === false} loop playsInline preload="metadata"
      onPlay={() => { if (m.sound !== false) duck(tok.current); }} onPause={() => release(tok.current)} onEnded={() => release(tok.current)}
      onLoadedData={() => setReady(true)} onError={() => { setBad(true); release(tok.current); }} />
    {!ready && <div className="pv-loading" role="status"><i className="spin" /><span>LOADING VIDEO…</span></div>}
    <button className="pv-fs" data-sfx="tick" onClick={toggleFs} aria-label={fs ? 'Exit full screen' : 'Full screen'} title={fs ? 'Exit full screen' : 'Full screen'}>{fs ? '✕' : '⛶'}</button></div>);
}

function Blocks({ blocks }) {
  return blocks.map((b, i) => (<section key={i} className="pv-block">
    {b.h && <h4>{b.h}</h4>}
    {b.p && [].concat(b.p).map((t, i) => <p key={i}>{t}</p>)}
    {b.ul && <ul>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>}
    {b.after && <p>{b.after}</p>}
    {b.rgb && <div className="pv-rgb">{b.rgb.map(([c, l, col]) => <span key={c}><i style={{ background: col }} />{c} <b>→</b> {l}</span>)}</div>}
    {b.after2 && <p>{b.after2}</p>}
  </section>));
}

function Viewer({ items, index, onClose, onIndex }) {
  const it = items[index], d = it.details || {}, ref = useRef(), prev = useRef(), body = useRef();
  const [cur, setCur] = useState(0);
  useEffect(() => { play('viewer'); }, []);
  useEffect(() => { setCur(0); body.current?.scrollTo(0, 0); }, [index]);
  useEffect(() => {
    prev.current = document.activeElement; ref.current?.focus();
    const k = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'ArrowRight' && items.length > 1) onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft' && items.length > 1) onIndex((index - 1 + items.length) % items.length); };
    addEventListener('keydown', k, true); return () => { removeEventListener('keydown', k, true); prev.current?.focus?.(); };
  }, [index, items.length]);
  const media = mediaOf(it), strip = useRef();
  const c = cur < media.length ? cur : 0; // FIX: `cur` is reset in an effect, so for one render it can point past the new project's media list (e.g. Eridan video 6 → Skirt has 1) → crash
  useEffect(() => { // mouse wheel scrolls the thumbnail strip sideways (needs a non-passive listener)
    const el = strip.current; if (!el) return;
    const w = (e) => { if (el.scrollWidth <= el.clientWidth) return; e.preventDefault(); el.scrollLeft += e.deltaY + e.deltaX; };
    el.addEventListener('wheel', w, { passive: false }); return () => el.removeEventListener('wheel', w);
  }, [index, media.length]);
  useEffect(() => { strip.current?.querySelector('.on')?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); }, [cur, index]);
  return (<div className="viewer pv" role="dialog" aria-modal="true" aria-label={it.title} ref={ref} tabIndex={-1} onClick={onClose}>
    <div className="pv-panel" onClick={(e) => e.stopPropagation()}>
      <div className="pv-media">
        <div className="pv-stage"><Player item={it} media={media} cur={c} /></div>
        {media.length > 1 && (<ol className="pv-list" ref={strip} aria-label={media[0].kind === 'image' ? 'Images' : 'Videos'}>{media.map((v, i) => (
          <li key={v.src || v.id}><button className={i === c ? 'on' : ''} onClick={() => setCur(i)} aria-current={i === c}>{media[0].kind === 'image' ? <img src={asset(v.src)} alt="" onError={(e) => { if (e.target) e.target.style.display = 'none'; }} /> : null}<span>{String(i + 1).padStart(2, '0')}</span>{media[0].kind === 'image' ? '' : v.title}</button></li>))}</ol>)}
      </div>
      <div className="pv-text" ref={body}>
        <header><small>{it.subtitle}</small><h3>{it.title}</h3></header>
        {(d.intro || (it.description ? [it.description] : [])).map((p, i) => <p key={i} className="pv-intro">{p}</p>)}
        {d.blocks && <Blocks blocks={d.blocks} />}
        {d.note && <p className="pv-note"><b>Note</b> {d.note}</p>}
        {it.certificate && <a className="pv-cert" href={asset(it.certificate)} target="_blank" rel="noreferrer">VIEW CERTIFICATE ↗</a>}
        {it.tags && <div className="tags">{it.tags.map((t) => <span key={t}>{t}</span>)}</div>}
      </div>
    </div>
    <button className="vbtn vclose" aria-label="Close" onClick={onClose}>✕</button>
    {items.length > 1 && <><button className="vbtn vprev" aria-label="Previous project" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}>‹</button>
      <button className="vbtn vnext" aria-label="Next project" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}>›</button></>}
  </div>);
}

// Safety net: if anything in the pop-up ever throws, close it instead of leaving a blank screen.
class Boundary extends Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch(e) { console.error('ProjectViewer crashed:', e); this.props.onClose(); }
  render() { return this.state.err ? null : this.props.children; }
}
// Rendered through a portal into <body>: the desktop window (.win) is tilted/filtered/container-sized, and any of those would turn this "fixed" overlay into one that sits inside (and tilts with) the window instead of covering the screen.
export default function ProjectViewer(props) { return createPortal(<Boundary key={props.index} onClose={props.onClose}><Viewer {...props} /></Boundary>, document.body); }
