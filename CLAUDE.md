# Working on Crest Blade (원소검객)

The game was called Hyeolwol: Blood Moon. Storage keys (`hyeolwol_*`) and the test hook `window.__hw` keep the old prefix on purpose so saves survive; 혈월 / the blood moon is still the story's red moon.

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

## Polish pass: art bar, see-through, sound, numbers

- Art bar: `abarGeo` (layout: one row at the bottom on desktop, two rows of five at the top on touch), `abarSlot`, `abarHit` (called from the canvas, joystick and pad pointer handlers, like `miniHit`), `artBar` (drawn from `artsHUD`). The boss bar sits above it on desktop.
- See-through: `seeInject` adds a dithered discard to story materials for fragments near the camera-to-fighter line; `seeU` holds four points (player and the three nearest foes), set in `seeTick`. `SEE_P`, `SEE_R`, `SEE_F` are separate functions on purpose: three.js keys compiled programs on `onBeforeCompile.toString()`, so one wrapper function would make every material share one program.
- Sound: `tone` and `nz` (filtered looping noise with a sweep) feed one compressor (`aout`). `elSfx(k,big,vol)` is each element's voice, `whoosh(wq,heavy)` the blade. `sfx` and `noise` are the older blips.
- `text()` merges numbers landing on the same spot within 0.35 s, refreshes repeated words and stacks big labels (three at most per spot).
- The water Grand Art stream is `streamTick`; `frostTick` is the Snow element's tick. Function names in the one IIFE must be unique: a later declaration silently replaces an earlier one.
- Art and form damage was levelled against three dummies in the sandbox (single-target damage roughly 1.5 to 3 per blood, ultimates above their Grand Art). Re-measure the same way after changing numbers.

## World art pass

- `GND` (ground shader) adds world-space noise to the arena floor, chapter ground and open-world chunk ground: large mottling, patches, grain and a warm/cool drift. Ground canvases are under one pixel per unit, so fine detail belongs in the shader or in real geometry, not in the paint.
- Plazas are thin slabs (`paveSlabs`, material `M.pave`, a tiling flagstone texture) laid over the painted rectangle. Their top is at 0.3 so ground decals (scars at 1, contact shadows at 0.7) still show.
- `aoAt(x,y,w,d,a)` lays a soft dark decal (`M.ao`, texture `aoTex`) under houses, halls and trees.
- Trees are clusters of `SG.leaf` (a jittered icosphere with smooth normals): broadleaf canopies from eight blobs in two tones, pines as flat cloud pads on a stepped trunk (`pine`, `pine2`, `snowL` for snow caps). Foliage colours are deliberately dark hex values: toon materials under the moon, fill and lamps come out roughly 2.5 times brighter, and anything pale clips to white and blooms.
- Grass tufts have nine blades with dark roots; props use `propTex` plank and stave textures; roof tiles are a 128-pixel texture with rounded ridges.
- HUD bars are drawn by `hbar` (gradient, gloss line, gold frame).

## Character pass

