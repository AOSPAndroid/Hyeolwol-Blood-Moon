# 원소검객 · Crest Blade

*Formerly Hyeolwol: Blood Moon.*

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

## Weapons, elements, foes and talismans

**Weapons** (picked after your element; all change reach, speed, damage and arc):

| Weapon | Its rule | Its swing |
| --- | --- | --- |
| 환도 · Hwando | Parry window 30% wider | A clean arc |
| 쌍검 · Twin Blades | Every cut strikes twice | Two thin crossing arcs |
| 월도 · Crescent Glaive | Sweeps stagger everything they touch | A huge wide sweep |
| 대검 · Greatsword | Breaks guards; 45% less damage taken mid-swing | A thick arc that cracks the ground |
| 창 · Spear | +40% damage at the tip of its reach | Straight thrust lines |
| 편곤 · Flail | Every swing goes all the way around you and breaks guards | A full ring |
| 혈겸 · Blood Sickle | Hooks foes toward you; health and blood on every hit | A tight hook |
| 철퇴 · Iron Mace | Blows shock nearby foes; every third dazes | A short arc and an impact ring |

**Elements:** Fire, Water, Wind and Lightning, plus Earth (every fourth hit cracks a foe; a stone wall as its Grand Art),
Venom (stacking poison that the dying pass on; a poison cloud), Moon (marks that raise damage and give blood;
crescent waves) and Wood (seeds that root a foe on the third hit and heal you; a grove that heals you and thorns
foes inside it). New reactions: Poisoned + Fire, Frozen or Soaked + Earth, Poisoned + Wind, Seeded + Fire (wildfire),
Soaked + Wood (bloom).

**Foe kinds**, each a variant with one rule of its own: Ember Gangshi (bursts after it falls, hurting everything near),
Ironclad (shrugs off light cuts: use heavies, launches or the flail), Plague Ghost (leaves pools that hurt to stand in),
Blood Bats (come in fours), Hexer (wards an ally against the next hit), Blood Noble (heals when it wounds you) and
Stone Colossus (splits into two when slain).

**Talismans:** 34 in all. The newer ones add rules rather than numbers: a shade that repeats finishers, lightning on
every tenth hit, breakables that burst, executions that stop time, thorns, and more.

Cuts are painted in a bold woodblock manner, with a different silhouette for each element: a banded wave with foam,
flame tongues, loose wind swooshes, a jagged bolt, broken rock slabs, dripping ooze, a thin crescent with little moons,
a flowering vine, and ice crystals.

A combo display shows the hit count and its timer, your style rank and progress to the next, and the five steps of
the attack string with the hold-finisher available at each.

## Element forms · 형

Each element has three named techniques, on **8**, **9** and **0** (then **F**, or pick with **R**). They are cast with a
tap, cost blood, and make you untouchable while they play.

| Element | Forms |
| --- | --- |
| Water | Ripple Cut · Water Wheel (a rolling chain of cuts) · Flowing Dragon (six weaving cuts between foes) |
| Fire | Flame Wheel · Sunrise Arc (a rising launcher) · Ember Step (a dash that leaves fire) |
| Wind | Gale Rush (three zigzag dashes) · Rising Cyclone · Wind Fan (five flying blades) |
| Lightning | Thunderflash (an instant line dash) · Sixfold Strike (blink between six foes) · Thunder Lance |
| Earth | Rockslide (a line of stone spikes) · Iron Stance (take 70% less, daze attackers) · Earth Splitter (a leaping slam) |
| Venom | Viper Fang · Mist Step (vanish and strike from behind) · Serpent Lash |
| Moon | Crescent Trio · Moon Halo (orbiting blades that shred projectiles) · Full Moon |
| Wood | Vine Snare (drag foes together) · Thorn Thicket · Petal Storm (a healing whirl) |
| Snow | Icicle Lance · Snow Step (a dash that leaves a blizzard) · Frost Bloom (a ring of ice that freezes) |

