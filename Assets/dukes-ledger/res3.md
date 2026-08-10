**1) HTMLAudioElement vs Web Audio API vs sprite**  
- **HTMLAudioElement**: Simplest; acceptable latency ~50–100ms on low‑end Android if `<audio>` is preloaded.  
- **Web Audio API**: Lower latency (<10ms) but heavier code (~50KB+gzip), overkill for UI blips.  
- **Sprite**: Single file reduces HTTP overhead, but you must decode whole sprite upfront (memory), and you lose independent preloading of individual sounds.  

→ **Use HTMLAudioElement** with preloaded `<audio>` elements. It’s fine for 5 short sounds, works offline, and keeps code minimal.

**2) Mobile autoplay‑unlock**  
Mobile browsers block `play()` until after a user gesture. Fix:  
- Create `Audio` objects on first user interaction (e.g., a click/touch anywhere).  
- Store them in a global cache; all subsequent `play()` calls will work.  

**3) Rapid repeated triggers**  
- Clone the `Audio` element for each trigger: `const clone = original.cloneNode(); clone.play();`  
- Pre‑create a small pool (e.g., 3 clones per sound) to avoid GC churn.  
- Or use `currentTime = 0` + `play()` on a single element, but cloning guarantees no cut‑off.

**4) File format & encoding**  
- **Format**: OGG Vorbis (better compression than MP3 for short clips).  
- **Settings**: 64 kbps mono, 22 kHz, 0–1 s length.  
- **Tool**: `ffmpeg -i input.wav -c:a libvorbis -q:a 5 -ac 1 output.ogg`  
- Expect ~5–15 KB per sound; 5 sounds ≈ 75 KB total.

**5) vite-plugin-pwa workbox globPatterns**  
In `vite.config.ts`:

```ts
VitePWA({
  workbox: {
    globPatterns: [
      '**/*.{js,css,html,ico,png,svg,webp,ogg}', // add ogg
    ],
  },
})
```

**6) Minimal React hook**  

```tsx
// useSound.ts
import { useEffect, useRef } from 'react'
import { liteMode } from './performance'

const SOUNDS = {
  add: '/sounds/add.ogg',
  remove: '/sounds/remove.ogg',
  confirm: '/sounds/confirm.ogg',
  error: '/sounds/error.ogg',
  panel: '/sounds/panel.ogg',
} as const

const audioCache = new Map<string, HTMLAudioElement>()
let unlocked = false

export function useSound() {
  const preloadRef = useRef(false)

  // Preload on mount (silent)
  useEffect(() => {
    if (preloadRef.current) return
    preloadRef.current = true
    Object.entries(SOUNDS).forEach(([key, src]) => {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = src
      audioCache.set(key, audio)
    })
  }, [])

  const play = (key: keyof typeof SOUNDS) => {
    if (liteMode) return

    const original = audioCache.get(key)
    if (!original) return

    // Mobile unlock: on first interaction, play/pause immediately
    if (!unlocked) {
      original.play().catch(() => {}).then(() => {
        original.pause()
        original.currentTime = 0
      })
      unlocked = true
    }

    // Clone to allow rapid repeats
    const clone = original.cloneNode() as HTMLAudioElement
    clone.play().catch(() => {}) // ignore autoplay errors after unlock
  }

  return { play }
}
```

```tsx
// Usage
const { play } = useSound()
<button onClick={() => play('add')}>Add</button>
```

**Total overhead**:  
- 5 OGG files ~75 KB  
- Hook code < 2 KB (gzipped)  
- No extra libs, works offline, respects Lite Mode, fast enough for low‑end Android.