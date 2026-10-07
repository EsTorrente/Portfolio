// ✏️ EDIT ME: site-wide text.
export const site = {
  name: 'MAR TORRENTE',
  logo: '/assets/intro/white-logo.webp', // intro logo (swap for an animated .webp/.webm later)
  logoVideo: null, // e.g. '/assets/intro/intro-logo.webm'
  clockLabel: true,
  tagline: 'CAN YOU TELL I LIKE ORANGE AND YELLOW?',
  // Lines typed in the small window (bottom-right of the desktop)
  welcome: ['> Welcome to my', '  digital portfolio.', '', '> Click on an icon', '  to explore.'],
};

export const about = {
  bioTitle: 'ABOUT ME',
  // ✏️ ABOUT TEXT. Use **double asterisks** for bold. In `bio`: a plain string = paragraph, { h: 'HEADING' } = small heading, { p: '…', quote: true } = highlighted line.
  headline: `I like **difficult problems, ambitious ideas,** and figuring out how to make them real.`,
  bio: [
    { h: 'WHO I AM' },
    `I'm a Colombian **Engineer in Design for Digital Entertainment** and a **multidisciplinary artist** working across **3D art, animation, rigging, illustration, programming, and interactive experiences**.`,
    { h: 'WHAT I MAKE' },
    `My work ranges from **custom character rigs and procedural animation systems** to **animated films, educational games, and interactive projects**. I've worked across the **full animation pipeline** (from concept and storyboarding through modelling, rigging, animation, rendering, editing, and compositing) and I'm comfortable learning new tools whenever a project demands it.`,
    { h: 'ADAPTABILITY' },
    `One of my biggest strengths is **adaptability**. I'm comfortable being the person who says, \u201cI don't know how to do this yet. Let me figure it out.\u201d`,
    `That mindset has taken me from **character animation** to **rigging, procedural systems, shaders, VR, game design, programming, interactive storytelling, and production management**.`,
    { h: 'TEAMS & RECOGNITION' },
    `I've also **led multidisciplinary teams and production pipelines** throughout university, with projects receiving **three Best Project awards**, a **Social & Cultural Impact award**, an **Excellence in Visual Design award**, and the **Outstanding Student award** for my degree.`,
    `Outside university, my independent animated short **Regret**, produced entirely by me at 17, surpassed **1 million views on YouTube**.`,
    { h: 'BETWEEN CREATIVE & TECHNICAL' },
    `I enjoy being somewhere between the creative and the technical: understanding **how something should feel**, figuring out **how it needs to work**, and building whatever systems are necessary to get there.`,
    { p: `I don't always know how to build something when I start. That's usually where things get interesting.`, quote: true },
  ],
  moreButton: 'TELL ME MORE',
  more: { // the big pop-up opened by the "tell me more" button
    title: `WHAT I'M LOOKING FOR`,
    blocks: [
      `I'm interested in projects where **art and technology have to work together** \u2014 games, animation, interactive experiences, digital worlds, character-driven experiences, technical art, and anything else that sits somewhere between disciplines.`,
      `I'm especially drawn to **strong worlds, expressive characters, unusual ideas,** and problems that don't have an obvious solution.`,
      `I want to work with people who care about making things **beautiful, thoughtful, playful, and meaningful**.`,
      { quote: `If a project makes me think, \u201cI've never done this before, but I really want to figure it out,\u201d I'm probably interested.` },
    ],
    chatTitle: 'WHY DO I DO SO MANY THINGS?',
    chatIntro: `Why not? I'm a human. I'm wired to be **curious**.`,
    chat: [ // [speaker, line] — speakers: 'DEERCAT' (left) or 'MAR' (right)
      ['DEERCAT', `She means she gets obsessed with questions and finding their answers.`],
      ['MAR', `I do not.`],
      ['DEERCAT', `You learned rigging because you made up a short film in your head and needed to figure out how to make it real in a single week.`],
      ['MAR', `That was completely reasonable.`],
      ['DEERCAT', `You built a shader from scratch because you couldn't accept having mediocre shadows.`],
      ['MAR', `...also reasonable.`],
      ['DEERCAT', `She is incurable.`],
      ['MAR', `Anyway.`],
    ],
    avatars: { DEERCAT: '/assets/intro/color-logo.webp', MAR: '/assets/about/me.webp' }, // MAR: your picture (set to null to go back to the "M" letter)
    closingTitle: 'WHAT I WANT MY WORK TO DO',
    closing: [
      `I love coming up with ideas, but I care just as much about **what those ideas can do once they leave my head**.`,
      `To me, a good idea becomes much more interesting when it can **make someone feel something, teach them something, solve a problem, spark curiosity, and help build a kinder world**.`,
      `I'm particularly interested in how creative technology can be used to make experiences that are not only entertaining, but also **empathetic, thoughtful, and meaningful**.`,
      `Ultimately, I want to build things that are **imaginative, technically interesting, and useful for something beyond themselves**. Whether that means telling a story, solving a practical problem, teaching something, or simply making someone curious enough to click one more thing, I want my work to give people **a reason to interact with it**.`,
    ],
    closeButton: 'BACK TO ABOUT',
  },
  sticker: 'Absolute generalist', // text on the yellow sticky note under your picture
  skillsTitle: 'MAIN SKILLS',
  skills: ['Project Management', 'Rigging', '3D Animation', 'Experience Design', 'Emotional Storytelling', 'Creative Direction'],
  learnTitle: 'LOOKING TO LEARN',
  learn: [
    { name: 'Houdini', text: 'Procedural workflows, simulations, and technical art.' },
    { name: 'Moho' },
    { name: 'Advanced Simulations' },
    { name: 'Unreal Engine', text: 'Real-time environments, interactive experiences.' }],
  // Program icons live in public/assets/icons/<Name>.webp. (If an icon is missing, the tile falls back to `short` on the colour `c`.)
  software: [{ name: 'Blender', icon: '/assets/icons/Blender.webp', short: 'Bl', c: '#ea7600' }, { name: 'Maya', icon: '/assets/icons/Maya.webp', short: 'Ma', c: '#1a9a9a' },
    { name: 'Harmony', icon: '/assets/icons/Harmony.webp', short: 'H', c: '#222' }, { name: 'Unity', icon: '/assets/icons/Unity.webp', short: 'U', c: '#333' },
    { name: 'MotionBuilder', icon: '/assets/icons/MotionBuilder.webp', short: 'Mb', c: '#2a5a2a' }, { name: 'After Effects', icon: '/assets/icons/AfterEffects.webp', short: 'Ae', c: '#1a1a4a' }],
  contact: { name: 'Maria del Mar Torrente', title: 'Digital Entertainment Design Engineer', email: 'estorrentee@gmail.com', phone: '+57 319 791 3866',
    linkedin: 'https://www.linkedin.com/in/martorrente/' },
  banner: "Have an idea, a weird problem, or a project that needs figuring out?\nLet's talk!",
};
