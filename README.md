# 혈월 · Hyeolwol: Blood Moon

A top-down action roguelike set in Joseon Korea. You play a half-vampire hunter clearing a
court of gangshi, vampire nobles and ghosts with timed parries, perfect dodges, combo strings,
air juggles and four swappable elements. Rendered in three.js with a cel-shaded, ink-and-woodblock look.

## Play

It is a static site with no build step.

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Serve it over HTTPS (GitHub Pages works from the repo root) and it installs as a PWA and runs offline.
When you ship a change, bump `CACHE` in `sw.js` so installed copies update.

## Controls

| Action | Keyboard / mouse | Touch |
| --- | --- | --- |
| Move | WASD | left stick |
| Attack (tap ×5, hold for finishers) | click / J | 참 |
| Dodge | Space | 피 |
| Parry | right-click / K | 막 |
| Blood Art | E / Shift | 혈 |
| Swap element | Q / Tab | 원 |
| Pause (full move list) | Esc / P | II |

## Files

- `index.html` — the whole game: markup, styles and one script
- `three.min.js` — three.js r128, vendored so the game works offline
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — PWA shell
- `tools/smoke.js` — headless-Chrome smoke test
- `CLAUDE.md` — architecture notes for working on the code
