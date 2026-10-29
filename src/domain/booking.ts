import { fitsOpeningHours, overlaps, type TimeRange } from "./availability";
import { buildQuote, type AddonRequest } from "./pricing";
import { fail, ok, type Result } from "./result";
import type { Booking, BookingStatus, Listing, Person } from "./types";

export type BookingAction = "confirm" | "decline" | "cancel" | "complete";
export type Role = "guest" | "host";

export const BLOCKING_STATUSES: readonly BookingStatus[] = ["pending", "confirmed"];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Awaiting host",
  confirmed: "Confirmed",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
};

const TRANSITIONS: Record<BookingAction, { from: BookingStatus[]; to: BookingStatus; by: Role[] }> = {
  confirm: { from: ["pending"], to: "confirmed", by: ["host"] },
  decline: { from: ["pending"], to: "declined", by: ["host"] },
  cancel: { from: ["pending", "confirmed"], to: "cancelled", by: ["guest", "host"] },
  complete: { from: ["confirmed"], to: "completed", by: ["host"] },
};

export function actionsFor(booking: Booking, role: Role, now: Date = new Date()): BookingAction[] {
  return (Object.keys(TRANSITIONS) as BookingAction[]).filter((action) => {
    const rule = TRANSITIONS[action];
    if (!rule.from.includes(booking.status) || !rule.by.includes(role)) return false;
    if (action === "complete") return new Date(booking.end) <= now;
    if (action === "cancel") return new Date(booking.start) > now;
    return true;
  });
}

export function applyAction(booking: Booking, action: BookingAction, role: Role, now: Date = new Date()): Result<Booking> {
  if (!actionsFor(booking, role, now).includes(action)) {
    return fail({ status: `This booking can no longer be ${action === "confirm" ? "accepted" : action + "d"}.` });
  }
  return ok({ ...booking, status: TRANSITIONS[action].to });
}

export const holdsSlot = (booking: Booking): boolean => BLOCKING_STATUSES.includes(booking.status);

export const toRange = (booking: Booking): TimeRange => ({ start: new Date(booking.start), end: new Date(booking.end) });

export interface BookingRequest {
  listing: Listing;
  guest: Person;
  start: Date;
  end: Date;
  estimatedKwh: number;
  addons?: AddonRequest[];
  vehicle?: string;
  guestNote?: string;
}

export interface BookingContext {
  existing: Booking[];
  now?: Date;
  id: () => string;
}

export function createBooking(request: BookingRequest, context: BookingContext): Result<Booking> {
  const now = context.now ?? new Date();
  const { listing, start, end } = request;

  if (listing.hostId === request.guest.id) return fail({ listing: "You cannot book your own charger." });
  if (start <= now) return fail({ start: "Pick a start time in the future." });
  if (!fitsOpeningHours(listing, { start, end })) return fail({ start: "That slot falls outside the host's hours." });

  const taken = context.existing.some((b) => b.listingId === listing.id && holdsSlot(b) && overlaps(toRange(b), { start, end }));
  if (taken) return fail({ start: "Another driver has that slot. Pick a different time." });

  const quote = buildQuote({ listing, start, end, estimatedKwh: request.estimatedKwh, addons: request.addons });
  if (!quote.ok) return quote;

  return ok({
    id: context.id(),
    listingId: listing.id,
    guestId: request.guest.id,
    hostId: listing.hostId,
    start: start.toISOString(),
    end: end.toISOString(),
    vehicle: request.vehicle?.trim() ?? "",
    guestNote: request.guestNote?.trim() ?? "",
    status: listing.instantBook ? "confirmed" : "pending",
    quote: quote.value,
    createdAt: now.toISOString(),
  });
}
