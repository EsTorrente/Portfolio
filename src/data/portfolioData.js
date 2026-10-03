// ✏️ EDIT ME: every portfolio entry. Replace the files in /public/assets with the same names, or change the paths here.
// Fields left null are hidden. Missing files show a placeholder automatically.
const mk = (n, f) => Array.from({ length: n }, (_, i) => f(String(i + 1).padStart(2, '0'), i));
const rig = (sw, n) => mk(n, (k) => ({ id: `${sw}-${k}`, title: `RIGGING PROJECT ${k}`, software: sw.toUpperCase(),
  description: 'Short description of the project goes here. You can add a few lines about the challenge or the process.',
  image: `/assets/rigging/${sw}/${sw}-${k}.webp`, video: null, model: null, tags: ['RIGGING', 'CHARACTER', sw.toUpperCase()] }));

export const rigging = [...rig('blender', 3), ...rig('maya', 4), ...rig('harmony', 1)];

export const animation = mk(4, (k) => ({ id: `animation-${k}`, title: `ANIMATION ${k}`, software: 'SOFTWARE', description: 'Description placeholder.',
  image: `/assets/animation/animation-${k}.webp`, video: null /* `/assets/animation/animation-${k}.webm` */, model: null, tags: ['ANIMATION'] }));

export const modelling = mk(6, (k) => ({ id: `model-${k}`, title: `3D MODEL ${k}`, software: 'BLENDER', description: 'Description placeholder.',
  image: `/assets/modelling/model-${k}.webp`, video: null, model: null /* `/assets/modelling/model-${k}.glb` */, tags: ['3D MODELLING'] }));

const cats = ['SEMI-REALISTIC', 'ENVIRONMENT', 'CHARACTER DESIGN', 'SPLASH ART', 'OTHER'];
const slug = (c) => c.toLowerCase().replace(/ /g, '-');
// 2 placeholder slots per category. Add as many as you want — any aspect ratio works (never cropped).
export const illustration = cats.flatMap((c) => mk(2, (k) => ({ id: `${slug(c)}-${k}`, title: `${c} ${k}`, category: c,
  description: 'Description placeholder.', image: `/assets/illustration/${slug(c)}/${slug(c)}-${k}.webp`, tags: [c] })));

export const awards = [
  ['2024', 'AWARD TITLE 01', 'ORGANIZATION', 'HONORABLE MENTION'], ['2023', 'AWARD TITLE 02', 'ORGANIZATION', '1ST PLACE'], ['2023', 'AWARD TITLE 03', 'ORGANIZATION', 'WINNER'],
  ['2022', 'AWARD TITLE 04', 'ORGANIZATION', 'GRANT'], ['2021', 'AWARD TITLE 05', 'ORGANIZATION', 'WINNER'], ['2020', 'AWARD TITLE 06', 'ORGANIZATION', '1ST PLACE'], ['2019', 'AWARD TITLE 07', 'ORGANIZATION', 'FEATURED'],
].map(([year, title, org, badge], i) => ({ id: `award-${i + 1}`, year, title, organization: org, badge, description: '[PLACEHOLDER] Not a real award. Replace me.',
  image: `/assets/awards/award-0${i + 1}.webp` /* optional art in the picture slot; if missing the card's base drawing shows */, certificate: null }));

export const projects = mk(4, (k) => ({ id: `project-${k}`, title: `PROJECT ${k}`, description: 'Short description placeholder.', role: 'ROLE', technologies: ['TECH', 'TECH'],
  image: `/assets/projects/project-${k}.webp`, video: null, model: null, gallery: [], link: null }));

export const opinions = mk(5, (k) => ({ id: `op-${k}`, name: 'PERSON NAME', role: 'ROLE', quote: 'PLACEHOLDER QUOTE — not a real testimonial.', image: `/assets/opinions/person-${k}.webp` }));
