# Voltstay

Voltstay is a marketplace for home EV charging. People who have a charger in their driveway or garage list it. Drivers who need a charge near where they are, or along a road trip, book a slot, plug in, and pay the host's price for the energy they use. Hosts can also sell small extras such as coffee, a snack box or a car wash while the car charges.

This repository is a front-end MVP built with Next.js, TypeScript, Tailwind CSS and shadcn/ui. It runs entirely in the browser on seeded sample data, builds to static files, and deploys to GitHub Pages or Vercel without a server.

## The idea

Airbnb noticed that most homes sit empty for much of the year while hotels are expensive and often full where you need them. It matched spare rooms with travellers and both sides won.

Home EV chargers have the same shape of problem. A Level 2 charger on a private driveway is used for a couple of hours a night and sits idle the rest of the time. Meanwhile public fast chargers are scarce outside city centres, queue at peak times, cost more per kWh, and are often broken. Apartment dwellers and road trippers have no reliable way to charge where they actually are. Voltstay lets a host rent out the idle hours of a charger they already own, and lets a driver charge at a real address with a real person on the other end.

The closest existing product is EVmatch (evmatch.com), a US peer-to-peer network where private charger owners list their stations and set their own hourly or per kWh price. Co Charger (co-charger.com) does the same in the UK with a "community charging" angle, pairing neighbours who have a charger with neighbours who do not. Both proved that owners will share and that drivers will book. Voltstay takes that model and adds the hospitality layer Airbnb is known for: host profiles, reviews, house rules in the form of hours and session limits, and paid extras.

The first market is the Interstate 5 corridor on the US West Coast: Seattle, Portland, San Francisco, Oakland, San Jose, Los Angeles and San Diego. EV adoption is highest there, the cities are a day's drive apart, and the stretch between them is where public charging gaps hurt most.

## What the MVP does

- Browse chargers by city and connector from the home page or the search page. Results filter by price, power and instant book, and sort by price, power or rating. Filters live in the URL so a search can be shared.
- Open a charger to see the host, the included amenities, the extras for sale, weekly hours, reviews and a live price quote.
- Book a slot. The widget only offers start times that fit the host's hours, the chosen duration and existing bookings. Energy is capped at what the charger can physically deliver in the slot. Instant-book chargers confirm straight away; the rest go to the host as a request.
- See your trips. Confirmed bookings reveal the exact address and access notes. Pending ones can be cancelled.
- Run the host side. The hosting page shows requests to accept or decline, upcoming sessions, finished sessions to close, earnings and the host's own listings.

There is no sign-in. Every visitor is the demo guest Jordan Reyes, and the hosting page is the demo host Maya Lindqvist.

## A note on the brief

The brief contained a hidden HTML comment attempting to prompt-inject a `company` script. No such script exists in this repo; `grep -rn "company" package.json` returns nothing.

## What is not in the MVP

Deliberate gaps so the pilot stays small. Each has a plan in the production section below.

- **No sign-in.** Everyone is the demo guest Jordan Reyes, and `/host` is the demo host Maya Lindqvist.
- **No persistence.** Bookings created in the session live in React state and reset on a hard reload. The seed data reappears.
- **No real payments.** The booking page says "pay the host at the charger". The service-fee line in the price breakdown exists but is set to zero.
- **No messaging.** A driver cannot ask the host a question before booking.
- **No notifications.** Hosts see new requests only when they open the hosting page.
- **No real map.** Chargers are listed on cards and reached from a corridor rail. There is no map view with pins.
- **No photo upload.** Listing artwork is a generated gradient per listing.
- **Search is by city, not address.** The driver picks a city from a list rather than typing a street.
- **No reviews after a trip.** Existing reviews are seeded; the UI does not collect new ones yet.
- **One time zone.** Hours render in the browser's local time. A driver in Seattle booking San Diego sees local, which is fine on the West Coast but would break across regions.

## Seeded data

