# SPECTRAHANDS

A browser-based hand-tracking light synthesizer built with Next.js and React. It uses MediaPipe Tasks Vision to interpret hand movement and drive a visual, colour-focused interaction; camera processing is intended to run in the browser. To try the vision interaction, allow camera access in a browser that supports the required camera APIs, then interact in view of the camera. The README does not describe additional on-screen controls.

## Run locally

With Node.js and npm available, install dependencies and start the Next.js development server:

    npm install
    npm run dev

Set up the MediaPipe assets before using the vision interaction:

    npm run setup:vision

Open the local URL printed by the server in your browser. For a production build, run:

    npm run build

## Camera permissions

If vision assets are missing, run the setup command and review the setup script under `scripts/`. Camera access and model loading depend on the browser and available assets.

## Development checks

The package provides `npm run typecheck` and `npm run lint`. Keep camera access, model loading, and visual feedback responsive when changing the interaction.