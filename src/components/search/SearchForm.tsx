"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

  const cityItems = [{ value: ANY, label: "Anywhere on the coast" }, ...repository.cities().map((c) => ({ value: c.id, label: `${c.name}, ${c.state}` }))];
  const connectorItems = [{ value: ANY, label: "Any connector" }, ...(Object.keys(CONNECTORS) as ConnectorType[]).map((k) => ({ value: k, label: CONNECTORS[k].label }))];

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-2 rounded-2xl bg-card p-2 shadow-[0_1px_2px_rgba(14,26,43,0.06),0_12px_32px_-12px_rgba(14,26,43,0.18)] sm:flex-row sm:items-end", className)}>
      <div className="flex-1 px-3 py-1.5">
        <Label htmlFor="search-city" className="text-xs text-muted-foreground">Where</Label>
        <Select items={cityItems} value={cityId} onValueChange={(v) => setCityId(String(v))}>
          <SelectTrigger id="search-city" className={cn("mt-1 w-full border-0 bg-transparent px-0 shadow-none", large && "h-9 text-base")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cityItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 border-border px-3 py-1.5 sm:border-l">
        <Label htmlFor="search-connector" className="text-xs text-muted-foreground">Connector</Label>
        <Select items={connectorItems} value={connector} onValueChange={(v) => setConnector(String(v))}>
          <SelectTrigger id="search-connector" className={cn("mt-1 w-full border-0 bg-transparent px-0 shadow-none", large && "h-9 text-base")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {connectorItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="lg" className={cn("bg-volt text-white hover:bg-volt/90", large ? "h-12 px-5 text-base sm:min-w-36" : "h-10")}>
        <Search aria-hidden />
        Find chargers
      </Button>
    </form>
  );
}
