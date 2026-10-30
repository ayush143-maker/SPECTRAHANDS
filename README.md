# SPECTRAHANDS

SPECTRAHANDS is a browser-based hand-tracking light synthesizer built with Next.js and React. MediaPipe Tasks Vision detects hand landmarks that drive a visual interaction. The stage provides a canvas, HUD, theme dock, and controls for camera or demo mode, sound, and fullscreen. Theme and sound changes are forwarded to `SpectrumEngine`; fullscreen is requested for the stage wrapper.

## Run locally

With Node.js and npm installed, install dependencies, set up the MediaPipe assets, and start the development server:

```sh
npm install
npm run setup:vision
npm run dev
```

Open the local URL printed by the server and allow camera access to try the vision interaction. To create a production build, run:

```sh
npm run build
```

The package also provides `npm run typecheck` and `npm run lint`; no results are reported here.

## Camera and tracking behavior

Camera mode requests video at 1280×720 from the user-facing camera, with audio disabled. The stream is assigned to a hidden video element and attached to the engine. Camera mode is enabled after tracker initialization succeeds. Setup requests browser `getUserMedia` and asks the engine to ensure its tracker, with a 20-second timeout.

The stage checks camera health every 500 ms after an initial 2.5-second delay. Errors, stream end or mute events, or four consecutive unhealthy checks switch the engine back to demo mode and show a notice. Unmount cleanup stops stream tracks and the engine. The HUD starts with demo-mode values; camera hints and notices cover dark feeds, missing hands, permission issues, missing cameras, model timeouts, and feed loss.

The tracker checks for local MediaPipe WASM and model files with HTTP HEAD requests, then falls back to CDN URLs when local files are not found. It creates a HandLandmarker for up to two hands, attempting the GPU delegate before falling back to CPU. Detection returns no landmarks if the tracker is uninitialized or video is not ready. Gesture labels are derived from landmark-distance thresholds for pinch, fist, open hand, or calm.

## Project files and constraints

- `src/` — application source and interface.
- `scripts/` — setup material for vision assets.
- `package.json` — dependencies and declared scripts.
- `next.config.ts` — Next.js configuration.
- `tailwind.config.ts` — styling configuration.
- `gitignore` — a root file containing ignore patterns; Git automatically recognises `.gitignore`, not a file named `gitignore`, so verify this filename before relying on those patterns.

Camera access depends on browser support and permission; outside local development, it may also depend on a secure context. Model loading can involve CDN requests when local assets are absent. React state in the supplied stage holds theme, sound toggle, notices, camera state, and HUD state; no persistence mechanism is shown. The browser-processing description does not establish that camera data is never transmitted. Review implementation, model requests, and network activity before making privacy claims.

No hosting provider or deployment configuration is documented. Check the build output and whether publishing includes required vision assets; do not assume a static output directory or deployment mode. Review the permission flow and behavior when camera access or required assets are unavailable.