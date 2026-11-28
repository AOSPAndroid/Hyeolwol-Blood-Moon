# Working on Hyeolwol

Single-file browser game: everything lives in `index.html` (about 2,600 long lines, one IIFE).
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

## Secret arts and breakables

- Section `secret arts (비술) and the breakable world`: `ARTS`, state `A`, `artBegin`/`artHold`/`artRelease` (press, hold, let go), `artsTick` (called from `update` after `updPlayer`), `artsRender`, `artsHUD`, `artsReset`.
- Input: `inp.pS` (pressed), `inp.hS` (held), `inp.pC` (cycle). An art ends when `inp.hS` goes false.
- Time: `G.tstop>0` freezes enemies, hostile shots and rings, timers and particles (`update` runs them with `dt=0` or skips them); the player runs on real dt. `G.thold` keeps it frozen while the Cleave is aimed or the rewind runs. The rewind pops `A.hist` snapshots (player position and health, enemy positions and health, every 0.1 s, 6 s kept).
- Breakables: `props` (`{x,y,kind,r,rot,dead}`), broken through `breakProp`. `doHit` calls `hitProps`, `aoe` calls `breakProps`, `propsPhys` handles collisions. Arena gets them in `nextRoom` (`arenaProps`), chapters in `buildStory` (`storyProps`), open-world chunks own theirs (`C.props`, merged in `owRefresh`).
- `debris` is drawn with one `InstancedMesh`; `scars` (crater, scorch, gash) are ground decals that fade; `twisters`, `booms` are short-lived effects. All are plain arrays synced to meshes in `artsRender`.
- The ideas came from Small Magic (Patch licence, cannot leave Patch): never copy its code or assets into this repo.

## Weapons, elements, enemy kinds

- Weapons: `WPN` (multipliers `range`, `dmg`, `spd`, `arc`, `kb`; blade shape `L`, `w`, `cv`, shaft `sh`; flags `twin`, `gb`; hook `hitE(e,p)`). `doHit` copies the attack with the weapon applied; `setWeapon` rebuilds the player model. The choice is `WSEL` (saved in `localStorage`).
- Elements: `ELEM`/`EK`/`EDESC` hold all eight. Fire, water, wind and bolt live in `elemHit`/`elemBurst`/`artEnd`; earth, venom and moon in `elemHit2`/`elemBurst2`/`artEnd2`, reactions in `react2`, statuses (`e.venom`, `e.mark`, `e.quake`) tick in `elemTick`. Grand arts: `castWall`, `castMiasma`, `castCrescent`.
- Enemy kinds: an `ET` entry with `base` is a variant of that type (same model, AI and pose) with its own stats, `tint`, model scale `ms`, speed `sm` and one rule. `spawn` turns it into the base type with `e.kind` set; rules live in `kindInit`, `kindTick`, `kindDeath` and two lines in `hitEnemy`/`strikePlayer`. A wholly new type still needs the full list under Conventions.
- Wood is the eighth element, added after the others (`ELEM.wood`, `EK.push`): `woodHit`, `woodBurst`, `woodReact`, `castGrove`, `woodUlt`, `groves`.
- Chapters: `CH1457` and `CH1866` are spliced into `CHAPTERS` after it is defined, so chapter indices are 0–6.
- Combo display: `comboHUD` (also draws hit sparks). Hunter polish: `slashFx` (element flourish along a cut), the sash ribbon in `elemRender`, dust in `elemTick`.

## Swing art, weapon identity, more arts

