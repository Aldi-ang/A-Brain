---
name: faster-whisper
description: Speech to text, locally on the CPU - transcribe or time-stamp spoken audio (a voice note, a video's narration, the capybara's lines, a salesman's recorded report) with Whisper on CTranslate2, up to 4x faster than openai/whisper. Word timestamps, language detection (Indonesian included), VAD to skip silence.
---

# faster-whisper (library card, written 2026-11-01)

Stored for Aldi's planned SFX/voice upgrade (his 2026-11-01 "in the future i will upgrade our app SFX with these
skills"). The repo sits beside this card; nothing here was installed or run.

**What it is:** a Python library (SYSTRAN, MIT). `WhisperModel("small", device="cpu", compute_type="int8")` then
`model.transcribe("file.wav", word_timestamps=True)` gives segments with start/end times and text.

**Install (only when a job needs it, ask first):** `pip install faster-whisper` - the model downloads on first use
from Hugging Face (tiny ~75 MB, small ~460 MB, large-v3 ~3 GB). CPU int8 is the setting for this PC.

**Where it fits KPM:** timing sound cues to a narrated demo or presentation video; checking what a voice line
actually says; the `real-sfx` skill (`speech_map.py`) and `earshot` both want speech timing.

**Left out of this copy:** `benchmark/benchmark.m4a` and `tests/data/*` (20 MB of test audio).
