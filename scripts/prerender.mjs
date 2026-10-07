// Post-build step:  vite build && node scripts/prerender.mjs
// Writes the portfolio's REAL content (from src/data/*.js) into dist/index.html as semantic HTML, so crawlers, text-only
// browsers, AI agents, screen readers and visitors without JavaScript get the whole portfolio. React still renders the
// interactive experience on top. Also generates dist/llms.txt + dist/sitemap.xml and fails the build if key facts go missing.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), DIST = path.join(ROOT, 'dist');
const SITE = process.env.SITE_URL || 'https://estorrente.github.io/Portfolio/'; // ✏️ change if you get a custom domain
const load = (f) => import(pathToFileURL(path.join(ROOT, 'src/data', f)).href);
const [S, P] = await Promise.all([load('siteData.js'), load('portfolioData.js')]);
const A = S.about, C = A.contact;

// ✏️ EDIT: headline facts shown in the static page, JSON-LD and llms.txt
const NAME = 'Mar Torrente', FULL_NAME = C.name || 'Maria del Mar Torrente';
const ROLES = ['Digital Entertainment Design Engineer', 'Technical Artist', '2D & 3D Animator', 'Rigger'];
const AREAS = ['technical art', 'character rigging', '2D and 3D animation', 'procedural animation', 'programming', 'interactive experiences', 'game design', 'AR/VR', 'illustration', 'creative technology', 'production and creative leadership'];
// ✏️ EDIT: the achievements a recruiter should see first (shown in the page's About section and in llms.txt)
const HIGHLIGHTS = [
  'Regret: a 9-minute 2D animated short produced entirely solo at age 17, with 1M+ views on YouTube.',
  'Platillo: 13-minute interactive animated mystery (producer and visual director) that won three awards in 2026: Best DEX Project, Excellence in Visual Design and Most Original Visual Style.',
  'Best DEX Project awarded three times (2024-2, 2025-2, 2026-1) and Outstanding Student (IDED 2026), Universidad Pontificia Bolivariana.',
  'Eridan: a fully custom Blender character rig built from scratch (no autorig) with procedural animation, a facial system and custom tools.',
  'Leads multidisciplinary teams and production pipelines, from concept to final delivery.',
];
const INTRO = `${NAME} is a Colombian Digital Entertainment Design Engineer who works across ${AREAS.slice(0, -1).join(', ')} and ${AREAS.at(-1)}. She builds custom character rigs and procedural animation systems, produces and directs animated and interactive projects, and leads multidisciplinary teams from first idea to final delivery.`;

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (t = '') => String(t).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const rel = (p) => (!p ? '' : /^https?:/.test(p) ? p : '.' + (p.startsWith('/') ? p : '/' + p));
const ytId = (p) => p.youtube || p.videos?.map((v) => v.youtube || v.id).find(Boolean) || null;
const ul = (a = [], cls = '') => (a.length ? `<ul${cls ? ` class="${cls}"` : ''}>${a.map((x) => `<li>${esc(clean(x))}</li>`).join('')}</ul>` : '');
const img = (p, alt) => (p.image ? `<img src="${esc(rel(p.image))}" alt="${esc(alt)}" loading="lazy" decoding="async">` : '');

function article(p, { deep = false, level = 3 } = {}) {
  const h = `h${level}`, id = ytId(p), d = p.details || {};
  return `<article id="${esc(p.id)}"><${h}>${esc(p.title)}</${h}>${p.subtitle ? `<p class="sub">${esc(clean(p.subtitle))}</p>` : ''}${img(p, `${p.title}${p.subtitle ? ' — ' + clean(p.subtitle) : ''}`)}
<p>${esc(clean(p.description))}</p>${ul(p.tags, 'tags')}${deep ? (d.intro || []).map((t) => `<p>${esc(clean(t))}</p>`).join('') + (d.blocks || []).filter((b) => b.h && (b.ul || b.p)).map((b) => `<h${level + 1}>${esc(clean(b.h))}</h${level + 1}>${b.ul ? ul(b.ul) : `<p>${esc(clean([].concat(b.p)[0]))}</p>`}`).join('') : ''}
${p.videos?.length > 1 ? `<p>Demos: ${esc(p.videos.map((v) => clean(v.title)).join(' · '))}.</p>` : ''}${id ? `<p><a href="https://youtu.be/${id}" rel="noopener">Watch ${esc(p.title)} on YouTube</a></p>` : ''}</article>`;
}
const section = (id, title, intro, body) => `<section id="${id}" aria-labelledby="h-${id}"><h2 id="h-${id}">${esc(title)}</h2>${intro ? `<p>${esc(clean(intro))}</p>` : ''}${body}</section>`;

