import { useEffect, useRef } from "react";

import { SteamEngine, type EmitterPoint, type SteamConfig } from "@/lib/steam/steamEngine";

const DEFAULT_CONFIG: SteamConfig = {
  heatLevel: "piping",
  density: 1,
  speed: 1,
  wind: 0.12,
  turbulence: 1.2,
  dispersion: 1.1,
  opacity: 0.8,
  temperatureTint: "golden",
  heatHaze: false,
  tendrilsEnabled: true,
  interactiveSwirl: true,
};

// Emitter coordinates are in % of the container's width/height.
// Tuned for a dish sitting roughly center-right, lower-middle of the frame —
// adjust x/y here once you can see exactly where the plate sits in the photo.
const DEFAULT_EMITTERS: EmitterPoint[] = [
  { id: "e1", x: 58, y: 62, intensity: 1, radius: 42 },
  { id: "e2", x: 68, y: 58, intensity: 0.8, radius: 36 },
  { id: "e3", x: 50, y: 66, intensity: 0.75, radius: 34 },
];

interface SteamOverlayProps {
  className?: string;
  config?: Partial<SteamConfig>;
  emitters?: EmitterPoint[];
  /** Track pointer movement within this ref's element to let the cursor swirl the steam. */
  interactiveContainerRef?: React.RefObject<HTMLElement | null>;
}

export function SteamOverlay({
  className,
  config,
  emitters = DEFAULT_EMITTERS,
  interactiveContainerRef,
}: SteamOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SteamEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const mergedConfig: SteamConfig = { ...DEFAULT_CONFIG, ...config };
    const engine = new SteamEngine(canvasRef.current, mergedConfig, emitters);
    engineRef.current = engine;
    engine.start();

    const handleResize = () => engine.handleResize();
    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (canvasRef.current.parentElement) {
      observer = new ResizeObserver(handleResize);
      observer.observe(canvasRef.current.parentElement);
    }

    const target = interactiveContainerRef?.current;
    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      engine.setMousePosition(e.clientX - rect.left, e.clientY - rect.top, true);
    };
    const handlePointerLeave = () => {
      engine.setMousePosition(-1000, -1000, false);
    };
    if (target) {
      target.addEventListener("pointermove", handlePointerMove);
      target.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
      if (target) {
        target.removeEventListener("pointermove", handlePointerMove);
        target.removeEventListener("pointerleave", handlePointerLeave);
      }
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.setConfig({ ...DEFAULT_CONFIG, ...config });
  }, [config]);

  useEffect(() => {
    engineRef.current?.setEmitters(emitters);
  }, [emitters]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
