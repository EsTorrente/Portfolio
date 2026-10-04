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
const vids = (base, titles) => titles.map((t, i) => ({ title: t, src: `${base}-${String(i + 1).padStart(2, '0')}.webm`, sound: false })); // sound:false = silent video → the site music keeps playing. Use sound:true (or delete it) on a video that HAS audio so the music fades out while it plays.

const blender = [
  { id: 'blender-01', title: 'Eridan', subtitle: 'Custom character rig · Blender', software: 'BLENDER',
    description: 'My first fully custom character rig, built entirely from scratch without an autorig. Eridan combines a production-ready animation system with custom facial controls, procedural animation, a lightweight proxy workflow, and a stylized NPR rendering pipeline.',
    image: '/assets/rigging/blender/blender-01.webp', tags: ['Blender', 'Character Rigging', 'Facial Rig', 'Procedural Animation', 'Custom Tools'],
    videos: vids('/assets/rigging/blender/eridan', ['IK / FK & Body Isolation', 'Facial Rig & Lip Sync', 'Procedural Animation', 'Custom Shader & Lighting', 'Proxy / Performance System', 'Clothing & Physics', 'Goggles Space Switching', 'Skin Transformation', 'Automation & Secondary Controls']),
    details: {
      intro: ['Eridan is an original character and my first complete rigging project built entirely from scratch.',
        'Rather than relying on an autorig, I designed the entire system myself, from the underlying controls and deformation setup to the custom tools and animation workflows. The rig includes standard IK/FK workflows, snapping, isolation controls, facial animation, procedural animation, clothing systems, and several custom animator-friendly tools.',
        'It\u2019s currently being rebuilt from scratch with the experience I gained from the first version, with a stronger focus on topology, performance, and a more efficient animation workflow.'],
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
        { h: 'Additional effects', p: "The character's skin uses a Geometry Nodes transformation that can create a bulging and glowing effect while also modifying the character's textures." }] } },

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

const maya = [
  { id: 'maya-01', title: 'Biped Character', subtitle: 'Maya · Autorig', software: 'MAYA',
    description: "A university rigging exercise focused on building a biped character with Maya's autorig system and achieving clean deformation through careful weight painting.",
    image: '/assets/rigging/maya/maya-01.webp', tags: ['Maya', 'Autorig', 'Weight Painting', 'Character Rigging'],
    videos: vids('/assets/rigging/maya/biped', ['Biped Deformation']), brief: ['Character moving through several poses that show the quality of the weight painting'],
    details: { intro: ["A university rigging exercise using Maya's autorig workflow.", 'The base mesh was provided, allowing the focus to remain on:'],
      blocks: [{ ul: ['Character setup', 'Autorig workflow', 'Weight painting', 'Deformation quality', 'Corrective adjustments'] }] } },
  { id: 'maya-02', title: 'Dragon', subtitle: 'Maya · Autorig · Driven Keys', software: 'MAYA',
    description: 'A customizable dragon autorig created for a university course, featuring adjustable proportions and driven-key animation systems.',
    image: '/assets/rigging/maya/maya-02.webp', tags: ['Maya', 'Autorig', 'Driven Keys', 'Character Rigging'],
    videos: vids('/assets/rigging/maya/dragon', ['Dragon Rig']), brief: ['Customizable setup, then the driven-key wing controls'],
    details: { intro: ["A dragon rigging exercise built with Maya's autorig workflow."],
      blocks: [{ p: 'The setup was designed to accommodate different dragon proportions, including adjustable:', ul: ['Tail length', 'Wing size', 'Other character dimensions'] },
        { p: 'The rig also uses driven keys to automate:', ul: ['Wing flapping', 'Wing stretching', 'Forward/backward wing movement'] }] } },
  { id: 'maya-03', title: 'Excavator', subtitle: 'Maya · Mechanical Rigging', software: 'MAYA',
    description: 'A university rigging exercise focused on making an excavator feel like a toy vehicle, including procedural wheel-track animation.',
    image: '/assets/rigging/maya/maya-03.webp', tags: ['Maya', 'Mechanical Rigging', 'Procedural Animation'],
    videos: vids('/assets/rigging/maya/excavator', ['Excavator Rig']), brief: ['Excavator being "driven" with the automated track movement'],
    details: { intro: ['The goal of this assignment was to create a mechanical rig that felt intuitive and playful to operate.', 'The excavator was designed around a toy-car-like driving experience, with procedural animation for its wheel tracks.'] } },
  { id: 'maya-04', title: 'Hand', subtitle: 'Maya · Driven Keys · Weight Painting', software: 'MAYA',
    description: 'A rigging exercise focused on weight painting and driven-key workflows, with the entire hand controlled through attributes on the root.',
    image: '/assets/rigging/maya/maya-04.webp', tags: ['Maya', 'Weight Painting', 'Driven Keys', 'Rigging'],
    videos: vids('/assets/rigging/maya/hand', ['Hand Controls']), brief: ['Root attributes controlling the different finger movements'],
    details: { intro: ["The objective was to explore Maya's weight-painting and driven-key systems by building a hand that could be fully controlled through attributes placed on the root."] } },
];

