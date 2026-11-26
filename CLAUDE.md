# Working on Hyeolwol

Single-file browser game: everything lives in `index.html` (about 2,300 long lines, one IIFE).
No build, no dependencies beyond the vendored `three.min.js` (r128, global `THREE`, aliased `T`).
Fonts come from Google Fonts (Gowun Batang, Nanum Brush Script) with serif fallbacks.

## Layout of the script (search for the `/* ---------- name ---------- */` banners)

| Section | What is there |
| --- | --- |
| audio | `sfx()`, `noise()` WebAudio blips |
| input | keyboard, mouse, floating joystick, `pad` (slide-between touch buttons). Edge flags `inp.pA/pD/pP/pR/pQ`, held `inp.hA` |
| state | `G` (run/room state), `makePlayer()`, `RELICS`, `ET` (enemy stats), `newRun`, `nextRoom`, `spawn` |
| fx helpers | `part`, `text`, `heal`, `style`/`rankOf` (style rank), `addBlood`, `callout`, targeting |
| player | attack tables (`LIGHT`, `LAUNCH`, `WHIRL`, `GSLAM`, `SPIN`, `DASHA`, `CTR`), `updPlayer` state machine: idle, charge, attack, dodge, parry, exec, counter, art, hurt |
| elements | `ELEM`, `elemHit` (statuses + reactions), `elemBurst`, `artEnd`, `swapEl`, reward cards, `doHit`, `hitEnemy`, `doExec`, `perfect`, `strikePlayer`, `die` |
| enemies | `AI.<type>(e,dt,dist,angle)` state machines (`chase`/`wind`/`dash`/`recover`/`fade`), `updEnemy` (burn, air, freeze, poise, flinch), `separate` |
| world update | `update(dt)`, `roomCleared`, pause |
| three.js rendering | materials (`mat` = toon + `outlineMat` inverted hull), `buildGeo`, stages (`STAGES`, `applyStage`), `buildWorld` |
| characters | `humanoid()` rig builder, `applyPose` (spring joints), `walk`, `lunge`, `buildPlayer`/`updPlayerM`, `buildEnemy`, `POSE.<type>`, `updEnemyM`, death animation |
| velocity fx | blade ribbon, speed streaks, rush lines, painted slash strips (`slashTex`, `mkSlash`, `updSlash`) |
| HUD / render | `drawHUD` (2D canvas `#c` over WebGL canvas `#g`), `render`, `frame` |
| story mode: engine | `S` (story state), obstacle grid (`addObs`, `resolve`, `blocked`), water (`inWater`, bridges, islands), `storyPhys`, `Batch` (merges static meshes per material per 1000-unit chunk), map kits `kWalls`/`kGate`/`kHall`/`kPav`/`kHouse`/`kTree`/... |
| story mode: world builder | `THEMES`, `storyMats`, `paintGround`, `buildMini`, `buildStory` |
| story mode: runtime | `startChapter`, step machine `storyTick` (`talk`/`go`/`fight`/`dawn`/`end`), fights and waves, ambush packs, shrines, dialogue (`openTalk`/`advTalk`), `storyHUD` (objective, arrow, minimap) |
| story mode: chapters | `CHAPTERS` data: map size, walls and gates, roads, rivers, halls, villages, shrines, ambushes, steps and dialogue |
| story: dialogue and NPCs | flags (`flag`/`setFlag`/`cond`; `lore_*`/`mem*` persist, the rest are per run), `openTalk`/`showLine` (lines `[speaker, text, cond]`, `{set}`, `{rep}`, `{choice:{q,opts:[[label, flag, lines, fn, cond]]}}`), `bark`, `kNPC` + `npcCheck` (variants with `if`), `kLore` + `loreCheck`, guidance (`guide`) |
| open world | `OW` state, `descOf` (deterministic chunk description: site, biome, clan, roads, name), `FIXED`/`FIXED_BUILD` authored places, `owContent`/`owBuild` (chunk meshes, origin-relative), `owStream` (3×3 loaded, unload past 2), clans and `repAdd`, bounties `genBounties`, quest engine (`addQuest`, `qStage`, `owQuests`, `finishQuest`), `MAINQ` main storyline, `owSave`/`owStart`, `owMap`, `owJournal` |

## Story mode notes

