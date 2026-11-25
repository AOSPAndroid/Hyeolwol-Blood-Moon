# 혈월 · Hyeolwol: Blood Moon

A top-down action roguelike set in Joseon Korea. You play a half-vampire hunter clearing a
court of gangshi, vampire nobles and ghosts with timed parries, perfect dodges, combo strings,
air juggles and four swappable elements. Rendered in three.js with a cel-shaded, ink-and-woodblock look.

## Story mode

Five chapters across the Joseon dynasty (1392–1897), each on a large explorable map with walled fortresses,
gatehouses, palaces, villages, rivers and bridges. Chapters unlock in order; your build carries over when you
continue, and starting a later chapter directly gives you a matching set of talismans.

| Chapter | Year | Map |
| --- | --- | --- |
| 첫 성벽 · The First Wall | 1396 | Hanyang: the new city wall, Sungnyemun, Gyeongbokgung |
| 불타는 강 · The River of Embers | 1592 | Jinju Fortress and Chokseongnu above the Nam river, during the Imjin War |
| 설한의 포위 · Forty-Seven Days of Snow | 1636 | Namhansanseong mountain fortress in winter |
| 화성의 달 · The Moon over Hwaseong | 1796 | Suwon Hwaseong: Paldalmun and Janganmun with their half-moon walls, the beacon tower |
| 조선의 마지막 밤 · The Last Night of Joseon | 1897 | Gyeongbokgung: Geunjeongjeon, Gyeonghoeru, Hyangwonjeong |

Follow the gold beam and arrow to the next objective. Stepping into a fight ring raises a talisman barrier until
every wave is down. Roadside shrines (서낭당, blue diamonds on the map) heal you and offer a talisman, and become
your respawn point. Press M or tap the minimap for the full map.

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
| Full map (story) | M / click minimap | tap minimap |
| Advance dialogue | Space / Enter / click | tap |

## Files

- `index.html` — the whole game: markup, styles and one script
- `three.min.js` — three.js r128, vendored so the game works offline
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — PWA shell
- `tools/smoke.js` — headless-Chrome smoke test
- `CLAUDE.md` — architecture notes for working on the code
