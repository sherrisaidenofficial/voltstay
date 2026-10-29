import type { Listing } from "@/domain/types";

export const listing: Listing = {
  id: "test-listing",
  hostId: "h-test",
  title: "Test charger",
  description: "",
  cityId: "seattle",
  neighbourhood: "Ballard",
  address: "1 Test St",
  accessInstructions: "",
  lat: 47.6,
  lng: -122.3,
  connector: "j1772",
  powerKw: 7.2,
  pricePerKwh: 0.3,
  maxSessionHours: 4,
  instantBook: false,
  amenities: [
    { id: "coffee", name: "Coffee", description: "", price: 4 },
    { id: "wifi", name: "Wi-Fi", description: "", price: 0 },
  ],
  availability: [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, start: "08:00", end: "20:00" })),
  tone: 0,
};

export const at = (date: string, hhmm: string): Date => {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = hhmm.split(":").map(Number);
  return new Date(y, m - 1, d, h, min);
};
