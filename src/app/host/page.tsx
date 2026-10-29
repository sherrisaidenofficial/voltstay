import type { Metadata } from "next";

import { HostDashboard } from "@/components/booking/HostDashboard";
import { repository } from "@/data/repository";
import { DEMO_HOST_ID } from "@/data/session";

export const metadata: Metadata = { title: "Hosting" };

export default function HostPage() {
  const host = repository.host(DEMO_HOST_ID);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Hosting</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {host?.name} for this demo. Answer requests, close finished sessions and keep an eye on your chargers.</p>
      <div className="mt-8"><HostDashboard /></div>
    </div>
  );
}