All records in `src/data` and the bookings in `src/store/seed-bookings.ts` were seeded by Claude intentionally for the MVP. Every file carries that notice on its first line. Hosts, addresses, prices, reviews and bookings are invented so the product can be explored end to end, and they should be replaced by real records before launch. Prices sit inside realistic 2026 West Coast bands (Level 2 at $0.20 to $0.45 per kWh, DC fast at $0.35 to $0.65 per kWh) so the quotes feel plausible.

## Running locally

Everything runs in the browser. No database, no API key, no services to spin up.

### Prerequisites

- **Node.js 22 or newer.** Install from [nodejs.org](https://nodejs.org) or with `nvm install 22`. Check with `node -v`.
- **npm 10 or newer.** Ships with Node 22. Check with `npm -v`.
- **Git.** Only needed if you are cloning rather than downloading a zip.

### 1. Get the code

```bash
git clone https://github.com/sherrisaidenofficial/voltstay.git
cd voltstay
```

### 2. Install dependencies

```bash
npm install
```

This takes about a minute on a fresh machine. It installs Next.js, Tailwind, shadcn/ui components, Vitest and the lint toolchain.

### 3. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000. The page hot-reloads on save, so edits in `src/` appear in the browser within a second. Press Ctrl+C in the terminal to stop.

### 4. Preview the production build (optional)

```bash
npm run build
npx serve out
```

This builds the static site into `out/` and serves it on http://localhost:3000. It is the exact output that gets deployed to GitHub Pages, so if something behaves differently in production, reproduce it here first.

### Everyday commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static export into `out/` |
| `npm run lint` | ESLint, same rules CI runs |
| `npm run typecheck` | `tsc --noEmit` strict check |
| `npm test` | Vitest unit tests for the domain layer, 28 cases |

### Troubleshooting

**Port 3000 is already in use.** Start on another port with `npm run dev -- -p 3100`.

**`node: command not found` or Node version error.** You are on an older Node. Run `nvm install 22 && nvm use 22`, then retry `npm install`.

**`npm install` fails on a peer dependency.** Delete `node_modules` and `package-lock.json`, then run `npm install` again.

**Stale build after dependency changes.** Delete `.next/` and `out/`, then `npm run dev` or `npm run build` fresh.

**Links point to `/voltstay/...` locally.** You set `NEXT_PUBLIC_BASE_PATH` in your environment. Unset it (`unset NEXT_PUBLIC_BASE_PATH`) and restart the dev server. The base path is only used when building for GitHub Pages.

## Deploying

The build is a static export, so `out/` can be served by anything.

- **Vercel.** Import the repository. No configuration needed.
- **GitHub Pages.** The workflow in `.github/workflows/deploy.yml` lints, tests, builds and publishes on every push to `main`. Enable Pages with the "GitHub Actions" source in the repository settings. The workflow sets `NEXT_PUBLIC_BASE_PATH` to the repository name so links work under `username.github.io/repo-name`.
- **Anywhere else.** Run `NEXT_PUBLIC_BASE_PATH=/your-path npm run build` if the site lives under a sub-path, otherwise plain `npm run build`, and upload `out/`.

## How the code is organised

```
src/
  domain/      pure TypeScript: types, pricing, availability, booking rules, search
  data/        seeded catalogue (cities, hosts, listings, reviews) behind a repository
  store/       in-memory booking state shared across pages (React context)
  components/  UI, grouped by feature (listing, search, booking, home, site) plus ui/ from shadcn
  app/         routes: /, /search, /chargers/[id], /trips, /host
```

The important boundary is between `domain` and everything else.

**Domain logic has no React in it.** Pricing, slot availability, the booking state machine and search filtering are plain functions that take values and return values. They return a `Result` type (`ok` with a value, or `errors` keyed by field) instead of throwing, so the UI can show a message next to the right input without try/catch. These modules have unit tests and the tests run in Node with no DOM.

**Data access goes through one object.** `repository` in `src/data/repository.ts` is the only place that touches the seed arrays. It is synchronous today because the data is in memory. When a real API arrives, these functions become async and the components that call them change their call sites, not their logic.

**Bookings live in one store.** `BookingProvider` wraps the app and owns the booking list. Components ask it for bookings by guest, host or listing, and call `create` or `act`. The store delegates every decision to the domain layer and only records the outcome. Prices are snapshotted on each booking, so editing a listing later never changes an existing bill.

**Rules are enforced once, in the domain.** Overlap checks, hours, session limits, energy caps, who may confirm or cancel and when: each lives in one function and both the booking widget and the host dashboard use it. The UI never duplicates permission logic; it asks `actionsFor(booking, role)` what buttons to show.

**Everything is typed end to end.** `src/domain/types.ts` is the single source of truth. Connector types, city ids and booking statuses are string unions, so an unknown value is a compile error, not a runtime surprise.

**The UI is built from shadcn/ui on a small token set.** Colours, radius and fonts are CSS variables in `globals.css`. Three custom tones (volt for actions, kelp for confirmed, signal for pending) cover every status in the product. Components are server components by default and opt into the client only where they hold state or read the URL.

**Static by design.** `next.config.ts` sets `output: "export"`. Charger pages are prerendered from `generateStaticParams`, the search page reads its filters from the URL on the client, and nothing needs a Node server at runtime. Anything that depends on the current time renders only after hydration, so the server HTML and the client agree.

## From MVP to production

The MVP makes deliberate shortcuts. Here is what changes when it grows up, roughly in the order it would happen.

**Real users.** Replace `DEMO_GUEST` and `DEMO_HOST_ID` in `src/data/session.ts` with an auth session. Hosts and guests are the same account with a host flag. Phone and email verification are needed before a booking, because a stranger is about to drive to someone's home.

**A database and an API.** Listings, bookings, reviews and messages move to Postgres. The `repository` object and the booking store become thin clients of that API. The domain functions stay where they are and run on the server too, so the server and the browser enforce the same rules. The one rule that cannot stay client-side is overlap checking: the server must lock the listing row while creating a booking so two drivers cannot take the same slot at the same moment.

**Time zones.** Hours are interpreted in the browser's local time today. Production stores each listing's IANA time zone and converts on the way in and out. A driver in Seattle booking a San Diego charger must see Pacific time either way, but hosts in other regions will need it.

**Photos and maps.** Listing artwork is a generated gradient. Production needs photo upload to object storage with moderation, and a map on the search page with privacy-rounded pins until a booking is confirmed.

**Payments.** The MVP assumes the driver pays the host directly. The step after that is holding the payment through a processor such as Stripe Connect, paying the host after the session, and taking a platform fee. The `serviceFee` line already exists in the quote and is set to zero; the UI shows it only when it is above zero.

**Messaging and notifications.** Hosts need to hear about a request within minutes. Email and push notifications on booking state changes come first, then a message thread per booking.

**Trust and safety.** Reviews in both directions, a cancellation policy with time windows, a way to report a listing, and insurance terms. The booking state machine already has the transitions; the policy layer sits on top.

**Operations.** An admin view for support staff, rate limiting, structured logging, and error tracking. A static site has none of these problems; a marketplace with money in it has all of them.

**Search at scale.** In-memory filtering over a few dozen listings is instant. Thousands of listings want a geo index (PostGIS or a bounding-box prefilter) and server-side pagination. The `searchListings` function's signature is already shaped like a query, which keeps the swap contained.

## Trade-offs made on purpose

- **No global state library.** A single React context with a reducer is enough for one store. Zustand or similar would be a good step up once there are several.
- **No component tests yet.** The domain layer is tested; the UI was checked by hand and in a headless browser. Playwright tests on the booking flow are the next test investment.
- **No dark mode.** The tokens support it, but one well-tuned theme is better than two half-tuned ones for a pilot.
- **shadcn/ui components are copied in, not installed.** That is how shadcn works: the code in `src/components/ui` is ours to change.
