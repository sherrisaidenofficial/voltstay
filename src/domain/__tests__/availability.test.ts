import { describe, expect, it } from "vitest";

import { availableStartTimes, fitsOpeningHours, overlaps, weekdayOf } from "@/domain/availability";

import { at, listing } from "./fixtures";

describe("availableStartTimes", () => {
  const now = at("2030-01-07", "06:00");

  it("offers half-hour starts that fit before closing", () => {
    const slots = availableStartTimes(listing, "2030-01-07", 120, [], now);
    expect(slots[0]).toBe("08:00");
    expect(slots.at(-1)).toBe("18:00");
    expect(slots).toContain("12:30");
  });

  it("skips slots already booked", () => {
    const booked = [{ start: at("2030-01-07", "10:00"), end: at("2030-01-07", "12:00") }];
    const slots = availableStartTimes(listing, "2030-01-07", 60, booked, now);
    expect(slots).not.toContain("10:00");
    expect(slots).not.toContain("11:30");
    expect(slots).toContain("09:00");
    expect(slots).toContain("12:00");
  });

  it("skips slots in the past", () => {
    const slots = availableStartTimes(listing, "2030-01-07", 60, [], at("2030-01-07", "15:10"));
    expect(slots[0]).toBe("15:30");
  });

  it("returns nothing on closed days", () => {
    const weekdaysOnly = { ...listing, availability: listing.availability.filter((w) => w.weekday < 5) };
    expect(availableStartTimes(weekdaysOnly, "2030-01-12", 60, [], now)).toEqual([]);
  });
});

describe("fitsOpeningHours", () => {
  it("accepts a slot inside the window and rejects one past closing", () => {
    expect(fitsOpeningHours(listing, { start: at("2030-01-07", "18:00"), end: at("2030-01-07", "20:00") })).toBe(true);
    expect(fitsOpeningHours(listing, { start: at("2030-01-07", "19:00"), end: at("2030-01-07", "21:00") })).toBe(false);
  });
});

describe("helpers", () => {
  it("treats Monday as weekday 0", () => {
    expect(weekdayOf(at("2030-01-07", "00:00"))).toBe(0);
    expect(weekdayOf(at("2030-01-12", "00:00"))).toBe(5);
  });

  it("detects overlapping ranges but not touching ones", () => {
    const a = { start: at("2030-01-07", "10:00"), end: at("2030-01-07", "12:00") };
    expect(overlaps(a, { start: at("2030-01-07", "11:00"), end: at("2030-01-07", "13:00") })).toBe(true);
    expect(overlaps(a, { start: at("2030-01-07", "12:00"), end: at("2030-01-07", "13:00") })).toBe(false);
  });
});
