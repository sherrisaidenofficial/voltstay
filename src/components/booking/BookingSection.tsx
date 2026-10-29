import type { ReactNode } from "react";

export function BookingSection({ title, empty, children, count }: { title: string; empty: string; count: number; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}{count > 0 && <span className="ml-2 text-base font-normal text-muted-foreground tabular">{count}</span>}</h2>
      <div className="mt-4 space-y-3">
        {count === 0 ? <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">{empty}</p> : children}
      </div>
    </section>
  );
}
