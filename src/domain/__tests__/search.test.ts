import { describe, expect, it } from "vitest";

import { isCityId } from "@/data/cities";
import { repository } from "@/data/repository";
import { haversineKm, parseFilters, ratingFor, searchListings, toSearchParams } from "@/domain/search";

describe("filters", () => {
  it("round-trips through URL params", () => {
    const params = toSearchParams({ cityId: "seattle", connector: "ccs1", maxPrice: 0.5, minPowerKw: 20, instantOnly: true, sort: "price" });
    expect(parseFilters(params, isCityId)).toEqual({ cityId: "seattle", connector: "ccs1", maxPrice: 0.5, minPowerKw: 20, instantOnly: true, sort: "price" });
  });

  it("ignores unknown values", () => {
    const filters = parseFilters(new URLSearchParams("city=mars&connector=usb&sort=weird&max_price=-1"), isCityId);
    expect(filters).toEqual({ cityId: undefined, connector: undefined, maxPrice: undefined, minPowerKw: undefined, instantOnly: false, sort: "recommended" });
  });
});

describe("searchListings", () => {
  const run = (params: string) => searchListings(repository.listings(), parseFilters(new URLSearchParams(params), isCityId), repository.reviewsFor, repository.city);

  it("filters by city, connector, price, power and instant book", () => {
    expect(run("city=seattle").every((r) => r.listing.cityId === "seattle")).toBe(true);
    expect(run("connector=nacs").every((r) => r.listing.connector === "nacs")).toBe(true);
    expect(run("max_price=0.3").every((r) => r.listing.pricePerKwh <= 0.3)).toBe(true);
    expect(run("min_kw=20").every((r) => r.listing.powerKw >= 20)).toBe(true);
    expect(run("instant=1").every((r) => r.listing.instantBook)).toBe(true);
  });

  it("sorts by price ascending and power descending", () => {
    const prices = run("sort=price").map((r) => r.listing.pricePerKwh);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    const power = run("sort=power").map((r) => r.listing.powerKw);
    expect(power).toEqual([...power].sort((a, b) => b - a));
  });

  it("adds distance from downtown when a city is chosen", () => {
    expect(run("city=los-angeles").every((r) => r.distanceKm !== null)).toBe(true);
    expect(run("").every((r) => r.distanceKm === null)).toBe(true);
  });
});

describe("helpers", () => {
  it("averages ratings to one decimal", () => {
    expect(ratingFor([])).toEqual({ average: null, count: 0 });
    expect(ratingFor(repository.reviewsFor("sea-ballard-wall"))).toEqual({ average: 4.7, count: 3 });
  });

  it("measures Seattle to Portland at roughly 234 km", () => {
    expect(haversineKm(repository.city("seattle"), repository.city("portland"))).toBeCloseTo(234, -1);
  });
});
