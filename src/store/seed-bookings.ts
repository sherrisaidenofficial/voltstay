// Data seeded by Claude intentionally for the MVP. Replace with real records before launch.

import { buildQuote } from "@/domain/pricing";
import type { Booking, BookingStatus, Listing } from "@/domain/types";
import { repository } from "@/data/repository";
import { DEMO_GUEST } from "@/data/session";

function at(daysFromToday: number, hour: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  d.setHours(hour, 0, 0, 0);
  return d;
}

interface SeedSpec {
  id: string;
  listing: Listing;
  guestId: string;
  start: Date;
  hours: number;
  kwh: number;
  status: BookingStatus;
  vehicle: string;
  guestNote?: string;
  addons?: { amenityId: string; quantity: number }[];
}

function seed(spec: SeedSpec): Booking {
  const end = new Date(spec.start.getTime() + spec.hours * 3_600_000);
  const quote = buildQuote({ listing: spec.listing, start: spec.start, end, estimatedKwh: spec.kwh, addons: spec.addons });
  if (!quote.ok) throw new Error(`Seed booking ${spec.id} is invalid: ${JSON.stringify(quote.errors)}`);
  return {
    id: spec.id,
    listingId: spec.listing.id,
    guestId: spec.guestId,
    hostId: spec.listing.hostId,
    start: spec.start.toISOString(),
    end: end.toISOString(),
    vehicle: spec.vehicle,
    guestNote: spec.guestNote ?? "",
    status: spec.status,
    quote: quote.value,
    createdAt: at(-1, 9).toISOString(),
  };
}

const listing = (id: string): Listing => {
  const found = repository.listing(id);
  if (!found) throw new Error(`Unknown listing ${id}`);
  return found;
};

export function seedBookings(): Booking[] {
  return [
    seed({ id: "bk-seed-1", listing: listing("la-silver-lake-nacs"), guestId: DEMO_GUEST.id, start: at(2, 10), hours: 3, kwh: 30, status: "confirmed", vehicle: "Hyundai Ioniq 5", addons: [{ amenityId: "coffee", quantity: 2 }] }),
    seed({ id: "bk-seed-2", listing: listing("sf-bernal-driveway"), guestId: DEMO_GUEST.id, start: at(5, 18), hours: 4, kwh: 25, status: "pending", vehicle: "Hyundai Ioniq 5", guestNote: "Arriving from Sacramento, might be ten minutes late." }),
    seed({ id: "bk-seed-3", listing: listing("oak-rockridge-ccs"), guestId: DEMO_GUEST.id, start: at(-9, 12), hours: 1, kwh: 40, status: "completed", vehicle: "Hyundai Ioniq 5", addons: [{ amenityId: "pastry", quantity: 1 }] }),
    seed({ id: "bk-seed-4", listing: listing("sd-ocean-beach-j1772"), guestId: "u-chen", start: at(3, 17), hours: 5, kwh: 30, status: "pending", vehicle: "Nissan Leaf", guestNote: "Two of us for dinner, no allergies.", addons: [{ amenityId: "meal", quantity: 2 }] }),
    seed({ id: "bk-seed-5", listing: listing("sea-ballard-wall"), guestId: "u-dana", start: at(1, 9), hours: 4, kwh: 40, status: "confirmed", vehicle: "Tesla Model 3" }),
    seed({ id: "bk-seed-6", listing: listing("sea-ballard-wall"), guestId: "u-omar", start: at(-3, 14), hours: 2, kwh: 20, status: "confirmed", vehicle: "Rivian R1S" }),
  ];
}

export const GUEST_NAMES: Record<string, string> = {
  [DEMO_GUEST.id]: DEMO_GUEST.name,
  "u-chen": "Chen Wu",
  "u-dana": "Dana Park",
  "u-omar": "Omar Said",
};
