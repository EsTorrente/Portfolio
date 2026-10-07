// Post-build step:  vite build && node scripts/prerender.mjs
// Writes the portfolio's REAL content (from src/data/*.js) into dist/index.html as semantic HTML, so crawlers, text-only
// browsers, AI agents, screen readers and visitors without JavaScript get the whole portfolio. React still renders the
// interactive experience on top. Also generates dist/llms.txt + dist/sitemap.xml and fails the build if key facts go missing.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), DIST = path.join(ROOT, 'dist');
const SITE = process.env.SITE_URL || 'https://estorrente.github.io/Portfolio/'; 
const load = (f) => import(pathToFileURL(path.join(ROOT, 'src/data', f)).href);
const [S, P] = await Promise.all([load('siteData.js'), load('portfolioData.js')]);
const A = S.about, C = A.contact;

const NAME = 'Mar Torrente', FULL_NAME = C.name || 'Maria del Mar Torrente';
const ROLES = ['Digital Entertainment Design Engineer', 'Technical Artist', '2D & 3D Animator', 'Rigger'];

// Upgraded technical areas reflecting real-time graphics, WebGL, and advanced rigging
const AREAS = ['technical art', 'character rigging', 'Python rigging automation', '2D and 3D animation', 'procedural animation', 'interactive WebGL experiences', 'game mechanics programming', 'mathematical graphics modeling', 'AR/VR', 'creative technology', 'production and creative leadership'];

// Upgraded highlights to expose detailed technical complexity for recruiters and AI agents
const HIGHLIGHTS = [
  'Interactive portfolio: this website is a fully interactive, playable experience: a surreal retro-computer desktop, reactive particles, an animated storyline, three original minigames and global leaderboards with 3-emoji player tags (browser → Cloudflare Worker → GitHub API).',
  'Eridan: Advanced custom character rig built from scratch for Autodesk Maya and Blender 4.3, featuring Python-scripted IK/FK switching, pole targets, driven keys, orient constraints, Geometry Nodes deformation, and custom NPR shading.',
  'Interactive Architecture: Develops complex web graphics and audio-visualizers using p5.js, Three.js, WebGL, and custom shaders, incorporating spatial hashing and Kuramoto oscillator synchronization.',
  'Software Engineering: Programs Unity C# mechanics, crafting scripts for UI sticker placement, draggable object behaviors, and automated unit testing.',
  'Mathematical Modeling: Studies stochastic processes, probability, and queuing theory, applying M/M/1 mathematical models to analyze complex systems.',
  'Regret: a 9-minute 2D animated short produced entirely solo at age 17, with 1M+ views on YouTube.',
  'Platillo: 13-minute interactive animated mystery (producer and visual director) that won three awards in 2026: Best DEX Project, Excellence in Visual Design and Most Original Visual Style.',
  'Best DEX Project awarded three times (2024-2, 2025-2, 2026-1) and Outstanding Student (IDED 2026), Universidad Pontificia Bolivariana.'
];

const INTRO = `${NAME} is a Colombian Digital Entertainment Design Engineer who works across ${AREAS.slice(0, -1).join(', ')} and ${AREAS.at(-1)}. She builds custom character rigs and procedural animation systems, produces and directs animated and interactive projects, and leads multidisciplinary teams from first idea to final delivery. Her portfolio is itself a playable interactive experience, with reactive particles, a story, original minigames and global leaderboards.`;


