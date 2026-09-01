---
confidence: certain
checked: 2026-09-01
---

# 7 Days to Die — mod load order and the infinite loading screen

## The symptom

Game hangs forever on the loading screen after installing mods. No crash, no error popup.

## The real cause

`Mods/` is read in **alphabetical folder order**. A mod whose `blocks.xml` does
`<property name="Extends" value="SomeBlock"/>` needs the mod that *defines* `SomeBlock`
to load **earlier**. If it loads later, `blocks.xml` fails to parse — and then
`items.xml`, `recipes.xml`, `loot.xml`, `quests.xml`, `traders.xml` and `biomes.xml`
all fail too. No item list, so loading never finishes.

**One ordering mistake, seven broken files.** The cascade is why the screen just sits there.

## How to find it in 30 seconds

Log lives at `C:\Users\ASUS\AppData\Roaming\7DaysToDie\logs\output_log_client__*.txt`.

```bash
grep -n "ERR XML loader\|EXC Could not find" <newest log>
```

The `EXC Could not find Extends block <Name>` line names the missing block. Then:

```bash
cd "C:/Users/ASUS/AppData/Roaming/7DaysToDie/Mods"
find . -name "*.xml" -exec grep -il "<Name>" {} +
```

The mod that **defines** it must sort before the mod that **extends** it.

## The 2026-09-01 case

Project Z modpack. `AAG-ProjectZ IndustrialAutomation` extended `AutoMinerIron`,
defined at line 2367 of `AAK-PROJECT Z Full version/Config/blocks.xml`. `AAG` < `AAK`,
so the add-on loaded 7ms before its own base. Fixed by renaming the three add-on
folders `AAG/AAH/AAJ` → `AAT/AAU/AAV`. Game loaded.

## The trap — Vortex's load order screen lies

Aldi dragged Project Z to position 1 in Vortex's Load Order tab and clicked
**Deploy Mods**. The folder prefixes on disk **did not change**. Vortex showed the new
order in its list while the disk kept the old one.

**Never trust the Vortex list.** Check the disk:

```bash
ls -d "C:/Users/ASUS/AppData/Roaming/7DaysToDie/Mods"/AA* | cut -c1-40
```

Renaming folders by hand works and is instant, but **any Vortex redeploy rewrites the
prefixes and brings the hang back**. That is a when, not an if.

## Also seen, not fatal

- `WRN XML patch ... did not apply` — a mod patching something that isn't there.
  Usually a hotfix paired with the wrong base mod. Ignorable; the mod just misbehaves.
- Loose `.zip` / `.rar` / `.7z` files inside `Mods/` — the game ignores them. Clutter only.

## OPEN as of 2026-09-01 11:53 WIB — world will not load

Second, different failure. Not XML this time.

- `output_log_client__2026-09-01__11-41-06.txt:300` — `EXC blob heap index 65535 out of bounds`
  in `AAR-SmartAnimatedLoot2.0.0 SmartCore2.0.0 For3.X`. Broken/mismatched DLL.
  `CustomParticleLoader` then failed to init, and Harmony failed to patch `GameManager::explode`.
- In that run the world DID load (`Ply: 1`, `Chunks: 40`, 93 FPS) behind a stuck loading screen.
- Aldi was told to disable SmartAnimatedLoot in Vortex and redeploy.

**Not yet read:** `output_log_client__2026-09-01__11-53-21.txt`. He says it stops partway and the
world never loads. Start there next session — same two greps:

```bash
grep -n " EXC \| ERR " <log> | grep -v TileEntityComposite | head
grep -n "INF \|WRN \|ERR " <log> | tail -20
```

Also pending: `Mods/zzzz-NoHygieneStress` (the hygiene/stress off switch) was created outside
Vortex, so any Purge or Deploy deletes it. Check it still exists before assuming hygiene is off.
