// ✏️ Where the clickable objects are. Numbers are PERCENTAGES of your 1920×1080 foreground art (Items.png): x/y = top-left, w/h = size.
// Tip: open the site with  ?hotspots  at the end of the address to see the boxes drawn, then nudge the numbers.
// sparks: [x%, y%, size px, delay s] inside the box (can go slightly outside: negative or >100).
export const hotspots = [
  { id: 'pc', game: 'catman', label: 'CAT-MAN', aria: 'Play Cat-Man on the old computer', x: 0, y: 34, w: 22.5, h: 32,
    sparks: [[88, 6, 16, 0], [101, 44, 11, 1.2], [58, -4, 9, 2.1], [14, 104, 12, .6], [72, 98, 8, 1.8]] },
  { id: 'glasses', game: 'typecat', label: 'TYPE-A-CAT', aria: 'Play the typing test on the glasses', x: 24, y: 68.5, w: 11.5, h: 9.5,
    sparks: [[50, -50, 14, .3], [104, 12, 10, 1.5], [-6, 70, 9, 2.4], [80, 118, 8, .9]] },
  { id: 'pillar', game: 'maskmatch', label: 'MASK MATCH', aria: 'Play the memory game on the pillar', x: 74.5, y: 8, w: 14, h: 62,
    sparks: [[92, 6, 15, .5], [-6, 28, 11, 1.7], [104, 46, 12, 0], [8, 70, 9, 2.2], [96, 88, 10, 1.1]] },
];