const harmony = [
  { id: 'harmony-01', title: 'Aria', subtitle: 'Harmony · Character Rigging', software: 'HARMONY',
    description: 'A Harmony character rig developed as part of my 2D animation work.',
    image: '/assets/rigging/harmony/harmony-01.webp', tags: ['Harmony', 'Character Rigging', '2D Animation'],
    videos: vids('/assets/rigging/harmony/aria', ['Aria Rig']),
    details: { intro: ['A Harmony character rig developed as part of my 2D animation work.'] } },
];

export const rigging = [...blender, ...maya, ...harmony];

// ---- ANIMATION ------------------------------------------------------------------------------------------
// One video slot each: /assets/animation/animation-01.webm … (card thumbnail: animation-01.webp)
const anim = (n, o) => ({ id: `animation-${n}`, image: `/assets/animation/animation-${n}.webp`, videos: [{ title: o.title, src: `/assets/animation/animation-${n}.webm` }], ...o });
export const animation = [
  anim('01', { title: 'Platillo — Intro', subtitle: '3D Animation · Direction · Production',
    description: 'The opening sequence of Platillo, a 13-minute interactive animated mystery experience that I produced and directed.',
    tags: ['3D Animation', 'Rigging', 'Modelling', 'Visual Direction'],
    details: { intro: ['The intro sequence for Platillo.', "I modelled, rigged, and animated the characters used in the scene, while also contributing to the project's overall visual direction and production pipeline."],
      blocks: [{ p: 'My responsibilities included:', ul: ['Character modelling', 'Character rigging', 'Character animation', 'Animation polish', 'Visual direction', 'Production coordination'] }] } }),
  anim('02', { title: 'Platillo — Evidence 4: Hugo', subtitle: 'Character Animation',
    description: 'A character animation sequence from Platillo, featuring a character modelled, rigged, and animated by me.',
    tags: ['3D Animation', 'Character Animation', 'Rigging', 'Blender'],
    details: { intro: ['This sequence focuses on Hugo, one of the characters from Platillo.'], blocks: [{ p: "I was responsible for the character's:", ul: ['Modelling', 'Rigging', 'Animation'] }] } }),
  anim('03', { title: 'Akali vs Gru', subtitle: 'Animation Study · Blocking',
    description: 'An animation study created using Agora community rigs, recreating the blocking of a scene from Despicable Me.',
    tags: ['Animation', 'Blocking', 'Posing', 'Timing'],
    details: { intro: ['This exercise focused on studying animation timing, posing, staging, and blocking.', 'I used community rigs from Agora to recreate the blocking of a scene from Despicable Me, focusing on understanding the underlying animation choices rather than producing a final polished sequence.'] } }),
  anim('04', { title: 'Void', subtitle: 'Animation', description: '', tags: ['Animation'] }), // TODO: description / responsibilities not written yet
];

