import { about } from '../data/siteData';
import { sections } from '../data/navigationData';
import { awards, projects, rigging } from '../data/portfolioData';

// A real-text version of the portfolio for AI agents, screen readers and crawlers that run the page but can't "see" the artwork.
// It is visually hidden (not display:none), built from the same data files as the site, and links to every section.
// ✏️ The "highlights" are written here; everything else comes from src/data automatically.
const clean = (t = '') => String(t).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const HIGHLIGHTS = [
  'Outstanding Student of the Digital Entertainment Design Engineering program (IDED), Universidad Pontificia Bolivariana, 2026.',
  'Her team\u2019s project was named best project of the DEX program in three different semesters (2024-2, 2025-2, 2026-1).',
  'Producer and visual director of Platillo, a 13-minute interactive animated mystery that won three awards in 2026 (Best DEX Project, Excellence in Visual Design, Most Original Visual Style).',
  'Created Regret, a 9-minute 2D animated short made entirely solo at 17, with more than one million views on YouTube.',
  'Builds custom character rigs from scratch with procedural animation, facial systems and custom tools (Blender, Maya, Harmony).',
];

export default function AgentSummary() {
  const C = about.contact, base = location.pathname;
  return (<aside className="agent-summary" aria-label="Portfolio summary">
    <h1>{C.name} — {C.title}</h1>
    <p>Colombian {C.title} and multidisciplinary artist: rigging, procedural animation, 3D animation, game design, programming and interactive experiences. Interactive portfolio site: choose a section below or use the desktop icons.</p>
    <h2>Highlights</h2><ul>{HIGHLIGHTS.map((h) => <li key={h}>{h}</li>)}</ul>
    <h2>Skills</h2><p>{about.skills.join(', ')}. Software: {about.software.map((s) => s.name).join(', ')}.</p>
    <h2>Sections</h2><ul>{sections.map((s) => <li key={s.id}><a href={`${base}#/${s.id}`}>{s.label}</a></li>)}</ul>
    <h2>Featured projects</h2><ul>{projects.map((p) => <li key={p.id}><b>{p.title}</b> — {clean(p.description)}</li>)}</ul>
    <h2>Rigging work</h2><ul>{rigging.map((r) => <li key={r.id}><b>{r.title}</b> ({r.software}) — {clean(r.description)}</li>)}</ul>
    <h2>Awards</h2><ul>{awards.map((a) => <li key={a.id}>{a.year} · {a.title} — {clean(a.organization)}</li>)}</ul>
    <h2>Contact</h2><p><a href={`mailto:${C.email}`}>{C.email}</a> · <a href={C.linkedin}>LinkedIn</a> · plain-text summary: <a href="./llms.txt">llms.txt</a></p>
  </aside>);
}
