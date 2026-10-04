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
  bioTitle: 'A LITTLE ABOUT ME',
  bio: [
    "I'm a 21-year-old Colombian **Engineer in Design for Digital Entertainment**, passionate about creating **characters, animations, worlds, mechanics, and interactive experiences** that can help **solve real-world problems**.",
    "I naturally tend to take on **leadership roles**. Through years of **managing teams of 6\u201330 people** in Scouts and university projects, I've developed strong skills in **organization, communication, delegation, planning**, and adapting to whatever a project needs.",
    'I believe **art, kindness, and ethical technology** can help build a more **imaginative and empathetic world**.'],
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
  contact: { name: 'Maria del Mar Torrente', title: 'Engineer in Design for Digital Entertainment', email: 'estorrentee@gmail.com', phone: '+57 319 791 3866',
    linkedin: 'https://www.linkedin.com/in/martorrente/' },
  banner: "Have an idea, a weird problem, or a project that needs figuring out?\nLet's talk!",
};