// ---- 3D MODELLING ---------------------------------------------------------------------------------------
// `images` = the gallery inside the pop-up; the first one is also the card thumbnail.
const mdl = (slug, o) => { const images = Array.from({ length: o.n }, (_, i) => `/assets/modelling/${slug}-${String(i + 1).padStart(2, '0')}.webp`); return { id: `model-${slug}`, software: 'BLENDER', images, image: images[0], ...o }; };
export const modelling = [
  mdl('granny', { n: 2, title: 'Granny', subtitle: 'Character Modelling', description: 'A character modelling exercise based on a real person, transformed into a fictional character through costume and design.',
    tags: ['3D Modelling', 'Character Design', 'Blender'], details: { intro: ['For this assignment, I started by box modelling a real person, then transformed the character into a fictional interpretation through costume and styling.'] } }),
  mdl('aragorn', { n: 3, title: 'Aragorn', subtitle: 'Character Sculpt', description: 'A character sculpt created completely from scratch without using a base mesh.',
    tags: ['Sculpting', 'Character Modelling', 'Blender'], details: { intro: ['A character sculpting exercise focused on building the entire model from the ground up.', 'No base mesh was used.'] } }),
  mdl('astronaut', { n: 2, title: 'Low-Poly Astronaut', subtitle: 'Game & VR Modelling', description: 'A lightweight astronaut character designed for use in VR.',
    tags: ['Low-Poly Modelling', 'VR', 'Blender', 'Optimization'], details: { intro: ['A low-poly character created with real-time performance in mind, designed for a VR environment.'] } }),
  mdl('eri', { n: 1, title: 'Eri — Base Mesh', subtitle: 'Character Topology', description: 'A clean character base mesh designed as a flexible starting point for future character work.',
    tags: ['Character Modelling', 'Topology', 'Blender'], details: { intro: ['A character base mesh focused on clean topology and a reusable structure for further sculpting, modelling, rigging, and animation.'] } }),
  mdl('steampunk-cat', { n: 2, title: 'Steampunk Cat', subtitle: 'Character Modelling', description: 'A stylized steampunk-inspired cat character combining organic forms with mechanical design elements.',
    tags: ['Character Modelling', 'Stylized Design', 'Blender'], details: { intro: ['A character modelling project exploring stylized shapes, mechanical accessories, and visual storytelling through costume design.'] } }),
];

// ---- ILLUSTRATION ---------------------------------------------------------------------------------------
// Galleries: each category has a short intro (shown when that filter is selected) and `n` pieces. Any aspect ratio works (never cropped).
// Files: /assets/illustration/<slug>/<slug>-01.webp … ; splash art uses .webm (animated).
const slug = (c) => c.toLowerCase().replace(/ /g, '-');
export const illustrationIntro = {
  'SEMI-REALISTIC': { n: 4, text: 'Character-focused illustrations exploring anatomy, expression, lighting, and painterly rendering.', unit: 'illustrations' },
  'ENVIRONMENT': { n: 4, text: 'Imagined places, landscapes, and atmospheric scenes built around light, color, scale, and storytelling.', unit: 'illustrations' },
  'CHARACTER DESIGN': { n: 8, text: 'Original characters developed through shape language, costume, expression, and visual personality.', unit: 'illustrations' },
  'SPLASH ART': { n: 4, text: 'Dynamic illustrations created to communicate a character, world, or moment through composition and atmosphere.', unit: 'animated pieces', video: true },
  'OTHER': { n: 5, text: "A collection of drawings, experiments, studies, and ideas that don't quite fit anywhere else.", unit: 'drawings' },
};
// Splash Art pieces that are an (animated) .webp instead of a .webm: list their numbers, e.g. [3] makes splash-art-03.webp
const SPLASH_AS_IMAGE = [4];
const titleCase = (c) => c.toLowerCase().replace(/(^|[ -])(\w)/g, (m, a, b) => a + b.toUpperCase());
export const illustration = Object.entries(illustrationIntro).flatMap(([c, o]) => Array.from({ length: o.n }, (_, i) => {
  const k = String(i + 1).padStart(2, '0'), f = `/assets/illustration/${slug(c)}/${slug(c)}-${k}`;
  const asVideo = o.video && !SPLASH_AS_IMAGE.includes(i + 1); // Splash Art is .webm unless the piece number is listed in SPLASH_AS_IMAGE
  return { id: `${slug(c)}-${k}`, title: `${titleCase(c)} ${k}`, category: c, tags: [c], image: asVideo ? null : `${f}.webp`, video: asVideo ? `${f}.webm` : null };
}));

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
  image: `/assets/awards/award-0${i + 1}.webp` /* optional art in the picture slot; if missing the card's base drawing shows */, certificate: null })).reverse(); // most recent first (ids/images stay tied to each award)

