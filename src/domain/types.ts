
export type ConnectorType = "j1772" | "nacs" | "ccs1" | "chademo";

export interface ConnectorInfo {
  label: string;
  short: string;
  dc: boolean;
}

export const CONNECTORS: Record<ConnectorType, ConnectorInfo> = {
  j1772: { label: "J1772 (Level 2 AC)", short: "J1772", dc: false },
  nacs: { label: "NACS / Tesla", short: "NACS", dc: false },
  ccs1: { label: "CCS1 (DC fast)", short: "CCS1", dc: true },
  chademo: { label: "CHAdeMO (DC fast)", short: "CHAdeMO", dc: true },
};

export type CityId = "seattle" | "portland" | "san-francisco" | "oakland" | "san-jose" | "los-angeles" | "san-diego";

export interface City {
  id: CityId;
  name: string;
  state: "WA" | "OR" | "CA";
  lat: number;
  lng: number;
  corridorIndex: number;
}

export interface Host {
  id: string;
  name: string;
  initials: string;
  bio: string;
  joined: string;
  responseHours: number;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface AvailabilityWindow {
  weekday: number;
  start: string; // "HH:MM"
  end: string; // "HH:MM", "24:00" means midnight
}

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  cityId: CityId;
  neighbourhood: string;
  address: string;
  accessInstructions: string;
  lat: number;
  lng: number;
  connector: ConnectorType;
  powerKw: number;
  pricePerKwh: number;
  maxSessionHours: number;
  instantBook: boolean;
  amenities: Amenity[];
  availability: AvailabilityWindow[];
  tone: number;
}

export interface Review {
  id: string;
  listingId: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;
}

export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled" | "completed";

export interface AddonLine {
  amenityId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Quote {
  durationHours: number;
  maxDeliverableKwh: number;
  estimatedKwh: number;
  pricePerKwh: number;
  energyCost: number;
  addonsCost: number;
  serviceFee: number;
  total: number;
  addons: AddonLine[];
}

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;
  start: string;
  end: string;
  vehicle: string;
  guestNote: string;
  status: BookingStatus;
  quote: Quote;
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
}