**Snow** is the ninth element: hits chill and slow, the fifth freezes; its Grand Art is a blizzard and its Ultimate,
Absolute Zero, freezes everything nearby. Chilled + Fire thaws in a burst; Soaked + Snow flash-freezes.

**Paired elements:** you can hold three. The element you swapped from rides along on every swing: its painted cut is
drawn inside the main one and it adds its own effect, so fire with venom burns and poisons (and sets off their reaction).

**Charged attacks** (hold attack, release on the flash) differ by weapon: Quick Draw, Flurry, Half Moon, Cleaver,
Pierce, Whirl, Reap and Quake Blow.

## Secret Arts · 비술

A second ability, held and let go: **F**, the mouse wheel button, or the 술 button on touch. **1–7** or **R**
(the 택 button) picks the art. Every art costs blood.

The **art bar** along the bottom of the screen shows every art and form with its key, its blood cost and whether you can
afford it; the name of the one you have picked sits above it. You can click a slot to pick it. On a phone the bar is two
rows at the top: tap a slot to pick it, and tap a picked Form again to cast it.

| Art | What it does |
| --- | --- |
| 대술 · Grand Art | Gathers your current element while held. Fire: an explosion at the aim point that leaves a crater. Water: a frost stream that soaks and freezes. Wind: a tornado that follows your aim and throws foes up. Lightning: a volley of strikes. |
| 혈와 · Blood Vortex | Opens a singularity that drags foes (and loose debris) in while held, then bursts when let go. |
| 시간 · Time | Tap: stop time for 3.5 seconds. Foes and their projectiles freeze, you keep moving, and your blows land when time resumes. Hold: wind the fight back, restoring your position and health. |
| 일섬 · The Cleave | Time stops while held. Drag a line with the mouse (or aim with the stick) and let go: one cut through every foe, projectile and breakable on it. |
| 혈영 · Shadow Legion | Shades dash through three to six foes, one after another. |
| 혈우 · Blood Starfall | Blood blades rain on the area you aim at. |
| 혈쇄 · Blood Chain | Binds every foe in a growing circle: they are held, and for six seconds share part of any damage one of them takes. |

**Ultimates (오의):** keep holding a Grand Art past full charge until the circle turns white, then let go.
Fire Dragon (a line of explosions), Tidal Wave (a wall of water that carries foes off), Typhoon (three tornadoes),
Judgment (lightning on every foe), Earthquake (three rings of rising stone), Plague Sea (a huge poison cloud) and
Eclipse (slows time, marks and strikes every foe, heals you) and World Tree (roots erupt under every foe and a great
grove heals you).

The world breaks: jars, crates and barrels shatter into tumbling pieces under a blade, a roll, a thrown foe or
any blast, and sometimes give blood or health. Big attacks leave craters, scorch marks and gashes for a while.

These were inspired by the spells of *Small Magic* by blendi on Patch (time, the Cleave, the singularity,
the tornado, ground that breaks). No code or assets from it are used here.

## The dash

The dodge is a forward roll. It leaves a trail of afterimages tinted by your element (red in Bat Form) and kicks up dust. The dash slash, Blood Art and counter leave afterimages too, and a perfect dodge bursts into a larger red afterimage.

## The picture

Every element has its own crest, painted around its character: curling flames around 火, wave fans around 水, gusts
around 風, bolts and thunder drums around 雷, and so on. The crest is the aiming circle while you gather a Grand Art,
and it stamps the ground where the art lands, with the character rising above it. Mastery shows on the hunter: at
level II every cut leaves an echo, at level III two, the blade glows brighter, and an awakened hunter stands in a
turning rune ring.

Characters stand taller with longer legs and smaller heads, robes and sleeves have darker trim at the hem and cuffs,
and they are shaded with cool shadows, warm light and a darker base, so they stand off the ground. Townsfolk in the
open world are full figures dressed by trade: gat for villagers and merchants, helmets for soldiers, hair pins for
women, streamers for the shaman.

