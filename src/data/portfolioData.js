// ✏️ EDIT ME: every portfolio entry. Replace the files in /public/assets with the same names, or change the paths here.
// Fields left null are hidden. Missing files show a placeholder automatically.
const mk = (n, f) => Array.from({ length: n }, (_, i) => f(String(i + 1).padStart(2, '0'), i));
const rig = (sw, n) => mk(n, (k) => ({ id: `${sw}-${k}`, title: `RIGGING PROJECT ${k}`, software: sw.toUpperCase(),
  description: 'Short description of the project goes here. You can add a few lines about the challenge or the process.',
  image: `/assets/rigging/${sw}/${sw}-${k}.webp`, video: null, model: null, tags: ['RIGGING', 'CHARACTER', sw.toUpperCase()] }));

// ---- RIGGING ---------------------------------------------------------------------------------------------
// `details` = the pop-up that opens when you click a card: `intro` paragraphs, then `blocks`, then optional `note`.
// A block is { h: 'Heading', p: 'paragraph', ul: ['bullet', ...] } (any combination, rendered in that order).
// `videos` = [{ title, src }]. Drop files at those paths; a missing file shows a "coming soon" slate instead of breaking.
// `brief` is only a reminder to yourself of what to film — it is never shown on the site.
const vids = (base, titles) => titles.map((t, i) => ({ title: t, src: `${base}-${String(i + 1).padStart(2, '0')}.webm` }));

