import { Star } from "lucide-react";

import type { Review } from "@/domain/types";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return <p className="text-sm text-muted-foreground">No reviews yet. Be the first to charge here.</p>;
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {reviews.map((r) => (
        <li key={r.id}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">{r.author}</p>
            <span className="inline-flex items-center gap-1 text-sm tabular"><Star className="size-3.5 fill-current" aria-hidden />{r.rating}</span>
          </div>
          <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}</p>
          <p className="mt-2 text-sm">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}
