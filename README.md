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

## Camera permissions and troubleshooting

If vision assets are missing, run `npm run setup:vision` and review the setup script under `scripts/`. If hand tracking does not start, check that camera access is allowed in the browser and that the required assets are available. Camera access and model loading depend on the browser and available assets.

## Development checks

The package provides `npm run typecheck` and `npm run lint`. Run these after making changes, and check that camera access, model loading, and visual feedback continue to work together.

## Personalizing the interface

Begin in `src/` to locate the existing interface and visual styling. Review `tailwind.config.ts` before changing project-wide theme settings, and follow conventions already used in the source rather than assuming particular theme tokens. The `scripts/` directory contains setup material for vision assets; keep those setup files and their asset paths in mind when editing or relocating them. The supplied file list does not name an image or font directory, so check existing references in the source before adding or moving assets.

## Manual review checklist

These are actions to perform after a change, not verified results:

- Open the app at the local URL. If testing hand tracking, allow camera access in a browser that supports the required camera APIs, then move a hand in view of the camera and observe the visual feedback.
- Check the vision setup script under `scripts/` and the asset references it uses. Verify that required model or other media paths point to the expected files; if assets are absent, follow the documented setup instructions rather than assuming they are present.
- Try the camera interaction after changes to the interface, setup material, or visual feedback. If it does not start, check browser camera permission and asset availability; do not treat this checklist as confirmation that either is working.
- Inspect the interface at narrow mobile-sized and wide desktop-sized viewports. Check that the visual feedback and any visible controls remain in view and usable while the camera interaction is being reviewed.
- If you changed appearance or theme settings, inspect the affected interface at both viewport sizes and compare it with the existing conventions in `src/` and `tailwind.config.ts`.

## Accessibility review checklist

These are future checks to perform after a change; they are not claims that the app has been tested or found accessible:

- Use the keyboard to reach and operate every visible interface control, including any camera-related controls. Check that the interaction can be started, stopped, or otherwise managed without requiring hand gestures alone, where the interface provides those actions.
- Check that keyboard focus is clearly visible on controls and is not lost when camera access is requested, vision assets load, or the visual feedback updates.
- Review accessible names and instructions for controls, including any camera permission or status messaging. Check that changing visual output does not leave assistive-technology users without meaningful feedback.
- Review text, control, and focus-indicator contrast against the page and visual output. Since the experience is colour-focused, check whether important states or feedback can be understood without colour perception alone.
- If imagery or other visual content is added, check that informative content has appropriate text alternatives. Consider whether the hand-tracking interaction has an understandable alternative for people who cannot use the camera or hand gestures; do not assume one is already provided.
- If the visual feedback moves or pulses, check whether motion can be reduced or paused and whether the experience remains understandable with reduced motion requested.