const SEC = [['about', 'About & skills'], ['projects', 'Featured projects'], ['rigging', 'Rigging'], ['animation', 'Animation'], ['modelling', '3D modelling'], ['illustration', 'Illustration'], ['awards', 'Awards']];
const bio = A.bio.map((b) => (typeof b === 'string' ? `<p>${esc(clean(b))}</p>` : b.h ? `<h3>${esc(clean(b.h))}</h3>` : `<p><em>${esc(clean(b.p))}</em></p>`)).join('');
const ill = [...new Set(P.illustration.map((i) => i.category))].map((c) => c.charAt(0) + c.slice(1).toLowerCase());
const html = `<div id="static-content">
<header><h1>${NAME}</h1><p class="role">${ROLES.map(esc).join(' · ')}</p><p>${esc(INTRO)}</p>
<nav aria-label="Text version: portfolio sections"><ul>${SEC.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}<li><a href="mailto:${esc(C.email)}">Contact</a></li></ul></nav></header>
<main>
${section('about', 'About & skills', clean(A.headline), `<h3>Highlights</h3>${ul(HIGHLIGHTS)}${bio}<h3>Skills</h3>${ul(A.skills)}<h3>Software</h3>${ul(A.software.map((s) => s.name))}<h3>Currently learning</h3>${ul(A.learn.map((x) => x.name))}`)}
${section('projects', 'Featured projects', '', P.projects.map((p) => article(p, { deep: true })).join('\n'))}
${section('rigging', 'Rigging (Blender, Maya, Harmony)', 'Custom character rigs, procedural animation systems and rigging tools.', P.rigging.map((p) => article(p, { deep: true })).join('\n'))}
${section('animation', 'Animation', '', P.animation.map((p) => article(p)).join('\n'))}
${section('modelling', '3D modelling', '', P.modelling.map((p) => article(p)).join('\n'))}
${section('illustration', 'Illustration', P.illustrationIntro?.text || '', `<p>Gallery categories: ${esc(ill.join(', '))}.</p>`)}
${section('awards', 'Awards', P.awardsIntro?.text || '', `<ol>${P.awards.map((a) => `<li><article id="${esc(a.id)}"><h3>${esc(clean(a.title))}</h3><p>${esc(a.year)} · ${esc(clean(a.organization))}</p><p>${esc(clean(a.description))}</p></article></li>`).join('')}</ol>`)}
</main>
<footer><h2>Contact</h2><ul><li><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></li><li><a href="${esc(C.linkedin)}" rel="me noopener">LinkedIn — ${esc(FULL_NAME)}</a></li><li>Based in Colombia</li><li><a href="./llms.txt">Plain-text summary (llms.txt)</a></li></ul></footer>
</div>
<script>(function(d){d.documentElement.classList.add('js');var s=d.getElementById('static-content');if(!s)return;s.querySelectorAll('a').forEach(function(a){a.tabIndex=-1});['header','footer'].forEach(function(t){var e=s.querySelector(t);e&&e.setAttribute('role','none')});var m=s.querySelector('main');if(m){m.setAttribute('role','region');m.setAttribute('aria-label','Portfolio text version')}})(document)</script>`;