The world is dressed rather than blocked in: flagstone squares, mottled earth, grass with dark roots, crates and
barrels with planks and staves, tiled roofs with rounded ridges, soft shadows where buildings and trees meet the
ground, blossom and maple trees built from clustered canopies, and Korean pines with flat cloud-like pads.

Walls, roofs and trees that stand between the camera and you (or the three foes nearest you) are stippled away in a
soft circle, so nobody is lost behind a hall.

Every element has its own sound on swings, forms and arts, blades whistle differently by weight, and hits on one foe
add up into a single number instead of a pile of them.

The scene is drawn to an off-screen image and finished in one pass: bright things (lanterns, flames, slashes, rune
circles) glow a little into what is around them, colours are graded for contrast with cool shadows and warm
highlights, the corners fall away, and a trace of grain is added. Characters and buildings carry a faint cool rim, trees sway, water
shimmers, the ground has pebbles and worn roads, and fireflies drift at night. Outdoor maps are covered in swaying grass with a
few flowers, tinted by season. The pause menu has a switch for the glow and grading if a device struggles.

## On the road

The hunter can swim: rivers and ponds are slower, with no attacks or arts, and the dead cannot follow you in.
Out in the wilds, roadside events find you: a caravan under attack, a wandering duelist, a blood altar to survive,
spirit lanterns to catch before they fade, and hidden caches. Each is marked by a pillar of light and an arrow.

## Sandbox · 모래판

The **Practice** tab keeps a chosen number of foes on the field (mixed, melee, ranged, elite kinds or bosses one at
a time), places a training dummy that shows your damage per second, and keeps a scoreboard of waves, kills, parries
and perfect dodges.


Free play with no objectives and no saves. It opens in a village built to be broken: houses, a magistrate's compound, a pond and over two hundred jars, crates and barrels. **T** (or the panel) restores everything broken. Press B (or the 모래 · SANDBOX button) for the panel:
switch to any arena stage, story chapter map or the open world; spawn any foe, a boss or a random wave; toggle
god mode, infinite blood and frozen foes; set game speed, foe tier and element levels; add any talisman.
Dying in the sandbox puts you straight back on your feet.

## Story mode

Seven chapters across the Joseon dynasty (1392–1897), each on a large explorable map with walled fortresses,
gatehouses, palaces, villages, rivers and bridges. Chapters unlock in order; your build carries over when you
continue, and starting a later chapter directly gives you a matching set of talismans.

| Chapter | Year | Map |
| --- | --- | --- |
| 첫 성벽 · The First Wall | 1396 | Hanyang: the new city wall, Sungnyemun, Gyeongbokgung |
| 어린 임금 · The Boy King | 1457 | Yeongwol: a spit of pine forest wrapped by a river, the exile house, the cliff ledge |
| 불타는 강 · The River of Embers | 1592 | Jinju Fortress and Chokseongnu above the Nam river, during the Imjin War |
| 설한의 포위 · Forty-Seven Days of Snow | 1636 | Namhansanseong mountain fortress in winter |
| 화성의 달 · The Moon over Hwaseong | 1796 | Suwon Hwaseong: Paldalmun and Janganmun with their half-moon walls, the beacon tower |
| 불타는 서고 · The Burning Archive | 1866 | Ganghwa: the island fortress, its sea gate and batteries, the royal library Oegyujanggak |
| 조선의 마지막 밤 · The Last Night of Joseon | 1897 | Gyeongbokgung: Geunjeongjeon, Gyeonghoeru, Hyangwonjeong |

Follow the gold beam and arrow to the next objective. Stepping into a fight ring raises a talisman barrier until
every wave is down. Roadside shrines (서낭당, blue diamonds on the map) heal you and offer a talisman, and become
your respawn point. Press M or tap the minimap for the full map.

## Play

**Online (installable PWA):** https://aospandroid.github.io/Crest-Blade/
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
| Dash (dodge) | Space | 피 |
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
