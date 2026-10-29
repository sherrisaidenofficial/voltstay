// Data seeded by Claude intentionally for the MVP. Replace with real records before launch.

import type { AvailabilityWindow, Listing } from "@/domain/types";

import { amenities } from "./amenities";

const daily = (start: string, end: string): AvailabilityWindow[] =>
  [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, start, end }));

const weekdays = (start: string, end: string): AvailabilityWindow[] =>
  [0, 1, 2, 3, 4].map((weekday) => ({ weekday, start, end }));

const weekends = (start: string, end: string): AvailabilityWindow[] =>
  [5, 6].map((weekday) => ({ weekday, start, end }));

const GATE = "Pull into the driveway and text when you arrive. The charger is mounted on the left wall.";

export const LISTINGS: Listing[] = [
  {
    id: "sea-ballard-wall", hostId: "h-maya", cityId: "seattle", neighbourhood: "Ballard",
    title: "Ballard driveway, Tesla wall connector", address: "NW 65th St, Seattle, WA 98117",
    description: "Quiet residential block ten minutes from the locks. Dedicated driveway bay with a 48 A wall connector. Bring an adapter if you are not driving a Tesla.",
    accessInstructions: GATE, lat: 47.6762, lng: -122.3826, connector: "nacs", powerKw: 11.5, pricePerKwh: 0.32,
    maxSessionHours: 6, instantBook: true, amenities: amenities("wifi", "restroom", "seating", "coffee"), availability: daily("07:00", "22:00"), tone: 212,
  },
  {
    id: "sea-capitol-hill-j1772", hostId: "h-devon", cityId: "seattle", neighbourhood: "Capitol Hill",
    title: "Capitol Hill garage with a roastery next door", address: "E Olive Way, Seattle, WA 98122",
    description: "Detached garage behind the house. The roastery runs mornings, so expect good smells and a cortado on the house if you book before noon.",
    accessInstructions: "Alley entrance off E Olive Way. The garage code is shared once your booking is confirmed.", lat: 47.6205, lng: -122.3212,
    connector: "j1772", powerKw: 7.2, pricePerKwh: 0.28, maxSessionHours: 8, instantBook: false,
    amenities: amenities("wifi", "covered", "coffee", "pastry"), availability: [...weekdays("06:00", "21:00"), ...weekends("08:00", "23:00")], tone: 24,
  },
  {
    id: "sea-fremont-ccs", hostId: "h-luis", cityId: "seattle", neighbourhood: "Fremont",
    title: "Fremont 25 kW DC fast on a quiet street", address: "N 36th St, Seattle, WA 98103",
    description: "A small DC unit I installed for my own fleet of two. Fast enough for a real top-up over lunch at the brewery across the road.",
    accessInstructions: GATE, lat: 47.6513, lng: -122.3507, connector: "ccs1", powerKw: 25, pricePerKwh: 0.46,
    maxSessionHours: 3, instantBook: true, amenities: amenities("tyres", "water", "seating"), availability: daily("08:00", "20:00"), tone: 160,
  },
  {
    id: "pdx-alberta-j1772", hostId: "h-devon", cityId: "portland", neighbourhood: "Alberta Arts",
    title: "Alberta bungalow with a shaded carport", address: "NE Alberta St, Portland, OR 97211",
    description: "Carport on the side of the house, shaded all afternoon. Alberta Street cafes and galleries are a two minute walk.",
    accessInstructions: "Park under the carport. Charger hangs on the post nearest the house.", lat: 45.5590, lng: -122.6488,
    connector: "j1772", powerKw: 9.6, pricePerKwh: 0.26, maxSessionHours: 8, instantBook: true,
    amenities: amenities("covered", "wifi", "dogs", "bikes"), availability: daily("07:00", "23:00"), tone: 95,
  },
  {
    id: "pdx-sellwood-nacs", hostId: "h-luis", cityId: "portland", neighbourhood: "Sellwood",
    title: "Sellwood driveway by the river path", address: "SE 13th Ave, Portland, OR 97202",
    description: "End of a dead-end street beside the Springwater path. Good for a long walk or ride while the car fills up.",
    accessInstructions: GATE, lat: 45.4647, lng: -122.6530, connector: "nacs", powerKw: 11.5, pricePerKwh: 0.30,
    maxSessionHours: 6, instantBook: false, amenities: amenities("seating", "water", "bikes", "tyres"), availability: daily("06:00", "22:00"), tone: 200,
  },
  {
    id: "sf-bernal-driveway", hostId: "h-priya", cityId: "san-francisco", neighbourhood: "Bernal Heights",
    title: "Bernal Heights driveway, city views", address: "Cortland Ave, San Francisco, CA 94110",
    description: "Steep driveway, flat parking pad at the top. The porch looks over the Mission and the cat will supervise your charge.",
    accessInstructions: "Driveway is steep; take it slow. Charger is on the pad to your right.", lat: 37.7390, lng: -122.4160,
    connector: "j1772", powerKw: 7.2, pricePerKwh: 0.38, maxSessionHours: 6, instantBook: true,
    amenities: amenities("wifi", "restroom", "seating", "coffee"), availability: [...weekdays("17:00", "24:00"), ...weekends("08:00", "24:00")], tone: 330,
  },
  {
    id: "sf-sunset-nacs", hostId: "h-priya", cityId: "san-francisco", neighbourhood: "Outer Sunset",
    title: "Outer Sunset garage two blocks from the beach", address: "Judah St, San Francisco, CA 94122",
    description: "Garage bay with the door left open for you. Surf check at Ocean Beach while you top up.",
    accessInstructions: "Garage door will be open for your slot. Pull in nose-first.", lat: 37.7605, lng: -122.5075,
    connector: "nacs", powerKw: 11.5, pricePerKwh: 0.36, maxSessionHours: 5, instantBook: false,
    amenities: amenities("covered", "water", "wifi"), availability: daily("07:00", "22:00"), tone: 190,
  },
  {
    id: "oak-rockridge-ccs", hostId: "h-luis", cityId: "oakland", neighbourhood: "Rockridge",
    title: "Rockridge 50 kW DC fast with a courtyard", address: "College Ave, Oakland, CA 94618",
    description: "A proper 50 kW unit behind a four-plex. Courtyard seating and a bakery on the corner. Popular with Bay Area road trippers.",
    accessInstructions: "Enter through the side gate; code shared after confirmation.", lat: 37.8440, lng: -122.2516,
    connector: "ccs1", powerKw: 50, pricePerKwh: 0.49, maxSessionHours: 2, instantBook: true,
    amenities: amenities("seating", "pastry", "coffee", "tyres"), availability: daily("07:00", "23:00"), tone: 40,
  },
  {
    id: "oak-temescal-j1772", hostId: "h-devon", cityId: "oakland", neighbourhood: "Temescal",
    title: "Temescal backyard charger and vegetable garden", address: "Telegraph Ave, Oakland, CA 94609",
    description: "Charger on the back fence beside the raised beds. Help yourself to tomatoes in season.",
    accessInstructions: GATE, lat: 37.8328, lng: -122.2620, connector: "j1772", powerKw: 7.2, pricePerKwh: 0.29,
    maxSessionHours: 8, instantBook: true, amenities: amenities("dogs", "water", "seating", "snackbox"), availability: daily("08:00", "21:00"), tone: 120,
  },
  {
    id: "sj-willow-glen-nacs", hostId: "h-priya", cityId: "san-jose", neighbourhood: "Willow Glen",
    title: "Willow Glen driveway near Lincoln Avenue", address: "Lincoln Ave, San Jose, CA 95125",
    description: "Wide driveway, easy in and out. Lincoln Avenue restaurants are a five minute walk.",
    accessInstructions: GATE, lat: 37.3045, lng: -121.8990, connector: "nacs", powerKw: 11.5, pricePerKwh: 0.31,
    maxSessionHours: 6, instantBook: true, amenities: amenities("wifi", "water", "restroom"), availability: daily("06:00", "23:00"), tone: 260,
  },
  {
    id: "sj-japantown-chademo", hostId: "h-luis", cityId: "san-jose", neighbourhood: "Japantown",
    title: "Japantown CHAdeMO for Leaf drivers", address: "Jackson St, San Jose, CA 95112",
    description: "One of the few private CHAdeMO units in the South Bay. Jackson Street ramen is a short walk away.",
    accessInstructions: "Charger is in the side yard. Gate is unlocked during your slot.", lat: 37.3486, lng: -121.8946,
    connector: "chademo", powerKw: 20, pricePerKwh: 0.44, maxSessionHours: 3, instantBook: false,
    amenities: amenities("seating", "water", "tyres"), availability: daily("09:00", "21:00"), tone: 350,
  },
  {
    id: "la-silver-lake-nacs", hostId: "h-aiko", cityId: "los-angeles", neighbourhood: "Silver Lake",
    title: "Silver Lake bungalow with a shaded yard", address: "Sunset Blvd, Los Angeles, CA 90026",
    description: "Two EV household so the charger is always ready. Yard is fenced and shaded by a big jacaranda.",
    accessInstructions: "Driveway behind the hedge. Charger on the garage wall.", lat: 34.0869, lng: -118.2702,
    connector: "nacs", powerKw: 11.5, pricePerKwh: 0.34, maxSessionHours: 6, instantBook: true,
    amenities: amenities("dogs", "wifi", "seating", "coffee", "snackbox"), availability: daily("07:00", "23:00"), tone: 300,
  },
  {
    id: "la-pasadena-ccs", hostId: "h-aiko", cityId: "los-angeles", neighbourhood: "Pasadena",
    title: "Pasadena 25 kW DC under a carport", address: "E Colorado Blvd, Pasadena, CA 91106",
    description: "Covered DC fast unit off Colorado Boulevard. Old Town restaurants within walking distance.",
    accessInstructions: GATE, lat: 34.1458, lng: -118.1263, connector: "ccs1", powerKw: 25, pricePerKwh: 0.47,
    maxSessionHours: 3, instantBook: true, amenities: amenities("covered", "water", "restroom"), availability: daily("08:00", "22:00"), tone: 20,
  },
  {
    id: "la-santa-monica-j1772", hostId: "h-sam", cityId: "los-angeles", neighbourhood: "Santa Monica",
    title: "Santa Monica garage a block from the beach path", address: "Ocean Park Blvd, Santa Monica, CA 90405",
    description: "Garage bay with the ocean breeze. Walk to the beach path and come back to a full battery.",
    accessInstructions: "Garage on the alley side. Door is open during your slot.", lat: 34.0045, lng: -118.4830,
    connector: "j1772", powerKw: 7.2, pricePerKwh: 0.40, maxSessionHours: 6, instantBook: false,
    amenities: amenities("covered", "wifi", "bikes", "water"), availability: [...weekdays("08:00", "20:00"), ...weekends("07:00", "22:00")], tone: 205,
  },
  {
    id: "la-highland-park-wash", hostId: "h-sam", cityId: "los-angeles", neighbourhood: "Highland Park",
    title: "Highland Park driveway with a hand car wash", address: "York Blvd, Los Angeles, CA 90042",
    description: "Charge and leave with a clean car. My son runs a hand wash on weekends and will do yours while you wait.",
    accessInstructions: GATE, lat: 34.1105, lng: -118.1920, connector: "j1772", powerKw: 9.6, pricePerKwh: 0.30,
    maxSessionHours: 5, instantBook: true, amenities: amenities("wash", "seating", "water", "snackbox"), availability: daily("08:00", "20:00"), tone: 55,
  },
  {
    id: "sd-north-park-nacs", hostId: "h-sam", cityId: "san-diego", neighbourhood: "North Park",
    title: "North Park carport with surf racks", address: "30th St, San Diego, CA 92104",
    description: "Covered carport behind a duplex. Breweries and taco shops up and down 30th Street.",
    accessInstructions: "Alley entrance. Carport is the second on the left.", lat: 32.7458, lng: -117.1296,
    connector: "nacs", powerKw: 11.5, pricePerKwh: 0.33, maxSessionHours: 6, instantBook: true,
    amenities: amenities("covered", "wifi", "water", "coffee"), availability: daily("07:00", "23:00"), tone: 185,
  },
  {
    id: "sd-la-jolla-ccs", hostId: "h-aiko", cityId: "san-diego", neighbourhood: "La Jolla",
    title: "La Jolla 50 kW DC near the cove", address: "Torrey Pines Rd, La Jolla, CA 92037",
    description: "Fast charger on the side of the house, ten minutes from the cove. Good for a quick stop on the way up to LA.",
    accessInstructions: GATE, lat: 32.8469, lng: -117.2736, connector: "ccs1", powerKw: 50, pricePerKwh: 0.52,
    maxSessionHours: 2, instantBook: false, amenities: amenities("water", "restroom", "seating"), availability: daily("07:00", "21:00"), tone: 230,
  },
  {
    id: "sd-ocean-beach-j1772", hostId: "h-maya", cityId: "san-diego", neighbourhood: "Ocean Beach",
    title: "Ocean Beach driveway with a home-cooked dinner", address: "Newport Ave, San Diego, CA 92107",
    description: "Family home a short walk from the pier. Dinner is whatever we are cooking; let us know about allergies in your note.",
    accessInstructions: GATE, lat: 32.7494, lng: -117.2470, connector: "j1772", powerKw: 7.2, pricePerKwh: 0.31,
    maxSessionHours: 8, instantBook: false, amenities: amenities("meal", "dogs", "seating", "wifi"), availability: daily("16:00", "24:00"), tone: 15,
  },
];
