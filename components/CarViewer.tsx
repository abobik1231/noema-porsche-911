"use client";
import { useEffect, useRef, useState } from "react";
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import type { ModelViewerElement } from "@google/model-viewer";
declare module "react" {
  // React custom elements are registered through JSX.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX { interface IntrinsicElements {
    "model-viewer": DetailedHTMLProps<HTMLAttributes<ModelViewerElement>, ModelViewerElement> & { src: string; alt: string; exposure: string };
  } }
}
type Props = { color?: string; onRotate?: (rotated: boolean) => void; engine?: boolean; wheel?: boolean; children?: ReactNode };
export default function CarViewer({ color, onRotate, engine = false, wheel = false, children }: Props) {
  const viewer = useRef<ModelViewerElement | null>(null);
  const colorRef = useRef(color);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(100);
  const zoomRef = useRef(100);
  const [attempt, setAttempt] = useState(0);
  const initialAngle = engine ? 35 : wheel ? 22 : 65;

  const orbit = (theta: number, mobile = false) => `${theta}deg ${engine ? 68 : wheel ? 82 : 79}deg ${engine ? 105 : wheel ? 95 : mobile ? 90 : 60}%`;
  useEffect(() => {
    let active = true;
    import("@google/model-viewer").then(({ ModelViewerElement }) => {
      ModelViewerElement.dracoDecoderLocation = "/draco/";
      if (active) setReady(true);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    colorRef.current = color;
    viewer.current?.model?.materials.filter((m) => m.name === "PAINT_COLOR_4").forEach((m) => {
      if (color) m.pbrMetallicRoughness.setBaseColorFactor(color);
    });
  }, [color]);
  useEffect(() => {
    const element = viewer.current;
    if (!element) return;
    const media = window.matchMedia("(max-width: 700px)");
    const load = () => {
      if (!engine && !wheel && colorRef.current) element.model?.materials.filter((m) => m.name === "PAINT_COLOR_4").forEach((m) => m.pbrMetallicRoughness.setBaseColorFactor(colorRef.current!));
      setLoaded(true);
      setFailed(false);
    };
    const rotate = () => {
      const degrees = element.getCameraOrbit().theta * 180 / Math.PI;
      onRotate?.(Math.abs(degrees - initialAngle) > 5);
    };
    const error = () => setFailed(true);
    const reportProgress = (event: Event) => setProgress(Math.round((event as CustomEvent<{totalProgress:number}>).detail.totalProgress * 100));
    let frame = 0;
    let decayTimer = 0;
    const pointers = new Set<number>();
    const defaultDecay = element.interpolationDecay;
    const fit = (returning = false) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const radius = engine ? 105 : wheel ? 95 : (media.matches ? 90 : 60) * 100 / zoomRef.current;
      window.clearTimeout(decayTimer);
      element.interpolationDecay = returning && !reducedMotion ? 420 : defaultDecay;
      element.cameraOrbit = `${initialAngle}deg ${engine ? 68 : wheel ? 82 : 79}deg ${radius}%`;
      // Dragging changes the live camera, but leaves the orbit attribute unchanged.
      element.requestUpdate("cameraOrbit");
      if (reducedMotion) {
        void element.updateComplete.then(() => element.jumpCameraToGoal());
      } else if (returning) {
        decayTimer = window.setTimeout(() => { element.interpolationDecay = defaultDecay; }, 1800);
      }
    };
    const home = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => fit(true)); };
    const down = (event: PointerEvent) => {
      if (event.composedPath().some((node) => node instanceof HTMLButtonElement)) return;
      cancelAnimationFrame(frame);
      window.clearTimeout(decayTimer);
      element.interpolationDecay = defaultDecay;
      pointers.add(event.pointerId);
    };
    const up = (event: PointerEvent) => { if (pointers.delete(event.pointerId) && !pointers.size) home(); };
    const keyup = (event: KeyboardEvent) => { if (event.key.startsWith("Arrow")) home(); };
    const blur = () => { pointers.clear(); home(); };
    element.addEventListener("pointerdown", down);
    element.addEventListener("keyup", keyup);
    element.addEventListener("focusout", blur);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    window.addEventListener("blur", blur);
    fit();
    media.addEventListener("change", fit);
    element.addEventListener("load", load);
    element.addEventListener("camera-change", rotate);
    element.addEventListener("error", error);
    element.addEventListener("progress", reportProgress);
    if (element.loaded) queueMicrotask(load);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(decayTimer);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("keyup", keyup);
      element.removeEventListener("focusout", blur);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
      window.removeEventListener("blur", blur);
      media.removeEventListener("change", fit);
      element.removeEventListener("load", load);
      element.removeEventListener("camera-change", rotate);
      element.removeEventListener("error", error);
      element.removeEventListener("progress", reportProgress);
    };
  }, [ready, engine, wheel, initialAngle, onRotate, attempt]);
  function changeZoom(value: number) {
    zoomRef.current = value;
    setZoom(value);
    const element = viewer.current;
    if (!element) return;
    const radius = (window.matchMedia("(max-width: 700px)").matches ? 90 : 60) * 100 / value;
    element.cameraOrbit = `${initialAngle}deg 79deg ${radius}%`;
  }
  return <div className={`model-shell ${engine ? "model-shell--engine" : wheel ? "model-shell--wheel" : ""}`}>
    {ready && <model-viewer key={attempt} ref={viewer} src={engine ? "/models/f6-boxer-engine.glb" : wheel ? "/models/porsche-wheel.glb" : "/models/porsche-911.glb"}
      alt={engine ? "Концептуальный двигатель F6 Boxer от Scuderia Morello. Вращайте мышью или стрелками." : wheel ? "Колесо Porsche. Рассмотрите лицевую сторону и профиль шины." : "Porsche 911 Targa 4S. Вращайте мышью, пальцем или стрелками."}
      camera-controls disable-pan disable-zoom
      camera-orbit={orbit(initialAngle)} min-camera-orbit={engine ? "auto 30deg 0m" : wheel ? "-65deg 65deg 0m" : "-95deg 79deg 0m"} max-camera-orbit={engine ? "auto 100deg auto" : wheel ? "65deg 95deg auto" : "95deg 79deg auto"}
      environment-image="/lighting/studio-small-09-1k.hdr" tone-mapping="aces"
      interaction-prompt="none" touch-action="pan-y" exposure={engine ? "0.9" : wheel ? "1.1" : "1"} shadow-intensity="1.15" shadow-softness="0.85">{children}</model-viewer>}
    {!loaded && <div className="model-loading" role="status"><span>{failed ? "Не удалось загрузить модель" : `Загружаем ${engine ? "двигатель" : wheel ? "колесо" : "Porsche"} · ${progress}%`}</span>{failed && <button onClick={() => { setFailed(false); setAttempt((n) => n + 1); }}>Попробовать снова</button>}</div>}
    {loaded && !engine && !wheel && <label className="zoom-controls">
      <span>Масштаб</span>
      <input type="range" aria-label="Масштаб автомобиля" min="80" max="125" value={zoom} onChange={(event) => changeZoom(Number(event.target.value))} />
      <output>{zoom}%</output>
    </label>}

  </div>;
}
