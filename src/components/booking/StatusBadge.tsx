import { STATUS_LABELS } from "@/domain/booking";
import type { BookingStatus } from "@/domain/types";
import { cn } from "@/lib/utils";

const TONES: Record<BookingStatus, string> = {
  pending: "bg-signal-soft text-signal",
  confirmed: "bg-kelp-soft text-kelp",
  completed: "bg-secondary text-foreground",
  declined: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold", TONES[status], className)}>
      {STATUS_LABELS[status]}
    </span>
  );
}
