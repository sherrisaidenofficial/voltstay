import type { Host } from "@/domain/types";

export const HOSTS: Host[] = [
  { id: "h-maya", name: "Maya Lindqvist", initials: "ML", bio: "Ballard homeowner with a Model Y and a spare wall connector. Happy to chat ferries and hikes.", joined: "2025-03-14", responseHours: 1 },
  { id: "h-devon", name: "Devon Okafor", initials: "DO", bio: "Runs a small coffee roastery from the garage. You get a cortado with every charge.", joined: "2025-05-02", responseHours: 2 },
  { id: "h-priya", name: "Priya Raman", initials: "PR", bio: "Software engineer in Bernal Heights. The charger is on the driveway, the cat is on the porch.", joined: "2025-01-21", responseHours: 1 },
  { id: "h-luis", name: "Luis Herrera", initials: "LH", bio: "Retired electrician. Installed every charger on this street, including mine.", joined: "2024-11-08", responseHours: 3 },
  { id: "h-aiko", name: "Aiko Tanaka", initials: "AT", bio: "Silver Lake bungalow, two EVs, lots of shade. Dogs welcome in the yard.", joined: "2025-06-30", responseHours: 1 },
  { id: "h-sam", name: "Sam Whitfield", initials: "SW", bio: "North Park duplex with a covered carport. Surf racks available if you ask.", joined: "2025-02-11", responseHours: 2 },
];

export const HOST_BY_ID: Record<string, Host> = Object.fromEntries(HOSTS.map((h) => [h.id, h]));
