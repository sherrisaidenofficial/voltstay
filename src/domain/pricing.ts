import { fail, ok, type Result } from "./result";
import { CONNECTORS, type AddonLine, type ConnectorType, type Listing, type Quote } from "./types";

export interface PriceBand {
  label: string;
  min: number;
  max: number;
  publicReference: string;
}

export const PRICE_BANDS: Record<"ac" | "dc", PriceBand> = {
  ac: { label: "Level 2 AC", min: 0.2, max: 0.45, publicReference: "$0.30 to $0.50 at public Level 2 stations" },
  dc: { label: "DC fast", min: 0.35, max: 0.65, publicReference: "$0.45 to $0.69 at public fast chargers" },
};

export const SERVICE_FEE_PERCENT = 0;
export const MAX_SESSION_HOURS = 24;

export const priceBandFor = (connector: ConnectorType): PriceBand => (CONNECTORS[connector].dc ? PRICE_BANDS.dc : PRICE_BANDS.ac);

export const money = (value: number): number => Math.round(value * 100) / 100;

export interface AddonRequest {
  amenityId: string;
  quantity: number;
}

export interface QuoteInput {
  listing: Listing;
  start: Date;
  end: Date;
  estimatedKwh: number;
  addons?: AddonRequest[];
}

export function maxDeliverableKwh(powerKw: number, durationHours: number): number {
  return Math.floor(powerKw * durationHours * 10) / 10;
}

export function buildQuote({ listing, start, end, estimatedKwh, addons = [] }: QuoteInput): Result<Quote> {
  const durationHours = (end.getTime() - start.getTime()) / 3_600_000;
  if (durationHours <= 0) return fail({ end: "End time must be after the start time." });
  if (durationHours > MAX_SESSION_HOURS) return fail({ end: "A session can be at most 24 hours." });
  if (durationHours > listing.maxSessionHours) {
    return fail({ end: `This host allows sessions of up to ${listing.maxSessionHours} hours.` });
  }
  if (!Number.isFinite(estimatedKwh) || estimatedKwh < 1) return fail({ estimatedKwh: "Estimate at least 1 kWh." });

  const maxKwh = maxDeliverableKwh(listing.powerKw, durationHours);
  if (estimatedKwh > maxKwh) {
    return fail({ estimatedKwh: `A ${listing.powerKw} kW charger delivers at most ${maxKwh} kWh in this time.` });
  }

  const lines = resolveAddons(listing, addons);
  if (!lines.ok) return lines;

  const pricePerKwh = Math.min(listing.pricePerKwh, priceBandFor(listing.connector).max);
  const energyCost = money(pricePerKwh * estimatedKwh);
  const addonsCost = money(lines.value.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0));
  const serviceFee = money(((energyCost + addonsCost) * SERVICE_FEE_PERCENT) / 100);

  return ok({
    durationHours: Math.round(durationHours * 100) / 100,
    maxDeliverableKwh: maxKwh,
    estimatedKwh,
    pricePerKwh,
    energyCost,
    addonsCost,
    serviceFee,
    total: money(energyCost + addonsCost + serviceFee),
    addons: lines.value,
  });
}

function resolveAddons(listing: Listing, requests: AddonRequest[]): Result<AddonLine[]> {
  const wanted = requests.filter((r) => r.quantity > 0);
  const ids = wanted.map((r) => r.amenityId);
  if (new Set(ids).size !== ids.length) return fail({ addons: "Each extra may only appear once." });

  const lines: AddonLine[] = [];
  for (const request of wanted) {
    const amenity = listing.amenities.find((a) => a.id === request.amenityId);
    if (!amenity) return fail({ addons: "One of the extras is not offered at this charger." });
    lines.push({ amenityId: amenity.id, name: amenity.name, unitPrice: amenity.price, quantity: request.quantity });
  }
  return ok(lines);
}
