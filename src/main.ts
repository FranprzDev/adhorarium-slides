import "./styles.css";
import { BackgroundMode, startBackground } from "./background";
import type { BackgroundController } from "./background";
import { slides } from "./slides";
import type { Slide } from "./slides";
import { renderScript } from "./script";
import { formatClock, plannedStartSeconds, totalSeconds } from "./timing";

enum ViewMode {
  Deck = "deck",
  Print = "print",
  Presenter = "presenter",
  Script = "script",
}

enum SyncMessageKind {
  Goto = "goto",
  Hello = "hello",
}

interface SyncMessage {
  readonly kind: SyncMessageKind;
  readonly index: number;
}

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const CHANNEL_NAME = "adhorarium-deck";
const STORAGE_KEY = "adhorarium-deck-index";

const params = new URLSearchParams(window.location.search);
const viewMode = resolveViewMode(params);
const isStatic = params.has("static") || viewMode === ViewMode.Print;
const forceFallback = params.has("nogpu") || viewMode !== ViewMode.Deck;

document.documentElement.dataset.view = viewMode;
if (isStatic) {
  document.documentElement.dataset.static = "true";
}

const PAGE_RULES: Partial<Record<ViewMode, string>> = {
  [ViewMode.Print]: "@page { size: 1920px 1080px; margin: 0; }",
  [ViewMode.Script]: "@page { size: A4; margin: 16mm 0 14mm; }",
};
const pageRule = PAGE_RULES[viewMode];
if (pageRule) {
  const style = document.createElement("style");
  style.textContent = pageRule;
  document.head.appendChild(style);
}

function resolveViewMode(search: URLSearchParams): ViewMode {
  if (search.has("print")) return ViewMode.Print;
  if (search.has("presenter")) return ViewMode.Presenter;
  if (search.has("script")) return ViewMode.Script;
  return ViewMode.Deck;
}

function slideElement(slide: Slide, index: number): HTMLElement {
  const section = document.createElement("section");
  section.className = `slide slide-${slide.mode === BackgroundMode.Dark ? "dark" : "light"}`;
  section.dataset.id = slide.id;
  section.dataset.index = String(index);
  section.setAttribute("aria-label", `${index + 1}. ${slide.title}`);
  section.innerHTML = slide.html;
  const head = section.querySelector(".slide-head");
  if (head) {
    // Everything after the title goes into a body that centers itself in the remaining height.
    const body = document.createElement("div");
    body.className = "slide-body";
    while (head.nextSibling) {
      body.appendChild(head.nextSibling);
    }
    section.appendChild(body);
  }
  section.querySelectorAll<HTMLElement>(".reveal").forEach((element, order) => {
    element.style.setProperty("--i", String(order));
  });
  if (slide.mode === BackgroundMode.Light) {
    const footer = document.createElement("footer");
    footer.className = "slide-foot";
    footer.innerHTML = `<span class="foot-brand"><img src="brand/adhorarium-mark.svg" alt="" />AdHorarium · Seminario Integrador · UTN FRT</span><span class="foot-count">${index + 1} / ${slides.length}</span>`;
    section.appendChild(footer);
  }
  return section;
}

function clampIndex(index: number): number {
  return Math.max(0, Math.min(slides.length - 1, index));
}

function indexFromHash(): number {
  const match = /^#\/?(\d+)$/.exec(window.location.hash);
  return match ? clampIndex(Number(match[1]) - 1) : 0;
}

function createChannel(onMessage: (message: SyncMessage) => void): (message: SyncMessage) => void {
  let channel: BroadcastChannel | undefined;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event: MessageEvent<SyncMessage>) => onMessage(event.data);
  } catch {
    channel = undefined;
  }
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      onMessage({ kind: SyncMessageKind.Goto, index: Number(event.newValue) });
    }
  });
  return (message: SyncMessage) => {
    channel?.postMessage(message);
    try {
      localStorage.setItem(STORAGE_KEY, String(message.index));
    } catch {
      // Storage can be unavailable on file:// in some browsers; BroadcastChannel still syncs.
    }
  };
}

