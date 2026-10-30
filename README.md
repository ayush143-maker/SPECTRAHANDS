# SPECTRAHANDS

A real-time, browser-based hand-tracking light synthesizer built with Next.js and React. It uses MediaPipe Tasks Vision to interpret hand movement and drive a visual, colour-focused interaction; camera processing is intended to run in the browser.

## Run locally

Install dependencies and start the Next.js development server:

    npm install
    npm run dev

Set up the MediaPipe assets with:

    npm run setup:vision

For a production build:

    npm run build

## Camera permissions

Allow camera access in a browser that supports the required camera APIs. If vision assets are missing, run the setup command and review the script under `scripts/`.

## Development checks

The package provides `npm run typecheck` and `npm run lint`. Keep camera access, model loading, and visual feedback responsive when changing the interaction.