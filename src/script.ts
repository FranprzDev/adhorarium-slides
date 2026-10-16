import { slides } from "./slides";
import { formatClock, plannedStartSeconds, totalSeconds } from "./timing";

/** Printable speaker script: every slide with its minute marks and notes (A4, used for the PDF). */
export function renderScript(root: HTMLElement): void {
  const rows = slides
    .map((slide, index) => {
      const start = plannedStartSeconds(index);
      const end = start + slide.seconds;
      return `
        <article class="script-item">
          <header>
            <span class="script-num">${String(index + 1).padStart(2, "0")}</span>
            <h2>${slide.title}</h2>
            <span class="script-time">${formatClock(start)} – ${formatClock(end)} <em>(${formatClock(slide.seconds)})</em></span>
          </header>
          ${slide.notes.map((note) => `<p>${note}</p>`).join("")}
        </article>`;
    })
    .join("");

  const guide = slides
    .map((slide, index) => `<tr><td>${index + 1}</td><td>${slide.title}</td><td>${formatClock(plannedStartSeconds(index))}</td><td>${formatClock(slide.seconds)}</td></tr>`)
    .join("");

  root.className = "script-root";
  root.innerHTML = `
    <header class="script-cover">
      <p class="script-inst">UTN · Facultad Regional Tucumán · Seminario Integrador · 2026</p>
      <h1>AdHorarium · Guion de la presentación</h1>
      <p>Francisco Miguel Perez · Legajo 56355 · Duración total planificada: <strong>${formatClock(totalSeconds)}</strong> (${slides.length} diapositivas)</p>
      <table class="script-guide">
        <thead><tr><th>#</th><th>Diapositiva</th><th>Empieza</th><th>Dura</th></tr></thead>
        <tbody>${guide}</tbody>
      </table>
      <p class="script-keys">Atajos: → / Espacio siguiente · ← anterior · F pantalla completa · S vista del presentador · N notas en pantalla · T reinicia el cronómetro.</p>
    </header>
    ${rows}`;
}
