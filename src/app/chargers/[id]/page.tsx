import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Lock, Zap } from "lucide-react";

import { BookingWidget } from "@/components/booking/BookingWidget";
import { AmenityList } from "@/components/listing/AmenityList";
import { HoursTable } from "@/components/listing/HoursTable";
import { ListingPhoto } from "@/components/listing/ListingPhoto";
import { Rating } from "@/components/listing/Rating";
import { ReviewList } from "@/components/listing/ReviewList";
import { Separator } from "@/components/ui/separator";
import { repository } from "@/data/repository";
import { formatKw } from "@/domain/format";
import { ratingFor } from "@/domain/search";
import { CONNECTORS } from "@/domain/types";

export function generateStaticParams() {
  return repository.listings().map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/chargers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const listing = repository.listing(id);
  return { title: listing?.title ?? "Charger not found" };
}

export default async function ListingPage({ params }: PageProps<"/chargers/[id]">) {
  const { id } = await params;
  const listing = repository.listing(id);
  if (!listing) notFound();

  const host = repository.host(listing.hostId);
  const city = repository.city(listing.cityId);
  const reviews = repository.reviewsFor(listing.id);
  const rating = ratingFor(reviews);
  const connector = CONNECTORS[listing.connector];

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href={`/search?city=${city.id}`} className="hover:text-foreground">{city.name}, {city.state}</Link> / {listing.neighbourhood}
      </p>
      <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{listing.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <Rating rating={rating} withCount />
        <span className="text-muted-foreground">{connector.label}</span>
        <span className="text-muted-foreground">{formatKw(listing.powerKw)}</span>
        {listing.instantBook && <span className="inline-flex items-center gap-1 font-semibold text-current"><Zap className="size-3.5 fill-current" aria-hidden />Instant book</span>}
      </div>

      <ListingPhoto tone={listing.tone} className="mt-6 aspect-[21/9] rounded-2xl" />

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-10">
          <section className="flex items-start gap-4">
            <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{host?.initials}</span>
            <div>
              <h2 className="font-semibold">Hosted by {host?.name}</h2>
              <p className="text-sm text-muted-foreground">Hosting since {host && new Date(host.joined).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}. Usually replies within {host?.responseHours} {host?.responseHours === 1 ? "hour" : "hours"}.</p>
              <p className="mt-2 text-sm">{host?.bio}</p>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold">About this charger</h2>
            <p className="mt-3 max-w-prose leading-relaxed">{listing.description}</p>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
              <div><dt className="text-muted-foreground">Connector</dt><dd className="font-semibold">{connector.label}</dd></div>
              <div><dt className="text-muted-foreground">Power</dt><dd className="font-semibold">{formatKw(listing.powerKw)}</dd></div>
              <div><dt className="text-muted-foreground">Longest session</dt><dd className="font-semibold">{listing.maxSessionHours} hours</dd></div>
            </dl>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold">What you get</h2>
            <div className="mt-4"><AmenityList amenities={listing.amenities} /></div>
          </section>

          <Separator />

          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold"><Clock className="size-5" aria-hidden />Hours</h2>
            <div className="mt-4"><HoursTable windows={listing.availability} /></div>
          </section>

          <section className="flex gap-3 rounded-xl bg-secondary p-4 text-sm">
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>The exact address and access notes are shared on your trip page once the booking is confirmed. Until then you see the neighbourhood only.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-bold">Reviews</h2>
            <div className="mt-4"><ReviewList reviews={reviews} /></div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <BookingWidget listing={listing} />
        </aside>
      </div>
    </article>
  );
}
