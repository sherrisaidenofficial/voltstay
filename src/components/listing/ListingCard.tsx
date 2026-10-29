import { Zap } from "lucide-react";
import Link from "next/link";

import { repository } from "@/data/repository";
import { formatKw, formatRate } from "@/domain/format";
import type { SearchResult } from "@/domain/search";
import { CONNECTORS } from "@/domain/types";

import { ListingPhoto } from "./ListingPhoto";
import { Rating } from "./Rating";

export function ListingCard({ result }: { result: SearchResult }) {
  const { listing, rating, distanceKm } = result;
  const city = repository.city(listing.cityId);
  return (
    <Link href={`/chargers/${listing.id}`} className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <ListingPhoto tone={listing.tone} label={formatKw(listing.powerKw)} className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
        {listing.instantBook && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-foreground">
            <Zap className="size-3 fill-current text-current" aria-hidden /> Instant book
          </span>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate font-semibold">{listing.title}</p>
          <Rating rating={rating} className="shrink-0" />
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {listing.neighbourhood}, {city.name}
          {distanceKm !== null && distanceKm > 0 && <> · {distanceKm} km from downtown</>}
        </p>
        <p className="text-sm text-muted-foreground">{CONNECTORS[listing.connector].short}, up to {listing.maxSessionHours} h sessions</p>
        <p className="pt-1 text-[15px]">
          <span className="font-bold tabular">{formatRate(listing.pricePerKwh)}</span>
        </p>
      </div>
    </Link>
  );
}
