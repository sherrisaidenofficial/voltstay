import type { AvailabilityWindow, Listing } from "./types";

export const SLOT_STEP_MINUTES = 30;

export interface TimeRange {
  start: Date;
  end: Date;
}

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const toHHMM = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const weekdayOf = (date: Date): number => (date.getDay() + 6) % 7;

export function parseDateInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function atTime(date: string, hhmm: string): Date {
  const base = parseDateInput(date);
  base.setMinutes(toMinutes(hhmm));
  return base;
}

export const addMinutes = (date: Date, minutes: number): Date => new Date(date.getTime() + minutes * 60_000);

export const overlaps = (a: TimeRange, b: TimeRange): boolean => a.start < b.end && a.end > b.start;

export function windowsOn(listing: Listing, date: string): AvailabilityWindow[] {
  const weekday = weekdayOf(parseDateInput(date));
  return listing.availability.filter((w) => w.weekday === weekday);
}

export function availableStartTimes(
  listing: Listing,
  date: string,
  durationMinutes: number,
  booked: TimeRange[],
  now: Date = new Date(),
): string[] {
  const slots: string[] = [];
  for (const window of windowsOn(listing, date)) {
    const open = toMinutes(window.start);
    const close = toMinutes(window.end);
    for (let t = Math.ceil(open / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES; t + durationMinutes <= close; t += SLOT_STEP_MINUTES) {
      const start = atTime(date, toHHMM(t));
      const end = addMinutes(start, durationMinutes);
      if (start <= now) continue;
      if (booked.some((b) => overlaps({ start, end }, b))) continue;
      slots.push(toHHMM(t));
    }
  }
  return slots;
}

export function fitsOpeningHours(listing: Listing, range: TimeRange): boolean {
  const date = `${range.start.getFullYear()}-${String(range.start.getMonth() + 1).padStart(2, "0")}-${String(range.start.getDate()).padStart(2, "0")}`;
  const startMin = range.start.getHours() * 60 + range.start.getMinutes();
  const durationMin = (range.end.getTime() - range.start.getTime()) / 60_000;
  return windowsOn(listing, date).some((w) => startMin >= toMinutes(w.start) && startMin + durationMin <= toMinutes(w.end));
}
