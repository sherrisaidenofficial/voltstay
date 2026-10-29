import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo />
        <p>Home charging shared between neighbours. Demo build with sample data only.</p>
      </div>
    </footer>
  );
}