function fitStage(stage: HTMLElement, host: HTMLElement): void {
  const scale = Math.min(host.clientWidth / STAGE_WIDTH, host.clientHeight / STAGE_HEIGHT);
  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

/* ---------------------------------- Deck ---------------------------------- */

async function runDeck(): Promise<void> {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="bg-fallback" aria-hidden="true"><div class="bg-dark"></div><div class="bg-light"></div></div>
    <canvas class="bg-canvas" aria-hidden="true"></canvas>
    <main class="viewport">
      <div class="stage" role="region" aria-roledescription="presentación"></div>
    </main>
    <div class="progress" aria-hidden="true"><span></span></div>
    <nav class="controls" aria-label="Navegación">
      <button type="button" data-action="prev" aria-label="Anterior">‹</button>
      <span class="counter" aria-live="polite"></span>
      <button type="button" data-action="next" aria-label="Siguiente">›</button>
    </nav>
    <aside class="notes-overlay" hidden>
      <div class="notes-head"><strong class="notes-title"></strong><span class="notes-timer"></span></div>
      <div class="notes-body"></div>
    </aside>
    <div class="help" hidden>
      <h3>Atajos</h3>
      <dl>
        <dt>→ · Espacio · Av Pág</dt><dd>Siguiente</dd>
        <dt>← · Re Pág</dt><dd>Anterior</dd>
        <dt>Inicio · Fin</dt><dd>Primera · última</dd>
        <dt>F</dt><dd>Pantalla completa</dd>
        <dt>S</dt><dd>Vista del presentador (nueva ventana)</dd>
        <dt>N</dt><dd>Notas y cronómetro en esta ventana</dd>
        <dt>T</dt><dd>Reiniciar cronómetro</dd>
        <dt>?</dt><dd>Mostrar u ocultar esta ayuda</dd>
      </dl>
    </div>`;

  const stage = app.querySelector<HTMLElement>(".stage")!;
  const viewport = app.querySelector<HTMLElement>(".viewport")!;
  const counter = app.querySelector<HTMLElement>(".counter")!;
  const progress = app.querySelector<HTMLElement>(".progress span")!;
  const notesOverlay = app.querySelector<HTMLElement>(".notes-overlay")!;
  const help = app.querySelector<HTMLElement>(".help")!;
  const canvas = app.querySelector<HTMLCanvasElement>(".bg-canvas")!;

  const sections = slides.map((slide, index) => slideElement(slide, index));
  stage.append(...sections);

  let current = indexFromHash();
  let timerStart = 0;
  let background: BackgroundController | undefined;

  const broadcast = createChannel((message) => {
    if (message.kind === SyncMessageKind.Goto) {
      go(message.index, false);
    }
    if (message.kind === SyncMessageKind.Hello) {
      broadcast({ kind: SyncMessageKind.Goto, index: current });
    }
  });

  function render(): void {
    sections.forEach((section, index) => {
      section.classList.toggle("is-active", index === current);
      section.classList.toggle("is-past", index < current);
      section.setAttribute("aria-hidden", String(index !== current));
    });
    counter.textContent = `${current + 1} / ${slides.length}`;
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    const slide = slides[current];
    background?.setMode(slide.mode);
    document.title = `${slide.title} · AdHorarium`;
    notesOverlay.querySelector(".notes-title")!.textContent = `${current + 1}. ${slide.title} · ${formatClock(slide.seconds)}`;
    notesOverlay.querySelector(".notes-body")!.innerHTML = slide.notes.map((note) => `<p>${note}</p>`).join("");
    updateTimer();
  }

  function go(index: number, notify = true): void {
    const next = clampIndex(index);
    if (next === current && notify) return;
    if (timerStart === 0 && next > 0) timerStart = performance.now();
    current = next;
    history.replaceState(null, "", `#${current + 1}`);
    render();
    if (notify) broadcast({ kind: SyncMessageKind.Goto, index: current });
  }

  function updateTimer(): void {
    const elapsed = timerStart === 0 ? 0 : (performance.now() - timerStart) / 1000;
    const planned = plannedStartSeconds(current);
    const timer = notesOverlay.querySelector<HTMLElement>(".notes-timer")!;
    timer.textContent = `${formatClock(elapsed)} · plan ${formatClock(planned)} de ${formatClock(totalSeconds)}`;
    timer.classList.toggle("is-late", elapsed > planned + slides[current].seconds);
  }

  function toggleFullscreen(): void {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  }

  function openPresenter(): void {
    const url = new URL(window.location.href);
    url.search = "?presenter";
    url.hash = `#${current + 1}`;
    window.open(url.toString(), "adhorarium-presenter", "width=1280,height=800");
  }

  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
      case "Enter":
        event.preventDefault();
        go(current + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
        event.preventDefault();
        go(current - 1);
        break;
      case "Home":
        go(0);
        break;
      case "End":
        go(slides.length - 1);
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      case "s":
      case "S":
        openPresenter();
        break;
      case "n":
      case "N":
        notesOverlay.hidden = !notesOverlay.hidden;
        break;
      case "t":
      case "T":
        timerStart = performance.now();
        updateTimer();
        break;
      case "?":
      case "h":
      case "H":
        help.hidden = !help.hidden;
        break;
      case "Escape":
        help.hidden = true;
        notesOverlay.hidden = true;
        break;
    }
  });

  app.querySelector('[data-action="prev"]')!.addEventListener("click", () => go(current - 1));
  app.querySelector('[data-action="next"]')!.addEventListener("click", () => go(current + 1));

  let touchX = 0;
  viewport.addEventListener("touchstart", (event) => {
    touchX = event.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 50) go(current + (delta < 0 ? 1 : -1));
  });

  window.addEventListener("hashchange", () => go(indexFromHash()));
  window.addEventListener("resize", () => fitStage(stage, viewport));
  fitStage(stage, viewport);
  window.setInterval(updateTimer, 1000);

  render();
  background = await startBackground(canvas, slides[current].mode, forceFallback);
  background.setMode(slides[current].mode);
}

