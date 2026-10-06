import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AboutMore from '../components/AboutMore';
import Media from '../components/Media';
import MediaViewer from '../components/MediaViewer';
import ProjectViewer from '../components/ProjectViewer';
import SwIcon from '../components/SwIcon';
import TrimmedIcon from '../components/TrimmedIcon';
import { asset, THUMB_AT } from '../utils/assets';
import * as D from '../data/portfolioData';
import { about } from '../data/siteData';

const Tags = ({ t = [] }) => <div className="tags">{t.map((x, i) => <span key={i}>{x}</span>)}</div>;

const n = (k, one, many) => `${k} ${k > 1 ? many : one}`;
const ctaLabel = (it) => 'VIEW PROJECT' + (it.youtube ? ' · WATCH' : it.videos?.length ? ' · ' + n(it.videos.length, 'VIDEO', 'VIDEOS') : it.images?.length > 1 ? ' · ' + n(it.images.length, 'IMAGE', 'IMAGES') : '');

function Grid({ items, cls = '' }) { // cards used by rigging / animation / modelling / projects
  const [v, setV] = useState(null);
  const rich = (it) => !!(it.details || it.videos?.length || it.youtube || it.images?.length); // cards with a write-up open the project pop-up
  const View = v !== null && rich(items[v]) ? ProjectViewer : MediaViewer;
  return (<><div className={'grid ' + cls} key={items.map((i) => i.id).join()}>{items.map((it, n) => (
    <article key={it.id} className={'card' + (rich(it) ? ' clickable' : '')} style={{ '--n': n }} onClick={rich(it) ? () => setV(n) : undefined}>
      <button className="thumb" onClick={(e) => { e.stopPropagation(); setV(n); }} aria-label={`View ${it.title}`}>
        <Media src={THUMB_AT[it.id] != null ? null : it.image} video={it.videos?.[0]?.src} at={THUMB_AT[it.id]} alt={it.title} label={it.title} ratio={1.6} />{it.video && <b className="play">▶</b>}{it.software && <em className="badge"><SwIcon name={it.software} />{it.software}</em>}
        </button>
      {rich(it) && <div className="cta" aria-hidden="true"><b>▶</b>{ctaLabel(it)}</div>}
      <h3>{it.title}</h3>{it.subtitle && <p className="csub">{it.subtitle}</p>}{it.description && <p>{it.description}</p>}
      {it.role && <p className="meta">ROLE: {it.role}</p>}
      <Tags t={it.tags || it.technologies} />
      {rich(it) && <button className="more" onClick={(e) => { e.stopPropagation(); setV(n); }}>OPEN PROJECT <b>→</b></button>}
      {it.link && <a className="ext" href={it.link} target="_blank" rel="noreferrer">↗</a>}
    </article>))}</div>
    {v !== null && <View items={items} index={v} onIndex={setV} onClose={() => setV(null)} />}</>);
}