// ---------- THE PORTFOLIO ITSELF IS A PROJECT (edit these lines to change what crawlers / AI assistants learn about the website) ----------
const EXP_TITLE = 'This portfolio is itself a fully interactive experience';
const EXP_SUMMARY = `${NAME}'s portfolio is not a template: it is an explorable, playable digital world designed as a surreal retro computer inside a dream. Visitors open each portfolio section like a program on a strange old computer, play original minigames hidden in the scene, compete on global leaderboards, and follow a small story told by a deer-cat companion. All art, animation, characters and music direction are by ${NAME}.`;
const EXP_FEATURES = [
  'Retro "dream desktop" interface: every portfolio section (Rigging, 3D Modelling, Animation, Illustration, Awards, Projects, About Me, Opinions) is a program icon, and its window physically grows out of the icon with spatial, animated transitions.',
  'Living background: a looping video environment with a separate transparent foreground layer and mouse parallax (a single pre-rendered video on Apple devices that cannot play transparent WebM).',
  'Real-time reactive particle system: flowing organic particles drawn on a canvas that bend around the mouse or finger. Quality adapts to the device, it respects reduced-motion settings, and it switches itself off automatically if the frame rate drops.',
  'A storyline: the loading screen tells a short story about a deer-cat who collects unfinished dreams in an old computer, with a playable Snake game to pass the time while all media preloads.',
  'Three original playable minigames hidden in the environment, opened by clicking glowing stars on the old computer, the glasses and the pillar: Cat-Man (a Pac-Man-style maze where a cat dodges monsters), Type-A-Cat (a 60-second typing speed test with WPM, CPM and mistakes) and Mask Match (a memory game with eight pixel-art cat masks). All their pixel art is generated in code.',
  'Persistent global leaderboards for every minigame. Players pick a 3-emoji tag instead of a name; scores are validated and stored in a JSON file inside a GitHub repository through a Cloudflare Worker (browser → Cloudflare Worker → GitHub API).',
  'Ambient music player with a playlist that fades out automatically while project videos play and fades back in afterwards, plus synthesized and custom sound effects, a custom cursor and a mute / volume control.',
  'Rich project viewers: embedded demo videos, zoomable image galleries, hand-painted texture galleries, an "About" section with a "tell me more" pop-up and an in-world chat between Mar and her deer-cat.',
  'Responsive for every device: separate phone and tablet layouts, full-screen and landscape support, touch and keyboard controls.',
  'Accessibility and performance engineering: keyboard navigation, focus states, ARIA labels, reduced-motion support, lazy-loaded games, preloading behind the intro, adaptive quality and error boundaries.',
  'Built with React and Vite, canvas 2D particle systems, Web Audio and CSS animation, with this text version prerendered from the same data files at build time so crawlers, screen readers and AI assistants can read the whole portfolio.',
];
const MINIGAMES = [['Cat-Man', 'Pac-Man-style maze game: a cat eats fish bits, dodges three differently-behaving monsters and uses catnip power-ups.'], ['Type-A-Cat', '60-second typing speed test with WPM, CPM, mistake tracking and a ranking from "Sleepy Kitten" to "Keyboard Panther".'], ['Mask Match', 'Memory card game with eight pixel-art cat masks, move and time counters.']];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (t = '') => String(t).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const rel = (p) => (!p ? '' : /^https?:/.test(p) ? p : '.' + (p.startsWith('/') ? p : '/' + p));
const ytId = (p) => p.youtube || p.videos?.map((v) => v.youtube || v.id).find(Boolean) || null;
const ul = (a = [], cls = '') => (a.length ? `<ul${cls ? ` class="${cls}"` : ''}>${a.map((x) => `<li>${esc(clean(x))}</li>`).join('')}</ul>` : '');
const img = (p, alt) => (p.image ? `<img src="${esc(rel(p.image))}" alt="${esc(alt)}" loading="lazy" decoding="async">` : '');

const roleBlock = (p) => (p.details?.blocks || []).find((b) => b.ul && /my role|responsib/i.test(b.h || ''));
const rolesOf = (p) => (roleBlock(p)?.ul || []).map(clean);
const paras = (b, level) => [].concat(b.p || []).map((t) => `<p>${esc(clean(t))}</p>`).join('');
function article(p, { deep = false, level = 3 } = {}) {
  const h = `h${level}`, id = ytId(p), d = p.details || {}, rb = roleBlock(p), sub = `h${level + 1}`;
  const block = (b) => `${b.h ? `<${sub}>${esc(clean(b.h))}</${sub}>` : ''}${paras(b, level)}${b.ul ? ul(b.ul) : ''}`;
  return `<article id="${esc(p.id)}"><${h}>${esc(p.title)}</${h}>${p.subtitle ? `<p class="sub">${esc(clean(p.subtitle))}</p>` : ''}${img(p, `${p.title}${p.subtitle ? ' — ' + clean(p.subtitle) : ''}`)}
<p>${esc(clean(p.description))}</p>${ul(p.tags, 'tags')}${deep ? (rb ? `<${sub}>${esc(NAME)}’s responsibilities in ${esc(p.title)}</${sub}>${ul(rb.ul)}` : '') + (d.intro || []).map((t) => `<p>${esc(clean(t))}</p>`).join('') + (d.blocks || []).filter((b) => b !== rb && (b.h || b.p || b.ul)).map(block).join('') : ''}
${p.videos?.length > 1 ? `<p>Demos: ${esc(p.videos.map((v) => clean(v.title)).join(' · '))}.</p>` : ''}${id ? `<p><a href="https://youtu.be/${id}" rel="noopener">Watch ${esc(p.title)} on YouTube</a></p>` : ''}</article>`;
}
const section = (id, title, intro, body) => `<section id="${id}" aria-labelledby="h-${id}"><h2 id="h-${id}">${esc(title)}</h2>${intro ? `<p>${esc(clean(intro))}</p>` : ''}${body}</section>`;


