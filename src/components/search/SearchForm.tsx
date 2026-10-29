"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { repository } from "@/data/repository";
import { toSearchParams, type SearchFilters } from "@/domain/search";
import { CONNECTORS, type CityId, type ConnectorType } from "@/domain/types";
import { cn } from "@/lib/utils";

const ANY = "any";

interface Props {
  initial?: Partial<SearchFilters>;
  size?: "lg" | "md";
  className?: string;
}

export function SearchForm({ initial = {}, size = "lg", className }: Props) {
  const router = useRouter();
  const [cityId, setCityId] = useState<string>(initial.cityId ?? ANY);
  const [connector, setConnector] = useState<string>(initial.connector ?? ANY);
  const large = size === "lg";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = toSearchParams({
      ...initial,
      instantOnly: initial.instantOnly ?? false,
      sort: initial.sort ?? "recommended",
      cityId: cityId === ANY ? undefined : (cityId as CityId),
      connector: connector === ANY ? undefined : (connector as ConnectorType),
    });
    router.push(`/search${params.size ? `?${params}` : ""}`);
  }

  const cityItems = [
    { value: ANY, label: "Anywhere on the coast" },
    ...repository.cities().map((c) => ({ value: c.id, label: `${c.name}, ${c.state}` })),
  ];
  const connectorItems = [
    { value: ANY, label: "Any connector" },
    ...(Object.keys(CONNECTORS) as ConnectorType[]).map((k) => ({ value: k, label: CONNECTORS[k].label })),
  ];

  const cellLarge = large ? "py-3 sm:py-3.5" : "py-2";
  const valueLarge = large ? "text-base" : "text-sm";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col gap-1 rounded-2xl bg-card p-1.5 shadow-[0_1px_2px_rgba(14,26,43,0.06),0_12px_32px_-12px_rgba(14,26,43,0.18)] ring-1 ring-border/60 sm:flex-row sm:items-stretch sm:gap-0",
        className,
      )}
    >
      <SearchCell
        id="search-city"
        label="Where"
        items={cityItems}
        value={cityId}
        onChange={setCityId}
        className={cn("flex-1", cellLarge)}
        valueClassName={valueLarge}
      />
      <span aria-hidden className="mx-1 hidden w-px self-stretch bg-border/70 sm:block" />
      <SearchCell
        id="search-connector"
        label="Connector"
        items={connectorItems}
        value={connector}
        onChange={setConnector}
        className={cn("flex-1", cellLarge)}
        valueClassName={valueLarge}
      />
      <Button
        type="submit"
        size="lg"
        className={cn(
          "mt-1 w-full rounded-xl bg-volt text-white hover:bg-volt/90 focus-visible:ring-volt/40 sm:mt-0 sm:w-auto",
          large ? "h-11 px-5 text-sm sm:h-auto sm:min-w-40 sm:self-stretch sm:text-[15px]" : "h-10",
        )}
      >
        <Search aria-hidden />
        Find chargers
      </Button>
    </form>
  );
}

interface CellProps {
  id: string;
  label: string;
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  valueClassName?: string;
}

function SearchCell({ id, label, items, value, onChange, className, valueClassName }: CellProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl px-4 transition-colors hover:bg-secondary/60 focus-within:bg-secondary/80",
        className,
      )}
    >
      <label htmlFor={id} className="pointer-events-none block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select items={items} value={value} onValueChange={(v) => onChange(String(v))}>
        <SelectTrigger
          id={id}
          className={cn(
            "mt-0.5 h-auto w-full justify-between gap-2 border-0 bg-transparent !p-0 font-medium text-foreground shadow-none focus-visible:border-transparent focus-visible:ring-0 data-[placeholder]:text-foreground [&>svg]:text-muted-foreground",
            valueClassName,
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
