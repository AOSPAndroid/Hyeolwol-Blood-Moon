# Working on Hyeolwol

Single-file browser game: everything lives in `index.html` (about 1,200 long lines, one IIFE).
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
- The three stages share geometry; only floor texture, lighting and weather differ.
- No saved meta-progression; only the best score is kept in `localStorage`.
