"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ListingPhoto } from "@/components/listing/ListingPhoto";
import { Button } from "@/components/ui/button";
import { repository } from "@/data/repository";
import type { BookingAction, Role } from "@/domain/booking";
import { formatMoney, formatTimeRange } from "@/domain/format";
import type { Booking } from "@/domain/types";
import { useBookings } from "@/store/bookings";

import { StatusBadge } from "./StatusBadge";

const ACTION_LABELS: Record<BookingAction, string> = {
  confirm: "Accept",
  decline: "Decline",
  cancel: "Cancel booking",
  complete: "Mark completed",
};

interface Props {
  booking: Booking;
  role: Role;
  counterpartName: string;
}

export function BookingCard({ booking, role, counterpartName }: Props) {
  const store = useBookings();
  const [error, setError] = useState("");
  const listing = repository.listing(booking.listingId);
  if (!listing) return null;
  const city = repository.city(listing.cityId);
  const actions = store.actionsFor(booking, role);
  const revealAddress = booking.status === "confirmed" || booking.status === "completed";

  function run(action: BookingAction) {
    const result = store.act(booking.id, action, role);
    setError(result.ok ? "" : Object.values(result.errors)[0]);
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row">
      <Link href={`/chargers/${listing.id}`} className="shrink-0">
        <ListingPhoto tone={listing.tone} className="aspect-[4/3] w-full rounded-lg sm:w-40" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/chargers/${listing.id}`} className="block truncate font-semibold hover:underline">{listing.title}</Link>
            <p className="text-sm text-muted-foreground">{listing.neighbourhood}, {city.name}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <p className="mt-2 text-sm tabular">{formatTimeRange(booking.start, booking.end)}</p>
        <p className="text-sm text-muted-foreground">
          {role === "guest" ? `Host: ${counterpartName}` : `Driver: ${counterpartName}`}
          {booking.vehicle && `, ${booking.vehicle}`}
          {" · "}
          {booking.quote.estimatedKwh} kWh
          {booking.quote.addons.length > 0 && `, ${booking.quote.addons.map((a) => (a.quantity > 1 ? `${a.quantity} × ${a.name}` : a.name)).join(", ")}`}
        </p>
        {booking.guestNote && <p className="mt-2 rounded-md bg-secondary px-3 py-2 text-sm">“{booking.guestNote}”</p>}
        {role === "guest" && revealAddress && (
          <div className="mt-3 flex gap-2 rounded-md bg-kelp-soft p-3 text-sm text-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-kelp" aria-hidden />
            <div>
              <p className="font-semibold">{listing.address}</p>
              <p className="text-muted-foreground">{listing.accessInstructions}</p>
            </div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-bold tabular">{formatMoney(booking.quote.total)}<span className="font-normal text-muted-foreground"> {role === "guest" ? "to pay the host" : "you receive"}</span></p>
          {actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((action) => (
                <Button key={action} size="sm" variant={action === "confirm" || action === "complete" ? "default" : "outline"} onClick={() => run(action)}>
                  {ACTION_LABELS[action]}
                </Button>
              ))}
            </div>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </article>
  );
}
