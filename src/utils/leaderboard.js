// LEADERBOARDS — one per mini-game. Players are a 3-emoji combo (no names, no accounts).
// • LEADERBOARD_URL empty  → scores are kept on THIS device only (nothing to set up).
// • LEADERBOARD_URL = your Cloudflare Worker address → everybody sees the same board, stored in leaderboard.json in your GitHub repo.
//   Setup steps are at the top of worker/leaderboard-worker.js.
export const LEADERBOARD_URL = '';

export const EMOJI = ['🐱', '🦊', '🦌', '🐟', '🌙', '⭐', '🔥', '🌸', '🍄', '🎧', '🎮', '🪐', '🍓', '🐙', '🦋', '🌈', '🍩', '💜', '🧡', '💀', '👾', '🎨', '🪄', '🐸'];
export const GAMES = { // low = lower is better
  catman: { name: 'CAT-MAN', unit: 'PTS', low: false },
  typecat: { name: 'TYPE-A-CAT', unit: 'WPM', low: false },
  maskmatch: { name: 'MASK MATCH', unit: 'MOVES', low: true },
};
const TAG_KEY = 'mar-tag', safe = (f, d) => { try { return f(); } catch { return d; } };
export const getTag = () => safe(() => { const t = JSON.parse(localStorage.getItem(TAG_KEY)); return Array.isArray(t) && t.length === 3 && t.every((e) => EMOJI.includes(e)) ? t : []; }, []);
export const saveTag = (t) => safe(() => localStorage.setItem(TAG_KEY, JSON.stringify(t)));

const order = (game, rows) => [...rows].sort((a, b) => (GAMES[game].low ? a.score - b.score : b.score - a.score)).slice(0, 10);
const localRows = (game) => safe(() => JSON.parse(localStorage.getItem('mar-board-' + game)) || [], []);
const better = (game, a, b) => (GAMES[game].low ? a < b : a > b);

export async function loadBoard(game) {
  if (LEADERBOARD_URL) { try { const r = await fetch(`${LEADERBOARD_URL}?game=${game}`); if (r.ok) return { rows: order(game, (await r.json()).rows || []), global: true }; } catch { /* fall back to local */ } }
  return { rows: order(game, localRows(game)), global: false };
}
export async function submitScore(game, tag, score) {
  const id = tag.join(''); const rows = localRows(game), mine = rows.find((r) => r.tag === id);
  if (!mine) rows.push({ tag: id, score }); else if (better(game, score, mine.score)) mine.score = score;
  safe(() => localStorage.setItem('mar-board-' + game, JSON.stringify(order(game, rows))));
  if (LEADERBOARD_URL) { try { const r = await fetch(LEADERBOARD_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ game, tag: id, score }) });
    if (r.ok) return { rows: order(game, (await r.json()).rows || []), global: true, tag: id }; } catch { /* keep local copy */ } }
  return { rows: order(game, localRows(game)), global: false, tag: id };
}
