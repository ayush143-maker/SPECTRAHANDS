# SPECTRAHANDS

**SPECTRAHANDS** is a real-time, browser-based hand-tracking light synthesizer. Built with Next.js and React, it uses MediaPipe Tasks Vision to interpret hand movement and turn it into a visual, colour-focused interaction. Camera processing is intended to run in the browser.

## Run locally

Install the dependencies and start the Next.js development server:

    npm install
    npm run dev

The package includes a setup command for the MediaPipe assets:

    npm run setup:vision

For a production build, run:

    npm run build

## Camera permissions

The browser needs camera permission for hand tracking. Open the app in a browser that supports the required camera APIs and allow access when prompted. If the vision assets are missing, run the setup command and review the script under scripts/.

## Development checks

Use npm run typecheck to check TypeScript and npm run lint for the configured lint command. Keep camera access, model loading, and visual feedback responsive when changing the interaction.