/* -------------------------------- Presenter ------------------------------- */

function runPresenter(): void {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="presenter">
      <section class="pv-current"><p class="pv-label">Actual</p><div class="pv-frame"><div class="stage pv-stage"></div></div></section>
      <section class="pv-next"><p class="pv-label">Siguiente</p><div class="pv-frame"><div class="stage pv-stage"></div></div></section>
      <section class="pv-notes">
        <div class="pv-meta"><span class="pv-title"></span><span class="pv-clock"></span></div>
        <div class="pv-timer"><b class="pv-elapsed">00:00</b><span class="pv-plan"></span><button type="button" class="pv-reset">Reiniciar (T)</button></div>
        <div class="pv-body"></div>
        <p class="pv-hint">← → para avanzar · se sincroniza con la ventana de la presentación</p>
      </section>
    </div>`;

  const frames = Array.from(app.querySelectorAll<HTMLElement>(".pv-stage"));
  const hosts = Array.from(app.querySelectorAll<HTMLElement>(".pv-frame"));
  let current = indexFromHash();
  let timerStart = performance.now();

  const broadcast = createChannel((message) => {
    if (message.kind === SyncMessageKind.Goto) {
      current = clampIndex(message.index);
      render();
    }
  });

  function renderInto(frame: HTMLElement, index: number): void {
    frame.innerHTML = "";
    if (index >= slides.length) {
      frame.innerHTML = `<div class="pv-end">Fin de la presentación</div>`;
      return;
    }
    const section = slideElement(slides[index], index);
    section.classList.add("is-active");
    frame.appendChild(section);
  }

  function render(): void {
    renderInto(frames[0], current);
    renderInto(frames[1], current + 1);
    const slide = slides[current];
    app.querySelector(".pv-title")!.textContent = `${current + 1} / ${slides.length} · ${slide.title} · ${formatClock(slide.seconds)}`;
    app.querySelector(".pv-body")!.innerHTML = slide.notes.map((note) => `<p>${note}</p>`).join("");
    tick();
  }

  function tick(): void {
    const elapsed = (performance.now() - timerStart) / 1000;
    const planned = plannedStartSeconds(current);
    const elapsedEl = app.querySelector<HTMLElement>(".pv-elapsed")!;
    elapsedEl.textContent = formatClock(elapsed);
    elapsedEl.classList.toggle("is-late", elapsed > planned + slides[current].seconds);
    app.querySelector(".pv-plan")!.textContent = `esta diapositiva arranca en ${formatClock(planned)} · total ${formatClock(totalSeconds)}`;
    app.querySelector(".pv-clock")!.textContent = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  }

  function go(index: number): void {
    current = clampIndex(index);
    render();
    broadcast({ kind: SyncMessageKind.Goto, index: current });
  }

  window.addEventListener("keydown", (event) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(event.key)) {
      event.preventDefault();
      go(current + 1);
    } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      go(current - 1);
    } else if (event.key === "t" || event.key === "T") {
      timerStart = performance.now();
      tick();
    }
  });
  app.querySelector(".pv-reset")!.addEventListener("click", () => {
    timerStart = performance.now();
    tick();
  });

  const refit = () => frames.forEach((frame, index) => fitStage(frame, hosts[index]));
  window.addEventListener("resize", refit);
  refit();
  render();
  window.setInterval(tick, 1000);
  broadcast({ kind: SyncMessageKind.Hello, index: current });
}

/* ---------------------------------- Print --------------------------------- */

function runPrint(): void {
  const app = document.getElementById("app")!;
  app.className = "print-root";
  slides.forEach((slide, index) => {
    const page = document.createElement("div");
    page.className = `print-page print-${slide.mode === BackgroundMode.Dark ? "dark" : "light"}`;
    const section = slideElement(slide, index);
    section.classList.add("is-active");
    page.appendChild(section);
    app.appendChild(page);
  });
}

switch (viewMode) {
  case ViewMode.Print:
    runPrint();
    break;
  case ViewMode.Presenter:
    runPresenter();
    break;
  case ViewMode.Script:
    renderScript(document.getElementById("app")!);
    break;
  case ViewMode.Deck:
    void runDeck();
    break;
}