const expHtml = `<section id="experience" aria-labelledby="h-experience"><h2 id="h-experience">${esc(EXP_TITLE)}</h2><p>${esc(EXP_SUMMARY)}</p>${ul(EXP_FEATURES)}<h3>Minigames</h3>${`<ul>${MINIGAMES.map(([n, d]) => `<li><strong>${esc(n)}</strong>: ${esc(d)}</li>`).join('')}</ul>`}</section>`;
const contribHtml = `<section id="contributions" aria-labelledby="h-contributions"><h2 id="h-contributions">What ${esc(NAME)} did in each production</h2><p>Full responsibility lists are inside every project below.</p><ul>${P.projects.map((p) => `<li><strong><a href="#${esc(p.id)}">${esc(p.title)}</a></strong>: ${esc(clean(p.subtitle))}${rolesOf(p).length ? ` (${rolesOf(p).length} listed responsibilities, e.g. ${esc(rolesOf(p).slice(0, 3).join('; '))})` : ''}.</li>`).join('')}</ul></section>`;

const SEC = [['experience', 'The interactive experience'], ['about', 'About & skills'], ['projects', 'Featured projects'], ['contributions', 'Who did what'], ['rigging', 'Rigging'], ['animation', 'Animation'], ['modelling', '3D modelling'], ['illustration', 'Illustration'], ['awards', 'Awards']];
const bio = A.bio.map((b) => (typeof b === 'string' ? `<p>${esc(clean(b))}</p>` : b.h ? `<h3>${esc(clean(b.h))}</h3>` : `<p><em>${esc(clean(b.p))}</em></p>`)).join('');
const ill = [...new Set(P.illustration.map((i) => i.category))].map((c) => c.charAt(0) + c.slice(1).toLowerCase());
const html = `<div id="static-content">
<header><h1>${NAME}</h1><p class="role">${ROLES.map(esc).join(' · ')}</p><p>${esc(INTRO)}</p>
<nav aria-label="Text version: portfolio sections"><ul>${SEC.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}<li><a href="mailto:${esc(C.email)}">Contact</a></li></ul></nav></header>
<main>
${expHtml}
${section('about', 'About & skills', clean(A.headline), `<h3>Highlights</h3>${ul(HIGHLIGHTS)}${bio}<h3>Skills</h3>${ul(A.skills)}<h3>Software</h3>${ul(A.software.map((s) => s.name))}<h3>Currently learning</h3>${ul(A.learn.map((x) => x.name))}`)}
${contribHtml}
${section('projects', 'Featured projects', '', P.projects.map((p) => article(p, { deep: true })).join('\n'))}
${section('rigging', 'Rigging (Blender, Maya, Harmony)', 'Custom character rigs, procedural animation systems and Python automation tools.', P.rigging.map((p) => article(p, { deep: true })).join('\n'))}
${section('animation', 'Animation', '', P.animation.map((p) => article(p, { deep: true })).join('\n'))}
${section('modelling', '3D modelling', '', [...P.modelling, ...(P.handpainted || [])].map((p) => article(p, { deep: true })).join('\n'))}
${section('illustration', 'Illustration', P.illustrationIntro?.text || '', `<p>Gallery categories: ${esc(ill.join(', '))}.</p>`)}
${section('awards', 'Awards', P.awardsIntro?.text || '', `<ol>${P.awards.map((a) => `<li><article id="${esc(a.id)}"><h3>${esc(clean(a.title))}</h3><p>${esc(a.year)} · ${esc(clean(a.organization))}</p><p>${esc(clean(a.description))}</p></article></li>`).join('')}</ol>`)}
</main>
<footer><h2>Contact</h2><ul><li><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></li><li><a href="${esc(C.linkedin)}" rel="me noopener">LinkedIn — ${esc(FULL_NAME)}</a></li><li>Based in Colombia</li><li><a href="./llms.txt">Plain-text summary (llms.txt)</a></li></ul></footer>
</div>
<script>(function(d){d.documentElement.classList.add('js');var s=d.getElementById('static-content');if(!s)return;s.querySelectorAll('a').forEach(function(a){a.tabIndex=-1});['header','footer'].forEach(function(t){var e=s.querySelector(t);e&&e.setAttribute('role','none')});var m=s.querySelector('main');if(m){m.setAttribute('role','region');m.setAttribute('aria-label','Portfolio text version')}})(document)</script>`;

