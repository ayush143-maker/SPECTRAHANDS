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

## Deployment-readiness checklist

The supplied root files include `next.config.ts`, `package.json`, `src/`, and `scripts/`. No hosting provider or deployment configuration is documented. The items below are recommendations to verify for the publishing method you choose; they are not claims that a deployment has been configured or tested.

- [ ] Inspect `next.config.ts` and the project scripts before choosing a publishing setup. Confirm what the build produces and what files or runtime the selected setup expects. Do not assume that a static output directory exists or that a particular deployment mode is configured.
- [ ] Run the documented production build with `npm run build` and review its result. If the publishing setup expects a particular output or root directory, verify that it matches the build output rather than selecting a directory by assumption.
- [ ] Check that the MediaPipe setup assets and any other required resources are present in the published output and that references in `src/` and `scripts/` resolve correctly after publishing. Review model and other resource requests in the browser Network panel.
- [ ] Review configuration before publishing. The supplied root files include `next.config.ts` but no `.env` file or `.env.example`; do not assume undocumented environment-variable names or backend services. Keep real secrets out of tracked files, and treat anything exposed in browser-delivered code as public.
- [ ] Review the implementation, model-loading requests, and network activity before making privacy claims. Camera processing is described as intended to run in the browser, but this README does not verify data flows or establish that camera data is never transmitted.
- [ ] After publishing, open the actual published experience in a browser and check the page, controls, camera permission flow, and required assets. Review the Console and Network panel for errors or failed requests. Test camera access in that actual context because browser camera APIs can depend on permissions and a secure context.
- [ ] Preview narrow and wide viewports and relevant browsers. Check layout, keyboard operation, visible focus, accessible names, status messages, contrast, and alternatives for people who cannot use camera gestures. Check reduced-motion behavior if visual feedback moves or pulses, and review what the interface communicates when camera access or a required asset is unavailable.

## Configuration and data handling

The supplied root files include `next.config.ts` but no `.env` file or `.env.example`. Review the existing Next.js configuration and source before adding settings; do not assume environment-variable names or backend services that are not documented. Keep real secrets out of tracked files. Anything exposed in browser-delivered code must be treated as public.

Camera access is requested by the browser, and camera processing is described as intended to run in the browser. This README does not verify data flows or establish that camera data is never transmitted. Before relying on a privacy claim, inspect the implementation, model-loading requests, and network activity.

## Development and editing

Start in `src/` to locate the existing interface and visual styling. Review `tailwind.config.ts` before changing project-wide theme settings. The `scripts/` directory contains setup material for vision assets; check its paths against references in `src/` before moving or changing related files.

The package provides `npm run typecheck` and `npm run lint`. No test or check results are reported here.

## Contributor handoff

Keep changes scoped to the intended interface, interaction, or asset update. Preserve existing filenames and relative references unless a change requires otherwise; when moving or renaming a file, update the references that depend on it. In your handoff, summarize what changed and name the affected areas or files.

Before publishing, manually review the changed experience. The checklist above describes review actions, not verified results.

## Manual review checklist

- Review the app in relevant browsers and narrow and wide viewports. Check camera interaction, visible controls, and layout.
- Use the keyboard to operate visible controls; review focus, accessible names, status messages, contrast, and alternatives for people who cannot use camera gestures.
- If visual feedback moves or pulses, check reduced-motion behavior. Review what the interface communicates when camera access or a required asset is unavailable.
- Check model and other resource requests in the Network panel, and confirm local asset paths still match after edits.

If camera access is tested outside local development, check it in the actual deployment context: browser camera APIs can depend on permissions and a secure context.

## Final release review

- Confirm the documented starting point still matches the files present at the repository root.
- Check the scripts and dependency versions in `package.json`; use the repository's declared workflow rather than assuming a generic build command.
- Review the published result once on a narrow screen and once on a wider screen; treat this as a release check, not an automated test report.
