# SPECTRAHANDS

SPECTRAHANDS is a browser-based hand-tracking light synthesizer built with Next.js and React. It uses MediaPipe Tasks Vision to interpret hand movement and drive a visual, color-focused interaction. Camera processing is intended to run in the browser. Trying the vision interaction requires a browser that supports the necessary camera APIs and permission to access the camera.

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

## Development references

- `src/` — application source and interface.
- `scripts/` — setup material for vision assets.
- `package.json` — dependencies and declared scripts.
- `next.config.ts` — Next.js configuration.
- `tailwind.config.ts` — styling configuration.
- `gitignore` — a root file containing ignore patterns; Git automatically recognises `.gitignore`, not a file named `gitignore`, so verify this filename before relying on those patterns.

Check asset paths in `src/` and `scripts/` before moving or changing related files. The package also provides `npm run typecheck` and `npm run lint`; no results are reported here.

## Camera and data handling

Camera access is requested by the browser, and processing is described as intended to run in the browser. This README does not verify data flows or establish that camera data is never transmitted. Before making privacy claims, inspect the implementation, model-loading requests, and network activity. Treat anything exposed in browser-delivered code as public. The supplied root files include no `.env` file or `.env.example`; review the existing configuration before adding settings, and do not assume undocumented environment variables or backend services.

## Review before publishing

No hosting provider or deployment configuration is documented. Check what the configured build produces and whether the chosen publishing setup includes required vision assets; do not assume a static output directory or deployment mode. In the published context, review the page, controls, camera permission flow, and model and other resource requests. Camera access outside local development may depend on browser permissions and a secure context.

Also review keyboard operation, focus visibility, accessible names, status messages, contrast, and alternatives for people who cannot use camera gestures. Check reduced-motion behavior if visual feedback moves or pulses, and consider how the interface responds when camera access or a required asset is unavailable.