# Mar Torrente — portfolio
`npm install` → `npm run dev` · `npm run build` · push to `main` on GitHub (Settings → Pages → Source: GitHub Actions) to deploy.
**Content:** `src/data/*.js` (all text + file paths). **Files:** `public/assets/...` (same names = auto-replaced; missing files show a placeholder).
Your drawings live in `public/assets/ui/` (main-window, about-layout, small-window, award-card) and `public/assets/icons/`, `intro/`, `backgrounds/`.
Section URLs: `/#/rigging`, `/#/about`, …

## Deploying to GitHub Pages
The Actions workflow is in `deploy-workflow.yml` (kept at the root so Windows can unzip it). On GitHub: **Add file → Create new file**, type the name `.github/workflows/deploy.yml`, paste the contents of `deploy-workflow.yml`, commit. Then Settings → Pages → Source: **GitHub Actions**.
