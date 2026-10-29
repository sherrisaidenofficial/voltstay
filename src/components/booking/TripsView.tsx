"use client";

import Link from "next/link";

import { repository } from "@/data/repository";
import { DEMO_GUEST } from "@/data/session";
import { useNow } from "@/lib/use-now";
import { useBookings } from "@/store/bookings";

import { BookingCard } from "./BookingCard";
import { BookingSection } from "./BookingSection";

export function TripsView() {
  const store = useBookings();
  const now = useNow();
  if (!store.ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" aria-hidden />;

  const mine = store.byGuest(DEMO_GUEST.id).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  const upcoming = mine.filter((b) => (b.status === "pending" || b.status === "confirmed") && Date.parse(b.end) > now);
  const past = mine.filter((b) => !upcoming.includes(b)).reverse();
  const hostName = (hostId: string) => repository.host(hostId)?.name ?? "Host";

  return (
    <div className="space-y-12">
      <BookingSection title="Coming up" count={upcoming.length} empty="Nothing booked yet. Find a charger and pick a slot.">
        {upcoming.map((b) => <BookingCard key={b.id} booking={b} role="guest" counterpartName={hostName(b.hostId)} />)}
      </BookingSection>
      <BookingSection title="Past and cancelled" count={past.length} empty="Your completed charges will show up here.">
        {past.map((b) => <BookingCard key={b.id} booking={b} role="guest" counterpartName={hostName(b.hostId)} />)}
      </BookingSection>
      <p className="text-sm text-muted-foreground">Signed in as {DEMO_GUEST.name} for this demo. <Link href="/search" className="text-current underline-offset-4 hover:underline">Book another charger</Link>.</p>
    </div>
  );
}
