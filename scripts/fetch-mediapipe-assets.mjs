// Self-hosts MediaPipe WASM + hand landmarker model into /public so runtime needs no CDN.
// Idempotent + never fails the install (runtime falls back to CDN if assets are missing).
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wasmSrc = join(root, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');
const wasmDst = join(root, 'public', 'mediapipe', 'wasm');
const modelDst = join(root, 'public', 'models', 'hand_landmarker.task');
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

try {
  if (existsSync(wasmSrc)) {
    mkdirSync(dirname(wasmDst), { recursive: true });
    cpSync(wasmSrc, wasmDst, { recursive: true, force: false });
    console.log('[vision] wasm → public/mediapipe/wasm');
  }
} catch (e) { console.warn('[vision] wasm copy skipped:', e.message); }

try {
  if (!existsSync(modelDst)) {
    mkdirSync(dirname(modelDst), { recursive: true });
    const res = await fetch(MODEL_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(modelDst, Buffer.from(await res.arrayBuffer()));
    console.log('[vision] model → public/models/hand_landmarker.task');
  } else console.log('[vision] model already present');
} catch (e) { console.warn('[vision] model download skipped (CDN fallback at runtime):', e.message); }
