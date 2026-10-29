import { formatMoney, formatRate } from "@/domain/format";
import type { Quote } from "@/domain/types";

export function QuoteSummary({ quote }: { quote: Quote }) {
  return (
    <dl className="space-y-1.5 text-sm tabular">
      <div className="flex justify-between gap-3">
        <dt className="text-muted-foreground">{quote.estimatedKwh} kWh at {formatRate(quote.pricePerKwh)}</dt>
        <dd>{formatMoney(quote.energyCost)}</dd>
      </div>
      {quote.addons.map((line) => (
        <div key={line.amenityId} className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{line.name}{line.quantity > 1 && ` × ${line.quantity}`}</dt>
          <dd>{formatMoney(line.unitPrice * line.quantity)}</dd>
        </div>
      ))}
      {quote.serviceFee > 0 && (
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Service fee</dt>
          <dd>{formatMoney(quote.serviceFee)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-3 border-t pt-2 text-base font-bold">
        <dt>Total</dt>
        <dd>{formatMoney(quote.total)}</dd>
      </div>
    </dl>
  );
}
