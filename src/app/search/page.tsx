import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchView } from "@/components/search/SearchView";

export const metadata: Metadata = { title: "Find a charger" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6">Loading chargers…</div>}>
      <SearchView />
    </Suspense>
  );
}
