"use client";

import { Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toSearchParams, type SearchFilters, type SortKey } from "@/domain/search";
import { cn } from "@/lib/utils";

const ANY = "any";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price", label: "Lowest price" },
  { value: "power", label: "Highest power" },
  { value: "rating", label: "Best rated" },
];

const PRICES = [
  { value: ANY, label: "Any price" },
  { value: "0.3", label: "Up to $0.30/kWh" },
  { value: "0.4", label: "Up to $0.40/kWh" },
  { value: "0.5", label: "Up to $0.50/kWh" },
];

const POWERS = [
  { value: ANY, label: "Any power" },
  { value: "7", label: "7 kW and up" },
  { value: "11", label: "11 kW and up" },
  { value: "20", label: "DC fast, 20 kW and up" },
];

export function Filters({ filters }: { filters: SearchFilters }) {
  const router = useRouter();
  const pathname = usePathname();

  function update(patch: Partial<SearchFilters>) {
    const params = toSearchParams({ ...filters, ...patch });
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  const trigger = "h-9 min-w-36 bg-card";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select items={PRICES} value={filters.maxPrice ? String(filters.maxPrice) : ANY} onValueChange={(v) => update({ maxPrice: v === ANY ? undefined : Number(v) })}>
        <SelectTrigger aria-label="Maximum price" className={trigger}><SelectValue /></SelectTrigger>
        <SelectContent>{PRICES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
      <Select items={POWERS} value={filters.minPowerKw ? String(filters.minPowerKw) : ANY} onValueChange={(v) => update({ minPowerKw: v === ANY ? undefined : Number(v) })}>
        <SelectTrigger aria-label="Minimum power" className={trigger}><SelectValue /></SelectTrigger>
        <SelectContent>{POWERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
      <button
        type="button"
        aria-pressed={filters.instantOnly}
        onClick={() => update({ instantOnly: !filters.instantOnly })}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors",
          filters.instantOnly ? "border-volt bg-volt-soft text-volt" : "bg-card text-foreground hover:bg-muted",
        )}
      >
        <Zap className={cn("size-3.5", filters.instantOnly && "fill-current")} aria-hidden />
        Instant book
      </button>
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        <span>Sort</span>
        <Select items={SORTS} value={filters.sort} onValueChange={(v) => update({ sort: v as SortKey })}>
          <SelectTrigger aria-label="Sort results" className={trigger}><SelectValue /></SelectTrigger>
          <SelectContent>{SORTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}
