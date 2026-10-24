# Coopanion synthesized SFX

10 WAVs exported and verified: **48,000 Hz / mono / PCM signed 16-bit LE**, total **209,702 bytes**. No application source, dependencies or installed Coopanion files were changed. Full measurements and SHA-256 values are in [metrics](<E:/projects/dsh-video/material/coopanion-sfx/metrics.json>).

| Asset | Seconds | PCM peak (FS=1) | RMS |
| --- | ---: | ---: | ---: |
| [tick](<E:/projects/dsh-video/public/sfx/coopanion-tick.wav>) | 0.096000 | 0.008331299 | 0.001037396 |
| [pop](<E:/projects/dsh-video/public/sfx/coopanion-pop.wav>) | 0.136000 | 0.024932861 | 0.003764898 |
| [select](<E:/projects/dsh-video/public/sfx/coopanion-select.wav>) | 0.166000 | 0.020843506 | 0.003048774 |
| [grab](<E:/projects/dsh-video/public/sfx/coopanion-grab.wav>) | 0.206000 | 0.031311035 | 0.005074107 |
| [squeak](<E:/projects/dsh-video/public/sfx/coopanion-squeak.wav>) | 0.156000 | 0.013793945 | 0.002022171 |
| [poke](<E:/projects/dsh-video/public/sfx/coopanion-poke.wav>) | 0.155938 | 0.027496338 | 0.004630953 |
| [jump](<E:/projects/dsh-video/public/sfx/coopanion-jump.wav>) | 0.305875 | 0.038665771 | 0.007919120 |
| [land](<E:/projects/dsh-video/public/sfx/coopanion-land.wav>) | 0.226000 | 0.042236328 | 0.008664709 |
| [sparkle](<E:/projects/dsh-video/public/sfx/coopanion-sparkle.wav>) | 0.436000 | 0.049652100 | 0.009178163 |
| [happy](<E:/projects/dsh-video/public/sfx/coopanion-happy.wav>) | 0.296000 | 0.088623047 | 0.010239888 |

## Source and license

- Installed package: `cortico-world-desktop-pet` **0.2.0**, author **Pal AI Lab**, license **AGPL-3.0-or-later**, verified from the installed [package manifest](<G:/Coopanion/resources/app/node_modules/cortico-world-desktop-pet/package.json>).
- Upstream repository recorded by the package: https://github.com/Pal-AI-Lab/Coopanion.git, directory `packages/cortico-world-desktop-pet`. The installed manifest supplies no upstream commit.
- Full [sound.js](<E:/projects/dsh-video/material/coopanion-sfx/sound.js>) (189 lines) and [LICENSE](<E:/projects/dsh-video/material/coopanion-sfx/LICENSE>) (662 lines) were copied byte-for-byte with `ops_copy` using observed source revisions from `G:/Coopanion/resources/app/node_modules/cortico-world-desktop-pet`. Both originals and copied source remain unmodified.
- SHA-256 source: `b09c754008dd79509711aba1a5b6e052e1ab39962445aba0e43118f8d54edac3`; license: `8d56b405468aad11f87ab5763f901e276e08d9646ff5c8481b1762b6b789e9ed`; installed manifest: `7629f1e63739a22ed8c7feb0c7bf911abef78b2df67b36ccd3bc0ac5505a2ce6`.
- Preserve attribution, license and corresponding source when redistributing covered code. These are not claimed to be royalty-free assets. Whether rendered output is itself a covered work depends on its content (AGPL section 0); no separate asset license was found in the inspected source/manifest. Review the intended distribution rather than assuming a permissive license.

## Reproduce

[render.mjs](<E:/projects/dsh-video/material/coopanion-sfx/render.mjs>) uses only Node built-ins and the installed ego-browser. Run while the authorized TaskSpace 11 remains active; it creates/closes only its own `about:blank` Page, never operates p1 and never finishes the shared space. TaskSpace 9 was unavailable; the parent resumed this task in user-authorized replacement space 11. The export Page p4 was closed successfully.

```sh
node --check material/coopanion-sfx/render.mjs
ego-browser nodejs -e "await import('file:///E:/projects/dsh-video/material/coopanion-sfx/render.mjs')"
```

The full unmodified source is imported into the active blank Page (`document.hidden === false`). Injected `window.AudioContext` returns a native `OfflineAudioContext`; its `resume()` alone becomes a resolved no-op. Each sound uses `createSfx({volume: .55})`, `unlock()`, then `play(name)` without extra arguments (soft `land`), preserving all tone parameters and the original native DynamicsCompressor/default settings. No normalization, extra limiter or resampling is applied.

Each render resets the LCG seed to `0x434f4f50`. A 2-second window is trimmed after the last nonzero 16-bit-quantized sample plus exactly 1,440 zero samples (30 ms); the start remains intact. Every sound is rendered twice and exact PCM equality is asserted. Chromium's multi-voice mixing produced a maximum floating-point difference of `7.450580596923828e-9` for `sparkle`, but zero PCM differences (also checked over six diagnostic renders); other sounds matched exactly in float. Bitwise results across different browser versions/platforms are not promised.

All runtime checks passed: finite samples, non-silence, float and PCM peak < 1, exact repeat PCM, zero tail, WAV format and exact disk readback. The script prints CSV metrics, verifies existing identical WAVs and refuses to overwrite differing outputs. Renderer: Ego Lite 0.6.0.20 / Chrome 154.0.0.0 on Windows; the update notice was not acted on.
