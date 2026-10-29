import { formatClock, WEEKDAYS } from "@/domain/format";
import type { AvailabilityWindow } from "@/domain/types";

export function HoursTable({ windows }: { windows: AvailabilityWindow[] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
      {WEEKDAYS.map((day, i) => {
        const open = windows.filter((w) => w.weekday === i);
        return (
          <div key={day} className="contents">
            <dt className="text-muted-foreground">{day}</dt>
            <dd className="tabular">{open.length ? open.map((w) => `${formatClock(w.start)} to ${formatClock(w.end)}`).join(", ") : "Closed"}</dd>
          </div>
        );
      })}
    </dl>
  );
}
