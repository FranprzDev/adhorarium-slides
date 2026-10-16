import { clock, effect, frameLoop, init, surface } from "vgpu";
import type { FrameLoopHandle, Gpu } from "vgpu";
import backgroundShader from "./shaders/background.wgsl";

export enum BackgroundMode {
  Dark = 0,
  Light = 1,
}

export enum RendererKind {
  WebGpu = "webgpu",
  Fallback = "fallback",
}

export interface BackgroundController {
  readonly kind: RendererKind;
  setMode(mode: BackgroundMode): void;
}

const INIT_TIMEOUT_MS = 6000;
const MODE_EASING_PER_SECOND = 3.2;
const MAX_FPS = 40;

/**
 * Starts the animated vgpu background. Any failure (no WebGPU, no adapter, init timeout,
 * device loss) keeps the static CSS background that sits under the canvas, so the layout
 * never changes between both renderers.
 */
export async function startBackground(
  canvas: HTMLCanvasElement,
  initialMode: BackgroundMode,
  forceFallback: boolean,
): Promise<BackgroundController> {
  const fallback = createFallback(initialMode);
  if (forceFallback || !("gpu" in navigator)) {
    return fallback;
  }

  let gpu: Gpu;
  try {
    gpu = await withTimeout(init({ powerPreference: "low-power" }), INIT_TIMEOUT_MS);
  } catch (error) {
    console.info("[deck] WebGPU unavailable, using the CSS background.", error);
    return fallback;
  }

  try {
    const canvasSurface = surface(gpu, canvas, { dpr: Math.min(window.devicePixelRatio, 1) });
    const background = effect(gpu, backgroundShader, {
      set: { params: { time: 0, width: canvasSurface.size[0], height: canvasSurface.size[1], mode: initialMode } },
    });
    await background.compile(canvasSurface);
    canvasSurface.onResize(({ width, height }) => {
      background.set({ params: { width, height } });
    });

    const time = clock(gpu);
    let targetMode: number = initialMode;
    let currentMode: number = initialMode;
    let firstFrame = true;

    const loop: FrameLoopHandle = frameLoop(
      gpu,
      (currentFrame) => {
        const step = Math.min(1, time.deltaTime * MODE_EASING_PER_SECOND);
        currentMode += (targetMode - currentMode) * step;
        background.set({ params: { time: time.time, mode: currentMode } });
        currentFrame.pass(canvasSurface, background);
        if (firstFrame) {
          firstFrame = false;
          document.documentElement.dataset.renderer = RendererKind.WebGpu;
        }
      },
      { fps: MAX_FPS },
    );

    gpu.onError((gpuError) => {
      console.warn("[deck] WebGPU error, falling back to the CSS background.", gpuError);
      loop.stop();
      document.documentElement.dataset.renderer = RendererKind.Fallback;
    });
    void watchDeviceLoss(gpu, loop);

    return {
      kind: RendererKind.WebGpu,
      setMode(mode: BackgroundMode) {
        targetMode = mode;
        fallback.setMode(mode);
      },
    };
  } catch (error) {
    console.info("[deck] vgpu setup failed, using the CSS background.", error);
    return fallback;
  }
}

async function watchDeviceLoss(gpu: Gpu, loop: FrameLoopHandle): Promise<void> {
  const info = await gpu.lost;
  console.warn("[deck] GPU device lost, falling back to the CSS background.", info.message);
  loop.stop();
  document.documentElement.dataset.renderer = RendererKind.Fallback;
}

function createFallback(initialMode: BackgroundMode): BackgroundController {
  document.documentElement.dataset.renderer = RendererKind.Fallback;
  applyFallbackMode(initialMode);
  return { kind: RendererKind.Fallback, setMode: applyFallbackMode };
}

function applyFallbackMode(mode: BackgroundMode): void {
  document.documentElement.dataset.bg = mode === BackgroundMode.Dark ? "dark" : "light";
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer = 0;
  const timeout = new Promise<never>((_, reject) => {
    timer = window.setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    window.clearTimeout(timer);
  }
}
