"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { ListingCard } from "@/components/listing/ListingCard";
import { isCityId } from "@/data/cities";
import { repository } from "@/data/repository";
import { parseFilters, searchListings } from "@/domain/search";
import { CONNECTORS } from "@/domain/types";

import { Filters } from "./Filters";
import { SearchForm } from "./SearchForm";

export function SearchView() {
  const params = useSearchParams();
  const filters = useMemo(() => parseFilters(params, isCityId), [params]);
  const results = useMemo(() => searchListings(repository.listings(), filters, repository.reviewsFor, repository.city), [filters]);

  const place = filters.cityId ? repository.city(filters.cityId).name : "the West Coast";
  const connector = filters.connector ? ` with ${CONNECTORS[filters.connector].short}` : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <SearchForm key={`${filters.cityId}-${filters.connector}`} initial={filters} size="md" />
      <div className="mt-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          {results.length} {results.length === 1 ? "charger" : "chargers"} in {place}{connector}
        </h1>
        <Filters filters={filters} />
      </div>

      {results.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed p-10 text-center">
          <p className="font-semibold">No chargers match these filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a wider price range, a different connector, or <Link href="/search" className="text-current underline-offset-4 hover:underline">clear everything</Link>.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <li key={r.listing.id}><ListingCard result={r} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
