import type { City, CityId, Host, Listing, Review } from "@/domain/types";

import { CITIES, CITY_BY_ID } from "./cities";
import { HOST_BY_ID } from "./hosts";
import { LISTINGS } from "./listings";
import { REVIEWS } from "./reviews";

export const repository = {
  listings(): Listing[] {
    return LISTINGS;
  },
  listing(id: string): Listing | undefined {
    return LISTINGS.find((l) => l.id === id);
  },
  listingsByHost(hostId: string): Listing[] {
    return LISTINGS.filter((l) => l.hostId === hostId);
  },
  host(id: string): Host | undefined {
    return HOST_BY_ID[id];
  },
  city(id: CityId): City {
    return CITY_BY_ID[id];
  },
  cities(): City[] {
    return CITIES;
  },
  reviewsFor(listingId: string): Review[] {
    return REVIEWS.filter((r) => r.listingId === listingId);
  },
};
