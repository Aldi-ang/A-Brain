---
name: kokoro-onnx
description: Text to speech, locally on the CPU - turn a line of text into a natural voice WAV with Kokoro-82M on onnxruntime (many voices, speed control, near real time). For spoken app cues, a voiced tutorial or capybara line, or narration for a demo video.
---

# kokoro-onnx (library card, written 2026-11-01)

Stored for Aldi's planned SFX/voice upgrade (his 2026-11-01 "in the future i will upgrade our app SFX with these
skills"). The repo sits beside this card; nothing here was installed or run.

**What it is:** a Python package (thewh1teagle, MIT). `Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")` then
`kokoro.create(text, voice="af_sarah", speed=1.0, lang="en-us")` returns samples + sample rate to write as WAV.

**Install (only when a job needs it, ask first):** `pip install kokoro-onnx soundfile`, plus the two model files from
the repo's GitHub releases (~300 MB, a smaller int8 model ~90 MB). See `README.md` and `examples/`.

**Check before promising:** voice languages - English is strongest; whether an Indonesian voice exists must be read
in the release notes, not assumed. A generated voice is synthesis: the `real-sfx` skill's "never synthesized" rule
is about sound effects, so say plainly when a cue is a made voice.