const blender = [
  { id: 'blender-01', title: 'Eridan', subtitle: 'Custom character rig · Blender', software: 'BLENDER',
    description: 'My first fully custom character rig, built entirely from scratch without an autorig. Eridan combines a production-ready animation system with custom facial controls, procedural animation, a lightweight proxy workflow, and a stylized NPR rendering pipeline.',
    image: '/assets/rigging/blender/blender-01.webp', tags: ['Blender', 'Character Rigging', 'Facial Rig', 'Procedural Animation', 'Custom Tools'],
    videos: vids('/assets/rigging/blender/eridan', ['IK / FK & Body Isolation', 'Facial Rig & Lip Sync', 'Procedural Animation', 'Custom Shader & Lighting', 'Proxy / Performance System', 'Clothing & Physics', 'Goggles Space Switching', 'Skin Transformation', 'Automation & Secondary Controls']),
    details: {
      intro: ['Eridan is an original character and my first complete rigging project built entirely from scratch.',
        'Rather than relying on an autorig, I designed the entire system myself, from the underlying controls and deformation setup to the custom tools and animation workflows. The rig includes standard IK/FK workflows, snapping, isolation controls, facial animation, procedural animation, clothing systems, and several custom animator-friendly tools.',
        'The character was originally developed for Platillo, and is currently being rebuilt from scratch with the experience I gained from the first version, with a stronger focus on topology, performance, and a more efficient animation workflow.'],
      blocks: [
        { h: 'Rigging & deformation', ul: ['Full IK/FK switching and snapping', 'Custom tweak controls', 'Independent isolation for the arms, legs, neck, and head', 'IK shoulder automation', 'Optional foot collision with the root for easier walk cycles', 'Custom finger controller', 'Squash and stretch synchronized with blinks and eyebrow movement', 'Ear controls synchronized with the eyebrows'] },
        { h: 'Facial system', p: 'The facial rig combines bone-driven controls, shape keys, and Bendy Bones. The mouth includes specialized controls for fast facial animation, including automatically generated M, E, A, O, and P lip-sync shapes. Additional facial controls include:',
          ul: ['Chewing control', 'Jaw-driven mouth opening while keeping the lips closed', 'Zipper lips', 'Custom eye controls', 'Eyebrow and ear synchronization', 'Squash and stretch linked to facial animation'] },
        { h: 'Procedural animation', p: 'Several secondary animations can be generated procedurally and toggled directly from the custom rig UI:', ul: ['Eye highlight shake', 'Eye dart', 'Breathing'],
          after: 'This allows secondary motion to be generated without manually keyframing every detail.' },
        { h: 'Custom NPR shader', p: "I also developed a custom cartoon shader inspired by Arcane's rendering pipeline. The shader allows individual control over:",
          ul: ['Main light', 'Fill light', 'Rim light', 'Shadows', 'Ambient occlusion', 'Shadow colors', 'Rim-light colors', 'Other lighting properties'],
          after: 'It can react to an arbitrary number of lights through RGB light mapping:', rgb: [['Red', 'Key Light', '#ff5a4d'], ['Green', 'Fill Light', '#5fd16a'], ['Blue', 'Rim Light', '#5aa0ff']],
          after2: 'This creates a flexible lighting workflow while maintaining a consistent stylized look.' },
        { h: 'Performance & proxy workflow', p: 'Because the shader can become computationally expensive, I created a proxy mesh system that allows the rig to remain responsive even on older hardware. The proxy can be switched on and off directly through the custom rig UI.' },
        { h: 'Clothing & accessories', p: 'The character includes a complete set of interchangeable, rigged clothing and accessories:', ul: ['Cape', 'Goggles', 'Shirt', 'Pants', 'Boots', 'Waist cloth', 'Belt accessories', 'Gloves'],
          after: 'The clothing can be toggled on and off and is designed to work with physics bones.' },
        { h: 'Goggles', p: 'The goggles use a custom space-switching system that allows them to follow either hand. They can also stretch toward the hands while remaining children of the head, allowing the visor-pulling animation to be created without manually repositioning the entire object.' },
        { h: 'Additional effects', p: "The character's skin uses a Geometry Nodes transformation that can create a bulging and glowing effect while also modifying the character's textures." }],
      note: 'Currently being rebuilt from scratch with improved topology, performance, and workflow based on what I learned from the original rig.' } },

  { id: 'blender-02', title: 'Golub', subtitle: 'Custom character rig · Blender',  software: 'BLENDER',
    description: 'A fully custom rig for Golub, an original pigeon character created for Platillo, featuring automated flight controls, squash and stretch, procedural locomotion, and expressive secondary animation.',
    image: '/assets/rigging/blender/blender-02.webp', tags: ['Blender', 'Character Rigging', 'Procedural Animation', 'Automation'],
    videos: vids('/assets/rigging/blender/golub', ['Full Rig', 'Flight Controls', 'Procedural Walk', 'Expressive Animation']),
    brief: ['Full Rig: overall rig and controller system', 'Flight Controls: wing automation and flight movement', 'Procedural Walk: move the root; show automated jumping, walking and head movement', 'Expressive Animation: squash/stretch, eye sync, antenna/eye-glow'],
    details: {
      intro: ['Golub is an original pigeon character from Platillo, rigged entirely from scratch.',
        'The rig was designed around making a naturally awkward and expressive bird easier to animate, with custom controls that automate many of the repetitive movements involved in flight and locomotion.'],
      blocks: [{ h: 'Features', ul: ['Custom wing controllers for automated flight animation', 'Squash and stretch', 'Squash and stretch synchronized with eye animation', 'Automated walking system', 'Root-driven locomotion', 'Automatic jumping while moving', 'Head movement during locomotion', 'Custom antenna controller', 'Antenna-driven eye glow'] }] } },

  { id: 'blender-03', title: 'Skirt', subtitle: 'Deformation & cloth rig · Blender', software: 'BLENDER',
    description: 'A custom skirt rig developed for Void, designed to prevent leg clipping while maintaining animator-friendly controls and compatibility with Unity.',
    image: '/assets/rigging/blender/blender-03.webp', tags: ['Blender', 'Deformation', 'Character Rigging', 'Unity Pipeline'],
    videos: vids('/assets/rigging/blender/skirt', ['Skirt Rig']),
    brief: ['Skirt moving through a walk or leg movement, then the individual controls and the final Unity-ready setup'],
    details: {
      intro: ['Created for Void, this rig focuses on solving a practical animation problem: creating a skirt that can move naturally without clipping through the character’s legs.'],
      blocks: [{ h: 'The system includes', ul: ['Anti-clipping deformation', 'Individual rotation controls', 'Tweak controls', 'Animation-friendly deformation', 'Export compatibility for Unity'] }] } },
];