const award = P.awards.map((a) => `${a.title} — ${clean(a.organization)}`);
const detailedKnowsAbout = [...new Set([...AREAS, ...A.skills, ...A.software.map((s) => s.name), 'Python', 'Autodesk Maya', 'Blender 4.3', 'Unity C#', 'React', 'Three.js', 'WebGL', 'p5.js', 'JavaScript ES6', 'Spatial Hashing', 'Kuramoto Oscillator Synchronization', 'M/M/1 Queuing Theory', 'Stochastic Processes'])];

const ME = { '@id': SITE + '#mar' }, gameNode = ([n, d]) => ({ '@type': 'VideoGame', name: n, description: d, genre: ['Arcade', 'Casual'], gamePlatform: 'Web browser', playMode: 'SinglePlayer', author: ME, isPartOf: { '@id': SITE + '#experience' }, url: SITE });
const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebSite', '@id': SITE + '#site', url: SITE, name: NAME, alternateName: [FULL_NAME, `${NAME} Portfolio`], inLanguage: 'en', publisher: ME }, // Google uses name/alternateName as the site name in results
  { '@type': 'ProfilePage', '@id': SITE + '#profile', url: SITE, name: `${FULL_NAME} (${NAME}) — Portfolio`, inLanguage: 'en', dateModified: new Date().toISOString(), mainEntity: ME, isPartOf: { '@id': SITE + '#site' } }, // tells Google this page is the profile of this person,
  { '@type': ['WebApplication', 'CreativeWork'], '@id': SITE + '#experience', name: `${NAME} — interactive portfolio experience`, url: SITE, description: EXP_SUMMARY, applicationCategory: 'Interactive portfolio / creative technology', operatingSystem: 'Any (modern web browser)', browserRequirements: 'Requires JavaScript; a text-only version is also provided', featureList: EXP_FEATURES, creator: ME, author: ME, keywords: 'interactive portfolio, reactive particles, minigames, leaderboard, storytelling, technical art, rigging, animation' },
  ...MINIGAMES.map(gameNode),
  { '@type': 'Person', '@id': SITE + '#mar', name: FULL_NAME, alternateName: NAME, jobTitle: ROLES, url: SITE, email: `mailto:${C.email}`, sameAs: [C.linkedin], nationality: { '@type': 'Country', name: 'Colombia' },
    description: INTRO, affiliation: { '@type': 'EducationalOrganization', name: 'Universidad Pontificia Bolivariana' }, knowsAbout: detailedKnowsAbout, award, mainEntityOfPage: { '@id': SITE + '#experience' },
    workExample: P.projects.map((p) => ({ '@type': 'CreativeWork', name: p.title, creator: ME, description: clean(p.description) + (rolesOf(p).length ? ` ${NAME}’s responsibilities: ${rolesOf(p).join('; ')}.` : ''), keywords: (p.tags || []).join(', '), ...(ytId(p) ? { url: `https://youtu.be/${ytId(p)}` } : {}) })) }] };
