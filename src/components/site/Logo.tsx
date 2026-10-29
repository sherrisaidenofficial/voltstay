import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
      <span aria-hidden className="grid size-7 place-items-center rounded-md bg-current-soft text-current">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M5 2v3M11 2v3M3.5 5h9v2.5a4.5 4.5 0 0 1-9 0V5ZM8 12v2.5" />
        </svg>
      </span>
      Voltstay
    </Link>
  );
}
