"use client";

import { Info, Minus, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_GUEST } from "@/data/session";
import { addMinutes, atTime, availableStartTimes } from "@/domain/availability";
import { holdsSlot, toRange } from "@/domain/booking";
import { formatClock, formatDuration, formatMoney, formatRate, toDateInput } from "@/domain/format";
import { buildQuote, maxDeliverableKwh } from "@/domain/pricing";
import type { FieldErrors } from "@/domain/result";
import type { Booking, Listing } from "@/domain/types";
import { useBookings } from "@/store/bookings";

import { QuoteSummary } from "./QuoteSummary";

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const button = "grid size-7 place-items-center rounded-full border bg-card transition hover:bg-muted disabled:opacity-40";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= 0} aria-label={`Remove ${label}`}><Minus className="size-3.5" /></button>
      <span className="w-4 text-center text-sm tabular">{value}</span>
      <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= 10} aria-label={`Add ${label}`}><Plus className="size-3.5" /></button>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;
}

export function BookingWidget({ listing }: { listing: Listing }) {
  const store = useBookings();
  if (!store.ready) return <div className="h-96 animate-pulse rounded-xl bg-muted" aria-hidden />;
  return <BookingForm listing={listing} />;
}

function BookingForm({ listing }: { listing: Listing }) {
  const store = useBookings();
  const today = toDateInput(new Date());
  const [date, setDate] = useState(today);
  const [durationMin, setDurationMin] = useState(60);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [kwhInput, setKwhInput] = useState<string | null>(null);
  const [addons, setAddons] = useState<Record<string, number>>({});
  const [vehicle, setVehicle] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [created, setCreated] = useState<Booking | null>(null);

  const booked = useMemo(() => store.forListing(listing.id).filter(holdsSlot).map(toRange), [store, listing.id]);
  const slots = useMemo(() => availableStartTimes(listing, date, durationMin, booked), [listing, date, durationMin, booked]);
  const start = startTime && slots.includes(startTime) ? startTime : slots[0] ?? null;

  const maxKwh = maxDeliverableKwh(listing.powerKw, durationMin / 60);
  const kwh = kwhInput ?? String(Math.max(1, Math.min(maxKwh, 40)));
  const durations = Array.from({ length: listing.maxSessionHours * 2 }, (_, i) => (i + 1) * 30);
  const extras = listing.amenities.filter((a) => a.price > 0);

  const quote = useMemo(() => {
    if (!start) return null;
    const from = atTime(date, start);
    return buildQuote({
      listing,
      start: from,
      end: addMinutes(from, durationMin),
      estimatedKwh: Number(kwh),
      addons: Object.entries(addons).map(([amenityId, quantity]) => ({ amenityId, quantity })),
    });
  }, [listing, date, start, durationMin, kwh, addons]);

  function submit() {
    if (!start) return;
    const from = atTime(date, start);
    const result = store.create({
      listing,
      guest: DEMO_GUEST,
      start: from,
      end: addMinutes(from, durationMin),
      estimatedKwh: Number(kwh),
      addons: Object.entries(addons).map(([amenityId, quantity]) => ({ amenityId, quantity })),
      vehicle,
      guestNote: note,
    });
    if (result.ok) {
      setErrors({});
      setCreated(result.value);
    } else {
      setErrors(result.errors);
    }
  }

  const durationItems = durations.map((d) => ({ value: String(d), label: formatDuration(d) }));
  const slotItems = slots.map((s) => ({ value: s, label: formatClock(s) }));

  return (
    <div className="rounded-xl border bg-card p-6 shadow-[0_1px_2px_rgba(14,26,43,0.06),0_16px_40px_-20px_rgba(14,26,43,0.25)]">
      <p className="text-2xl font-bold tabular">{formatRate(listing.pricePerKwh)}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        {listing.instantBook ? (
          <><Zap className="size-4 fill-current text-volt" aria-hidden /> Confirmed as soon as you book</>
        ) : (
          <><Info className="size-4" aria-hidden /> The host confirms each request</>
        )}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label htmlFor="bk-date">Date</Label>
          <Input id="bk-date" type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className="mt-1 bg-background" />
        </div>
        <div>
          <Label htmlFor="bk-duration">Duration</Label>
          <Select items={durationItems} value={String(durationMin)} onValueChange={(v) => setDurationMin(Number(v))}>
            <SelectTrigger id="bk-duration" className="mt-1 w-full bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>{durationItems.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bk-start">Start</Label>
          {slots.length ? (
            <Select items={slotItems} value={start} onValueChange={(v) => setStartTime(String(v))}>
              <SelectTrigger id="bk-start" className="mt-1 w-full bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>{slotItems.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          ) : (
            <p id="bk-start" className="mt-1 flex h-8 items-center text-sm text-muted-foreground">No free slots this day</p>
          )}
          <FieldError message={errors.start} />
        </div>
        <div className="col-span-2">
          <Label htmlFor="bk-kwh">Energy you expect to use</Label>
          <div className="relative mt-1">
            <Input id="bk-kwh" type="number" min={1} max={maxKwh} step={1} value={kwh} onChange={(e) => setKwhInput(e.target.value)} className="bg-background pr-12 tabular" />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">kWh</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Up to {maxKwh} kWh fits in {formatDuration(durationMin)} at {listing.powerKw} kW.</p>
          <FieldError message={errors.estimatedKwh ?? errors.end} />
        </div>
      </div>

      {extras.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold">Extras from the host</p>
          <ul className="mt-2 space-y-2">
            {extras.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <span>{a.name} <span className="text-muted-foreground tabular">{formatMoney(a.price)}</span></span>
                <Stepper label={a.name} value={addons[a.id] ?? 0} onChange={(v) => setAddons((prev) => ({ ...prev, [a.id]: v }))} />
              </li>
            ))}
          </ul>
          <FieldError message={errors.addons} />
        </div>
      )}

      <div className="mt-5 space-y-3">
        <div>
          <Label htmlFor="bk-vehicle">Your car</Label>
          <Input id="bk-vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Kia EV6, Model 3, Ioniq 5…" className="mt-1 bg-background" />
        </div>
        <div>
          <Label htmlFor="bk-note">Note to the host</Label>
          <Textarea id="bk-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Arrival time, adapter you are bringing, anything they should know." className="mt-1 min-h-20 bg-background" />
        </div>
      </div>

      <div className="mt-5 border-t pt-4">
        {quote?.ok ? <QuoteSummary quote={quote.value} /> : <p className="text-sm text-muted-foreground">{quote ? Object.values(quote.errors)[0] : "Pick a date and time to see the price."}</p>}
      </div>

      <Button size="lg" className="mt-5 h-11 w-full bg-volt text-base text-white hover:bg-volt/90" disabled={!quote?.ok} onClick={submit}>
        {listing.instantBook ? "Book this slot" : "Request this slot"}
      </Button>
      <FieldError message={errors.listing ?? errors.status} />
      <p className="mt-3 text-center text-xs text-muted-foreground">You pay the host directly at the charger. No fee from Voltstay.</p>

      <Dialog open={!!created} onOpenChange={(open) => !open && setCreated(null)}>
        <DialogContent>
          <DialogTitle>{created?.status === "confirmed" ? "You are booked in" : "Request sent to the host"}</DialogTitle>
          <DialogDescription>
            {created?.status === "confirmed"
              ? "The host's address and access notes are now on your trip page."
              : "You will see the host's answer on your trips page. Most hosts reply within a couple of hours."}
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreated(null)}>Stay here</Button>
            <Button nativeButton={false} render={<Link href="/trips" />}>Go to my trips</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
