import type { City, CityId, ConnectorType, Listing, Review } from "./types";
import { CONNECTORS } from "./types";

export type SortKey = "recommended" | "price" | "power" | "rating";

export interface SearchFilters {
  cityId?: CityId;
  connector?: ConnectorType;
  maxPrice?: number;
  minPowerKw?: number;
  instantOnly: boolean;
  sort: SortKey;
}

export interface Rating {
  average: number | null;
  count: number;
}

export interface SearchResult {
  listing: Listing;
  rating: Rating;
  distanceKm: number | null;
}

export const DEFAULT_FILTERS: SearchFilters = { instantOnly: false, sort: "recommended" };

export function parseFilters(params: URLSearchParams, isCity: (v: string | null) => v is CityId): SearchFilters {
  const city = params.get("city");
  const connector = params.get("connector");
  const maxPrice = Number(params.get("max_price"));
  const minPower = Number(params.get("min_kw"));
  const sort = params.get("sort");
  return {
    cityId: isCity(city) ? city : undefined,
    connector: connector && connector in CONNECTORS ? (connector as ConnectorType) : undefined,
    maxPrice: maxPrice > 0 ? maxPrice : undefined,
    minPowerKw: minPower > 0 ? minPower : undefined,
    instantOnly: params.get("instant") === "1",
    sort: sort === "price" || sort === "power" || sort === "rating" ? sort : "recommended",
  };
}

export function toSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.cityId) params.set("city", filters.cityId);
  if (filters.connector) params.set("connector", filters.connector);
  if (filters.maxPrice) params.set("max_price", String(filters.maxPrice));
  if (filters.minPowerKw) params.set("min_kw", String(filters.minPowerKw));
  if (filters.instantOnly) params.set("instant", "1");
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  return params;
}

export function ratingFor(reviews: Review[]): Rating {
  if (reviews.length === 0) return { average: null, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length };
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)) * 10) / 10;
}

export function searchListings(
  listings: Listing[],
  filters: SearchFilters,
  reviewsFor: (listingId: string) => Review[],
  cityFor: (id: CityId) => City,
): SearchResult[] {
  const origin = filters.cityId ? cityFor(filters.cityId) : null;
  const results = listings
    .filter((l) => !filters.cityId || l.cityId === filters.cityId)
    .filter((l) => !filters.connector || l.connector === filters.connector)
    .filter((l) => !filters.maxPrice || l.pricePerKwh <= filters.maxPrice)
    .filter((l) => !filters.minPowerKw || l.powerKw >= filters.minPowerKw)
    .filter((l) => !filters.instantOnly || l.instantBook)
    .map((listing) => ({
      listing,
      rating: ratingFor(reviewsFor(listing.id)),
      distanceKm: origin ? haversineKm(origin, listing) : null,
    }));

  const score = (r: SearchResult) => (r.rating.average ?? 3.5) * r.rating.count + (r.listing.instantBook ? 1 : 0);
  const comparators: Record<SortKey, (a: SearchResult, b: SearchResult) => number> = {
    recommended: (a, b) => score(b) - score(a) || (a.distanceKm ?? 0) - (b.distanceKm ?? 0),
    price: (a, b) => a.listing.pricePerKwh - b.listing.pricePerKwh,
    power: (a, b) => b.listing.powerKw - a.listing.powerKw,
    rating: (a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0) || b.rating.count - a.rating.count,
  };
  return results.sort(comparators[filters.sort]);
}
