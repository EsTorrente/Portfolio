SEO / static-HTML layer — what to do
1. Copy these files into your project (index.html, scripts/prerender.mjs, public/robots.txt, src/App.jsx).
2. DELETE src/components/AgentSummary.jsx and public/llms.txt (both are replaced; llms.txt is now generated at build time).
3. In package.json change ONE line:
     "build": "vite build"      →      "build": "vite build && node scripts/prerender.mjs"
   (your GitHub Action already runs `npm run build`, so nothing else changes.)
4. Check:  npm run build   → should print "prerender OK …"   then open dist/index.html and search for "Eridan".
   Preview:  npm run preview.   To test like a crawler: disable JavaScript in DevTools and reload.
Content comes from src/data/*.js automatically. Edit the INTRO / HIGHLIGHTS / ROLES constants at the top of scripts/prerender.mjs.
The build FAILS (on purpose) if key facts disappear from the static HTML.
