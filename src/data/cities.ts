import type { City, CityId } from "@/domain/types";

export const CITIES: City[] = [
  { id: "seattle", name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, corridorIndex: 0 },
  { id: "portland", name: "Portland", state: "OR", lat: 45.5152, lng: -122.6784, corridorIndex: 1 },
  { id: "san-francisco", name: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, corridorIndex: 2 },
  { id: "oakland", name: "Oakland", state: "CA", lat: 37.8044, lng: -122.2712, corridorIndex: 3 },
  { id: "san-jose", name: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863, corridorIndex: 4 },
  { id: "los-angeles", name: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437, corridorIndex: 5 },
  { id: "san-diego", name: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611, corridorIndex: 6 },
];

export const CITY_BY_ID: Record<CityId, City> = Object.fromEntries(CITIES.map((c) => [c.id, c])) as Record<CityId, City>;

export function isCityId(value: string | null | undefined): value is CityId {
  return !!value && value in CITY_BY_ID;
}
