import Link from "next/link";

import { ListingCard } from "@/components/listing/ListingCard";
import { repository } from "@/data/repository";
import { DEFAULT_FILTERS, searchListings } from "@/domain/search";

export function FeaturedListings() {
  const results = searchListings(repository.listings(), DEFAULT_FILTERS, repository.reviewsFor, repository.city).slice(0, 6);
  return (
    <section aria-labelledby="featured-heading">
      <div className="flex items-end justify-between gap-4">
        <h2 id="featured-heading" className="text-2xl font-bold">Well-reviewed this month</h2>
        <Link href="/search" className="text-sm font-semibold text-current underline-offset-4 hover:underline">See all chargers</Link>
      </div>
      <div className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <ListingCard key={r.listing.id} result={r} />
        ))}
      </div>
    </section>
  );
}