const jsonld = `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;

// ---- llms.txt + sitemap.xml
const roleLines = (p) => (rolesOf(p).length ? ['', `  ${NAME}'s responsibilities in ${p.title}:`, ...rolesOf(p).map((r) => `  - ${r}`)] : []);
const deepLines = (p) => (p.details?.blocks || []).filter((b) => b.ul && b !== roleBlock(p)).flatMap((b) => ['', `  ${clean(b.h || 'Details')}:`, ...b.ul.map((x) => `  - ${clean(x)}`)]);
const L = [`# ${FULL_NAME} (${NAME}) — ${ROLES.join(' / ')}`, '', `> ${INTRO} Portfolio: ${SITE}`, '',
  `## ${EXP_TITLE}`, EXP_SUMMARY, '', ...EXP_FEATURES.map((f) => `- ${f}`), '', '### Minigames', ...MINIGAMES.map(([n, d]) => `- **${n}**: ${d}`), '',
  '## Highlights', ...HIGHLIGHTS.map((h) => `- ${h}`), '',
  '## Projects and exactly what Mar did in each', ...P.projects.flatMap((p) => ['', `### ${p.title} — ${clean(p.subtitle)}`, clean(p.description), ...roleLines(p), ...deepLines(p), ...(ytId(p) ? ['', `  Video: https://youtu.be/${ytId(p)}`] : [])]), '',
  '## Rigging (full technical detail)', ...P.rigging.flatMap((r) => ['', `### ${r.title} (${r.software}) — ${clean(r.subtitle || '')}`, clean(r.description), ...deepLines(r)]), '',
  '## Animation', ...P.animation.map((x) => `- **${x.title}**: ${clean(x.description)}`), '', '## 3D modelling and hand-painted textures', ...[...P.modelling, ...(P.handpainted || [])].map((x) => `- **${x.title}**: ${clean(x.description)}`), '',
  '## Skills & tools', `- ${A.skills.join(', ')}`, `- Software: ${A.software.map((s) => s.name).join(', ')}`, `- Learning: ${A.learn.map((x) => x.name).join(', ')}`, '',
  '## Awards', ...P.awards.map((a) => `- ${a.year} · ${a.title} — ${clean(a.organization)}. ${clean(a.description)}`), '', '## Site sections',
  ...SEC.map(([id, t]) => `- ${t}: ${SITE}#${id}`), '', '## Contact', `- Email: ${C.email}`, `- LinkedIn: ${C.linkedin}`, '- Location: Colombia', ''].join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`;

// ---- inject into dist/index.html
const file = path.join(DIST, 'index.html'); let out = fs.readFileSync(file, 'utf8');
for (const m of ['<!--SEO-JSONLD-->', '<!--STATIC-CONTENT-->']) if (!out.includes(m)) throw new Error(`prerender: marker ${m} not found in dist/index.html (is it in the source index.html?)`);
out = out.replace('<!--SEO-JSONLD-->', () => jsonld).replace('<!--STATIC-CONTENT-->', () => html);
fs.writeFileSync(file, out); fs.writeFileSync(path.join(DIST, 'llms.txt'), L); fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.mkdirSync(path.join(DIST, 'root-site'), { recursive: true }); // copies for a user-site repo (estorrente.github.io), where crawlers look for them
for (const f of ['llms.txt', 'sitemap.xml']) fs.copyFileSync(path.join(DIST, f), path.join(DIST, 'root-site', f)); fs.writeFileSync(path.join(DIST, 'root-site', 'robots.txt'), fs.readFileSync(path.join(ROOT, 'public', 'robots.txt'), 'utf8').replace(/Sitemap:.*/g, 'Sitemap: ' + new URL('/sitemap.xml', SITE).href));

// ---- self-check
const must = [NAME, 'Digital Entertainment Design Engineer', 'Technical Artist', 'Rigger', 'Eridan', 'Platillo', 'StarBlitz', 'Regret', 'interactive experience', 'minigames', 'leaderboard', 'particles', 'Cat-Man', 'Cloudflare Worker', 'Crónicas del Tonusco', 'Vuforia', 'Unity', 'Best DEX Project', C.email, C.linkedin, 'procedural animation', 'AR/VR'];
const miss = must.filter((m) => !out.toLowerCase().includes(esc(m).toLowerCase()) && !out.toLowerCase().includes(m.toLowerCase()));
const h1 = (out.match(/<h1[\s>]/g) || []).length, imgsNoAlt = (out.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
if (miss.length || h1 !== 1 || imgsNoAlt) throw new Error(`prerender self-check failed: missing=${JSON.stringify(miss)} h1=${h1} imgsWithoutAlt=${imgsNoAlt}`);
console.log(`prerender OK · static HTML ${(html.length / 1024).toFixed(1)} KB · ${P.projects.length} projects · ${P.rigging.length} rigs · ${P.awards.length} awards · llms.txt + sitemap.xml written`);