- `G.mode` is `'arena'` or `'story'`. `AW`/`AH` are the current map size: 1100×800 in the arena, per chapter in story (up to 5400×4200). `setArena()` restores the arena world.
- Story maps are data in `CHAPTERS`. Gates must sit on a wall segment (within 25 units) to cut it; `ong:true` adds a half-moon outer wall. Fight, go, shrine and ambush points are kept clear of generated houses and trees.
- Every wall, building and tree registers an obstacle; `storyPhys` pushes the player, enemies and shots out each frame and keeps them inside a fight's barrier. Enemies chase in straight lines, so put fights in open ground.
- Placement uses a seeded RNG per chapter (`srand`), so a chapter's layout is the same every time.
- The four arena lamp lights are reused in story mode and move each frame to the four lamp spots nearest the camera.
- `__hw.startChapter(i, fresh, element)`, `__hw.tick(dt)`, `__hw.advTalk()` and `__hw.dbg.{blocked,inWater}` exist for scripted tests. Story progress is kept in `localStorage` (`hyeolwol_story`).

## Open world notes

- Open world runs inside story mode (`G.mode==='story'`, `S.open===true`), so `storyPhys`, fights, packs, shrines and death reuse the chapter code.
- Chunks are 1400 units and their edges sit on the 200-unit obstacle grid; keep every obstacle at least 70 units inside its chunk so unloading a chunk can delete its grid cells.
- Quest stages: `go`, `talk` (with `lines`), `fight` (`waves`, `R`, `r` tier, `pre`, `post`, `barks`, `taunts`), `nest` (completes when that nest is burned), `flag` (completes when a flag is set). A stage with `if` is skipped when its condition fails.
- Saves live in `localStorage` under `hyeolwol_open`. Main quests are saved by id and stage index and rebuilt from `MAINQ`; bounties are saved as data.

## Conventions

- Game space is 2D: `x,y` in a 1100×800 arena. In three.js, game `y` maps to world `z`; height is world `y`.
- Angles are radians in game space. Models face +x; body yaw is `rotation.y = -facing`.
- Logic and rendering are separate: logic never touches meshes. `sync(map, list, create, update)` keeps meshes in step with the logic arrays (`enemies`, `shots`, `rings`, `slashes`, `G.zones`).
- Time: `update(rdt)` gets real dt. Enemies run on `dt = rdt * (G.slow>0 ? .22 : 1)`; the player runs on real dt. `G.stop` is hit-stop (logic frozen, still rendering). Animation uses `adt`/`AT`.
- Every enemy attack resolves through `strikePlayer(src, dmg, {unblock, proj, ang})`, which handles parry, i-frames, perfect dodge and damage. Every hit on an enemy goes through `hitEnemy(e, dmg, ang, opts)`.
- Telegraph colour is a rule: red = parryable, purple (`e.unb`) = dodge only. The white ring closing on the enemy marks the hit frame.
- Adding an enemy type means: an `ET` entry, `AI.<type>`, a branch in `buildEnemy`, `POSE.<type>`, its telegraph decals in `buildEnemy`/`updEnemyM`, and the spawn pool in `nextRoom`.
- Bosses are types `boss`, `boss2`, `boss3` with `e.boss = true`; they are immune to launch and freeze and use posture (three parries) instead of stagger.
- Korean text pairs hangul with English (`'낙월 · MOONFALL'`). Keep new names in that form.

## Testing

There is no unit-test suite. `tools/smoke.js` loads the game in headless Chrome with software WebGL,
starts a run, feeds random input and reports any page errors. It needs Playwright and a Chrome binary:

```sh
npm i playwright
CHROME=/usr/bin/google-chrome node tools/smoke.js
```

The page exposes `window.__hw = {G, P, enemies, inp, keys}` for scripting scenarios
(set `P.hp`, push enemy types onto `G.queue`, set `inp.pA = true`, and so on).
Software rendering runs slower than real time, so drive tests by game state, not wall-clock timing.

## Known gaps

- Balance, timing windows and mobile frame rate have only been checked by scripted and random input, never by hand.
- Draw calls reach about 300 with a boss and a crowd; the ink outlines roughly double character draw calls.
- The three arena stages share geometry; only floor texture, lighting and weather differ.
- Story maps are flat; walls and buildings can hide the player when they stand just north of them.
- No saved meta-progression; only the best score is kept in `localStorage`.
