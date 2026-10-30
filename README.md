# SPECTRAHANDS

A browser-based hand-tracking light synthesizer built with Next.js and React. It uses MediaPipe Tasks Vision to interpret hand movement and drive a visual, colour-focused interaction; camera processing is intended to run in the browser. To try the vision interaction, allow camera access in a browser that supports the required camera APIs, then interact in view of the camera. The README does not describe additional on-screen controls.

## Run locally

With Node.js and npm available, install dependencies, set up the MediaPipe assets, and start the Next.js development server:

    npm install
    npm run setup:vision
    npm run dev

Open the local URL printed by the server in your browser. Allow camera access to review the vision interaction. For a production build, run:

    npm run build

No hosting provider or deployment configuration is documented.

## Camera permissions and troubleshooting

If vision assets are missing, run `npm run setup:vision` and review the setup script under `scripts/`. If hand tracking does not start, check that camera access is allowed in the browser and that the required assets are available. Camera access and model loading depend on the browser and available assets.

## Development checks

The package provides `npm run typecheck` and `npm run lint`. Run these after making changes, and keep camera access, model loading, and visual feedback working together when changing the interaction.