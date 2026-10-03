import { useState } from 'react';
import Media from '../components/Media';
import MediaViewer from '../components/MediaViewer';
import { asset } from '../utils/assets';
import * as D from '../data/portfolioData';
import { about } from '../data/siteData';

const Tags = ({ t = [] }) => <div className="tags">{t.map((x, i) => <span key={i}>{x}</span>)}</div>;

function Grid({ items, cls = '' }) { // cards used by rigging / animation / modelling / projects
  const [v, setV] = useState(null);
  return (<><div className={'grid ' + cls} key={items.map((i) => i.id).join()}>{items.map((it, n) => (
    <article key={it.id} className="card" style={{ '--n': n }}>
      <button className="thumb" onClick={() => setV(n)} aria-label={`View ${it.title}`}>
        <Media src={it.image} alt={it.title} label={it.title} ratio={1.6} />{it.video && <b className="play">▶</b>}{it.software && <em className="badge">{it.software}</em>}</button>
      <h3>{it.title}</h3><p>{it.description}</p>
      {it.role && <p className="meta">ROLE: {it.role}</p>}
      <Tags t={it.tags || it.technologies} />{it.link && <a className="ext" href={it.link} target="_blank" rel="noreferrer">↗</a>}
    </article>))}</div>
    {v !== null && <MediaViewer items={items} index={v} onIndex={setV} onClose={() => setV(null)} />}</>);
}

const RATIOS = [0.75, 1.3, 1, 1.6, 0.8, 1.2];
function Gallery({ filter }) { // masonry, no crop, objects keep their own aspect ratio
  const all = D.illustration, items = filter === 'ALL' ? all : all.filter((i) => i.category === filter); const [v, setV] = useState(null);
  return (<><div className="masonry" key={filter}>{items.map((it, n) => (
    <button key={it.id} className="art" style={{ '--n': n, '--r': ((n * 53) % 5) - 2 + 'deg' }} onClick={() => setV(n)} aria-label={`View ${it.title}`}>
      <Media src={it.image} alt={it.title} label={it.title} ratio={RATIOS[n % RATIOS.length]} /></button>))}</div>
    {v !== null && <MediaViewer items={items} index={v} onIndex={setV} onClose={() => setV(null)} />}</>);
}

function Awards() { // collectible paper cards over your drawn base (/assets/ui/award-card.webp)
  return (<div className="awards">{D.awards.map((a, n) => (
    <article key={a.id} className="award" style={{ '--n': n, '--r': ((n * 41) % 5) - 2 + 'deg', backgroundImage: `url(${asset('/assets/ui/award-card.webp')})` }}>
      <div className="aslot"><Media src={a.image} alt={a.title} label="" ratio={1.4} quiet /></div>
      <span className="year">{a.year}</span>
      <div className="atext"><h3>{a.title}</h3><small>{a.organization}</small><p>{a.description}</p></div>
      <span className="stamp">{a.badge}</span>{a.certificate && <a className="ext" href={asset(a.certificate)} target="_blank" rel="noreferrer">↗</a>}
    </article>))}</div>);
}

function About() { // positions are % regions of the 3840×2160 layout art — tweak in styles/main.css (.ab-*)
  const A = about; const [hov, setHov] = useState(false);
  return (<div className="about" style={{ '--bg': `url(${asset('/assets/ui/about-layout.webp')})` }}>
    <div className="ab-sheet">
      <figure className="ab-portrait" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <Media src={A.portrait} alt="Portrait" label="portrait" ratio={0.7} /><figcaption>{A.portraitNote.map((l, i) => <span key={i}>{l}</span>)}</figcaption></figure>
      <section className="ab-bio paper"><h3>{A.bioTitle}</h3>{A.bio.map((p, i) => <p key={i}>{p}</p>)}</section>
      <section className="ab-skills paper"><h3>★ SKILLS</h3><Tags t={A.skills} /></section>
      <section className="ab-soft paper"><h3>SOFTWARE</h3><div className="soft">{A.software.map((s) => <span key={s.name} title={s.name} style={{ background: s.c }}>{s.icon ? <img src={asset(s.icon)} alt={s.name} /> : s.short}</span>)}</div></section>
      <section className="ab-int paper"><h3>♥ INTERESTS</h3><ul>{A.interests.map((x) => <li key={x}>{x}</li>)}</ul></section>
      <section className="ab-con paper"><h3>✉ CONTACT</h3><ul><li>{A.contact.email}</li><li>{A.contact.handle}</li><li>{A.contact.location}</li></ul></section>
      <section className="ab-ban paper"><p className="hand">{A.banner}</p></section>
      {A.polaroids.map((p, i) => <div key={i} className={'ab-pol p' + (i + 1)}><Media src={p} alt="" label="" ratio={1.2} /></div>)}
    </div></div>);
}

function Opinions() {
  return (<div className="opinions">{D.opinions.map((o, n) => (<figure key={o.id} className="op paper" style={{ '--r': ((n * 47) % 5) - 2 + 'deg' }}>
    <span className="stamp">PLACEHOLDER</span><blockquote>“{o.quote}”</blockquote>
    <figcaption><Media src={o.image} alt="" label="" ratio={1} className="avatar" /><span><b>{o.name}</b><small>{o.role}</small></span></figcaption></figure>))}</div>);
}

export default function Section({ id, filter }) {
  const rig = filter === 'ALL' ? D.rigging : D.rigging.filter((r) => r.software === filter);
  return { rigging: <Grid items={rig} />, animation: <Grid items={D.animation} cls="wide" />, modelling: <Grid items={D.modelling} />, illustration: <Gallery filter={filter} />,
    awards: <Awards />, projects: <Grid items={D.projects} cls="wide big" />, about: <About />, opinions: <Opinions /> }[id];
}
