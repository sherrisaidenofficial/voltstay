import { CorridorRail } from "@/components/home/CorridorRail";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SearchForm } from "@/components/search/SearchForm";
import { repository } from "@/data/repository";

export default function HomePage() {
  const total = repository.listings().length;
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20 lg:py-20">
        <div>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Charge in someone&apos;s driveway, from Seattle to San Diego.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            {total} home chargers along the West Coast, listed by the people who live there. Book a slot, plug in, and pay the host&apos;s price for the energy you use.
          </p>
          <SearchForm className="mt-8" />
        </div>
        <CorridorRail />
      </section>

      <div className="space-y-20 pb-8">
        <FeaturedListings />
        <HowItWorks />
      </div>
    </div>
  );
}
