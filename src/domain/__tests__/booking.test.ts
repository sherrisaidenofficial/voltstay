import { describe, expect, it } from "vitest";

import { actionsFor, applyAction, createBooking } from "@/domain/booking";
import type { Booking } from "@/domain/types";

import { at, listing } from "./fixtures";

const guest = { id: "u-1", name: "Guest" };
const now = at("2030-01-07", "06:00");
const context = () => ({ existing: [] as Booking[], now, id: () => "bk-1" });

function book(overrides: Partial<Parameters<typeof createBooking>[0]> = {}, existing: Booking[] = []) {
  return createBooking(
    { listing, guest, start: at("2030-01-07", "10:00"), end: at("2030-01-07", "12:00"), estimatedKwh: 10, ...overrides },
    { ...context(), existing },
  );
}

describe("createBooking", () => {
  it("creates a pending booking with a price snapshot", () => {
    const result = book();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("pending");
    expect(result.value.quote.total).toBe(3);
  });

  it("confirms immediately for instant-book listings", () => {
    const result = book({ listing: { ...listing, instantBook: true } });
    expect(result.ok && result.value.status).toBe("confirmed");
  });

  it("refuses slots that overlap a held booking", () => {
    const first = book();
    if (!first.ok) throw new Error("fixture");
    const second = book({ start: at("2030-01-07", "11:00"), end: at("2030-01-07", "13:00") }, [first.value]);
    expect(second).toMatchObject({ ok: false, errors: { start: expect.stringContaining("Another driver") } });
  });

  it("ignores cancelled bookings when checking overlap", () => {
    const first = book();
    if (!first.ok) throw new Error("fixture");
    const second = book({}, [{ ...first.value, status: "cancelled" }]);
    expect(second.ok).toBe(true);
  });

  it("refuses slots outside opening hours, in the past, or on the host's own charger", () => {
    expect(book({ start: at("2030-01-07", "19:00"), end: at("2030-01-07", "21:00") }).ok).toBe(false);
    expect(book({ start: at("2029-12-31", "10:00"), end: at("2029-12-31", "12:00") }).ok).toBe(false);
    expect(book({ guest: { id: listing.hostId, name: "Host" } }).ok).toBe(false);
  });
});

describe("lifecycle", () => {
  const pending = book();
  if (!pending.ok) throw new Error("fixture");
  const booking = pending.value;

  it("lets the host accept or decline and the guest cancel", () => {
    expect(actionsFor(booking, "host", now)).toEqual(["confirm", "decline", "cancel"]);
    expect(actionsFor(booking, "guest", now)).toEqual(["cancel"]);
  });

  it("moves through confirm then complete", () => {
    const confirmed = applyAction(booking, "confirm", "host", now);
    expect(confirmed.ok && confirmed.value.status).toBe("confirmed");
    if (!confirmed.ok) return;
    expect(actionsFor(confirmed.value, "host", now)).toEqual(["cancel"]);
    const later = at("2030-01-07", "13:00");
    expect(actionsFor(confirmed.value, "host", later)).toEqual(["complete"]);
    const done = applyAction(confirmed.value, "complete", "host", later);
    expect(done.ok && done.value.status).toBe("completed");
  });

  it("blocks guests from confirming", () => {
    expect(applyAction(booking, "confirm", "guest", now).ok).toBe(false);
  });
});