const RATIOS = [0.75, 1.3, 1, 1.6, 0.8, 1.2];
function ArtPiece({ it, n }) { // image, or an animated webm (muted loop). Loader until ready; videos only load once scrolled near.
  const [bad, setBad] = useState(false), [ok, setOk] = useState(false), [vis, setVis] = useState(false), box = useRef(), ratio = RATIOS[n % RATIOS.length];
  useEffect(() => { if (!it.video || !box.current) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { rootMargin: '300px' }); o.observe(box.current); return () => o.disconnect(); }, [it.video]);
  if (it.video && !bad) return (<div ref={box} className={'vbox' + (ok ? ' ok' : '')} style={ok ? undefined : { aspectRatio: ratio }}>
    {!ok && <div className="ph ldr" role="status" aria-label="Loading"><i className="spin" /></div>}
    {vis && <video src={asset(it.video)} autoPlay loop muted playsInline preload="auto" onLoadedData={() => setOk(true)} onError={() => setBad(true)} aria-label={it.title} />}</div>);
  return <Media src={it.video ? it.video : it.image} alt={it.title} label={it.title} ratio={ratio} />;
}
// Masonry made of plain flex columns instead of CSS multi-column: iPad Safari mishandles multi-column + rotated/animated items inside a scrolling pane (thumbnails turned invisible but stayed clickable).
// Column counts mirror the old rules: desktop 3 (≥200px each) · tablet 3 (≥190px) · phones / narrow windows 2 (≥140px). Pieces are dealt left→right, row by row.
function Masonry({ children }) {
  const ref = useRef(), [cols, setCols] = useState(3);
  useLayoutEffect(() => { const el = ref.current; if (!el) return;
    const f = () => { const c = document.documentElement.classList, narrow = matchMedia('(max-width:760px)').matches, [max, min] = c.contains('tablet') && c.contains('compact') ? [3, 190] : c.contains('compact') || narrow ? [2, 140] : [3, 200], gap = parseFloat(getComputedStyle(el).columnGap) || 0; // gap comes from the CSS (.masonry)
      setCols(Math.max(1, Math.min(max, Math.floor((el.clientWidth + gap) / (min + gap))))); };
    f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  const lanes = Array.from({ length: cols }, () => []); children.forEach((c, i) => lanes[i % cols].push(c));
  return <div className="masonry" ref={ref}>{lanes.map((l, i) => <div className="mcol" key={i}>{l}</div>)}</div>;
}
function SecIntro({ d, mid }) { return <header className={'sec-intro' + (mid ? ' mid' : '')}><h3>{d.title}</h3><p>{d.text}</p></header>; }
function Gallery({ filter }) { // masonry, no crop, objects keep their own aspect ratio. "ALL" groups pieces by category, each with its intro.
  const [v, setV] = useState(null);
  // unknown/stale filter (e.g. 'HAND-PAINTED TEXTURES' from another section) → show everything instead of crashing
  const cats = D.illustrationIntro[filter] ? [filter] : Object.keys(D.illustrationIntro);
  const items = cats.flatMap((c) => D.illustration.filter((i) => i.category === c)); let off = 0;
  return (<><div className="gallery" key={filter}>{cats.map((c) => { const intro = D.illustrationIntro[c], list = D.illustration.filter((i) => i.category === c), base = off; off += list.length;
    return (<section key={c} className="gcat">
      <header><h3>{c}</h3>{intro.tagline && <strong className="gtag">{intro.tagline}</strong>}<p>{intro.text}</p><small>{intro.n} {intro.unit}</small></header>
      <Masonry>{list.map((it, k) => (
        <button key={it.id} className="art" style={{ '--n': k, '--r': (((base + k) * 53) % 5) - 2 + 'deg' }} onClick={() => setV(base + k)} aria-label={`View ${it.title}`}>
          <ArtPiece it={it} n={k} /></button>))}</Masonry></section>); })}</div>
    {v !== null && <MediaViewer items={items} index={v} onIndex={setV} onClose={() => setV(null)} />}</>);
}

function Awards() { // collectible paper cards over your drawn base. Click one → the big pop-up with the full text (same as projects).
  const [v, setV] = useState(null);
  const items = D.awards.map((a) => ({ ...a, subtitle: `${a.year} · ${a.organization}`, tags: [a.badge], fallback: '/assets/ui/award-card.webp', images: [a.image] })); // pop-up art = your award image, or the card drawing if there isn't one
  return (<><SecIntro d={D.awardsIntro} /><div className="awards">{D.awards.map((a, n) => (
    <article key={a.id} className="award" style={{ '--n': n, '--r': ((n * 41) % 5) - 2 + 'deg', backgroundImage: `url(${asset('/assets/ui/award-card.webp')})` }}>
      <div className="aslot"><Media src={a.image} alt={a.title} label="" ratio={1.4} quiet /></div>
      <span className="year">{a.year}</span>
      <div className="atext"><h3>{a.title}</h3><small>{a.organization}</small><p>{a.description}</p></div>
      <span className="stamp">{a.badge}</span>
      <button className="aopen" onClick={() => setV(n)} aria-label={`Read award: ${a.title}`}><span>READ ✦</span></button>
      {a.certificate && <a className="ext" href={asset(a.certificate)} target="_blank" rel="noreferrer" aria-label="Open certificate">↗</a>}
    </article>))}</div>
    {v !== null && <ProjectViewer items={items} index={v} onIndex={setV} onClose={() => setV(null)} />}</>);
}

const bold = (t) => t.split('**').map((x, j) => (j % 2 ? <strong key={j}>{x}</strong> : x)); // **bold**
function About() { // (bio panel: scroll hint below) positions are % regions of the 3840×2160 layout art — tweak in styles/main.css (.ab-*). Portrait/polaroids are painted into the art.
  const A = about, C = A.contact, bio = useRef(), [more, setMore] = useState(false), [moreOpen, setMoreOpen] = useState(false); // `more` = the bio still has text below → show the "scroll" hint
  useLayoutEffect(() => { const el = bio.current; if (!el) return; const f = () => setMore(el.scrollHeight - el.clientHeight - el.scrollTop > 6); f(); el.addEventListener('scroll', f, { passive: true }); const ro = new ResizeObserver(f); ro.observe(el); return () => { el.removeEventListener('scroll', f); ro.disconnect(); }; }, []);
  return (<div className="about" style={{ '--bg': `url(${new URL(asset('/assets/ui/about-layout.webp'), document.baseURI).href})` }}>
    <div className="ab-sheet">
      {A.sticker && <div className="ab-note"><span>{A.sticker}</span></div>}
      <section className="ab-bio paper" ref={bio}><h3>{A.bioTitle}</h3>
        <p className="ab-lead">{bold(A.headline)}</p>
        {A.bio.map((b, i) => (typeof b === 'string' ? <p key={i}>{bold(b)}</p> : b.h ? <h4 key={i}>{b.h}</h4> : <p key={i} className={b.quote ? 'ab-quote' : undefined}>{bold(b.p)}</p>))}
        <div className="ab-more"><button onClick={() => setMoreOpen(true)} aria-haspopup="dialog">{A.moreButton} ✦</button></div></section>
      <button className={'ab-scroll' + (more ? ' on' : '')} tabIndex={more ? 0 : -1} aria-label="Scroll the text down" onClick={() => bio.current?.scrollBy({ top: bio.current.clientHeight * 0.8, behavior: 'smooth' })}>▼ SCROLL</button>
      <section className="ab-skills paper"><h3>★ {A.skillsTitle}</h3><Tags t={A.skills} /></section>
      <section className="ab-soft paper"><h3>SOFTWARE</h3><div className="soft">{A.software.map((s) => <span key={s.name} title={s.name} className={s.icon ? 'has-icon' : ''} style={s.icon ? undefined : { background: s.c }}>{s.icon ? <TrimmedIcon src={asset(s.icon)} alt={s.name} /> : s.short}<small>{s.name}</small></span>)}</div></section>
      <section className="ab-int paper"><h3>♥ {A.learnTitle}</h3><ul>{A.learn.map((x) => <li key={x.name}><b>{x.name}</b>{x.text && <span>{x.text}</span>}</li>)}</ul></section>
      <section className="ab-con paper"><h3>✉ CONTACT</h3><ul><li><b>{C.name}</b></li><li>{C.title}</li>
        <li><a href={`mailto:${C.email}`}>{C.email}</a></li><li><a href={`tel:${C.phone.replace(/\s/g, '')}`}>{C.phone}</a></li>
        <li><a href={C.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li></ul></section>
      <section className="ab-ban paper"><p className="hand">{A.banner}</p></section>
    </div>
    {moreOpen && <AboutMore more={A.more} onClose={() => setMoreOpen(false)} />}</div>);
}

function Opinions() {
  return (<div className="opinions">{D.opinions.map((o, n) => (<figure key={o.id} className="op paper" style={{ '--r': ((n * 47) % 5) - 2 + 'deg' }}>
    <span className="stamp">PLACEHOLDER</span><blockquote>“{o.quote}”</blockquote>
    <figcaption><Media src={o.image} alt="" label="" ratio={1} className="avatar" /><span><b>{o.name}</b><small>{o.role}</small></span></figcaption></figure>))}</div>);
}

export default function Section({ id, filter }) {
  const rig = filter === 'ALL' ? D.rigging : D.rigging.filter((r) => r.software === filter);
  return { rigging: <Grid items={rig} />, animation: <Grid items={D.animation} cls="wide" />, modelling: filter === '3D MODELS' ? <Grid items={D.modelling} /> : filter === 'HAND-PAINTED TEXTURES' ? <><SecIntro d={D.handpaintedIntro} /><Grid items={D.handpainted} /></> : <><Grid items={D.modelling} /><SecIntro d={D.handpaintedIntro} mid /><Grid items={D.handpainted} /></>, illustration: <Gallery filter={filter} />,
    awards: <Awards />, projects: <Grid items={D.projects} cls="wide big" />, about: <About />, opinions: <Opinions /> }[id];
}
