"use client";

import Link from "next/link";

import { ListingPhoto } from "@/components/listing/ListingPhoto";
import { repository } from "@/data/repository";
import { DEMO_HOST_ID } from "@/data/session";
import { formatKw, formatMoney, formatRate } from "@/domain/format";
import { useNow } from "@/lib/use-now";
import { useBookings } from "@/store/bookings";
import { GUEST_NAMES } from "@/store/seed-bookings";

import { BookingCard } from "./BookingCard";
import { BookingSection } from "./BookingSection";

export function HostDashboard() {
  const store = useBookings();
  const now = useNow();
  const host = repository.host(DEMO_HOST_ID);
  const listings = repository.listingsByHost(DEMO_HOST_ID);
  if (!store.ready || !host) return <div className="h-64 animate-pulse rounded-xl bg-muted" aria-hidden />;

  const all = store.byHost(DEMO_HOST_ID).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  const requests = all.filter((b) => b.status === "pending");
  const upcoming = all.filter((b) => b.status === "confirmed" && Date.parse(b.end) > now);
  const toComplete = all.filter((b) => b.status === "confirmed" && Date.parse(b.end) <= now);
  const history = all.filter((b) => !requests.includes(b) && !upcoming.includes(b) && !toComplete.includes(b)).reverse();
  const earned = all.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.quote.total, 0);
  const guestName = (id: string) => GUEST_NAMES[id] ?? "Driver";

  return (
    <div className="space-y-12">
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Requests waiting", value: String(requests.length) },
          { label: "Upcoming sessions", value: String(upcoming.length) },
          { label: "Earned so far", value: formatMoney(earned) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tabular">{stat.value}</p>
          </div>
        ))}
      </section>

      <BookingSection title="Requests to answer" count={requests.length} empty="No new requests. Instant-book chargers confirm on their own.">
        {requests.map((b) => <BookingCard key={b.id} booking={b} role="host" counterpartName={guestName(b.guestId)} />)}
      </BookingSection>

      {toComplete.length > 0 && (
        <BookingSection title="Finished sessions to close" count={toComplete.length} empty="">
          {toComplete.map((b) => <BookingCard key={b.id} booking={b} role="host" counterpartName={guestName(b.guestId)} />)}
        </BookingSection>
      )}

      <BookingSection title="Upcoming" count={upcoming.length} empty="Nothing booked yet.">
        {upcoming.map((b) => <BookingCard key={b.id} booking={b} role="host" counterpartName={guestName(b.guestId)} />)}
      </BookingSection>

      <section>
        <h2 className="text-xl font-bold">Your chargers</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {listings.map((l) => (
            <li key={l.id} className="flex min-w-0 gap-4 rounded-xl border bg-card p-3">
              <ListingPhoto tone={l.tone} className="aspect-square w-20 rounded-lg" />
              <div className="min-w-0">
                <Link href={`/chargers/${l.id}`} className="block truncate font-semibold hover:underline">{l.title}</Link>
                <p className="text-sm text-muted-foreground">{repository.city(l.cityId).name}, {formatKw(l.powerKw)}, {formatRate(l.pricePerKwh)}</p>
                <p className="text-sm text-muted-foreground">{l.instantBook ? "Instant book on" : "You approve each request"}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <BookingSection title="History" count={history.length} empty="Completed, declined and cancelled bookings land here.">
        {history.map((b) => <BookingCard key={b.id} booking={b} role="host" counterpartName={guestName(b.guestId)} />)}
      </BookingSection>
    </div>
  );
}