- `slashArt(k)` paints each element's slash strip (1024×256, drawn in 512×128 units): `body` for banded fills, then ornaments (`blob` foam, `tear`, `crescent`, `star`, `poly`). `slashTex` uses it for everything but enemy slashes. `mkSlash` adds an additive glow copy and takes `inr` (inner radius factor) and `gc` (glow colour).
- `swingFx` decides what a swing draws from `wp.fx` (`arc`, `twin`, `wide`, `great`, `thrust`, `spin`, `hook`, `smash`). Weapon rules are fields on `WPN` read in `doHit`, `strikePlayer` and the parry: `gb`, `int`, `armor`, `parry`, `dmgE`, `hitE`, negative `kb`.
- `weaponLift` runs after `updPlayerM` and rotates the weapon so its point never goes under the floor.
- Arts added in `ART2` (`legion`, `starfall`, `chain`): each has `cast(c)` and optionally `hold(dt)`. Ultimates: holding a Grand Art past 2.2 s sets `A.ult`; release calls `castUlt(k,sc)`. `arts2Tick` runs tidal waves and chain timers, `arts2Render` the casting aura.

## Finishing pass and grass

- `postRender` replaces the direct `renderer.render`: scene into `POST.rt` (multisampled on WebGL2), a bright pass and three or four half-size blurs (`mDown`), then `mFinal` (glow, saturation, S-curve, split tone, vignette, gamma, grain). The targets are linear, so `mFinal` applies gamma itself. `POST.on` (pause menu, `localStorage` `hyeolwol_fx`) falls back to the direct render, as does any error.
- Glow takes what is brighter than 0.93 in its brightest channel, and mostly only saturated colours: near-white surfaces get 12% of it, so pale robes, walls and blossoms under lamps do not flare. Effects that should glow need colour in them.
- `addGrass` scatters instanced tufts (one shared geometry and material, wind sway in the vertex shader, time in `grassU`) in 700-unit tiles so off-screen tiles are culled. Chapters call it from `buildStory`, open-world chunks from `owBuild`; the arena has none.

## Afterimages

- `ghostSnap(col, opacity, life, grow)` bakes the player model's current pose (every visible opaque mesh, world space, positions only) into one mesh with a tinted transparent material. `ghostSpawnTick` (from `artsTick`, game time) spawns them during dodge, art, counter and dash attacks; `ghostTick` (from `render`, animation time) fades and frees them. At most 18 live. `dashBurst` adds the dust, ring and ground streak.
- The dodge is the original forward roll; afterimages follow it.

## Forms, paired element, charged attacks, scene shaders

- Forms: `FORMS[element]` holds three entries `{id,h,n,cost,dur,pose,go(F)}`. `go` schedules the technique with `F_dash(F,at,angle,dist,dur,width,hit)` and `F_at(F,t,fn)`; damage goes through `fCut` (an arc, with the element's painted slash) or `fLine`. The player is in state `form` (untouchable); poses are `lunge`, `spin`, `flip`, `leap`, `still`. `curArts()` is `ARTS` plus the current element's forms, so art indices 7–9 change with the element.
- Paired element: `subEl()` is the element swapped from (`P.sub`). `swingFx` draws its slash inside the main one and `subHit` applies its status. `EMAX` caps owned elements at three (`offerCards` and `elemCard`).
- Charged attacks: `WPN[id].charge(p,a,base)` runs from `doHit` when the charged thrust lands; returning true replaces the thrust's own hit.
- Scene shaders: `RIM` (every toon material from `mat()`), `FOL` (foliage sway, assigned in `storyMats`), `WATER`. All take time from `grassU`.
- Snow is `frost` in code (`frostHit`, `frostReact`, `castBlizzard`, `frostUlt`, `blizz`); it slows through `e.frostN` in `updEnemy`.

## Sandbox notes

- `G.sandbox` marks sandbox play; `toMenu` clears it. It runs on top of the other modes: `sbxGo` switches the map while keeping the player (`a0`–`a2` arena stages, `c0`–`c4` chapter maps with `S.step=999` so no script runs, `ow` open world with no main quest).
- `G.god`, `G.infBlood`, `G.freezeAI` and `G.tsc` (game speed) are read in `update`/`frame`/`sbxTick`. `die()` revives instantly in the sandbox, and `owSave` never writes from it.

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
