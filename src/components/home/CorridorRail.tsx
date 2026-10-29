import Link from "next/link";

import { repository } from "@/data/repository";

export function CorridorRail() {
  const cities = [...repository.cities()].sort((a, b) => a.corridorIndex - b.corridorIndex);
  const counts = new Map<string, number>();
  for (const l of repository.listings()) counts.set(l.cityId, (counts.get(l.cityId) ?? 0) + 1);

  return (
    <nav aria-label="Cities along Interstate 5" className="relative">
      <p className="mb-4 text-sm text-muted-foreground">Interstate 5, north to south</p>
      <ol className="relative ml-2 border-l-2 border-volt/30">
        {cities.map((city) => {
          const count = counts.get(city.id) ?? 0;
          return (
            <li key={city.id} className="relative pl-6 not-last:pb-5">
              <span aria-hidden className="absolute -left-[7px] top-1.5 size-3 rounded-full border-2 border-volt bg-background" />
              <Link href={`/search?city=${city.id}`} className="group flex items-baseline justify-between gap-4 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <span className="font-semibold group-hover:text-volt">
                  {city.name} <span className="font-normal text-muted-foreground">{city.state}</span>
                </span>
                <span className="text-sm text-muted-foreground tabular">{count} {count === 1 ? "charger" : "chargers"}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