- Model scale `MS` is 1.45. Going much higher makes weapons look like they reach farther than their hitboxes.
- `humanoid(M,o)` takes `o.leg` (leg length factor, default 1.2), `o.headS` (head scale, default .87), `o.hemK` (skirt flare factor, default .9) and `o.trim` (hem and cuff band colour; default is the robe colour at 55%, `false` turns it off). Pleated and jagged skirts get no hem band.
- `CHR` is the character shader (set in `MF` for every character material and in `npcM`): darker toward the feet by world height, cool shadow tint against warm lit tone, a faint cloth weave from local position, a moonlit rim, and a soft roll-off above 0.72 so saturated robes keep their hue instead of clipping.
- Townsfolk (`kNPC`) are rigged figures from `npcFigure`, dressed by kind from `NPCK` (gat, helmet, hair bun and pin, the shaman's streamers) and posed at rest. They are plain meshes in `S.world`, not batched; their materials are cached on `M_` through `npcM`.
- `G.camK` multiplies the camera distance (debug only, default 1); handy for inspecting models close up from `__hw.G`.

## Interface

- The main menu holds only the title, story line and mode buttons; the controls list lives in the `#help` overlay (`helpB`/`helpBack`, Esc closes it).
- Overlays never bury their buttons: in `#pause` the buttons come before the move list (`.mvh` label, `.keys` scrolls inside its own box), and on wide or landscape screens the list moves to a second column.
- Buttons: `button.big` (primary, red), `button.ghost` (secondary; light on parchment, gold-edged inside `.free`), `button.link` (quiet text link). All have hover and `:focus-visible` states.
- Pickers: `#ecards` wraps five over four, `#wcards` is a four-column grid of parchment cards, `#cards` (talismans) stay gold. Landscape phones scroll them sideways; upright phones show two per row.
- The interface CSS pass sits in one block at the end of the stylesheet (`interface pass`) and overrides earlier rules.

## Parry and dodge timing

- Windows: parry 0.22 s from the press (`parryWin`), shrinking to at most 72% after repeated whiffs (`parryFat`); a whiffed parry locks for 0.32 s. Perfect dodge 0.21 s (`perfWin`), dodge i-frames 0.3 s.
- `parryFace` turns a parry toward the foe about to strike (a wind-up, a lunge or a shot heading in), not the cursor, and `strikePlayer` accepts a parry within 2.3 rad of facing.
- Grace beat: a blow that lands while the player is idle, attacking or charging is held for 0.07 s (`p.grace`); `graceTick` (after `updPlayer`) resolves it once the player is in parry or dodge, or when the beat runs out. `p.graceOff` stops the held blow from being held again. Unblockable blows still only respect dodges.
- Cue: an enemy's ring turns white and thicker for the last 0.22 s of its wind-up, and foes within 330 units chime once (lower note for purple, dodge-only blows).
- Measured with scripted presses against a gang-si, guard and noble: parry works from 0.22 s before the hit to 0.06 s after; perfect dodge from about 0.06 s before to after the hit.

## Element mastery and crests

- Levels I to III already unlock mechanics (`EDESC`: II changes finishers, III changes the Blood Art). They are now visible too: `lvEcho` adds one echo of each cut at II and two at III, the blade's emissive glow strengthens with level, and at III `awakenRender` draws two counter-rotating rune rings under the hunter with rising motes. `elemLevelUp(k,lv)` (called from `elemCard` and `sbxSetEl`) shows a banner with what the level unlocks, a burst and a chime.
- Crests: `CREST[k]` holds each element's character and three colours; `crestPaint` draws the emblem (fire: curling flame tongues; water: seigaiha fans; wind: spiral gusts; lightning: zigzag bolts and drums; earth: tortoise-shell hexagons; venom: drips and bubbles; moon: crescents; wood: leaf wreath; snow: a branched snow crest). `crestTex` is flipped (`flipY=false`) so the character reads correctly on the ground. Crests are 1024 px (768 on touch devices), signs 512 px, slash strips 2048×512 (1024×256 on touch devices); textures are built only for elements that are used.
- While a Grand Art gathers, `sigA`/`sigB` use `crestMat(k)` instead of the plain sigil. `crestStamp(k,x,y,R,life)` blooms a crest on the ground where the art lands (ultimates get a bigger one) and a `signTex` sprite of the character rises and fades above it. Six at most, pooled in `crPool`.

## Effect art

- Every special attack stamps a crest (`crestStamp`): Grand Arts and ultimates use the element's crest; forms (small, at the hunter) and charged attacks use the current element's; the blood arts have their own (`CREST.blood` 血 for the Blood Art, `vortex` 渦, `time` 時, `cleave` 斬, `legion` 影, `starfall` 星, `chain` 鎖), drawn by `crestMotif` (drops, tomoe, clock, slash, stars, links). Eight at most at once.
- Wood's grove is a bamboo grove (`mkGrove`/`updGrove`): one textured cylinder per stalk (nodes painted in `bambooTex`, UVs scaled per height in `bambooGeo`), merged leaf sprays (`leafSprayGeo`), a moss-and-litter disc (`mossTex`), sway and drifting leaves.
- Earth walls are faceted rock (`rockGeo`), earth and ice spikes are leaning faceted shards (`shardGeo`, one cached material per colour in `shardMat`), the venom cloud is two turning layers of `miasmaTex` with bubbles, the blizzard ground is `frostTex`, and the tornado layers carry scrolling brush streaks (`windTex`).
- Painted effect textures are built once on first use through `tx()`; `texDisc(map,opacity,additive)` makes a flat textured disc.
- Awakened (element level III): `awakenRender` turns the element's crest underfoot, draws a rising-wisp aura sprite (`auraTex`) tinted by the element, and emits element-specific motes.

## Swimming, practice, roadside events, frame rate

- Swimming: `storyPhys` no longer pushes the player out of water (foes still are). `swimPre` (before `updPlayer`) sets `P.swim`/`P.swimK`, blocks attacks, parries and arts, pauses stamina regeneration, and turns a dodge press into a stroke (`P.stroke`); `swimSpeed()` scales idle movement. `updPlayerM` sinks the model and poses a stroke.
- Practice (sandbox tab `prac`): `G.prac` holds the pool, field size and scoreboard; `pracTick` (from `sbxTick`) keeps the field full from `PRAC_POOLS`, and a training dummy (`e.dummy`, skipped by `updEnemy`) refills its health and feeds a 5-second DPS window. `pracHUD` draws the scoreboard. Parries and perfect dodges are counted in `strikePlayer` and `perfect`.
- Roadside events: `OW.ev` is one event at a time (`caravan`, `duel`, `altar`, `lantern`, `cache`, in `OWEV`), spawned by `evSpawn` every 45–80 s in wild, lake, ruin and camp chunks, ahead of the player. `evTick` runs from `owTick`; caravan, duel and altar reuse packs (`startPack`), the duelist is spawned directly with 3.2× health. `evRender` draws the light pillar, crest and lanterns; `evHUD` the edge arrow and lantern timer. Events are not saved.
- Wind Grand Art: an instant gust on release (cone in front, damage and launch) plus the tornado.
- Frame rate: `frame` is uncapped by default (follows the display); `FPSCAP` (pause menu, `hyeolwol_fpscap`) caps at 60 or 30. Camera follow and slow-motion tint are time-based, so they look the same at any refresh rate.

## Sandbox notes

- The sandbox panel is tabbed (`sbxTab`: map, foe, rule, gear, rel; `tab:` actions in `sbxAct`). Only `.spage` scrolls, and only on short screens.
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
- Story maps are flat. Buildings between the camera and a fighter are dithered away (`SEE_*`), but NPCs and shrines can still be hidden.
- No saved meta-progression; only the best score is kept in `localStorage`.
