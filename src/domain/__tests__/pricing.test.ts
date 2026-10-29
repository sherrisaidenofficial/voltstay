import { describe, expect, it } from "vitest";

import { buildQuote, maxDeliverableKwh, PRICE_BANDS } from "@/domain/pricing";

import { at, listing } from "./fixtures";

describe("buildQuote", () => {
  it("prices energy plus extras", () => {
    const result = buildQuote({ listing, start: at("2030-01-07", "10:00"), end: at("2030-01-07", "12:00"), estimatedKwh: 10, addons: [{ amenityId: "coffee", quantity: 2 }] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.energyCost).toBe(3);
    expect(result.value.addonsCost).toBe(8);
    expect(result.value.total).toBe(11);
    expect(result.value.maxDeliverableKwh).toBe(14.4);
  });

  it("rejects more energy than the charger can deliver", () => {
    const result = buildQuote({ listing, start: at("2030-01-07", "10:00"), end: at("2030-01-07", "11:00"), estimatedKwh: 10 });
    expect(result).toMatchObject({ ok: false, errors: { estimatedKwh: expect.stringContaining("7.2 kW") } });
  });

  it("rejects sessions longer than the host allows", () => {
    const result = buildQuote({ listing, start: at("2030-01-07", "08:00"), end: at("2030-01-07", "14:00"), estimatedKwh: 10 });
    expect(result).toMatchObject({ ok: false, errors: { end: expect.stringContaining("4 hours") } });
  });

  it("rejects extras the host does not offer", () => {
    const result = buildQuote({ listing, start: at("2030-01-07", "10:00"), end: at("2030-01-07", "12:00"), estimatedKwh: 5, addons: [{ amenityId: "sauna", quantity: 1 }] });
    expect(result.ok).toBe(false);
  });

  it("clamps the rate to the price band ceiling", () => {
    const pricey = { ...listing, pricePerKwh: 9 };
    const result = buildQuote({ listing: pricey, start: at("2030-01-07", "10:00"), end: at("2030-01-07", "12:00"), estimatedKwh: 5 });
    expect(result.ok && result.value.pricePerKwh).toBe(PRICE_BANDS.ac.max);
  });
});

describe("maxDeliverableKwh", () => {
  it("rounds down to a tenth", () => {
    expect(maxDeliverableKwh(7.2, 0.5)).toBe(3.6);
    expect(maxDeliverableKwh(50, 1.25)).toBe(62.5);
  });
});
