import { Check } from "lucide-react";

import { formatMoney } from "@/domain/format";
import type { Amenity } from "@/domain/types";

export function AmenityList({ amenities }: { amenities: Amenity[] }) {
  const included = amenities.filter((a) => a.price === 0);
  const extras = amenities.filter((a) => a.price > 0);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h3 className="font-semibold">Included</h3>
        <ul className="mt-2 space-y-1.5 text-sm">
          {included.length === 0 && <li className="text-muted-foreground">Just the charger.</li>}
          {included.map((a) => (
            <li key={a.id} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-kelp" aria-hidden /><span>{a.name}<span className="text-muted-foreground">, {a.description}</span></span></li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Extras you can order</h3>
        <ul className="mt-2 space-y-1.5 text-sm">
          {extras.length === 0 && <li className="text-muted-foreground">This host does not sell extras.</li>}
          {extras.map((a) => (
            <li key={a.id} className="flex justify-between gap-3"><span>{a.name}<span className="text-muted-foreground">, {a.description}</span></span><span className="shrink-0 tabular">{formatMoney(a.price)}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