export const rigging = [...blender, ...rig('maya', 4), ...rig('harmony', 1)];

export const animation = mk(4, (k) => ({ id: `animation-${k}`, title: `ANIMATION ${k}`, software: 'SOFTWARE', description: 'Description placeholder.',
  image: `/assets/animation/animation-${k}.webp`, video: null /* `/assets/animation/animation-${k}.webm` */, model: null, tags: ['ANIMATION'] }));

export const modelling = mk(6, (k) => ({ id: `model-${k}`, title: `3D MODEL ${k}`, software: 'BLENDER', description: 'Description placeholder.',
  image: `/assets/modelling/model-${k}.webp`, video: null, model: null /* `/assets/modelling/model-${k}.glb` */, tags: ['3D MODELLING'] }));

const cats = ['SEMI-REALISTIC', 'ENVIRONMENT', 'CHARACTER DESIGN', 'SPLASH ART', 'OTHER'];
const slug = (c) => c.toLowerCase().replace(/ /g, '-');
// 2 placeholder slots per category. Add as many as you want — any aspect ratio works (never cropped).
export const illustration = cats.flatMap((c) => mk(2, (k) => ({ id: `${slug(c)}-${k}`, title: `${c} ${k}`, category: c,
  description: 'Description placeholder.', image: `/assets/illustration/${slug(c)}/${slug(c)}-${k}.webp`, tags: [c] })));

const ISSUER = 'Álvaro Enrique Ospina Sanjuan', UPB = 'Universidad Pontificia Bolivariana';
// [year (big number on the card), title, organization line, stamp, description]
export const awards = [
  ['2024', 'Best DEX Project — 2024\u201102', `${UPB} · November 2024`, 'BEST DEX', 'Awarded to the best project in the Degree in Digital Entertainment Experience (DEX) during the 2024-2 semester.'],
  ['2025', 'Project with the Greatest Social / Cultural Impact — 2025-1', `${UPB} · May 2025`, 'SOCIAL IMPACT', 'Recognized for the project with the greatest social and cultural impact during the 2025-1 semester.'],
  ['2025', 'Best DEX Project — 2025\u201102', `${UPB} · November 2025`, 'BEST DEX', 'Awarded to the best project in the Degree in Digital Entertainment Experience (DEX) during the 2025-2 semester.'],
  ['2026', 'Most Original Visual Style', `${UPB} · May 2026`, 'VISUAL STYLE', 'Awarded for the animated short Platillo, recognizing its distinctive visual style and artistic direction.'],
  ['2026', 'Excellence in Visual Design', `${UPB} · May 2026`, 'EXCELLENCE', 'Awarded for Platillo in recognition of its visual design and artistic development.'],
  ['2026', 'Best DEX Project — 2026\u201101', `${UPB} · May 2026`, 'BEST DEX', 'Awarded to the best project in the Degree in Digital Entertainment Experience (DEX) during the 2026-1 semester, for the animated short Platillo.'],
  ['2026', 'Outstanding Student — IDED 2026', `${UPB} · 2026`, 'OUTSTANDING', 'Awarded to the most outstanding student in the Ingeniería en Diseño de Entretenimiento Digital (IDED) program during 2026.'],
].map(([year, title, org, badge, desc], i) => ({ id: `award-${i + 1}`, year, title, organization: org, badge, description: i === 6 ? desc : `${desc} Issued by: ${ISSUER}.`,
  image: `/assets/awards/award-0${i + 1}.webp` /* optional art in the picture slot; if missing the card's base drawing shows */, certificate: null }));

export const projects = mk(4, (k) => ({ id: `project-${k}`, title: `PROJECT ${k}`, description: 'Short description placeholder.', role: 'ROLE', technologies: ['TECH', 'TECH'],
  image: `/assets/projects/project-${k}.webp`, video: null, model: null, gallery: [], link: null }));

export const opinions = mk(5, (k) => ({ id: `op-${k}`, name: 'PERSON NAME', role: 'ROLE', quote: 'PLACEHOLDER QUOTE — not a real testimonial.', image: `/assets/opinions/person-${k}.webp` }));
