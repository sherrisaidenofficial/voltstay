import { Star } from "lucide-react";

import type { Rating as RatingValue } from "@/domain/search";
import { cn } from "@/lib/utils";

export function Rating({ rating, withCount = false, className }: { rating: RatingValue; withCount?: boolean; className?: string }) {
  if (rating.average === null) return <span className={cn("text-sm text-muted-foreground", className)}>New</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm tabular", className)}>
      <Star className="size-3.5 fill-current" aria-hidden />
      <span className="font-semibold">{rating.average.toFixed(1)}</span>
      {withCount && <span className="text-muted-foreground">({rating.count} {rating.count === 1 ? "review" : "reviews"})</span>}
    </span>
  );
}
