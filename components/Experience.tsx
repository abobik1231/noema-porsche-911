"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import CarViewer from "./CarViewer";
type Feature = "engine" | "interior" | "paint" | "wheels";
const features: { id: Feature; title: string; text: string; x: string; y: string; icon: string }[] = [
  { id: "engine", title: "Двигатель", text: "Концепт F6 Boxer в объёме", x: "77%", y: "49%", icon: "engine" },
  { id: "interior", title: "Интерьер", text: "Внимание к каждой детали", x: "49%", y: "40%", icon: "seat" },
  { id: "paint", title: "Цвет кузова", text: "Найдите свой оттенок", x: "52%", y: "59%", icon: "paint" },
  { id: "wheels", title: "Колёса", text: "Геометрия и характер", x: "28%", y: "64%", icon: "wheel" },
];
const hotspotPositions: Record<Feature, string> = { engine: "74m 2m -25m", interior: "73m 6m 8m", paint: "81m -2m 0m", wheels: "80m -7m 33m" };
const paints = [
  { name: "Жемчужный", color: "#e8ebee" }, { name: "Морской синий", color: "#325e83" },
  { name: "Карминовый", color: "#971c29" }, { name: "Графитовый", color: "#323b43" },
];
const interiorPhotos = [
  { src: "/images/911-interior.jpg", title: "Архитектура салона", alt: "Красно-бежевая отделка салона Porsche 911 Targa Heritage Design Edition" },
  { src: "/images/911-instruments.jpg", title: "Приборы", alt: "Центральный тахометр и приборы Porsche 911 Targa" },
  { src: "/images/911-seat.jpg", title: "Материалы", alt: "Крупный план отделки сиденья Porsche 911 Targa" },
];
const stories = {
  engine: { label: "Scuderia Morello", title: "Шесть цилиндров.\nОппозитный характер.", text: "F6 Boxer: авторский взгляд на оппозитный двигатель. Поверните модель, чтобы рассмотреть компоновку, впуск и выпуск с разных сторон.", items: [["Оппозитная компоновка", "Два ряда цилиндров расположены друг напротив друга. Такая схема позволяет сделать двигатель низким и широким."], ["Свободный обзор", "Модель можно вращать по кругу и наклонять. Отпустите её, чтобы вернуться к исходному ракурсу. Все надписи и эмблемы MORELLO сохранены в исходном виде."], ["Об этой модели", "F6 Boxer разработан Scuderia Morello для проекта Spada F6 с вдохновением от Porsche и Subaru. Это самостоятельная художественная работа."]] },
  interior: { label: "Внутри Targa", title: "Место водителя.\nПродумано до касания.", text: "Низкая посадка, центральный тахометр и открытое небо. Рассмотрите салон 911 Targa 4S в исполнении Heritage Design Edition.", items: [["Архитектура", "Горизонтальная панель и центральный тахометр сохраняют узнаваемую логику классического 911."], ["Приборы", "Аналоговый тахометр находится в центре внимания. По обе стороны расположены цифровые дисплеи."], ["Материалы", "Двухцветная кожа и вельвет отсылают к ранним спортивным Porsche. Фотографии показывают специальное исполнение Heritage."]] },
  wheels: { label: "Porsche Wheel", title: "Форма диска.\nФактура резины.", text: "Рассмотрите колесо в объёме: от центрального герба до рисунка протектора. Поверните его, чтобы увидеть глубину спиц и профиль шины.", items: [["Лицевая сторона", "Обзор ограничен передней частью и боковыми ракурсами. Обратная сторона колеса остаётся за пределами вращения. После отпускания колесо плавно возвращается в исходное положение."], ["Спицы и обод", "Студийный свет подчёркивает рельеф диска, кромки спиц и углубления вокруг ступицы."], ["Об этой модели", "Самостоятельная 3D-модель Porsche Wheel. Геометрия и исполнение могут отличаться от колёс на автомобиле."]] },
};
function FeatureIcon({ name }: { name: string }) {
  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">{name === "wheel" ? <><circle cx="14" cy="14" r="10"/><circle cx="14" cy="14" r="3"/><path d="m14 4 0 7m0 6v7M4 14h7m6 0h7M7 7l5 5m4 4 5 5M7 21l5-5m4-4 5-5"/></> : name === "engine" ? <><path d="M8 8h12v13H8l-4-4V11h4Zm3-4h7m-3 0v4M20 12h4v8h-4M4 13H2v5h2"/><path d="m13 11-2 5h5l-2 4"/></> : name === "seat" ? <><path d="M8 4h5v9l8 4v6H7L4 12V7h4Zm5 9-5 2m-1 8v2m14-2v2"/></> : <><path d="M14 3S5 12 5 17a9 9 0 0 0 18 0c0-5-9-14-9-14Z"/><path d="M9 17a5 5 0 0 0 5 5"/></>}</svg>;
}
export default function Experience() {
  const [mode, setMode] = useState<Feature | null>(null);
  const [paint, setPaint] = useState(0);

  const [note, setNote] = useState(0);
  const back = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const isDetail = mode === "engine" || mode === "interior" || mode === "wheels";
  const story = isDetail ? stories[mode] : null;
  const photo = interiorPhotos[note];

  const close = useCallback(() => { setMode(null); requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true })); }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  useEffect(() => { if (isDetail) back.current?.focus({ preventScroll: true }); }, [isDetail, mode]);
  function select(id: Feature, button: HTMLButtonElement) {
    returnFocus.current = button;
    setNote(0);
    setMode((current) => current === id ? null : id);
    if (id !== "paint") document.getElementById("explore")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return <main className="page-wrap" id="top">
    <header className="site-header"><a className="brand" href="/" aria-label="NOEMA, к автомобилю"><span className="brand-symbol" aria-hidden="true">n</span>NOEMA</a></header>
    <section className="intro" aria-labelledby="title"><div><h1 id="title">Porsche 911 Targa 4S</h1></div><p>Поверните, приблизьте, рассмотрите.</p></section>
    <section className={`scene-frame ${isDetail ? "scene-frame--detail" : ""}`} id="explore" aria-label="Интерактивный обзор Porsche">
      <div className="car-stage" hidden={isDetail}>
        <div className="scene-heading"><span className="live-dot" /> Обзор в 3D<span className="scene-model">911 Targa 4S <span>2021</span></span></div>
        <CarViewer color={paints[paint].color}>
          {features.map((f) => <button key={f.id} slot={`hotspot-${f.id}`} data-position={hotspotPositions[f.id]} data-normal="1 0 0" data-visibility-attribute="visible" className={`model-hotspot ${mode === f.id ? "model-hotspot--active" : ""}`} onClick={(event) => select(f.id, event.currentTarget)} aria-label={f.title} aria-expanded={mode === f.id}><span>+</span><span className="hotspot-label">{f.title}</span></button>)}
        </CarViewer>
        <div className="scene-bottom"><span>↔ <span>Поверните и отпустите</span></span><span>{paints[paint].name}</span></div>
      </div>
      {story && <div className={`system-scene ${mode === "engine" ? "system-scene--engine" : ""}`}>
        <div className={`system-visual ${mode === "engine" || mode === "wheels" ? "engine-visual" : "photo-visual"}`}>
          {mode === "engine" ? <><span className="model-badge">F6 BOXER <span>Концепт</span></span><CarViewer key="engine" engine /></> : mode === "wheels" ? <><span className="model-badge">PORSCHE WHEEL <span>Обзор в 3D</span></span><CarViewer key="wheel" wheel /></> : <><Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 100vw, 65vw" className="detail-photo" loading="eager" /><p className="image-caption">{photo.title}<span>© Porsche AG</span></p></>}
        </div>
        <div className="system-content"><button ref={back} className="back-button" onClick={close}>← К автомобилю</button><p className="eyebrow">{story.label}</p><h2>{story.title}</h2><p>{story.text}</p><div className="system-notes">{story.items.map(([title, text], index) => <button key={title} className="system-note" onClick={() => setNote(index)} aria-expanded={note === index}><span className="note-title">{title}<span aria-hidden="true">{note === index ? "−" : "+"}</span></span>{note === index && <span className="note-text">{text}</span>}</button>)}</div>{mode === "interior" && <span className="edition-note">На фото: 911 Targa 4S Heritage Design Edition</span>}</div>
      </div>}
    </section>
    {mode === "paint" && <section className="config-panel" aria-label="Выбор цвета кузова"><div><p className="eyebrow">Цвет кузова</p><h2>{paints[paint].name}</h2></div><div className="paint-options">{paints.map((item, index) => <button key={item.name} className="paint-option" onClick={() => setPaint(index)} aria-pressed={paint === index}><span className="swatch" style={{ background: item.color }} /><span>{item.name}</span></button>)}</div><button className="close-button" onClick={close} aria-label="Закрыть выбор цвета">×</button></section>}
    <nav className="feature-rail" aria-label="Детали автомобиля">{features.map((f) => <button key={f.id} className={`feature-item ${mode === f.id ? "feature-item--active" : ""}`} onClick={(event) => select(f.id, event.currentTarget)} aria-pressed={mode === f.id}><span className="feature-icon"><FeatureIcon name={f.icon} /></span><span><strong>{f.title}</strong><small>{f.text}</small></span><span className="feature-arrow" aria-hidden="true">↗</span></button>)}</nav>
    <footer className="site-footer"><span>NOEMA © 2026 <span className="footer-separator">·</span> Независимый дизайн-проект</span><details><summary>Авторы и материалы</summary><p>Porsche 911 Targa 4S: <a href="https://sketchfab.com/3d-models/2021-porsche-911-targa-4s-616ebc4356c74a3b8554c396eb3bd34c" target="_blank" rel="noreferrer">DisneyCars</a>. F6 Boxer Engine: <a href="https://sketchfab.com/3d-models/f6-boxer-engine-5700259eeb494b8f8a0b8f63486c59cc" target="_blank" rel="noreferrer">Scuderia Morello</a>. Колесо: <a href="https://sketchfab.com/3d-models/porsche-wheel-76b1e1e6466843cebf1810168a19659c" target="_blank" rel="noreferrer">Porsche Wheel</a>.</p></details></footer>
  </main>;
}
