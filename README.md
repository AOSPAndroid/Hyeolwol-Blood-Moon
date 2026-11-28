# 혈월 · Hyeolwol: Blood Moon

A top-down action roguelike set in Joseon Korea. You play a half-vampire hunter clearing a
court of gangshi, vampire nobles and ghosts with timed parries, perfect dodges, combo strings,
air juggles and four swappable elements. Rendered in three.js with a cel-shaded, ink-and-woodblock look.

## Open world · 열린 조선

The main mode. Joseon in 1624, a year after a palace coup. The world is generated in chunks as you walk
(about 280 km of map in every direction) with villages, walled towns, temples, ponds, ruins and blood nests.

- **Four Houses** split the land: the Crane (court, west), the Tiger (northern border), the Plum (southern trade) and the
  Circle of Bells (shrines, east). Each tracks your reputation; at −40 a House turns hostile and its guards attack you in its towns.
- **Main story, 배신의 달 · The Moon of Betrayal:** find which House feeds the Blood Court. Dialogue choices decide whom you
  accuse, whether a traitor captain lives, and whether you talk a rebel general down or kill him; the ending reflects them.
- **Bounties** on every notice board 榜, rumors from villagers, a side story about a corrupt steward, and readable records in ruins.
- **Light guidance** by default: the map shows a search area, not a pin. Switch to full guidance (arrow and beam) in the pause menu.
- Progress saves automatically and from shrines; **Continue** picks it up.

## Secret Arts · 비술

A second ability, held and let go: **F**, the mouse wheel button, or the 술 button on touch. **1–4** or **R**
(the 택 button) picks the art. Every art costs blood.

| Art | What it does |
| --- | --- |
| 대술 · Grand Art | Gathers your current element while held. Fire: an explosion at the aim point that leaves a crater. Water: a frost stream that soaks and freezes. Wind: a tornado that follows your aim and throws foes up. Lightning: a volley of strikes. |
| 혈와 · Blood Vortex | Opens a singularity that drags foes (and loose debris) in while held, then bursts when let go. |
| 시간 · Time | Tap: stop time for 3.5 seconds. Foes and their projectiles freeze, you keep moving, and your blows land when time resumes. Hold: wind the fight back, restoring your position and health. |
| 일섬 · The Cleave | Time stops while held. Drag a line with the mouse (or aim with the stick) and let go: one cut through every foe, projectile and breakable on it. |

The world breaks: jars, crates and barrels shatter into tumbling pieces under a blade, a roll, a thrown foe or
any blast, and sometimes give blood or health. Big attacks leave craters, scorch marks and gashes for a while.

These were inspired by the spells of *Small Magic* by blendi on Patch (time, the Cleave, the singularity,
the tornado, ground that breaks). No code or assets from it are used here.

## Sandbox · 모래판

Free play with no objectives and no saves. Press B (or the 모래 · SANDBOX button) for the panel:
switch to any arena stage, story chapter map or the open world; spawn any foe, a boss or a random wave; toggle
god mode, infinite blood and frozen foes; set game speed, foe tier and element levels; add any talisman.
Dying in the sandbox puts you straight back on your feet.

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

**Online (installable PWA):** https://aospandroid.github.io/Hyeolwol-Blood-Moon/
On a phone, open it and choose "Install app" (Android) or Share → "Add to Home Screen" (iPhone). It works offline after the first visit.

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
| Full map (story, open world) | M / click minimap | tap minimap |
| Dialogue choice | 1–9 / click | tap |
| Quest journal, guidance | Esc (pause menu) | II |
| Advance dialogue | Space / Enter / click | tap |

## Files

- `index.html` — the whole game: markup, styles and one script
- `three.min.js` — three.js r128, vendored so the game works offline
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — PWA shell
- `tools/smoke.js` — headless-Chrome smoke test
- `CLAUDE.md` — architecture notes for working on the code
