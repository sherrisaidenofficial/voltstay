import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-bold">That page is not here.</h1>
      <p className="mt-2 text-muted-foreground">The charger may have been removed, or the link is wrong.</p>
      <Button nativeButton={false} render={<Link href="/search" />} className="mt-6">Browse chargers</Button>
    </div>
  );
}
