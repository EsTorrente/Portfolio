// ✏️ EDIT ME: the role-focused versions of the portfolio  (#/rigging/focused · #/animation/focused · #/projects/focused).
// They reuse ALL project data/media from portfolioData.js — this file only holds the little bits that are specific to each focus:
//   role  = subtitle shown on the loading screen and in the browser tab
//   tagline = line under MAR TORRENTE in the header banner
//   nav   = which sections appear in the focused navigation (first one = the focus; every focus keeps Projects, Awards, About Me and Opinions)
//   bring = the "WHAT I BRING" list (short lines; 4 fit best)
export const FOCUS = {
  rigging: {
    role: 'CHARACTER RIGGING',
    tagline: 'Digital Entertainment Design Engineer, Technical Artist, generalist.', // subtitle under the name in the header banner
    nav: ['rigging', 'awards', 'projects', 'about', 'opinions'],
    bring: ['Clean and efficient rigs for animation and games', 'Facial, cloth and prop setup', 'Custom tools and workflows', 'Problem solving & optimization'],
  },
  animation: {
    role: '3D ANIMATION',
    tagline: 'Digital Entertainment Design Engineer, 3D Animator, generalist.',
    nav: ['animation', 'awards', 'projects', 'about', 'opinions'],
    bring: ['3D animation for shorts and moving artworks', 'Emotional storytelling and performance', 'Animator-friendly custom rigs', 'Creative direction and project management'],
  },
  projects: {
    role: 'CREATIVE DIRECTION & PRODUCTION',
    tagline: 'Digital Entertainment Design Engineer, Creative Director, generalist.',
    nav: ['projects', 'awards', 'about', 'opinions'],
    bring: ['Project management and creative direction', 'Experience design and storytelling', 'Multidisciplinary 2D / 3D production', 'Leading and mentoring small teams'],
  },
};

// "#/rigging/focused" → { focus:'rigging', id:'rigging' } · "#/rigging/focused/awards" → { focus:'rigging', id:'awards' } · "#/awards" → { focus:null, id:'awards' } · anything else → { focus:null, id:null }
export function parseRoute(hash, sections) {
  const p = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  if (p[1] === 'focused' && FOCUS[p[0]]) { const id = FOCUS[p[0]].nav.includes(p[2]) ? p[2] : p[0]; return { focus: p[0], id }; }
  return { focus: null, id: sections.some((s) => s.id === p[0]) ? p[0] : null };
}
export const routeHash = (focus, id) => (focus ? `/${focus}/focused${id && id !== focus ? '/' + id : ''}` : '/' + id);
