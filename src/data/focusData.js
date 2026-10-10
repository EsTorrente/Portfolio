// ✏️ EDIT ME: the role-focused versions of the portfolio  (#/rigging/focused · #/animation/focused · #/projects/focused).
// They reuse ALL project data/media from portfolioData.js — this file only holds the little bits that are specific to each focus:
//   role  = subtitle shown on the loading screen and in the browser tab
//   tagline = line under MAR TORRENTE in the header banner
//   nav   = which sections appear in the focused navigation (first one = the focus; every focus keeps Projects, Awards, About Me and Opinions)
//   bring = the "WHAT I BRING" list: what makes you different + proof (short lines, max ~50 characters each; 5 fit)
export const FOCUS = {
  rigging: {
    role: 'CHARACTER RIGGING',
    tagline: 'Digital Entertainment Design Engineer, Technical Artist, generalist.', // subtitle under the name in the header banner
    nav: ['rigging', 'awards', 'projects', 'about', 'opinions'],
    bring: ['Procedural animation systems', 'Fully custom rigs and tools', 'Design with animators in mind', 'Expressive and intuitive controls', 'Game ready rigs'],
  },
  animation: {
    role: '3D ANIMATION',
    tagline: 'Digital Entertainment Design Engineer, 3D Animator, generalist.',
    nav: ['animation', 'awards', 'projects', 'about', 'opinions'],
    bring: ['Technical knowledge about rigs and animation tools', 'Expressive acting with squash & stretch', 'Ambitious projects: 13-min Platillo, Regret (1M+ views)', 'Storyboard to compositing, solo or in a team', 'Picks up any tool a project demands'],
  },
  projects: {
    role: 'CREATIVE DIRECTION & PRODUCTION',
    tagline: 'Digital Entertainment Design Engineer, Creative Director, generalist.',
    nav: ['projects', 'awards', 'about', 'opinions'],
    bring: ['Idea to finished experience, start to end', 'Led teams through real deadlines', 'Technical to prototype, artistic to direct', 'Solo-made Regret at 17: 1M+ views on YouTube', 'Best DEX Project ×3 + Social & Cultural Impact'],
  },
};

// "#/rigging/focused" → { focus:'rigging', id:'rigging' } · "#/rigging/focused/awards" → { focus:'rigging', id:'awards' } · "#/awards" → { focus:null, id:'awards' } · anything else → { focus:null, id:null }
export function parseRoute(hash, sections) {
  const p = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  if (p[1] === 'focused' && FOCUS[p[0]]) { const id = FOCUS[p[0]].nav.includes(p[2]) ? p[2] : p[0]; return { focus: p[0], id }; }
  return { focus: null, id: sections.some((s) => s.id === p[0]) ? p[0] : null };
}
export const routeHash = (focus, id) => (focus ? `/${focus}/focused${id && id !== focus ? '/' + id : ''}` : '/' + id);