const award = P.awards.map((a) => `${a.title} — ${clean(a.organization)}`);
const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebSite', '@id': SITE + '#site', url: SITE, name: `${NAME} — Portfolio`, inLanguage: 'en', publisher: { '@id': SITE + '#mar' } },
  { '@type': 'Person', '@id': SITE + '#mar', name: FULL_NAME, alternateName: NAME, jobTitle: ROLES, url: SITE, email: `mailto:${C.email}`, sameAs: [C.linkedin], nationality: { '@type': 'Country', name: 'Colombia' },
    description: INTRO, affiliation: { '@type': 'EducationalOrganization', name: 'Universidad Pontificia Bolivariana' }, knowsAbout: [...AREAS, ...A.skills, ...A.software.map((s) => s.name)], award,
    workExample: P.projects.map((p) => ({ '@type': 'CreativeWork', name: p.title, description: clean(p.description), keywords: (p.tags || []).join(', '), ...(ytId(p) ? { url: `https://youtu.be/${ytId(p)}` } : {}) })) }] };
const jsonld = `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;

// ---- llms.txt + sitemap.xml
const L = [`# ${FULL_NAME} (${NAME}) — ${ROLES.join(' / ')}`, '', `> ${INTRO} Portfolio: ${SITE}`, '', '## Highlights',
  ...HIGHLIGHTS.map((h) => `- ${h}`), '', '## Featured projects',
  ...P.projects.map((p) => `- **${p.title}** — ${clean(p.subtitle)}. ${clean(p.description)}${ytId(p) ? ` https://youtu.be/${ytId(p)}` : ''}`), '',
  '## Rigging', ...P.rigging.map((r) => `- **${r.title}** (${r.software}): ${clean(r.description)}`), '', '## Skills & tools',
  `- ${A.skills.join(', ')}`, `- Software: ${A.software.map((s) => s.name).join(', ')}`, `- Learning: ${A.learn.map((x) => x.name).join(', ')}`, '', '## Awards',
  ...P.awards.map((a) => `- ${a.year} · ${a.title} — ${clean(a.organization)}. ${clean(a.description)}`), '', '## Site sections',
  ...SEC.map(([id, t]) => `- ${t}: ${SITE}#${id}`), '', '## Contact', `- Email: ${C.email}`, `- LinkedIn: ${C.linkedin}`, '- Location: Colombia', ''].join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`;

// ---- inject into dist/index.html
const file = path.join(DIST, 'index.html'); let out = fs.readFileSync(file, 'utf8');
for (const m of ['<!--SEO-JSONLD-->', '<!--STATIC-CONTENT-->']) if (!out.includes(m)) throw new Error(`prerender: marker ${m} not found in dist/index.html (is it in the source index.html?)`);
out = out.replace('<!--SEO-JSONLD-->', () => jsonld).replace('<!--STATIC-CONTENT-->', () => html);
fs.writeFileSync(file, out); fs.writeFileSync(path.join(DIST, 'llms.txt'), L); fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

// ---- self-check: could a no-JS reader identify everything? (fails the build if not)
const must = [NAME, 'Digital Entertainment Design Engineer', 'Technical Artist', 'Rigger', 'Eridan', 'Platillo', 'StarBlitz', 'Regret', 'Crónicas del Tonusco', 'Vuforia', 'Unity', 'Best DEX Project', C.email, C.linkedin, 'procedural animation', 'AR/VR'];
const miss = must.filter((m) => !out.toLowerCase().includes(esc(m).toLowerCase()) && !out.toLowerCase().includes(m.toLowerCase()));
const h1 = (out.match(/<h1[\s>]/g) || []).length, imgsNoAlt = (out.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
if (miss.length || h1 !== 1 || imgsNoAlt) throw new Error(`prerender self-check failed: missing=${JSON.stringify(miss)} h1=${h1} imgsWithoutAlt=${imgsNoAlt}`);
console.log(`prerender OK · static HTML ${(html.length / 1024).toFixed(1)} KB · ${P.projects.length} projects · ${P.rigging.length} rigs · ${P.awards.length} awards · llms.txt + sitemap.xml written`);
