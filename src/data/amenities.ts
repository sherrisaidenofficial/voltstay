import type { Amenity } from "@/domain/types";

export const AMENITY_CATALOG = {
  wifi: { id: "wifi", name: "Wi-Fi", description: "Fast home Wi-Fi while you wait", price: 0 },
  restroom: { id: "restroom", name: "Restroom", description: "Guest bathroom inside", price: 0 },
  covered: { id: "covered", name: "Covered parking", description: "Carport or garage bay", price: 0 },
  seating: { id: "seating", name: "Outdoor seating", description: "Patio or porch to sit on", price: 0 },
  dogs: { id: "dogs", name: "Dog-friendly yard", description: "Fenced yard your dog can use", price: 0 },
  water: { id: "water", name: "Filtered water", description: "Refill your bottle", price: 0 },
  coffee: { id: "coffee", name: "Coffee", description: "Pour-over or espresso, made fresh", price: 4 },
  pastry: { id: "pastry", name: "Pastry", description: "From the bakery down the street", price: 5 },
  snackbox: { id: "snackbox", name: "Snack box", description: "Trail mix, fruit and a bar", price: 6 },
  meal: { id: "meal", name: "Home-cooked meal", description: "Whatever is on the stove tonight", price: 15 },
  wash: { id: "wash", name: "Hand car wash", description: "Exterior wash while you charge", price: 25 },
  tyres: { id: "tyres", name: "Tyre pressure top-up", description: "Checked and filled", price: 0 },
  bikes: { id: "bikes", name: "Loaner bikes", description: "Two cruisers for a lap of the neighbourhood", price: 8 },
} satisfies Record<string, Amenity>;

export type AmenityKey = keyof typeof AMENITY_CATALOG;

export function amenities(...keys: AmenityKey[]): Amenity[] {
  return keys.map((k) => AMENITY_CATALOG[k]);
}
