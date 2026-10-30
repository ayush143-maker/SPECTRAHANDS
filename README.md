# SPECTRAHANDS

A browser-based hand-tracking light synthesizer built with Next.js and React. It uses MediaPipe Tasks Vision to interpret hand movement and drive a visual, colour-focused interaction. Camera processing is intended to run in the browser. To try the vision interaction, allow camera access in a browser that supports the required camera APIs, then interact in view of the camera.

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

No hosting provider or deployment configuration is documented.

## Configuration and data handling

The supplied root-file list includes `next.config.ts` but no `.env` file or `.env.example`. Review the existing Next.js configuration and source before adding settings; do not assume environment-variable names or backend services that this repository does not document. If you add an environment template, commit placeholders only and keep real secrets out of tracked files. Anything placed in browser-delivered code or otherwise exposed to the client must be treated as public, not as a secret.

Camera access is requested by the browser, and camera processing is described as intended to run in the browser. This README does not verify data flows or establish that camera data is never transmitted. Before relying on a privacy claim, inspect the implementation, model-loading requests, and network activity. Do not use real or sensitive data until the relevant handling has been reviewed.

## Troubleshooting

Use these as diagnostic steps; they are not reports of known failures:

1. Confirm the URL is the app route you intend to inspect. If the page does not appear, review the route and entry files under `src/` rather than assuming a particular route structure.
2. If hand tracking does not initialize, check browser camera permission and whether the browser supports the required camera APIs. Review the browser Console for permission or runtime errors.
3. Check that the required vision assets are available. The setup material is under `scripts/`; compare its paths with references in `src/`. The documented setup command is `npm run setup:vision`.
4. Inspect the Network panel for failed requests and determine whether each model or other resource is loaded from a local asset or fetched over the network. Network-dependent resources require connectivity; do not treat their failures as missing local files without checking the references.
5. Confirm local resource paths match files after any asset or script changes. No hosting provider or deployment configuration is documented, so diagnose any deployment-specific behavior in its actual context.

## Development checks

The package provides `npm run typecheck` and `npm run lint`. Run these after making changes, and check that camera access, model loading, and visual feedback continue to work together. No test results are reported here.

## Personalizing the interface

Begin in `src/` to locate the existing interface and visual styling. Review `tailwind.config.ts` before changing project-wide theme settings, and follow conventions already used in the source. The `scripts/` directory contains setup material for vision assets; keep its paths in mind when editing or relocating files. Check existing source references before adding or moving assets.

## Review checklist

These are checks to perform, not verified results:

- Review the app in relevant browsers and narrow and wide viewports. Check camera interaction, visible controls, and layout; do not infer support from the app loading in one browser.
- Use the keyboard to operate visible controls; review focus, accessible names, status messages, contrast, and whether the interaction has an understandable alternative for people who cannot use camera gestures.
- If visual feedback moves or pulses, check reduced-motion behavior. Review what the interface communicates when camera access or a required asset is unavailable.
- Review the size and continued use of vision assets before changing them. No asset sizes or loading measurements are reported here.

If camera access is tested outside local development, check it in the actual deployment context: browser camera APIs can depend on permissions and a secure context.