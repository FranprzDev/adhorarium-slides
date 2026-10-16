# AdHorarium – final project presentation

Web slide deck (Spanish) for the oral presentation of **AdHorarium – Planificador académico para carreras de ingeniería
de la UTN**, final project of the *Seminario Integrador* course at UTN Facultad Regional Tucumán (2026).

- Live app: <https://adhorarium.vercel.app>
- App repository: <https://github.com/FranprzDev/AdHorarium>

## Features

- 18 slides on a fixed 1920 × 1080 stage scaled to any screen (16:9, letterboxed).
- Animated background rendered with [vgpu](https://vgpu.sh) (WebGPU): a WGSL shader with a navy/brass flow field and a
  timetable grid whose cells light up like booked slots. It blends between a dark hero look (cover, closing slide) and a
  quiet paper look behind content slides.
- **Fallback:** if WebGPU is missing, the adapter request fails, init takes longer than 6 s or the device is lost, the
  deck keeps a static CSS gradient with the same layout. Force it with `?nogpu`.
- **Offline:** JS, CSS, fonts (Inter and Source Serif 4, latin subset) and the shader are inlined into `index.html`;
  screenshots live next to it in `shots/`. No CDN requests.
- Speaker notes in Spanish with a timing plan of 20:00.

## Keyboard

| Key | Action |
| --- | --- |
| → · Space · PageDown · Enter | Next slide |
| ← · PageUp · Backspace | Previous slide |
| Home / End | First / last slide |
| F | Fullscreen |
| S | Presenter view in a new window (current and next slide, notes, timer); synced through `BroadcastChannel` |
| N | Notes and timer overlay in the same window |
| T | Restart the timer |
| ? | Shortcut help |

The URL hash holds the slide number (`#5`). Other views: `?print` (all slides stacked, used for the PDF), `?script`
(printable speaker script), `?static` (no animations, used for screenshots).

## Development

```bash
pnpm install
pnpm dev          # local dev server
pnpm build        # type-check and build to dist/
pnpm qr           # regenerate public/qr-adhorarium.svg
node scripts/capture.mjs shots <dir>   # 1920x1080 screenshot of every slide (needs a local Chromium)
node scripts/capture.mjs gpu <dir>     # same, with WebGPU on SwiftShader
node scripts/capture.mjs pdf <dir>     # slides PDF and speaker script PDF
```

Set `CHROMIUM_PATH` if Chromium is not at `/usr/bin/chromium`.

## Opening the offline build

`dist/index.html` opens with a double click. If a browser blocks local files, serve the folder instead:

```bash
npx serve dist
```

## Sources

Every figure in the deck comes from the project documentation (habilitación document and user manual) and real
production screenshots of the app taken on 15/10/2026. The commission catalog shown is the example data described in
the documentation.
