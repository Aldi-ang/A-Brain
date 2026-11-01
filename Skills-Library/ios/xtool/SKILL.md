---
name: xtool
description: Build and install iOS apps from Windows or Linux with SwiftPM instead of Xcode - for a native iPhone app or wrapper of KPM without a Mac. Needs an Apple ID (free or paid developer account) to sign and install on a device.
---

# xtool (library card, written 2026-11-01)

Stored at Aldi's request on 2026-11-01 for future jobs. It is NOT a sound tool (he listed it with the SFX skills).
The repo sits beside this card; nothing here was installed or run - its `*.sh` files are build scripts, never run
them from this folder.

**What it is:** a cross-platform Xcode replacement (xtool-org, MIT, Swift). `xtool setup`, `xtool new`, `xtool dev`
builds a SwiftPM app and installs it on a USB-connected iPhone.

**Before promising anything:** on Windows it runs under WSL (Linux), needs the Xcode `.xip` for the iOS SDK and an
Apple account for signing; read `Documentation/` (the DocC tutorial) first. KPM today is a web app / PWA - a native
build is a new project, not a setting.
