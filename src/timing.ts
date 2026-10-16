import { slides } from "./slides";

export const totalSeconds = slides.reduce((sum, slide) => sum + slide.seconds, 0);

/** Planned elapsed time, in seconds, at which the slide at `index` starts. */
export function plannedStartSeconds(index: number): number {
  let seconds = 0;
  for (let i = 0; i < index; i += 1) {
    seconds += slides[i].seconds;
  }
  return seconds;
}

export function formatClock(totalSecondsValue: number): string {
  const safe = Math.max(0, Math.floor(totalSecondsValue));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
