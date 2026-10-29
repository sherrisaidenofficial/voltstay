import type { Metadata } from "next";

import { TripsView } from "@/components/booking/TripsView";

export const metadata: Metadata = { title: "Trips" };

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Your trips</h1>
      <p className="mt-2 text-muted-foreground">Confirmed bookings show the host&apos;s address and how to get to the charger.</p>
      <div className="mt-8"><TripsView /></div>
    </div>
  );
}
