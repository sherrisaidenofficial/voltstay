import { PRICE_BANDS } from "@/domain/pricing";
import { formatRate } from "@/domain/format";

const STEPS = [
  { title: "Pick a charger near where you will be", body: "Filter by city and connector. Every listing shows the real power, the price per kWh and the host's hours." },
  { title: "Book a slot and tell the host what you drive", body: "Instant-book chargers confirm straight away. Others go to the host, who answers within a few hours." },
  { title: "Plug in, and order a coffee if you like", body: "You pay the host's price for the energy you use, plus any extras you add. Voltstay takes no fee during the pilot." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="grid gap-10 lg:grid-cols-[1fr_minmax(0,320px)]">
      <div>
        <h2 id="how-heading" className="text-2xl font-bold">How a booking works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular">{i + 1}</span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <aside className="rounded-xl border bg-card p-5 text-sm">
        <h3 className="font-semibold">What hosts may charge</h3>
        <dl className="mt-3 space-y-3">
          {Object.values(PRICE_BANDS).map((band) => (
            <div key={band.label}>
              <dt className="flex justify-between gap-3">
                <span>{band.label}</span>
                <span className="font-semibold tabular">{formatRate(band.min)} to {formatRate(band.max)}</span>
              </dt>
              <dd className="text-muted-foreground">Public reference: {band.publicReference}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  );
}
