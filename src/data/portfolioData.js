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
// `brief` is only a reminder to yourself of what to film; it is never shown on the site.
const vids = (base, titles) => titles.map((t, i) => ({ title: t, src: `${base}-${String(i + 1).padStart(2, '0')}.webm`, sound: false })); // sound:false = silent video → the site music keeps playing. Use sound:true (or delete it) on a video that HAS audio so the music fades out while it plays.

const blender = [
  { id: 'blender-01', title: 'Eridan', subtitle: "Custom Character Rig · Blender", software: 'BLENDER',
    description: "My first fully custom character rig, built entirely from scratch without an autorig. I designed the system around animator-friendly workflows, combining expressive facial controls, procedural animation, custom tools, interchangeable clothing, and a stylized NPR rendering pipeline.",
    image: '/assets/rigging/blender/blender-01.webp', tags: ['Blender', 'Character Rigging', 'Facial Rig', 'Procedural Animation', 'Custom Tools'],
    videos: vids('/assets/rigging/blender/eridan', ['IK / FK & Body Isolation', 'Facial Rig & Lip Sync', 'Procedural Animation', 'Custom Shader & Lighting', 'Proxy / Performance System', 'Clothing & Physics', 'Goggles Space Switching', 'Skin Transformation', 'Automation & Secondary Controls']),
    details: {
      intro: ["Eridan, an original character, was my first complete character rig, built entirely from scratch. Rather than treating rigging as simply connecting bones to a mesh, I approached the character as a tool that an animator would actually have to use.", "I designed the rig around reducing repetitive work, making complicated actions easier to control, and giving the animator freedom to focus on performance rather than fighting the setup.",
        'Rather than relying on an autorig, I designed the entire system myself, from the underlying controls and deformation setup to the custom tools and animation workflows. The rig includes standard IK/FK workflows, snapping, isolation controls, facial animation, procedural animation, clothing systems, and several custom animator-friendly tools.',
        'It\u2019s currently being rebuilt from scratch with the experience I gained from the first version, with a stronger focus on topology, performance, and a more efficient animation workflow.'],
      blocks: [
        { h: 'Rigging & deformation', ul: ['Full IK/FK switching and snapping', 'Custom tweak controls', 'Independent isolation for the arms, legs, neck, and head', 'IK shoulder automation', 'Optional foot collision with the root for easier walk cycles', 'Custom finger controller', 'Squash and stretch synchronized with blinks and eyebrow movement', 'Ear controls synchronized with the eyebrows'] },
        { h: 'Facial system', p: 'The facial rig combines bone-driven controls, shape keys, and Bendy Bones. The mouth includes specialized controls for fast facial animation, including automatically generated M, E, A, O, and P lip-sync shapes. Additional facial controls include:',
          ul: ['Chewing control', 'Jaw-driven mouth opening while keeping the lips closed', 'Zipper lips', 'Custom eye controls'] },
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

  { id: 'blender-02', title: 'Golub', subtitle: "Custom Character Rig · Procedural Animation · Blender",  software: 'BLENDER',
    description: "A custom rig for an intentionally awkward pigeon, designed to turn repetitive locomotion and flight animation into simple, animator-friendly controls.",
    image: '/assets/rigging/blender/blender-02.webp', tags: ['Blender', 'Character Rigging', 'Procedural Animation', 'Automation'],
    videos: vids('/assets/rigging/blender/golub', ['Full Rig', 'Flight Controls', 'Procedural Walk', 'Expressive Animation']),
    brief: ['Full Rig: overall rig and controller system', 'Flight Controls: wing automation and flight movement', 'Procedural Walk: move the root; show automated jumping, walking and head movement', 'Expressive Animation: squash/stretch, eye sync, antenna/eye-glow'],
    details: {"intro": ["Golub is an original pigeon character from Platillo. The challenge was not simply to make the character deform correctly, but to make its movement feel expressive without requiring every small motion to be animated by hand."], "blocks": [{"h": "Solving repetitive animation", "p": ["I built custom systems that automate parts of the character's locomotion, including walking, jumping, head movement, and flight.", "The animator can drive the character primarily through the root while the rig generates secondary movement around it."]}, {"h": "Expressive controls", "p": ["I also connected squash and stretch to the character's eye animation and created an antenna system that drives the eye glow, allowing small character details to respond automatically to the animation."]}, {"p": ["The goal was simple: less time fighting the rig, more time making the character feel alive."]}]} },

  { id: 'blender-03', title: 'Skirt', subtitle: "Deformation & Cloth Rig · Blender", software: 'BLENDER',
    description: "A custom deformation system developed to solve a common character-animation problem: keeping a skirt flexible and visually clean while preventing it from clipping through the legs.",
    image: '/assets/rigging/blender/blender-03.webp', tags: ['Blender', 'Deformation', 'Character Rigging', 'Unity Pipeline'],
    videos: vids('/assets/rigging/blender/skirt', ['Skirt Rig']),
    brief: ['Skirt moving through a walk or leg movement, then the individual controls and the final Unity-ready setup'],
    details: {"intro": ["The challenge was balancing three things that often fight each other: believable movement, reliable deformation, and animator control.", "I developed a custom setup with anti-clipping deformation, individual controls, and tweak controls that give the animator direct control when the automatic behavior isn’t enough."], "blocks": [{"h": "Pipeline", "p": ["The rig was also designed with the final Unity pipeline in mind, so the solution had to remain practical beyond Blender."]}, {"p": ["Rather than hiding the problem behind simulation, I built a system that gives the animator control over it."]}]} },
];

const maya = [
  { id: 'maya-01', title: 'Biped Character', subtitle: "Maya · Character Rigging", software: 'MAYA',
    description: "A character-rigging study focused on deformation quality, weight painting, and building a reliable animation-ready setup using Maya's autorig workflow.",
    image: '/assets/rigging/maya/maya-01.webp', tags: ['Maya', 'Autorig', 'Weight Painting', 'Character Rigging'],
    videos: vids('/assets/rigging/maya/biped', ['Biped Deformation']), brief: ['Character moving through several poses that show the quality of the weight painting'],
    details: {"intro": ["This project taught me an important part of rigging that is easy to overlook: a technically correct rig is only useful if the character actually deforms well.", "I focused on weight painting, deformation cleanup, and corrective adjustments to make the character behave naturally across a range of poses."], "blocks": [{"p": ["This project strengthened my ability to diagnose deformation problems and work backwards from the visual result to find the technical cause."]}]} },
  { id: 'maya-02', title: 'Dragon', subtitle: "Maya · Autorig · Driven Keys", software: 'MAYA',
    description: "A customizable dragon rig built around procedural relationships and driven-key systems, allowing the character's proportions and wing behavior to be adjusted without rebuilding the setup.",
    image: '/assets/rigging/maya/maya-02.webp', tags: ['Maya', 'Autorig', 'Driven Keys', 'Character Rigging'],
    videos: vids('/assets/rigging/maya/dragon', ['Dragon Rig']), brief: ['Customizable setup, then the driven-key wing controls'],
    details: {"intro": ["I wanted the rig to behave more like a reusable system than a one-off character setup.", "The dragon’s tail length and wing size can be adjusted, while driven keys automate different wing behaviors including flapping, stretching, and directional movement."], "blocks": [{"p": ["The project introduced me to a principle I continue to use in my work: if a relationship can be described as a system, it probably shouldn’t require a dozen manual keyframes."]}]} },
  { id: 'maya-03', title: 'Excavator', subtitle: "Mechanical Rigging · Procedural Animation · Maya", software: 'MAYA',
    description: "A mechanical rig designed to feel like a small toy vehicle, with procedural track movement and intuitive controls for operating the excavator.",
    image: '/assets/rigging/maya/maya-03.webp', tags: ['Maya', 'Mechanical Rigging', 'Procedural Animation'],
    videos: vids('/assets/rigging/maya/excavator', ['Excavator Rig']), brief: ['Excavator being "driven" with the automated track movement'],
    details: {"intro": ["Instead of animating each mechanical component independently, I designed the setup around how the object should behave when driven.", "The rig automatically handles the repetitive movement of the tracks while the animator controls the larger mechanical actions."], "blocks": [{"p": ["This project was an exercise in translating real-world mechanical behavior into a controllable animation system."]}]} },
  { id: 'maya-04', title: 'Hand', subtitle: "Driven Keys · Weight Painting · Maya", software: 'MAYA',
    description: "A compact rigging study exploring how complex hand movement can be simplified into a small set of animator-friendly attributes.",
    image: '/assets/rigging/maya/maya-04.webp', tags: ['Maya', 'Weight Painting', 'Driven Keys', 'Rigging'],
    videos: vids('/assets/rigging/maya/hand', ['Hand Controls']), brief: ['Root attributes controlling the different finger movements'],
    details: {"intro": ["Rather than controlling every finger joint individually, I built a system where the major finger movements could be driven through attributes on the root.", "The project focused on understanding the relationship between deformation, weight painting, and driven-key systems, and on finding ways to turn many individual controls into a simpler interface."]} },
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
  anim('01', { title: "Platillo: Intro", subtitle: "3D Animation · Visual Direction · Production",
    description: "The opening sequence of Platillo, a 13-minute interactive animated mystery. I contributed across the entire production pipeline, from character creation and rigging to animation, visual direction, and production coordination.",
    tags: ['3D Animation', 'Rigging', 'Modelling', 'Visual Direction'],
    details: {"intro": ["This sequence is a good example of how I tend to approach projects: I don’t restrict my thinking to a single department when solving a problem.", "Working across the whole pipeline let me see how decisions made in one part of it affected everything downstream."], "blocks": [{"h": "My role", "p": ["I was responsible for:"], "ul": ["Character modelling and texturing", "Character rigging", "Animation and animation polish", "Procedural animation systems", "Visual direction", "Production coordination", "Pipeline and workflow decisions"]}, {"p": ["That experience taught me to think beyond the individual shot: how can the system, workflow, and creative direction work together to make the final result better?"]}]} }),
  anim('02', { title: 'Platillo: Evidence 4, Hugo', subtitle: "Character Animation · Rigging · 3D",
    description: "A character-animation sequence from Platillo, taking Hugo from model to final performance through modelling, rigging, and animation.",
    tags: ['3D Animation', 'Character Animation', 'Rigging', 'Blender'],
    details: {"intro": ["Hugo was one of the characters I modelled, rigged, and animated for Platillo.", "Because I built the character and rig myself, I could approach animation and technical setup as one problem: if a movement was difficult to animate, I could change the rig rather than forcing the animation around its limitations.", "His movements are dramatic, big, and expressive, which was incredibly fun to animate and led me to enjoy the squash and stretch controllers I had designed."]} }),
  anim('03', { title: 'Akali vs Gru', subtitle: "Animation Study · Blocking · Timing",
    description: "An animation study focused on understanding why a scene works, not simply reproducing its final poses.",
    tags: ['Animation', 'Blocking', 'Posing', 'Timing'],
    details: {"intro": ["I recreated the blocking of a scene from Despicable Me using community rigs from Agora.", "Rather than focusing on polish, I used the exercise to study timing, posing, staging, anticipation, and how a small change in a pose or timing can completely change the feeling of a shot."], "blocks": [{"p": ["I use exercises like this to understand the decisions behind animation, not just the techniques used to produce it."]}]} }),
  anim('04', { title: 'Void', subtitle: 'Animation', description: '', tags: ['Animation'] }), // TODO: description / responsibilities not written yet
];

// ---- 3D MODELLING ---------------------------------------------------------------------------------------
// `images` = the gallery inside the pop-up; the first one is also the card thumbnail.
const mdl = (slug, o) => { const images = Array.from({ length: o.n }, (_, i) => `/assets/modelling/${slug}-${String(i + 1).padStart(2, '0')}.webp`); return { id: `model-${slug}`, software: 'BLENDER', images, image: images[0], ...o }; };
export const modelling = [
  mdl('granny', { n: 2, title: 'Granny', subtitle: "Character Modelling · Character Design", description: "A character created by translating a real person into a stylized fictional design, combining anatomical observation with costume, shape language, and character development.",
    tags: ['3D Modelling', 'Character Design', 'Blender'], details: {"intro": ["This project started from a real person rather than an existing fictional design.", "I first built the character through box modelling, then transformed the result into a fictional character through costume and visual design.", "The challenge was balancing recognizable anatomy with exaggerated shapes and a clear visual identity."]} }),
  mdl('aragorn', { n: 3, title: 'Aragorn', subtitle: "Character Sculpt · Blender", description: "A character sculpt built completely from scratch, focused on anatomy, proportions, facial structure, and translating a recognizable character into a 3D form.",
    tags: ['Sculpting', 'Character Modelling', 'Blender'], details: {"intro": ["Aragorn was sculpted entirely from scratch without a base mesh.", "The project challenged me to construct believable anatomy while maintaining the specific proportions and visual identity of an established character.", "It strengthened my understanding of facial structure, anatomy, secondary forms, and how small proportional decisions affect recognition."]} }),
  mdl('astronaut', { n: 2, title: 'Low-Poly Astronaut', subtitle: "Real-Time Character · VR · Optimization", description: "A lightweight character designed for real-time VR, balancing visual clarity, stylized design, and performance constraints.",
    tags: ['Low-Poly Modelling', 'VR', 'Blender', 'Optimization'], details: {"intro": ["Unlike a purely cinematic asset, this character had to function inside a real-time VR environment.", "That meant thinking about polygon density, materials, deformation, and visual readability as interconnected problems.", "The goal was not simply to make a lower-poly model, but to decide where detail actually matters to the experience, and where it doesn’t."]} }),
  mdl('eri', { n: 1, title: 'Eri: Base Mesh', subtitle: "Character Topology · Blender", description: "A reusable character base mesh designed with future sculpting, rigging, animation, and deformation in mind.",
    tags: ['Character Modelling', 'Topology', 'Blender'], details: {"intro": ["This project focuses less on the final appearance of a character and more on building a strong foundation for everything that comes afterward.", "I designed the topology to support future sculpting, deformation, rigging, and animation, treating the model as the beginning of a pipeline rather than the final product."]} }),
  mdl('steampunk-cat', { n: 2, title: 'Steampunk Cat', subtitle: "Stylized Character Modelling · Blender", description: "A stylized character combining organic anatomy with mechanical design, developed through shape language, costume, and visual storytelling.",
    tags: ['Character Modelling', 'Stylized Design', 'Blender'], details: {"intro": ["The goal was to make the mechanical elements feel like part of the character rather than decorations placed on top.", "I explored how silhouette, accessories, proportions, and material contrast could communicate personality before the character even moves."]} }),
];

// ---- 3D HAND-PAINTED TEXTURES (sub-section of 3D Modelling) ---------------------------------------------
// Files go in  public/assets/modelling/handpainted/  →  eridan-01.webp (full body), eridan-02.webp (face close-up), hugo-01/02, julia-01/02, lira-01/02, granny-01/02, astronaut-01.webp, golub-01.webp (full body)
// `imageTitles` = the label of each image inside the pop-up. Edit titles / descriptions / tags freely.
const hp = (slug, o) => { const images = Array.from({ length: o.n }, (_, i) => `/assets/modelling/handpainted/${slug}-${String(i + 1).padStart(2, '0')}.webp`); const face = (o.imageTitles || []).findIndex((t) => /face/i.test(t)); // thumbnail = the face close-up when there is one (otherwise the first image)
  return { id: `hp-${slug}`, images, image: images[face >= 0 ? face : 0], tags: ['Hand-Painted Textures', 'Texturing'], ...o }; };
export const handpaintedIntro = { title: 'Hand-Painted Textures', text: 'I use hand-painted textures to control not only how a character looks, but how they communicate under stylized lighting. My approach combines painted detail, color design, and deliberate exaggeration to support the character’s shape, personality, and final rendering style.' };
export const handpainted = [
  hp('eridan', { n: 2, title: 'Eridan', subtitle: 'Hand-Painted Texture', description: "Hand-painted character textures developed as part of Platillo, designed to work with the project’s stylized NPR rendering pipeline.", imageTitles: ['Full body', 'Face close-up'] }),
  hp('hugo', { n: 2, title: 'Hugo', subtitle: 'Hand-Painted Texture', description: "Hand-painted skin and character textures developed for Hugo, with emphasis on readable forms, stylized color, and consistency with the Platillo visual language.", imageTitles: ['Full body', 'Face close-up'] }),
  hp('julia', { n: 2, title: 'Julia', subtitle: 'Hand-Painted Texture', description: "Hand-painted skin and character textures developed for Julia, balancing expressive color with clear forms and consistency with the Platillo visual language.", imageTitles: ['Full body', 'Face close-up'] }),
  hp('lira', { n: 2, title: 'Lira', subtitle: 'Hand-Painted Texture', description: "Hand-painted skin and character textures developed for Lira, designed to keep her shapes readable while staying consistent with the Platillo visual language.", imageTitles: ['Full body', 'Face close-up'] }),
  hp('granny', { n: 2, title: 'Granny', subtitle: 'Hand-Painted Texture', description: "Hand-painted textures developed for Granny, using painted color and surface detail to reinforce her costume, shape language, and personality.", imageTitles: ['Full body', 'Face close-up'] }),
  hp('astronaut', { n: 1, title: 'Astronaut', subtitle: 'Hand-Painted Texture', description: "Hand-painted textures developed for the low-poly VR astronaut, communicating form, material, and detail without relying on geometric complexity.", imageTitles: ['Face close-up'] }),
  hp('golub', { n: 1, title: 'Golub', subtitle: 'Hand-Painted Texture', description: "Hand-painted textures developed for Golub, the pigeon from Platillo, supporting the character’s awkward personality and stylized rendering.", imageTitles: ['Full body'] }),
];

// ---- ILLUSTRATION ---------------------------------------------------------------------------------------
// Galleries: each category has a short intro (shown when that filter is selected) and `n` pieces. Any aspect ratio works (never cropped).
// Files: /assets/illustration/<slug>/<slug>-01.webp … ; splash art uses .webm (animated).
const slug = (c) => c.toLowerCase().replace(/ /g, '-');
export const illustrationIntro = {
  'SEMI-REALISTIC': { n: 4, tagline: "Characters, expression, and atmosphere", text: "Character illustrations focused on anatomy, expression, lighting, and emotional storytelling. I use semi-realistic rendering to explore not only how a character looks, but what a particular moment should feel like.", unit: 'illustrations' },
  'ENVIRONMENT': { n: 4, tagline: "Places that tell stories", text: "Environments built around atmosphere, color, scale, and visual storytelling. I enjoy using environments to suggest what happened before the viewer arrived, and what might happen next.", unit: 'illustrations' },
  'CHARACTER DESIGN': { n: 8, tagline: "Characters built from ideas", text: "Original characters developed through shape language, costume, personality, and visual storytelling. I especially enjoy turning abstract ideas into characters that feel immediately recognizable.", unit: 'illustrations' },
  'SPLASH ART': { n: 4, tagline: "Big moments", text: "Dynamic illustrations and animated pieces designed to communicate a character, world, or moment at a glance. These pieces focus on composition, movement, color, and impact.", unit: 'animated pieces', video: true },
  'OTHER': { n: 5, tagline: "Experiments, studies, and strange little ideas", text: "A collection of visual experiments, studies, sketches, and ideas that started as questions, tests, or things I simply wanted to try.", unit: 'drawings' },
};
// Splash Art pieces that are an (animated) .webp instead of a .webm: list their numbers, e.g. [3] makes splash-art-03.webp
const SPLASH_AS_IMAGE = [4];
const titleCase = (c) => c.toLowerCase().replace(/(^|[ -])(\w)/g, (m, a, b) => a + b.toUpperCase());
export const illustration = Object.entries(illustrationIntro).flatMap(([c, o]) => Array.from({ length: o.n }, (_, i) => {
  const k = String(i + 1).padStart(2, '0'), f = `/assets/illustration/${slug(c)}/${slug(c)}-${k}`;
  const asVideo = o.video && !SPLASH_AS_IMAGE.includes(i + 1); // Splash Art is .webm unless the piece number is listed in SPLASH_AS_IMAGE
  return { id: `${slug(c)}-${k}`, title: `${titleCase(c)} ${k}`, category: c, tags: [c], image: asVideo ? null : `${f}.webp`, video: asVideo ? `${f}.webm` : null };
}));

export const awardsIntro = { title: 'Recognition', text: 'Recognition I’ve received for creative direction, visual design, project development, and the impact of my work throughout my degree.' };
const ISSUER = 'Álvaro Enrique Ospina Sanjuan', UPB = 'Universidad Pontificia Bolivariana';
// [year (big number on the card), title, organization line, stamp, description]
export const awards = [
  ['2024', 'Best DEX Project (2024\u201102)', `${UPB} · November 2024`, 'BEST DEX', "Recognized as the best project produced within the DEX program during the 2024-2 semester."],
  ['2025', 'Greatest Social / Cultural Impact (2025-1)', `${UPB} · May 2025`, 'SOCIAL IMPACT', "Recognized for developing a project with significant social and cultural impact, combining creative development with a meaningful real-world purpose."],
  ['2025', 'Best DEX Project (2025\u201102)', `${UPB} · November 2025`, 'BEST DEX', "Recognized as the best project produced within the DEX program during the 2025-2 semester."],
  ['2026', 'Most Original Visual Style', `${UPB} · May 2026`, 'VISUAL STYLE', "Awarded to Platillo for its distinctive visual identity and creative approach to animated storytelling."],
  ['2026', 'Excellence in Visual Design', `${UPB} · May 2026`, 'EXCELLENCE', "Awarded to Platillo for its visual development, stylized rendering, and cohesive artistic direction."],
  ['2026', 'Best DEX Project (2026\u201101)', `${UPB} · May 2026`, 'BEST DEX', "Awarded to Platillo as the best project produced within the DEX program during the 2026-1 semester."],
  ['2026', 'Outstanding Student, IDED 2026', `${UPB} · 2026`, 'OUTSTANDING', "Recognized as the most outstanding student within the Ingeniería en Diseño de Entretenimiento Digital program in 2026."],
].map(([year, title, org, badge, desc], i) => ({ id: `award-${i + 1}`, year, title, organization: org, badge, description: i === 6 ? desc : `${desc} Issued by: ${ISSUER}.`,
  image: `/assets/awards/award-0${i + 1}.webp` /* optional art in the picture slot; if missing the card's base drawing shows */, certificate: null })).reverse(); // most recent first (ids/images stay tied to each award)

// ---- PROJECTS -------------------------------------------------------------------------------------------
// `youtube` = video id; it plays inside the pop-up. Card thumbnail defaults to the YouTube thumbnail (set `image` to use your own art instead).
const yt = (id) => ({ youtube: id, image: `https://img.youtube.com/vi/${id}/hqdefault.jpg` });
export const projects = [
  { id: 'project-platillo', title: 'Platillo', subtitle: "Interactive Animated Mystery · Producer · Visual Director", ...yt('fdkMMAWzWsQ'),
    description: "A 13-minute interactive mystery combining animation, puzzle mechanics, character-driven storytelling, and a stylized 3D production pipeline.",
    tags: ['Project Management', 'Creative Direction', 'Rigging', 'Time Management', '3D Animation', 'Texture Painting'],
    details: {
      intro: ["Platillo started as a story idea and became an interactive production involving animation, puzzle design, custom technology, art direction, and team management.",
        'Platillo is a 13-minute interactive animated mystery experience developed alongside Carolina García, Juan Manuel Arcila, Sara Ruiz, and Miguel Valencia, where each episode reveals a different perspective of the same crime.',
        'Inspired by productions such as Arcane, Spider-Verse, and Valorant, we developed a semi-realistic, hand-painted visual style built around high saturation, strong contrast, and expressive color composition.',
        "The experience is divided into six animated shorts unlocked through puzzle-solving mechanics, with every short adopting its own cinematic genre."],
      blocks: [
        { h: 'Synopsis', p: "On Eri's 20th birthday, the last slice of cake mysteriously disappears. What begins as a family celebration quickly spirals into a chaotic interrogation where everyone becomes a suspect… and everyone has something to hide." },
        { h: 'The challenge', p: ["We wanted to tell the same mystery through multiple unreliable perspectives while keeping the experience engaging and visually cohesive.", "That meant solving problems across several disciplines at once: how to structure the narrative, how to unlock the episodes, how to keep a small team moving through a four-month production cycle, and how to build a visual pipeline capable of supporting the project’s style."] },
        { h: 'My role', p: ["I worked as Producer and Visual Director, overseeing both the creative direction and production pipeline, but my role was intentionally broad. I moved between creative direction, technical development, art production, animation, and team coordination depending on what the project needed.", 'My responsibilities included:'],
          ul: ['Producing and coordinating the project pipeline and schedule', 'Leading a junior team through a four-month production cycle', 'Modelling, rigging, and texturing all five main characters', 'Developing procedural animation systems for the main rigs', 'Creating custom rigging tools and UI workflows', 'Developing proxy systems for smoother animation', 'Designing and developing a custom NPR shader pipeline inspired by Arcane', 'Creating a lighting workflow with independent control over ambient occlusion, shadows, rim lighting, and color channels', "Directing the project's soundtrack and overall visual aesthetic", 'Supervising animation polish and providing feedback across all six shorts', 'Animating the 1st and 5th shorts', 'Video editing and final compositing'] },
        { h: 'Recognition', p: 'Platillo received three awards during the university showcase:', ul: ['Most Original Visual Style', 'Excellence in Visual Design', 'Best DEX Project (2026‑01)'] },
        { h: 'What I learned', p: ["Platillo taught me that production is often less about having the perfect plan and more about finding a workable solution when reality inevitably changes it.", "I learned to identify bottlenecks, redistribute work, simplify systems when necessary, and make decisions that protected both the creative vision and the team’s ability to finish the project."] }] } },

  { id: 'project-starblitz', title: 'StarBlitz', subtitle: "Educational virtual world · Game Design · Programming · 2D/3D Art · Project Management", ...yt('xijbo6FrxBQ'),
    description: "An educational virtual world that teaches children to recognize grooming and unsafe situations by practicing real decisions and seeing their consequences, instead of being given warnings.",
    tags: ['Game Design', 'Programming', 'Project Management', 'Rigging', '3D Animation', 'Blender', 'Unity'],
    details: {"intro": ["The problem wasn’t simply “children need to be safer online.” The question was: how can we teach them to recognize danger without making learning feel like a warning?", "StarBlitz was our answer: an educational virtual world where children encounter potentially unsafe situations, make decisions, and learn to recognize suspicious behavior through the consequences of their choices. Through narrative-driven missions and guided scenarios, players learn to identify grooming signals, establish boundaries, reject inappropriate requests, and report unsafe situations — all within a playful, gamified environment."], "blocks": [{"h": "My role", "p": ["I served as Project Manager and multidisciplinary developer for a team of six, coordinating the project from concept through implementation while contributing directly to its design, programming, art, and research."], "ul": ["Programmed gameplay mechanics, interactions, and interactive systems", "Designed gameplay systems and adaptive risk scenarios", "Designed how player decisions affected the progression and presentation of scenarios", "Developed 2D and 3D assets, including character art, models, rigs, and animations", "Designed child-accessible UI/UX", "Researched online grooming, digital safety, and vulnerability factors", "Coordinated team responsibilities, deadlines, and production priorities", "Maintained project documentation and development planning"]}, {"h": "The goal", "p": ["Instead of simply telling children what to do when something feels wrong online, StarBlitz gives them a safe environment in which to practice.", "Players are guided through fictional situations and encouraged to recognize warning signs, establish boundaries, reject inappropriate requests, and report unsafe behavior. Successful decisions are reinforced through XP, items, and badges, turning an otherwise intimidating subject into something approachable and actionable.", "The goal was to help children develop the knowledge, confidence, and response habits they could draw upon if they ever encountered a similar situation in real life."]}, {"h": "Problem solving", "p": ["StarBlitz required me to move constantly between disciplines. A challenge could begin as a question of educational design, become a programming problem, require a new visual solution, and ultimately need to be reconsidered from the perspective of a child using the experience.", "Because of this, my role went beyond managing the team. I regularly designed, prototyped, programmed, tested, and iterated on systems myself, while coordinating the people and work around them.", "The project taught me how to translate a sensitive real-world problem into an experience that could be safe, approachable, and genuinely useful."]}]} },

  { id: 'project-regret', title: 'Regret', subtitle: "9-Minute 2D Animated Short · Solo Production", ...yt('fDQSp0BcJGo'),
    description: "A 9-minute animated short I created independently at 17, taking the project from concept to final delivery, and eventually reaching more than one million views on YouTube.",
    tags: ['2D Animation', 'Visual Storytelling', 'After Effects', 'Rigging'],
    details: {
      intro: ["Regret is a 9-minute 2D animated short inspired by the QSMP, and one of my earliest experiments in discovering how much of a project I could build on my own. I made it entirely by myself at 17.",
        "I handled the entire production pipeline independently: concept development, visual development, rigging, animation, compositing, editing, and final delivery.",
        "It became my most successful animation project, with more than one million views on YouTube. I also made several additional shorts set in the same universe, using them to experiment with expressive animation, visual storytelling, and rapid production workflows."
      ],
      blocks: [{ h: 'Working without a team', p: ["Without separate departments or specialists to solve problems for me, every production issue became a design problem I had to figure out myself.", "That forced me to learn quickly, simplify workflows, reuse systems, and make decisions based on what would produce the strongest result with the time and resources available."] },
        { h: 'What it taught me', p: "The project taught me something that has stayed with me ever since: I don’t need to already know how to do something before I can start building it. I need to be willing to figure it out." }] } },

  { id: 'project-tonusco', title: 'Crónicas del Tonusco', subtitle: "Augmented Reality Museum Experience · Concept · Project Lead · Programming",
    description: "An approximately 40-minute augmented reality experience in which visitors of the Juan del Corral Museum scan real objects to trigger animated scenes that place them back into their historical and cultural context.",
    tags: ['Augmented Reality', 'Interactive Storytelling', 'Historical Education', 'Unity', 'Vuforia', '3D Animation', 'Project Management'],
    // 📁 Drop your files in public/assets/projects/tonusco/ :  tonusco.webp (card thumbnail) · tonusco-01.webm (AR scanning feature) · tonusco-02.webm (all cutscenes)
    image: '/assets/projects/tonusco/tonusco.webp',
    videos: [{ title: 'AR scanning feature', src: '/assets/projects/tonusco/tonusco-01.webm', sound: false }, { title: 'Cutscenes', src: '/assets/projects/tonusco/tonusco-02.webm', sound: true }], // sound:true = the cutscenes have audio → site music fades out while they play (set false if silent)
    details: {
      intro: ['How do you make a museum object feel like more than an object?',
        'During a visit to the Juan del Corral Museum in Santa Fe de Antioquia, we noticed that visitors could see historical objects, but had few opportunities to understand the people, communities, and circumstances surrounding them.',
        'Crónicas del Tonusco was created to bridge that gap.',
        "The project is an approximately 40-minute augmented reality experience that guides visitors through the museum's exhibition using its existing collection as the foundation for an interactive historical narrative. Visitors use their phones to scan selected objects, triggering animated scenes that place those objects back into historical and cultural context.",
        'Rather than simply presenting information about an artifact, the experience asks visitors to find it, interact with it, and see it become part of a story.'],
      blocks: [
        { h: 'Finding the story', p: ["The original brief focused broadly on communicating the region's historical heritage. During our research, however, I noticed that information about the region's Black and Indigenous communities was considerably harder for the public to access, while much of the available historical material was centered around the Spanish colonial perspective.",
          'I brought this observation to the museum, where it was confirmed as an important gap they wanted to address.',
          'That became the foundation of our project.',
          "We designed the experience around the museum's existing objects and created a narrative in which the visitor takes the role of a priest positioned between Spanish and Indigenous communities.",
          "The visitor's decisions influence the way events are interpreted and how the story unfolds. One path encourages greater openness and understanding toward Indigenous communities, while another reflects the prejudices and worldview of the colonial perspective.",
          'This allowed us to explore not only what happened, but also how perspective influences the way history is recorded, interpreted, and communicated.'] },
        { h: 'Research & historical reconstruction', p: ['Because the project dealt with real historical communities, research became one of its biggest challenges.',
          'We created a decision-flow diagram and continuously revised it against our sources. We produced multiple research reports, constructed parallel timelines for the Indigenous and Spanish sides of the story, researched historical locations and mapped them using Google Maps and Illustrator, and created sensory documentation to better understand the environments we were reconstructing.',
          'One of the biggest difficulties was the imbalance in available sources. Information about Spanish colonization was comparatively accessible, while information about Indigenous communities was more limited and was often recorded through European perspectives.',
          'When we encountered elements of our original story that could not be adequately supported, we changed them rather than presenting speculation as fact.',
          "When our initial research wasn't enough, members of the team, including myself, returned to Santa Fe de Antioquia to investigate further and fill gaps.",
          'This process made the final experience more historically rigorous while also making us more conscious of the limitations and biases within the historical record itself.'] },
        { h: 'Building the experience', p: ['The project combined Blender, Unity, Vuforia, and After Effects into a single interactive pipeline.',
          'Historical environments, objects, and characters were created and prepared in Blender. Animation and cinematics were produced there and later polished and edited in After Effects.',
          'Unity served as the interactive layer, bringing together:'],
          ul: ['Augmented reality object recognition through Vuforia', 'Branching narrative logic', 'Interactive minigames', 'Player decisions and progression', 'UI and interaction systems', 'Cinematic triggers', 'Object-scanning interactions'],
          after: 'At the end of each narrative sequence, visitors are prompted to find a specific museum object. Scanning it with their phone can trigger a cinematic based on their previous decisions or introduce a new interaction involving the object.',
          after2: "The museum artifacts therefore aren't simply references to the story. They become the interface through which the visitor enters it." },
        { h: 'Animation at scale', p: ["With approximately 40 minutes of content and two different narrative paths, producing every animation entirely by hand would have been impractical, especially because this was only our third semester, and my team members had never animated in Blender before.",
          'To make the scope achievable while still creating believable performances, we incorporated motion capture into much of the animation pipeline.',
          'I guided my classmates through the Blender animation workflow, helping them learn how to work with the mocap data, adapt it to our characters, clean and adjust performances, and integrate the animation into the rest of the project.',
          "This allowed us to produce a much larger amount of animation while maintaining a manageable production schedule, rather than sacrificing the project's narrative scope simply because of our team's experience level.",
          'I also handled the texturing of the characters, alongside my work in rigging, animation, programming, UI, and the rest of the production pipeline.'] },
        { h: 'My role', p: ['I originated the concept and led the multidisciplinary team, while also working directly across the technical, artistic, and research sides of the project.', 'My responsibilities included:'],
          ul: ['Project leadership and coordination', 'Concept development and narrative design', 'Historical research', 'Branching narrative and decision design', 'AR interaction programming in Unity', 'Vuforia image/object recognition and interaction', 'Gameplay and minigame programming', 'UI/UX design and implementation', 'Character rigging', 'Character animation', 'Motion-capture integration and cleanup', 'Character texturing', '3D asset and environment production', 'Sound design', 'Production planning and task distribution', 'Guiding teammates through Blender animation workflows'],
          after: 'Because most of my classmates were encountering Blender animation for the first time, part of my role was also teaching and supporting the team throughout production, helping them understand the tools, workflows, and technical problems they encountered rather than simply completing my own assigned tasks.' },
        { h: 'The challenge', p: ['Crónicas del Tonusco required me to constantly move between disciplines.',
          'A problem could begin as a historical research question, become a narrative design problem, turn into a programming challenge, require a new visual solution, and then need to be reconsidered from the perspective of a museum visitor.',
          'At the same time, I was helping coordinate a team working with unfamiliar tools and a large production scope.',
          'The project taught me how to scale an ambitious idea to the people, time, and technology available without losing sight of what made the idea meaningful.'] },
        { h: 'What I learned', p: ['The most important lesson from Crónicas del Tonusco was that technology is most useful when it solves a communication problem.',
          "We could have used augmented reality simply because it was interesting. Instead, we asked what AR could do that a traditional museum label couldn't.",
          "The result was an experience where visitors don't just read about an object."],
          ul: ['They find it.', 'They scan it.', 'They interact with it.', 'And they see it become part of a story.'],
          after: 'For me, that became the real value of the project: learning how to combine research, storytelling, programming, art, animation, and team leadership into a single experience where every technical decision exists in service of the audience.' },
        { h: 'Skills', p: 'Project Management · Creative Direction · Unity · C# · Vuforia · Augmented Reality · Interactive Storytelling · Blender · 3D Animation · Motion Capture · Character Rigging · Character Texturing · UI/UX · Game Design · Historical Research · Sound Design' }] } },
];

export const opinions = mk(5, (k) => ({ id: `op-${k}`, name: 'PERSON NAME', role: 'ROLE', quote: 'PLACEHOLDER QUOTE: not a real testimonial.', image: `/assets/opinions/person-${k}.webp` }));