// ---- PROJECTS -------------------------------------------------------------------------------------------
// `youtube` = video id; it plays inside the pop-up. Card thumbnail defaults to the YouTube thumbnail (set `image` to use your own art instead).
const yt = (id) => ({ youtube: id, image: `https://img.youtube.com/vi/${id}/hqdefault.jpg` });
export const projects = [
  { id: 'project-platillo', title: 'Platillo', subtitle: '13-minute interactive animated mystery · Producer & Visual Director', ...yt('fdkMMAWzWsQ'),
    description: 'A 13-minute interactive animated mystery experience where six short films reveal different perspectives of the same crime.',
    tags: ['Project Management', 'Creative Direction', 'Rigging', 'Time Management', '3D Animation', 'Texture Painting'],
    details: {
      intro: ['Platillo is a 13-minute interactive animated mystery experience developed alongside Carolina García, Juan Manuel Arcila, Sara Ruiz, and Miguel Valencia, where each episode reveals a different perspective of the same crime.',
        'Inspired by productions such as Arcane, Spider-Verse, and Valorant, we developed a semi-realistic, hand-painted visual style built around high saturation, strong contrast, and expressive color composition.',
        "The experience is divided into six animated shorts unlocked through puzzle-solving mechanics. Each episode explores the story through a different family member's distorted perspective, with every short adopting its own cinematic genre."],
      blocks: [
        { h: 'Synopsis', p: "On Eri's 20th birthday, the last slice of cake mysteriously disappears. What begins as a family celebration quickly spirals into a chaotic interrogation where everyone becomes a suspect… and everyone has something to hide." },
        { h: 'My role', p: ['I worked as Producer and Visual Director, overseeing both the creative direction and production pipeline.', 'My responsibilities included:'],
          ul: ['Producing and coordinating the project pipeline and schedule', 'Leading a junior team through a four-month production cycle', 'Modelling, rigging, and texturing all five main characters', 'Developing procedural animation systems for the main rigs', 'Creating custom rigging tools and UI workflows', 'Developing proxy systems for smoother animation', 'Designing and developing a custom NPR shader pipeline inspired by Arcane', 'Creating a lighting workflow with independent control over ambient occlusion, shadows, rim lighting, and color channels', "Directing the project's soundtrack and overall visual aesthetic", 'Supervising animation polish and providing feedback across all six shorts', 'Animating the 1st and 5th shorts', 'Video editing and final compositing'] },
        { h: 'Recognition', p: 'Platillo received three awards during the university showcase:', ul: ['Most Original Visual Style', 'Excellence in Visual Design', 'Best DEX Project — 2026‑01'] }] } },

  { id: 'project-starblitz', title: 'StarBlitz', subtitle: 'Educational Virtual World · Project Manager', ...yt('xijbo6FrxBQ'),
    description: 'An educational virtual world designed to help children recognize inappropriate interactions and grooming signals in digital environments.',
    tags: ['Rigging', '3D Animation', 'Blender', 'Project Management'],
    details: {
      intro: ['StarBlitz is an educational virtual world designed to help children recognize and respond to inappropriate interactions and signs of grooming in digital environments.',
        'Through narrative missions and guided scenarios, players learn to identify suspicious behavior, establish boundaries, and report unsafe situations — all within a gamified experience rather than through traditional instruction.',
        'I worked as Project Manager for a multidisciplinary team of six, coordinating the development pipeline while ensuring that the project met both its technical and educational goals.'],
      blocks: [
        { h: 'My contributions', ul: ['Game design and systems design for adaptive risk scenarios', 'Programming gameplay mechanics and interactions', '2D/3D art production, including characters, models, rigging, and animation', 'Accessible UI/UX design for children', 'Extensive research into digital safety, grooming, and vulnerability factors', 'Team leadership, planning, delegation, and documentation'] },
        { h: 'Goal', p: ['The project aims to empower children by reinforcing safe digital habits through positive reinforcement.', 'Players are rewarded for recognizing grooming signals, rejecting inappropriate requests, and reporting unsafe situations.', "Rather than simply restricting children's access to the internet, StarBlitz explores how interactive experiences can teach them to navigate digital spaces more safely."] }] } },

  { id: 'project-regret', title: 'Regret', subtitle: '2D Animated Short · Solo Production', ...yt('fDQSp0BcJGo'),
    description: 'A 9-minute 2D animated short created entirely by me at age 17, inspired by the QSMP and produced through the complete animation pipeline.',
    tags: ['2D Animation', 'Visual Storytelling', 'After Effects', 'Rigging'],
    details: {
      intro: ['Regret is a 9-minute 2D animated short inspired by the QSMP, created entirely by me when I was 17.',
        'I handled the project from concept through final delivery, managing the complete production pipeline independently.',
        'The project became my most successful animation project, accumulating more than one million views on YouTube.',
        'I also developed several additional animated shorts inspired by the same universe, using them to experiment with expressive animation, visual storytelling, and rapid production workflows.'],
      blocks: [{ h: 'What I developed', ul: ['Concept and visual development', '2D character animation', 'Visual storytelling', 'Rigging', 'Compositing', 'Editing', 'Full project production'] }] } },
];

export const opinions = mk(5, (k) => ({ id: `op-${k}`, name: 'PERSON NAME', role: 'ROLE', quote: 'PLACEHOLDER QUOTE — not a real testimonial.', image: `/assets/opinions/person-${k}.webp` }));
