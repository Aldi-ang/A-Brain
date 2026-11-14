---
title: Gaming tune for the ROG Zephyrus G15 (GA503QR)
date: 2026-11-14
status: OPEN — waiting on Aldi (every change is his to make; Claude only measured)
---

# Gaming tune for the ROG Zephyrus G15 (GA503QR)

Models applied: Inversion, Opportunity Cost.

## The problem, in his words (2026-11-14)

> *"i want u to make my pc faster optimized it until the best performance possible so that i can play game at the best performance that my pc can do, unlocked those secret  power that my gpu and cpu have for this can u do that?"*

## What was measured (2026-11-14 07:40 WIB, read-only)

| Fact | Value |
|---|---|
| Machine | ASUS ROG Zephyrus G15 GA503QR, BIOS GA503QR.416 |
| CPU / GPU | Ryzen 9 5900HS (8c/16t) / RTX 3070 Laptop, driver 621.14 |
| Screen | 2560x1440 at 165 Hz (already at max refresh) |
| Power | Armoury Crate "Turbo" plan active; `nvidia-smi` power.max_limit 100 W (Dynamic Boost already allowed) |
| RAM | 16 GB (2x8 GB DDR4-3200, dual channel). Only 1.5 GB free with no game running. Biggest users: Claude app 3.0 GB, Brave 2.7 GB, node 2.1 GB, Steam web helper 1.3 GB |
| GPU at idle | dGPU awake in P0, 59.75 C, 27.8 W, held by brave.exe (x2) and steam.exe |
| Security | Memory Integrity (HVCI) ON, VBS running |
| Games | almost all on D: = SanDisk Portable SSD over USB; C: is internal NVMe with 174.5 GB free |
| Startup | about 25 entries: Razer Cortex, Razer App Engine, SteelSeries GG, Overwolf, uTorrent Web, Lunar Client, Docker Desktop, Ollama, Gemini, Epic, Spotify, Discord, Google Drive (3 entries), OneDrive, 9router |

## Options

| # | Change | Gain | Cost / risk |
|---|---|---|---|
| 1 | Close Claude, Brave, node (9router) before playing | frees about 7-8 GB RAM, stops paging stutter | must reopen after |
| 2 | Brave + Steam set to Power saving GPU | dGPU can sleep at idle: cooler start, more battery | none found |
| 3 | Disable junk startup apps in Task Manager | RAM + CPU back every boot | keep 9router, Google Drive (Lancelot inbox), SecurityHealth |
| 4 | Memory Integrity OFF | a few % FPS in some games | weaker kernel protection against malicious drivers |
| 5 | Armoury Crate Manual mode GPU offset (+100 core / +300 mem, step up) | about 3-7% | crash = back off 50 MHz; NVIDIA keeps the power cap |
| 6 | Move the main game from D: (USB) to C: (NVMe) | faster loads, less streaming stutter | 174 GB free on C: |
| 7 | Replace the 8 GB module with 16 GB DDR4-3200 SODIMM | 24 GB total, biggest real hardware gain | money; one 8 GB is likely soldered (check before buying) |
| 8 | Clean vents, raise the back, always on AC | stops thermal throttling on a 5-year-old laptop | none |

## Rejected on purpose

- "Secret power" registry packs, debloat scripts, disabling Defender, Ultimate Performance plan: Turbo already gives the 100 W limit; these add risk, not FPS.
- Claude changing the settings itself: OS and security settings are his to change. Claude gives the exact commands and checks the result after.

## Decision

2026-11-14 07:54 WIB — his words: *"there is no power saving option when the power is plugged for that brave, i can just close it actually and can u make pressing all the commands on one press instead make it simple for me"*.

Built `C:\Users\ASUS\OneDrive\Desktop\Game Mode.bat` (double-click): options 1-3 in one press (GPU preference for Brave + Steam, 6 startup entries disabled through `StartupApproved\Run`, closes Brave / Razer Cortex / Overwolf / uTorrent / Spotify / Lunar / Gemini, asks Y/N before closing Claude). Dry run printed every command. Trap found on the way: `taskkill /im Overwolf*` treats `*` literally; only `/fi "IMAGENAME eq Overwolf*"` matches (tested on a fake name).

Also found: McAfee is the active antivirus (mc-fw-host 455 MB) with Defender passive. Removing McAfee is his call; Defender takes over by itself.

Result after his run (07:57 WIB): 3 GPU entries and 6 startup entries written, Brave closed, RAM free 1.5 -> 3.7 GB, dGPU P0 28.28 W -> P8 13.31 W (Steam still on it until restarted). Razer Cortex NOT closed: `taskkill` -> "Access is denied" (it starts from HKLM Run as admin). Fix is to uninstall Cortex, not to make the .bat ask for admin.

08:05 WIB: he uninstalled Razer Cortex himself (asked first *"but cortex does help isnt? i clean this pc and optimize gaming with that before?"*). Checked: no process, no uninstall entry, no HKLM Run entry, no service.

Options 4-8 still OPEN — waiting on Aldi.
