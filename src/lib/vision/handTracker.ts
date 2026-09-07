// src/lib/vision/handTracker.ts
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import type { Pt } from './types';

const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const MODEL_CDN = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

const exists = async (url: string) => {
  try { const r = await fetch(url, { method: 'HEAD' }); return r.ok; } catch { return false; }
};

export class HandTracker {
  private lm: HandLandmarker | null = null;

  async init() {
    if (this.lm) return;
    const wasm = (await exists('/mediapipe/wasm/vision_wasm_internal.js')) ? '/mediapipe/wasm' : `${CDN}/wasm`;
    const model = (await exists('/models/hand_landmarker.task')) ? '/models/hand_landmarker.task' : MODEL_CDN;
    const vision = await FilesetResolver.forVisionTasks(wasm);
    this.lm = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: model, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }

  detect(video: HTMLVideoElement, tsMs: number): Pt[][] {
    if (!this.lm || video.readyState < 2) return [];
    return this.lm.detectForVideo(video, tsMs).landmarks as Pt[][];
  }

  dispose() { this.lm?.close(); this.lm = null; }
}
